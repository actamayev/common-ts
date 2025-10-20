import { CppParser } from "../../src/parsers/cpp-parser"
import { BytecodeOpCode } from "../../src/types/bytecode-types"

describe("Motor Command Functionality", () => {
	describe("Basic Motor Commands", () => {
		test("should parse go forward command", () => {
			const code = "go(FORWARD, 50);"
			const bytecode = CppParser.cppToByte(code)

			// Check bytecode
			expect(bytecode[0]).toBe(BytecodeOpCode.MOTOR_GO)
			expect(bytecode[1]).toBe(1)  // 1 for forward
			expect(bytecode[2]).toBe(50) // Throttle percentage
			expect(bytecode[3]).toBe(0)  // Unused
			expect(bytecode[4]).toBe(0)  // Unused

			// Check END instruction
			expect(bytecode[5]).toBe(BytecodeOpCode.END)
		})

		test("should parse go backward command", () => {
			const code = "go(BACKWARD, 75);"
			const bytecode = CppParser.cppToByte(code)

			expect(bytecode[0]).toBe(BytecodeOpCode.MOTOR_GO)
			expect(bytecode[1]).toBe(0)  // 0 for backward
			expect(bytecode[2]).toBe(75) // Throttle percentage
			expect(bytecode[3]).toBe(0)  // Unused
			expect(bytecode[4]).toBe(0)  // Unused
		})

		test("should parse stopMotors command", () => {
			const code = "stopMotors();"
			const bytecode = CppParser.cppToByte(code)

			expect(bytecode[0]).toBe(BytecodeOpCode.MOTOR_STOP)
			expect(bytecode[1]).toBe(0)  // Unused
			expect(bytecode[2]).toBe(0)  // Unused
			expect(bytecode[3]).toBe(0)  // Unused
			expect(bytecode[4]).toBe(0)  // Unused
		})

		test("should reject invalid throttle percentage for go forward", () => {
			expect(() => {
				CppParser.cppToByte("go(FORWARD, 101);")
			}).toThrow(/Invalid throttle percentage/)
		})

		test("should reject negative throttle value for go forward", () => {
			expect(() => {
				CppParser.cppToByte("go(FORWARD, -5);")
			}).toThrow(/Invalid command/)
		})

		test("should reject invalid throttle percentage for go backward", () => {
			expect(() => {
				CppParser.cppToByte("go(BACKWARD, 101);")
			}).toThrow(/Invalid throttle percentage/)
		})

		test("should reject negative throttle value for go backward", () => {
			expect(() => {
				CppParser.cppToByte("go(BACKWARD, -5);")
			}).toThrow(/Invalid command/)
		})
	})

	describe("Turn Commands", () => {
		test("should parse turn command with clockwise direction", () => {
			const code = "turn(CLOCKWISE, 90);"
			const bytecode = CppParser.cppToByte(code)

			expect(bytecode[0]).toBe(BytecodeOpCode.MOTOR_TURN)
			expect(bytecode[1]).toBe(1)  // 1 for clockwise
			expect(bytecode[2]).toBe(90) // Degrees
			expect(bytecode[3]).toBe(0)  // Unused
			expect(bytecode[4]).toBe(0)  // Unused
		})

		test("should parse turn command with counterclockwise direction", () => {
			const code = "turn(COUNTERCLOCKWISE, 180);"
			const bytecode = CppParser.cppToByte(code)

			expect(bytecode[0]).toBe(BytecodeOpCode.MOTOR_TURN)
			expect(bytecode[1]).toBe(0)   // 0 for counterclockwise
			expect(bytecode[2]).toBe(180) // Degrees
			expect(bytecode[3]).toBe(0)   // Unused
			expect(bytecode[4]).toBe(0)   // Unused
		})

		test("should reject invalid degree value for turn", () => {
			expect(() => {
				CppParser.cppToByte("turn(CLOCKWISE, 0);")
			}).toThrow(/Invalid degrees/)

			expect(() => {
				CppParser.cppToByte("turn(COUNTERCLOCKWISE, 1081);")
			}).toThrow(/Invalid degrees/)
		})
	})

	describe("Timed Motor Commands", () => {
		test("should parse goTime forward command", () => {
			const code = "goTime(FORWARD, 2.5, 60);"
			const bytecode = CppParser.cppToByte(code)

			expect(bytecode[0]).toBe(BytecodeOpCode.MOTOR_GO_TIME)
			expect(bytecode[1]).toBe(1)   // 1 for forward
			expect(bytecode[2]).toBe(2.5) // Seconds
			expect(bytecode[3]).toBe(60)  // Throttle percentage
			expect(bytecode[4]).toBe(0)   // Unused
		})

		test("should parse goTime backward command", () => {
			const code = "goTime(BACKWARD, 1.75, 45);"
			const bytecode = CppParser.cppToByte(code)

			expect(bytecode[0]).toBe(BytecodeOpCode.MOTOR_GO_TIME)
			expect(bytecode[1]).toBe(0)    // 0 for backward
			expect(bytecode[2]).toBe(1.75) // Seconds
			expect(bytecode[3]).toBe(45)   // Throttle percentage
			expect(bytecode[4]).toBe(0)    // Unused
		})

		test("should reject invalid time value for goTime forward", () => {
			expect(() => {
				CppParser.cppToByte("goTime(FORWARD, 0, 50);")
			}).toThrow(/Invalid time value/)
		})

		test("should reject negative time value for goTime forward", () => {
			expect(() => {
				CppParser.cppToByte("goTime(FORWARD, -1.5, 50);")
			}).toThrow(/Invalid command/)
		})

		test("should reject invalid throttle percentage for goTime backward", () => {
			expect(() => {
				CppParser.cppToByte("goTime(BACKWARD, 2.0, 101);")
			}).toThrow(/Invalid throttle percentage/)
		})

		test("should reject negative throttle value for goTime backward", () => {
			expect(() => {
				CppParser.cppToByte("goTime(BACKWARD, 2.0, -10);")
			}).toThrow(/Invalid command/)
		})
	})

	describe("Distance Motor Commands", () => {
		test("should parse goDistance forward command", () => {
			const code = "goDistance(FORWARD, 15.5, 70);"
			const bytecode = CppParser.cppToByte(code)

			expect(bytecode[0]).toBe(BytecodeOpCode.MOTOR_GO_DISTANCE)
			expect(bytecode[1]).toBe(1)    // 1 for forward
			expect(bytecode[2]).toBe(15.5) // Distance in inches
			expect(bytecode[3]).toBe(70)   // Throttle percentage
			expect(bytecode[4]).toBe(0)    // Unused
		})

		test("should parse goDistance backward command", () => {
			const code = "goDistance(BACKWARD, 10.0, 55);"
			const bytecode = CppParser.cppToByte(code)

			expect(bytecode[0]).toBe(BytecodeOpCode.MOTOR_GO_DISTANCE)
			expect(bytecode[1]).toBe(0)    // 0 for backward
			expect(bytecode[2]).toBe(10.0) // Distance in inches
			expect(bytecode[3]).toBe(55)   // Throttle percentage
			expect(bytecode[4]).toBe(0)    // Unused
		})

		test("should reject invalid distance value for goDistance forward", () => {
			expect(() => {
				CppParser.cppToByte("goDistance(FORWARD, 0, 50);")
			}).toThrow(/Invalid distance value/)
		})

		test("should reject negative distance value for goDistance forward", () => {
			expect(() => {
				CppParser.cppToByte("goDistance(FORWARD, -5.5, 50);")
			}).toThrow(/Invalid command/)
		})

		test("should reject invalid throttle percentage for goDistance backward", () => {
			expect(() => {
				CppParser.cppToByte("goDistance(BACKWARD, 10.0, 101);")
			}).toThrow(/Invalid throttle percentage/)
		})

		test("should reject negative throttle value for goDistance backward", () => {
			expect(() => {
				CppParser.cppToByte("goDistance(BACKWARD, 10.0, -10);")
			}).toThrow(/Invalid command/)
		})
	})

	describe("Complex Motor Command Sequences", () => {
		test("should parse a complex motor control sequence", () => {
			const code = `
        go(FORWARD, 50);
        wait(1);
        turn(CLOCKWISE, 90);
        wait(0.5);
        go(FORWARD, 75);
        wait(2);
        turn(COUNTERCLOCKWISE, 45);
        wait(0.5);
        go(BACKWARD, 40);
        wait(1.5);
        stopMotors();
      `

			const bytecode = CppParser.cppToByte(code)

			// Check the first instruction is MOTOR_GO
			expect(bytecode[0]).toBe(BytecodeOpCode.MOTOR_GO)
			expect(bytecode[1]).toBe(1)  // 1 for forward
			expect(bytecode[2]).toBe(50) // throttle percentage

			// Check the third instruction is MOTOR_TURN with clockwise
			expect(bytecode[10]).toBe(BytecodeOpCode.MOTOR_TURN)
			expect(bytecode[11]).toBe(1) // clockwise
			expect(bytecode[12]).toBe(90) // 90 degrees

			// Check the last instruction before END is MOTOR_STOP
			const stopIndex = bytecode.length - 10
			expect(bytecode[stopIndex]).toBe(BytecodeOpCode.MOTOR_STOP)
		})

		test("should parse a sequence with timed and distance commands", () => {
			const code = `
        goTime(FORWARD, 3.0, 60);
        wait(0.5);
        turn(CLOCKWISE, 180);
        wait(0.5);
        goDistance(BACKWARD, 20.0, 80);
        wait(0.5);
        stopMotors();
      `

			const bytecode = CppParser.cppToByte(code)

			// Check the first instruction is MOTOR_GO_TIME
			expect(bytecode[0]).toBe(BytecodeOpCode.MOTOR_GO_TIME)
			expect(bytecode[1]).toBe(1)   // 1 for forward
			expect(bytecode[2]).toBe(3.0) // seconds
			expect(bytecode[3]).toBe(60)  // throttle percentage

			// Check the fifth instruction is MOTOR_GO_DISTANCE
			expect(bytecode[20]).toBe(BytecodeOpCode.MOTOR_GO_DISTANCE)
			expect(bytecode[21]).toBe(0)    // 0 for backward
			expect(bytecode[22]).toBe(20.0) // distance
			expect(bytecode[23]).toBe(80)   // throttle percentage
		})
	})

	describe("Motor Commands in Control Structures", () => {
		test("should parse motor commands in if-else blocks", () => {
			const code = `
        if (Sensors::getInstance().getPitch() > 10) {
          go(FORWARD, 70);
        } else {
          go(BACKWARD, 70);
        }
      `

			const bytecode = CppParser.cppToByte(code)

			// Find motor commands in the bytecode
			let forwardFound = false
			let backwardFound = false

			for (let i = 0; i < bytecode.length; i += 5) {
				if (bytecode[i] === BytecodeOpCode.MOTOR_GO) {
					if (bytecode[i + 1] === 1) { // Forward
						forwardFound = true
					} else if (bytecode[i + 1] === 0) { // Backward
						backwardFound = true
					}
				}
			}

			expect(forwardFound).toBe(true)
			expect(backwardFound).toBe(true)
		})

		test("should parse motor commands in for loops", () => {
			const code = `
        for (int i = 0; i < 3; i++) {
          go(FORWARD, 50);
          wait(0.5);
          turn(CLOCKWISE, 120);
          wait(0.5);
        }
      `

			const bytecode = CppParser.cppToByte(code)

			// Find motor commands in the bytecode
			let forwardCount = 0
			let turnCount = 0

			for (let i = 0; i < bytecode.length; i += 5) {
				if (bytecode[i] === BytecodeOpCode.MOTOR_GO) {
					forwardCount++
				} else if (bytecode[i] === BytecodeOpCode.MOTOR_TURN) {
					turnCount++
				}
			}

			// Should find one of each even though it's in a loop
			expect(forwardCount).toBe(1)
			expect(turnCount).toBe(1)
		})

		test("should parse motor commands in while loops", () => {
			const code = `
        while(true) {
          goDistance(FORWARD, 10.0, 60);
          wait(1);
          turn(COUNTERCLOCKWISE, 180);
          wait(1);
          goDistance(BACKWARD, 10.0, 60);
          wait(1);
          turn(CLOCKWISE, 180);
          wait(1);
        }
      `

			const bytecode = CppParser.cppToByte(code)

			// Find motor commands in the bytecode
			let forwardFound = false
			let backwardFound = false
			let clockwiseTurnFound = false
			let counterclockwiseTurnFound = false

			for (let i = 0; i < bytecode.length; i += 5) {
				if (bytecode[i] === BytecodeOpCode.MOTOR_GO_DISTANCE) {
					if (bytecode[i + 1] === 1) { // Forward
						forwardFound = true
					} else if (bytecode[i + 1] === 0) { // Backward
						backwardFound = true
					}
				} else if (bytecode[i] === BytecodeOpCode.MOTOR_TURN) {
					if (bytecode[i + 1] === 1) { // Clockwise
						clockwiseTurnFound = true
					} else if (bytecode[i + 1] === 0) { // Counterclockwise
						counterclockwiseTurnFound = true
					}
				}
			}

			expect(forwardFound).toBe(true)
			expect(backwardFound).toBe(true)
			expect(clockwiseTurnFound).toBe(true)
			expect(counterclockwiseTurnFound).toBe(true)
		})
	})
})
