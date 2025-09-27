# Tasks: AI Charts Website

**Input**: Design documents from `/specs/001-ai-charts-ai/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, API routes
   → Integration: AI client, middleware, error handling
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have TypeScript types?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Next.js Web app**: `app/`, `components/`, `lib/`, `tests/`
- Paths follow Next.js 13+ app router structure

## Phase 3.1: Setup
- [ ] T001 Initialize Next.js 15.5 project with TypeScript and required dependencies
- [ ] T002 [P] Configure Tailwind CSS and PostCSS in `tailwind.config.js` and `postcss.config.js`
- [ ] T003 [P] Setup ESLint and TypeScript strict configuration in `tsconfig.json`
- [ ] T004 [P] Install and configure shadcn/ui components library with initial setup
- [ ] T005 [P] Install ECharts and echarts-for-react with TypeScript definitions
- [ ] T006 [P] Install and configure OpenAI SDK for Alibaba Cloud Bailian integration
- [ ] T007 Create project directory structure as defined in plan.md

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T008 [P] API contract test for POST /api/chat in `tests/api/chat.test.ts`
- [ ] T009 [P] API contract test for GET /api/health in `tests/api/health.test.ts`
- [ ] T010 [P] Integration test for basic chart generation scenario in `tests/e2e/chart-generation.spec.ts`
- [ ] T011 [P] Integration test for error handling scenario in `tests/e2e/error-handling.spec.ts`
- [ ] T012 [P] Integration test for conversation context scenario in `tests/e2e/conversation.spec.ts`
- [ ] T013 [P] Component test for ChartRenderer in `tests/components/chart-renderer.test.tsx`
- [ ] T014 [P] Component test for layout transformation in `tests/components/layout.test.tsx`

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T015 [P] Create TypeScript types and interfaces in `lib/types.ts`
- [ ] T016 [P] Implement Alibaba Cloud Bailian AI client in `lib/ai/client.ts`
- [ ] T017 [P] Create AI system prompts for chart generation in `lib/ai/prompts.ts`
- [ ] T018 [P] Implement ECharts configuration utilities in `lib/charts/config.ts`
- [ ] T019 [P] Create chart themes and styling in `lib/charts/themes.ts`
- [ ] T020 POST /api/chat endpoint implementation in `app/api/chat/route.ts`
- [ ] T021 GET /api/health endpoint implementation in `app/api/health/route.ts`
- [ ] T022 [P] Create shadcn/ui base components (Button, Input, Toast) in `components/ui/`
- [ ] T023 [P] Implement ChartRenderer component in `app/components/charts/chart-renderer.tsx`
- [ ] T024 [P] Create ChartContainer component in `app/components/charts/chart-container.tsx`
- [ ] T025 Implement main layout with input/chart transformation in `app/page.tsx`

## Phase 3.4: Integration
- [ ] T026 Implement conversation context management in `lib/conversation-context.ts`
- [ ] T027 Add error handling and toast notifications throughout application
- [ ] T028 Implement responsive design and mobile compatibility
- [ ] T029 Add AI response validation and chart configuration parsing
- [ ] T030 Integrate all components in main page layout
- [ ] T031 Add loading states and user feedback during AI processing

## Phase 3.5: Polish
- [ ] T032 [P] Unit tests for AI client functions in `tests/unit/ai-client.test.ts`
- [ ] T033 [P] Unit tests for chart utilities in `tests/unit/chart-utils.test.ts`
- [ ] T034 [P] Unit tests for type validation in `tests/unit/validation.test.ts`
- [ ] T035 Performance optimization for chart rendering and AI response caching
- [ ] T036 [P] Add comprehensive error boundaries and fallback UI
- [ ] T037 [P] Implement accessibility features and ARIA labels
- [ ] T038 Add internationalization support for multiple languages
- [ ] T039 Execute quickstart.md test scenarios and fix any failures
- [ ] T040 Final integration testing and bug fixes

## Dependencies
- Setup (T001-T007) before everything
- Tests (T008-T014) before implementation (T015-T031)
- Types and utilities (T015-T019) before API endpoints (T020-T021)
- Base components (T022) before specific components (T023-T024)
- Individual components (T015-T024) before main layout (T025)
- Core implementation (T015-T025) before integration (T026-T031)
- Everything before polish (T032-T040)

## Parallel Example
```bash
# Launch T008-T014 together (all test files):
Task: "API contract test for POST /api/chat in tests/api/chat.test.ts"
Task: "API contract test for GET /api/health in tests/api/health.test.ts"
Task: "Integration test for basic chart generation in tests/e2e/chart-generation.spec.ts"
Task: "Integration test for error handling in tests/e2e/error-handling.spec.ts"
Task: "Component test for ChartRenderer in tests/components/chart-renderer.test.tsx"

# Launch T015-T019 together (utility files):
Task: "Create TypeScript types in lib/types.ts"
Task: "Implement AI client in lib/ai/client.ts"
Task: "Create AI prompts in lib/ai/prompts.ts"
Task: "Implement chart configs in lib/charts/config.ts"
Task: "Create chart themes in lib/charts/themes.ts"

# Launch T022-T024 together (component files):
Task: "Create shadcn/ui components in components/ui/"
Task: "Implement ChartRenderer in app/components/charts/chart-renderer.tsx"
Task: "Create ChartContainer in app/components/charts/chart-container.tsx"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Use exact TypeScript types from data-model.md
- Follow shadcn/ui patterns for all UI components
- Implement proper error handling with toast notifications
- All AI integration must use OpenAI SDK with Bailian endpoints
- Charts must be responsive and support all ECharts types
- Follow constitutional principles throughout implementation

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - Each API endpoint → contract test task [P]
   - Each endpoint → implementation task

2. **From Data Model**:
   - Each entity → TypeScript interface task [P]
   - Relationships → utility functions

3. **From User Stories**:
   - Each quickstart scenario → integration test [P]
   - Main user flow → core implementation tasks

4. **Ordering**:
   - Setup → Tests → Types → API → Components → Integration → Polish
   - Dependencies block parallel execution

## Validation Checklist
*GATE: Checked by main() before returning*

- [x] All API contracts have corresponding tests (T008, T009)
- [x] All entities have TypeScript interface tasks (T015)
- [x] All tests come before implementation (T008-T014 before T015+)
- [x] Parallel tasks truly independent (different files)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] Constitutional principles reflected in tasks
- [x] Quickstart scenarios covered by integration tests