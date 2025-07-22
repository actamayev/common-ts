import { PipUUIDInterface } from "./utils"

export type LightAnimation =
	| "No animation"
	| "Breathing"
	| "Rainbow"
	| "Strobe"
	| "Turn off"
	| "Fade out"
	// | "Pause breathing"
	// | "Snake"

export interface BalancePidsProps extends PipUUIDInterface {
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

export type FunSounds = "Fart" | "Monkey" | "Elephant" | "Party" | "UFO" | "Countdown" | "Engine" | "Robot"

export interface MotorControlInput {
	vertical: -1 | 1 | 0
	horizontal: -1 | 1 | 0
}

export interface MotorControlData extends PipUUIDInterface {
	motorControl: MotorControlInput
	motorThrottlePercent: number
}

interface RGB {
	r: number
	g: number
	b: number
}

export interface LedControlData extends PipUUIDInterface {
	topLeftColor: RGB
	topRightColor: RGB
	middleLeftColor: RGB
	middleRightColor: RGB
	backLeftColor: RGB
	backRightColor: RGB
}

export interface HeadlightData extends PipUUIDInterface {
	areHeadlightsOn: boolean
}

export interface HornData extends PipUUIDInterface {
	hornStatus: boolean
}
