import { BUTTON_BLOCK_TYPES } from "./button-block-types"
import { LED_BLOCK_TYPES } from "./led-block-types"
import { LOGIC_BLOCK_TYPES } from "./logic-block-types"
import { MOTOR_BLOCK_TYPES } from "./motor-block-types"
import { SENSORS_BLOCK_TYPES } from "./sensor-block-types"
import { SPEAKER_BLOCK_TYPES } from "./speaker-block-types"

export type BlockNames =
	| MOTOR_BLOCK_TYPES
	| LED_BLOCK_TYPES
	| LOGIC_BLOCK_TYPES
	| SENSORS_BLOCK_TYPES
	| SPEAKER_BLOCK_TYPES
	| BUTTON_BLOCK_TYPES
