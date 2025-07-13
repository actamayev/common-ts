import { ChatMessage } from "./chat"
import { StudentData } from "./classroom"
import { ClassCode, PipUUID, SiteThemes } from "./utils"
import { ESPConnectionStatus, PipData } from "./pip"
import { BlocklyJson, SandboxProject } from "./sandbox"
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

export interface NewGoogleInfoRequest {
	age: number
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
	personalInfo: BasicPersonalInfoResponse
	studentClasses: StudentClassroomData[]
	teacherData: TeacherData | null
}
export type GoogleAuthSuccess = Omit<LoginSuccess, "personalInfo"> & {
	isNewUser: boolean
	personalInfo?: BasicPersonalInfoResponse
	teacherData: TeacherData | null
}

// Career Quest
export type CareerQuestChallengeData = {
	messages: ChatMessage[]
	sandboxJson: BlocklyJson
}

// Chat:
export type StartChatSuccess = {
	streamId: string
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
export type BasicPersonalInfoResponse = {
	username: string
	email: string | null
	defaultSiteTheme: SiteThemes
	profilePictureUrl: string | null
	sandboxNotesOpen: boolean
	name: string | null
}

export type PersonalInfoResponse = BasicPersonalInfoResponse & {
	teacherData: TeacherData | null
}

export type TeacherData = {
	teacherFirstName: string
	teacherLastName: string
	isApproved: boolean | null
	schoolName: string
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
export type CreateSandboxProjectResponse = {
	sandboxProject: SandboxProject
}

export type RetrieveSandboxProjectResponse = {
	sandboxProject: SandboxProject | null
}

export type RetrieveSandboxProjectsResponse = {
	sandboxProjects: SandboxProject[]
}

// Student Routes
export interface InviteResponse {
	inviteResponse: "accept" | "decline"
}

export interface StudentClassroomData {
	invitationStatus: "PENDING" | "ACCEPTED" | "DECLINED"
	joinedClassroomAt: Date | null
	classroomName: string
	classCode: ClassCode
}

//Teacher Routes
export interface BasicTeacherClassroomData {
	classroomName: string
	classCode: ClassCode
}

export interface DetailedClassroomData extends BasicTeacherClassroomData {
	students: StudentData[]
}

export interface ClassCodeResponse {
	classCode: ClassCode
}

export interface IncomingTeacherRequestData {
	teacherFirstName: string
	teacherLastName: string
	schoolName: string
}

// Common Responses:
export type SuccessResponse = { success: string }
export type MessageResponse = { message: string }
export type ValidationErrorResponse = { validationError: string }
export type ErrorResponse = { error: string }
export type ErrorResponses = ValidationErrorResponse | ErrorResponse
export type NonSuccessResponse = MessageResponse | ErrorResponses
export type AllCommonResponses = SuccessResponse | NonSuccessResponse
