import { ClientPipConnectionStatus } from "./pip"
import { BlocklyJson, SandboxProject } from "./sandbox"
import { StudentViewHubData, TeacherViewHubData } from "./hub"
import { RetrievedQuestions, UserActivityProgress } from "./lab"
import { ChallengeChatMessage, SandboxChatMessage } from "./chat"
import { ChallengeUUID, ClassCode, HubUUID, PipUUID, SiteThemes } from "./utils"

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

export interface RetrieveIsPipUUIDValidResponse {
	pipName: string | null
	pipConnectionStatus: ClientPipConnectionStatus
}

// Pip Routes
export interface RetrieveActivePipConnectionResponse {
	pipUUID: PipUUID | null
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

export interface StudentClassroomData {
	studentId: number
	joinedClassroomAt: Date | null
	classroomName: string
	classCode: ClassCode
	activeHubs: StudentViewHubData[]
	garageDrivingAllowed: boolean
	garageSoundsAllowed: boolean
	garageLightsAllowed: boolean
	garageDisplayAllowed: boolean
}

//Teacher Routes
export interface BasicTeacherClassroomData {
	classroomName: string
	classCode: ClassCode
}

export interface DetailedClassroomData extends BasicTeacherClassroomData {
	students: {
		studentId: number
		username: string
		garageDrivingAllowed: boolean
		garageSoundsAllowed: boolean
		garageLightsAllowed: boolean
		garageDisplayAllowed: boolean
	}[]
	activeHubs: TeacherViewHubData[]
}

export interface ClassCodeResponse {
	classCode: ClassCode
}

export interface IncomingTeacherRequestData {
	teacherFirstName: string
	teacherLastName: string
	schoolName: string
}

export interface CreateHubRequest {
	hubId: HubUUID
}

// Common Responses:
export type SuccessResponse = { success: string }
export type MessageResponse = { message: string }
export type ValidationErrorResponse = { validationError: string }
export type ErrorResponse = { error: string }
export type ErrorResponses = ValidationErrorResponse | ErrorResponse
export type NonSuccessResponse = MessageResponse | ErrorResponses
export type AllCommonResponses = SuccessResponse | NonSuccessResponse
