import * as Blockly from "blockly"
import { BlocklyJson, ProjectUUID } from "./sandbox"
import { BlockNames } from "./blockly"

export interface AvailableBlock {
	type: BlockNames
	description: string
	codeTemplate: string
}

export type DifficultyLevel = "beginner" | "intermediate" | "advanced"

export interface ChallengeData {
	// Basic challenge info
	id: string
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

export type ChatMessageRole = "user" | "assistant" | "system"

export interface SandboxChatMessage {
	role: ChatMessageRole
	content: string
	timestamp: Date
}

export interface BinaryEvaluationResult {
	isCorrect: boolean
	feedback: string
}

export interface CareerQuestChatMessage extends SandboxChatMessage {
	codeSubmissionData?: {
		userCode: string
		evaluationResult: BinaryEvaluationResult
	}
	isHint?: boolean
}

export type InteractionType = "checkCode" | "hint" | "generalQuestion"

// Request payload from client
export interface OutgoingCareerQuestGeneralMessage {
	careerQuestChallengeId: string
	userCode: string
	message: string
}

// Check code
export interface OutgoingCareerQuestCheckCodeMessage {
	careerQuestChallengeId: string
	userCode: string
}

// Hint
export interface OutgoingCareerQuestHintMessage {
	careerQuestChallengeId: string
	userCode: string
}

export interface OutgoingSandboxChatData {
	userCode: string
	message: string
}

// CQ Chatbot stuff:
export interface CqChatbotStreamCompleteEvent {
	challengeId: string
}

export interface CqChatbotStreamStartEvent extends CqChatbotStreamCompleteEvent {
	interactionType: InteractionType
}

export interface CqChatbotStreamChunkEvent extends CqChatbotStreamCompleteEvent {
	content: string
}

// Sandbox Chatbot stuff:
export interface SandboxChatbotStreamStartOrCompleteEvent {
	sandboxProjectUUID: ProjectUUID
}

export interface SandboxChatbotStreamChunkEvent extends SandboxChatbotStreamStartOrCompleteEvent {
	content: string
}
