import { PipUUID } from "./utils"
import { FunSounds } from "./garage"

// ---------------------------------------------------------------------
// Connection Status Types
// ---------------------------------------------------------------------

export type PipConnectionStatus =
  | "online" // Pip is connected to the internet, but not connected to any browser clients
  | "connected to online user" // Connected to the internet/is active
  | "connected to serial"

export type ClientPipConnectionStatus =
  | "offline"
  | "online"
  | "connected to serial"
  | "connected to another user"
  | "connected to you"

// ---------------------------------------------------------------------
// Generic Envelope
// ---------------------------------------------------------------------

interface ESPMessage<TPayload, TRoute extends string = string> {
	route: TRoute
	pipId: PipUUID
	payload: TPayload
}

interface SerialMessage<TPayload, TRoute extends string = string> {
	route: TRoute
	payload: TPayload
}

// ---------------------------------------------------------------------
// Shared Payloads
// ---------------------------------------------------------------------

export interface StandardJsonStatusMessage {
  status: string
}

export interface RegisterPayload {
  firmwareVersion: number
}

export interface PlayFunSoundPayload {
  sound: FunSounds | null
}

export interface BytecodeMessage {
  message: string
}

export interface WiFiConnectionResultPayload extends StandardJsonStatusMessage {
  status: "success" | "wifi_only" | "failed"
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
  | "estimatedTimeToFull"

export type BatteryMonitorBooleanKey =
  | "isCharging"
  | "isDischarging"
  | "isLowBattery"
  | "isCriticalBattery"

export type BatteryMonitorKey = BatteryMonitorNumericKey | BatteryMonitorBooleanKey

// Type-safe way to get the correct value type for each key
export type BatteryMonitorValueType<K extends BatteryMonitorKey> =
  K extends BatteryMonitorNumericKey ? number : boolean

export interface BatteryMonitorDataItem<K extends BatteryMonitorKey = BatteryMonitorKey> {
  key: K
  value: BatteryMonitorValueType<K>
}

export interface BatteryMonitorDataComplete {
  totalItems: number
}

export interface BatteryMonitorDataFull {
  batteryData: BatteryMonitorData
}

// ---------------------------------------------------------------------
// Sensor Payloads
// ---------------------------------------------------------------------

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

export interface DeletedWiFiNetworkPayload {
  status: boolean
}

// ---------------------------------------------------------------------
// Incoming Socket Events
// ---------------------------------------------------------------------

export interface PipStatusUpdate {
  newConnectionStatus: ClientPipConnectionStatus
}

// ---------------------------------------------------------------------
// Message Unions
// ---------------------------------------------------------------------

export type ESPCommonMessage =
	| ESPMessage<SensorPayload, "/sensor-data">
	| ESPMessage<SensorPayloadMZ, "/sensor-data-mz">
	| ESPMessage<DinoScorePayload, "/dino-score">

export type ESPToServerMessage =
	| ESPCommonMessage
	| ESPMessage<RegisterPayload, "/register">
	| ESPMessage<BatteryMonitorDataFull, "/battery-monitor-data-full">
	| ESPMessage<StandardJsonStatusMessage, "/pip-turning-off">

export type ESPToSerialMessage =
	| SerialMessage<SensorPayload, "/sensor-data">
	| SerialMessage<SensorPayloadMZ, "/sensor-data-mz">
	| SerialMessage<DinoScorePayload, "/dino-score">
	| SerialMessage<BytecodeMessage, "/bytecode-status">
	| SerialMessage<WiFiConnectionResultPayload, "/wifi-connection-result">
	| ESPMessage<null, "/pip-id">
	| SerialMessage<SavedWiFiNetwork[], "/saved-networks">
	| SerialMessage<ScannedWiFiNetworkItem, "/scan-result-item">
	| SerialMessage<ScanCompletePayload, "/scan-complete">
	| SerialMessage<ScanStartedPayload, "/scan-started">
	| SerialMessage<StandardJsonStatusMessage, "/motors-disabled-usb">
	| SerialMessage<StandardJsonStatusMessage, "/program-paused-usb">
	| SerialMessage<StandardJsonStatusMessage, "/play-fun-sound">
	| SerialMessage<BatteryMonitorDataItem, "/battery-monitor-data-item">
	| SerialMessage<BatteryMonitorDataComplete, "/battery-monitor-data-complete">
	| SerialMessage<DeletedWiFiNetworkPayload, "/wifi-deleted-network">
