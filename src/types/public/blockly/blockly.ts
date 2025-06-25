import { LED_BLOCK_TYPES } from "./led-block-types"
import { LOGIC_BLOCK_TYPES } from "./logic-block-types"
import { MOTOR_BLOCK_TYPES } from "./motor-block-types"
import { SENSORS_BLOCK_TYPES } from "./sensor-block-types"

export type BlockNames =
	| MOTOR_BLOCK_TYPES
	| LED_BLOCK_TYPES
	| LOGIC_BLOCK_TYPES
	| SENSORS_BLOCK_TYPES
