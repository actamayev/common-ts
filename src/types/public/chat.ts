import { ChallengeUUID, CareerUUID, SandboxProjectUUID } from "./utils"

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

export interface ChallengeChatMessage extends SandboxChatMessage {
	codeSubmissionData?: {
		userCode: string
		evaluationResult: BinaryEvaluationResult
	}
	isHint?: boolean
}

export type InteractionType = "hint" | "generalQuestion"

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
	message: string
	whatUserSees: string
	careerName: string
	careerDescription: string
}

export interface OutgoingSandboxChatData {
	userCode: string
	message: string
}

// Challenge Chatbot stuff:
export interface ChallengeChatbotStreamCompleteEvent {
	careerUUID: CareerUUID
	challengeUUID: ChallengeUUID
}

export interface ChallengeChatbotStreamStartEvent extends ChallengeChatbotStreamCompleteEvent {
	interactionType: InteractionType
}

export interface ChallengeChatbotStreamChunkEvent extends ChallengeChatbotStreamCompleteEvent {
	content: string
}

// Career Chatbot stuff:
export interface CareerChatbotStreamStartOrCompleteEvent {
	careerUUID: CareerUUID
}

export interface CareerChatbotChunkEvent extends CareerChatbotStreamStartOrCompleteEvent {
	content: string
}

// Sandbox Chatbot stuff:
export interface SandboxChatbotStreamStartOrCompleteEvent {
	sandboxProjectUUID: SandboxProjectUUID
}

export interface SandboxChatbotStreamChunkEvent extends SandboxChatbotStreamStartOrCompleteEvent {
	content: string
}
