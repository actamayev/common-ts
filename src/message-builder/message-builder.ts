import { END_MARKER, START_MARKER } from "../types/private/constants"
import { BalancePidsProps, LedControlData } from "../types/public"
import { BalanceStatus, HeadlightStatus, HornSoundStatus, LightAnimationType, MessageType, SoundType, SpeakerStatus } from "./protocol"

export class MessageBuilder {
	// Add this helper method for framing messages
	private static frameMessage(messageType: MessageType, payload: Uint8Array | null = null): ArrayBuffer {
		const payloadLength = payload ? payload.length : 0

		// For payloads larger than 255 bytes, we need 2 bytes for length
		const useLongFormat = payloadLength > 255

		// Calculate total buffer size: START(1) + TYPE(1) + FORMAT(1) + LENGTH(1 or 2) + payload + END(1)
		const lengthBytes = useLongFormat ? 2 : 1
		const buffer = new ArrayBuffer(1 + 1 + 1 + lengthBytes + payloadLength + 1)
		const view = new DataView(buffer)
		const uint8View = new Uint8Array(buffer)

		let offset = 0

		// Set START marker
		view.setUint8(offset++, START_MARKER)

		// Set message type
		view.setUint8(offset++, messageType)

		// Set format flag (0 = short format with 1-byte length, 1 = long format with 2-byte length)
		view.setUint8(offset++, useLongFormat ? 1 : 0)

		// Set payload length
		if (useLongFormat) {
			view.setUint16(offset, payloadLength, true) // little-endian
			offset += 2
		} else {
			view.setUint8(offset++, payloadLength)
		}

		// Copy payload if exists
		if (payload && payloadLength > 0) {
			uint8View.set(payload, offset)
			offset += payloadLength
		}

		// Set END marker
		view.setUint8(offset, END_MARKER)

		return buffer
	}

	static createUpdateAvailableMessage(newFirmwareVersion: number): ArrayBuffer {
		const payload = new ArrayBuffer(2)
		const view = new DataView(payload)
		view.setUint16(0, newFirmwareVersion, true) // true for little-endian

		return this.frameMessage(MessageType.UPDATE_AVAILABLE, new Uint8Array(payload))
	}

	static createMotorControlMessage(leftMotor: number, rightMotor: number): ArrayBuffer {
		const payload = new ArrayBuffer(4)
		const view = new DataView(payload)

		view.setInt16(0, leftMotor, true)  // Little endian
		view.setInt16(2, rightMotor, true) // Little endian

		return this.frameMessage(MessageType.MOTOR_CONTROL, new Uint8Array(payload))
	}

	static createSoundMessage(soundType: SoundType): ArrayBuffer {
		const payload = new Uint8Array([soundType])
		return this.frameMessage(MessageType.SOUND_COMMAND, payload)
	}

	static createStopSoundMessage(): ArrayBuffer {
		return this.frameMessage(MessageType.STOP_SOUND)
	}

	static createHornSoundMessage(holdSoundType: boolean): ArrayBuffer {
		const payload = new Uint8Array([holdSoundType ? HornSoundStatus.ON : HornSoundStatus.OFF])
		return this.frameMessage(MessageType.UPDATE_HORN_SOUND, payload)
	}

	static createLightAnimationMessage(lightMessageType: LightAnimationType): ArrayBuffer {
		const payload = new Uint8Array([lightMessageType])
		return this.frameMessage(MessageType.UPDATE_LIGHT_ANIMATION, payload)
	}

	static createLedMessage(data: Omit<LedControlData, "pipUUID">): ArrayBuffer {
		// Create payload for 6 RGB colors × 3 components
		const payload = new ArrayBuffer(6 * 3)
		const view = new DataView(payload)
		let offset = 0

		// Top Left Color
		view.setUint8(offset++, data.topLeftColor.r)
		view.setUint8(offset++, data.topLeftColor.g)
		view.setUint8(offset++, data.topLeftColor.b)

		// Top Right Color
		view.setUint8(offset++, data.topRightColor.r)
		view.setUint8(offset++, data.topRightColor.g)
		view.setUint8(offset++, data.topRightColor.b)

		// Middle Left Color
		view.setUint8(offset++, data.middleLeftColor.r)
		view.setUint8(offset++, data.middleLeftColor.g)
		view.setUint8(offset++, data.middleLeftColor.b)

		// Middle Right Color
		view.setUint8(offset++, data.middleRightColor.r)
		view.setUint8(offset++, data.middleRightColor.g)
		view.setUint8(offset++, data.middleRightColor.b)

		// Back Left Color
		view.setUint8(offset++, data.backLeftColor.r)
		view.setUint8(offset++, data.backLeftColor.g)
		view.setUint8(offset++, data.backLeftColor.b)

		// Back Right Color
		view.setUint8(offset++, data.backRightColor.r)
		view.setUint8(offset++, data.backRightColor.g)
		view.setUint8(offset++, data.backRightColor.b)

		return this.frameMessage(MessageType.UPDATE_LED_COLORS, new Uint8Array(payload))
	}

	static createDisplayBufferMessage(displayBuffer: Uint8Array): ArrayBuffer | null {
		// The display buffer should be exactly 1024 bytes for SSD1306 (128 columns × 8 pages)
		if (displayBuffer.length !== 1024) {
			console.error(`Invalid display buffer size: expected 1024 bytes, got ${displayBuffer.length}`)
			return null
		}

		return this.frameMessage(MessageType.UPDATE_DISPLAY, displayBuffer)
	}

	static createSpeakerMuteMessage(audibleStatus: boolean): ArrayBuffer {
		const payload = new Uint8Array([audibleStatus ? SpeakerStatus.MUTED : SpeakerStatus.UNMUTED])
		return this.frameMessage(MessageType.SPEAKER_MUTE, payload)
	}

	static createSpeakerVolumeMessage(volume: number): ArrayBuffer {
		// Volume will come in between 0 and 100, we need to convert from 0-3.9
		const volumeFloat = volume / 100 * 3.9
		const payload = new ArrayBuffer(4) // 4 bytes for a float32
		const view = new DataView(payload)
		view.setFloat32(0, volumeFloat, true) // little-endian
		return this.frameMessage(MessageType.SPEAKER_VOLUME, new Uint8Array(payload))
	}

	static createHeadlightMessage(headlightStatus: boolean): ArrayBuffer {
		const payload = new Uint8Array([headlightStatus ? HeadlightStatus.ON : HeadlightStatus.OFF])
		return this.frameMessage(MessageType.UPDATE_HEADLIGHT, payload)
	}

	static createBalanceMessage(balanceStatus: boolean): ArrayBuffer {
		const payload = new Uint8Array([balanceStatus ? BalanceStatus.BALANCED : BalanceStatus.UNBALANCED])
		return this.frameMessage(MessageType.BALANCE_CONTROL, payload)
	}

	static createUpdateBalancePidsMessage(props: Omit<BalancePidsProps, "pipUUID">): ArrayBuffer {
		const payload = new ArrayBuffer(40) // 10 float values * 4 bytes each = 40 bytes
		const view = new DataView(payload)
		let offset = 0

		view.setFloat32(offset, props.pValue, true); offset += 4
		view.setFloat32(offset, props.iValue, true); offset += 4
		view.setFloat32(offset, props.dValue, true); offset += 4
		view.setFloat32(offset, props.ffValue, true); offset += 4
		view.setFloat32(offset, props.targetAngle, true); offset += 4
		view.setFloat32(offset, props.maxSafeAngleDeviation, true); offset += 4
		view.setFloat32(offset, props.updateInterval, true); offset += 4
		view.setFloat32(offset, props.deadbandAngle, true); offset += 4
		view.setFloat32(offset, props.maxStableRotation, true); offset += 4
		view.setFloat32(offset, props.minEffectivePwm, true)

		return this.frameMessage(MessageType.UPDATE_BALANCE_PIDS, new Uint8Array(payload))
	}

	static createBytecodeMessage(bytecodeFloat32: Float32Array): ArrayBuffer {
		// Get the raw bytes from the Float32Array
		const bytecodeBytes = new Uint8Array(bytecodeFloat32.buffer)

		// Use the framing helper
		return this.frameMessage(MessageType.BYTECODE_PROGRAM, bytecodeBytes)
	}

	static createStopSandboxCodeMessage(): ArrayBuffer {
		// No payload for this message
		return this.frameMessage(MessageType.STOP_SANDBOX_CODE)
	}

	// For handshake, keepalive and end messages, which don't have payloads
	static createSerialHandshakeMessage(): ArrayBuffer {
		return this.frameMessage(MessageType.SERIAL_HANDSHAKE)
	}

	static createSerialKeepaliveMessage(): ArrayBuffer {
		return this.frameMessage(MessageType.SERIAL_KEEPALIVE)
	}

	static createSerialEndMessage(): ArrayBuffer {
		return this.frameMessage(MessageType.SERIAL_END)
	}

	// We are not longer use createStartSensorPollingMessage (this was previously used to start all sensors polling)
	// Now we poll sensors selectively (bytecode filters what needs to be polled).
	// Needs to be repurposed.
	static createStartSensorPollingMessage(): ArrayBuffer {
		return this.frameMessage(MessageType.START_SENSOR_POLLING)
	}

	static createStopSensorPollingMessage(): ArrayBuffer {
		return this.frameMessage(MessageType.STOP_SENSOR_POLLING)
	}

	static createGetSavedWiFiNetworks(): ArrayBuffer {
		return this.frameMessage(MessageType.GET_SAVED_WIFI_NETWORKS)
	}

	static createSoftScanWiFiNetworksMessage(): ArrayBuffer {
		return this.frameMessage(MessageType.SOFT_SCAN_WIFI_NETWORKS)
	}

	static createHardScanWiFiNetworksMessage(): ArrayBuffer {
		return this.frameMessage(MessageType.HARD_SCAN_WIFI_NETWORKS)
	}

	static createIntroS1P7Message(): ArrayBuffer {
		return this.frameMessage(MessageType.INTRO_S1_P7)
	}

	static createWiFiCredentialsMessage(ssid: string, password: string): ArrayBuffer {
		const ssidBytes = new TextEncoder().encode(ssid)
		const passwordBytes = new TextEncoder().encode(password)

		// Payload: [ssid_length: 1 byte][ssid_bytes][password_length: 1 byte][password_bytes]
		const payload = new ArrayBuffer(2 + ssidBytes.length + passwordBytes.length)
		const view = new DataView(payload)
		const uint8View = new Uint8Array(payload)

		let offset = 0

		// SSID length and data
		view.setUint8(offset++, ssidBytes.length)
		uint8View.set(ssidBytes, offset)
		offset += ssidBytes.length

		// Password length and data
		view.setUint8(offset++, passwordBytes.length)
		uint8View.set(passwordBytes, offset)

		return this.frameMessage(MessageType.WIFI_CREDENTIALS, new Uint8Array(payload))
	}

	static createRequestBatteryMonitorDataMessage(): ArrayBuffer {
		return this.frameMessage(MessageType.REQUEST_BATTERY_MONITOR_DATA)
	}
}
