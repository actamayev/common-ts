export type ProjectUUID = `${string}-${string}-${string}-${string}-${string}`

export interface SandboxProject {
	sandboxJson: { // Directly from Blockly
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[key: string]: any
	}
	projectUUID: ProjectUUID
	isStarred: boolean
	projectName: string | null
	createdAt: Date
	updatedAt: Date
	projectNotes: string | null
}
