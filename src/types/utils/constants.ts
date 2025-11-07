/* eslint-disable @typescript-eslint/naming-convention */
// Excludes easily confusable characters:
// 0/O/o/c, 1/l/I, s/S/5, z/Z/2, B/8, 6/b, U/V, W/w, X/x, u/v, K/k, N (similar to H), G (similar to C)
export const ACCEPTABLE_PIP_ID_CHARACTERS = "ACDEFHJLMPQRTYadefghijmnpqrty3479"
// Excludes confusing characters: l (1), o (O), 0 (zero), and 1 (one)
export const ACCEPTABLE_CLASS_CODE_CHARACTERS = "abcdefghijkmnpqrstuvwxyz23456789"
export const START_MARKER = 0xAA // 170 in decimal
export const END_MARKER = 0x55   // 85 in decimal
