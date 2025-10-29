import { CppParser } from "../../src/parsers/cpp-parser"
import { BytecodeOpCode } from "../../src/types/bytecode-types"

describe("Button commands", () => {
	describe("right_button.is_pressed command", () => {
		test("should parse right_button.is_pressed()", () => {
			const bytecode = CppParser.cppToByte("right_button.is_pressed();")

			expect(bytecode[0]).toBe(BytecodeOpCode.CHECK_RIGHT_BUTTON_PRESS)
			expect(bytecode[1]).toBe(0)
			expect(bytecode[2]).toBe(0)
			expect(bytecode[3]).toBe(0)
			expect(bytecode[4]).toBe(0)
			expect(bytecode[5]).toBe(BytecodeOpCode.END)
		})

		test("should parse multiple right_button.is_pressed commands", () => {
			const program = `
				right_button.is_pressed();
				right_button.is_pressed();
				right_button.is_pressed();
			`

			const bytecode = CppParser.cppToByte(program)

			// First instruction: CHECK_RIGHT_BUTTON_PRESS
			expect(bytecode[0]).toBe(BytecodeOpCode.CHECK_RIGHT_BUTTON_PRESS)
			expect(bytecode[1]).toBe(0)

			// Second instruction: CHECK_RIGHT_BUTTON_PRESS
			expect(bytecode[5]).toBe(BytecodeOpCode.CHECK_RIGHT_BUTTON_PRESS)
			expect(bytecode[6]).toBe(0)

			// Third instruction: CHECK_RIGHT_BUTTON_PRESS
			expect(bytecode[10]).toBe(BytecodeOpCode.CHECK_RIGHT_BUTTON_PRESS)
			expect(bytecode[11]).toBe(0)

			// Last instruction: END
			expect(bytecode[15]).toBe(BytecodeOpCode.END)
		})

		test("should parse right_button.is_pressed in conditional statements", () => {
			const code = `
				if (right_button.is_pressed()) {
					rgbLed.set_led_red();
				} else {
					rgbLed.set_led_green();
				}
			`

			const bytecode = CppParser.cppToByte(code)

			// Find the CHECK_RIGHT_BUTTON_PRESS instruction
			let buttonCheckFound = false
			for (let i = 0; i < bytecode.length; i += 5) {
				if (bytecode[i] === BytecodeOpCode.CHECK_RIGHT_BUTTON_PRESS) {
					buttonCheckFound = true
					break
				}
			}

			expect(buttonCheckFound).toBe(true)
		})

		test("should parse right_button.is_pressed in loops", () => {
			const code = `
				for (int i = 0; i < 3; i++) {
					if (right_button.is_pressed()) {
						rgbLed.set_led_blue();
					}
				}
			`

			const bytecode = CppParser.cppToByte(code)

			// Find the CHECK_RIGHT_BUTTON_PRESS instruction
			let buttonCheckFound = false
			for (let i = 0; i < bytecode.length; i += 5) {
				if (bytecode[i] === BytecodeOpCode.CHECK_RIGHT_BUTTON_PRESS) {
					buttonCheckFound = true
					break
				}
			}

			expect(buttonCheckFound).toBe(true)
		})

		test("should combine right_button.is_pressed with other commands", () => {
			const program = `
				rgbLed.set_led_red();
				right_button.is_pressed();
				wait(1);
				rgbLed.turn_led_off();
			`

			const bytecode = CppParser.cppToByte(program)

			// Check for specific instruction sequence
			expect(bytecode[0]).toBe(BytecodeOpCode.SET_ALL_LEDS) // Red LED
			expect(bytecode[5]).toBe(BytecodeOpCode.CHECK_RIGHT_BUTTON_PRESS) // Button check
			expect(bytecode[10]).toBe(BytecodeOpCode.WAIT) // Wait
			expect(bytecode[15]).toBe(BytecodeOpCode.SET_ALL_LEDS) // LED off
		})

		test("should work with variable assignment", () => {
			const program = `
				bool buttonPressed = right_button.is_pressed();
				if (buttonPressed) {
					rgbLed.set_led_green();
				}
			`

			const bytecode = CppParser.cppToByte(program)

			// Find the CHECK_RIGHT_BUTTON_PRESS instruction
			let buttonCheckFound = false
			for (let i = 0; i < bytecode.length; i += 5) {
				if (bytecode[i] === BytecodeOpCode.CHECK_RIGHT_BUTTON_PRESS) {
					buttonCheckFound = true
					break
				}
			}

			expect(buttonCheckFound).toBe(true)
		})

		test("should work with compound conditions", () => {
			const code = `
				if ((right_button.is_pressed()) && (10 > 5)) {
					rgbLed.set_led_blue();
				}
			`

			const bytecode = CppParser.cppToByte(code)

			// Find the CHECK_RIGHT_BUTTON_PRESS instruction
			let buttonCheckFound = false
			for (let i = 0; i < bytecode.length; i += 5) {
				if (bytecode[i] === BytecodeOpCode.CHECK_RIGHT_BUTTON_PRESS) {
					buttonCheckFound = true
					break
				}
			}

			expect(buttonCheckFound).toBe(true)
		})

		test("should work with OR conditions", () => {
			const code = `
				if ((right_button.is_pressed()) || (5 > 10)) {
					rgbLed.set_led_yellow();
				}
			`

			const bytecode = CppParser.cppToByte(code)

			// Find the CHECK_RIGHT_BUTTON_PRESS instruction
			let buttonCheckFound = false
			for (let i = 0; i < bytecode.length; i += 5) {
				if (bytecode[i] === BytecodeOpCode.CHECK_RIGHT_BUTTON_PRESS) {
					buttonCheckFound = true
					break
				}
			}

			expect(buttonCheckFound).toBe(true)
		})

		test("should work with else-if statements", () => {
			const code = `
				if (right_button.is_pressed()) {
					rgbLed.set_led_red();
				} else if (5 > 3) {
					rgbLed.set_led_green();
				} else {
					rgbLed.set_led_blue();
				}
			`

			const bytecode = CppParser.cppToByte(code)

			// Find the CHECK_RIGHT_BUTTON_PRESS instruction
			let buttonCheckFound = false
			for (let i = 0; i < bytecode.length; i += 5) {
				if (bytecode[i] === BytecodeOpCode.CHECK_RIGHT_BUTTON_PRESS) {
					buttonCheckFound = true
					break
				}
			}

			expect(buttonCheckFound).toBe(true)
		})

		test("should work with while loops", () => {
			const code = `
				while (true) {
					if (right_button.is_pressed()) {
						rgbLed.set_led_white();
					}
				}
			`

			const bytecode = CppParser.cppToByte(code)

			// Find the CHECK_RIGHT_BUTTON_PRESS instruction
			let buttonCheckFound = false
			for (let i = 0; i < bytecode.length; i += 5) {
				if (bytecode[i] === BytecodeOpCode.CHECK_RIGHT_BUTTON_PRESS) {
					buttonCheckFound = true
					break
				}
			}

			expect(buttonCheckFound).toBe(true)
		})

		test("should work with sensor combinations using compound condition", () => {
			const code = `
				if ((right_button.is_pressed()) && (is_object_in_front())) {
					rgbLed.set_led_purple();
				}
			`

			const bytecode = CppParser.cppToByte(code)

			// Find the CHECK_RIGHT_BUTTON_PRESS instruction
			let buttonCheckFound = false
			for (let i = 0; i < bytecode.length; i += 5) {
				if (bytecode[i] === BytecodeOpCode.CHECK_RIGHT_BUTTON_PRESS) {
					buttonCheckFound = true
					break
				}
			}

			expect(buttonCheckFound).toBe(true)
		})

		test("should work with sound commands", () => {
			const program = `
				if (right_button.is_pressed()) {
					speaker.play_sound("Chime");
					speaker.play_tone("A");
				}
			`

			const bytecode = CppParser.cppToByte(program)

			// Find the CHECK_RIGHT_BUTTON_PRESS instruction
			let buttonCheckFound = false
			for (let i = 0; i < bytecode.length; i += 5) {
				if (bytecode[i] === BytecodeOpCode.CHECK_RIGHT_BUTTON_PRESS) {
					buttonCheckFound = true
					break
				}
			}

			expect(buttonCheckFound).toBe(true)
		})

		test("should work with motor commands", () => {
			const program = `
				if (right_button.is_pressed()) {
					drive(FORWARD, 50);
					wait(2);
					stopMotors();
				}
			`

			const bytecode = CppParser.cppToByte(program)

			// Find the CHECK_RIGHT_BUTTON_PRESS instruction
			let buttonCheckFound = false
			for (let i = 0; i < bytecode.length; i += 5) {
				if (bytecode[i] === BytecodeOpCode.CHECK_RIGHT_BUTTON_PRESS) {
					buttonCheckFound = true
					break
				}
			}

			expect(buttonCheckFound).toBe(true)
		})
	})

	describe("right_button.is_pressed error handling", () => {
		test("should reject malformed syntax - missing parentheses", () => {
			expect(() => {
				CppParser.cppToByte("right_button.is_pressed;")
			}).toThrow(/Invalid command/)
		})

		test("should reject malformed syntax - extra parameters", () => {
			expect(() => {
				CppParser.cppToByte("right_button.is_pressed(123);")
			}).toThrow(/Invalid command/)
		})

		test("should reject malformed syntax - wrong function name", () => {
			expect(() => {
				CppParser.cppToByte("is_left_button_pressed();")
			}).toThrow(/Invalid command/)
		})

		test("should reject malformed syntax - wrong function name case", () => {
			expect(() => {
				CppParser.cppToByte("Is_Right_Button_Pressed();")
			}).toThrow(/Invalid command/)
		})

		test("should reject malformed syntax - extra spaces", () => {
			expect(() => {
				CppParser.cppToByte("right_button.is_pressed ();")
			}).toThrow(/Invalid command/)
		})

		test("should reject malformed syntax - missing underscore", () => {
			expect(() => {
				CppParser.cppToByte("isrightbuttonpressed();")
			}).toThrow(/Invalid command/)
		})

		test("should reject malformed syntax - wrong word order", () => {
			expect(() => {
				CppParser.cppToByte("is_button_right_pressed();")
			}).toThrow(/Invalid command/)
		})
	})

	describe("button integration with complex scenarios", () => {
		test("should handle nested button checks", () => {
			const code = `
				if (right_button.is_pressed()) {
					if (right_button.is_pressed()) {
						rgbLed.set_led_red();
					}
				}
			`

			const bytecode = CppParser.cppToByte(code)

			// Count CHECK_RIGHT_BUTTON_PRESS instructions
			let buttonCheckCount = 0
			for (let i = 0; i < bytecode.length; i += 5) {
				if (bytecode[i] === BytecodeOpCode.CHECK_RIGHT_BUTTON_PRESS) {
					buttonCheckCount++
				}
			}

			expect(buttonCheckCount).toBe(2)
		})

		test("should handle button check in for loop with multiple iterations", () => {
			const code = `
				for (int i = 0; i < 5; i++) {
					if (right_button.is_pressed()) {
						rgbLed.set_led_green();
					}
				}
			`

			const bytecode = CppParser.cppToByte(code)

			// Find the CHECK_RIGHT_BUTTON_PRESS instruction
			let buttonCheckFound = false
			for (let i = 0; i < bytecode.length; i += 5) {
				if (bytecode[i] === BytecodeOpCode.CHECK_RIGHT_BUTTON_PRESS) {
					buttonCheckFound = true
					break
				}
			}

			expect(buttonCheckFound).toBe(true)
		})

		test("should handle button check with arithmetic comparisons using compound condition", () => {
			const code = `
				if ((right_button.is_pressed()) && (10 > 5)) {
					rgbLed.set_led_blue();
				}
			`

			const bytecode = CppParser.cppToByte(code)

			// Find the CHECK_RIGHT_BUTTON_PRESS instruction
			let buttonCheckFound = false
			for (let i = 0; i < bytecode.length; i += 5) {
				if (bytecode[i] === BytecodeOpCode.CHECK_RIGHT_BUTTON_PRESS) {
					buttonCheckFound = true
					break
				}
			}

			expect(buttonCheckFound).toBe(true)
		})

		test("should handle button check with variable comparisons using compound condition", () => {
			const code = `
				int counter = 5;
				if ((right_button.is_pressed()) && (counter > 3)) {
					rgbLed.set_led_yellow();
				}
			`

			const bytecode = CppParser.cppToByte(code)

			// Find the CHECK_RIGHT_BUTTON_PRESS instruction
			let buttonCheckFound = false
			for (let i = 0; i < bytecode.length; i += 5) {
				if (bytecode[i] === BytecodeOpCode.CHECK_RIGHT_BUTTON_PRESS) {
					buttonCheckFound = true
					break
				}
			}

			expect(buttonCheckFound).toBe(true)
		})
	})
})
