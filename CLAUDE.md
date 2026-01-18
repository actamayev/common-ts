# Lever Labs Common TypeScript Library

Shared TypeScript library (`@actamayev/lever-labs-common-ts`) providing core functionality for an educational robotics platform. Handles C++ to bytecode compilation, ESP32 robot communication, and educational platform data models.

**Consumed by:** Frontend applications, backend services, code execution platforms
**Package:** `@actamayev/lever-labs-common-ts` on npm
**Current Version:** 1.0.381

## Project Context

### Core Purpose
- **C++ Parser & Bytecode Generation**: Converts student-written C++ code into executable bytecode for ESP32 robots
- **Robot Communication Protocol**: Binary message serialization and framing for ESP32 physical robot control
- **Educational Platform Models**: Type definitions for challenges, careers, lessons, and student progress
- **Blockly Integration**: Type system for visual programming block definitions and toolbox configuration
- **Multi-platform Shared Library**: Single source of truth between web frontend, backend services, and robot firmware

### Critical Constraints

**Robot Behavior Impact**
- Parser and bytecode changes directly affect physical robot execution
- Requires deep understanding of ESP32 instruction sets and embedded constraints
- Changes must be tested against actual hardware

**Security-Critical**
- Accepts arbitrary student C++ code as input
- Regex patterns must avoid ReDoS vulnerabilities
- Input validation must be bulletproof
- Used in educational settings with untrusted user input

**Performance Priority**
- Internal library—readability secondary to efficiency
- Parsing must complete in <500ms for typical student programs
- Message serialization must be fast for real-time communication

**Version Stability**
- Consumed by multiple applications—breaking changes affect entire ecosystem
- Locked dependencies: Blockly 12.1.0, TypeScript 5.8.3 (don't suggest updates)
- Semantic versioning strictly enforced

## Directory Structure

```
common-ts/
├── src/
│   ├── parsers/                      # C++ parsing and bytecode compilation
│   │   ├── cpp-parser.ts
│   │   ├── bytecode-compiler.ts
│   │   └── ... other parsers
│   ├── message-builder/              # ESP32 protocol message construction
│   │   ├── message-builder.ts
│   │   └── protocol.ts
│   ├── types/                        # Type system (central definitions)
│   │   ├── blockly/                  # Blockly block type definitions
│   │   ├── utils/                    # Utility types and constants
│   │   ├── cq-challenge-data/        # Career Quest challenge records
│   │   ├── api.ts                    # HTTP API contracts
│   │   ├── auth.ts                   # Authentication types
│   │   ├── career-quest.ts           # Career Quest domain types
│   │   ├── chat.ts                   # Chat/messaging types
│   │   ├── garage.ts                 # Robot control interface
│   │   ├── hub.ts                    # Classroom/hub types
│   │   ├── pip.ts                    # Robot connection types
│   │   ├── quest.ts                  # Lesson/quest types
│   │   ├── sandbox.ts                # Code editor types
│   │   ├── scoreboard.ts             # Scoring types
│   │   ├── socket.ts                 # WebSocket message types
│   │   └── ... other domains
│   └── index.ts                      # Public API exports
├── tests/
│   ├── message-builder/              # Message protocol tests
│   │   └── message-builder.test.ts
│   └── CLAUDE.md                     # Test documentation
├── dist/                             # Compiled JavaScript (generated)
├── jest.config.js                    # Jest configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json
├── CLAUDE.md                         # This file
└── README.md
```

## Module Overview

### Parsers (`src/parsers/`)
**Purpose:** Compile student C++ code into executable bytecode for ESP32

- **cpp-parser.ts**: Tokenizes and parses C++ syntax
- **bytecode-compiler.ts**: Generates instruction sequences from AST
- **Performance-critical**: Optimized for speed, not readability
- **Security-critical**: Must handle malformed/adversarial code safely

See: `src/parsers/CLAUDE.md` (when created)

### Message Builder (`src/message-builder/`)
**Purpose:** Construct binary protocol messages for robot communication

- **message-builder.ts**: Factory class with static methods per message type
- **protocol.ts**: Message type enums and status enumerations
- **Binary framing**: START_MARKER | TYPE | FORMAT | LENGTH | PAYLOAD | END_MARKER
- **Little-endian encoding**: All multi-byte values in little-endian format

See: `src/message-builder/CLAUDE.md`

### Types (`src/types/`)
**Purpose:** Centralized type system for entire platform

**Subdirectories:**
- **blockly/**: Block type enums, categories, value mappings
  - Motor, LED, Sensor, Speaker, Logic, Button block definitions
  - Dropdown values and animation types
  - See: `src/types/blockly/CLAUDE.md`

- **utils/**: Constants and utility types
  - Protocol markers (START_MARKER, END_MARKER)
  - Character sets for ID/code generation
  - Block registry (metadata for all blocks)
  - Block toolbox helper functions
  - See: `src/types/utils/CLAUDE.md`

- **cq-challenge-data/**: Challenge records for Career Quest
  - Challenge metadata, learning objectives, solutions
  - Blockly workspace snapshots
  - Obstacle Avoidance and Driving School challenges
  - See: `src/types/cq-challenge-data/CLAUDE.md`

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
- See: `src/types/CLAUDE.md`

## Code Quality Standards

### TypeScript Strictness
- No `any` types—use explicit union types or `unknown`
- Explicit return types on all functions
- Strict null checks enabled
- No implicit `any` allowed

### Test Coverage
- **Minimum:** 100% line coverage
- **Ideal:** 100% branch coverage
- All edge cases must be tested
- New code requires comprehensive tests before merge

**Run tests:**
```bash
pnpm run test           # Run all tests
pnpm run test:coverage  # Generate coverage report
```

### Linting & Security
- **ESLint** with @typescript-eslint/recommended
- **eslint-plugin-security** for input validation checks
- **No console statements** in production code
- **No eval()** or dynamic code execution

**Run linting:**
```bash
pnpm run lint           # Check for issues
```

### Complexity Constraints
- **Max complexity:** 9 per function
- **Max length:** 40 lines per function
- **Max depth:** 3 levels of nesting
- **Rationale:** Internal library—optimize for comprehension and maintainability

### Performance Targets
- C++ parsing: <500ms for typical student programs
- Message serialization: <1ms per message
- Type checking: Compile-time only (no runtime overhead)

## Development Commands

### Build & Compile
```bash
pnpm run build          # Compile TypeScript to dist/
pnpm run build:watch   # Watch mode (compile on change)
```

### Testing
```bash
pnpm run test           # Run all Jest tests once
pnpm run test:watch    # Watch mode for tests
pnpm run test:coverage # Generate coverage report
```

### Quality Checks
```bash
pnpm run type-check     # TypeScript validation only
pnpm run lint           # ESLint validation
pnpm run lint:fix       # Auto-fix linting issues
pnpm run validate       # Full pipeline (build, lint, type-check, test)
```

### Package Management
```bash
pnpm install            # Install dependencies
pnpm publish            # Publish to npm (requires authentication)
```

## Architecture Patterns

### Type Safety Pattern
- **Branded types** for IDs: `PipUUID`, `ChallengeUUID`, `ClassCode`
  - Prevents accidental mixing of similar string types
  - No runtime overhead—compile-time only
  - Cast using `as`: `const id = "uuid-here" as PipUUID`

### Message Building Pattern
- **Static factory methods** on MessageBuilder class
- **Private frameMessage() helper** applies consistent framing
- **ArrayBuffer return type** for direct serial transmission
- **Little-endian encoding** for multi-byte values

Example:
```typescript
const buffer = MessageBuilder.createMotorControlMessage(100, -200)
// Returns ArrayBuffer ready for serial.write()
```

### Block Type Pattern
- **Enums for block IDs**: `MOTOR_BLOCK_TYPES.DRIVE = "drive"`
- **Enums for field names**: `MOTOR_FIELD_VALUES.DRIVING_PERCENTAGE = "percentage"`
- **Value objects for dropdowns**: `TURN_DIRECTIONS = { CLOCKWISE: "CLOCKWISE", ... }`
- **Type derivation** from constants: `type TurnDirectionType = typeof TURN_DIRECTIONS[keyof typeof TURN_DIRECTIONS]`

### Challenge Data Pattern
- **Declarative challenge objects** with metadata, learning content, and solutions
- **Blockly workspace JSON** for pre-built scaffolds
- **Challenge arrays** grouped by career path
- **Master CHALLENGES registry** aggregating all challenges

## Module Dependencies

### Dependency Graph
```
message-builder/ ← depends on → types/utils/ (constants: START_MARKER, END_MARKER)
types/blockly/ ← depends on → types/utils/ (block registry)
types/cq-challenge-data/ ← depends on → types/blockly/, types/utils/
All modules ← depend on → types/ (central type definitions)
```

### Import Rules
- **No circular imports** allowed
- **types/** is leaf module (depends on nothing in src/)
- **message-builder/** depends only on types/
- **parsers/** may depend on types/ and message-builder/

## Adding New Features

### Adding a New Message Type
1. Add enum value to `MessageType` in `src/message-builder/protocol.ts`
2. Create factory method in `src/message-builder/message-builder.ts`
3. Write comprehensive tests in `tests/message-builder/message-builder.test.ts`
4. Ensure 100% coverage before merge
5. Verify protocol matches ESP32 firmware expectations

### Adding a New Block Type
1. Create enum in `src/types/blockly/[domain]-block-types.ts`
2. Add field values and value mappings if applicable
3. Register block in `src/types/utils/blockly-registry.ts`
4. Add to appropriate category in `src/types/blockly/block-categories.ts`
5. Coordinate with frontend for Blockly toolbox XML definition

### Adding a New Challenge
1. Create challenge object in `src/types/cq-challenge-data/[career]-challenge-data.ts`
2. Add to career challenge array
3. Add to master CHALLENGES registry in `cq-challenge-data.ts`
4. Generate UUIDs (v4 format)
5. Provide solution code and learning objectives

## Claude-Specific Guidelines

### Before Making Changes
- Read the relevant CLAUDE.md in the module subdirectory
- Understand existing patterns in the module
- Identify all files that will be affected by the change

### When Modifying Parser Code
- **Understand bytecode**: Know the instruction set and constraints
- **Test malformed input**: Student code can be adversarial
- **Benchmark performance**: Parsing must stay <500ms
- **Document complexity**: Complex parsing deserves comments

### When Modifying Message Protocol
- **Understand framing**: Know the binary format precisely
- **Test edge cases**: Boundary conditions (255/256 byte payloads)
- **Verify bit ordering**: Little-endian for all multi-byte values
- **Test with hardware**: Verify messages work with actual ESP32

### When Modifying Types
- **No breaking changes** without coordinating with consuming teams
- **Use `readonly`** for immutable properties
- **Add deprecation notices** when removing types
- **Document type assumptions** (e.g., UUID v4, little-endian integers)

### When Writing Tests
- **Test happy path** (normal case)
- **Test edge cases** (boundaries, zeros, extremes)
- **Test error conditions** (invalid input, null values)
- **Achieve 100% coverage** (lines AND branches)
- **Mock external dependencies** properly

## File Format Guidelines

### TypeScript Files
- **Strict mode:** `"use strict"` at top (enforced by config)
- **Imports first:** All imports before code
- **Exports last:** Export statements at end
- **No default exports:** Named exports only for clarity

### Test Files
- **Naming:** `[module].test.ts` (matches Jest config)
- **Structure:** `describe()` → `it()` → `expect()`
- **Helpers:** Extract helper functions for reusable test logic
- **Setup:** Use `beforeEach()` for common test setup

### Type Definitions
- **Declaration only:** No logic or constants
- **PascalCase:** For interfaces and type names
- **camelCase:** For type aliases and properties
- **Immutable:** Use `readonly` liberally
- **Branded:** Use phantom types for ID safety

## Dependency Versions

**Critical (locked):**
- TypeScript: 5.8.3
- Blockly: 12.1.0

**Important (don't update without approval):**
- Jest: ^29.0.0
- ts-jest: ^29.0.0
- ESLint: ^8.0.0
- @typescript-eslint/*: ^5.0.0

**Do not suggest updates to locked dependencies** without explicit user approval.

## Integration with Consuming Applications

### As npm Package
```bash
npm install @actamayev/lever-labs-common-ts
```

### Imports from Package
```typescript
// Types
import { PipUUID, ChallengeUUID } from "@actamayev/lever-labs-common-ts"

// Message Builder
import { MessageBuilder } from "@actamayev/lever-labs-common-ts"

// Challenge Data
import { CHALLENGES } from "@actamayev/lever-labs-common-ts"

// Blockly Helpers
import { createChallengeToolbox } from "@actamayev/lever-labs-common-ts"
```

### Version Compatibility
- **Semantic versioning:** MAJOR.MINOR.PATCH
- **Breaking changes:** Require major version bump
- **New features:** Minor version bump
- **Bug fixes:** Patch version bump

## Common Issues & Solutions

**Type Mismatch on Branded Types**
```typescript
// Error: Type 'string' is not assignable to type 'PipUUID'
const id = "abc-123" as PipUUID  // Correct: use 'as' cast
```

**Test Coverage Gap**
```bash
pnpm run test:coverage  # View coverage/index.html
# Fix: Test edge cases and error paths
```

**Message Protocol Mismatch**
- Verify START_MARKER and END_MARKER are 0xAA and 0x55
- Check little-endian encoding for multi-byte values
- Verify payload length field size (1 vs 2 bytes)
- Test with actual ESP32 hardware

**Circular Import Error**
- Diagram module dependencies
- Move shared types to `src/types/`
- Ensure `types/` depends on nothing else

## Further Documentation

Each major module has its own CLAUDE.md:
- `src/message-builder/CLAUDE.md` — Message protocol details
- `src/types/blockly/CLAUDE.md` — Block type system
- `src/types/utils/CLAUDE.md` — Constants and registry
- `src/types/cq-challenge-data/CLAUDE.md` — Challenge data format
- `src/types/CLAUDE.md` — Type system overview
- `tests/CLAUDE.md` — Testing strategy and patterns

Read the relevant module documentation before making changes.

## Security Considerations

### Input Validation
- C++ parser must reject malformed syntax safely
- No eval() or dynamic code execution
- Regex patterns must be tested for ReDoS
- All string inputs must have length limits

### Sensitive Data
- No passwords in error messages
- No credentials in logs
- No user data in exception stack traces
- API contracts should not expose internal structure

### Supply Chain Safety
- Locked dependency versions reduce attack surface
- Audit dependencies for vulnerabilities
- Code must be reviewed before merge
- Security-critical code needs extra scrutiny
