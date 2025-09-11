/* eslint-disable @typescript-eslint/naming-convention */

import { CqChallengeData } from "../career-quest"
import { DRIVING_SCHOOL_CHALLENGES } from "./driving-school-challenge-data"
import { OBSTACLE_AVOIDANCE_CHALLENGES } from "./obstacle-avoidance-challenge-data"

export const CHALLENGES: CqChallengeData[] = [
	...OBSTACLE_AVOIDANCE_CHALLENGES,
	...DRIVING_SCHOOL_CHALLENGES,
]
