import * as Blockly from "blockly"
import { BlocklyJson } from "./sandbox"

export interface AvailableBlock {
	type: string
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

	// Optional hints (progressive difficulty)
	hints?: {
		level1: string // Gentle nudge
		level2: string // More specific
		level3: string // Almost give away
	}
	initialBlocklyJson: BlocklyJson
	toolboxConfig: Blockly.utils.toolbox.ToolboxDefinition
}

export type ChatMessageRole = "user" | "assistant" | "system"
// Message interface for conversation
export interface ChatMessage {
	role: ChatMessageRole
	content: string
	timestamp?: Date
}

export type InteractionType = "checkCode" | "hint" | "generalQuestion"

// Request payload from client
export interface IncomingChatData {
	challengeId: string
	userCode: string
	interactionType: InteractionType
	conversationHistory: ChatMessage[]
	message?: string // Required for generalQuestion
}

export interface ChatbotStreamCompleteEvent {
	challengeId: string
}

export interface ChatbotStreamStartEvent extends ChatbotStreamCompleteEvent {
	interactionType: InteractionType
}

export interface ChatbotStreamChunkEvent extends ChatbotStreamCompleteEvent {
	content: string
}
