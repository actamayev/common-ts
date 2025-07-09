/* eslint-disable max-len */
import { BlockNames, CONDITIONAL_BLOCK_TYPES, LED_BLOCK_TYPES,
	LOOP_BLOCK_TYPES, MATH_BLOCK_TYPES, MOTOR_BLOCK_TYPES, SENSORS_BLOCK_TYPES,
	START_BLOCK_TYPES, VARIABLE_BLOCK_TYPES } from "../blockly"

export interface BlockDefinition {
    description: string
    codeTemplate: string
    category?: string
}

// registry/block-registry.ts
// eslint-disable-next-line @typescript-eslint/naming-convention
export const BLOCK_REGISTRY: Record<BlockNames, BlockDefinition> = {
	// Loop blocks
	[LOOP_BLOCK_TYPES.ESP32_LOOP]: {
		description: "Runs code continuously in a forever loop",
		codeTemplate: "while(true) {\n  // your code here\n}",
		category: "control"
	},
	[LOOP_BLOCK_TYPES.REPEAT]: {
		description: "Repeats code a specified number of times",
		codeTemplate: "for(int i = 0; i < {times}; i++) {\n  // your code here\n}",
		category: "control"
	},
	[LOOP_BLOCK_TYPES.ESP32_DELAY]: {
		description: "Pauses execution for a specified time in milliseconds",
		codeTemplate: "delay({milliseconds});",
		category: "control"
	},

	// Conditional blocks
	[CONDITIONAL_BLOCK_TYPES.IF]: {
		description: "Executes code only if a condition is true",
		codeTemplate: "if ({condition}) {\n  // your code here\n}",
		category: "logic"
	},
	[CONDITIONAL_BLOCK_TYPES.IF_ELSE]: {
		description: "Executes different code based on a condition",
		codeTemplate: "if ({condition}) {\n  // if true\n} else {\n  // if false\n}",
		category: "logic"
	},
	[CONDITIONAL_BLOCK_TYPES.IF_ELSEIF_ELSE]: {
		description: "Executes code based on multiple conditions with else if",
		codeTemplate: "if ({condition1}) {\n  // first condition\n} else if ({condition2}) {\n  // second condition\n} else {\n  // if neither\n}",
		category: "logic"
	},
	[CONDITIONAL_BLOCK_TYPES.IF_2ELSEIF_ELSE]: {
		description: "Executes code based on multiple conditions with two else ifs",
		codeTemplate: "if ({condition1}) {\n  // first condition\n} else if ({condition2}) {\n  // second condition\n} else if ({condition3}) {\n  // third condition\n} else {\n  // if none\n}",
		category: "logic"
	},

	// Sensor blocks
	[SENSORS_BLOCK_TYPES.CENTER_TOF_READ]: {
		description: "Reads the front distance sensor to detect objects",
		codeTemplate: "is_object_in_front()",
		category: "sensor"
	},
	[SENSORS_BLOCK_TYPES.SIDE_TOF_READ]: {
		description: "Reads the side distance sensors to detect objects on left or right",
		codeTemplate: "is_object_near_side_{left|right}()",
		category: "sensor"
	},
	[SENSORS_BLOCK_TYPES.IMU_READ]: {
		description: "Reads the IMU (accelerometer/gyroscope) for orientation and movement data",
		codeTemplate: "get_imu_{axis|angle}()",
		category: "sensor"
	},

	// LED blocks
	[LED_BLOCK_TYPES.ESP32_LED_CONTROL]: {
		description: "Controls the RGB LED color (red, green, blue, white, off)",
		codeTemplate: "rgbLed.set_led_{color}();",
		category: "actuator"
	},

	// Motor blocks
	[MOTOR_BLOCK_TYPES.GO_FORWARD]: {
		description: "Makes the robot move forward continuously",
		codeTemplate: "goForward();",
		category: "actuator"
	},
	[MOTOR_BLOCK_TYPES.GO_BACKWARD]: {
		description: "Makes the robot move backward continuously",
		codeTemplate: "goBackward();",
		category: "actuator"
	},
	[MOTOR_BLOCK_TYPES.GO_FORWARD_TIME]: {
		description: "Makes the robot move forward for a specific amount of time",
		codeTemplate: "goForward({time_ms});",
		category: "actuator"
	},
	[MOTOR_BLOCK_TYPES.GO_BACKWARD_TIME]: {
		description: "Makes the robot move backward for a specific amount of time",
		codeTemplate: "goBackward({time_ms});",
		category: "actuator"
	},
	[MOTOR_BLOCK_TYPES.GO_FORWARD_DISTANCE]: {
		description: "Makes the robot move forward for a specific distance in millimeters",
		codeTemplate: "goForward({distance_mm});",
		category: "actuator"
	},
	[MOTOR_BLOCK_TYPES.GO_BACKWARD_DISTANCE]: {
		description: "Makes the robot move backward for a specific distance in millimeters",
		codeTemplate: "goBackward({distance_mm});",
		category: "actuator"
	},
	[MOTOR_BLOCK_TYPES.STOP]: {
		description: "Stops all motor movement",
		codeTemplate: "stop();",
		category: "actuator"
	},
	[MOTOR_BLOCK_TYPES.TURN]: {
		description: "Turns the robot in a specific direction by degrees",
		codeTemplate: "turn({CLOCKWISE|COUNTERCLOCKWISE}, {degrees});",
		category: "actuator"
	},

	// Start blocks
	[START_BLOCK_TYPES.BUTTON_PRESS_START]: {
		description: "Waits for the button to be pressed before continuing",
		codeTemplate: "wait_for_button_press();",
		category: "control"
	},

	// Variable blocks
	[VARIABLE_BLOCK_TYPES.VARIABLE_DECLARE_FLOAT]: {
		description: "Creates a new decimal number variable",
		codeTemplate: "float {variable_name} = {value};",
		category: "variables"
	},
	[VARIABLE_BLOCK_TYPES.VARIABLE_GET_FLOAT]: {
		description: "Gets the value of a decimal number variable",
		codeTemplate: "{variable_name}",
		category: "variables"
	},
	[VARIABLE_BLOCK_TYPES.VARIABLE_DECLARE_INT]: {
		description: "Creates a new whole number variable",
		codeTemplate: "int {variable_name} = {value};",
		category: "variables"
	},
	[VARIABLE_BLOCK_TYPES.VARIABLE_GET_INT]: {
		description: "Gets the value of a whole number variable",
		codeTemplate: "{variable_name}",
		category: "variables"
	},
	[VARIABLE_BLOCK_TYPES.VARIABLE_DECLARE_BOOL]: {
		description: "Creates a new true/false variable",
		codeTemplate: "bool {variable_name} = {true|false};",
		category: "variables"
	},
	[VARIABLE_BLOCK_TYPES.VARIABLE_GET_BOOL]: {
		description: "Gets the value of a true/false variable",
		codeTemplate: "{variable_name}",
		category: "variables"
	},
	[VARIABLE_BLOCK_TYPES.VARIABLE_ASSIGN]: {
		description: "Sets a variable to a new value",
		codeTemplate: "{variable_name} = {new_value};",
		category: "variables"
	},

	// Math blocks
	[MATH_BLOCK_TYPES.COMPARE]: {
		description: "Compares two values (equal, not equal, greater than, less than)",
		codeTemplate: "{value1} {==|!=|>|<|>=|<=} {value2}",
		category: "logic"
	},
	[MATH_BLOCK_TYPES.OPERATION]: {
		description: "Performs logical operations (and, or, not)",
		codeTemplate: "{condition1} {&&||\\||!} {condition2}",
		category: "logic"
	},
	[MATH_BLOCK_TYPES.NEGATE]: {
		description: "Reverses a true/false value (not operator)",
		codeTemplate: "!{condition}",
		category: "logic"
	},
	[MATH_BLOCK_TYPES.NUMBER]: {
		description: "A number value (whole number or decimal)",
		codeTemplate: "{number}",
		category: "math"
	},
	[MATH_BLOCK_TYPES.ARITHMETIC]: {
		description: "Performs arithmetic operations (add, subtract, multiply, divide)",
		codeTemplate: "{value1} {+|-|*|/|%} {value2}",
		category: "math"
	},
	[MATH_BLOCK_TYPES.MATH_SINGLE]: {
		description: "Performs single-value math functions (absolute value, square root, etc.)",
		codeTemplate: "{abs|sqrt|sin|cos|tan|floor|ceil|round}({value})",
		category: "math"
	}
}

