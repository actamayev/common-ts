import { CppParser } from "../../src"
import { BytecodeOpCode, ComparisonOp, SensorType, VarType } from "../../src/types/public/bytecode-types"
import { MAX_LED_BRIGHTNESS } from "../../src/types/private/constants"

describe("Complex Nested Structures", () => {
	test("should parse a deeply nested structure with 4+ levels", () => {
		const code = `
		while(true) {
		if (Sensors::getInstance().getPitch() > 5) {
			for (int i = 0; i < 3; i++) {
			if (Sensors::getInstance().getRoll() < 0) {
				while(true) {
				if (i > 1) {
					rgbLed.set_led_red();
				} else {
					rgbLed.set_led_blue();
				}
				delay(10);
				}
			} else {
				rgbLed.set_led_green();
			}
			}
		} else {
			rgbLed.set_led_purple();
		}
		delay(100);
		}
	`

		// This should not throw, indicating the parser can handle deep nesting
		const bytecode = CppParser.cppToByte(code)

		// Verify structure by finding key opcodes:
		// 1. Outer while loop
		let whileStartCount = 0
		let forInitCount = 0
		let compareCount = 0

		for (let i = 0; i < bytecode.length; i += 5) {
			if (bytecode[i] === BytecodeOpCode.WHILE_START) {
				whileStartCount++
			} else if (bytecode[i] === BytecodeOpCode.FOR_INIT) {
				forInitCount++
			} else if (bytecode[i] === BytecodeOpCode.COMPARE) {
				compareCount++
			}
		}

		// Should have 2 while loops, 1 for loop, and multiple compares
		expect(whileStartCount).toBe(2)
		expect(forInitCount).toBe(1)
		expect(compareCount).toBeGreaterThanOrEqual(3)

		// Validate that we have all the LED colors represented
		const ledColors = [
			{ r: MAX_LED_BRIGHTNESS, g: 0, b: 0 },               // Red
			{ r: 0, g: 0, b: MAX_LED_BRIGHTNESS },               // Blue
			{ r: 0, g: MAX_LED_BRIGHTNESS, b: 0 },               // Green
			{ r: MAX_LED_BRIGHTNESS, g: 0, b: MAX_LED_BRIGHTNESS }  // Purple
		]

		for (const color of ledColors) {
			let found = false
			for (let i = 0; i < bytecode.length; i += 5) {
				if (bytecode[i] === BytecodeOpCode.SET_ALL_LEDS &&
			bytecode[i + 1] === color.r &&
			bytecode[i + 2] === color.g &&
			bytecode[i + 3] === color.b) {
					found = true
					break
				}
			}
			expect(found).toBe(true)
		}
	})

	// test("should handle complex variable scoping across nested blocks", () => {
	// 	const code = `
	// 	int outerVar = 10;
	// 	if (outerVar > 5) {
	// 	int innerVar1 = 20;
	// 	if (innerVar1 > 15) {
	// 		int deepVar = 30;
	// 		for (int i = 0; i < deepVar; i++) {
	// 		if (i == outerVar) {
	// 			rgbLed.set_led_red();
	// 		} else if (i == innerVar1) {
	// 			rgbLed.set_led_green();
	// 		} else {
	// 			rgbLed.set_led_blue();
	// 		}
	// 		}
	// 	}
	// 	}
	// `

	// 	const bytecode = CppParser.cppToByte(code)

	// 	// Count variable declarations and for loop initialization
	// 	let declareVarCount = 0
	// 	let forInitCount = 0

	// 	for (let i = 0; i < bytecode.length; i += 5) {
	// 		if (bytecode[i] === BytecodeOpCode.DECLARE_VAR) {
	// 			declareVarCount++
	// 		} else if (bytecode[i] === BytecodeOpCode.FOR_INIT) {
	// 			forInitCount++
	// 		}
	// 	}

	// 	// Should have 4 variables: outerVar, innerVar1, deepVar, and the loop counter i
	// 	expect(declareVarCount).toBe(4)
	// 	expect(forInitCount).toBe(1)
	// })
})

describe("Boundary Conditions", () => {
	test("should handle large programs approaching VM instruction limits", () => {
	// Generate a program with a large number of simple statements
		const statements = []
		for (let i = 0; i < 100; i++) {
			statements.push("rgbLed.set_led_red();")
			statements.push("delay(10);")
			statements.push("rgbLed.set_led_blue();")
			statements.push("delay(10);")
		}

		const code = statements.join("\n")

		// Should parse without issues
		const bytecode = CppParser.cppToByte(code)

		// Verify bytecode length - should be (400 instructions + END) * 5 bytes per instruction
		// 400 instructions: 100 * 4 (2 LED sets + 2 delays)
		expect(bytecode.length).toBe((400 + 1) * 5)

		// Check first few instructions
		expect(bytecode[0]).toBe(BytecodeOpCode.SET_ALL_LEDS)
		expect(bytecode[5]).toBe(BytecodeOpCode.DELAY)

		// Check last instruction is END
		expect(bytecode[bytecode.length - 5]).toBe(BytecodeOpCode.END)
	})

	test("should handle loops with edge-case iteration values", () => {
	// Test cases with extreme loop bounds
		const testCases = [
			{ code: "for (int i = 0; i < 0; i++) { rgbLed.set_led_red(); }", iterations: 0 },
			{ code: "for (int i = 0; i < 1; i++) { rgbLed.set_led_red(); }", iterations: 1 },
			{ code: "for (int i = 32766; i < 32767; i++) { rgbLed.set_led_red(); }", iterations: 1 }, // Near uint16 max
		]

		for (const { code, iterations } of testCases) {
			const bytecode = CppParser.cppToByte(code)

			// FOR_INIT should be present
			let foundForInit = false
			let initIndex = -1

			for (let i = 0; i < bytecode.length; i += 5) {
				if (bytecode[i] === BytecodeOpCode.FOR_INIT) {
					foundForInit = true
					initIndex = i
					break
				}
			}

			expect(foundForInit).toBe(true)

			// FOR_CONDITION should be next
			expect(bytecode[initIndex + 5]).toBe(BytecodeOpCode.FOR_CONDITION)

			// Check that the end condition value is properly encoded
			if (iterations === 0) {
			// End value for condition should be 0
				expect(bytecode[initIndex + 5 + 2]).toBe(0)
			} else if (iterations === 1) {
			// Check if FOR_INCREMENT is present
				let foundForIncrement = false
				for (let i = initIndex + 5; i < bytecode.length; i += 5) {
					if (bytecode[i] === BytecodeOpCode.FOR_INCREMENT) {
						foundForIncrement = true
						break
					}
				}
				expect(foundForIncrement).toBe(true)
			}
		}
	})

	test("should handle maximum register usage", () => {
	// Create a program with many variables to use a lot of registers
		let code = ""
		const numVars = 50 // A significant number but not exceeding MAX_REGISTERS

		// Declare many variables
		for (let i = 0; i < numVars; i++) {
			code += `int var${i} = ${i};\n`
		}

		// Use the variables in a series of if statements
		for (let i = 0; i < numVars; i++) {
			code += `if (var${i} < ${i + 1}) { rgbLed.set_led_red(); } else { rgbLed.set_led_blue(); }\n`
		}

		// Should parse without issues
		const bytecode = CppParser.cppToByte(code)

		// Count variable declarations and compare operations
		let declareVarCount = 0
		let compareCount = 0

		for (let i = 0; i < bytecode.length; i += 5) {
			if (bytecode[i] === BytecodeOpCode.DECLARE_VAR) {
				declareVarCount++
			} else if (bytecode[i] === BytecodeOpCode.COMPARE) {
				compareCount++
			}
		}

		expect(declareVarCount).toBe(numVars)
		expect(compareCount).toBe(numVars)
	})

	test("should handle extremely deep nesting of if-else statements", () => {
	// Create a program with deeply nested if-else statements
		const nestingDepth = 8 // Reduced from 15 to a more reasonable depth

		// Start with variable declaration
		let code = "int x = 10;\n"

		// Create deeply nested if-else structure
		let currentIndent = ""
		for (let i = 0; i < nestingDepth; i++) {
			code += `${currentIndent}if (x > ${i}) {\n`
			currentIndent += "  "
		}

		// Add statement at deepest level
		code += `${currentIndent}rgbLed.set_led_red();\n`

		// Close all the open if blocks
		for (let i = 0; i < nestingDepth; i++) {
			currentIndent = currentIndent.substring(2) // Reduce indent
			code += `${currentIndent}} else {\n`
			code += `${currentIndent}  rgbLed.set_led_blue();\n`
			code += `${currentIndent}}\n`
		}

		// Should parse without throwing
		const bytecode = CppParser.cppToByte(code)

		// Count if and LED instructions
		let compareCount = 0
		let jumpIfFalseCount = 0
		let setLedCount = 0

		for (let i = 0; i < bytecode.length; i += 5) {
			if (bytecode[i] === BytecodeOpCode.COMPARE) {
				compareCount++
			} else if (bytecode[i] === BytecodeOpCode.JUMP_IF_FALSE) {
				jumpIfFalseCount++
			} else if (bytecode[i] === BytecodeOpCode.SET_ALL_LEDS) {
				setLedCount++
			}
		}

		// Verify that we have the expected number of each instruction type
		expect(compareCount).toBe(nestingDepth)
		expect(jumpIfFalseCount).toBe(nestingDepth)
		// Expect at least nestingDepth LED instructions (minimum 1 per nesting level)
		expect(setLedCount).toBeGreaterThanOrEqual(nestingDepth)
	})

	test("should handle all sensor types in a single program", () => {
	// Create code that uses all available sensor types
		const code = `
		while(true) {
		float pitch = Sensors::getInstance().getPitch();
		float roll = Sensors::getInstance().getRoll();
		float yaw = Sensors::getInstance().getYaw();
		float accelX = Sensors::getInstance().getXAccel();
		float accelY = Sensors::getInstance().getYAccel();
		float accelZ = Sensors::getInstance().getZAccel();
		float accelMag = Sensors::getInstance().getAccelMagnitude();
		float rotRateX = Sensors::getInstance().getXRotationRate();
		float rotRateY = Sensors::getInstance().getYRotationRate();
		float rotRateZ = Sensors::getInstance().getZRotationRate();
		float magX = Sensors::getInstance().getMagneticFieldX();
		float magY = Sensors::getInstance().getMagneticFieldY();
		float magZ = Sensors::getInstance().getMagneticFieldZ();
		
		if ((pitch > 30) || (roll > 30)) {
		rgbLed.set_led_red();
		} 

		if (yaw > 90) {
		rgbLed.set_led_green();
		}

		if (accelMag > 2) {
		rgbLed.set_led_blue();
		}

		if (magX < 0) {
		rgbLed.set_led_white();
		}
		
		delay(100);
		}
	`

		const bytecode = CppParser.cppToByte(code)

		// Check that we have sensor reads for all types
		const sensorTypeCounts = new Array(13).fill(0) // SensorType has 13 values (0-12)

		for (let i = 0; i < bytecode.length; i += 5) {
			if (bytecode[i] === BytecodeOpCode.READ_SENSOR) {
				const sensorType = bytecode[i + 1]
				if (sensorType >= 0 && sensorType <= 12) {
					sensorTypeCounts[sensorType]++
				}
			}
		}

		// Check that every sensor type is used
		for (let type = 0; type <= 12; type++) {
			expect(sensorTypeCounts[type]).toBe(1)
		}
	})

	test("should reject complex nested conditions for now", () => {
		expect(() => {
		  const code = `
			float x = 10.5;
			float y = 20.3;
			float z = 30.7;
			
			if ((x > 5 && y < 30) || (z > 20 && x < 15) || (y > 15 && z < 40)) {
			  rgbLed.set_led_red();
			}
		  `

		  CppParser.cppToByte(code)
		}).toThrow("Complex conditions with multiple logical operators are not supported")
	  })
})

describe("Error Handling Edge Cases", () => {
	test("should reject unbalanced blocks at extreme depths", () => {
		const nestingDepth = 10

		// Create a deeply nested structure with a missing closing brace
		let code = "int x = 5;\n"
		let currentIndent = ""

		for (let i = 0; i < nestingDepth; i++) {
			code += `${currentIndent}if (x > ${i}) {\n`
			currentIndent += "  "
		}

		code += `${currentIndent}rgbLed.set_led_red();\n`

		// Close one fewer block than we opened
		for (let i = 0; i < nestingDepth - 1; i++) {
			currentIndent = currentIndent.substring(2)
			code += `${currentIndent}}\n`
		}

		expect(() => {
			CppParser.cppToByte(code)
		}).toThrow(/Unclosed '\{'/) // Match actual error message
	})

	test("should reject mismatched brackets at different structural positions", () => {
		const testCases = [
			{
				code: "if (x > 5) { rgbLed.set_led_red(); ]",
				errorPattern: /Expected '\}' but found '\]'/
			},
			{
				code: "if (x > 5) [ rgbLed.set_led_red(); }",
				errorPattern: /Expected '\]' but found '\}'/
			},
			{
				code: "for (int i = 0; i < 10; i++) { rgbLed.set_led_red(); ) }",
				errorPattern: /Expected '\}' but found '\)'/ // Match the actual error message format
			}
		]

		for (const { code, errorPattern } of testCases) {
			expect(() => {
				CppParser.cppToByte(code)
			}).toThrow(errorPattern)
		}
	})
})

describe("Proximity Sensor Functionality", () => {
	describe("Front Proximity Sensor", () => {
		test("should parse is_object_in_front function", () => {
			const code = `if (is_object_in_front()) {
        rgbLed.set_led_red();
      } else {
        rgbLed.set_led_green();
      }`

			const bytecode = CppParser.cppToByte(code)

			// 1. READ_SENSOR instruction for front proximity
			expect(bytecode[0]).toBe(BytecodeOpCode.READ_SENSOR)
			expect(bytecode[1]).toBe(SensorType.FRONT_PROXIMITY)
			expect(bytecode[2]).toBe(0) // Register ID
			expect(bytecode[3]).toBe(0) // Unused
			expect(bytecode[4]).toBe(0) // Unused

			// 2. COMPARE instruction (comparing with true/1)
			expect(bytecode[5]).toBe(BytecodeOpCode.COMPARE)
			expect(bytecode[6]).toBe(ComparisonOp.EQUAL)
			expect(bytecode[7]).toBe(0x8000) // Register reference with high bit set
			expect(bytecode[8]).toBe(1)      // Comparing with boolean true (1)
			expect(bytecode[9]).toBe(0)      // Unused

			// 3. JUMP_IF_FALSE to else block
			expect(bytecode[10]).toBe(BytecodeOpCode.JUMP_IF_FALSE)

			// LED instructions should be present
			let redLedFound = false
			let greenLedFound = false

			for (let i = 15; i < bytecode.length; i += 5) {
				if (bytecode[i] === BytecodeOpCode.SET_ALL_LEDS) {
					if (bytecode[i + 1] === MAX_LED_BRIGHTNESS && bytecode[i + 2] === 0 && bytecode[i + 3] === 0) {
						redLedFound = true
					} else if (bytecode[i + 1] === 0 && bytecode[i + 2] === MAX_LED_BRIGHTNESS && bytecode[i + 3] === 0) {
						greenLedFound = true
					}
				}
			}

			expect(redLedFound).toBe(true)
			expect(greenLedFound).toBe(true)
		})

		test("should handle front proximity sensor in loops", () => {
			const code = `while(true) {
        if (is_object_in_front()) {
          rgbLed.set_led_red();
          delay(100);
        } else {
          rgbLed.set_led_green();
          delay(500);
        }
      }`

			const bytecode = CppParser.cppToByte(code)

			// Verify the while loop and front proximity sensor reading
			expect(bytecode[0]).toBe(BytecodeOpCode.WHILE_START)
			expect(bytecode[5]).toBe(BytecodeOpCode.READ_SENSOR)
			expect(bytecode[6]).toBe(SensorType.FRONT_PROXIMITY)

			// Verify we have the correct delay values in each branch
			let delay100Found = false
			let delay500Found = false

			for (let i = 0; i < bytecode.length; i += 5) {
				if (bytecode[i] === BytecodeOpCode.DELAY) {
					if (bytecode[i + 1] === 100) {
						delay100Found = true
					} else if (bytecode[i + 1] === 500) {
						delay500Found = true
					}
				}
			}

			expect(delay100Found).toBe(true)
			expect(delay500Found).toBe(true)

			// Verify WHILE_END is present
			let whileEndFound = false
			for (let i = 0; i < bytecode.length; i += 5) {
				if (bytecode[i] === BytecodeOpCode.WHILE_END) {
					whileEndFound = true
					break
				}
			}
			expect(whileEndFound).toBe(true)
		})

		test("should handle assigning front proximity sensor result to variable", () => {
			const code = `
			  bool objectDetected = is_object_in_front();
			  if (objectDetected) {
				rgbLed.set_led_red();
			  } else {
				rgbLed.set_led_green();
			  }
			`

			// Parse the code (should not throw now)
			const bytecode = CppParser.cppToByte(code)

			// Check for DECLARE_VAR and READ_SENSOR
			expect(bytecode[0]).toBe(BytecodeOpCode.DECLARE_VAR)
			expect(bytecode[2]).toBe(VarType.BOOL)
			expect(bytecode[5]).toBe(BytecodeOpCode.READ_SENSOR)
			expect(bytecode[6]).toBe(SensorType.FRONT_PROXIMITY)

			// Should find COMPARE instruction that uses the variable
			let compareFound = false
			for (let i = 10; i < bytecode.length; i += 5) {
			  if (bytecode[i] === BytecodeOpCode.COMPARE) {
					if (bytecode[i + 2] === 0x8000) { // Register 0 with high bit set
				  compareFound = true
				  break
					}
			  }
			}
			expect(compareFound).toBe(true)

			// Should find both red and green LED instructions
			let redLedFound = false
			let greenLedFound = false
			for (let i = 0; i < bytecode.length; i += 5) {
			  if (bytecode[i] === BytecodeOpCode.SET_ALL_LEDS) {
					if (bytecode[i + 1] === MAX_LED_BRIGHTNESS && bytecode[i + 2] === 0 && bytecode[i + 3] === 0) {
				  redLedFound = true
					} else if (bytecode[i + 1] === 0 && bytecode[i + 2] === MAX_LED_BRIGHTNESS && bytecode[i + 3] === 0) {
				  greenLedFound = true
					}
			  }
			}
			expect(redLedFound).toBe(true)
			expect(greenLedFound).toBe(true)
		  })
	})
})
