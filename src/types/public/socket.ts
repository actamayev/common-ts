import { PipConnectionStatus, SensorPayload, BatteryMonitorDataFull } from "./pip"
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

type SocketEventPayloadMap = {
    "pip-connection-status-update": { pipUUID: PipUUID; newConnectionStatus: PipConnectionStatus }
    "battery-monitor-data": { pipUUID: PipUUID; batteryData: BatteryMonitorDataFull["batteryData"] }
    "sensor-data": { pipUUID: PipUUID; sensorPayload: SensorPayload }
    "general-sensor-data": SensorPayload
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
