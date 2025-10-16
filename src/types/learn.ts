import { BlockNames } from "./blockly/blockly"
import { LessonUUID, QuestionUUID } from "./utils"
import { BlocklyJson } from "./sandbox"

export type QuestionType =
	| "BLOCK_TO_FUNCTION"
	| "FUNCTION_TO_BLOCK"
	| "FILL_IN_BLANK"

export interface Lesson {
	lessonId: LessonUUID
	lessonName: string
	isCompleted: boolean
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
		availableBlocks: FillInTheBlankBlockBank[]
	} | null
}

// Nested answer choice/blocks types
export interface BlockToFunctionAnswerChoice {
	blockToFunctionAnswerChoiceId: number
	order: number
	functionDescriptionText: string
	isCorrect: boolean
}

export interface FunctionToBlockAnswerChoice {
	functionToBlockAnswerChoiceId: number
	order: number
	codingBlock: CodingBlock
	isCorrect: boolean
}

export interface FillInTheBlankBlockBank {
	blockNameId: number
	blockName: BlockNames
}

export interface CodingBlock {
	codingBlockId: number
	codingBlockJson: BlocklyJson
}
