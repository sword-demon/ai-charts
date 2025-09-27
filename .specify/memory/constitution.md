<!--
Sync Impact Report:
Version change: Template → 1.0.0 (MINOR - Initial constitution with complete principles)
Modified principles: All principles newly defined
Added sections: All core sections from template
Removed sections: None
Templates requiring updates: ⚠ Pending validation
Follow-up TODOs: None
-->

# AI Charts Constitution

## Core Principles

### I. Next.js Architecture First
All backend functionality MUST be implemented using Next.js API Routes in the `app/api/` directory. Frontend components MUST call backend endpoints through proper API abstraction. No direct database access from client components. Clear separation between server and client code with proper data fetching patterns.

### II. Tailwind CSS + shadcn/ui Design System
All frontend components MUST use Tailwind CSS for styling. UI components MUST be built using shadcn/ui library for consistency and accessibility. Custom styling MUST follow Tailwind utility-first approach. Component variants and themes MUST be implemented through Tailwind configuration.

### III. ECharts Visualization Standard
All chart and data visualization components MUST use ECharts library. Custom chart types MUST extend ECharts base functionality. Chart configurations MUST be modular and reusable. Data visualization MUST support responsive design and theming through ECharts options.

### IV. TypeScript-First Development
All code MUST be written in TypeScript with strict type checking enabled. API routes MUST define clear input/output interfaces. React components MUST use proper TypeScript patterns with Props interfaces. Build process MUST fail on TypeScript errors.

### V. Component-Based Architecture
Frontend MUST follow React component composition patterns. Reusable components MUST be documented and testable. State management MUST use React patterns (useState, useContext, etc.). Components MUST be organized by feature modules with clear boundaries.

## API Design Standards

All API endpoints MUST follow RESTful conventions with proper HTTP methods and status codes. Request/response schemas MUST be typed and validated. Error handling MUST return consistent JSON error responses. API routes MUST implement proper authentication and authorization where required.

## Development Standards

Code MUST pass ESLint checks before commit. Components MUST be responsive and accessible by default. Charts MUST handle loading states and error conditions gracefully. All user interactions MUST provide appropriate feedback. Performance optimizations MUST not compromise code maintainability.

## Governance

This constitution supersedes all other development practices. All pull requests MUST verify compliance with these principles. New features MUST align with the established technology stack. Breaking changes require constitutional amendment and migration plan documentation.

**Version**: 1.0.0 | **Ratified**: 2025-09-28 | **Last Amended**: 2025-09-28