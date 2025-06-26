/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */

import { createFlyoutToolbox } from "../../utils/create-flyout-toolbox"
import { CONDITIONAL_BLOCK_TYPES, LED_BLOCK_TYPES, LOOP_BLOCK_TYPES, MOTOR_BLOCK_TYPES, SENSORS_BLOCK_TYPES, START_BLOCK_TYPES } from "./blockly"
import { ChallengeData } from "./chat"

export const OBSTACLE_AVOIDANCE_CHALLENGE_1: ChallengeData = {
	id: "obstacle_avoidance_001",
	title: "LED Obstacle Detection",
	description: "Write a program that continuously checks if there's an object in front of the robot. Turn the LED red when an object is detected, and green when there's no object.",
	difficulty: "beginner",
	availableBlocks: [ ],
	expectedBehavior: "The robot continuously monitors for obstacles in front. LED turns red when an object is detected within range, and green when the path is clear.",
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
	beforeRunningText: "Place your robot on a flat surface with clear space in front. You can test the sensor by placing your hand or an object in front of the robot to see the LED change colors.",
	initialBlocklyJson: {},
	toolboxConfig: createFlyoutToolbox([
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

export const OBSTACLE_AVOIDANCE_CHALLENGE_2: ChallengeData = {
	id: "obstacle_avoidance_002",
	title: "Basic Obstacle Avoidance with Movement",
	description: "Build upon your LED detection program by adding motor control. The robot should move forward at 50% speed when the path is clear, and stop when an obstacle is detected. Include a start button so the robot waits for your command before beginning.",
	difficulty: "beginner",
	availableBlocks: [ ],
	expectedBehavior: "Robot waits for button press to start. Once started, it moves forward at 50% speed while the path is clear (green LED). When an obstacle is detected, it stops moving and shows a red LED. The robot continuously monitors and adjusts its behavior.",
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
	beforeRunningText: "IMPORTANT: Make sure your robot has plenty of open space to move forward safely. Clear any obstacles from the immediate area, but keep something nearby to test the detection. The robot will move when started!",
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
	toolboxConfig: createFlyoutToolbox([
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
