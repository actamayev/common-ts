# Types/Utils Module

## Purpose
Utility types, constants, and helper functions that bridge Blockly definitions with the rest of the application. Provides the block registry, code templates, and block toolbox construction utilities.

## Architecture

### File Organization

**constants.ts**
- Protocol markers for serial communication
- Character sets for ID and code validation

**blockly-registry.ts**
- Central registry mapping all block types to their definitions
- Code templates and descriptions for every block
- Category and parent category assignments

**blockly-helpers.ts**
- Utility functions for constructing Blockly toolboxes
- Registry lookup and transformation functions
- Type-safe toolbox builders

## Constants (constants.ts)

### Serial Protocol Markers
```typescript
START_MARKER = 0xAA  // 170 decimal - message frame start
END_MARKER = 0x55    // 85 decimal - message frame end
```
Used by message-builder for framing all ESP32 communication.

### Character Sets
```typescript
ACCEPTABLE_PIP_ID_CHARACTERS
  // 32 characters, excludes easily confusable pairs:
  // 0/O/o/c, 1/l/I, s/S/5, z/Z/2, B/8, 6/b, U/V, W/w, X/x, u/v, K/k, N/H, G/C

ACCEPTABLE_CLASS_CODE_CHARACTERS
  // 30 characters, excludes: l(1), o(O), 0(zero), 1(one)
```
Used for generating human-readable IDs and access codes without ambiguous characters.

## Block Registry (blockly-registry.ts)

### Structure
```typescript
interface BlockDefinition {
  description: string        // User-facing description for UI/help
  codeTemplate: string      // C++ code template with placeholders
  category: BlocklyCategoryName
  parentCategory?: ParentCategoryName
}

const BLOCK_REGISTRY: Record<BlockNames, BlockDefinition>
```

### Template Syntax
**Placeholders** - Variables shown as `{variable_name}`
- Simple: `{direction}`, `{speed}`, `{seconds}`
- Options (OR): `{CLOCKWISE|COUNTERCLOCKWISE}`, `{==|!=|>|<|>=|<=}`
- Conditional: `{value1} {+|-|*|/|%} {value2}`

**Code snippets** - Escaping for control characters
- Operators: `\\|` for literal pipe, `\n` for newline
- Examples: `motors.drive({direction}, {speed});`

### Registry Coverage
All block types must have an entry. Registry is indexed by `BlockNames` union type (compile-time verified).

**Entry Format:**
```typescript
[MOTOR_BLOCK_TYPES.DRIVE]: {
  description: "Makes Pip move forward continuously",
  codeTemplate: "motors.drive({direction}, {speed});",
  category: "Motors"
}
```

**With Parent Category:**
```typescript
[SENSORS_BLOCK_TYPES.CENTER_TOF_READ]: {
  description: "Reads the front distance sensor...",
  codeTemplate: "front_distance_sensor.is_object_in_front()",
  category: "Distance Sensors",
  parentCategory: "Sensors"
}
```

## Helper Functions (blockly-helpers.ts)

### getBlocksFromRegistry(blockTypes: BlockNames[]): AvailableBlock[]
Transforms block type strings into full AvailableBlock objects with descriptions and templates.

**Input:** Array of block type strings (e.g., `["drive", "stop"]`)
**Output:** Array of blocks with type + definition merged

**Use Case:** Converting quiz/challenge block lists into UI-ready data.

### createFlyoutToolbox<T extends BlockNames>(blocks: T[]): ToolboxDefinition
Constructs Blockly flyout toolbox configuration from block list.

**Input:** Array of block types to include
**Output:** Blockly ToolboxDefinition ready for Blockly.inject()

**Result Format:**
```typescript
{
  kind: "flyoutToolbox",
  contents: [
    { kind: "block", type: "drive" },
    { kind: "block", type: "stop" }
  ]
}
```

### createChallengeToolbox(blockTypes: BlockNames[]): BlockData
Convenience function combining toolbox config and available blocks in one call.

**Returns:**
```typescript
{
  toolboxConfig: Blockly.utils.toolbox.ToolboxDefinition,
  availableBlocks: AvailableBlock[]
}
```

**Use Case:** Setting up a quiz or challenge with restricted block palette.

## Adding New Blocks

### Step 1: Update blockly-registry.ts
Import the new block type enum:
```typescript
import { NEWFEATURE_BLOCK_TYPES } from "../blockly/newfeature-block-types"
```

### Step 2: Add Registry Entry
```typescript
[NEWFEATURE_BLOCK_TYPES.ACTION_ONE]: {
  description: "Human-readable description of what this does",
  codeTemplate: "cpp_function({param1}, {param2});",
  category: "NewCategory",
  parentCategory?: "ParentIfApplicable"  // Optional
}
```

### Step 3: Verify Compilation
TypeScript will error if:
- Block type not in `BlockNames` union
- Invalid category name
- Missing required fields

### Step 4: Update Frontend Blockly Definition
Coordinate with frontend team to add matching block definition in Blockly XML.

## Critical Constraints

### Marker Values
- START_MARKER (0xAA) and END_MARKER (0x55) are protocol constants - **never change**
- These are referenced by message-builder and ESP32 firmware

### Character Set Safety
- PIP_ID: No confusable characters - users type these manually
- CLASS_CODE: Stricter set - easier for students to communicate verbally
- Do not expand without considering usability impact

### Registry Completeness
- Every block type must have a registry entry
- TypeScript will enforce this via the `Record<BlockNames, BlockDefinition>` type
- Missing entries will cause compilation errors

### Template Accuracy
- Code templates must match actual C++ function signatures
- Placeholders must be valid variable names students will provide
- Test that templates generate valid C++ when filled in

## Dependencies

- `src/types/blockly/*` - All block type enumerations
- `src/types/career-quest` - AvailableBlock type
- `src/types/sandbox` - ToolboxItem type
- `blockly/core` - Blockly TypeScript types

## Notes

- Registry is single source of truth for block descriptions and templates
- Changes to templates should be coordinated with C++ parser and code generator
- Helper functions are type-safe - use them to enforce block type constraints
- All block lookups are O(1) - registry is a direct key-value record
