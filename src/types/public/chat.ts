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
// Message interface for conversation
export interface ChatMessage {
	role: ChatMessageRole
	content: string
	timestamp: Date
	codeSubmissionData?: {
		userCode: string
		isCorrect: boolean
		evaluationResult: string
	}
}

export type InteractionType = "checkCode" | "hint" | "generalQuestion"

// Request payload from client
export interface OutgoingCareerQuestGeneralMessage {
	interactionType: "generalQuestion" | "hint"
	careerQuestChallengeId: string
	userCode: string
	message: string
}

// Request after attaching ChatId
export interface ProcessedCareerQuestChatData extends OutgoingCareerQuestGeneralMessage {
	careerQuestChatId: number
	conversationHistory: ChatMessage[]
}

export interface OutgoingCareerQuestCheckCodeMessage {
	careerQuestChallengeId: string
	userCode: string
}

export interface ProcessedCareerQuestCheckCodeMessage extends OutgoingCareerQuestCheckCodeMessage {
	careerQuestChatId: number
}

export interface OutgoingSandboxChatData {
	userCode: string
	message: string
}

export interface ProcessedSandboxChatData extends OutgoingSandboxChatData {
	sandboxChatId: number
	conversationHistory: ChatMessage[]
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
