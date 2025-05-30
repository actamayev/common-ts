// This file is not accessible to the package dependents
import { CommandType } from "../public/bytecode-types"

declare global {
	interface BytecodeInstruction {
		opcode: number    // uint32_t in ESP32
		operand1: number  // float in ESP32
		operand2: number  // float in ESP32
		operand3: number  // float in ESP32
		operand4: number  // float in ESP32
	}

	interface BlockStack {
		type: "for" | "while" | "if" | "else-if" | "else"
		jumpIndex: number
		varRegister?: number // For for loops
		startIndex?: number // For for loops
		additionalJumps?: number[] // For compound conditions
	}

	interface PendingJumps {
		index: number
		targetType: "end_of_else" | "end_of_chain"
	}

	interface ValidCommand {
		type: CommandType
		matches: RegExpMatchArray | null
	}

	interface CharacterStack {
		char: string
		pos: number
	}

	interface VariableType {
		type: VarType
		register: number
	}
}

export {}
