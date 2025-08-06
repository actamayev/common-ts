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
export interface OutgoingChallengeGeneralMessage {
	careerUUID: CareerUUID
	userCode: string
	message: string
}

// Check code
export interface OutgoingChallengeCheckCodeMessage {
	userCode: string
}

// Hint
export interface OutgoingChallengeHintMessage {
	careerUUID: CareerUUID
	userCode: string
}

export interface OutgoingCareerMessage {
	careerUUID: CareerUUID
	message: string
	whatUserSees: string
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
