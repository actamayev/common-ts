import { SandboxProject } from "./sandbox"
import { PipUUIDInterface, SiteThemes } from "./utils"
import { RetrievedQuestions, UserActivityProgress } from "./lab"
import { ESPConnectionStatus, PipConnectionStatus, PipData } from "./pip"

// Auth
// Requests
export interface RegisterCredentialsRequest extends LoginInformationRequest {
	username: string
	siteTheme: SiteThemes
}

export interface LoginInformationRequest {
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
}
export type GoogleAuthSuccess = LoginSuccess & { isNewUser: boolean }

//Pip
export interface AddPipData extends PipUUIDInterface {
	shouldAutoConnect: boolean
	pipName?: string
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
	pipConnectionStatus: PipConnectionStatus
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
