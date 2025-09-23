import { FunSounds } from "./garage"
import { PipUUID } from "./utils"

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
  | "connected to serial to you"
  | "connected to serial to another user"
  | "connected online to you"
  | "connected online to another user"

// ---------------------------------------------------------------------
// Generic Envelope
// ---------------------------------------------------------------------

interface ESPMessage<TPayload, TRoute extends string = string> {
	route: TRoute
	payload: TPayload
}

// ---------------------------------------------------------------------
// Shared Payloads
// ---------------------------------------------------------------------

export interface StandardJsonStatusMessage {
  status: string
}

export interface DeviceInitialDataPayload {
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

export interface PipIDUpdate {
  pipId: PipUUID
}

// ---------------------------------------------------------------------
// Message Unions
// ---------------------------------------------------------------------

export type ESPCommonMessage =
	| ESPMessage<SensorPayload, "/sensor-data">
	| ESPMessage<SensorPayloadMZ, "/sensor-data-mz">
	| ESPMessage<DinoScorePayload, "/dino-score">
	| ESPMessage<StandardJsonStatusMessage, "/pip-turning-off">

export type ESPToServerMessage =
	| ESPCommonMessage
	| ESPMessage<DeviceInitialDataPayload, "/device-initial-data">
	| ESPMessage<BatteryMonitorDataFull, "/battery-monitor-data-full">

export type ESPToSerialMessage =
	| ESPCommonMessage
	| ESPMessage<PipIDUpdate, "/pip-id">
	| ESPMessage<BytecodeMessage, "/bytecode-status">
	| ESPMessage<WiFiConnectionResultPayload, "/wifi-connection-result">
	| ESPMessage<SavedWiFiNetwork[], "/saved-networks">
	| ESPMessage<ScannedWiFiNetworkItem, "/scan-result-item">
	| ESPMessage<ScanCompletePayload, "/scan-complete">
	| ESPMessage<ScanStartedPayload, "/scan-started">
	| ESPMessage<StandardJsonStatusMessage, "/motors-disabled-usb">
	| ESPMessage<StandardJsonStatusMessage, "/program-paused-usb">
	| ESPMessage<StandardJsonStatusMessage, "/play-fun-sound">
	| ESPMessage<BatteryMonitorDataItem, "/battery-monitor-data-item">
	| ESPMessage<BatteryMonitorDataComplete, "/battery-monitor-data-complete">
	| ESPMessage<DeletedWiFiNetworkPayload, "/wifi-deleted-network">
