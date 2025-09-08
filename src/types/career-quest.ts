import * as Blockly from "blockly"
import { CareerUUID, ChallengeUUID } from "./utils"
import { BlocklyJson } from "./sandbox"
import { BlockNames } from "./blockly/blockly"

export interface AvailableBlock {
	type: BlockNames
	description: string
	codeTemplate: string
}

export type DifficultyLevel = "beginner" | "intermediate" | "advanced"

export interface CqChallengeData {
	// Basic challenge info
	careerUUID: CareerUUID
	challengeUUID: ChallengeUUID
	title: string
	description: string
	difficulty: DifficultyLevel

	challengeIndex: number
	// Programming context
	availableBlocks: AvailableBlock[]

	// Learning context
	expectedBehavior: string
	commonMistakes: string[]
	learningObjectives: string[]

	// Solution for code checking
	solutionCode: string
	beforeRunningText?: string

	initialBlocklyJson: BlocklyJson
	toolboxConfig: Blockly.utils.toolbox.ToolboxDefinition
}
