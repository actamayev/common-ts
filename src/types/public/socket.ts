import { UUID } from "crypto"
import { PipConnectionStatus, SensorPayload, BatteryMonitorDataFull, PlayFunSoundPayload, SensorPayloadMZ } from "./pip"
import { StudentViewHubData } from "./hub"
import { ClassCode, PipUUIDInterface } from "./utils"
import {
	ChallengeChatbotStreamStartEvent,
	ChallengeChatbotStreamChunkEvent,
	ChallengeChatbotStreamCompleteEvent,
	CareerChatbotStreamStartOrCompleteEvent,
	CareerChatbotChunkEvent,
	SandboxChatbotStreamStartOrCompleteEvent,
	SandboxChatbotStreamChunkEvent
} from "./chat"
import { StudentInviteJoinClass } from "./classroom"
import { MotorControlData, LedControlData, HeadlightData, HornData } from "./garage"

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
    "student-invite-join-class": StudentInviteJoinClass
    "dino-score-update": DinoScoreUpdate
    "new-hub": StudentViewHubData
    "deleted-hub": DeletedHub
    "updated-hub-slide-id": UpdatedHubSlideId
    "student-joined-hub": StudentJoinedOrLeftHub
    "student-left-hub": StudentJoinedOrLeftHub
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
	"horn-sound-update": HornData
	"play-fun-sound": PlayFunSoundPayload
}

export type ClientSocketEvents = keyof ClientSocketEventPayloadMap

export interface ClientSocketEventMessage<E extends ClientSocketEvents = ClientSocketEvents> {
	event: E
	payload: ClientSocketEventPayloadMap[E]
}

export interface PipConnectionUpdate extends PipUUIDInterface {
    newConnectionStatus: PipConnectionStatus
}

export interface BatteryMonitorDataUpdate extends PipUUIDInterface {
    batteryData: BatteryMonitorDataFull["batteryData"]
}

export interface DinoScoreUpdate extends PipUUIDInterface {
    score: number
}

export interface StudentJoinedClassroom {
    classCode: ClassCode
    studentUsername: string
}

export interface DeletedHub {
    classCode: ClassCode
    hubId: UUID
}

export interface UpdatedHubSlideId {
    classCode: ClassCode
    hubId: UUID
    newSlideId: string
}

export interface StudentJoinedOrLeftHub {
    classCode: ClassCode
    hubId: UUID
    studentUserId: number
    studentUsername: string
}
