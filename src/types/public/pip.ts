import { SensorPayload } from "./socket"
import { PipUUID, PipUUIDInterface } from "./utils"

export type PipConnectionStatus =
	| ESPConnectionStatus
	// | "offline" | // Pip is not connected to the internet/ is turned off.
	| "online" // Pip is connected to the internet, but not connected to any browser clients
	// "updating firmware" // ESP changed to this state when client approves firmware update
	| "connected to other user" // Connected to someone else
	// | "connected" // Connected to me

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

export type RoutePayloadMap = {
	"/register": PipUUIDPayload
	"/sensor-data": SensorPayload
	"/bytecode-status": BytecodeMessage
}

// Routes derived from the keys of the mapping
export type ESPRoutes = keyof RoutePayloadMap

// Type-safe message interface
export interface ESPMessage<R extends ESPRoutes = ESPRoutes> {
	route: R
	payload: RoutePayloadMap[R]
}

export interface PipUUIDPayload {
	pipUUID: PipUUID
	firmwareVersion: number
}

export interface BytecodeMessage {
	message: string
}
