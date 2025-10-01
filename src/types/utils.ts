import { UUID } from "crypto"

export type PipUUID = string & { readonly __brand: unique symbol }
export type SiteThemes = "light" | "dark"
export interface PipUUIDInterface {
	pipUUID: PipUUID
}
export type ClassCode = string & { readonly __brand: unique symbol }
export type ChallengeUUID = UUID & { readonly __brand: unique symbol }
export type CareerUUID = UUID & { readonly __brand: unique symbol }

export type HubUUID = UUID & { readonly __brand: unique symbol }
export type ScoreboardUUID = UUID & { readonly __brand: unique symbol }
export type SandboxProjectUUID = UUID & { readonly __brand: unique symbol }
export type LessonUUID = UUID & { readonly __brand: unique symbol }
export type QuestionUUID = UUID & { readonly __brand: unique symbol }
