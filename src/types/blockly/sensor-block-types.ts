/* eslint-disable @typescript-eslint/naming-convention */

export enum SENSORS_BLOCK_TYPES {
    IMU_READ = "imu_read",
	SIDE_TOF_READ = "side_tof_read",
	CENTER_TOF_READ = "center_tof_read",
	COLOR_SENSOR_READ = "color_sensor_read",
	GET_FRONT_TOF_DISTANCE = "get_front_distance_sensor_distance"
}

export enum SENSORS_FIELD_VALUES {
    IMU_READ = "imu_value",
    COLOR_SENSOR_READ = "color_sensor",
	SIDE_TOF_READ = "side_tof_value",
	CENTER_TOF_READ = "center_tof_read"
}

// For these complex nested structures, we'll keep them as objects
// with const assertions for better compatibility with the existing code
export const SENSOR_TYPES = {
	IMU: {
		Yaw: "getYaw()",
		Pitch: "getPitch()",
		Roll: "getRoll()",
		"X Acceleration": "getXAccel()",
		"Y Acceleration": "getYAccel()",
		"Z Acceleration": "getZAccel()",
		"Acceleration Magnitude": "getAccelMagnitude()",
		"X Rotation Rate": "getXRotationRate()",
		"Y Rotation Rate": "getYRotationRate()",
		"Z Rotation Rate": "getZRotationRate()",
		"Magnetic Field X": "getMagneticFieldX()",
		"Magnetic Field Y": "getMagneticFieldY()",
		"Magnetic Field Z": "getMagneticFieldZ()",
	},
	LEFTRIGHT: {
		LEFT: "LEFT",
		RIGHT: "RIGHT"
	},
	LED_COLORS: {
		WHITE: "WHITE",
		RED: "RED",
		GREEN: "GREEN",
		BLUE: "BLUE",
		PURPLE: "PURPLE",
		YELLOW: "YELLOW",
		OFF: "OFF"
	},
	TONE_NAMES: {
		A: "A",
		B: "B",
		C: "C",
		D: "D",
		E: "E",
		F: "F",
		G: "G",
	},
	COLOR_SENSOR_READ_COLORS: {
		RED: "RED",
		GREEN: "GREEN",
		BLUE: "BLUE",
		YELLOW: "YELLOW",
		WHITE: "WHITE",
		BLACK: "BLACK",
	}
} as const

export type IMUSensorType = typeof SENSOR_TYPES.IMU[keyof typeof SENSOR_TYPES.IMU]
export type LeftRightSensorType = typeof SENSOR_TYPES.LEFTRIGHT[keyof typeof SENSOR_TYPES.LEFTRIGHT]
export type LEDSensorType = typeof SENSOR_TYPES.LED_COLORS[keyof typeof SENSOR_TYPES.LED_COLORS]
export type ColorSensorReadColorsType = typeof SENSOR_TYPES.COLOR_SENSOR_READ_COLORS[keyof typeof SENSOR_TYPES.COLOR_SENSOR_READ_COLORS]
