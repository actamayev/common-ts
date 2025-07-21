import { FunSounds } from "./garage"
import { PipUUID, PipUUIDInterface } from "./utils"

export type PipConnectionStatus =
	| ESPConnectionStatus
	// | "offline" | // Pip is not connected to the internet/ is turned off.
	| "online" // Pip is connected to the internet, but not connected to any browser clients
	// "updating firmware" // ESP changed to this state when client approves firmware update
	| "connected to other user" // Connected to someone else
	// | "connected" // Connected to me
	| "connected to serial"

export type ESPConnectionStatus =
	| "offline" // Not connected to internet/is turned off.
	| "updating firmware" // ESP changed to this state when client approves firmware update
	| "connected" // Connected to the internet/is active

export interface PipData extends PipUUIDInterface {
	pipName: string
	userPipUUIDId: number
	pipConnectionStatus: PipConnectionStatus
}

export interface FirmwareData {
	firmwareVersion: number
	firmwareBuffer: Buffer
}

type RoutePayloadMap = {
	"/register": PipUUIDPayload
	"/sensor-data": SensorPayload
	"/bytecode-status": BytecodeMessage
	"/wifi-connection-result": WiFiConnectionResultPayload
	"/pip-id": PipIDPayload
	"/saved-networks": SavedWiFiNetwork[]
	"/scan-result-item": ScannedWiFiNetworkItem
	"/scan-complete": ScanCompletePayload
	"/scan-started": ScanStartedPayload
	"/motors-disabled-usb": StandardJsonStatusMessage
	"/program-paused-usb": StandardJsonStatusMessage
	"/play-fun-sound": StandardJsonStatusMessage
	"/battery-monitor-data-item": BatteryMonitorDataItem
	"/battery-monitor-data-complete": BatteryMonitorDataComplete
	"/battery-monitor-data-full": BatteryMonitorDataFull // This is only for WS (not sent over Serial (Serial doesn't have enough space))
}

// Routes derived from the keys of the mapping
type ESPRoutes = keyof RoutePayloadMap

// Type-safe message interface
export interface ESPMessage<R extends ESPRoutes = ESPRoutes> {
	route: R
	payload: RoutePayloadMap[R]
}

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
