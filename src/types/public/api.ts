import { ChatMessage } from "./chat"
import { SandboxProject } from "./sandbox"
import { PipUUID, SiteThemes } from "./utils"
import { ESPConnectionStatus, PipData } from "./pip"
import { RetrievedQuestions, UserActivityProgress } from "./lab"

// Auth
// Requests
export interface RegisterRequest {
	age: number
	email: string
	password: string
	username: string
	siteTheme: SiteThemes
}

export interface LoginRequest {
	contact: string
	password: string
}

export interface NewUsernameRequest {
	username: string
}

export interface EmailUpdatesRequest {
	email: string
}

// Responses
export type RegisterSuccess = {
	accessToken: string
}
export type LoginSuccess = RegisterSuccess & {
	userPipData: PipData[]
	personalInfo: PersonalInfoResponse
}
export type GoogleAuthSuccess = LoginSuccess & { isNewUser: boolean }

// Chat:
export type StartChatSuccess = {
	streamId: string
}

export type ChatDataResponse = {
	chatData: ChatMessage[]
}

//Pip
export interface AddPipData {
	pipUUID: PipUUID | null
	pipName: string
}

// Lab Activity Tracking Responses:
export type RetrievedUserActivityProgressResponse = {
	userActivityProgress: UserActivityProgress[]
}

export type RetrievedQuestionsResponse = {
	quizAttempts: RetrievedQuestions[]
}

// Personal Info Responses:
export type PersonalInfoResponse = {
	username: string
	email: string | null
	defaultSiteTheme: SiteThemes
	profilePictureUrl: string | null
	sandboxNotesOpen: boolean
	name: string | null
}
export type ProfilePictureUrl = { profilePictureUrl: string }

// Pip Responses
export type AddNewPipResponse = {
	pipName: string
	userPipUUIDId: number
}
export type PreviouslyAddedPipsResponse = {
	userPipData: PipData[]
}

export type RetrieveIsPipUUIDValidResponse = {
	pipName: string | null
	pipConnectionStatus: ESPConnectionStatus
}

// Sandbox Routes
export type RetrieveSandboxProjectResponse = {
	sandboxProject: SandboxProject
}

export type RetrieveSandboxProjectsResponse = {
	sandboxProjects: SandboxProject[]
}

// Common Responses:
export type SuccessResponse = { success: string }
export type MessageResponse = { message: string }
export type ValidationErrorResponse = { validationError: string }
export type ErrorResponse = { error: string }
export type ErrorResponses = ValidationErrorResponse | ErrorResponse
export type NonSuccessResponse = MessageResponse | ErrorResponses
export type AllCommonResponses = SuccessResponse | NonSuccessResponse
