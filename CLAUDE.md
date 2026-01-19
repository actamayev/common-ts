# Lever Labs Common TypeScript Library

Shared TypeScript library (`@actamayev/lever-labs-common-ts`) for an educational robotics platform. Provides ESP32 robot communication protocol and platform type definitions.

**Package:** `@actamayev/lever-labs-common-ts` (GitHub Packages)
**Consumed by:** Frontend applications, backend services

## Project Context

### Core Purpose
- **Robot Communication Protocol**: Binary message serialization for ESP32 robot control
- **Educational Platform Models**: Type definitions for challenges, careers, lessons, and student progress
- **Blockly Integration**: Type system for visual programming block definitions and toolbox configuration

### Critical Constraints

**Robot Behavior Impact**
- Message protocol changes affect physical robot execution
- Changes must be tested against actual ESP32 hardware

**Version Stability**
- Consumed by multiple applications—breaking changes affect entire ecosystem
- Semantic versioning strictly enforced

## Directory Structure

```
common-ts/
├── src/
│   ├── message-builder/              # ESP32 protocol message construction
│   │   ├── message-builder.ts
│   │   └── protocol.ts
│   └── types/                        # Type system (central definitions)
│       ├── blockly/                  # Blockly block type definitions
│       ├── utils/                    # Utility types and constants
│       ├── cq-challenge-data/        # Career Quest challenge records
│       ├── api.ts                    # HTTP API contracts
│       ├── auth.ts                   # Authentication types
│       ├── arcade.ts                 # Arcade game types
│       ├── career-quest.ts           # Career Quest domain types
│       ├── chat.ts                   # Chat/messaging types
│       ├── garage.ts                 # Robot control interface
│       ├── hub.ts                    # Classroom/hub types
│       ├── pip.ts                    # Robot connection types
│       ├── quest.ts                  # Lesson/quest types
│       ├── sandbox.ts                # Code editor types
│       ├── scoreboard.ts             # Scoring types
│       ├── socket.ts                 # WebSocket message types
│       ├── teacher.ts                # Teacher-specific types
│       └── utils.ts                  # Re-exports from utils/
├── tests/
│   └── mesage-builder/               # Message protocol tests
├── dist/                             # Compiled output (generated)
├── jest.config.js
├── tsconfig.json
├── package.json
└── CLAUDE.md
```

## Module Overview

### Message Builder (`src/message-builder/`)
**Purpose:** Construct binary protocol messages for robot communication

- **message-builder.ts**: Factory class with static methods per message type
- **protocol.ts**: Message type enums and status enumerations
- **Binary framing**: START_MARKER | TYPE | FORMAT | LENGTH | PAYLOAD | END_MARKER
- **Little-endian encoding**: All multi-byte values in little-endian format

### Types (`src/types/`)
**Purpose:** Centralized type system for entire platform

**Subdirectories:**
- **blockly/**: Block type enums, categories, value mappings (Motor, LED, Sensor, Speaker, Logic, Button)
- **utils/**: Constants (protocol markers), block registry, blockly helpers
- **cq-challenge-data/**: Challenge metadata, learning objectives, solutions (Driving School, Obstacle Avoidance)

**Core Domain Files:**
- **api.ts**: HTTP API request/response contracts
- **auth.ts**: Authentication and user session types
- **pip.ts**: Robot connection status and message types
- **career-quest.ts**: Challenge progression and competition types
- **quest.ts**: Lesson and educational content types
- **sandbox.ts**: Code editor and project types
- **garage.ts**: Robot test interface types
- **socket.ts**: WebSocket real-time message types
- **hub.ts**: Classroom and learning hub types
- **chat.ts**: Chat and messaging types
- **teacher.ts**: Teacher-specific types
- **scoreboard.ts**: Leaderboard and scoring types
- **arcade.ts**: Arcade game types

## Development Commands

```bash
pnpm run build          # Compile TypeScript to dist/
pnpm run test           # Run Jest tests
pnpm run test:coverage  # Generate coverage report
pnpm run lint           # ESLint validation
pnpm run lint:fix       # Auto-fix linting issues
pnpm run type-check     # TypeScript validation only
pnpm run validate       # Full pipeline (lint, type-check, test)
```

## Code Quality Standards

- No `any` types—use explicit union types or `unknown`
- Explicit return types on all functions
- Strict null checks enabled
- ESLint with @typescript-eslint and eslint-plugin-security
- 100% test coverage target

## Architecture Patterns

### Type Safety Pattern
- **Branded types** for IDs: `PipUUID`, `ChallengeUUID`, `ClassCode`
- Cast using `as`: `const id = "uuid-here" as PipUUID`

### Message Building Pattern
```typescript
const buffer = MessageBuilder.createMotorControlMessage(100, -200)
// Returns ArrayBuffer ready for serial.write()
```

### Block Type Pattern
- **Enums for block IDs**: `MOTOR_BLOCK_TYPES.DRIVE = "drive"`
- **Value objects for dropdowns**: `TURN_DIRECTIONS = { CLOCKWISE: "CLOCKWISE", ... }`
- **Type derivation**: `type TurnDirectionType = typeof TURN_DIRECTIONS[keyof typeof TURN_DIRECTIONS]`

## Module Dependencies

```
message-builder/ → types/utils/ (constants: START_MARKER, END_MARKER)
types/blockly/ → types/utils/ (block registry)
types/cq-challenge-data/ → types/blockly/, types/utils/
```

**Import Rules:**
- No circular imports
- `types/` is leaf module (depends on nothing in src/)
- `message-builder/` depends only on types/

## Adding New Features

### Adding a New Message Type
1. Add enum value to `MessageType` in `src/message-builder/protocol.ts`
2. Create factory method in `src/message-builder/message-builder.ts`
3. Write tests, ensure 100% coverage
4. Verify protocol matches ESP32 firmware expectations

### Adding a New Block Type
1. Create enum in `src/types/blockly/[domain]-block-types.ts`
2. Add field values and value mappings if applicable
3. Register block in `src/types/utils/blockly-registry.ts`
4. Add to appropriate category in `src/types/blockly/block-categories.ts`

### Adding a New Challenge
1. Create challenge object in `src/types/cq-challenge-data/[career]-challenge-data.ts`
2. Add to career challenge array
3. Add to master CHALLENGES registry

## Integration

### Imports from Package
```typescript
// Types (subpath exports)
import { ... } from "@actamayev/lever-labs-common-ts/types/api"
import { ... } from "@actamayev/lever-labs-common-ts/types/pip"

// Message Builder
import { MessageBuilder } from "@actamayev/lever-labs-common-ts/message-builder"
import { MessageType } from "@actamayev/lever-labs-common-ts/protocol"

// Blockly
import { ... } from "@actamayev/lever-labs-common-ts/types/blockly"

// Challenge Data
import { ... } from "@actamayev/lever-labs-common-ts/types/cq-challenge-data"
```

## Guidelines

### When Modifying Message Protocol
- Understand the binary framing format precisely
- Test edge cases (boundary conditions, 255/256 byte payloads)
- Verify little-endian encoding for multi-byte values
- Test with actual ESP32 hardware

### When Modifying Types
- No breaking changes without coordinating with consuming teams
- Use `readonly` for immutable properties
- Add deprecation notices when removing types
