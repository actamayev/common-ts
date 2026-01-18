# Lever Labs Common TypeScript Library

[![npm version](https://img.shields.io/npm/v/@actamayev/lever-labs-common-ts.svg)](https://www.npmjs.com/package/@actamayev/lever-labs-common-ts)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Shared TypeScript library providing core functionality for an educational robotics platform. Handles C++ to bytecode compilation, ESP32 robot communication, and educational platform data models.

## Features

- **C++ to Bytecode Compilation** - Parses student C++ code and generates executable bytecode for ESP32 robots
- **Robot Communication Protocol** - Binary message serialization for real-time robot control
- **Educational Models** - Type definitions for challenges, careers, lessons, and student progress
- **Blockly Integration** - Complete type system for visual programming blocks and configurations
- **100% Type Safe** - Strict TypeScript with branded types, no `any` types

## Quick Start

### Installation

```bash
npm install @actamayev/lever-labs-common-ts
# or
pnpm add @actamayev/lever-labs-common-ts
```

### Basic Usage

#### Working with Types
```typescript
import { PipUUID, ChallengeUUID, CareerUUID } from "@actamayev/lever-labs-common-ts"

// Branded types prevent mixing different ID types
const pipId = "550e8400-e29b-41d4-a716-446655440000" as PipUUID
const challengeId = "6ba7b810-9dad-11d1-80b4-00c04fd430c8" as ChallengeUUID
```

#### Building Robot Messages
```typescript
import { MessageBuilder } from "@actamayev/lever-labs-common-ts"

// Create a motor control message
const buffer = MessageBuilder.createMotorControlMessage(100, -50)
// Returns ArrayBuffer ready for serial transmission

// Control LEDs
const ledBuffer = MessageBuilder.createLedMessage({
  topLeftColor: { r: 255, g: 0, b: 0 },     // Red
  topRightColor: { r: 0, g: 255, b: 0 },    // Green
  middleLeftColor: { r: 0, g: 0, b: 255 },  // Blue
  middleRightColor: { r: 255, g: 255, b: 0 },
  backLeftColor: { r: 255, g: 0, b: 255 },
  backRightColor: { r: 0, g: 255, b: 255 }
})
```

#### Using Challenge Data
```typescript
import { CHALLENGES, createChallengeToolbox } from "@actamayev/lever-labs-common-ts"
import { MOTOR_BLOCK_TYPES, SENSOR_BLOCK_TYPES } from "@actamayev/lever-labs-common-ts"

// Get all challenges
const allChallenges = CHALLENGES

// Find a specific challenge
const obstacleAvoidance = CHALLENGES.find(c => c.title === "LED Obstacle Detection")

// Create a Blockly toolbox for a challenge
const toolbox = createChallengeToolbox([
  MOTOR_BLOCK_TYPES.DRIVE,
  MOTOR_BLOCK_TYPES.STOP,
  SENSOR_BLOCK_TYPES.CENTER_TOF_READ
])
```

## Project Structure

```
src/
├── parsers/              # C++ parsing and bytecode compilation
├── message-builder/      # ESP32 protocol message construction
└── types/                # Type system (API, domain models, challenges)
    ├── blockly/          # Blockly block definitions
    ├── utils/            # Constants and helpers
    └── cq-challenge-data/ # Challenge records
tests/                    # Jest test suite (100% coverage)
```

See [CLAUDE.md](CLAUDE.md) for detailed architecture documentation.

## Development

### Prerequisites
- Node.js 18+
- pnpm 8+

### Setup

```bash
# Install dependencies
pnpm install

# Build
pnpm run build

# Watch mode
pnpm run build:watch
```

### Testing

```bash
# Run all tests
pnpm run test

# Watch mode
pnpm run test:watch

# Coverage report
pnpm run test:coverage
```

### Quality Checks

```bash
# Type checking
pnpm run type-check

# Linting
pnpm run lint
pnpm run lint:fix

# Full validation (build, lint, type-check, test)
pnpm run validate
```

## API Reference

### Types
- **IDs**: `PipUUID`, `ChallengeUUID`, `CareerUUID`, `HubUUID`, `ClassCode`
- **Connection**: `PipConnectionStatus`, `ClientPipConnectionStatus`
- **Challenges**: `CqChallengeData`, `DifficultyLevel`, `AvailableBlock`
- **API**: Request/response types for all endpoints

See `src/types/CLAUDE.md` for complete type documentation.

### Message Builder
Factory class for creating ESP32 control messages:

```typescript
// Motor control
MessageBuilder.createMotorControlMessage(leftSpeed, rightSpeed)
MessageBuilder.createTurnMessage(direction, degrees)
MessageBuilder.createStopMessage()

// LED control
MessageBuilder.createLedMessage(colorData)
MessageBuilder.createLightAnimationMessage(animationType)

// Speaker control
MessageBuilder.createToneCommandMessage(tone)
MessageBuilder.createSpeakerVolumeMessage(volume)

// Robot state
MessageBuilder.createHeadlightMessage(on)
MessageBuilder.createBalanceMessage(enabled)

// Communication
MessageBuilder.createSerialHandshakeMessage()
MessageBuilder.createSerialKeepaliveMessage()
MessageBuilder.createSerialEndMessage()

// WiFi
MessageBuilder.createWiFiCredentialsMessage(ssid, password)
MessageBuilder.createGetSavedWiFiNetworks()

// Code execution
MessageBuilder.createBytecodeMessage(bytecode)
MessageBuilder.createStopSandboxCodeMessage()
```

See `src/message-builder/CLAUDE.md` for protocol details.

### Blockly Types

```typescript
// Block type enums
import {
  MOTOR_BLOCK_TYPES,
  LED_BLOCK_TYPES,
  SENSORS_BLOCK_TYPES,
  SPEAKER_BLOCK_TYPES,
  BUTTON_BLOCK_TYPES
} from "@actamayev/lever-labs-common-ts"

// Block registry with metadata
import { BLOCK_REGISTRY } from "@actamayev/lever-labs-common-ts"

// Toolbox creation
import { createChallengeToolbox, getBlocksFromRegistry } from "@actamayev/lever-labs-common-ts"
```

See `src/types/blockly/CLAUDE.md` for complete block type system documentation.

### Challenge Data

```typescript
import { CHALLENGES, OBSTACLE_AVOIDANCE_CHALLENGES } from "@actamayev/lever-labs-common-ts"

// Access challenge data
const challenge = CHALLENGES[0]
console.log(challenge.title)
console.log(challenge.description)
console.log(challenge.learningObjectives)
console.log(challenge.expectedBehavior)
console.log(challenge.solutionCode)
```

See `src/types/cq-challenge-data/CLAUDE.md` for challenge structure documentation.

## Message Protocol

Binary framing for ESP32 communication:

```
[START_MARKER] [TYPE] [FORMAT] [LENGTH(s)] [PAYLOAD] [END_MARKER]
```

- **START_MARKER**: 0xAA (170)
- **TYPE**: Message type (0-31)
- **FORMAT**: 0 = short (1-byte length), 1 = long (2-byte length)
- **LENGTH**: Payload length in bytes
- **PAYLOAD**: Message-specific data
- **END_MARKER**: 0x55 (85)

All multi-byte values use **little-endian** encoding.

## Code Quality Standards

- **100% Test Coverage** - All code paths tested
- **Strict TypeScript** - No `any` types, explicit returns
- **ESLint Security** - Input validation rules enforced
- **Performance** - C++ parsing <500ms, message serialization <1ms
- **Complexity** - Max 9 cyclomatic complexity, 40 lines per function

## Architecture

### Type Safety Pattern
Branded types prevent accidental mixing of similar IDs:
```typescript
type PipUUID = string & { readonly __brand: unique symbol }
type ChallengeUUID = UUID & { readonly __brand: unique symbol }

// Type-safe casting
const id = "some-uuid" as PipUUID
```

### Message Building Pattern
Static factory methods with consistent framing:
```typescript
const buffer = MessageBuilder.createMotorControlMessage(100, -200)
// Automatically applies framing, validates encoding, returns ArrayBuffer
```

### Block Type Pattern
Enums + value objects + type derivation:
```typescript
enum MOTOR_BLOCK_TYPES { DRIVE = "drive", STOP = "stop" }
enum MOTOR_FIELD_VALUES { PERCENTAGE = "percentage" }
const TURN_DIRECTIONS = { CLOCKWISE: "CLOCKWISE", ... } as const
type TurnDirectionType = typeof TURN_DIRECTIONS[keyof typeof TURN_DIRECTIONS]
```

See [CLAUDE.md](CLAUDE.md) for detailed architecture documentation.

## Dependencies

### Locked (Do not update without approval)
- TypeScript 5.8.3
- Blockly 12.1.0

### Important (Use caution with updates)
- Jest ^29.0.0
- ts-jest ^29.0.0
- ESLint ^8.0.0
- @typescript-eslint/* ^5.0.0

## Integration with Consuming Apps

### Frontend
```typescript
import { MessageBuilder, CHALLENGES, createChallengeToolbox } from "@actamayev/lever-labs-common-ts"

// Build messages for WebSocket transmission to robot
const motorMessage = MessageBuilder.createMotorControlMessage(speed, 0)
socket.emit("robot-command", new Uint8Array(motorMessage))

// Load challenges into Blockly editor
const toolbox = createChallengeToolbox(challenge.availableBlocks)
```

### Backend
```typescript
import { CHALLENGES, BLOCK_REGISTRY } from "@actamayev/lever-labs-common-ts"
import type { ChallengeUUID } from "@actamayev/lever-labs-common-ts"

// Store and retrieve challenge metadata
app.get("/api/challenges/:id", (req: Request<{ id: ChallengeUUID }>) => {
  const challenge = CHALLENGES.find(c => c.challengeUUID === req.params.id)
  return res.json(challenge)
})
```

## Documentation

- **[CLAUDE.md](CLAUDE.md)** - Comprehensive architecture guide and development standards
- **[src/message-builder/CLAUDE.md](src/message-builder/CLAUDE.md)** - Message protocol specification
- **[src/types/CLAUDE.md](src/types/CLAUDE.md)** - Type system overview
- **[src/types/blockly/CLAUDE.md](src/types/blockly/CLAUDE.md)** - Block type definitions
- **[src/types/cq-challenge-data/CLAUDE.md](src/types/cq-challenge-data/CLAUDE.md)** - Challenge data format
- **[tests/CLAUDE.md](tests/CLAUDE.md)** - Testing strategy and patterns

## Security

This library:
- Accepts arbitrary student C++ code as input
- Serializes control messages for physical robots
- Handles user authentication and authorization data

Security considerations:
- All input validation is required (parsers reject malformed code)
- No eval() or dynamic code execution
- Regex patterns tested for ReDoS vulnerabilities
- String inputs have length limits
- No sensitive data in error messages or logs

See [CLAUDE.md](CLAUDE.md#security-considerations) for detailed security guidelines.

## Common Issues

**Type Mismatch on Branded Types**
```typescript
// Error: Type 'string' is not assignable to type 'PipUUID'
const id = "abc-123" as PipUUID  // Correct: use 'as' cast
```

**Message Protocol Not Recognized**
- Verify START_MARKER (0xAA) and END_MARKER (0x55) are correct
- Check little-endian encoding for multi-byte values
- Verify payload length field (1 vs 2 bytes based on payload size)
- Test with actual ESP32 hardware

**Circular Import Errors**
- Ensure `src/types/` depends on nothing in `src/`
- Move shared types to `src/types/`
- Check module dependency diagram in [CLAUDE.md](CLAUDE.md#module-dependencies)

**Test Coverage Gaps**
```bash
pnpm run test:coverage
# View coverage/index.html in browser
```

## Contributing

Before contributing:
1. Read [CLAUDE.md](CLAUDE.md) for architecture guidelines
2. Read the relevant module CLAUDE.md (e.g., `src/types/CLAUDE.md`)
3. Ensure 100% test coverage
4. Run full validation: `pnpm run validate`

## License

MIT

## Support

For issues or questions:
- Check the relevant CLAUDE.md documentation
- Review tests for usage examples
- Open an issue on GitHub

---

**Current Version:** 1.0.381
**Package:** [@actamayev/lever-labs-common-ts](https://www.npmjs.com/package/@actamayev/lever-labs-common-ts)
**Last Updated:** January 2026
