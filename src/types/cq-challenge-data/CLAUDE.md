# CQ Challenge Data Module

## Purpose
Defines all Career Quest challenges—concrete programming tasks students complete with Blockly. Contains challenge metadata, learning objectives, code templates, and pre-built Blockly workspace JSON. Centralized challenge registry organized by career path.

## Architecture

### File Organization

**index.ts**
- Re-exports all challenge data for public API

**cq-challenge-data.ts**
- Master CHALLENGES array aggregating all career challenges
- Single import point for applications needing all challenges

**career-specific files**
- `obstacle-avoidance-challenge-data.ts` - 5 challenges for autonomous navigation
- `driving-school-challenge-data.ts` - 4 playable challenges + 7 read-only demonstrations

## Challenge Structure (CqChallengeData)

### Core Fields

**Identification**
```typescript
challengeUUID: ChallengeUUID        // Unique identifier (UUID v4 format)
careerUUID: CareerUUID              // Career this challenge belongs to
title: string                       // Short user-facing title
description: string                 // 1-2 sentence challenge brief
difficulty: "beginner" | "intermediate" | "advanced"
challengeIndex: number              // Order within career (1-based)
```

**Educational Content**
```typescript
learningObjectives: string[]        // What students should learn (1-4 items)
commonMistakes: string[]            // Common errors and misconceptions
expectedBehavior: string            // What happens when code runs correctly
beforeRunningText: string           // Safety/setup instructions before upload
```

**Blockly Configuration**
```typescript
initialBlocklyJson: BlocklyJson | {}  // Blockly workspace state (empty {} or populated)
toolboxConfig: Blockly.utils.toolbox.ToolboxDefinition  // Available blocks (from createChallengeToolbox)
availableBlocks: AvailableBlock[]   // Block metadata + descriptions
```

**Solution & Validation**
```typescript
solutionCode: string                // Reference C++ code (formatted with whitespace)
isDefiniteSolution: boolean         // true = one correct answer, false = multiple valid approaches
```

## Blockly Workspace JSON Format

### Empty Workspace
```typescript
initialBlocklyJson: {}  // Student starts with blank canvas
```

### Pre-built Workspace
Blockly exports workspace state as nested JSON with block tree structure:

```typescript
initialBlocklyJson: {
  "blocks": {
    "languageVersion": 0,
    "blocks": [
      {
        "type": "forever_loop",
        "id": "-Vk!.3uhZz;^JL3m6jWX",
        "x": -270,
        "y": -170,
        "inputs": {
          "LOOP_BODY": {
            "block": {
              "type": "controls_if_else",
              "id": "Ae,A|7CwIQ,LQDmb;Ib.",
              "inputs": {
                "IF1": { "block": { "type": "center_tof_read", "id": "..." } },
                "DO1": { "block": { "type": "control_all_leds", "id": "...", "fields": { "led_color": "RED" } } },
                "ELSE": { "block": { "type": "control_all_leds", "id": "...", "fields": { "led_color": "GREEN" } } }
              }
            }
          }
        }
      }
    ]
  }
}
```

**Key Elements:**
- `type`: Block type ID (matches blockly-types enums)
- `id`: Unique block identifier (Blockly-generated UUID format)
- `x`, `y`: Canvas position (coordinates)
- `fields`: Block field values (e.g., "led_color": "RED")
- `inputs`: Child blocks (nested structure)
- `next`: Sequential block (chained execution)

### Getting Blockly JSON
Export from Blockly workspace using:
```typescript
const xml = Blockly.Xml.workspaceToDom(workspace)
const json = Blockly.serialization.workspaces.workspaceToDom(workspace)
```

## Challenge Examples

### Beginner: Empty Workspace (Student Builds from Scratch)
```typescript
export const OBSTACLE_AVOIDANCE_CHALLENGE_1: CqChallengeData = {
  challengeUUID: "0e4568c6-7f85-4930-8db6-56d91fc8aee6" as ChallengeUUID,
  careerUUID: "2c9600cb-087d-477f-ae96-eb7cbf445bcd" as CareerUUID,
  title: "LED Obstacle Detection",
  description: "Write a program that continuously checks if there's an object in front of Pip...",
  difficulty: "beginner",
  challengeIndex: 1,
  expectedBehavior: "Pip continuously monitors for obstacles in front. LED turns red when detected...",
  commonMistakes: [
    "Forgetting to use a forever loop to continuously check the sensor",
    "Not understanding that the sensor returns true when an object is detected"
  ],
  learningObjectives: [
    "Understanding how distance sensors work",
    "Learning to use conditional statements (if-else)",
    "Understanding the importance of continuous monitoring with loops",
    "Learning to control LED outputs"
  ],
  beforeRunningText: "Place Pip on a flat surface with clear space in front...",
  initialBlocklyJson: {},  // Empty - student builds from scratch
  ...createChallengeToolbox([
    LOOP_BLOCK_TYPES.FOREVER_LOOP,
    CONDITIONAL_BLOCK_TYPES.IF_ELSE,
    SENSORS_BLOCK_TYPES.CENTER_TOF_READ,
    LED_BLOCK_TYPES.CONTROL_ALL_LEDS
  ]),
  solutionCode: `
    while(true) {
      if (front_distance_sensor.is_object_in_front()) {
        all_leds.set_color(RED)();
      } else {
        all_leds.set_color(GREEN)();
      }
    }
  `,
  isDefiniteSolution: true,
}
```

### Intermediate: Pre-built Foundation (Student Extends)
```typescript
export const OBSTACLE_AVOIDANCE_CHALLENGE_5: CqChallengeData = {
  // ... same fields ...
  difficulty: "intermediate",
  initialBlocklyJson: {
    "blocks": {
      "languageVersion": 0,
      "blocks": [
        { "type": "forever_loop", ... }  // Foundation provided
      ]
    }
  },
  isDefiniteSolution: false,  // Multiple valid solutions
}
```

### Read-Only Demo (Show Pattern, No Editing)
```typescript
export const DRIVING_SCHOOL_VIEW_ONLY_S2_P1: BlocklyJson = {
  "blocks": {
    "languageVersion": 0,
    "blocks": [
      { "type": "control_all_leds", "fields": { "led_color": "BLUE" } },
      { "type": "wait", "fields": { "wait": 3 } },
      { "type": "control_all_leds", "fields": { "led_color": "OFF" } }
    ]
  }
}
```

## Adding New Challenges

### Step 1: Create Challenge File
Create `[career-name]-challenge-data.ts` if not exists

### Step 2: Import Dependencies
```typescript
import { ChallengeUUID, CareerUUID } from "../utils"
import { CqChallengeData } from "../career-quest"
import { createChallengeToolbox } from "../utils/blockly-helpers"
import { BLOCK_TYPES_ENUMS } from "../blockly/..."
```

### Step 3: Define Challenge Object
```typescript
export const YOUR_CHALLENGE_NAME: CqChallengeData = {
  challengeUUID: "unique-uuid-v4-here" as ChallengeUUID,
  careerUUID: "career-uuid-here" as CareerUUID,
  title: "Short Title",
  description: "1-2 sentence description of what student builds",
  difficulty: "beginner",  // or "intermediate" / "advanced"
  challengeIndex: 1,       // Order within this career

  // Learning content
  learningObjectives: [
    "First objective",
    "Second objective"
  ],
  commonMistakes: [
    "Common error students make"
  ],
  expectedBehavior: "What happens when solution is correct",
  beforeRunningText: "Safety/setup instructions",

  // Blockly setup
  initialBlocklyJson: {},  // Empty or export from Blockly workspace
  ...createChallengeToolbox([
    BLOCK_TYPE.BLOCK_1,
    BLOCK_TYPE.BLOCK_2
  ]),

  // Solution
  solutionCode: `
    // Properly formatted C++ code
    // with consistent indentation
  `,
  isDefiniteSolution: true  // or false for open-ended problems
}
```

### Step 4: Export Challenge Array
```typescript
export const YOUR_CAREER_CHALLENGES: CqChallengeData[] = [
  YOUR_CHALLENGE_1,
  YOUR_CHALLENGE_2,
]
```

### Step 5: Add to Master Registry
Update `cq-challenge-data.ts`:
```typescript
import { YOUR_CAREER_CHALLENGES } from "./your-career-challenge-data"

export const CHALLENGES: CqChallengeData[] = [
  ...OBSTACLE_AVOIDANCE_CHALLENGES,
  ...DRIVING_SCHOOL_CHALLENGES,
  ...YOUR_CAREER_CHALLENGES,  // Add here
]
```

## Critical Details

### UUID Generation
Use UUID v4 format (random, not sequential). Generate with:
```bash
# Node.js
node -e "console.log(require('crypto').randomUUID())"
# Or online: https://www.uuidgenerator.net/
```

### Block Selection with createChallengeToolbox
Pass only blocks students should use:
```typescript
// Good - restrictive, guides learning
...createChallengeToolbox([
  LOOP_BLOCK_TYPES.FOREVER_LOOP,
  CONDITIONAL_BLOCK_TYPES.IF_ELSE,
  SENSORS_BLOCK_TYPES.CENTER_TOF_READ,
])

// Bad - too many options, overwhelming
...createChallengeToolbox([
  ...Object.values(MOTOR_BLOCK_TYPES),
  ...Object.values(LED_BLOCK_TYPES),
  ...Object.values(SENSOR_BLOCK_TYPES),
])
```

### Solution Code Formatting
- Use actual indentation (not tabs in string literals)
- Match C++ function signatures exactly
- Include all necessary function calls
- Test that solution code actually runs on ESP32

### isDefiniteSolution Semantics
- **true**: One correct answer (student solution can be validated precisely)
  - Use when goal is deterministic (LED turns specific color, specific motor command)
  - Allows for automated grading
- **false**: Multiple valid approaches (any solution meeting behavior wins)
  - Use when goal is behavioral (avoid obstacles, reach destination)
  - Requires human review or flexible validation logic

## Dependencies

- `src/types/career-quest` - CqChallengeData, AvailableBlock types
- `src/types/blockly/*` - All block type enumerations
- `src/types/utils/blockly-helpers` - createChallengeToolbox function
- `src/types/utils` - ChallengeUUID, CareerUUID type aliases
- `src/types/sandbox` - BlocklyJson, ToolboxItem types

## Notes

- Challenge order matters: challengeIndex should be sequential (1, 2, 3...)
- Blockly workspace JSON is fragile - regenerate after Blockly updates
- Read-only demo challenges (VIEW_ONLY_*) show patterns but aren't graded
- UUIDs must be genuinely unique - collisions cause database issues
- Solution code is shown to students for help/hints, keep it clean and readable
