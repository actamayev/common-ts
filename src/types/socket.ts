import { ClientPipConnectionStatus, SensorPayload, BatteryMonitorDataFull, SensorPayloadMZ } from "./pip"
import { StudentViewHubData } from "./hub"
import { ClassCode, HubUUID, PipUUIDInterface } from "./utils"
import {
	ChallengeChatbotStreamStartEvent,
	ChallengeChatbotStreamChunkEvent,
	ChallengeChatbotStreamCompleteEvent,
	CareerChatbotStreamStartOrCompleteEvent,
	CareerChatbotChunkEvent,
	SandboxChatbotStreamStartOrCompleteEvent,
	SandboxChatbotStreamChunkEvent
} from "./chat"
import { MotorControlData, LedControlData, HeadlightData } from "./garage"
import { ToneType } from "../message-builder/protocol"

export type SocketEventPayloadMap = {
    "pip-connection-status-update": PipConnectionUpdate
    "battery-monitor-data": BatteryMonitorDataUpdate
    "general-sensor-data": SensorPayload
    "general-sensor-data-mz": SensorPayloadMZ
    "student-joined-classroom": StudentJoinedClassroom
    "challenge-chatbot-stream-start": ChallengeChatbotStreamStartEvent
    "challenge-chatbot-stream-chunk": ChallengeChatbotStreamChunkEvent
    "challenge-chatbot-stream-complete": ChallengeChatbotStreamCompleteEvent
    "career-chatbot-stream-start": CareerChatbotStreamStartOrCompleteEvent
    "career-chatbot-stream-chunk": CareerChatbotChunkEvent
    "career-chatbot-stream-complete": CareerChatbotStreamStartOrCompleteEvent
    "sandbox-chatbot-stream-start": SandboxChatbotStreamStartOrCompleteEvent
    "sandbox-chatbot-stream-chunk": SandboxChatbotStreamChunkEvent
    "sandbox-chatbot-stream-complete": SandboxChatbotStreamStartOrCompleteEvent
    "dino-score-update": DinoScoreUpdate
    "new-hub": StudentViewHubData
    "deleted-hub": DeletedHub
    "updated-hub-slide-id": UpdatedHubSlideId
    "student-joined-hub": StudentJoinedHub
    "student-left-hub": StudentLeftHub
    "dino-score-update-all-peers": DinoScoreUpdateAllPeers
    "garage-driving-status-update": GarageDrivingStatusUpdate
    "garage-tones-status-update": GarageTonesStatusUpdate
    "garage-lights-status-update": GarageLightsStatusUpdate
    "garage-display-status-update": GarageDisplayStatusUpdate
}

export type SocketEvents = keyof SocketEventPayloadMap

export interface SocketEventMessage<E extends SocketEvents = SocketEvents> {
    event: E
    payload: SocketEventPayloadMap[E]
}

export type ClientSocketEventPayloadMap = {
    "motor-control": MotorControlData
    "new-led-colors": LedControlData
    "headlight-update": HeadlightData
    "play-tone": PlayTonePayload
}

export type ClientSocketEvents = keyof ClientSocketEventPayloadMap

export interface ClientSocketEventMessage<E extends ClientSocketEvents = ClientSocketEvents> {
	event: E
	payload: ClientSocketEventPayloadMap[E]
}

export interface PipConnectionUpdate extends PipUUIDInterface {
    newConnectionStatus: ClientPipConnectionStatus
}

export interface BatteryMonitorDataUpdate extends PipUUIDInterface {
    batteryData: BatteryMonitorDataFull["batteryData"]
}

export interface DinoScoreUpdate extends PipUUIDInterface {
    score: number
}

export interface StudentJoinedClassroom {
    studentId: number
    classCode: ClassCode
    studentUsername: string
}

export interface DeletedHub {
    classCode: ClassCode
    hubId: HubUUID
}

export interface UpdatedHubSlideId {
    classCode: ClassCode
    hubId: HubUUID
    newSlideId: string
}

export interface StudentLeftHub {
    classCode: ClassCode
    hubId: HubUUID
    studentUserId: number
}

export interface StudentJoinedHub extends StudentLeftHub {
    studentUsername: string
}

export interface DinoScoreUpdateAllPeers {
    score: number
    username: string
}

export interface GarageDrivingStatusUpdate {
    garageDrivingStatus: boolean
}

export interface GarageTonesStatusUpdate {
    garageTonesStatus: boolean
}

export interface GarageLightsStatusUpdate {
    garageLightsStatus: boolean
}

export interface GarageDisplayStatusUpdate {
    garageDisplayStatus: boolean
}

export interface PlayTonePayload extends PipUUIDInterface {
    toneType: ToneType
}
