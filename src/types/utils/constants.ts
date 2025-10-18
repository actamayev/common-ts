/* eslint-disable @typescript-eslint/naming-convention */
export const MAX_LED_BRIGHTNESS = 75
export const MAX_PROGRAM_SIZE = 8192 // Maximum number of instructions
export const MAX_REGISTERS = 512     // Maximum number of registers
export const MAX_JUMP_DISTANCE = 65535 // Maximum jump distance in bytes (uint16_t max)
export const INSTRUCTION_SIZE = 20   // Size of each instruction in bytes
export const START_MARKER = 0xAA // 170 in decimal
export const END_MARKER = 0x55   // 85 in decimal

// Excludes easily confusable characters: 0, O, o, 1, l, I, S, 5, Z, 2, B, 8, G, 6, c, U, V, W, X, Y, u, v, w, x, y, n, N
export const ACCEPTABLE_PIP_ID_CHARACTERS = "ACDEFGHJKLMNPQRTadefhjkmpqrt3479"
// Excludes confusing characters: l (1), o (O), 0 (zero), and 1 (one)
export const ACCEPTABLE_CLASS_CODE_CHARACTERS = "abcdefghijkmnpqrstuvwxyz23456789"
