import { StudentData } from "./classroom"
import { ChallengeChatMessage, SandboxChatMessage } from "./chat"
import { ESPConnectionStatus, PipData } from "./pip"
import { BlocklyJson, SandboxProject } from "./sandbox"
import { ChallengeUUID, ClassCode, PipUUID, SiteThemes } from "./utils"
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
export interface RegisterSuccess {
	success: boolean
}
export interface LoginSuccess {
	userPipData: PipData[]
	personalInfo: BasicPersonalInfoResponse
	studentClasses: StudentClassroomData[]
	teacherData: TeacherData | null
}
export interface GoogleAuthSuccess extends Omit<LoginSuccess, "personalInfo"> {
	isNewUser: boolean
	personalInfo?: BasicPersonalInfoResponse
	teacherData: TeacherData | null
}

// Career Quest
export interface CareerQuestHint {
	hintText: string
	createdAt: Date
	hintNumber: number
	modelUsed: string
}

export interface CareerQuestCodeSubmission {
	userCode: string
	isCorrect: boolean
	score: number
	feedback: string
	createdAt: Date
}

export interface CareerQuestChallengeData {
	messages: ChallengeChatMessage[]
	allHints: CareerQuestHint[]
	allSubmissions: CareerQuestCodeSubmission[]
	sandboxJson: BlocklyJson | null
	hasEverBeenCorrect: boolean
	challengeUUID: ChallengeUUID
}

export interface CareerProgressData {
	currentChallengeUuidOrTextUuid: string
	furthestSeenChallengeUuidOrTextUuid: string
	careerQuestChallengeData: CareerQuestChallengeData[]
	seenChallengeUUIDs: ChallengeUUID[]
	careerChatMessages: SandboxChatMessage[]
}

// Chat:
export interface StartChatSuccess {
	streamId: string
}

export interface CheckCodeResponse {
	isCorrect: boolean
	feedback: string
}

//Pip
export interface AddPipData {
	pipUUID: PipUUID | null
	pipName: string
}

// Lab Activity Tracking Responses:
export interface RetrievedUserActivityProgressResponse {
	userActivityProgress: UserActivityProgress[]
}

export interface RetrievedQuestionsResponse {
	quizAttempts: RetrievedQuestions[]
}

// Personal Info Responses:
export interface BasicPersonalInfoResponse {
	username: string
	email: string | null
	defaultSiteTheme: SiteThemes
	profilePictureUrl: string | null
	sandboxNotesOpen: boolean
	name: string | null
}

export interface PersonalInfoResponse extends BasicPersonalInfoResponse {
	teacherData: TeacherData | null
}

export interface TeacherData {
	teacherFirstName: string
	teacherLastName: string
	isApproved: boolean | null
	schoolName: string
}

export interface ProfilePictureUrl {
	profilePictureUrl: string
}

// Pip Responses
export interface AddNewPipResponse {
	pipName: string
	userPipUUIDId: number
}
export interface PreviouslyAddedPipsResponse {
	userPipData: PipData[]
}

export interface RetrieveIsPipUUIDValidResponse {
	pipName: string | null
	pipConnectionStatus: ESPConnectionStatus
}

// Sandbox Routes
export interface CreateSandboxProjectResponse {
	sandboxProject: SandboxProject
}

export interface RetrieveSandboxProjectResponse {
	sandboxProject: SandboxProject | null
}

export interface RetrieveSandboxProjectsResponse {
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
