import * as Blockly from "blockly"
import { ChallengeId } from "./utils"
import { BlockNames } from "./blockly"
import { BlocklyJson } from "./sandbox"

export type CareerId =
	| "introduction"
	| "obstacle-avoidance"

export interface AvailableBlock {
	type: BlockNames
	description: string
	codeTemplate: string
}

export type DifficultyLevel = "beginner" | "intermediate" | "advanced"

export interface CqChallengeData {
	// Basic challenge info
	careerId: CareerId
	challengeId: ChallengeId
	title: string
	description: string
	difficulty: DifficultyLevel

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
