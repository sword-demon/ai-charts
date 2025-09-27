
# Implementation Plan: AI Charts Website

**Branch**: `001-ai-charts-ai` | **Date**: 2025-09-28 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-ai-charts-ai/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
AI Charts Website: A natural language to chart visualization platform that allows users to input data descriptions in plain text and automatically generates interactive ECharts visualizations. The system uses Alibaba Cloud Bailian AI models to extract data, determine optimal chart types, and maintain conversation context for iterative improvements. Built with Next.js, Tailwind CSS, shadcn/ui, and ECharts following constitutional principles.

## Technical Context
**Language/Version**: TypeScript 5.x, React 19, Next.js 15.5
**Primary Dependencies**: Next.js, React, ECharts, Tailwind CSS, shadcn/ui, OpenAI SDK, Alibaba Cloud Bailian
**Storage**: No persistent storage required - conversation context maintained in memory/session
**Testing**: Jest, React Testing Library, Playwright for E2E
**Target Platform**: Web browsers (desktop and mobile), deployed on Vercel/similar
**Project Type**: web - Next.js frontend+backend application
**Performance Goals**: <500ms chart generation, responsive UI, real-time AI processing
**Constraints**: No data privacy concerns, unlimited data size processing, multilingual support required
**Scale/Scope**: Public website, international users, conversational AI interface

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Next.js Architecture Check**:
- [x] All backend functionality implemented via Next.js API Routes in `app/api/`
- [x] No direct database access from client components
- [x] Proper separation between server and client code

**Tailwind CSS + shadcn/ui Check**:
- [x] All frontend components use Tailwind CSS for styling
- [x] UI components built with shadcn/ui library
- [x] Custom styling follows Tailwind utility-first approach

**ECharts Visualization Check**:
- [x] All chart components use ECharts library
- [x] Chart configurations are modular and reusable
- [x] Charts support responsive design

**TypeScript-First Check**:
- [x] All code written in TypeScript with strict checking
- [x] API routes define clear input/output interfaces
- [x] Build fails on TypeScript errors

**Component Architecture Check**:
- [x] Frontend follows React component composition patterns
- [x] Components organized by feature modules
- [x] State management uses React patterns

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
app/
├── api/                     # Next.js API Routes
│   ├── chat/
│   │   └── route.ts        # AI chat completion endpoint
│   ├── charts/
│   │   └── generate/
│   │       └── route.ts    # Chart generation endpoint
│   └── health/
│       └── route.ts        # Health check endpoint
├── components/              # React components
│   ├── ui/                 # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── toast.tsx
│   │   └── card.tsx
│   ├── charts/             # ECharts components
│   │   ├── chart-container.tsx
│   │   ├── chart-renderer.tsx
│   │   └── chart-types.ts
│   └── layout/
│       ├── header.tsx
│       ├── footer.tsx
│       └── main-layout.tsx
├── lib/
│   ├── ai/
│   │   ├── client.ts       # OpenAI/Bailian client
│   │   ├── prompts.ts      # System prompts
│   │   └── types.ts        # AI response types
│   ├── charts/
│   │   ├── config.ts       # ECharts configurations
│   │   ├── themes.ts       # Chart themes
│   │   └── utils.ts        # Chart utilities
│   ├── utils.ts            # General utilities
│   └── types.ts            # Global types
├── page.tsx                # Homepage with input/chart layout
├── layout.tsx              # Root layout
└── globals.css             # Tailwind CSS

components/                  # Additional shared components
├── ui/                     # shadcn/ui library components
└── charts/                 # Reusable chart wrappers

tests/
├── api/                    # API route tests
│   ├── chat.test.ts
│   └── charts.test.ts
├── components/             # Component tests
│   ├── chart-renderer.test.tsx
│   └── layout.test.tsx
└── e2e/                    # End-to-end tests
    ├── homepage.spec.ts
    └── chart-generation.spec.ts
```

**Structure Decision**: Selected Next.js Web application structure (Option 2) as this is a web-based AI chart generation platform. The app directory follows Next.js 13+ app router conventions with API routes for AI integration, component-based architecture with shadcn/ui, and ECharts integration. All code will be TypeScript with proper type definitions throughout.

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh claude`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each API endpoint → contract test task [P]
- Each React component → component implementation task [P]
- Each user story → integration test task
- Implementation tasks to make tests pass

**Ordering Strategy**:
- TDD order: Tests before implementation
- Dependency order: API routes → Components → Integration
- Mark [P] for parallel execution (independent files)

**Estimated Tasks**:
1. **Setup Phase**: Project initialization, dependencies, Next.js configuration
2. **API Phase**: AI integration, chart generation endpoints, error handling
3. **Component Phase**: UI components, chart rendering, layout management
4. **Integration Phase**: End-to-end user flows, conversation context
5. **Polish Phase**: Testing, optimization, documentation

**Estimated Output**: 20-25 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented

---
*Based on Constitution v1.0.0 - See `.specify/memory/constitution.md`*
