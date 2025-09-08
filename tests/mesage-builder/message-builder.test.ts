import { MessageBuilder } from "../../src/message-builder/message-builder"
import {
	BalanceStatus, CareerType, HeadlightStatus, HornSoundStatus, MeetPipTriggerType, LightAnimationType,
	MessageType, SoundType, SpeakerStatus,
} from "../../src/message-builder/protocol"
import { END_MARKER, START_MARKER } from "../../src/types/public/utils/constants"
import { BalancePidsProps, LedControlData } from "../../src/types/public/garage"

describe("MessageBuilder", () => {
	// Helper function to validate frame structure
	function validateFrameStructure(buffer: ArrayBuffer, messageType: MessageType, payloadLength: number): void {
		const view = new DataView(buffer)

		// Check start marker
		expect(view.getUint8(0)).toBe(START_MARKER)

		// Check message type
		expect(view.getUint8(1)).toBe(messageType)

		// Check format flag and length
		const useLongFormat = view.getUint8(2) !== 0

		if (useLongFormat) {
			expect(view.getUint16(3, true)).toBe(payloadLength)
			// Check end marker (header + payload + end marker)
			expect(view.getUint8(5 + payloadLength)).toBe(END_MARKER)
		} else {
			expect(view.getUint8(3)).toBe(payloadLength)
			// Check end marker (header + payload + end marker)
			expect(view.getUint8(4 + payloadLength)).toBe(END_MARKER)
		}

		// Check total buffer length
		const expectedLength = useLongFormat ?
			1 + 1 + 1 + 2 + payloadLength + 1 : // START + TYPE + FORMAT + LENGTH(2) + payload + END
			1 + 1 + 1 + 1 + payloadLength + 1  // START + TYPE + FORMAT + LENGTH(1) + payload + END

		expect(buffer.byteLength).toBe(expectedLength)
	}

	// Helper function to get the offset where payload begins
	function getPayloadOffset(buffer: ArrayBuffer): number {
		const view = new DataView(buffer)
		const useLongFormat = view.getUint8(2) !== 0
		return useLongFormat ? 5 : 4  // 5 for long format, 4 for short format
	}

	describe("createUpdateAvailableMessage", () => {
		it("should create a valid update available message", () => {
			const version = 123
			const buffer = MessageBuilder.createUpdateAvailableMessage(version)

			validateFrameStructure(buffer, MessageType.UPDATE_AVAILABLE, 2)

			const view = new DataView(buffer)
			const offset = getPayloadOffset(buffer)
			expect(view.getUint16(offset, true)).toBe(version)
		})
	})

	describe("createMotorControlMessage", () => {
		it("should create a valid motor control message", () => {
			const leftMotor = 100
			const rightMotor = -200

			const buffer = MessageBuilder.createMotorControlMessage(leftMotor, rightMotor)

			validateFrameStructure(buffer, MessageType.MOTOR_CONTROL, 4)

			const view = new DataView(buffer)
			const offset = getPayloadOffset(buffer)
			expect(view.getInt16(offset, true)).toBe(leftMotor)
			expect(view.getInt16(offset + 2, true)).toBe(rightMotor)
		})

		it("should handle zero values", () => {
			const buffer = MessageBuilder.createMotorControlMessage(0, 0)

			const view = new DataView(buffer)
			const offset = getPayloadOffset(buffer)
			expect(view.getInt16(offset, true)).toBe(0)
			expect(view.getInt16(offset + 2, true)).toBe(0)
		})

		it("should handle maximum motor values", () => {
			const maxValue = 32767 // Max Int16 value
			const buffer = MessageBuilder.createMotorControlMessage(maxValue, maxValue)

			const view = new DataView(buffer)
			const offset = getPayloadOffset(buffer)
			expect(view.getInt16(offset, true)).toBe(maxValue)
			expect(view.getInt16(offset + 2, true)).toBe(maxValue)
		})

		it("should handle minimum motor values", () => {
			const minValue = -32768 // Min Int16 value
			const buffer = MessageBuilder.createMotorControlMessage(minValue, minValue)

			const view = new DataView(buffer)
			const offset = getPayloadOffset(buffer)
			expect(view.getInt16(offset, true)).toBe(minValue)
			expect(view.getInt16(offset + 2, true)).toBe(minValue)
		})
	})

	describe("createSoundMessage", () => {
		it("should create a valid sound message for each fun sound type", () => {
			// eslint-disable-next-line max-len
			const funSoundTypes = [SoundType.FART, SoundType.MONKEY, SoundType.ELEPHANT, SoundType.PARTY, SoundType.UFO, SoundType.COUNTDOWN, SoundType.ENGINE, SoundType.ROBOT, SoundType.CHIME, SoundType.CHIRP, SoundType.POP, SoundType.DROP]

			funSoundTypes.forEach(type => {
				const buffer = MessageBuilder.createSoundMessage(type)
				validateFrameStructure(buffer, MessageType.SOUND_COMMAND, 1)

				const view = new DataView(buffer)
				const offset = getPayloadOffset(buffer)
				expect(view.getUint8(offset)).toBe(type)
			})
		})
	})

	describe("createStopSoundMessage", () => {
		it("should create a valid stop sound message", () => {
			const buffer = MessageBuilder.createStopSoundMessage()
			validateFrameStructure(buffer, MessageType.STOP_SOUND, 0)
		})
	})

	describe("createLightAnimationMessage", () => {
		it("should create a valid light animation message for NO_ANIMATION", () => {
			const buffer = MessageBuilder.createLightAnimationMessage(LightAnimationType.NO_ANIMATION)

			validateFrameStructure(buffer, MessageType.UPDATE_LIGHT_ANIMATION, 1)

			const view = new DataView(buffer)
			const offset = getPayloadOffset(buffer)
			expect(view.getUint8(offset)).toBe(LightAnimationType.NO_ANIMATION)
		})

		it("should create a valid message for each animation type", () => {
			const animationTypes = [
				LightAnimationType.BREATHING,
				LightAnimationType.RAINBOW,
				LightAnimationType.STROBE,
				LightAnimationType.TURN_OFF,
				LightAnimationType.FADE_OUT
			]

			animationTypes.forEach(type => {
				const buffer = MessageBuilder.createLightAnimationMessage(type)
				const view = new DataView(buffer)
				const offset = getPayloadOffset(buffer)
				expect(view.getUint8(offset)).toBe(type)
			})
		})
	})

	describe("createLedMessage", () => {
		it("should create a valid LED control message", () => {
			const ledData: Omit<LedControlData, "pipUUID"> = {
				topLeftColor: { r: 255, g: 0, b: 0 },
				topRightColor: { r: 0, g: 255, b: 0 },
				middleLeftColor: { r: 0, g: 0, b: 255 },
				middleRightColor: { r: 255, g: 255, b: 0 },
				backLeftColor: { r: 255, g: 0, b: 255 },
				backRightColor: { r: 0, g: 255, b: 255 }
			}

			const buffer = MessageBuilder.createLedMessage(ledData)

			validateFrameStructure(buffer, MessageType.UPDATE_LED_COLORS, 18)

			const view = new DataView(buffer)
			const offset = getPayloadOffset(buffer)

			// Top Left Color
			expect(view.getUint8(offset)).toBe(255)     // r
			expect(view.getUint8(offset + 1)).toBe(0)   // g
			expect(view.getUint8(offset + 2)).toBe(0)   // b

			// Top Right Color
			expect(view.getUint8(offset + 3)).toBe(0)   // r
			expect(view.getUint8(offset + 4)).toBe(255) // g
			expect(view.getUint8(offset + 5)).toBe(0)   // b

			// Middle Left Color
			expect(view.getUint8(offset + 6)).toBe(0)   // r
			expect(view.getUint8(offset + 7)).toBe(0)   // g
			expect(view.getUint8(offset + 8)).toBe(255) // b

			// Middle Right Color
			expect(view.getUint8(offset + 9)).toBe(255)  // r
			expect(view.getUint8(offset + 10)).toBe(255) // g
			expect(view.getUint8(offset + 11)).toBe(0)   // b

			// Back Left Color
			expect(view.getUint8(offset + 12)).toBe(255) // r
			expect(view.getUint8(offset + 13)).toBe(0)   // g
			expect(view.getUint8(offset + 14)).toBe(255) // b

			// Back Right Color
			expect(view.getUint8(offset + 15)).toBe(0)   // r
			expect(view.getUint8(offset + 16)).toBe(255) // g
			expect(view.getUint8(offset + 17)).toBe(255) // b
		})

		it("should handle zero values for all colors", () => {
			const ledData: Omit<LedControlData, "pipUUID"> = {
				topLeftColor: { r: 0, g: 0, b: 0 },
				topRightColor: { r: 0, g: 0, b: 0 },
				middleLeftColor: { r: 0, g: 0, b: 0 },
				middleRightColor: { r: 0, g: 0, b: 0 },
				backLeftColor: { r: 0, g: 0, b: 0 },
				backRightColor: { r: 0, g: 0, b: 0 }
			}

			const buffer = MessageBuilder.createLedMessage(ledData)
			const view = new DataView(buffer)
			const offset = getPayloadOffset(buffer)

			// Sample a few values to ensure they're all 0
			expect(view.getUint8(offset)).toBe(0)
			expect(view.getUint8(offset + 4)).toBe(0)
			expect(view.getUint8(offset + 8)).toBe(0)
			expect(view.getUint8(offset + 12)).toBe(0)
			expect(view.getUint8(offset + 16)).toBe(0)
		})
	})

	describe("createDisplayBufferMessage", () => {
		it("should create a valid display buffer message", () => {
			const buffer = MessageBuilder.createDisplayBufferMessage(new Uint8Array(1024))
			if (buffer) {
				validateFrameStructure(buffer, MessageType.UPDATE_DISPLAY, 1024)
			} else {
				throw new Error("Failed to create display buffer message")
			}
		})

		it("should return null if the display buffer is not 1024 bytes", () => {
			const buffer = MessageBuilder.createDisplayBufferMessage(new Uint8Array(1023))
			expect(buffer).toBeNull()
		})
	})

	describe("createSpeakerMuteMessage", () => {
		it("should create a mute message when true is passed", () => {
			const buffer = MessageBuilder.createSpeakerMuteMessage(true)

			validateFrameStructure(buffer, MessageType.SPEAKER_MUTE, 1)

			const view = new DataView(buffer)
			const offset = getPayloadOffset(buffer)
			expect(view.getUint8(offset)).toBe(SpeakerStatus.MUTED)
		})

		it("should create an unmute message when false is passed", () => {
			const buffer = MessageBuilder.createSpeakerMuteMessage(false)

			const view = new DataView(buffer)
			const offset = getPayloadOffset(buffer)
			expect(view.getUint8(offset)).toBe(SpeakerStatus.UNMUTED)
		})
	})

	describe("createSpeakerVolumeMessage", () => {
		it("should create a valid speaker volume message for 50% volume", () => {
			const buffer = MessageBuilder.createSpeakerVolumeMessage(50)
			validateFrameStructure(buffer, MessageType.SPEAKER_VOLUME, 4)

			// the final value should be (50 / 100) * 3.9 = 1.95
			const view = new DataView(buffer)
			const offset = getPayloadOffset(buffer)
			expect(view.getFloat32(offset, true)).toBeCloseTo(1.95)
		})

		it("should create a valid speaker volume message", () => {
			const buffer = MessageBuilder.createSpeakerVolumeMessage(100)
			validateFrameStructure(buffer, MessageType.SPEAKER_VOLUME, 4)

			// the final value should be (100 / 100) * 3.9 = 3.9
			const view = new DataView(buffer)
			const offset = getPayloadOffset(buffer)
			expect(view.getFloat32(offset, true)).toBeCloseTo(3.9)
		})

		it("should create a valid speaker volume message for zero volume", () => {
			const buffer = MessageBuilder.createSpeakerVolumeMessage(0)
			validateFrameStructure(buffer, MessageType.SPEAKER_VOLUME, 4)

			// the final value should be (0 / 100) * 3.9 = 0.0
			const view = new DataView(buffer)
			const offset = getPayloadOffset(buffer)
			expect(view.getFloat32(offset, true)).toBeCloseTo(0.0)
		})
	})

	describe("createHeadlightMessage", () => {
		it("should create a headlight on message when true is passed", () => {
			const buffer = MessageBuilder.createHeadlightMessage(true)

			validateFrameStructure(buffer, MessageType.UPDATE_HEADLIGHT, 1)

			const view = new DataView(buffer)
			const offset = getPayloadOffset(buffer)
			expect(view.getUint8(offset)).toBe(HeadlightStatus.ON)
		})

		it("should create a headlight off message when false is passed", () => {
			const buffer = MessageBuilder.createHeadlightMessage(false)

			const view = new DataView(buffer)
			const offset = getPayloadOffset(buffer)
			expect(view.getUint8(offset)).toBe(HeadlightStatus.OFF)
		})
	})

	describe("createHornSoundMessage", () => {
		it("should create a horn sound on message when true is passed", () => {
			const buffer = MessageBuilder.createHornSoundMessage(true)

			validateFrameStructure(buffer, MessageType.UPDATE_HORN_SOUND, 1)

			const view = new DataView(buffer)
			const offset = getPayloadOffset(buffer)
			expect(view.getUint8(offset)).toBe(HornSoundStatus.ON)
		})

		it("should create a horn sound off message when false is passed", () => {
			const buffer = MessageBuilder.createHornSoundMessage(false)

			const view = new DataView(buffer)
			const offset = getPayloadOffset(buffer)
			expect(view.getUint8(offset)).toBe(HornSoundStatus.OFF)
		})
	})

	describe("createBalanceMessage", () => {
		it("should create a balance enabled message when true is passed", () => {
			const buffer = MessageBuilder.createBalanceMessage(true)

			validateFrameStructure(buffer, MessageType.BALANCE_CONTROL, 1)

			const view = new DataView(buffer)
			const offset = getPayloadOffset(buffer)
			expect(view.getUint8(offset)).toBe(BalanceStatus.BALANCED)
		})

		it("should create a balance disabled message when false is passed", () => {
			const buffer = MessageBuilder.createBalanceMessage(false)

			const view = new DataView(buffer)
			const offset = getPayloadOffset(buffer)
			expect(view.getUint8(offset)).toBe(BalanceStatus.UNBALANCED)
		})
	})

	describe("createUpdateBalancePidsMessage", () => {
		it("should create a valid PID update message", () => {
			const pidProps: Omit<BalancePidsProps, "pipUUID"> = {
				pValue: 1.5,
				iValue: 0.2,
				dValue: 0.1,
				ffValue: 0.05,
				targetAngle: 2.0,
				maxSafeAngleDeviation: 10.0,
				updateInterval: 5.0,
				deadbandAngle: 1.0,
				maxStableRotation: 45.0,
				minEffectivePwm: 20.0
			}

			const buffer = MessageBuilder.createUpdateBalancePidsMessage(pidProps)

			validateFrameStructure(buffer, MessageType.UPDATE_BALANCE_PIDS, 40)

			const view = new DataView(buffer)
			const offset = getPayloadOffset(buffer)
			expect(view.getFloat32(offset, true)).toBeCloseTo(1.5)
			expect(view.getFloat32(offset + 4, true)).toBeCloseTo(0.2)
			expect(view.getFloat32(offset + 8, true)).toBeCloseTo(0.1)
			expect(view.getFloat32(offset + 12, true)).toBeCloseTo(0.05)
			expect(view.getFloat32(offset + 16, true)).toBeCloseTo(2.0)
			expect(view.getFloat32(offset + 20, true)).toBeCloseTo(10.0)
			expect(view.getFloat32(offset + 24, true)).toBeCloseTo(5.0)
			expect(view.getFloat32(offset + 28, true)).toBeCloseTo(1.0)
			expect(view.getFloat32(offset + 32, true)).toBeCloseTo(45.0)
			expect(view.getFloat32(offset + 36, true)).toBeCloseTo(20.0)
		})

		it("should handle zero values for all PID parameters", () => {
			const zeroPidProps: Omit<BalancePidsProps, "pipUUID"> = {
				pValue: 0,
				iValue: 0,
				dValue: 0,
				ffValue: 0,
				targetAngle: 0,
				maxSafeAngleDeviation: 0,
				updateInterval: 0,
				deadbandAngle: 0,
				maxStableRotation: 0,
				minEffectivePwm: 0
			}

			const buffer = MessageBuilder.createUpdateBalancePidsMessage(zeroPidProps)
			const view = new DataView(buffer)
			const offset = getPayloadOffset(buffer)

			// Check a few of the values
			expect(view.getFloat32(offset, true)).toBeCloseTo(0)
			expect(view.getFloat32(offset + 16, true)).toBeCloseTo(0)
			expect(view.getFloat32(offset + 36, true)).toBeCloseTo(0)
		})

		it("should handle negative values for parameters", () => {
			const negativePidProps: Omit<BalancePidsProps, "pipUUID"> = {
				pValue: -1.5,
				iValue: -0.2,
				dValue: -0.1,
				ffValue: -0.05,
				targetAngle: -2.0,
				maxSafeAngleDeviation: -10.0,
				updateInterval: 5.0, // Keep some positive for testing mix
				deadbandAngle: 1.0,  // Keep some positive for testing mix
				maxStableRotation: -45.0,
				minEffectivePwm: -20.0
			}

			const buffer = MessageBuilder.createUpdateBalancePidsMessage(negativePidProps)
			const view = new DataView(buffer)
			const offset = getPayloadOffset(buffer)

			expect(view.getFloat32(offset, true)).toBeCloseTo(-1.5)
			expect(view.getFloat32(offset + 4, true)).toBeCloseTo(-0.2)
			expect(view.getFloat32(offset + 24, true)).toBeCloseTo(5.0) // Should still be positive
			expect(view.getFloat32(offset + 32, true)).toBeCloseTo(-45.0)
		})
	})

	describe("createBytecodeMessage", () => {
		it("should create a valid bytecode message", () => {
			const bytecodeData = new Float32Array([1.0, 2.0, 3.0, 4.0])
			const buffer = MessageBuilder.createBytecodeMessage(bytecodeData)

			// Bytecode data is 4 floats * 4 bytes = 16 bytes
			validateFrameStructure(buffer, MessageType.BYTECODE_PROGRAM, 16)

			// Verify we can recover the original float values from the framed message
			const view = new DataView(buffer)
			const offset = getPayloadOffset(buffer)

			expect(view.getFloat32(offset, true)).toBeCloseTo(1.0)
			expect(view.getFloat32(offset + 4, true)).toBeCloseTo(2.0)
			expect(view.getFloat32(offset + 8, true)).toBeCloseTo(3.0)
			expect(view.getFloat32(offset + 12, true)).toBeCloseTo(4.0)
		})

		it("should handle empty bytecode array", () => {
			const emptyBytecode = new Float32Array([])
			const buffer = MessageBuilder.createBytecodeMessage(emptyBytecode)

			validateFrameStructure(buffer, MessageType.BYTECODE_PROGRAM, 0)
		})

		it("should handle large bytecode arrays", () => {
			// Create a larger array
			const largeData = new Float32Array(1000)
			for (let i = 0; i < 1000; i++) {
				largeData[i] = i * 1.5
			}

			const buffer = MessageBuilder.createBytecodeMessage(largeData)

			// Bytecode data is 1000 floats * 4 bytes = 4000 bytes
			// For large payloads, we should have the long format (with 2-byte length)
			validateFrameStructure(buffer, MessageType.BYTECODE_PROGRAM, 4000)

			// Sample a few values to ensure they're correct
			const view = new DataView(buffer)
			const offset = getPayloadOffset(buffer)

			expect(view.getFloat32(offset, true)).toBeCloseTo(0)
			expect(view.getFloat32(offset + 40, true)).toBeCloseTo(10 * 1.5)
			expect(view.getFloat32(offset + 3996, true)).toBeCloseTo(999 * 1.5)
		})
	})

	describe("createStopSandboxCodeMessage", () => {
		it("should create a valid stop sandbox message", () => {
			const buffer = MessageBuilder.createStopSandboxCodeMessage()

			validateFrameStructure(buffer, MessageType.STOP_SANDBOX_CODE, 0)
		})
	})

	describe("createSerialHandshakeMessage", () => {
		it("should create a valid handshake message", () => {
			const buffer = MessageBuilder.createSerialHandshakeMessage()

			validateFrameStructure(buffer, MessageType.SERIAL_HANDSHAKE, 0)
		})
	})

	describe("createSerialKeepaliveMessage", () => {
		it("should create a valid keepalive message", () => {
			const buffer = MessageBuilder.createSerialKeepaliveMessage()

			validateFrameStructure(buffer, MessageType.SERIAL_KEEPALIVE, 0)
		})
	})

	describe("createSerialEndMessage", () => {
		it("should create a valid end message", () => {
			const buffer = MessageBuilder.createSerialEndMessage()

			validateFrameStructure(buffer, MessageType.SERIAL_END, 0)
		})
	})

	describe("createStopSensorPollingMessage", () => {
		it("should create a valid stop sensor polling message", () => {
			const buffer = MessageBuilder.createStopSensorPollingMessage()

			validateFrameStructure(buffer, MessageType.STOP_SENSOR_POLLING, 0)
		})
	})

	describe("createEndSensorPollingInOneMinuteMessage", () => {
		it("should create a valid end sensor polling in one minute message", () => {
			const buffer = MessageBuilder.createStartSensorPollingMessage()

			validateFrameStructure(buffer, MessageType.START_SENSOR_POLLING, 0)
		})
	})

	describe("createGetSavedWiFiNetworks", () => {
		it("should create a get saved wifi networks message", () => {
			const buffer = MessageBuilder.createGetSavedWiFiNetworks()

			validateFrameStructure(buffer, MessageType.GET_SAVED_WIFI_NETWORKS, 0)
		})
	})

	describe("createScanWiFiNetworksMessage", () => {
		it("should create a valid scan wifi networks message", () => {
			const buffer = MessageBuilder.createSoftScanWiFiNetworksMessage()

			validateFrameStructure(buffer, MessageType.SOFT_SCAN_WIFI_NETWORKS, 0)
		})
	})

	describe("createHardScanWiFiNetworksMessage", () => {
		it("should create a valid hard scan wifi networks message", () => {
			const buffer = MessageBuilder.createHardScanWiFiNetworksMessage()

			validateFrameStructure(buffer, MessageType.HARD_SCAN_WIFI_NETWORKS, 0)
		})
	})

	describe("createTriggerMessage", () => {
		it("should create a valid meet pip S2 P1 enter message", () => {
			const buffer = MessageBuilder.createTriggerMessage(CareerType.MEET_PIP, MeetPipTriggerType.S2_P1_ENTER)

			validateFrameStructure(buffer, MessageType.TRIGGER_MESSAGE, 2)

			const view = new DataView(buffer)
			const offset = getPayloadOffset(buffer)
			expect(view.getUint8(offset)).toBe(CareerType.MEET_PIP)
			expect(view.getUint8(offset + 1)).toBe(MeetPipTriggerType.S2_P1_ENTER)
		})

		it("should create valid trigger messages for all MeetPipTriggerType combinations", () => {
			// Get all MeetPipTriggerType values
			const triggerTypes = Object.values(MeetPipTriggerType)
				.filter(value => typeof value === "number") as MeetPipTriggerType[]

			// Test each trigger type
			triggerTypes.forEach(triggerType => {
				const buffer = MessageBuilder.createTriggerMessage(CareerType.MEET_PIP, triggerType)

				validateFrameStructure(buffer, MessageType.TRIGGER_MESSAGE, 2)

				const view = new DataView(buffer)
				const offset = getPayloadOffset(buffer)
				expect(view.getUint8(offset)).toBe(CareerType.MEET_PIP)
				expect(view.getUint8(offset + 1)).toBe(triggerType)
			})
		})

		it("should create valid trigger messages for all MeetPipTriggerType combinations", () => {
			// Get all CareerType values
			const careerTypes = Object.values(CareerType)
				.filter(value => typeof value === "number") as CareerType[]

			// For each career type, test with its corresponding trigger types
			careerTypes.forEach(careerType => {
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				if (careerType === CareerType.MEET_PIP) {
					// Test all MeetPipTriggerType values
					const triggerTypes = Object.values(MeetPipTriggerType)
						.filter(value => typeof value === "number") as MeetPipTriggerType[]

					triggerTypes.forEach(triggerType => {
						const buffer = MessageBuilder.createTriggerMessage(careerType, triggerType)

						validateFrameStructure(buffer, MessageType.TRIGGER_MESSAGE, 2)

						const view = new DataView(buffer)
						const offset = getPayloadOffset(buffer)
						expect(view.getUint8(offset)).toBe(careerType)
						expect(view.getUint8(offset + 1)).toBe(triggerType)
					})
				}
				// Add more career types here as they are added to the protocol - as long as they are valid TriggerMessageTypeMap values
			})
		})

		it("should handle edge cases for trigger messages", () => {
			// Test with the first and last trigger types
			const firstTriggerType = MeetPipTriggerType.S2_P1_ENTER
			const lastTriggerType = MeetPipTriggerType.S9_P6_EXIT

			// Test first trigger type
			const buffer1 = MessageBuilder.createTriggerMessage(CareerType.MEET_PIP, firstTriggerType)
			validateFrameStructure(buffer1, MessageType.TRIGGER_MESSAGE, 2)
			const view1 = new DataView(buffer1)
			const offset1 = getPayloadOffset(buffer1)
			expect(view1.getUint8(offset1)).toBe(CareerType.MEET_PIP)
			expect(view1.getUint8(offset1 + 1)).toBe(firstTriggerType)

			// Test last trigger type
			const buffer2 = MessageBuilder.createTriggerMessage(CareerType.MEET_PIP, lastTriggerType)
			validateFrameStructure(buffer2, MessageType.TRIGGER_MESSAGE, 2)
			const view2 = new DataView(buffer2)
			const offset2 = getPayloadOffset(buffer2)
			expect(view2.getUint8(offset2)).toBe(CareerType.MEET_PIP)
			expect(view2.getUint8(offset2 + 1)).toBe(lastTriggerType)
		})
	})

	describe("createStopCareerQuestTriggerMessage", () => {
		it("should create a valid stop career quest trigger message", () => {
			const buffer = MessageBuilder.createStopCareerQuestTriggerMessage()

			validateFrameStructure(buffer, MessageType.STOP_CAREER_QUEST_TRIGGER, 0)
		})
	})

	describe("createWiFiCredentialsMessage", () => {
		it("should create a valid WiFi credentials message", () => {
			const ssid = "MyWiFiNetwork"
			const password = "MyPassword123"

			const buffer = MessageBuilder.createWiFiCredentialsMessage(ssid, password)

			// Calculate expected payload length: ssid_length(1) + ssid_bytes + password_length(1) + password_bytes
			const expectedPayloadLength = 1 + ssid.length + 1 + password.length
			validateFrameStructure(buffer, MessageType.WIFI_CREDENTIALS, expectedPayloadLength)

			const view = new DataView(buffer)
			const offset = getPayloadOffset(buffer)

			// Check SSID length
			expect(view.getUint8(offset)).toBe(ssid.length)

			// Check SSID content
			for (let i = 0; i < ssid.length; i++) {
				expect(view.getUint8(offset + 1 + i)).toBe(ssid.charCodeAt(i))
			}

			// Check password length
			const passwordOffset = offset + 1 + ssid.length
			expect(view.getUint8(passwordOffset)).toBe(password.length)

			// Check password content
			for (let i = 0; i < password.length; i++) {
				expect(view.getUint8(passwordOffset + 1 + i)).toBe(password.charCodeAt(i))
			}
		})

		it("should handle empty SSID and password", () => {
			const buffer = MessageBuilder.createWiFiCredentialsMessage("", "")

			// Expected payload: ssid_length(1) + 0 bytes + password_length(1) + 0 bytes = 2 bytes
			validateFrameStructure(buffer, MessageType.WIFI_CREDENTIALS, 2)

			const view = new DataView(buffer)
			const offset = getPayloadOffset(buffer)

			// Both lengths should be 0
			expect(view.getUint8(offset)).toBe(0)      // SSID length
			expect(view.getUint8(offset + 1)).toBe(0)  // Password length
		})

		it("should handle empty SSID with non-empty password", () => {
			const ssid = ""
			const password = "password123"

			const buffer = MessageBuilder.createWiFiCredentialsMessage(ssid, password)

			const expectedPayloadLength = 1 + 0 + 1 + password.length
			validateFrameStructure(buffer, MessageType.WIFI_CREDENTIALS, expectedPayloadLength)

			const view = new DataView(buffer)
			const offset = getPayloadOffset(buffer)

			expect(view.getUint8(offset)).toBe(0)                    // SSID length
			expect(view.getUint8(offset + 1)).toBe(password.length)  // Password length

			// Check password content
			for (let i = 0; i < password.length; i++) {
				expect(view.getUint8(offset + 2 + i)).toBe(password.charCodeAt(i))
			}
		})

		it("should handle non-empty SSID with empty password", () => {
			const ssid = "PublicWiFi"
			const password = ""

			const buffer = MessageBuilder.createWiFiCredentialsMessage(ssid, password)

			const expectedPayloadLength = 1 + ssid.length + 1 + 0
			validateFrameStructure(buffer, MessageType.WIFI_CREDENTIALS, expectedPayloadLength)

			const view = new DataView(buffer)
			const offset = getPayloadOffset(buffer)

			expect(view.getUint8(offset)).toBe(ssid.length)  // SSID length

			// Check SSID content
			for (let i = 0; i < ssid.length; i++) {
				expect(view.getUint8(offset + 1 + i)).toBe(ssid.charCodeAt(i))
			}

			// Check password length
			expect(view.getUint8(offset + 1 + ssid.length)).toBe(0)
		})

		it("should handle special characters in SSID and password", () => {
			const ssid = "WiFi-Network_5G@Home!"
			const password = "P@ssw0rd#2024$"

			const buffer = MessageBuilder.createWiFiCredentialsMessage(ssid, password)

			const expectedPayloadLength = 1 + ssid.length + 1 + password.length
			validateFrameStructure(buffer, MessageType.WIFI_CREDENTIALS, expectedPayloadLength)

			const view = new DataView(buffer)
			const offset = getPayloadOffset(buffer)

			// Verify SSID
			expect(view.getUint8(offset)).toBe(ssid.length)
			for (let i = 0; i < ssid.length; i++) {
				expect(view.getUint8(offset + 1 + i)).toBe(ssid.charCodeAt(i))
			}

			// Verify password
			const passwordOffset = offset + 1 + ssid.length
			expect(view.getUint8(passwordOffset)).toBe(password.length)
			for (let i = 0; i < password.length; i++) {
				expect(view.getUint8(passwordOffset + 1 + i)).toBe(password.charCodeAt(i))
			}
		})

		it("should handle maximum length strings", () => {
			// Create strings at the maximum length for single-byte length field (255 characters)
			const maxSsid = "a".repeat(255)
			const maxPassword = "b".repeat(255)

			const buffer = MessageBuilder.createWiFiCredentialsMessage(maxSsid, maxPassword)

			// 255 + 255 + 2 length bytes = 512 bytes payload
			validateFrameStructure(buffer, MessageType.WIFI_CREDENTIALS, 512)

			const view = new DataView(buffer)
			const offset = getPayloadOffset(buffer)

			expect(view.getUint8(offset)).toBe(255)  // SSID length
			expect(view.getUint8(offset + 1 + 255)).toBe(255)  // Password length
		})

		it("should handle Unicode characters", () => {
			const ssid = "WiFi-网络-Réseau"
			const password = "パスワード123"

			const buffer = MessageBuilder.createWiFiCredentialsMessage(ssid, password)

			// Unicode characters will be encoded as UTF-8, so byte length may differ from string length
			const ssidBytes = new TextEncoder().encode(ssid)
			const passwordBytes = new TextEncoder().encode(password)
			const expectedPayloadLength = 1 + ssidBytes.length + 1 + passwordBytes.length

			validateFrameStructure(buffer, MessageType.WIFI_CREDENTIALS, expectedPayloadLength)

			const view = new DataView(buffer)
			const offset = getPayloadOffset(buffer)

			expect(view.getUint8(offset)).toBe(ssidBytes.length)

			// Verify SSID bytes
			for (let i = 0; i < ssidBytes.length; i++) {
				expect(view.getUint8(offset + 1 + i)).toBe(ssidBytes[i])
			}

			// Verify password length and bytes
			const passwordOffset = offset + 1 + ssidBytes.length
			expect(view.getUint8(passwordOffset)).toBe(passwordBytes.length)
			for (let i = 0; i < passwordBytes.length; i++) {
				expect(view.getUint8(passwordOffset + 1 + i)).toBe(passwordBytes[i])
			}
		})

		it("should handle single character SSID and password", () => {
			const ssid = "A"
			const password = "1"

			const buffer = MessageBuilder.createWiFiCredentialsMessage(ssid, password)

			validateFrameStructure(buffer, MessageType.WIFI_CREDENTIALS, 4) // 1+1+1+1

			const view = new DataView(buffer)
			const offset = getPayloadOffset(buffer)

			expect(view.getUint8(offset)).toBe(1)      // SSID length
			expect(view.getUint8(offset + 1)).toBe(65) // 'A'
			expect(view.getUint8(offset + 2)).toBe(1)  // Password length
			expect(view.getUint8(offset + 3)).toBe(49) // '1'
		})
	})

	describe("createRequestBatteryMonitorDataMessage", () => {
		it("should create a valid request battery monitor data message", () => {
			const buffer = MessageBuilder.createRequestBatteryMonitorDataMessage()

			validateFrameStructure(buffer, MessageType.REQUEST_BATTERY_MONITOR_DATA, 0)
		})
	})
})
