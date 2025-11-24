export interface ArcadeScore {
	arcadeScoreId: number
	arcadeGameName: ArcadeGameType
	score: number
	username: string
	createdAt: Date
}

export type ArcadeGameType = "flappyBird" | "cityDriver" | "turretDefense"
