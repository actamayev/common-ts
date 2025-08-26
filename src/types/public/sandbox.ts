import { UUID } from "crypto"
import { BlockNames } from "./blockly"
import { SandboxChatMessage } from "./chat"

export type ProjectUUID = UUID

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
	sandboxChatMessages: SandboxChatMessage[]
}

export interface ToolboxItem {
	kind: "block"
	type: BlockNames
}
