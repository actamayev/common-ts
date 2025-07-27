/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */

import { ChallengeId } from "./utils"
import { CqChallengeData } from "./career-quest"
import { createChallengeToolbox } from "./utils/blockly-helpers"
import { CONDITIONAL_BLOCK_TYPES, LED_BLOCK_TYPES, LOOP_BLOCK_TYPES, MOTOR_BLOCK_TYPES, SENSORS_BLOCK_TYPES, START_BLOCK_TYPES } from "./blockly"

export const OBSTACLE_AVOIDANCE_CHALLENGE_1: CqChallengeData = {
	challengeId: "obstacle-avoidance-001" as ChallengeId,
	careerId: "obstacle-avoidance",
	title: "LED Obstacle Detection",
	description: "Write a program that continuously checks if there's an object in front of Pip. Turn the LED red when an object is detected, and green when there's no object.",
	difficulty: "beginner",
	expectedBehavior: "Pip continuously monitors for obstacles in front. LED turns red when an object is detected within range, and green when the path is clear.",
	commonMistakes: [
		"Forgetting to use a forever loop to continuously check the sensor",
		"Not understanding that the sensor returns true when an object is detected"
	],
	learningObjectives: [
		"Understanding how distance sensors work",
		"Learning to use conditional statements (if-else)",
		"Understanding the importance of continuous monitoring with loops",
		"Learning to control LED outputs"
	],
	beforeRunningText: "Place Pip on a flat surface with clear space in front. You can test the sensor by placing your hand or an object in front of Pip to see the LED change colors.",
	initialBlocklyJson: {},
	...createChallengeToolbox([
		LOOP_BLOCK_TYPES.ESP32_LOOP,
		CONDITIONAL_BLOCK_TYPES.IF_ELSE,
		SENSORS_BLOCK_TYPES.CENTER_TOF_READ,
		LED_BLOCK_TYPES.ESP32_LED_CONTROL
	]),
	solutionCode: `
        while(true) {
            if (is_object_in_front()) {
                rgbLed.set_led_red();
            } else {
                rgbLed.set_led_green();
            }
        }
    `
}

export const OBSTACLE_AVOIDANCE_CHALLENGE_2: CqChallengeData = {
	challengeId: "obstacle-avoidance-002" as ChallengeId,
	careerId: "obstacle-avoidance",
	title: "Basic Obstacle Avoidance with Movement",
	description: "Build upon your LED detection program by adding motor control. Pip should move forward at 50% speed when the path is clear, and stop when an obstacle is detected. Include a start button so Pip waits for your command before beginning.",
	difficulty: "beginner",
	expectedBehavior: "Pip waits for button press to start. Once started, it moves forward at 50% speed while the path is clear (green LED). When an obstacle is detected, it stops moving and shows a red LED. Pip continuously monitors and adjusts its behavior.",
	commonMistakes: [
		"Forgetting to add the start button at the beginning",
		"Not stopping the motors when an obstacle is detected",
		"Placing motor commands outside the conditional logic",
		"Forgetting that both LED and motor commands need to be in the appropriate if-else branches"
	],
	learningObjectives: [
		"Combining sensor input with motor output for autonomous behavior",
		"Understanding the importance of start/stop controls for safety",
		"Learning to coordinate multiple outputs (LEDs and motors) based on sensor input",
		"Building upon previous knowledge to create more complex behaviors"
	],
	beforeRunningText: "Make sure Pip has plenty of open space to move forward safely. Clear any obstacles from the immediate area, but keep something nearby to test the detection. Pip will move when started!",
	initialBlocklyJson: {
		"blocks": {
			"languageVersion": 0,
			"blocks": [
				{
					"type": "esp32_loop",
					"id": "-Vk!.3uhZz;^JL3m6jWX",
					"x": -270,
					"y": -170,
					"inputs": {
						"LOOP_BODY": {
							"block": {
								"type": "controls_if_else",
								"id": "Ae,A|7CwIQ,LQDmb;Ib.",
								"inputs": {
									"IF1": {
										"block": {
											"type": "center_tof_read",
											"id": "0v]LJwhRE:ku#4HS-1v_"
										}
									},
									"DO1": {
										"block": {
											"type": "esp32_led_control",
											"id": "P)bh$Rk*Ian[~5p#G}wK",
											"fields": {
												"esp32_led_control": "RED"
											}
										}
									},
									"ELSE": {
										"block": {
											"type": "esp32_led_control",
											"id": "Y[;LU:B~*pff}w4]83Ne",
											"fields": {
												"esp32_led_control": "GREEN"
											}
										}
									}
								}
							}
						}
					}
				}
			]
		}
	},
	...createChallengeToolbox([
		START_BLOCK_TYPES.BUTTON_PRESS_START,
		LOOP_BLOCK_TYPES.ESP32_LOOP,
		CONDITIONAL_BLOCK_TYPES.IF_ELSE,
		SENSORS_BLOCK_TYPES.CENTER_TOF_READ,
		MOTOR_BLOCK_TYPES.GO_FORWARD,
		MOTOR_BLOCK_TYPES.STOP,
		LED_BLOCK_TYPES.ESP32_LED_CONTROL
	]),
	solutionCode: `
        wait_for_button_press();
        while(true) {
            if (is_object_in_front()) {
                rgbLed.set_led_red();
                stopMotors();
            } else {
                rgbLed.set_led_green();
                goForward(50);
            }
        }
    `
}

export const OBSTACLE_AVOIDANCE_CHALLENGE_3: CqChallengeData = {
	challengeId: "obstacle-avoidance-003" as ChallengeId,
	careerId: "obstacle-avoidance",
	title: "Smart Obstacle Avoidance with Turning",
	description: "Improve your obstacle avoidance program so Pip doesn't get stuck! When an obstacle is detected, Pip should turn 90 degrees clockwise and continue exploring instead of just stopping and waiting.",
	difficulty: "beginner",
	expectedBehavior: "Pip waits for button press to start. When moving forward and an obstacle is detected, it turns 90 degrees clockwise (red LED), then continues forward (green LED). Pip continuously explores by turning around obstacles rather than getting stuck.",
	commonMistakes: [
		"Forgetting to add the turn command when an obstacle is detected",
		"Not understanding that Pip should continue moving after turning",
		"Placing the turn command in the wrong part of the conditional logic",
		"Using the wrong turn direction or angle"
	],
	learningObjectives: [
		"Learning to use motor turning commands for navigation",
		"Understanding how to create autonomous exploration behavior",
		"Building more complex decision-making logic",
		"Combining multiple motor commands (forward, stop, turn) effectively"
	],
	beforeRunningText: "Make sure Pip has plenty of open space in all directions. Pip will now turn and move in different directions when it encounters obstacles. Clear a large area for safe operation!",
	initialBlocklyJson: {
		"blocks": {
			"languageVersion": 0,
			"blocks": [
				{
					"type": "esp32_loop",
					"id": "-Vk!.3uhZz;^JL3m6jWX",
					"x": -270,
					"y": -170,
					"inputs": {
						"LOOP_BODY": {
							"block": {
								"type": "controls_if_else",
								"id": "Ae,A|7CwIQ,LQDmb;Ib.",
								"inputs": {
									"IF1": {
										"block": {
											"type": "center_tof_read",
											"id": "0v]LJwhRE:ku#4HS-1v_"
										}
									},
									"DO1": {
										"block": {
											"type": "esp32_led_control",
											"id": "P)bh$Rk*Ian[~5p#G}wK",
											"fields": {
												"esp32_led_control": "RED"
											},
											"next": {
												"block": {
													"type": "go_forward",
													"id": "8EWhJuIkd}Dkiu^H3lQ8",
													"fields": {
														"percentage": 50
													}
												}
											}
										}
									},
									"ELSE": {
										"block": {
											"type": "esp32_led_control",
											"id": "Y[;LU:B~*pff}w4]83Ne",
											"fields": {
												"esp32_led_control": "GREEN"
											}
										}
									}
								}
							}
						}
					}
				}
			]
		}
	},
	...createChallengeToolbox([
		START_BLOCK_TYPES.BUTTON_PRESS_START,
		LOOP_BLOCK_TYPES.ESP32_LOOP,
		CONDITIONAL_BLOCK_TYPES.IF_ELSE,
		SENSORS_BLOCK_TYPES.CENTER_TOF_READ,
		MOTOR_BLOCK_TYPES.GO_FORWARD,
		MOTOR_BLOCK_TYPES.STOP,
		MOTOR_BLOCK_TYPES.TURN,
		LED_BLOCK_TYPES.ESP32_LED_CONTROL
	]),
	solutionCode: `
        wait_for_button_press();
        while(true) {
            if (is_object_in_front()) {
                rgbLed.set_led_red();
                turn(CLOCKWISE, 90);
            } else {
                rgbLed.set_led_green();
                goForward(50);
            }
        }
    `
}

export const OBSTACLE_AVOIDANCE_CHALLENGE_4: CqChallengeData = {
	challengeId: "obstacle-avoidance-004" as ChallengeId,
	careerId: "obstacle-avoidance",
	title: "Right Side Distance Sensor Detection",
	description: "Write a program that checks if the right-side distance sensor detects something. If an object is detected, turn the LEDs blue. If no object is detected, turn the LEDs off.",
	difficulty: "beginner",
	expectedBehavior: "Pip continuously monitors for obstacles on the right side. LED turns blue when an object is detected by the right sensor, and turns off when no object is detected.",
	commonMistakes: [
		"Using the wrong sensor (left instead of right)",
		"Using the wrong LED colors (should be blue for detected, off for not detected)",
		"Forgetting to use a forever loop to continuously check the sensor",
		"Confusing the if-else logic (blue when detected, off when not detected)"
	],
	learningObjectives: [
		"Understanding that Pip has multiple distance sensors",
		"Learning to use different sensor inputs (left vs right)",
		"Practicing with different LED color outputs",
		"Reinforcing conditional logic with sensor inputs"
	],
	beforeRunningText: "Place Pip on a flat surface with clear space around it. You can test the right-side sensor by placing your hand or an object to the right side of Pip to see the LED change colors.",
	initialBlocklyJson: {},
	...createChallengeToolbox([
		LOOP_BLOCK_TYPES.ESP32_LOOP,
		CONDITIONAL_BLOCK_TYPES.IF_ELSE,
		SENSORS_BLOCK_TYPES.SIDE_TOF_READ,
		LED_BLOCK_TYPES.ESP32_LED_CONTROL
	]),
	solutionCode: `
        while(true) {
            if (is_object_near_side_right()) {
                rgbLed.set_led_blue();
            } else {
                rgbLed.turn_led_off();
            }
        }
    `
}

export const OBSTACLE_AVOIDANCE_CHALLENGE_5: CqChallengeData = {
	challengeId: "obstacle-avoidance-005" as ChallengeId,
	careerId: "obstacle-avoidance",
	title: "Multi-Sensor Obstacle Avoidance with Else-If Chain",
	description: "Create an advanced obstacle avoidance program that checks multiple sensors and responds differently to each. Use an else-if chain to check the front sensor first, then left sensor, then right sensor, with different LED colors and turning behaviors for each detection.",
	difficulty: "intermediate",
	expectedBehavior: "Pip waits for button press to start. When moving, it checks sensors in order: if front sensor detects object (white LED, turn clockwise), else if left sensor detects object (red LED, turn clockwise), else if right sensor detects object (blue LED, turn counterclockwise), else no objects detected (green LED, move forward at 50% speed).",
	commonMistakes: [
		"Using simple if-else instead of the else-if chain block",
		"Not checking sensors in the correct order (should be front, left, right)",
		"Using wrong LED colors for each sensor detection",
		"Mixing up turn directions (left detection should turn clockwise, right detection should turn counterclockwise)",
		"Forgetting to add the start button at the beginning",
		"Not understanding that only one condition will execute in an else-if chain"
	],
	learningObjectives: [
		"Understanding else-if chains and conditional logic sequences",
		"Learning to prioritize sensor inputs (front sensor has highest priority)",
		"Combining multiple sensors for comprehensive obstacle detection",
		"Understanding different responses to different sensor inputs",
		"Building complex decision-making logic for autonomous navigation"
	],
	beforeRunningText: "IMPORTANT: Pip will move and turn in multiple directions based on what sensors detect obstacles. Make sure you have a large, clear area with plenty of space around Pip. You can test by placing objects in front, to the left, and to the right of Pip.",
	initialBlocklyJson: {},
	...createChallengeToolbox([
		START_BLOCK_TYPES.BUTTON_PRESS_START,
		LOOP_BLOCK_TYPES.ESP32_LOOP,
		CONDITIONAL_BLOCK_TYPES.IF_2ELSEIF_ELSE,
		SENSORS_BLOCK_TYPES.CENTER_TOF_READ,
		SENSORS_BLOCK_TYPES.SIDE_TOF_READ,
		MOTOR_BLOCK_TYPES.GO_FORWARD,
		MOTOR_BLOCK_TYPES.TURN,
		LED_BLOCK_TYPES.ESP32_LED_CONTROL
	]),
	solutionCode: `
        wait_for_button_press();
        while(true) {
            if (is_object_in_front()) {
                rgbLed.set_led_white();
                turn(CLOCKWISE, 90);
            } else if (is_object_near_side_left()) {
                rgbLed.set_led_red();
                turn(CLOCKWISE, 90);
            } else if (is_object_near_side_right()) {
                rgbLed.set_led_blue();
                turn(COUNTERCLOCKWISE, 90);
            } else {
                rgbLed.set_led_green();
                goForward(50);
            }
        }
    `
}

// Array structure - easier to search and iterate
export const CHALLENGES: CqChallengeData[] = [
	OBSTACLE_AVOIDANCE_CHALLENGE_1,
	OBSTACLE_AVOIDANCE_CHALLENGE_2,
	OBSTACLE_AVOIDANCE_CHALLENGE_3,
	OBSTACLE_AVOIDANCE_CHALLENGE_4,
	OBSTACLE_AVOIDANCE_CHALLENGE_5,
]

