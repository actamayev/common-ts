/* eslint-disable max-len, complexity, max-lines-per-function, max-depth */
import { INSTRUCTION_SIZE, MAX_JUMP_DISTANCE, MAX_LED_BRIGHTNESS, MAX_PROGRAM_SIZE, MAX_REGISTERS } from "../types/private/constants"
import { BytecodeOpCode, CommandType, ComparisonOp, LedID, SensorType, VarType } from "../types/public/bytecode-types"
import { CppParserHelper } from "./cpp-parser-helper"

export class CppParser {
	public static cppToByte(unsanitizedCpp: string): Float32Array {
		const sanitizedCode = CppParserHelper.sanitizeUserCode(unsanitizedCpp)
		const validationResult = CppParserHelper.validateBalancedSyntax(sanitizedCode)
		if (validationResult !== true) {
		  throw new Error(`Syntax error: ${validationResult}`)
		}
		const instructions = this.parseCppCode(sanitizedCode)

		if (instructions.length > MAX_PROGRAM_SIZE) {
		  throw new Error(`Program exceeds maximum size (${instructions.length} instructions, maximum is ${MAX_PROGRAM_SIZE})`)
		}

		const bytecode = CppParserHelper.generateBytecode(instructions)
		return bytecode
	}

	private static parseCppCode(cppCode: string): BytecodeInstruction[] {
		const instructions: BytecodeInstruction[] = []
		const variables: Map<string, VariableType> = new Map()
		let nextRegister = 0

		const protectedStatements = cppCode.split(";").map(s => s.trim()).filter(s => s.length > 0)

		// Now restore the semicolons in each statement
		const statements = protectedStatements.map(s => s.replace(/###SEMICOLON###/g, ";"))

		const blockStack: BlockStack[] = []
		const pendingJumps: PendingJumps[] = []

		for (const statement of statements) {
			const command = CppParserHelper.identifyCommand(statement)

			if (!command) {
				throw new Error(`Invalid command: "${statement}"`)
			}

			switch (command.type) {
			case CommandType.FOR_STATEMENT: {
				if (command.matches && command.matches.length === 4) {
					const varName = command.matches[1]
					const startValue = parseInt(command.matches[2], 10)
					const endValue = parseInt(command.matches[3], 10)

					// Assign register for loop counter
					if (nextRegister >= MAX_REGISTERS) {
						throw new Error(`Program exceeds maximum register count (${MAX_REGISTERS})`)
					}
					const register = nextRegister++
					variables.set(varName, {type: VarType.INT, register})

					// FOR_INIT: Initialize counter variable
					instructions.push({
						opcode: BytecodeOpCode.FOR_INIT,
						operand1: register,
						operand2: startValue & 0xFF,
						operand3: (startValue >> 8) & 0xFF,
						operand4: (startValue >> 16) & 0xFF
					})

					// Remember position for the condition check
					const forStartIndex = instructions.length

					// FOR_CONDITION: Check if counter < end value
					instructions.push({
						opcode: BytecodeOpCode.FOR_CONDITION,
						operand1: register,
						operand2: endValue & 0xFF,
						operand3: (endValue >> 8) & 0xFF,
						operand4: (endValue >> 16) & 0xFF
					})

					// Add jump-if-false to skip loop body when done
					const jumpIfFalseIndex = instructions.length
					instructions.push({
						opcode: BytecodeOpCode.JUMP_IF_FALSE,
						operand1: 0, // Will be filled later
						operand2: 0,
						operand3: 0,
						operand4: 0
					})

					// Track this for loop for later
					blockStack.push({
						type: "for",
						jumpIndex: jumpIfFalseIndex,
						varRegister: register,
						startIndex: forStartIndex
					})
				}
				break
			}

			case CommandType.WHILE_STATEMENT: {
				const whileStartIndex = instructions.length
				instructions.push({
					opcode: BytecodeOpCode.WHILE_START,
					operand1: 0,
					operand2: 0,
					operand3: 0,
					operand4: 0
				})

				// Track this while block for later
				blockStack.push({ type: "while", jumpIndex: whileStartIndex })
				break
			}

			case CommandType.VARIABLE_ASSIGNMENT:
				if (command.matches && command.matches.length === 4) {
					const varType = command.matches[1] // float, int, bool
					const varName = command.matches[2]
					const varValue = command.matches[3]

					// Convert type string to enum
					let typeEnum: VarType
					switch (varType) {
					case "float": typeEnum = VarType.FLOAT; break
					case "int": typeEnum = VarType.INT; break
					case "bool": typeEnum = VarType.BOOL; break
					default: throw new Error(`Unsupported type: ${varType}`)
					}

					// Assign register and store for future reference
					if (nextRegister >= MAX_REGISTERS) {
						throw new Error(`Program exceeds maximum register count (${MAX_REGISTERS})`)
					}
					const register = nextRegister++
					variables.set(varName, {type: typeEnum, register})

					// Generate DECLARE_VAR instruction
					instructions.push({
						opcode: BytecodeOpCode.DECLARE_VAR,
						operand1: register,
						operand2: typeEnum,
						operand3: 0,
						operand4: 0
					})

					// Check if value is a sensor reading
					const sensorMatch = varValue.match(/Sensors::getInstance\(\)\.(\w+)\(\)/)

					// Check if value is a proximity detection function
					const leftProximityMatch = varValue.match(/is_object_near_side_left\(\)/)
					const rightProximityMatch = varValue.match(/is_object_near_side_right\(\)/)
					const frontProximityMatch = varValue.match(/is_object_in_front\(\)/)

					if (sensorMatch) {
						// This is a sensor reading assignment
						const sensorMethod = sensorMatch[1]
						const sensorType = CppParserHelper.getSensorTypeFromMethod(sensorMethod)

						// Add instruction to read sensor into the register
						instructions.push({
							opcode: BytecodeOpCode.READ_SENSOR,
							operand1: sensorType,
							operand2: register,
							operand3: 0,
							operand4: 0
						})
					} else if (typeEnum === VarType.BOOL && (leftProximityMatch || rightProximityMatch || frontProximityMatch)) {
						// This is a proximity sensor assignment to a boolean
						let sensorType: SensorType

						if (leftProximityMatch) {
							sensorType = SensorType.SIDE_LEFT_PROXIMITY
						} else if (rightProximityMatch) {
							sensorType = SensorType.SIDE_RIGHT_PROXIMITY
						} else { // frontProximityMatch
							sensorType = SensorType.FRONT_PROXIMITY
						}

						// Add instruction to read proximity sensor into the register
						instructions.push({
							opcode: BytecodeOpCode.READ_SENSOR,
							operand1: sensorType,
							operand2: register,
							operand3: 0,
							operand4: 0
						})
					} else if (typeEnum === VarType.FLOAT) {
						const floatValue = parseFloat(varValue)
						if (isNaN(floatValue)) {
							throw new Error(`Invalid float value: ${varValue}`)
						}

						instructions.push({
							opcode: BytecodeOpCode.SET_VAR,
							operand1: register,
							operand2: floatValue,
							operand3: 0,
							operand4: 0
						})
					} else if (typeEnum === VarType.BOOL) {
						// Parse boolean value - handle both "true"/"false" and 1/0
						let boolValue: boolean
						if (varValue.trim().toLowerCase() === "true" || varValue.trim() === "1") {
							boolValue = true
						} else if (varValue.trim().toLowerCase() === "false" || varValue.trim() === "0") {
							boolValue = false
						} else {
							throw new Error(`Invalid boolean value: ${varValue}`)
						}

						instructions.push({
							opcode: BytecodeOpCode.SET_VAR,
							operand1: register,
							operand2: boolValue ? 1 : 0, // 1 for true, 0 for false
							operand3: 0,
							operand4: 0
						})
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					} else if (typeEnum === VarType.INT) {
						// Parse integer value
						const intValue = parseInt(varValue.trim(), 10)

						if (isNaN(intValue)) {
							throw new Error(`Invalid integer value: ${varValue}`)
						}

						instructions.push({
							opcode: BytecodeOpCode.SET_VAR,
							operand1: register,
							operand2: intValue,   // Direct assignment of the full value
							operand3: 0,          // Can use for extended range if needed
							operand4: 0           // Can use for extended range if needed
						})
					}
				}
				break

			case CommandType.TURN_LED_OFF:
				instructions.push({
					opcode: BytecodeOpCode.SET_ALL_LEDS,
					operand1: 0,
					operand2: 0,
					operand3: 0,
					operand4: 0
				})
				break

			case CommandType.SET_LED_RED:
				instructions.push({
					opcode: BytecodeOpCode.SET_ALL_LEDS,
					operand1: MAX_LED_BRIGHTNESS,
					operand2: 0,
					operand3: 0,
					operand4: 0
				})
				break

			case CommandType.SET_LED_GREEN:
				instructions.push({
					opcode: BytecodeOpCode.SET_ALL_LEDS,
					operand1: 0,
					operand2: MAX_LED_BRIGHTNESS,
					operand3: 0,
					operand4: 0
				})
				break

			case CommandType.SET_LED_BLUE:
				instructions.push({
					opcode: BytecodeOpCode.SET_ALL_LEDS,
					operand1: 0,
					operand2: 0,
					operand3: MAX_LED_BRIGHTNESS,
					operand4: 0
				})
				break

			case CommandType.SET_LED_WHITE:
				instructions.push({
					opcode: BytecodeOpCode.SET_ALL_LEDS,
					operand1: MAX_LED_BRIGHTNESS,
					operand2: MAX_LED_BRIGHTNESS,
					operand3: MAX_LED_BRIGHTNESS,
					operand4: 0
				})
				break

			case CommandType.SET_LED_PURPLE:
				instructions.push({
					opcode: BytecodeOpCode.SET_ALL_LEDS,
					operand1: MAX_LED_BRIGHTNESS,
					operand2: 0,
					operand3: MAX_LED_BRIGHTNESS,
					operand4: 0
				})
				break

			case CommandType.SET_ALL_LEDS:
				if (command.matches && command.matches.length === 4) {
					instructions.push({
						opcode: BytecodeOpCode.SET_ALL_LEDS,
						operand1: parseInt(command.matches[1], 10),
						operand2: parseInt(command.matches[2], 10),
						operand3: parseInt(command.matches[3], 10),
						operand4: 0
					})
				}
				break

			case CommandType.SET_TOP_LEFT_LED:
				CppParserHelper.handleIndividualLed(command.matches, LedID.TOP_LEFT, instructions)
				break

			case CommandType.SET_TOP_RIGHT_LED:
				CppParserHelper.handleIndividualLed(command.matches, LedID.TOP_RIGHT, instructions)
				break

			case CommandType.SET_MIDDLE_LEFT_LED:
				CppParserHelper.handleIndividualLed(command.matches, LedID.MIDDLE_LEFT, instructions)
				break

			case CommandType.SET_MIDDLE_RIGHT_LED:
				CppParserHelper.handleIndividualLed(command.matches, LedID.MIDDLE_RIGHT, instructions)
				break

			case CommandType.SET_BACK_LEFT_LED:
				CppParserHelper.handleIndividualLed(command.matches, LedID.BACK_LEFT, instructions)
				break

			case CommandType.SET_BACK_RIGHT_LED:
				CppParserHelper.handleIndividualLed(command.matches, LedID.BACK_RIGHT, instructions)
				break

			case CommandType.SET_LEFT_HEADLIGHT:
				CppParserHelper.handleIndividualLed(command.matches, LedID.LEFT_HEADLIGHT, instructions)
				break

			case CommandType.SET_RIGHT_HEADLIGHT:
				CppParserHelper.handleIndividualLed(command.matches, LedID.RIGHT_HEADLIGHT, instructions)
				break

			case CommandType.DELAY:
				if (command.matches && command.matches.length === 2) {
					const delayMs = parseInt(command.matches[1], 10)
					instructions.push({
						opcode: BytecodeOpCode.DELAY,
						operand1: delayMs,  // Direct assignment - no more bit masking!
						operand2: 0,
						operand3: 0,
						operand4: 0
					})
				}
				break

			case CommandType.IF_STATEMENT: {
				if (command.matches) {
					// Extract the condition inside the parentheses
					const fullIfStatement = command.matches[0]
					const conditionMatch = fullIfStatement.match(/^if\s*\(\s*(.*?)\s*\)$/)

					if (!conditionMatch) {
						throw new Error(`Invalid if statement: ${fullIfStatement}`)
					}

					const condition = conditionMatch[1]

					// Check if this is a comparison (has a comparison operator) or a simple condition
					const comparisonMatch = condition.match(/(.+?)([<>=!][=]?)(.+)/)

					if (comparisonMatch) {
					// This is a comparison expression
						const leftExpr = comparisonMatch[1].trim()
						const operator = comparisonMatch[2].trim()
						const rightExpr = comparisonMatch[3].trim()

						// Parse comparison operator
						const compOp = CppParserHelper.parseComparisonOperator(operator)

						// Process left and right operands
						const leftResult = CppParserHelper.processOperand(leftExpr, variables, nextRegister, instructions)
						nextRegister = leftResult.updatedNextRegister

						const rightResult = CppParserHelper.processOperand(rightExpr, variables, nextRegister, instructions)
						nextRegister = rightResult.updatedNextRegister

						// Add comparison instruction
						instructions.push({
							opcode: BytecodeOpCode.COMPARE,
							operand1: compOp,
							operand2: leftResult.operand,
							operand3: rightResult.operand,
							operand4: 0
						})
					} else {
					// This is a simple condition (variable, is_object_in_front(), etc.)
						const result = CppParserHelper.processOperand(condition, variables, nextRegister, instructions)
						nextRegister = result.updatedNextRegister

						// Add comparison with true
						instructions.push({
							opcode: BytecodeOpCode.COMPARE,
							operand1: ComparisonOp.EQUAL,
							operand2: result.operand,
							operand3: 1, // true
							operand4: 0
						})
					}

					// Add jump for if/else branching
					const jumpIndex = instructions.length
					instructions.push({
						opcode: BytecodeOpCode.JUMP_IF_FALSE,
						operand1: 0, // Will be filled later
						operand2: 0,
						operand3: 0,
						operand4: 0
					})

					// Track this block for later
					blockStack.push({ type: "if", jumpIndex })
				}
				break
			}

			case CommandType.BLOCK_START:
				// Nothing special for block start
				break

			case CommandType.BLOCK_END:
				if (blockStack.length > 0) {
					const block = blockStack.pop() as BlockStack

					if (block.type === "for") {
						// Add FOR_INCREMENT instruction
						instructions.push({
							opcode: BytecodeOpCode.FOR_INCREMENT,
							operand1: block.varRegister as number,
							operand2: 0,
							operand3: 0,
							operand4: 0
						})

						// Jump back to condition check
						const forEndIndex = instructions.length
						const offsetToStart = (forEndIndex - (block.startIndex as number)) * INSTRUCTION_SIZE

						if (offsetToStart > MAX_JUMP_DISTANCE) {
							throw new Error(`Jump distance in for loop too large (${offsetToStart} bytes, maximum is ${MAX_JUMP_DISTANCE} bytes)`)
						}

						instructions.push({
							opcode: BytecodeOpCode.JUMP_BACKWARD,
							operand1: offsetToStart,  // Direct assignment of the full offset
							operand2: 0,
							operand3: 0,
							operand4: 0
						})

						// Fix the jump-if-false at start to point here
						const offsetToHere = (instructions.length - block.jumpIndex) * INSTRUCTION_SIZE
						if (offsetToHere > MAX_JUMP_DISTANCE) {
							throw new Error(`Jump distance too large (${offsetToHere} bytes, maximum is ${MAX_JUMP_DISTANCE} bytes)`)
						}
						instructions[block.jumpIndex].operand1 = offsetToHere & 0xFF
						instructions[block.jumpIndex].operand2 = (offsetToHere >> 8) & 0xFF
					} else if (block.type === "while") {
						// Add a WHILE_END instruction that jumps back to the start
						const whileEndIndex = instructions.length

						// Calculate bytes to jump back (each instruction is 10 bytes)
						const offsetToStart = (whileEndIndex - block.jumpIndex) * INSTRUCTION_SIZE

						if (offsetToStart > MAX_JUMP_DISTANCE) {
							throw new Error(`Jump distance in while loop too large (${offsetToStart} bytes, maximum is ${MAX_JUMP_DISTANCE} bytes)`)
						}
						instructions.push({
							opcode: BytecodeOpCode.WHILE_END,
							operand1: offsetToStart & 0xFF, // Low byte
							operand2: (offsetToStart >> 8) & 0xFF, // High byte
							operand3: 0,
							operand4: 0
						})
					} else if (block.type === "if") {
						// Check if there's an "else" coming next
						const nextStatementIndex = statements.indexOf(statement) + 1
						const hasElseNext = nextStatementIndex < statements.length &&
											statements[nextStatementIndex].trim() === "else"

						if (hasElseNext) {
							// Calculate offset to the else block
							const offsetToElseBlock = (instructions.length + 1 - block.jumpIndex) * INSTRUCTION_SIZE

							if (offsetToElseBlock > MAX_JUMP_DISTANCE) {
								throw new Error(`Jump distance too large (${offsetToElseBlock} bytes, maximum is ${MAX_JUMP_DISTANCE} bytes)`)
							}
							// Update main jump index
							instructions[block.jumpIndex].operand1 = offsetToElseBlock & 0xFF
							instructions[block.jumpIndex].operand2 = (offsetToElseBlock >> 8) & 0xFF

							// Fix additional jumps if present (for compound conditions)
							if (block.additionalJumps) {
								for (const jumpIdx of block.additionalJumps) {
									// Calculate offset specifically for this jump
									const additionalJumpOffset = (instructions.length + 1 - jumpIdx) * INSTRUCTION_SIZE
									if (additionalJumpOffset > MAX_JUMP_DISTANCE) {
										throw new Error(`Jump distance too large (${additionalJumpOffset} bytes, maximum is ${MAX_JUMP_DISTANCE} bytes)`)
									}
									instructions[jumpIdx].operand1 = additionalJumpOffset & 0xFF
									instructions[jumpIdx].operand2 = (additionalJumpOffset >> 8) & 0xFF
								}
							}

							// Add jump to skip else block
							const skipElseIndex = instructions.length
							instructions.push({
								opcode: BytecodeOpCode.JUMP,
								operand1: 0, // Will be filled later
								operand2: 0,
								operand3: 0,
								operand4: 0
							})

							// Save for fixing after else block
							pendingJumps.push({ index: skipElseIndex, targetType: "end_of_else" })
						} else {
							// No else block, so jump-if-false should point to the current position
							const offsetToEndOfIf = (instructions.length - block.jumpIndex) * INSTRUCTION_SIZE
							if (offsetToEndOfIf > MAX_JUMP_DISTANCE) {
								throw new Error(`Jump distance too large (${offsetToEndOfIf} bytes, maximum is ${MAX_JUMP_DISTANCE} bytes)`)
							}

							// Update main jump index
							instructions[block.jumpIndex].operand1 = offsetToEndOfIf & 0xFF
							instructions[block.jumpIndex].operand2 = (offsetToEndOfIf >> 8) & 0xFF

							// Fix additional jumps if present
							if (block.additionalJumps) {
								for (const jumpIdx of block.additionalJumps) {
									instructions[jumpIdx].operand1 = offsetToEndOfIf & 0xFF
									instructions[jumpIdx].operand2 = (offsetToEndOfIf >> 8) & 0xFF
								}
							}
						}
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					} else if (block.type === "else") {
						for (let i = pendingJumps.length - 1; i >= 0; i--) {
							const jump = pendingJumps[i]
							if (jump.targetType === "end_of_else") {
								const offsetToEnd = (instructions.length - jump.index) * INSTRUCTION_SIZE
								if (offsetToEnd > MAX_JUMP_DISTANCE) {
									throw new Error(`Jump distance too large (${offsetToEnd} bytes, maximum is ${MAX_JUMP_DISTANCE} bytes)`)
								}
								instructions[jump.index].operand1 = offsetToEnd & 0xFF
								instructions[jump.index].operand2 = (offsetToEnd >> 8) & 0xFF
								pendingJumps.splice(i, 1)
							}
						}
					}
				}
				break
			case CommandType.COMPOUND_AND_IF_STATEMENT: {
				if (command.matches && command.matches.length === 7) {
					const leftExpr1 = command.matches[1]
					const operator1 = command.matches[2]
					const rightExpr1 = command.matches[3]
					const leftExpr2 = command.matches[4]
					const operator2 = command.matches[5]
					const rightExpr2 = command.matches[6]

					// Parse first comparison operator
					const compOp1 = CppParserHelper.parseComparisonOperator(operator1)

					// Handle left operand of first condition
					const leftOperandResult1 = CppParserHelper.processOperand(leftExpr1, variables, nextRegister, instructions)
					nextRegister = leftOperandResult1.updatedNextRegister
					const leftOperand1 = leftOperandResult1.operand

					// Handle right operand of first condition
					const rightOperandResult1 = CppParserHelper.processOperand(rightExpr1, variables, nextRegister, instructions)
					nextRegister = rightOperandResult1.updatedNextRegister
					const rightOperand1 = rightOperandResult1.operand

					// Add first comparison instruction
					instructions.push({
						opcode: BytecodeOpCode.COMPARE,
						operand1: compOp1,
						operand2: leftOperand1,
						operand3: rightOperand1,
						operand4: 0
					})

					// For AND, short-circuit if first condition is false
					// Store jumpIndex to be filled later
					const firstJumpIndex = instructions.length
					instructions.push({
						opcode: BytecodeOpCode.JUMP_IF_FALSE,
						operand1: 0, // Will be filled later
						operand2: 0,
						operand3: 0,
						operand4: 0
					})

					// Parse second comparison operator
					const compOp2 = CppParserHelper.parseComparisonOperator(operator2)

					// Handle left operand of second condition
					const leftOperandResult2 = CppParserHelper.processOperand(leftExpr2, variables, nextRegister, instructions)
					nextRegister = leftOperandResult2.updatedNextRegister
					const leftOperand2 = leftOperandResult2.operand

					// Handle right operand of second condition
					const rightOperandResult2 = CppParserHelper.processOperand(rightExpr2, variables, nextRegister, instructions)
					nextRegister = rightOperandResult2.updatedNextRegister
					const rightOperand2 = rightOperandResult2.operand

					// Add second comparison instruction
					instructions.push({
						opcode: BytecodeOpCode.COMPARE,
						operand1: compOp2,
						operand2: leftOperand2,
						operand3: rightOperand2,
						operand4: 0
					})

					// Jump to else block if second condition is false
					const secondJumpIndex = instructions.length
					instructions.push({
						opcode: BytecodeOpCode.JUMP_IF_FALSE,
						operand1: 0, // Will be filled later
						operand2: 0,
						operand3: 0,
						operand4: 0
					})

					// Track this block for later
					blockStack.push({
						type: "if",
						jumpIndex: secondJumpIndex,
						additionalJumps: [firstJumpIndex]  // Store additional jump points
					})
				}
				break
			}

			case CommandType.COMPOUND_OR_IF_STATEMENT: {
				if (command.matches && command.matches.length === 7) {
					const leftExpr1 = command.matches[1]
					const operator1 = command.matches[2]
					const rightExpr1 = command.matches[3]
					const leftExpr2 = command.matches[4]
					const operator2 = command.matches[5]
					const rightExpr2 = command.matches[6]

					// Parse first comparison operator
					const compOp1 = CppParserHelper.parseComparisonOperator(operator1)

					// Handle left operand of first condition
					const leftOperandResult1 = CppParserHelper.processOperand(leftExpr1, variables, nextRegister, instructions)
					nextRegister = leftOperandResult1.updatedNextRegister
					const leftOperand1 = leftOperandResult1.operand

					// Handle right operand of first condition
					const rightOperandResult1 = CppParserHelper.processOperand(rightExpr1, variables, nextRegister, instructions)
					nextRegister = rightOperandResult1.updatedNextRegister
					const rightOperand1 = rightOperandResult1.operand

					// Add first comparison instruction
					instructions.push({
						opcode: BytecodeOpCode.COMPARE,
						operand1: compOp1,
						operand2: leftOperand1,
						operand3: rightOperand1,
						operand4: 0
					})

					// For OR, we'll add a JUMP_IF_TRUE instruction to skip to the if-body
					// if the first condition is true (short-circuit)
					const jumpToIfBodyIndex = instructions.length
					instructions.push({
						opcode: BytecodeOpCode.JUMP_IF_TRUE,
						operand1: 0, // Will be filled later to point to if-body
						operand2: 0,
						operand3: 0,
						operand4: 0
					})

					// Parse second comparison operator
					const compOp2 = CppParserHelper.parseComparisonOperator(operator2)

					// Handle left operand of second condition
					const leftOperandResult2 = CppParserHelper.processOperand(leftExpr2, variables, nextRegister, instructions)
					nextRegister = leftOperandResult2.updatedNextRegister
					const leftOperand2 = leftOperandResult2.operand

					// Handle right operand of second condition
					const rightOperandResult2 = CppParserHelper.processOperand(rightExpr2, variables, nextRegister, instructions)
					nextRegister = rightOperandResult2.updatedNextRegister
					const rightOperand2 = rightOperandResult2.operand

					// Add second comparison instruction
					instructions.push({
						opcode: BytecodeOpCode.COMPARE,
						operand1: compOp2,
						operand2: leftOperand2,
						operand3: rightOperand2,
						operand4: 0
					})

					// Jump to else block if second condition is also false
					const jumpToElseIndex = instructions.length
					instructions.push({
						opcode: BytecodeOpCode.JUMP_IF_FALSE,
						operand1: 0, // Will be filled later
						operand2: 0,
						operand3: 0,
						operand4: 0
					})

					// Now we're at the if-body. We need to fix the jumpToIfBodyIndex
					// to point here
					const ifBodyOffset = (instructions.length - jumpToIfBodyIndex) * INSTRUCTION_SIZE
					if (ifBodyOffset > MAX_JUMP_DISTANCE) {
						throw new Error(`Jump distance too large (${ifBodyOffset} bytes, maximum is ${MAX_JUMP_DISTANCE} bytes)`)
					}
					instructions[jumpToIfBodyIndex].operand1 = ifBodyOffset & 0xFF
					instructions[jumpToIfBodyIndex].operand2 = (ifBodyOffset >> 8) & 0xFF

					// Track this block for later (we only need to fix the jumpToElseIndex
					// for the end of the if block)
					blockStack.push({
						type: "if",
						jumpIndex: jumpToElseIndex
					})
				}
				break
			}

			case CommandType.ELSE_STATEMENT:
				// Mark start of else block
				blockStack.push({ type: "else", jumpIndex: instructions.length })
				break

			case CommandType.MOTOR_FORWARD:
				if (command.matches && command.matches.length === 2) {
					const throttlePercent = parseInt(command.matches[1], 10)
					// Validate throttle percentage
					if (throttlePercent < 0 || throttlePercent > 100) {
						throw new Error(`Invalid throttle percentage: ${throttlePercent}. Must be between 0 and 100.`)
					}

					instructions.push({
						opcode: BytecodeOpCode.MOTOR_FORWARD,
						operand1: throttlePercent,
						operand2: 0,
						operand3: 0,
						operand4: 0
					})
				}
				break

			case CommandType.MOTOR_BACKWARD:
				if (command.matches && command.matches.length === 2) {
					const throttlePercent = parseInt(command.matches[1], 10)
					// Validate throttle percentage
					if (throttlePercent < 0 || throttlePercent > 100) {
						throw new Error(`Invalid throttle percentage: ${throttlePercent}. Must be between 0 and 100.`)
					}

					instructions.push({
						opcode: BytecodeOpCode.MOTOR_BACKWARD,
						operand1: throttlePercent,
						operand2: 0,
						operand3: 0,
						operand4: 0
					})
				}
				break

			case CommandType.MOTOR_STOP:
				instructions.push({
					opcode: BytecodeOpCode.MOTOR_STOP,
					operand1: 0,
					operand2: 0,
					operand3: 0,
					operand4: 0
				})
				break

			case CommandType.MOTOR_TURN:
				if (command.matches && command.matches.length === 3) {
					const direction = command.matches[1] // "clockwise" or "counterclockwise"
					const degrees = parseInt(command.matches[2], 10)

					// Validate degrees
					if (degrees <= 0 || degrees > 360) {
						throw new Error(`Invalid degrees: ${degrees}. Must be between 1 and 360.`)
					}

					instructions.push({
						opcode: BytecodeOpCode.MOTOR_TURN,
						operand1: direction === "CLOCKWISE" ? 1 : 0,
						operand2: degrees,
						operand3: 0,
						operand4: 0
					})
				}
				break

			case CommandType.MOTOR_FORWARD_TIME:
				if (command.matches && command.matches.length === 3) {
					const seconds = parseFloat(command.matches[1])
					const throttlePercent = parseInt(command.matches[2], 10)

					// Validate parameters
					if (seconds <= 0) {
						throw new Error(`Invalid time value: ${seconds}. Must be greater than 0.`)
					}

					if (throttlePercent < 0 || throttlePercent > 100) {
						throw new Error(`Invalid throttle percentage: ${throttlePercent}. Must be between 0 and 100.`)
					}

					instructions.push({
						opcode: BytecodeOpCode.MOTOR_FORWARD_TIME,
						operand1: seconds,
						operand2: throttlePercent,
						operand3: 0,
						operand4: 0
					})
				}
				break

			case CommandType.MOTOR_BACKWARD_TIME:
				if (command.matches && command.matches.length === 3) {
					const seconds = parseFloat(command.matches[1])
					const throttlePercent = parseInt(command.matches[2], 10)

					// Validate parameters
					if (seconds <= 0) {
						throw new Error(`Invalid time value: ${seconds}. Must be greater than 0.`)
					}

					if (throttlePercent < 0 || throttlePercent > 100) {
						throw new Error(`Invalid throttle percentage: ${throttlePercent}. Must be between 0 and 100.`)
					}

					instructions.push({
						opcode: BytecodeOpCode.MOTOR_BACKWARD_TIME,
						operand1: seconds,
						operand2: throttlePercent,
						operand3: 0,
						operand4: 0
					})
				}
				break

				// Inside parseCppCode method's switch statement
			case CommandType.MOTOR_FORWARD_DISTANCE:
				if (command.matches && command.matches.length === 3) {
					const centimeters = parseFloat(command.matches[1])
					const throttlePercent = parseInt(command.matches[2], 10)

					// Validate parameters
					if (centimeters <= 0) {
						throw new Error(`Invalid distance value: ${centimeters}. Must be greater than 0.`)
					}

					if (throttlePercent < 0 || throttlePercent > 100) {
						throw new Error(`Invalid throttle percentage: ${throttlePercent}. Must be between 0 and 100.`)
					}

					instructions.push({
						opcode: BytecodeOpCode.MOTOR_FORWARD_DISTANCE,
						operand1: centimeters,  // Store distance in cm
						operand2: throttlePercent,
						operand3: 0,
						operand4: 0
					})
				}
				break

			case CommandType.MOTOR_BACKWARD_DISTANCE:
				if (command.matches && command.matches.length === 3) {
					const centimeters = parseFloat(command.matches[1])
					const throttlePercent = parseInt(command.matches[2], 10)

					// Validate parameters
					if (centimeters <= 0) {
						throw new Error(`Invalid distance value: ${centimeters}. Must be greater than 0.`)
					}

					if (throttlePercent < 0 || throttlePercent > 100) {
						throw new Error(`Invalid throttle percentage: ${throttlePercent}. Must be between 0 and 100.`)
					}

					instructions.push({
						opcode: BytecodeOpCode.MOTOR_BACKWARD_DISTANCE,
						operand1: centimeters,  // Store distance in cm
						operand2: throttlePercent,
						operand3: 0,
						operand4: 0
					})
				}
				break

			case CommandType.SIDE_PROXIMITY_DETECTION: {
				if (command.matches && command.matches.length === 2) {
					// Extract the sensor side (left or right)
					const sensorSide = command.matches[1]

					// Allocate a register for the boolean result
					if (nextRegister >= MAX_REGISTERS) {
						throw new Error(`Program exceeds maximum register count (${MAX_REGISTERS})`)
					}
					const boolResultRegister = nextRegister++

					// Determine sensor type based on side
					const sensorType = sensorSide === "left" ?
						SensorType.SIDE_LEFT_PROXIMITY : SensorType.SIDE_RIGHT_PROXIMITY

					// Since the VM now handles the threshold comparison internally,
					// we only need to read the sensor value which will return a boolean
					instructions.push({
						opcode: BytecodeOpCode.READ_SENSOR,
						operand1: sensorType,
						operand2: boolResultRegister,
						operand3: 0,
						operand4: 0
					})

					// No need for additional comparison or boolean conversion
					// as the VM now returns a boolean directly
				}
				break
			}
			case CommandType.FRONT_PROXIMITY_DETECTION: {
				if (command.matches) {
					// Allocate a register for the boolean result
					if (nextRegister >= MAX_REGISTERS) {
						throw new Error(`Program exceeds maximum register count (${MAX_REGISTERS})`)
					}
					const boolResultRegister = nextRegister++

					// Use the front proximity sensor type
					const sensorType = SensorType.FRONT_PROXIMITY

					// Read sensor value
					instructions.push({
						opcode: BytecodeOpCode.READ_SENSOR,
						operand1: sensorType,
						operand2: boolResultRegister,
						operand3: 0,
						operand4: 0
					})
				}
				break
			}
			case CommandType.WAIT_FOR_BUTTON: {
				instructions.push({
					opcode: BytecodeOpCode.WAIT_FOR_BUTTON,
					operand1: 0,
					operand2: 0,
					operand3: 0,
					operand4: 0
				})
				break
			}
			}
		}

		// Add END instruction at the end
		instructions.push({
			opcode: BytecodeOpCode.END,
			operand1: 0,
			operand2: 0,
			operand3: 0,
			operand4: 0
		})

		if (blockStack.length > 0) {
			throw new Error(`Syntax error: Missing ${blockStack.length} closing brace(s)`)
		}

		return instructions
	}
}
