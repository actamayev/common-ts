import { PipConnectionStatus, SensorPayload, BatteryMonitorDataFull, PlayFunSoundPayload } from "./pip"
import { PipUUID } from "./utils"
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
    "pip-connection-status-update": { pipUUID: PipUUID; newConnectionStatus: PipConnectionStatus }
    "battery-monitor-data": { pipUUID: PipUUID; batteryData: BatteryMonitorDataFull["batteryData"] }
    "general-sensor-data": { pipUUID: PipUUID; sensorPayload: SensorPayload }
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
