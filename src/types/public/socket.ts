import { PipConnectionStatus } from "./pip"
import { PipUUIDInterface } from "./utils"

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
	leftHeadlightColor: RGB
	rightHeadlightColor: RGB
}

export interface HeadlightData extends PipUUIDInterface {
	areHeadlightsOn: boolean
}

export interface HornData extends PipUUIDInterface {
	hornStatus: boolean
}

export type Sounds = "fart" | "monkey" | "elephant" | "fanfare" | "ufo" | "countdown" | "engine" | "robot noise"

export interface SoundData extends PipUUIDInterface {
	sound: Sounds
}

// Incoming socket events:
export interface PipStatusUpdate extends PipUUIDInterface{
	newConnectionStatus: PipConnectionStatus
}

export interface SensorPayload {
	leftWheelRPM: number
	rightWheelRPM: number
	irSensorData: number[] & { length: 5 }

	redValue: number
	greenValue: number
	blueValue: number

	pitch: number
	yaw: number
	roll: number

	aX: number
	aY: number
	aZ: number

	gX: number
	gY: number
	gZ: number

	mX: number
	mY: number
	mZ: number
}

export interface IncomingSensorData extends PipUUIDInterface {
	sensorPayload: SensorPayload
}
