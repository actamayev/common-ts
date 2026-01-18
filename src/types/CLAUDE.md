# Types Directory

## Purpose
Comprehensive TypeScript type system defining the API contracts, data models, and entities shared across the platform. Central source of truth for all shared types between frontend, backend, and ESP32 communication layers.

## Architecture

### File Organization

**Core Type Files (Domain Models)**
- `utils.ts` - Branded types and UUID definitions
- `api.ts` - HTTP API request/response types
- `auth.ts` - Authentication types
- `pip.ts` - Robot (Pip) connection and status types
- `hub.ts` - Hub/classroom instance types
- `career-quest.ts` - Career Quest challenge and progression types
- `quest.ts` - Educational quest/lesson types
- `sandbox.ts` - Code editor and project types
- `garage.ts` - Robot control and test interface types
- `socket.ts` - WebSocket message types
- `chat.ts` - Chat/messaging types
- `teacher.ts` - Teacher-specific types
- `scoreboard.ts` - Scoring and leaderboard types
- `arcade.ts` - Arcade game types
- `arcade.ts` - Arcade game types

**Subdirectories**
- `blockly/` - Blockly block type definitions
- `utils/` - Utility types and constants
- `cq-challenge-data/` - Challenge data records

## Key Type Patterns

### Branded Types (Type Safety)
```typescript
export type PipUUID = string & { readonly __brand: unique symbol }
export type ChallengeUUID = UUID & { readonly __brand: unique symbol }
export type ClassCode = string & { readonly __brand: unique symbol }
export type Base64String = string & { readonly __brand: "Base64" }
```

**Purpose:** Nominal typing for strings to prevent accidental mixing of similar types
- `PipUUID` vs `HubUUID` vs generic `string`
- Catches errors at compile time
- No runtime overhead

**Usage:**
```typescript
function connectToPip(pipId: PipUUID) { ... }  // Type-safe
connectToPip("some-uuid")  // Error: Type mismatch
```

### Union Types for Status
```typescript
export type PipConnectionStatus = "online" | "connected to online user" | "connected to serial"

export type ClientPipConnectionStatus =
  | "offline"
  | "online"
  | "connected to serial to you"
  | "connected to serial to another user"
  | "connected online to you"
  | "connected online to another user"
  | "connected to serial to you (in another tab)"
```

**Purpose:** Enumerate all valid states to prevent invalid status values

### Interface Composition
```typescript
export interface AvailableBlock {
  type: BlockNames
  description: string
  codeTemplate: string
}

export interface CqChallengeData {
  careerUUID: CareerUUID
  challengeUUID: ChallengeUUID
  availableBlocks: AvailableBlock[]  // Composition
  // ... other fields
}
```

### Generic Envelopes
```typescript
interface ESPMessage<TPayload, TRoute extends string = string> {
  route: TRoute
  payload: TPayload
}
```

**Purpose:** Consistent message structure for extensibility without boilerplate

### Response Type Unions
```typescript
export type SuccessResponse = { success: string }
export type ErrorResponse = { error: string }
export type ValidationErrorResponse = { validationError: string }
export type AllCommonResponses = SuccessResponse | ValidationErrorResponse | ErrorResponse
```

## Type Organization by Domain

### Authentication (auth.ts)
- Login credentials
- Registration data
- Session types
- OAuth/Google auth types

### Robot Communication (pip.ts)
- Connection status (server vs client perspective)
- Battery monitor data
- Firmware version info
- WiFi connection results
- ESP message envelope

### Learning Platform (career-quest.ts, quest.ts)
- Challenge metadata (title, difficulty, learning objectives)
- Challenge progression state
- Lesson data
- Block availability for challenges
- Code validation responses

### Code Editor (sandbox.ts)
- BlocklyJson format for workspace state
- SandboxProject structure
- Code submission types

### API Contracts (api.ts)
- **Auth routes:** RegisterRequest, LoginRequest, LoginSuccess
- **Career Quest routes:** CareerQuestHint, CodeSubmission, CareerProgressData
- **Sandbox routes:** CreateSandboxProjectResponse, UsbBytecodeResponse
- **Teacher routes:** ClassroomData, StudentPermissions
- **Common responses:** Error types, success patterns

### WebSocket (socket.ts)
- Real-time message types for student/teacher/robot connections
- Connection handshake messages
- Update/sync messages

## Critical Constraints

### No `any` Types
All types must be explicit. Use:
- `unknown` if truly unknown (requires type guard)
- `Record<string, unknown>` for flexible objects
- Proper union types for multiple possibilities
- Never `any`

### Branded Types Must Use Cast
```typescript
// Correct
const pipId = "abc-123" as PipUUID

// Wrong
const pipId: PipUUID = "abc-123"  // Type error: string is not PipUUID
```

### Immutable Type Definitions
- Use `readonly` for immutable properties
- Use `as const` for literal types
- Don't add `__brand` properties—TypeScript phantom type

### UUID Format
- `ChallengeUUID` and `CareerUUID` are branded `UUID` from crypto module
- Represents v4 UUIDs (RFC 4122)
- Generated server-side, never client-generated

## Adding New Types

### Step 1: Identify Domain
- Is it API-related? Add to `api.ts`
- Is it a status/state? Add to domain file (pip.ts, career-quest.ts)
- Is it a data model? Create dedicated file or add to appropriate domain

### Step 2: Define Interface/Type
```typescript
export interface YourNewType {
  field1: string
  field2: number
  uuid?: YourUUID  // Optional with ?
}

export type YourUUID = UUID & { readonly __brand: unique symbol }
```

### Step 3: Export from Proper Module
If in subdirectory, re-export from parent `index.ts` if exists

### Step 4: Use in Related Files
- Import and use in dependent modules
- Update related types (e.g., add to union type)
- No circular imports

### Step 5: Document if Complex
- Add JSDoc comments for non-obvious fields
- Explain enums with comments
- Note any special validation requirements

## Request/Response Patterns

### Request Types
```typescript
export interface SomeApiRequest {
  userId: UserId
  data: string
  // Keep minimal - validation happens server-side
}
```

### Response Types - Success
```typescript
export interface SomeApiResponse {
  result: DataType
  metadata?: MetadataType
}
```

### Response Types - Error
```typescript
export type ApiError =
  | { error: string }
  | { validationError: string }
  | { message: string }
```

### Status Responses
```typescript
export interface StandardJsonStatusMessage {
  status: string
}

// Specific status types
export interface WiFiConnectionResultPayload extends StandardJsonStatusMessage {
  status: "success" | "wifi_only" | "failed"
}
```

## Type Safety Best Practices

### Avoid Unions That Are Too Broad
```typescript
// Bad
type Value = string | number | boolean | object | null | undefined | any

// Good
type ValueType = string | number | boolean | null
type OptionalValue = ValueType | undefined
```

### Use Discriminated Unions for Complex States
```typescript
type Result =
  | { status: "success", data: Data }
  | { status: "error", error: Error }
  | { status: "loading" }
```

### Branded Types for IDs
```typescript
type UserId = string & { readonly __brand: "UserId" }
type ClassroomId = string & { readonly __brand: "ClassroomId" }
```

## Integration Points

### With Blockly Types
```typescript
// In career-quest.ts
import { BlockNames } from "./blockly/blockly"
import { BlocklyJson } from "./sandbox"

export interface AvailableBlock {
  type: BlockNames  // Type-safe block references
  description: string
  codeTemplate: string
}
```

### With API Router
```typescript
// Types define contract between frontend and backend
// Use in route handlers:
app.post("/api/sandbox/create", (req: Request<CreateSandboxProjectResponse>) => { ... })
```

### With WebSocket Events
```typescript
// Types define message format for real-time communication
socket.emit("challenge-submitted", submission: CareerQuestCodeSubmission)
```

## Version Stability

When changing types:
1. **Non-breaking:** Add optional fields with `?`
2. **Breaking:** Create new type, deprecate old one, bump major version
3. **Removal:** Add deprecation notice, provide migration guide

Example:
```typescript
/** @deprecated Use NewFeatureType instead */
export type OldFeatureType = { ... }

export type NewFeatureType = {
  // New structure
}
```

## Testing Type Safety

Types are validated at compile time:
```bash
pnpm run type-check  # Verify no type errors
```

Tests should verify runtime data matches type expectations:
```typescript
// In test file
const data: SomeType = fetchDataFromApi()
expect(data.requiredField).toBeDefined()
```

## Notes

- Types are exported but implementation details are in src/ modules
- Never put logic or constants in type files
- Type files are read-only (declaration only)
- Consider backward compatibility when modifying types
- Use consistent naming: TypeName for interfaces, lowercase for type aliases
- Document complex types with JSDoc comments
- Keep type files focused—don't mix unrelated domains in one file
