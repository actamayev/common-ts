import { ChatMessage } from "./chat"

export type ProjectUUID = `${string}-${string}-${string}-${string}-${string}`

export interface BlocklyJson {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any
}

export interface SandboxProject {
	sandboxJson: BlocklyJson
	projectUUID: ProjectUUID
	isStarred: boolean
	projectName: string | null
	createdAt: Date
	updatedAt: Date
	projectNotes: string | null
	sandboxChatMessages: ChatMessage[]
}
