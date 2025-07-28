import { ChallengeUUID, CareerUUID } from "./utils"
import { ProjectUUID } from "./sandbox"

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

export interface CqChallengeChatMessage extends SandboxChatMessage {
	codeSubmissionData?: {
		userCode: string
		evaluationResult: BinaryEvaluationResult
	}
	isHint?: boolean
}

export type InteractionType = "checkCode" | "hint" | "generalQuestion"

// Request payload from client
export interface OutgoingCqChallengeGeneralMessage {
	userCode: string
	message: string
}

// Check code
export interface OutgoingCqChallengeCheckCodeMessage {
	userCode: string
}

// Hint
export interface OutgoingCqChallengeHintMessage {
	userCode: string
}

export interface OutgoingSandboxChatData {
	userCode: string
	message: string
}

// CQ Chatbot stuff:
export interface CqChatbotStreamCompleteEvent {
	careerUUID: CareerUUID
	challengeUUID: ChallengeUUID
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
