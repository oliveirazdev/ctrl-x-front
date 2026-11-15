# Ctrl X — Frontend Codex Instructions

## Mission
Build a mobile-first, accessible, patient-first health-tracking PWA with Next.js App Router, React, TypeScript and CSS Modules. Keep the patient experience approachable and focused.

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

## P0: Native digital clinical records
- Provide professional-only structured create/edit draft/finalize screens for linked patients, with explicit validation and confirmation before finalization.
- Provide read-only patient view of finalized clinical records within timeline and clinical history.
- Never treat OCR text or uploaded documents as a native clinical record without deliberate professional review and separate creation.
- Never imply finalized records are editable; show amendments separately. Backend must authorize every action.

Native clinical records are first-class structured entities in the patient's longitudinal health record, not PDFs, uploaded documents, or OCR results. Clinical records, pain diary entries, exercise prescriptions and progress tracking must be independently persisted but linked through patient identity and appropriate relational references. Dashboard, timeline and calendar are views over these existing entities, not duplicated data. Design the schema to support future relationships between assessments, prescriptions and patient outcomes without implementing speculative features now.