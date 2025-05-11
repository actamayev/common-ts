/* eslint-disable @typescript-eslint/naming-convention */
export const MAX_LED_BRIGHTNESS = 75
export const MAX_PROGRAM_SIZE = 8192 // Maximum number of instructions
export const MAX_REGISTERS = 512     // Maximum number of registers
export const MAX_JUMP_DISTANCE = 65535 // Maximum jump distance in bytes (uint16_t max)
export const INSTRUCTION_SIZE = 20   // Size of each instruction in bytes
export const START_MARKER = 0xAA // 170 in decimal
export const END_MARKER = 0x55   // 85 in decimal
