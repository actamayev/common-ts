import { BlockNames } from "./blockly/blockly"
import { LessonUUID, QuestionUUID } from "./utils"
import { BlocklyJson } from "./sandbox"

export type QuestionType =
	| "BLOCK_TO_FUNCTION"
	| "FUNCTION_TO_BLOCK"
	| "FILL_IN_BLANK"
	| "ACTION_TO_CODE_MULTIPLE_CHOICE"
	| "ACTION_TO_CODE_OPEN_ENDED"
	| "MATCHING"

export interface Lesson {
	lessonId: LessonUUID
	lessonName: string
	isCompleted: boolean
	lessonOrder: number
}

// Lesson with questions (used by get-single-lesson)
export interface DetailedLesson extends Lesson {
	lessonQuestionMap: LessonQuestionMap[]
}

// Ordering and mapping of questions within a lesson
export interface LessonQuestionMap {
	lessonQuestionMapId: number
	order: number
	question: Question
}

// Core question shape with optional polymorphic payloads
export interface Question {
	questionId: QuestionUUID
	questionType: QuestionType
	blockToFunctionFlashcard: {
		questionText: string
		codingBlock: CodingBlock
		blockToFunctionAnswerChoice: BlockToFunctionAnswerChoice[]
	} | null
	functionToBlockFlashcard: {
		questionText: string
		functionToBlockAnswerChoice: FunctionToBlockAnswerChoice[]
	} | null
	fillInTheBlank: {
		questionText: string
		initialBlocklyJson: BlocklyJson
		availableBlocks: BlockBankData[]
	} | null
	actionToCodeMultipleChoice: {
		questionText: string
		referenceSolutionCpp: string
		actionToCodeMultipleChoiceAnswerChoice: ActionToCodeMultipleChoiceAnswerChoice[]
	} | null
	actionToCodeOpenEnded: {
		questionText: string
		initialBlocklyJson: BlocklyJson
		referenceSolutionCpp: string
		availableBlocks: BlockBankData[]
	} | null
	matching: {
		questionText: string
		matchingAnswerChoice: MatchingAnswerChoice[]
	} | null
}

// Nested answer choice/blocks types
export interface BlockToFunctionAnswerChoice {
	blockToFunctionAnswerChoiceId: number
	order: number
	functionDescriptionText: string
}

export interface FunctionToBlockAnswerChoice {
	functionToBlockAnswerChoiceId: number
	order: number
	codingBlock: CodingBlock
}

export interface MatchingAnswerChoice {
	matchingAnswerChoicePairId: number
	codingBlock: CodingBlock
	matchingAnswerChoiceText: MatchingAnswerChoiceText
}

export interface BlockBankData {
	blockNameId: number
	blockName: BlockNames
}

export interface ActionToCodeMultipleChoiceAnswerChoice {
	actionToCodeMultipleChoiceAnswerChoiceId: number
	order: number
	codingBlock: CodingBlock
}

export interface CodingBlock {
	codingBlockId: number
	codingBlockJson: BlocklyJson
}

export interface MatchingAnswerChoiceText {
	matchingAnswerChoiceTextId: number
	answerChoiceText: string
}
