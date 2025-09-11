/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/naming-convention */
import { ChallengeUUID, CareerUUID } from "../utils"
import { CqChallengeData } from "../career-quest"
import { LOOP_BLOCK_TYPES, START_BLOCK_TYPES } from "../blockly/logic-block-types"
import { LED_BLOCK_TYPES } from "../blockly/led-block-types"
import { createChallengeToolbox } from "../utils/blockly-helpers"
import { MOTOR_BLOCK_TYPES } from "../blockly/motor-block-types"

//Panel #4:
// “Your turn.
// Build a program that
// Starts on Button A,
// Turns my LEDs blue for two second,
// Then switches to  red for two second,
// Then turns off
// [Empty workspace; available blocks: Start on Button, All LEDs, Delay. Pip runs when uploaded]

export const DRIVING_SCHOOL_CHALLENGE_S2_P4: CqChallengeData = {
	challengeUUID: "5892848a-8334-48a7-82aa-bbbe43d2e92f" as ChallengeUUID,
	careerUUID: "af21b042-86ac-4790-a60d-fd102a469401" as CareerUUID,
	title: "Driving School Challenge 2 Part 4",
	description: "Driving School Challenge 2 Part 4",
	difficulty: "beginner",
	challengeIndex: 1,
	initialBlocklyJson: {},
	...createChallengeToolbox([
		START_BLOCK_TYPES.BUTTON_PRESS_START,
		LED_BLOCK_TYPES.CONTROL_ALL_LEDS
	]),
	expectedBehavior: "Pip starts on button A, turns LEDs blue for two seconds, then switches to red for two seconds, then turns off.",
	commonMistakes: [
		"Forgetting to use the delay block",
		"Forgetting to use the LEDs block",
		"Forgetting to use the start button block",
	],
	learningObjectives: [
		"Understanding how to use the delay block",
		"Understanding how to use the LEDs block",
		"Understanding how to use the start button block",
	],
	solutionCode: `
	wait_for_button_press();
	rgbLed.set_led_blue();
	wait(2);
	rgbLed.set_led_red();
	wait(2);
	rgbLed.set_led_off();
	`,
}

// “Your turn.
// Build a program that makes me
// go forward 15 centimeters
// at 50 percent speed,
// then stop.”
// [Empty workspace; available blocks: Start on Button, Go forward x distance at x speed, Stop. Pip runs when uploaded.]

export const DRIVING_SCHOOL_CHALLENGE_S3_P5: CqChallengeData = {
	challengeUUID: "718e291a-1c03-4948-88c4-ef0762cfc4df" as ChallengeUUID,
	careerUUID: "af21b042-86ac-4790-a60d-fd102a469401" as CareerUUID,
	title: "Driving School Challenge 3 Part 5",
	description: "Driving School Challenge 3 Part 5",
	difficulty: "beginner",
	challengeIndex: 2,
	initialBlocklyJson: {},
	...createChallengeToolbox([
		START_BLOCK_TYPES.BUTTON_PRESS_START,
		MOTOR_BLOCK_TYPES.GO_FORWARD_DISTANCE,
		MOTOR_BLOCK_TYPES.STOP,
	]),
	expectedBehavior: "Pip starts on button A, goes forward 15 centimeters at 50 percent speed, then stops.",
	commonMistakes: [
		"Forgetting to use the delay block",
		"Forgetting to use the LEDs block",
		"Forgetting to use the start button block",
	],
	learningObjectives: [
		"Understanding how to use the delay block",
		"Understanding how to use the LEDs block",
		"Understanding how to use the start button block",
	],
	solutionCode: `
	wait_for_button_press();
	goForwardDistance(15, 50);
	stop();
	`,
}

/*“Your turn!
Build a program that makes me:
turn 180 degrees clockwise
wait two seconds
then turn 180 degrees counterclockwise
[Empty workspace; available blocks: Start on Button, Turn clockwise/counterclockwise x°, Delay, Stop. Pip runs when uploaded]
*/
export const DRIVING_SCHOOL_CHALLENGE_S4_P5: CqChallengeData = {
	challengeUUID: "b9114111-48f1-4589-bc10-5030f2d9621f" as ChallengeUUID,
	careerUUID: "af21b042-86ac-4790-a60d-fd102a469401" as CareerUUID,
	title: "Driving School Challenge 4 Part 5",
	description: "Driving School Challenge 4 Part 5",
	difficulty: "beginner",
	challengeIndex: 3,
	initialBlocklyJson: { },
	...createChallengeToolbox([
		START_BLOCK_TYPES.BUTTON_PRESS_START,
		MOTOR_BLOCK_TYPES.TURN,
		LOOP_BLOCK_TYPES.WAIT,
		MOTOR_BLOCK_TYPES.STOP,
	]),
	expectedBehavior: "Pip starts on button A, turns 180 degrees clockwise, waits two seconds, then turns 180 degrees counterclockwise, then stops.",
	commonMistakes: [
		"Forgetting to use the delay block",
		"Forgetting to use the LEDs block",
		"Forgetting to use the start button block",
	],
	learningObjectives: [
		"Understanding how to use the delay block",
		"Understanding how to use the LEDs block",
		"Understanding how to use the start button block",
	],
	solutionCode: `
	wait_for_button_press();
	turn(CLOCKWISE, 180);
	wait(2);
	turn(COUNTERCLOCKWISE, 180);
	stop();
	`,
}

/*“Here’s your challenge.
Build a program that makes me
drive in a square
and return to where I started.”
[Empty workspace with starter code: forward → turn → forward already placed. Learner must add two more forward → turn pairs and a final stop.]
*/

export const DRIVING_SCHOOL_CHALLENGE_S5_P4: CqChallengeData = {
	challengeUUID: "d7eb2c2f-da43-4f6a-96e5-cffa51c51531" as ChallengeUUID,
	careerUUID: "af21b042-86ac-4790-a60d-fd102a469401" as CareerUUID,
	title: "Driving School Challenge 5 Part 4",
	description: "Driving School Challenge 5 Part 4",
	difficulty: "beginner",
	challengeIndex: 4,
	initialBlocklyJson: {},
	...createChallengeToolbox([
		MOTOR_BLOCK_TYPES.GO_FORWARD,
		MOTOR_BLOCK_TYPES.TURN,
		MOTOR_BLOCK_TYPES.STOP,
	]),
	expectedBehavior: "Pip starts on button A, drives in a square, and returns to where it started.",
	commonMistakes: [
		"Forgetting to use the delay block",
		"Forgetting to use the LEDs block",
		"Forgetting to use the start button block",
	],
	learningObjectives: [
		"Understanding how to use the delay block",
		"Understanding how to use the LEDs block",
		"Understanding how to use the start button block",
	],
	solutionCode: `
	wait_for_button_press();
	goForward();
	turn(CLOCKWISE, 90);
	goForward();
	stop();
	`,
}

export const DRIVING_SCHOOL_CHALLENGES: CqChallengeData[] = [
	DRIVING_SCHOOL_CHALLENGE_S2_P4,
	DRIVING_SCHOOL_CHALLENGE_S3_P5,
	DRIVING_SCHOOL_CHALLENGE_S4_P5,
	DRIVING_SCHOOL_CHALLENGE_S5_P4,
]
