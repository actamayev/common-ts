import { ClassCode, ScoreboardUUID } from "./utils"

export interface StudentJoinedScoreboardData {
	studentId: number
	username: string
}

export interface TeamStats {
	teamName: string
	score: number
	students: StudentJoinedScoreboardData[]
}

export interface Scoreboard {
	scoreboardId: ScoreboardUUID
	classCode: ClassCode
	scoreboardName: string
	team1Stats: TeamStats
	team2Stats: TeamStats
	timeRemaining: number
}
