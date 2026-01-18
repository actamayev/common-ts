# Blockly Types Module

## Purpose
Defines TypeScript type system and enumerations for all Blockly visual programming blocks used in the educational platform. Maps Blockly block IDs, field names, and control values to strongly-typed constants.

## Architecture

### File Organization
- **blockly.ts**: Root type export - `BlockNames` union of all block type enums
- **block-categories.ts**: Category hierarchy (Screen, Motors, LED, Sensors, Logic, etc.)
- **_-block-types.ts**: Domain-specific enums (motor, sensor, LED, speaker, logic, button)

### Design Pattern

Each block domain file exports three layers of constants:

1. **Block Type Enum** - Blockly block IDs
   ```typescript
   enum MOTOR_BLOCK_TYPES { DRIVE = "drive", STOP = "stop", ... }
   ```

2. **Field Values Enum** - Field names within blocks
   ```typescript
   enum MOTOR_FIELD_VALUES { DRIVING_PERCENTAGE = "percentage", ... }
   ```

3. **Value Mapping Objects** - Static dropdown/input values
   ```typescript
   const TURN_DIRECTIONS = { CLOCKWISE: "CLOCKWISE", ... } as const
   ```

### Type Derivation
Generate derived types from value objects using `keyof typeof` pattern:
```typescript
type TurnDirectionType = typeof TURN_DIRECTIONS[keyof typeof TURN_DIRECTIONS]
```

## Block Domains

### Motor Blocks (motor-block-types.ts)
- **Types**: drive, drive_time, drive_distance, stop, turn, spin
- **Field Values**: percentage, seconds, distance, turn_direction, turn_degrees, direction
- **Turn Directions**: CLOCKWISE, COUNTERCLOCKWISE

### LED Blocks (led-block-types.ts)
- **Types**: control_all_leds
- **Field Values**: led_color
- **Colors**: Defined in SENSOR_TYPES.LED_COLORS for reuse

### Sensor Blocks (sensor-block-types.ts)
- **Types**: imu_read, side_tof_read, center_tof_read, color_sensor_read, get_front_tof_distance
- **Complex Value Maps**: SENSOR_TYPES object with nested structures
  - **IMU**: Yaw, Pitch, Roll, X/Y/Z Accel, AccelMagnitude, rotation rates, magnetic fields
  - **Direction**: LEFT, RIGHT
  - **LED_COLORS**: WHITE, RED, GREEN, BLUE, PURPLE, YELLOW, OFF
  - **TONE_NAMES**: A, B, C, D, E, F, G
  - **COLOR_SENSOR_READ_COLORS**: RED, GREEN, BLUE, YELLOW, WHITE, BLACK
- **Type Derivations**: IMUSensorType, LeftRightSensorType, LEDSensorType, ColorSensorReadColorsType

### Logic Blocks (logic-block-types.ts)
- **Variables**: variable_declare_float, variable_get_float, variable_declare_int, etc.
- **Conditionals**: controls_if, controls_if_else, controls_if_elseif, controls_if_2elseif
- **Math**: logic_compare, logic_operation, logic_negate, math_number, math_arithmetic
- **Loops**: for_loop (repeat), wait, forever_loop
- **Start Blocks**: button_press_start

### Speaker Blocks (speaker-block-types.ts)
- **Types**: play_tone, stop_tone, play_sound, set_volume, set_mute
- **Field Values**: tone_type, sound_id, volume_percent, mute_status

### Button Blocks (button-block-types.ts)
- **Types**: button_press (discrete button event handlers)
- **Field Values**: button_id, action

## Block Categories (block-categories.ts)

### Primary Categories
- Screen, Button, Motors, LED, Speaker, Buttons

### Parent Categories (Collapsible Groups)
- **Sensors**: Distance Sensors, Motion Sensor, Color Sensor
- **Logic**: Variables, Conditionals, Math, Loops, Start

## Adding New Blocks

### Step 1: Create Block Type Enum
```typescript
/* eslint-disable @typescript-eslint/naming-convention */
export enum NEWFEATURE_BLOCK_TYPES {
    ACTION_ONE = "action_one",
    ACTION_TWO = "action_two"
}
```

### Step 2: Create Field Values Enum
```typescript
export enum NEWFEATURE_FIELD_VALUES {
    PARAMETER_A = "param_a",
    PARAMETER_B = "param_b"
}
```

### Step 3: Add Value Mappings (if dropdown/static values)
```typescript
export const NEWFEATURE_VALUES = {
    MODE: { FAST: "FAST", SLOW: "SLOW" },
    COLORS: { RED: "RED", BLUE: "BLUE" }
} as const
```

### Step 4: Add Type Derivations
```typescript
export type FeatureModeType = typeof NEWFEATURE_VALUES.MODE[keyof typeof NEWFEATURE_VALUES.MODE]
```

### Step 5: Export from blockly.ts
```typescript
import { NEWFEATURE_BLOCK_TYPES } from "./newfeature-block-types"

export type BlockNames =
  | MOTOR_BLOCK_TYPES
  | NEWFEATURE_BLOCK_TYPES
  // ... other domains
```

### Step 6: Update Categories (if applicable)
```typescript
export type BlocklyCategoryName =
  | "Screen"
  | "NewFeature"  // Add here
  // ... other categories
```

## Critical Details

### Naming Conventions
- **Enum names**: UPPERCASE_SNAKE_CASE (MOTOR_BLOCK_TYPES, MOTOR_FIELD_VALUES)
- **Enum values**: snake_case strings matching Blockly block IDs ("drive_time")
- **Value object keys**: camelCase or UPPERCASE (MODE, COLORS)
- **Value object values**: UPPERCASE or UPPERCASE_SNAKE_CASE (CLOCKWISE, "FAST", "RED")

### ESLint Directive
Every block type file starts with:
```typescript
/* eslint-disable @typescript-eslint/naming-convention */
```
This allows UPPERCASE enum names while maintaining strict naming rules elsewhere.

### Type Safety
- Use `const` assertion with `as const` on value objects for strict literal types
- Always derive types using `typeof X[keyof typeof X]` pattern
- Never use `any` - prefer union types for multi-type fields

## Dependencies

- No external dependencies - pure TypeScript type definitions
- Block IDs must match Blockly workspace block type strings exactly
- Field value names must match block field definitions in Blockly toolbox XML

## Notes

- All block IDs use snake_case matching Blockly convention
- Some field values map to C++ function calls (IMU sensor methods like "getYaw()")
- Dropdown values match both Blockly dropdown selections and code generation targets
- New blocks require coordination with frontend Blockly toolbox XML definition
