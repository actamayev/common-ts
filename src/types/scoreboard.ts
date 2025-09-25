import { ClassCode, ScoreboardUUID } from "./utils"

export interface TeamStats {
	teamName: string
	score: number
}

export interface Scoreboard {
	scoreboardId: ScoreboardUUID
	classCode: ClassCode
	scoreboardName: string
	team1Stats: TeamStats
	team2Stats: TeamStats
	timeRemaining: number
}
