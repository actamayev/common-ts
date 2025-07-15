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
}

export type InteractionType = "checkCode" | "hint" | "generalQuestion"

interface IncomingChatData {
	userCode: string
	message?: string // Required for generalQuestion
}

// Request payload from client
export interface OutgoingCareerQuestChatData extends IncomingChatData {
	interactionType: InteractionType
	careerQuestChallengeId: string
}

export interface OutgoingSandboxChatData extends IncomingChatData {
	message: string
}

// Request after attaching ChatId
export interface ProcessedCareerQuestChatData extends OutgoingCareerQuestChatData {
	careerQuestChatId: number
	conversationHistory: ChatMessage[]
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
