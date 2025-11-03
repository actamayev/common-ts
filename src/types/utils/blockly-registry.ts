/* eslint-disable max-len */
import { BlocklyCategoryName, ParentCategoryName } from "../blockly/block-categories"
import { BlockNames } from "../blockly/blockly"
import { BUTTON_BLOCK_TYPES } from "../blockly/button-block-types"
import { LED_BLOCK_TYPES } from "../blockly/led-block-types"
import { CONDITIONAL_BLOCK_TYPES, LOOP_BLOCK_TYPES, MATH_BLOCK_TYPES, START_BLOCK_TYPES, VARIABLE_BLOCK_TYPES } from "../blockly/logic-block-types"
import { MOTOR_BLOCK_TYPES } from "../blockly/motor-block-types"
import { SENSORS_BLOCK_TYPES } from "../blockly/sensor-block-types"
import { SPEAKER_BLOCK_TYPES } from "../blockly/speaker-block-types"

export interface BlockDefinition {
	description: string
	codeTemplate: string
	category: BlocklyCategoryName // Now uses your specific category types
	parentCategory?: ParentCategoryName // Optional parent category
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const BLOCK_REGISTRY: Record<BlockNames, BlockDefinition> = {
	// Motor blocks
	[MOTOR_BLOCK_TYPES.DRIVE]: {
		description: "Makes the robot move forward continuously",
		codeTemplate: "motors.drive({direction}, {speed});",
		category: "Motors"
	},
	[MOTOR_BLOCK_TYPES.DRIVE_TIME]: {
		description: "Makes the robot move forward for a specific amount of time",
		codeTemplate: "motors.drive_time({direction}, {seconds}, {speed});",
		category: "Motors"
	},
	[MOTOR_BLOCK_TYPES.DRIVE_DISTANCE]: {
		description: "Makes the robot move forward for a specific distance in millimeters",
		codeTemplate: "motors.drive_distance({direction}, {distance_inches}, {speed});",
		category: "Motors"
	},
	[MOTOR_BLOCK_TYPES.STOP]: {
		description: "Stops all motor movement",
		codeTemplate: "motors.stop();",
		category: "Motors"
	},
	[MOTOR_BLOCK_TYPES.TURN]: {
		description: "Turns the robot in a specific direction by degrees",
		codeTemplate: "motors.turn({CLOCKWISE|COUNTERCLOCKWISE}, {degrees});",
		category: "Motors"
	},

	// LED blocks
	[LED_BLOCK_TYPES.CONTROL_ALL_LEDS]: {
		description: "Controls the RGB LED color (red, green, blue, white, off)",
		codeTemplate: "all_leds.set_color({color});",
		category: "LED"
	},

	// Speaker blocks
	[SPEAKER_BLOCK_TYPES.PLAY_SOUND]: {
		description: "Plays a sound",
		codeTemplate: "speaker.play_sound({sound_name});",
		category: "Speaker"
	},

	[SPEAKER_BLOCK_TYPES.PLAY_TONE]: {
		description: "Plays a tone",
		codeTemplate: "speaker.play_tone({tone_name});",
		category: "Speaker"
	},

	// Distance sensor blocks
	[SENSORS_BLOCK_TYPES.CENTER_TOF_READ]: {
		description: "Reads the front distance sensor to detect objects",
		codeTemplate: "front_distance_sensor.is_object_in_front()",
		category: "Distance Sensors",
		parentCategory: "Sensors"
	},
	[SENSORS_BLOCK_TYPES.SIDE_TOF_READ]: {
		description: "Reads the side distance sensors to detect objects on left or right",
		codeTemplate: "left_distance_sensor.is_object_near() || right_distance_sensor.is_object_near()",
		category: "Distance Sensors",
		parentCategory: "Sensors"
	},

	// Color sensor blocks
	[SENSORS_BLOCK_TYPES.COLOR_SENSOR_READ]: {
		description: "Reads the color sensor to detect objects (red, green, blue, white, black, yellow)",
		codeTemplate: "color_sensor.is_object({color})",
		category: "Color Sensor",
		parentCategory: "Sensors"
	},

	// Motion sensor blocks
	[SENSORS_BLOCK_TYPES.IMU_READ]: {
		description: "Reads the IMU (accelerometer/gyroscope) for orientation and movement data",
		codeTemplate: "imu.get_{axis|angle}()",
		category: "Motion Sensor",
		parentCategory: "Sensors"
	},

	// Distance sensor blocks
	[SENSORS_BLOCK_TYPES.GET_FRONT_TOF_DISTANCE]: {
		description: "Gets the distance from the front TOF sensor",
		codeTemplate: "front_distance_sensor.get_distance()",
		category: "Distance Sensors",
		parentCategory: "Sensors"
	},

	// Start blocks
	[START_BLOCK_TYPES.BUTTON_PRESS_START]: {
		description: "Waits for the button to be pressed before continuing",
		codeTemplate: "left_button.wait_for_press();",
		category: "Start",
		parentCategory: "Logic"
	},

	// Variable blocks
	[VARIABLE_BLOCK_TYPES.VARIABLE_DECLARE_FLOAT]: {
		description: "Creates a new decimal number variable",
		codeTemplate: "float {variable_name} = {value};",
		category: "Variables",
		parentCategory: "Logic"
	},
	[VARIABLE_BLOCK_TYPES.VARIABLE_GET_FLOAT]: {
		description: "Gets the value of a decimal number variable",
		codeTemplate: "{variable_name}",
		category: "Variables",
		parentCategory: "Logic"
	},
	[VARIABLE_BLOCK_TYPES.VARIABLE_DECLARE_INT]: {
		description: "Creates a new whole number variable",
		codeTemplate: "int {variable_name} = {value};",
		category: "Variables",
		parentCategory: "Logic"
	},
	[VARIABLE_BLOCK_TYPES.VARIABLE_GET_INT]: {
		description: "Gets the value of a whole number variable",
		codeTemplate: "{variable_name}",
		category: "Variables",
		parentCategory: "Logic"
	},
	[VARIABLE_BLOCK_TYPES.VARIABLE_DECLARE_BOOL]: {
		description: "Creates a new true/false variable",
		codeTemplate: "bool {variable_name} = {true|false};",
		category: "Variables",
		parentCategory: "Logic"
	},
	[VARIABLE_BLOCK_TYPES.VARIABLE_GET_BOOL]: {
		description: "Gets the value of a true/false variable",
		codeTemplate: "{variable_name}",
		category: "Variables",
		parentCategory: "Logic"
	},
	[VARIABLE_BLOCK_TYPES.VARIABLE_ASSIGN]: {
		description: "Sets a variable to a new value",
		codeTemplate: "{variable_name} = {new_value};",
		category: "Variables",
		parentCategory: "Logic"
	},

	// Conditional blocks
	[CONDITIONAL_BLOCK_TYPES.IF]: {
		description: "Executes code only if a condition is true",
		codeTemplate: "if ({condition}) {\n  // your code here\n}",
		category: "Conditionals",
		parentCategory: "Logic"
	},
	[CONDITIONAL_BLOCK_TYPES.IF_ELSE]: {
		description: "Executes different code based on a condition",
		codeTemplate: "if ({condition}) {\n  // if true\n} else {\n  // if false\n}",
		category: "Conditionals",
		parentCategory: "Logic"
	},
	[CONDITIONAL_BLOCK_TYPES.IF_ELSEIF_ELSE]: {
		description: "Executes code based on multiple conditions with else if",
		codeTemplate: "if ({condition1}) {\n  // first condition\n} else if ({condition2}) {\n  // second condition\n} else {\n  // if neither\n}",
		category: "Conditionals",
		parentCategory: "Logic"
	},
	[CONDITIONAL_BLOCK_TYPES.IF_2ELSEIF_ELSE]: {
		description: "Executes code based on multiple conditions with two else ifs",
		codeTemplate: "if ({condition1}) {\n  // first condition\n} else if ({condition2}) {\n  // second condition\n} else if ({condition3}) {\n  // third condition\n} else {\n  // if none\n}",
		category: "Conditionals",
		parentCategory: "Logic"
	},

	// Math blocks
	[MATH_BLOCK_TYPES.COMPARE]: {
		description: "Compares two values (equal, not equal, greater than, less than)",
		codeTemplate: "{value1} {==|!=|>|<|>=|<=} {value2}",
		category: "Math",
		parentCategory: "Logic"
	},
	[MATH_BLOCK_TYPES.OPERATION]: {
		description: "Performs logical operations (and, or, not)",
		codeTemplate: "{condition1} {&&||\\||!} {condition2}",
		category: "Math",
		parentCategory: "Logic"
	},
	[MATH_BLOCK_TYPES.NEGATE]: {
		description: "Reverses a true/false value (not operator)",
		codeTemplate: "!{condition}",
		category: "Math",
		parentCategory: "Logic"
	},
	[MATH_BLOCK_TYPES.NUMBER]: {
		description: "A number value (whole number or decimal)",
		codeTemplate: "{number}",
		category: "Math",
		parentCategory: "Logic"
	},
	[MATH_BLOCK_TYPES.ARITHMETIC]: {
		description: "Performs arithmetic operations (add, subtract, multiply, divide)",
		codeTemplate: "{value1} {+|-|*|/|%} {value2}",
		category: "Math",
		parentCategory: "Logic"
	},

	// Loop blocks
	[LOOP_BLOCK_TYPES.FOREVER_LOOP]: {
		description: "Runs code continuously in a forever loop",
		codeTemplate: "while(true) {\n  // your code here\n}",
		category: "Loops",
		parentCategory: "Logic"
	},
	[LOOP_BLOCK_TYPES.REPEAT]: {
		description: "Repeats code a specified number of times",
		codeTemplate: "for(int i = 0; i < {times}; i++) {\n  // your code here\n}",
		category: "Loops",
		parentCategory: "Logic"
	},
	[LOOP_BLOCK_TYPES.WAIT]: {
		description: "Pauses execution for a specified time in seconds",
		codeTemplate: "wait({seconds});",
		category: "Loops",
		parentCategory: "Logic"
	},

	// Button blocks
	[BUTTON_BLOCK_TYPES.RIGHT_BUTTON_PRESS]: {
		description: "Reads the right button to detect if it is pressed",
		codeTemplate: "right_button.is_pressed()",
		category: "Button",
	}
}
