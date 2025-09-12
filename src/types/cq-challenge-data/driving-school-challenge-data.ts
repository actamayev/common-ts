/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/naming-convention */
import { ChallengeUUID, CareerUUID } from "../utils"
import { CqChallengeData } from "../career-quest"
import { LOOP_BLOCK_TYPES, START_BLOCK_TYPES } from "../blockly/logic-block-types"
import { LED_BLOCK_TYPES } from "../blockly/led-block-types"
import { createChallengeToolbox } from "../utils/blockly-helpers"
import { MOTOR_BLOCK_TYPES } from "../blockly/motor-block-types"
import { BlocklyJson } from "../sandbox"

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
	title: "Driving School Challenge 1",
	description: "Build a program that starts when my button is pressed, turns my LEDs blue for two seconds, then switches to red for two seconds, then turns off.",
	difficulty: "beginner",
	challengeIndex: 1,
	isDefiniteSolution: true,
	initialBlocklyJson: {},
	...createChallengeToolbox([
		START_BLOCK_TYPES.BUTTON_PRESS_START,
		LED_BLOCK_TYPES.CONTROL_ALL_LEDS,
		LOOP_BLOCK_TYPES.WAIT,
	]),
	expectedBehavior: "Pip starts on button A, turns LEDs blue for two seconds, then switches to red for two seconds, then turns off.",
	commonMistakes: [ ],
	learningObjectives: [ ],
	solutionCode: `
	wait_for_button_press();
	rgbLed.set_led_blue();
	wait(2);
	rgbLed.set_led_red();
	wait(2);
	rgbLed.turn_led_off();
	`,
}

// “Your turn.
// Build a program that makes me
// go forward 8 inches
// at 15% speed,
// then stop.”
// [Empty workspace; available blocks: Start on Button, Go forward x distance at x speed, Stop. Pip runs when uploaded.]

export const DRIVING_SCHOOL_CHALLENGE_S3_P5: CqChallengeData = {
	challengeUUID: "718e291a-1c03-4948-88c4-ef0762cfc4df" as ChallengeUUID,
	careerUUID: "af21b042-86ac-4790-a60d-fd102a469401" as CareerUUID,
	title: "Driving School Challenge 2",
	description: "Build a program that makes Pip go forward 8 inches at 15% speed, go backward 8 inches at 15% speed, then stop.",
	difficulty: "beginner",
	challengeIndex: 2,
	isDefiniteSolution: true,
	initialBlocklyJson: {},
	beforeRunningText: "Place Pip on a flat surface with clear space ahead.",
	...createChallengeToolbox([
		START_BLOCK_TYPES.BUTTON_PRESS_START,
		MOTOR_BLOCK_TYPES.GO_FORWARD_DISTANCE,
		MOTOR_BLOCK_TYPES.STOP,
	]),
	expectedBehavior: "Pip starts on button A, goes forward 8 inches at 15% speed, goes backward 8 inches at 15% speed, then stops.",
	commonMistakes: [ ],
	learningObjectives: [ ],
	solutionCode: `
	wait_for_button_press();
	goForwardDistance(8, 15);
	goBackwardDistance(8, 15);
	stopMotors();
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
	title: "Driving School Challenge 3",
	description: "Build a program that makes Pip turn 180 degrees clockwise, wait two seconds, then turn 180 degrees counterclockwise, then stop.",
	beforeRunningText: "Place Pip on a flat surface with clear space around.",
	difficulty: "beginner",
	challengeIndex: 3,
	isDefiniteSolution: true,
	initialBlocklyJson: {},
	...createChallengeToolbox([
		START_BLOCK_TYPES.BUTTON_PRESS_START,
		MOTOR_BLOCK_TYPES.TURN,
		LOOP_BLOCK_TYPES.WAIT,
		MOTOR_BLOCK_TYPES.STOP,
	]),
	expectedBehavior: "Pip starts on button A, turns 180 degrees clockwise, waits two seconds, then turns 180 degrees counterclockwise, then stops.",
	commonMistakes: [],
	learningObjectives: [ ],
	solutionCode: `
	wait_for_button_press();
	turn(CLOCKWISE, 180);
	wait(2);
	turn(COUNTERCLOCKWISE, 180);
	stopMotors();
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
	title: "Driving School Challenge 4",
	description: "Build a program that makes Pip drive clockwise in a square at 15% speed.",
	beforeRunningText: "Place Pip on a flat surface with clear space around.",
	difficulty: "beginner",
	challengeIndex: 4,
	isDefiniteSolution: true,
	initialBlocklyJson: {
		"blocks": {
			"languageVersion": 0,
			"blocks": [
				{
					"type": "button_press_start",
					"id": "vc^/L`-2^N5k-/hG/DKS",
					"x": -910,
					"y": -750,
					"next": {
						"block": {
							"type": "go_forward_distance",
							"id": "vuJ!PuGlbNI19T@ssi@.",
							"fields": {
								"distance": 8,
								"percentage": 15
							},
							"next": {
								"block": {
									"type": "turn",
									"id": "/w?pH09x8CHmj0~-vD=J",
									"fields": {
										"turn_direction": "CLOCKWISE",
										"turn_degrees": 90
									},
									"next": {
										"block": {
											"type": "go_forward_distance",
											"id": "2!6)Ec6zBl/1~U|52F*^",
											"fields": {
												"distance": 8,
												"percentage": 15
											},
											"next": {
												"block": {
													"type": "turn",
													"id": "|5MRz#O)|)t`I`A,y[Rf",
													"fields": {
														"turn_direction": "CLOCKWISE",
														"turn_degrees": 90
													}
												}
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
		MOTOR_BLOCK_TYPES.GO_FORWARD_DISTANCE,
		MOTOR_BLOCK_TYPES.TURN,
		MOTOR_BLOCK_TYPES.STOP,
		START_BLOCK_TYPES.BUTTON_PRESS_START,
	]),
	expectedBehavior: "Pip starts on button A, drives clockwise in a square at 15% speed.",
	commonMistakes: [],
	learningObjectives: [],
	solutionCode: `
	wait_for_button_press();
	goForwardDistance(8, 15);
	turn(CLOCKWISE, 90);
	goForwardDistance(8, 15);
	turn(CLOCKWISE, 90);
	goForwardDistance(8, 15);
	turn(CLOCKWISE, 90);
	goForwardDistance(8, 15);
	turn(CLOCKWISE, 90);
	stopMotors();
	`,
}

export const DRIVING_SCHOOL_CHALLENGES: CqChallengeData[] = [
	DRIVING_SCHOOL_CHALLENGE_S2_P4,
	DRIVING_SCHOOL_CHALLENGE_S3_P5,
	DRIVING_SCHOOL_CHALLENGE_S4_P5,
	DRIVING_SCHOOL_CHALLENGE_S5_P4,
]

export const DRIVING_SCHOOL_VIEW_ONLY_S2_P1: BlocklyJson = {
	"blocks": {
		"languageVersion": 0,
		"blocks": [
			{
				"type": "control_all_leds",
				"id": "7$2ht=dC2Ythc,$rluNi",
				"x": -550,
				"y": -470,
				"fields": {
					"led_color": "BLUE"
				},
				"next": {
					"block": {
						"type": "wait",
						"id": "d_1x]$77XkkLn)]s=mOh",
						"fields": {
							"wait": 3,
							"SECONDS_LABEL": "seconds"
						},
						"next": {
							"block": {
								"type": "control_all_leds",
								"id": "H:$HqX.l.hg+d[1J5Yif",
								"fields": {
									"led_color": "OFF"
								}
							}
						}
					}
				}
			}
		]
	}
}

export const DRIVING_SCHOOL_VIEW_ONLY_S2_P3: BlocklyJson = {
	"blocks": {
		"languageVersion": 0,
		"blocks": [
			{
				"type": "button_press_start",
				"id": "vc^/L`-2^N5k-/hG/DKS",
				"x": -610,
				"y": -650,
				"next": {
					"block": {
						"type": "control_all_leds",
						"id": "7$2ht=dC2Ythc,$rluNi",
						"fields": {
							"led_color": "YELLOW"
						},
						"next": {
							"block": {
								"type": "wait",
								"id": "d_1x]$77XkkLn)]s=mOh",
								"fields": {
									"wait": 2,
									"SECONDS_LABEL": "seconds"
								},
								"next": {
									"block": {
										"type": "control_all_leds",
										"id": "H:$HqX.l.hg+d[1J5Yif",
										"fields": {
											"led_color": "OFF"
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
}

//[Prebuilt blocks: Start on Button A → Go forward for 1 second at 15% speed → Stop. When uploaded, Pip drives forward, then stops.]
export const DRIVING_SCHOOL_VIEW_ONLY_S3_P2: BlocklyJson = {
	"blocks": {
		"languageVersion": 0,
		"blocks": [
			{
				"type": "button_press_start",
				"id": "vc^/L`-2^N5k-/hG/DKS",
				"x": -790,
				"y": -650,
				"next": {
					"block": {
						"type": "go_forward_time",
						"id": ")a1=!#B_EUL?@g2Q~X`7",
						"fields": {
							"seconds": 1,
							"percentage": 15
						},
						"next": {
							"block": {
								"type": "stop",
								"id": "xzj-yP6.|)Q1|mXeJ,/b"
							}
						}
					}
				}
			}
		]
	}
}

// [Prebuilt blocks: Start on Button A → Go forward 8 inches at 15% speed → Stop.
// When uploaded, Pip moves and stops at a taped line.]
export const DRIVING_SCHOOL_VIEW_ONLY_S3_P4: BlocklyJson = {
	"blocks": {
		"languageVersion": 0,
		"blocks": [
			{
				"type": "button_press_start",
				"id": "vc^/L`-2^N5k-/hG/DKS",
				"x": -790,
				"y": -650,
				"next": {
					"block": {
						"type": "go_forward_distance",
						"id": "gtSvX|h4*v.N_NC2WBI7",
						"fields": {
							"distance": 8,
							"percentage": 15
						},
						"next": {
							"block": {
								"type": "stop",
								"id": "xzj-yP6.|)Q1|mXeJ,/b"
							}
						}
					}
				}
			}
		]
	}
}


// [Prebuilt blocks: Start on Button A → Turn clockwise 90° at 35% speed → Stop. Pip pivots neatly]
export const DRIVING_SCHOOL_VIEW_ONLY_S4_P3: BlocklyJson = {
	"blocks": {
		"languageVersion": 0,
		"blocks": [
			{
				"type": "button_press_start",
				"id": "vc^/L`-2^N5k-/hG/DKS",
				"x": -790,
				"y": -650,
				"next": {
					"block": {
						"type": "turn",
						"id": "/w?pH09x8CHmj0~-vD=J",
						"fields": {
							"turn_direction": "CLOCKWISE",
							"turn_degrees": 90
						},
						"next": {
							"block": {
								"type": "stop",
								"id": "Za~7`|7:oL2|-M2ownqR"
							}
						}
					}
				}
			}
		]
	}
}

//[Prebuilt blocks: Start on Button A → Turn clockwise 360° → Stop. Pip rotates in a complete circle.]
export const DRIVING_SCHOOL_VIEW_ONLY_S4_P4: BlocklyJson = {
	"blocks": {
		"languageVersion": 0,
		"blocks": [
			{
				"type": "button_press_start",
				"id": "vc^/L`-2^N5k-/hG/DKS",
				"x": -790,
				"y": -650,
				"next": {
					"block": {
						"type": "turn",
						"id": "/w?pH09x8CHmj0~-vD=J",
						"fields": {
							"turn_direction": "CLOCKWISE",
							"turn_degrees": 360
						},
						"next": {
							"block": {
								"type": "stop",
								"id": "Za~7`|7:oL2|-M2ownqR"
							}
						}
					}
				}
			}
		]
	}
}

// [Prebuilt blocks: Start on Button A → Go forward 8 inches at 15% → Turn clockwise 90° → Go forward 8 inches at 15% → Stop. Pip drives forward, turns, drives again, and stops.]
export const DRIVING_SCHOOL_VIEW_ONLY_S5_P2: BlocklyJson = {
	"blocks": {
		"languageVersion": 0,
		"blocks": [
			{
				"type": "button_press_start",
				"id": "vc^/L`-2^N5k-/hG/DKS",
				"x": -810,
				"y": -730,
				"next": {
					"block": {
						"type": "go_forward_distance",
						"id": "vuJ!PuGlbNI19T@ssi@.",
						"fields": {
							"distance": 8,
							"percentage": 15
						},
						"next": {
							"block": {
								"type": "stop",
								"id": "Za~7`|7:oL2|-M2ownqR",
								"next": {
									"block": {
										"type": "turn",
										"id": "/w?pH09x8CHmj0~-vD=J",
										"fields": {
											"turn_direction": "CLOCKWISE",
											"turn_degrees": 90
										},
										"next": {
											"block": {
												"type": "stop",
												"id": "%GoL+a8+rQ?Mb#9qR}T?",
												"next": {
													"block": {
														"type": "go_forward_distance",
														"id": "2!6)Ec6zBl/1~U|52F*^",
														"fields": {
															"distance": 8,
															"percentage": 15
														},
														"next": {
															"block": {
																"type": "stop",
																"id": ";i_]Z}G.@bZ-~CnS_yl8"
															}
														}
													}
												}
											}
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
}
