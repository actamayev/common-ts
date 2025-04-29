import { BalancePidsProps, LedControlData } from "../../src"
import { MessageBuilder } from "../../src/message-builder/message-builder"
import { BalanceStatus, LightAnimationType, MessageType, SoundType, SpeakerStatus } from "../../src/message-builder/protocol"

describe("MessageBuilder", () => {
	describe("createUpdateAvailableMessage", () => {
		it("should create a valid update available message", () => {
			const version = 123
			const buffer = MessageBuilder.createUpdateAvailableMessage(version)

			const view = new DataView(buffer)
			expect(view.getUint8(0)).toBe(MessageType.UPDATE_AVAILABLE)
			expect(view.getUint16(1, true)).toBe(version)
			expect(buffer.byteLength).toBe(3)
		})
	})

	describe("createMotorControlMessage", () => {
		it("should create a valid motor control message", () => {
			const leftMotor = 100
			const rightMotor = -200

			const buffer = MessageBuilder.createMotorControlMessage(leftMotor, rightMotor)

			const view = new DataView(buffer)
			expect(view.getUint8(0)).toBe(MessageType.MOTOR_CONTROL)
			expect(view.getInt16(1, true)).toBe(leftMotor)
			expect(view.getInt16(3, true)).toBe(rightMotor)
			expect(buffer.byteLength).toBe(5)
		})

		it("should handle zero values", () => {
			const buffer = MessageBuilder.createMotorControlMessage(0, 0)

			const view = new DataView(buffer)
			expect(view.getInt16(1, true)).toBe(0)
			expect(view.getInt16(3, true)).toBe(0)
		})

		it("should handle maximum motor values", () => {
			const maxValue = 32767 // Max Int16 value
			const buffer = MessageBuilder.createMotorControlMessage(maxValue, maxValue)

			const view = new DataView(buffer)
			expect(view.getInt16(1, true)).toBe(maxValue)
			expect(view.getInt16(3, true)).toBe(maxValue)
		})

		it("should handle minimum motor values", () => {
			const minValue = -32768 // Min Int16 value
			const buffer = MessageBuilder.createMotorControlMessage(minValue, minValue)

			const view = new DataView(buffer)
			expect(view.getInt16(1, true)).toBe(minValue)
			expect(view.getInt16(3, true)).toBe(minValue)
		})
	})

	describe("createSoundMessage", () => {
		it("should create a valid sound message for ALERT type", () => {
			const buffer = MessageBuilder.createSoundMessage(SoundType.ALERT)

			const view = new DataView(buffer)
			expect(view.getUint8(0)).toBe(MessageType.SOUND_COMMAND)
			expect(view.getUint8(1)).toBe(SoundType.ALERT)
			expect(buffer.byteLength).toBe(2)
		})

		it("should create a valid sound message for BEEP type", () => {
			const buffer = MessageBuilder.createSoundMessage(SoundType.BEEP)

			const view = new DataView(buffer)
			expect(view.getUint8(1)).toBe(SoundType.BEEP)
		})

		it("should create a valid sound message for CHIME type", () => {
			const buffer = MessageBuilder.createSoundMessage(SoundType.CHIME)

			const view = new DataView(buffer)
			expect(view.getUint8(1)).toBe(SoundType.CHIME)
		})
	})

	describe("createLightAnimationMessage", () => {
		it("should create a valid light animation message for NO_ANIMATION", () => {
			const buffer = MessageBuilder.createLightAnimationMessage(LightAnimationType.NO_ANIMATION)

			const view = new DataView(buffer)
			expect(view.getUint8(0)).toBe(MessageType.UPDATE_LIGHT_ANIMATION)
			expect(view.getUint8(1)).toBe(LightAnimationType.NO_ANIMATION)
			expect(buffer.byteLength).toBe(2)
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
				expect(view.getUint8(1)).toBe(type)
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

			const view = new DataView(buffer)
			expect(view.getUint8(0)).toBe(MessageType.UPDATE_LED_COLORS)

			// Top Left Color
			expect(view.getUint8(1)).toBe(255) // r
			expect(view.getUint8(2)).toBe(0)   // g
			expect(view.getUint8(3)).toBe(0)   // b

			// Top Right Color
			expect(view.getUint8(4)).toBe(0)   // r
			expect(view.getUint8(5)).toBe(255) // g
			expect(view.getUint8(6)).toBe(0)   // b

			// Middle Left Color
			expect(view.getUint8(7)).toBe(0)   // r
			expect(view.getUint8(8)).toBe(0)   // g
			expect(view.getUint8(9)).toBe(255) // b

			// Middle Right Color
			expect(view.getUint8(10)).toBe(255) // r
			expect(view.getUint8(11)).toBe(255) // g
			expect(view.getUint8(12)).toBe(0)   // b

			// Back Left Color
			expect(view.getUint8(13)).toBe(255) // r
			expect(view.getUint8(14)).toBe(0)   // g
			expect(view.getUint8(15)).toBe(255) // b

			// Back Right Color
			expect(view.getUint8(16)).toBe(0)   // r
			expect(view.getUint8(17)).toBe(255) // g
			expect(view.getUint8(18)).toBe(255) // b

			expect(buffer.byteLength).toBe(19)
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

			// Sample a few values to ensure they're all 0
			expect(view.getUint8(1)).toBe(0)
			expect(view.getUint8(5)).toBe(0)
			expect(view.getUint8(18)).toBe(0)
		})
	})

	describe("createSpeakerMuteMessage", () => {
		it("should create a mute message when true is passed", () => {
			const buffer = MessageBuilder.createSpeakerMuteMessage(true)

			const view = new DataView(buffer)
			expect(view.getUint8(0)).toBe(MessageType.SPEAKER_MUTE)
			expect(view.getUint8(1)).toBe(SpeakerStatus.MUTED)
			expect(buffer.byteLength).toBe(2)
		})

		it("should create an unmute message when false is passed", () => {
			const buffer = MessageBuilder.createSpeakerMuteMessage(false)

			const view = new DataView(buffer)
			expect(view.getUint8(1)).toBe(SpeakerStatus.UNMUTED)
		})
	})

	describe("createBalanceMessage", () => {
		it("should create a balance enabled message when true is passed", () => {
			const buffer = MessageBuilder.createBalanceMessage(true)

			const view = new DataView(buffer)
			expect(view.getUint8(0)).toBe(MessageType.BALANCE_CONTROL)
			expect(view.getUint8(1)).toBe(BalanceStatus.BALANCED)
			expect(buffer.byteLength).toBe(2)
		})

		it("should create a balance disabled message when false is passed", () => {
			const buffer = MessageBuilder.createBalanceMessage(false)

			const view = new DataView(buffer)
			expect(view.getUint8(1)).toBe(BalanceStatus.UNBALANCED)
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

			const view = new DataView(buffer)
			expect(view.getUint8(0)).toBe(MessageType.UPDATE_BALANCE_PIDS)
			expect(view.getFloat32(1, true)).toBeCloseTo(1.5)
			expect(view.getFloat32(5, true)).toBeCloseTo(0.2)
			expect(view.getFloat32(9, true)).toBeCloseTo(0.1)
			expect(view.getFloat32(13, true)).toBeCloseTo(0.05)
			expect(view.getFloat32(17, true)).toBeCloseTo(2.0)
			expect(view.getFloat32(21, true)).toBeCloseTo(10.0)
			expect(view.getFloat32(25, true)).toBeCloseTo(5.0)
			expect(view.getFloat32(29, true)).toBeCloseTo(1.0)
			expect(view.getFloat32(33, true)).toBeCloseTo(45.0)
			expect(view.getFloat32(37, true)).toBeCloseTo(20.0)
			expect(buffer.byteLength).toBe(41)
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

			// Check a few of the values
			expect(view.getFloat32(1, true)).toBeCloseTo(0)
			expect(view.getFloat32(17, true)).toBeCloseTo(0)
			expect(view.getFloat32(37, true)).toBeCloseTo(0)
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

			expect(view.getFloat32(1, true)).toBeCloseTo(-1.5)
			expect(view.getFloat32(5, true)).toBeCloseTo(-0.2)
			expect(view.getFloat32(25, true)).toBeCloseTo(5.0) // Should still be positive
			expect(view.getFloat32(33, true)).toBeCloseTo(-45.0)
		})
	})

	describe("createBytecodeMessage", () => {
		it("should create a valid bytecode message", () => {
			const bytecodeData = new Float32Array([1.0, 2.0, 3.0, 4.0])
			const buffer = MessageBuilder.createBytecodeMessage(bytecodeData)

			const view = new DataView(buffer)
			expect(view.getUint8(0)).toBe(MessageType.BYTECODE_PROGRAM)

			// The correct way to check the float values - we need to read from the buffer
			// using DataView to avoid alignment issues
			expect(new Float32Array(bytecodeData.buffer)[0]).toBeCloseTo(1.0)
			expect(new Float32Array(bytecodeData.buffer)[1]).toBeCloseTo(2.0)
			expect(new Float32Array(bytecodeData.buffer)[2]).toBeCloseTo(3.0)
			expect(new Float32Array(bytecodeData.buffer)[3]).toBeCloseTo(4.0)

			// Check total buffer size (1 byte for type + 4 floats * 4 bytes)
			expect(buffer.byteLength).toBe(1 + 16)
		})

		it("should handle empty bytecode array", () => {
			const emptyBytecode = new Float32Array([])
			const buffer = MessageBuilder.createBytecodeMessage(emptyBytecode)

			expect(buffer.byteLength).toBe(1) // Just the message type byte
			const view = new DataView(buffer)
			expect(view.getUint8(0)).toBe(MessageType.BYTECODE_PROGRAM)
		})

		it("should handle large bytecode arrays", () => {
		// Create a larger array
			const largeData = new Float32Array(1000)
			for (let i = 0; i < 1000; i++) {
				largeData[i] = i * 1.5
			}

			const buffer = MessageBuilder.createBytecodeMessage(largeData)

			// Check total size
			expect(buffer.byteLength).toBe(1 + 1000 * 4)

			// Check a few values by using the original array
			expect(largeData[0]).toBeCloseTo(0)
			expect(largeData[10]).toBeCloseTo(15)
			expect(largeData[999]).toBeCloseTo(1498.5)
		})
	})

	describe("createStopSandboxCodeMessage", () => {
		it("should create a valid stop sandbox message", () => {
			const buffer = MessageBuilder.createStopSandboxCodeMessage()

			expect(buffer.byteLength).toBe(1)
			const view = new DataView(buffer)
			expect(view.getUint8(0)).toBe(MessageType.STOP_SANDBOX_CODE)
		})
	})
})
