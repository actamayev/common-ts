# Tests Directory

## Purpose
Jest test suite for the common-ts library. Validates bytecode generation, message protocol, type safety, and integration with the ESP32 communication layer.

## Test Configuration

**Test Runner:** Jest with ts-jest preset
**Environment:** Node.js
**File Pattern:** `**/*.test.ts`
**Roots:** `<rootDir>/src/` and `<rootDir>/tests/`
**Transform:** TypeScript via ts-jest

**Run Tests:**
```bash
pnpm run test           # Run all tests
pnpm run test:coverage  # Run with coverage report
```

## Directory Structure

**Current:**
```
tests/
├── mesage-builder/       # Message building tests
│   └── message-builder.test.ts
└── CLAUDE.md             # This file
```

**Expected Future:**
```
tests/
├── message-builder/
│   └── message-builder.test.ts
├── parsers/
│   ├── cpp-parser.test.ts
│   └── bytecode-compiler.test.ts
├── types/
│   ├── blockly-types.test.ts
│   └── career-quest.test.ts
└── CLAUDE.md
```

## Test File Naming

- Test files: `[module-name].test.ts`
- Mirror src structure: `src/parsers/cpp-parser.ts` → `tests/parsers/cpp-parser.test.ts`
- One test file per source module (preferably)

## MessageBuilder Tests (message-builder/message-builder.test.ts)

### Test Structure
```typescript
describe("MessageBuilder", () => {
  // Helper functions
  function validateFrameStructure(buffer, messageType, payloadLength): void
  function getPayloadOffset(buffer): number

  // Test suites grouped by method
  describe("createMotorControlMessage", () => { ... })
  describe("createLedMessage", () => { ... })
  // ... one describe block per factory method
})
```

### Helper Functions

**validateFrameStructure(buffer, messageType, payloadLength)**
- Asserts frame markers (START/END) in correct positions
- Validates format flag (short vs long)
- Checks message type
- Verifies payload length field
- Confirms total buffer size matches expectations
- Handles both 1-byte and 2-byte length encodings

**getPayloadOffset(buffer)**
- Returns byte offset where payload data begins
- Accounts for format flag (different offsets for short/long)
- Returns 4 for short format, 5 for long format

### Test Patterns

**Message with Payload:**
```typescript
it("should create a valid motor control message", () => {
  const buffer = MessageBuilder.createMotorControlMessage(100, -200)

  validateFrameStructure(buffer, MessageType.MOTOR_CONTROL, 4)  // 4-byte payload

  const view = new DataView(buffer)
  const offset = getPayloadOffset(buffer)
  expect(view.getInt16(offset, true)).toBe(100)      // Little-endian check
  expect(view.getInt16(offset + 2, true)).toBe(-200) // Little-endian check
})
```

**Message with No Payload:**
```typescript
it("should create a valid handshake message", () => {
  const buffer = MessageBuilder.createSerialHandshakeMessage()
  validateFrameStructure(buffer, MessageType.SERIAL_HANDSHAKE, 0)  // 0-byte payload
})
```

**Edge Cases:**
```typescript
// Boundary testing
it("should handle minimum int16 value", () => { ... })
it("should handle maximum int16 value", () => { ... })
it("should handle zero values", () => { ... })

// Format transition
it("should use long format for 256+ byte payload", () => { ... })

// Data type validation
it("should handle float32 values", () => { ... })
it("should handle little-endian encoding", () => { ... })
```

### Coverage Areas

**Protocol Compliance:**
- Frame structure (START, TYPE, FORMAT, LENGTH, PAYLOAD, END)
- Byte ordering (little-endian for all multi-byte values)
- Marker positions
- Format flag correctness (short vs long)

**Data Type Handling:**
- Integer ranges (int16, uint16, uint8)
- Float values (float32)
- String encoding (UTF-8)
- Array serialization (LED colors, PID values, bytecode)

**Edge Cases:**
- Zero values
- Negative values
- Maximum/minimum values for types
- Empty payloads
- Boundary payloads (255 vs 256 bytes)
- Unicode characters in strings
- Large arrays (4000+ bytes)

**Message Types:**
- Control messages (motor, LED, speaker)
- Sensor messages (polling, calibration)
- Communication messages (handshake, keepalive, WiFi)
- Program messages (bytecode, sandbox control)

## Writing New Tests

### Step 1: Create Test File
```bash
touch tests/[module-name]/[module-name].test.ts
```

### Step 2: Import Dependencies
```typescript
import { YourClass } from "../../src/path/to/module"
import { SOME_CONSTANT } from "../../src/types/utils/constants"
```

### Step 3: Structure Test Suite
```typescript
describe("YourClass", () => {
  // Helper functions (if needed)

  describe("method1", () => {
    it("should do X when given Y", () => {
      const result = YourClass.method1(input)
      expect(result).toBe(expected)
    })
  })

  describe("method2", () => {
    // More tests
  })
})
```

### Step 4: Write Tests for Edge Cases
- Normal operation
- Boundary values (0, min, max, empty, full)
- Error conditions (invalid input)
- Type validation
- Format compliance

### Step 5: Ensure 100% Coverage
```bash
pnpm run test:coverage
```

View coverage report in `coverage/` directory. Every line should be tested.

## Test Best Practices

### Assertions
- Use `expect()` with clear matchers
- Test exact values for binary data
- Use `toBeCloseTo()` for float comparisons (account for precision)
- Group related assertions logically

### Naming
- Describe tests: `it("should [behavior] when [condition]", () => {})`
- Use clear variable names
- Comment complex test setup if needed

### Organization
- One `describe` block per method/function
- Group related tests together
- Use `beforeEach()` for common setup
- Keep individual tests focused and small

### Coverage Requirements
- **Minimum:** 100% line coverage
- **Ideal:** 100% branch coverage
- All error paths must be tested
- All conditional branches must be exercised

## Fixing Typo

Current directory name is `mesage-builder` (typo). When tests are refactored:
1. Rename to `message-builder/` for consistency
2. Update import paths if any cross-test references exist
3. Verify Jest still finds tests

## CI/CD Integration

Tests run automatically on:
- Pre-commit (if hooks configured)
- Pull requests
- Before npm publish

**Must Pass:**
- `pnpm run test` (all tests green)
- `pnpm run test:coverage` (100% coverage)
- No console errors/warnings from test code

## Debugging Tests

**Run Single Test File:**
```bash
npx jest tests/message-builder/message-builder.test.ts
```

**Run Single Test Suite:**
```bash
npx jest -t "createMotorControlMessage"
```

**Debug with Node Inspector:**
```bash
node --inspect-brk ./node_modules/.bin/jest --runInBand
```

**Watch Mode:**
```bash
npx jest --watch
```

## Adding Tests for New Features

When adding new code:
1. Write tests first (TDD) or simultaneously
2. Ensure new code has 100% coverage
3. Test happy path + edge cases
4. Test error conditions
5. Run full test suite to verify no regressions
6. Update this CLAUDE.md if adding new test categories

## Common Issues

**"Frame structure validation fails"**
- Check buffer offset calculations
- Verify START_MARKER and END_MARKER values
- Confirm message type enum values
- Validate payload length field encoding

**"Float comparison fails"**
- Use `toBeCloseTo()` instead of `toBe()`
- Account for IEEE 754 precision limits
- Test with representative values

**"Test won't find import"**
- Verify path is relative to test file
- Check jest.config.js root and moduleNameMapper
- Ensure module exports are correct

## Notes

- Tests are single source of truth for protocol behavior
- Binary format changes require updating both implementation and tests
- New message types need comprehensive test coverage
- Performance tests may be added for large bytecode arrays
- Integration tests with actual ESP32 communication are planned for future
