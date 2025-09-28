# Lever LabsCommon TypeScript Library

This is a shared TypeScript library (`@lever-labs/common-ts`) that provides core functionality for an educational robotics platform, including C++ to bytecode interpretation for ESP32-based robots.

## Project Context

### Core Purpose
- **C++ Parser & Bytecode Generation**: Converts student-written C++ code into executable bytecode for ESP32 robots
- **Robot Communication**: Message building and protocol handling between web apps and physical robots
- **Educational Platform Support**: Manages classroom data, lab activities, and user progress tracking
- **Multi-platform Library**: Shared dependency between frontend and backend applications

### Critical Constraints
- **Robot Behavior Impact**: Changes to parsers directly affect physical robot execution - require deep understanding of instruction sets and embedded systems
- **Security-Critical**: Input validation and regex patterns must be bulletproof - serves educational users with arbitrary code input
- **Performance Priority**: Optimize for speed and efficiency over readability - internal library not seen by end users
- **Version Stability**: Avoid suggesting dependency updates without explicit approval (Blockly 12.1.0, TypeScript 5.8.3)

## Technical Architecture

### Key Components
- `src/parsers/`: C++ parsing and bytecode generation (performance-critical)
- `src/message-builder/`: Robot communication protocols
- `src/types/`: Comprehensive type system for API contracts and Blockly blocks

### Code Quality Standards
- **Strict TypeScript**: No `any` types, explicit return types required
- **100% Test Coverage**: All changes must maintain full test coverage
- **Security Linting**: Uses eslint-plugin-security for input validation
- **Performance Constraints**: Max 9 complexity, 40 lines per function, 3 max depth

## Development Commands

```bash
npm run build          # Compile to dist/
npm run test           # Jest tests
npm run test:coverage  # Coverage report
npm run lint           # ESLint check
npm run type-check     # TypeScript validation
npm run validate       # Full validation pipeline
```

## Claude-Specific Guidelines

### Parser Development
- **Bytecode Expertise Required**: Understand instruction sets and embedded constraints when modifying parsers
- **Security-First Input Handling**: All user input parsing must be bulletproof with proper validation
- **Performance Optimization**: Prioritize clever optimizations and efficiency over code readability
- **Regex Safety**: Use secure, tested patterns - avoid ReDoS vulnerabilities

### Code Changes
- **Type Safety**: Maintain strict TypeScript compliance with explicit types
- **Test Coverage**: Ensure 100% coverage is maintained for all changes
- **Breaking Changes**: Coordinate carefully - affects multiple applications in ecosystem
- **Version Locks**: Do not suggest dependency updates without explicit approval

### Testing Approach
- Focus on edge cases and malformed C++ input
- Test bytecode output correctness and instruction validity
- Validate message protocol compliance
- Coverage requirements are non-negotiable

## Architecture Notes

- **Export-only modules** for clean API surface
- **Class-based parsers** with static methods for performance
- **Modular organization** by functional domain
- **Comprehensive type definitions** for all public interfaces
- **Security-conscious** approach to all external input processing
