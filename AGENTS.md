# Ctrl X — Frontend Codex Instructions

## Mission
Build an accessible, patient-first, responsive health-tracking web application with Next.js App Router, React, TypeScript and CSS Modules. It is accessed in a browser on desktop, tablet and mobile; the frontend is deployed to Vercel and the backend to Railway. Keep the patient experience approachable and focused.

## Structure
- `src/app`: routes/layouts; `src/features`: domain UI; `src/components`: shared UI; `src/services`: typed API client; `src/types`: contracts; `src/styles`: tokens/global styles.
- Keep patient and professional areas distinct; reuse components where sensible.
- Use semantic HTML, keyboard navigation, visible focus, accessible labels, loading/error/empty states.
- Prefer CSS Modules and CSS variables; do not add Tailwind or UI libraries unless asked.
- Use React Hook Form + Zod for forms; TanStack Query for remote state when needed.
- Never invent API contracts: match FastAPI OpenAPI schemas or coordinate documented contract changes.

## Patient experience
- Pain diary, body region, intensity (0–10), timeline and calendar share the same persisted API records.
- Timeline/dashboard/calendar are projections of records, not three duplicated data stores.
- Never show exercise prescriptions as patient-created; only authorized professionals prescribe.
- Never present OCR text as medically verified; show a review/correction step.
- Treat health data as private: no analytics/third-party tracking or browser localStorage of records/tokens.
- Hide unauthorized UI but rely on backend for actual authorization.

## Quality gates
- Use strict TypeScript, ESLint and build checks. Add meaningful UI tests as features grow.
- Finish each task with changed files, commands executed, test results and known gaps.
- Do not generate the whole product in one pass; work on one milestone per prompt.

## Frontend interface design
- Before starting any frontend task, locate and read `~/.agents/skills/interface-design/SKILL.md` and the relevant references. Follow the skill's guidelines, standards, and workflows for pages, components, layouts, dashboards, forms, responsive behavior, and visual refactoring. Do not make visual changes before consulting the skill.
- Prioritize modern, professional, consistent, intuitive interfaces with clear visual hierarchy, spacing, typography, contrast, and alignment. Keep components, colors, states, and interaction patterns consistent. Account for accessibility, responsiveness, and user experience, and avoid generic, inconsistent, or improvised interfaces.
- Respect the project's existing design system, technologies, and architecture. Reuse existing components and styles where possible, and avoid unnecessary UI libraries. For exclusively visual changes, do not change business rules or API contracts.
- Required workflow: identify whether the task involves frontend; read the skill and relevant references; inspect existing project components and patterns; plan according to the skill; implement and validate the interface; run available checks such as lint, TypeScript, tests, and build when applicable.
- Treat `interface-design` as the required reference for UI/UX decisions. When it conflicts with explicit project requirements, preserve the project requirements and document the conflict. If the skill is unavailable, report that limitation and do not claim to have used it.

## P0: Native digital clinical records
- Provide professional-only structured create/edit draft/finalize screens for linked patients, with explicit validation and confirmation before finalization.
- Provide read-only patient view of finalized clinical records within timeline and clinical history.
- Never treat OCR text or uploaded documents as a native clinical record without deliberate professional review and separate creation.
- Never imply finalized records are editable; show amendments separately. Backend must authorize every action.

Native clinical records are first-class structured entities in the patient's longitudinal health record, not PDFs, uploaded documents, or OCR results. Clinical records, pain diary entries, exercise prescriptions and progress tracking must be independently persisted but linked through patient identity and appropriate relational references. Dashboard, timeline and calendar are views over these existing entities, not duplicated data. Design the schema to support future relationships between assessments, prescriptions and patient outcomes without implementing speculative features now.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
