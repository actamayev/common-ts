export type ActivityUUID = string & { readonly __brand: unique symbol }
export type QuestionUUID = string & { readonly __brand: unique symbol }
export type ProgressStatus = "IN_PROGRESS" | "COMPLETED" | null
export type ActivityType =
	| "Reading"
	// | "Video"
	| "Code"
	| "Demo"
	| "Summary"
export interface UserActivityProgress {
	status: ProgressStatus
	activityUUID: ActivityUUID
	activityType: ActivityType
	activityName: string
}
export interface RetrievedQuestions {
	questionText: string
	readingQuestionId: number
	readingQuestionUUID: QuestionUUID
	questionAnswerChoices: {
		answerText: string
		isCorrect: boolean
		explanation: string
		didUserSelectAnswer: boolean
	}[]
}
