# Message Builder Module

## Purpose
Constructs binary protocol messages for ESP32 robot communication. Serializes application data into framed ArrayBuffers following a strict binary format that the robot firmware expects.

## Architecture

### Core Components

**MessageBuilder** (`message-builder.ts`)
- Static factory class with one method per message type
- Private `frameMessage()` helper applies consistent framing to all messages
- Returns `ArrayBuffer` for direct serial transmission

**Protocol** (`protocol.ts`)
- Message type enumerations (MessageType, CareerType, TriggerType variants)
- Status enumerations (SpeakerStatus, HeadlightStatus, BalanceStatus, etc.)
- Career trigger type mappings with strict typing via `ValidTriggerMessageType<T>`
- Light animation mappings

## Protocol Specification

### Frame Format
```
[START_MARKER(1)] [TYPE(1)] [FORMAT(1)] [LENGTH(1|2)] [PAYLOAD(0-N)] [END_MARKER(1)]
```

**Key Points:**
- `FORMAT` byte: 0 = short format (1-byte length), 1 = long format (2-byte length)
- Long format automatically used for payloads > 255 bytes (triggers 2-byte little-endian length)
- START_MARKER and END_MARKER defined in `src/types/utils/constants`

### Payload Serialization Rules

**Float Values:** Always little-endian (`true` parameter in setFloat32/setFloat64)
- Speaker volume: 0-100 → 0-3.9 float32
- Balance PIDs: 10 × float32 values (40 bytes total)

**Integer Values:** Little-endian int16/uint16
- Motor control: left (int16) + right (int16) = 4 bytes
- Firmware version: uint16 = 2 bytes

**Fixed Arrays:** Byte-sequential copy with offset tracking
- LED colors: 6 colors × 3 bytes (RGB) = 18 bytes
- Display buffer: exactly 1024 bytes (SSD1306 128×64)

**Strings:** TLV pattern (Type-Length-Value)
- WiFi credentials: [SSID_length(1)] [SSID_bytes] [PASSWORD_length(1)] [PASSWORD_bytes]
- Network name: [length(1)] [name_bytes]

**Empty Payloads:** Pass `null` to frameMessage for messages with no data

## Adding New Messages

1. Add message type to `MessageType` enum in `protocol.ts`
2. Create factory method following naming: `createXxxMessage(params): ArrayBuffer`
3. Build payload using appropriate serialization for your data types
4. Call `this.frameMessage(MessageType.YOUR_TYPE, payload)`
5. Follow existing patterns for data layout and byte ordering

### Example Template
```typescript
static createExampleMessage(value: number): ArrayBuffer {
  const payload = new ArrayBuffer(2)
  const view = new DataView(payload)
  view.setUint16(0, value, true) // little-endian
  return this.frameMessage(MessageType.EXAMPLE, new Uint8Array(payload))
}
```

## Critical Constraints

- **No validation in MessageBuilder** - Assumes calling code has validated inputs
- **Byte counts must be exact** - Mismatched payload sizes cause deserialization errors
- **Little-endian is mandatory** - All multi-byte values must use little-endian encoding
- **MAX_PAYLOAD: 65535 bytes** - Limited by 2-byte length field in long format

## Testing Approach

Test each message type by:
1. Verifying correct frame structure (START, TYPE, FORMAT, LENGTH, END markers in order)
2. Validating payload byte sequence matches expected serialization
3. Confirming correct byte ordering for multi-byte values
4. Edge case: payloads at 255/256 byte boundary (triggers format switch)

## Dependencies

- `src/types/utils/constants` - START_MARKER, END_MARKER constants
- `src/types/garage` - BalancePidsProps, LedControlData types
- `protocol.ts` - Message type, status, and trigger enumerations

## Notes

- `createStartSensorPollingMessage()` is deprecated - sensor polling now filtered by bytecode
- Message framing handles payloads up to 65535 bytes automatically
- All public methods are static - no instance state required
