import { LightAnimation } from "../types/garage"

export enum MessageType {
    UPDATE_AVAILABLE = 0,
    MOTOR_CONTROL = 1,
    TONE_COMMAND = 2,
    SPEAKER_MUTE = 3,
    BALANCE_CONTROL = 4,
    UPDATE_BALANCE_PIDS = 5,
    UPDATE_LIGHT_ANIMATION = 6,
    UPDATE_LED_COLORS = 7,
    BYTECODE_PROGRAM = 8,
    STOP_SANDBOX_CODE = 9,
    OBSTACLE_AVOIDANCE = 10,
    SERIAL_HANDSHAKE = 11,
    SERIAL_KEEPALIVE = 12,
    SERIAL_END = 13,
    UPDATE_HEADLIGHT = 14,
    START_SENSOR_POLLING = 15,
    WIFI_CREDENTIALS = 16,
    WIFI_CONNECTION_RESULT = 17,
    GET_SAVED_WIFI_NETWORKS = 18,
    SOFT_SCAN_WIFI_NETWORKS = 19,
    HARD_SCAN_WIFI_NETWORKS = 20,
    SPEAKER_VOLUME = 22,
    STOP_TONE = 23,
    UPDATE_DISPLAY = 25,
    STOP_SENSOR_POLLING = 26,
    TRIGGER_MESSAGE = 27,
    STOP_CAREER_QUEST_TRIGGER = 28,
    SHOW_DISPLAY_START_SCREEN = 29,
    IS_USER_CONNECTED_TO_PIP = 30,
    FORGET_NETWORK = 31,
    HEARTBEAT = 32
}

export enum CareerType {
    MEET_PIP = 1,
    TURRET_ARCADE = 2,
    FLAPPY_BIRD_ARCADE = 3,
    CITY_DRIVING_ARCADE = 4
}

export enum MeetPipTriggerType {
    ENTER_CAREER = 0,
    S2_P1_ENTER = 1,
    S2_P1_EXIT = 2,
    S2_P4_ENTER = 3,
    S2_P4_EXIT = 4,
    S3_P3_ENTER = 5,
    S3_P3_EXIT = 6,
    S4_P5_ENTER = 7,
    S5_P4_ENTER = 8,
    S5_P4_EXIT = 9, // Needs an exit (if go from S5P4 to S5P3)
    S5_P5_ENTER = 10, // Needs an exit (if go from S5P6 to S5P5)
    S5_P5_EXIT = 11,
    S6_P4_ENTER = 12,
    S6_P4_EXIT = 13,
    S6_P6_ENTER = 14,
    S6_P6_EXIT = 15,
    S7_P4_ENTER = 16,
    S7_P4_EXIT = 17,
    S7_P6_ENTER = 18,
    S7_P6_EXIT = 19,
    S8_P3_ENTER = 20,
    S8_P3_EXIT = 21,
    S9_P3_ENTER = 22,
    S9_P6_ENTER = 23,
    S9_P6_EXIT = 24,
    S4_P5_EXIT = 25,
    S9_P3_EXIT = 26,
    S4_P4_EXIT = 27
}

export enum TurretArcadeTriggerType {
    ENTER_TURRET_ARCADE = 0,
    EXIT_TURRET_ARCADE = 1
}

export enum FlappyBirdArcadeTriggerType {
    ENTER_FLAPPY_BIRD_ARCADE = 0,
    EXIT_FLAPPY_BIRD_ARCADE = 1
}

export enum CityDrivingArcadeTriggerType {
    ENTER_CITY_DRIVING_ARCADE = 0,
    EXIT_CITY_DRIVING_ARCADE = 1
}

type TriggerMessageTypeMap = {
    [CareerType.MEET_PIP]: MeetPipTriggerType
    [CareerType.TURRET_ARCADE]: TurretArcadeTriggerType
    [CareerType.FLAPPY_BIRD_ARCADE]: FlappyBirdArcadeTriggerType
    [CareerType.CITY_DRIVING_ARCADE]: CityDrivingArcadeTriggerType
}

export type ValidTriggerMessageType<T extends CareerType> = TriggerMessageTypeMap[T]

export enum ToneType {
    A = 1,
    B = 2,
    C = 3,
    D = 4,
    E = 5,
    F = 6,
    G = 7,
    OFF = 8
}

export enum LightAnimationType {
    NO_ANIMATION = 0,
    BREATHING = 1,
    RAINBOW = 2,
    STROBE = 3,
    TURN_OFF = 4,
    FADE_OUT = 5,
    // PAUSE_BREATHING = 6,
    // SNAKE = 7
}

export enum SpeakerStatus {
    UNMUTED = 0,
    MUTED = 1
}

export enum HeadlightStatus {
    OFF = 0,
    ON = 1
}

export enum BalanceStatus {
    UNBALANCED = 0,
    BALANCED = 1
}

export enum UserConnectedStatus {
    NOT_CONNECTED = 0,
    CONNECTED = 1
}

export enum WiFiConnectionStatus {
    FAILED = "failed",
    WIFI_ONLY = "wifi_only",
    WIFI_AND_WEBSOCKET_SUCCESS = "success"
}

export const lightToLEDType: Record<LightAnimation, LightAnimationType> = {
	"No animation": LightAnimationType.NO_ANIMATION,
	"Breathing": LightAnimationType.BREATHING,
	"Rainbow": LightAnimationType.RAINBOW,
	"Strobe": LightAnimationType.STROBE,
	"Turn off": LightAnimationType.TURN_OFF,
	"Fade out": LightAnimationType.FADE_OUT,
	// "Pause breathing": LightAnimationType.PAUSE_BREATHING,
	// "Snake": LightAnimationType.SNAKE,
}
