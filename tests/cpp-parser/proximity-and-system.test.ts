import { CppParser } from "../../src/parsers/cpp-parser"
import { BytecodeOpCode, SensorType } from "../../src/types/bytecode-types"
import { MAX_LED_BRIGHTNESS } from "../../src/types/utils/constants"

describe("Proximity Sensor Functions", () => {
	describe("Side Proximity Detection", () => {
		test("should parse standalone left proximity detection function", () => {
			const code = "is_object_near_side_left();"
			const bytecode = CppParser.cppToByte(code)

			// Should generate a READ_SENSOR instruction for left proximity
			expect(bytecode[0]).toBe(BytecodeOpCode.READ_SENSOR)
			expect(bytecode[1]).toBe(SensorType.SIDE_LEFT_PROXIMITY)
			expect(bytecode[2]).toBe(0) // Register ID
			expect(bytecode[3]).toBe(0) // Unused
			expect(bytecode[4]).toBe(0) // Unused

			// Should have END instruction
			expect(bytecode[5]).toBe(BytecodeOpCode.END)
		})

		test("should parse standalone right proximity detection function", () => {
			const code = "is_object_near_side_right();"
			const bytecode = CppParser.cppToByte(code)

			// Should generate a READ_SENSOR instruction for right proximity
			expect(bytecode[0]).toBe(BytecodeOpCode.READ_SENSOR)
			expect(bytecode[1]).toBe(SensorType.SIDE_RIGHT_PROXIMITY)
			expect(bytecode[2]).toBe(0) // Register ID
			expect(bytecode[3]).toBe(0) // Unused
			expect(bytecode[4]).toBe(0) // Unused

			// Should have END instruction
			expect(bytecode[5]).toBe(BytecodeOpCode.END)
		})

		test("should throw error when registers are exhausted", () => {
			// Create a function that will use up all registers
			const registerSetup = Array(512).fill(null).map((_, i) =>
				`float var${i} = 0.0;`
			).join("\n")

			const code = `
        ${registerSetup}
        is_object_near_side_left();
      `

			// Should throw error about exceeding register count
			expect(() => {
				CppParser.cppToByte(code)
			}).toThrow(/exceeds maximum register count/)
		})

		test("should handle multiple side proximity sensors", () => {
			const code = `
        is_object_near_side_left();
        wait(0.1);
        is_object_near_side_right();
      `

			const bytecode = CppParser.cppToByte(code)

			// Should have both proximity sensor types
			let leftFound = false
			let rightFound = false

			for (let i = 0; i < bytecode.length; i += 5) {
				if (bytecode[i] === BytecodeOpCode.READ_SENSOR) {
					if (bytecode[i + 1] === SensorType.SIDE_LEFT_PROXIMITY) {
						leftFound = true
					} else if (bytecode[i + 1] === SensorType.SIDE_RIGHT_PROXIMITY) {
						rightFound = true
					}
				}
			}

			expect(leftFound).toBe(true)
			expect(rightFound).toBe(true)
		})
	})

	describe("Front Proximity Detection", () => {
		test("should parse standalone front proximity detection function", () => {
			const code = "is_object_in_front();"
			const bytecode = CppParser.cppToByte(code)

			// Should generate a READ_SENSOR instruction for front proximity
			expect(bytecode[0]).toBe(BytecodeOpCode.READ_SENSOR)
			expect(bytecode[1]).toBe(SensorType.FRONT_PROXIMITY)
			expect(bytecode[2]).toBe(0) // Register ID
			expect(bytecode[3]).toBe(0) // Unused
			expect(bytecode[4]).toBe(0) // Unused

			// Should have END instruction
			expect(bytecode[5]).toBe(BytecodeOpCode.END)
		})

		test("should throw error when registers are exhausted", () => {
			// Create a function that will use up all registers
			const registerSetup = Array(512).fill(null).map((_, i) =>
				`float var${i} = 0.0;`
			).join("\n")

			const code = `
        ${registerSetup}
        is_object_in_front();
      `

			// Should throw error about exceeding register count
			expect(() => {
				CppParser.cppToByte(code)
			}).toThrow(/exceeds maximum register count/)
		})

		test("should handle loops with front proximity checks", () => {
			const code = `
        while(true) {
          if (is_object_in_front()) {
            rgbLed.set_led_red();
            wait(0.5);
          } else {
            goForward(50);
          }
        }
      `

			const bytecode = CppParser.cppToByte(code)

			// Verify we have a front proximity sensor read
			let frontSensorFound = false

			for (let i = 0; i < bytecode.length; i += 5) {
				if (bytecode[i] === BytecodeOpCode.READ_SENSOR &&
            bytecode[i + 1] === SensorType.FRONT_PROXIMITY) {
					frontSensorFound = true
					break
				}
			}

			expect(frontSensorFound).toBe(true)

			// Verify we have motor forward instruction in the else branch
			let motorForwardFound = false

			for (let i = 0; i < bytecode.length; i += 5) {
				if (bytecode[i] === BytecodeOpCode.MOTOR_FORWARD) {
					motorForwardFound = true
					break
				}
			}

			expect(motorForwardFound).toBe(true)
		})
	})

	describe("Wait For Button", () => {
		test("should parse wait_for_button_press command", () => {
			const code = "wait_for_button_press();"
			const bytecode = CppParser.cppToByte(code)

			// Should generate a WAIT_FOR_BUTTON instruction
			expect(bytecode[0]).toBe(BytecodeOpCode.WAIT_FOR_BUTTON)
			expect(bytecode[1]).toBe(0) // Unused
			expect(bytecode[2]).toBe(0) // Unused
			expect(bytecode[3]).toBe(0) // Unused
			expect(bytecode[4]).toBe(0) // Unused

			// Should have END instruction
			expect(bytecode[5]).toBe(BytecodeOpCode.END)
		})

		test("should handle wait_for_button_press in a complex sequence", () => {
			const code = `
        rgbLed.set_led_blue();
        wait_for_button_press();
        rgbLed.set_led_green();
        wait(1);
        wait_for_button_press();
        rgbLed.set_led_red();
      `

			const bytecode = CppParser.cppToByte(code)

			// Count number of WAIT_FOR_BUTTON instructions
			let waitForButtonCount = 0

			for (let i = 0; i < bytecode.length; i += 5) {
				if (bytecode[i] === BytecodeOpCode.WAIT_FOR_BUTTON) {
					waitForButtonCount++
				}
			}

			expect(waitForButtonCount).toBe(2)

			// Verify sequence (blue LED, wait, green LED, wait, red LED)
			expect(bytecode[0]).toBe(BytecodeOpCode.SET_ALL_LEDS) // Blue
			expect(bytecode[1]).toBe(0)
			expect(bytecode[2]).toBe(0)
			expect(bytecode[3]).toBe(MAX_LED_BRIGHTNESS)

			expect(bytecode[5]).toBe(BytecodeOpCode.WAIT_FOR_BUTTON)

			expect(bytecode[10]).toBe(BytecodeOpCode.SET_ALL_LEDS) // Green
			expect(bytecode[11]).toBe(0)
			expect(bytecode[12]).toBe(MAX_LED_BRIGHTNESS)
			expect(bytecode[13]).toBe(0)

			expect(bytecode[15]).toBe(BytecodeOpCode.WAIT)
			expect(bytecode[16]).toBe(1)

			expect(bytecode[20]).toBe(BytecodeOpCode.WAIT_FOR_BUTTON)

			expect(bytecode[25]).toBe(BytecodeOpCode.SET_ALL_LEDS) // Red
			expect(bytecode[26]).toBe(MAX_LED_BRIGHTNESS)
			expect(bytecode[27]).toBe(0)
			expect(bytecode[28]).toBe(0)
		})

		test("should handle wait_for_button_press in control structures", () => {
			const code = `
        if (is_object_in_front()) {
          rgbLed.set_led_red();
          wait_for_button_press();
        } else {
          rgbLed.set_led_green();
        }
        
        for (int i = 0; i < 3; i++) {
          wait_for_button_press();
          rgbLed.set_led_blue();
          wait(0.5);
        }
      `

			const bytecode = CppParser.cppToByte(code)

			// Count number of WAIT_FOR_BUTTON instructions
			let waitForButtonCount = 0

			for (let i = 0; i < bytecode.length; i += 5) {
				if (bytecode[i] === BytecodeOpCode.WAIT_FOR_BUTTON) {
					waitForButtonCount++
				}
			}

			// Should have 2 distinct WAIT_FOR_BUTTON instructions
			// One in the if block and one in the for loop
			expect(waitForButtonCount).toBe(2)
		})
	})

	describe("Ultimate Robot Navigation Example", () => {
		test("should handle a complete navigation example with all features", () => {
			const code = `
        wait_for_button_press();  // Wait for start button
        
        for (int i = 0; i < 3; i++) {
          // Flash light to indicate start
          rgbLed.set_led_blue();
          wait(0.2);
          rgbLed.turn_led_off();
          wait(0.2);
        }
        
        while(true) {
          // Check front obstacle
          if (is_object_in_front()) {
            // Front blocked, check sides
            rgbLed.set_led_red();
            wait(0.3);
            
            if (is_object_near_side_left()) {
              // Left blocked too, try right
              if (is_object_near_side_right()) {
                // All directions blocked
                rgbLed.set_led_purple();
                wait_for_button_press();  // Wait for manual intervention
              } else {
                // Turn right
                turn(CLOCKWISE, 90);
              }
            } else {
              // Turn left
              turn(COUNTERCLOCKWISE, 90);
            }
          } else {
            // Path is clear, move forward
            rgbLed.set_led_green();
            goForward(50);
            wait(0.2);
          }
        }
      `

			const bytecode = CppParser.cppToByte(code)

			// This complex example should use all the features we're testing
			let foundWaitForButton = false
			let foundFrontProximity = false
			let foundLeftProximity = false
			let foundRightProximity = false

			for (let i = 0; i < bytecode.length; i += 5) {
				if (bytecode[i] === BytecodeOpCode.WAIT_FOR_BUTTON) {
					foundWaitForButton = true
				} else if (bytecode[i] === BytecodeOpCode.READ_SENSOR) {
					if (bytecode[i + 1] === SensorType.FRONT_PROXIMITY) {
						foundFrontProximity = true
					} else if (bytecode[i + 1] === SensorType.SIDE_LEFT_PROXIMITY) {
						foundLeftProximity = true
					} else if (bytecode[i + 1] === SensorType.SIDE_RIGHT_PROXIMITY) {
						foundRightProximity = true
					}
				}
			}

			expect(foundWaitForButton).toBe(true)
			expect(foundFrontProximity).toBe(true)
			expect(foundLeftProximity).toBe(true)
			expect(foundRightProximity).toBe(true)
		})
	})
})
