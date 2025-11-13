import { SandboxProjectUUID } from "./utils"
import { SandboxChatMessage } from "./chat"
import { BlockNames } from "./blockly/blockly"

export interface BlocklyJson {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any
}

export interface SandboxProject {
	sandboxJson: BlocklyJson
	sandboxProjectUUID: SandboxProjectUUID
	isStarred: boolean
	projectName: string | null
	createdAt: Date
	updatedAt: Date
	projectNotes: string | null
	sandboxChatMessages: SandboxChatMessage[]
	isMyProject: boolean
	sharedWith: SingleSearchByUsernameResult[]
}

export interface ToolboxItem {
	kind: "block"
	type: BlockNames
}

export interface SingleSearchByUsernameResult {
	userId: number
	username: string
	name: string | null
	profilePictureUrl: string | null
}
