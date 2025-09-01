import { FunSounds, LightAnimation, TuneToPlay } from "../types/public"

export enum MessageType {
    UPDATE_AVAILABLE = 0,
    MOTOR_CONTROL = 1,
    SOUND_COMMAND = 2,
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
    UPDATE_HORN_SOUND = 21,
    SPEAKER_VOLUME = 22,
    STOP_SOUND = 23,
    REQUEST_BATTERY_MONITOR_DATA = 24,
    UPDATE_DISPLAY = 25,
    STOP_SENSOR_POLLING = 26,
    TRIGGER_MESSAGE = 27,
}

export enum CareerType {
    MEET_PIP = 1
}

export enum MeetPipTriggerType {
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
    S9_P6_EXIT = 24
}

type TriggerMessageTypeMap = {
    [CareerType.MEET_PIP]: MeetPipTriggerType
}

export type ValidTriggerMessageType<T extends CareerType> = TriggerMessageTypeMap[T]

export enum SoundType {
    CHIME = 1,
    CHIRP = 2,
    POP = 3,
    DROP = 4,
    FART = 5,
    MONKEY = 6,
    ELEPHANT = 7,
    PARTY = 8,
    UFO = 9,
    COUNTDOWN = 10,
    ENGINE = 11,
    ROBOT = 12
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

export enum HornSoundStatus {
    OFF = 0,
    ON = 1
}

export enum BalanceStatus {
    UNBALANCED = 0,
    BALANCED = 1
}

export enum WiFiConnectionStatus {
    FAILED = "failed",
    WIFI_ONLY = "wifi_only",
    WIFI_AND_WEBSOCKET_SUCCESS = "success"
}

// Mapping between string enum and numeric enum
export const tuneToSoundType: Record<TuneToPlay | FunSounds, SoundType> = {
	"Chime": SoundType.CHIME,
	"Chirp": SoundType.CHIRP,
	"Pop": SoundType.POP,
	"Drop": SoundType.DROP,
	"Fart": SoundType.FART,
	"Monkey": SoundType.MONKEY,
	"Elephant": SoundType.ELEPHANT,
	"Party": SoundType.PARTY,
	"UFO": SoundType.UFO,
	"Countdown": SoundType.COUNTDOWN,
	"Engine": SoundType.ENGINE,
	"Robot": SoundType.ROBOT
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
