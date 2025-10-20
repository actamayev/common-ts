/* eslint-disable @typescript-eslint/naming-convention */

export enum MOTOR_BLOCK_TYPES {
    GO = "go",
    GO_TIME = "go_time",
    GO_DISTANCE = "go_distance",
    STOP = "stop",
    TURN = "turn"
}

export enum MOTOR_DIRECTIONS {
    FORWARD = "forward",
    BACKWARD = "backward"
}

export enum MOTOR_FIELD_VALUES {
    DRIVING_PERCENTAGE = "percentage",
    DRIVING_SECONDS = "seconds",
    DRIVING_DISTANCE = "distance",
    TURN_DIRECTION = "turn_direction",
    TURN_DEGREES = "turn_degrees",
    DIRECTION = "direction"
}

export const TURN_DIRECTIONS = {
	CLOCKWISE: "CLOCKWISE",
	COUNTERCLOCKWISE: "COUNTERCLOCKWISE"
} as const

export type TurnDirectionType = typeof TURN_DIRECTIONS[keyof typeof TURN_DIRECTIONS]
