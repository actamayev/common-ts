import { FunSounds } from "./garage"
import { PipUUID, PipUUIDInterface } from "./utils"

export type PipConnectionStatus =
	| "off" // Turned off.
	| "online" // Pip is connected to the internet, but not connected to any browser clients
	| "connected to online user" // Connected to the internet/is active
	| "connected to serial"

export interface FirmwareData {
	firmwareVersion: number
	firmwareBuffer: Buffer
}

export type ESPMessage =
    | { route: "/register"; payload: PipUUIDPayload }
    | { route: "/sensor-data"; payload: SensorPayload }
    | { route: "/sensor-data-mz"; payload: SensorPayloadMZ }
    | { route: "/bytecode-status"; payload: BytecodeMessage }
    | { route: "/wifi-connection-result"; payload: WiFiConnectionResultPayload }
    | { route: "/pip-id"; payload: PipIDPayload }
    | { route: "/saved-networks"; payload: SavedWiFiNetwork[] }
    | { route: "/scan-result-item"; payload: ScannedWiFiNetworkItem }
    | { route: "/scan-complete"; payload: ScanCompletePayload }
    | { route: "/scan-started"; payload: ScanStartedPayload }
    | { route: "/motors-disabled-usb"; payload: StandardJsonStatusMessage }
    | { route: "/program-paused-usb"; payload: StandardJsonStatusMessage }
    | { route: "/play-fun-sound"; payload: StandardJsonStatusMessage }
    | { route: "/battery-monitor-data-item"; payload: BatteryMonitorDataItem }
    | { route: "/battery-monitor-data-complete"; payload: BatteryMonitorDataComplete }
    | { route: "/battery-monitor-data-full"; payload: BatteryMonitorDataFull }
    | { route: "/pip-turning-off"; payload: StandardJsonStatusMessage }
    | { route: "/dino-score"; payload: DinoScorePayload }

export interface StandardJsonStatusMessage {
	status: string
}

export interface PipUUIDPayload extends PipUUIDInterface {
	firmwareVersion: number
}

export interface PlayFunSoundPayload extends PipUUIDInterface {
	sound: FunSounds | null
}

export interface BytecodeMessage {
	message: string
}

export interface WiFiConnectionResultPayload extends StandardJsonStatusMessage {
    status: "success" | "wifi_only" | "failed"
}

export interface PipIDPayload {
    pipId: PipUUID
}

export interface BatteryMonitorData {
	stateOfCharge: number
	voltage: number
	current: number
	power: number
	remainingCapacity: number
	fullCapacity: number
	health: number
	isCharging: boolean
	isDischarging: boolean
	isLowBattery: boolean
	isCriticalBattery: boolean
	estimatedTimeToEmpty: number
	estimatedTimeToFull: number
}

export type BatteryMonitorNumericKey =
    | "stateOfCharge"
    | "voltage"
    | "current"
    | "power"
    | "remainingCapacity"
    | "fullCapacity"
    | "health"
    | "estimatedTimeToEmpty"
    | "estimatedTimeToFull";

export type BatteryMonitorBooleanKey =
    | "isCharging"
    | "isDischarging"
    | "isLowBattery"
    | "isCriticalBattery";

export type BatteryMonitorKey = BatteryMonitorNumericKey | BatteryMonitorBooleanKey;

// Type-safe way to get the correct value type for each key
export type BatteryMonitorValueType<K extends BatteryMonitorKey> =
    K extends BatteryMonitorNumericKey ? number : boolean;

// Type-safe BatteryMonitorDataItem
export interface BatteryMonitorDataItem<K extends BatteryMonitorKey = BatteryMonitorKey> {
    key: K;
    value: BatteryMonitorValueType<K>;
}

export interface BatteryMonitorDataComplete {
	totalItems: number
}

export interface BatteryMonitorDataFull {
	batteryData: BatteryMonitorData
}

// Incoming socket events:
export interface PipStatusUpdate extends PipUUIDInterface {
	newConnectionStatus: PipConnectionStatus
}

// This is both the data that Pip sends to the server, and the data the server sends to client
export interface SensorPayload {
	leftWheelRPM?: number
	rightWheelRPM?: number
	irSensorData?: number[] & { length: 5 }

	redValue?: number
	greenValue?: number
	blueValue?: number

	pitch?: number
	yaw?: number
	roll?: number

	aX?: number
	aY?: number
	aZ?: number

	gX?: number
	gY?: number
	gZ?: number

	mX?: number
	mY?: number
	mZ?: number

	leftSideTofCounts?: number
	rightSideTofCounts?: number
}

export interface SensorPayloadMZ {
	row: number
	distances?: number[] & { length: 8 }
}

export interface SavedWiFiNetwork {
    ssid: string
    index: number
}

export interface ScannedWiFiNetworkItem {
    ssid: string
    rssi: number
    encrypted: boolean
}

export interface ScanCompletePayload {
    totalNetworks: number
}

export interface ScanStartedPayload {
    scanning: boolean
}

export interface DinoScorePayload {
    score: number
}
