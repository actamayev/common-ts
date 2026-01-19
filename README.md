# Lever Labs Common TypeScript Library

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Shared TypeScript library for an educational robotics platform. Provides ESP32 robot communication protocol and platform type definitions.

## Features

- **Robot Communication Protocol** - Binary message serialization for real-time robot control
- **Educational Models** - Type definitions for challenges, careers, lessons, and student progress
- **Blockly Integration** - Complete type system for visual programming blocks and configurations
- **100% Type Safe** - Strict TypeScript with branded types, no `any` types

## Installation

```bash
npm install @actamayev/lever-labs-common-ts
# or
pnpm add @actamayev/lever-labs-common-ts
```

## Usage

### Types (subpath exports)
```typescript
import { PipUUID, ChallengeUUID } from "@actamayev/lever-labs-common-ts/types/pip"
import { ApiResponse } from "@actamayev/lever-labs-common-ts/types/api"

// Branded types prevent mixing different ID types
const pipId = "550e8400-e29b-41d4-a716-446655440000" as PipUUID
```

### Message Builder
```typescript
import { MessageBuilder } from "@actamayev/lever-labs-common-ts/message-builder"

// Create a motor control message
const buffer = MessageBuilder.createMotorControlMessage(100, -50)
// Returns ArrayBuffer ready for serial transmission

// Control LEDs
const ledBuffer = MessageBuilder.createLedMessage({
  topLeftColor: { r: 255, g: 0, b: 0 },
  topRightColor: { r: 0, g: 255, b: 0 },
  middleLeftColor: { r: 0, g: 0, b: 255 },
  middleRightColor: { r: 255, g: 255, b: 0 },
  backLeftColor: { r: 255, g: 0, b: 255 },
  backRightColor: { r: 0, g: 255, b: 255 }
})
```

### Blockly Types
```typescript
import { MOTOR_BLOCK_TYPES, SENSOR_BLOCK_TYPES } from "@actamayev/lever-labs-common-ts/types/blockly"
import { BLOCK_REGISTRY } from "@actamayev/lever-labs-common-ts/types/utils/blockly-registry"
import { createChallengeToolbox } from "@actamayev/lever-labs-common-ts/types/utils/blockly-helpers"

const toolbox = createChallengeToolbox([
  MOTOR_BLOCK_TYPES.DRIVE,
  MOTOR_BLOCK_TYPES.STOP,
  SENSOR_BLOCK_TYPES.CENTER_TOF_READ
])
```

### Challenge Data
```typescript
import { CHALLENGES } from "@actamayev/lever-labs-common-ts/types/cq-challenge-data"

const challenge = CHALLENGES[0]
console.log(challenge.title)
console.log(challenge.learningObjectives)
```

## Project Structure

```
src/
├── message-builder/      # ESP32 protocol message construction
└── types/                # Type system (API, domain models, challenges)
    ├── blockly/          # Blockly block definitions
    ├── utils/            # Constants and helpers
    └── cq-challenge-data/ # Challenge records
```

See [CLAUDE.md](CLAUDE.md) for detailed architecture documentation.

## Development

```bash
pnpm install          # Install dependencies
pnpm run build        # Compile TypeScript
pnpm run test         # Run tests
pnpm run test:coverage # Coverage report
pnpm run lint         # Linting
pnpm run validate     # Full validation (lint, type-check, test)
```

## Message Protocol

Binary framing for ESP32 communication:

```
[START_MARKER] [TYPE] [FORMAT] [LENGTH(s)] [PAYLOAD] [END_MARKER]
```

- **START_MARKER**: 0xAA (170)
- **TYPE**: Message type (0-31)
- **FORMAT**: 0 = short (1-byte length), 1 = long (2-byte length)
- **PAYLOAD**: Message-specific data
- **END_MARKER**: 0x55 (85)

All multi-byte values use **little-endian** encoding.

## License

MIT
