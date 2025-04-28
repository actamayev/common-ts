export type ProjectUUID = `${string}-${string}-${string}-${string}-${string}`

export interface SandboxProject {
	sandboxXml: string
	projectUUID: ProjectUUID
	isStarred: boolean
	projectName: string | null
	createdAt: Date
	updatedAt: Date
	projectNotes: string | null
}
