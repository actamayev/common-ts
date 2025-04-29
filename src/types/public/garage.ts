import { PipUUID } from "./utils"

export type LightAnimation =
	| "No animation"
	| "Breathing"
	| "Rainbow"
	| "Strobe"
	| "Turn off"
	| "Fade out"
	// | "Pause breathing"
	// | "Snake"

export interface BalancePidsProps {
	pipUUID: PipUUID
	targetAngle: number
	pValue: number
	iValue: number
	dValue: number
	ffValue: number
	maxSafeAngleDeviation: number
	updateInterval: number
	deadbandAngle: number
	maxStableRotation: number
	minEffectivePwm: number
}
