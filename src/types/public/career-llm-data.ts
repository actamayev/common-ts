/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */

import { createFlyoutToolbox } from "../../utils/create-flyout-toolbox"
import { CONDITIONAL_BLOCK_TYPES, LED_BLOCK_TYPES, SENSORS_BLOCK_TYPES, START_BLOCK_TYPES } from "./blockly"
import { ChallengeData } from "./chat"

export const OBSTACLE_AVOIDANCE_CHALLENGE: ChallengeData = {
	id: "obstacle_avoidance_001",
	title: "Obstacle Detection with LEDs",
	description: "Write a script that checks if there's an object in front of the robot and if there is turn the LEDs red, and if there isn't turn the LEDs green",
	difficulty: "beginner",
	availableBlocks: [ ],
	expectedBehavior: "LEDs turn red when object is detected within 10cm, green otherwise. The robot should continuously monitor for obstacles.",
	commonMistakes: [
		"Forgetting to use a forever loop to continuously check the sensor",
	],
	learningObjectives: [],
	beforeRunningText: "Make sure your robot is placed on a flat surface with some space in front of it. The ultrasonic sensor should be facing forward to detect obstacles.",
	initialBlocklyJson: {},
	toolboxConfig: createFlyoutToolbox([
		START_BLOCK_TYPES.BUTTON_PRESS_START,
		SENSORS_BLOCK_TYPES.CENTER_TOF_READ,
		SENSORS_BLOCK_TYPES.SIDE_TOF_READ,
		LED_BLOCK_TYPES.ESP32_LED_CONTROL,
		CONDITIONAL_BLOCK_TYPES.IF,
		CONDITIONAL_BLOCK_TYPES.IF_ELSE
	]),
	solutionCode: `void setup() {
  // Initialize sensors and LEDs
  ultrasonicSensor.init();
  LED.init();
}

void loop() {
  int distance = ultrasonicSensor.read();
  
  if (distance < 10) {
    setLEDColor(RED);
  } else {
    setLEDColor(GREEN);
  }
  
  delay(100);
}`
}

// Array structure - easier to search and iterate
export const CHALLENGES: ChallengeData[] = [
	OBSTACLE_AVOIDANCE_CHALLENGE,
	// Add more challenges here as you create them
]
