# Mail Body Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an enterprise mail reading pane with structured metadata, attachments, security notices, quoted history, quick reply, mock states, and verification.

**Architecture:** Keep `MailWorkspace` as the existing shell and replace only the right-side reader with a feature component under `src/features/mail/components`. Put mail-body types, mock reading states, and utility logic under `src/features/mail` so UI components do not own fixtures.

**Tech Stack:** React 19, Vite, Tailwind 4, TypeScript TSX components imported from the existing JSX app, Playwright smoke tests.

---

### Task 1: Documentation And Rules

**Files:**
- Create: `docs/mail-body-page/product-spec.md`
- Create: `docs/mail-body-page/interaction-rules.md`
- Create: `docs/mail-body-page/component-spec.md`
- Create: `docs/mail-body-page/states-and-edge-cases.md`
- Create: `docs/mail-body-page/acceptance-checklist.md`
- Modify: `AGENTS.md`

- [x] Add the required product, interaction, component, state, and acceptance documents.
- [x] Append mail reading pane implementation rules to `AGENTS.md`.

### Task 2: Red Tests

**Files:**
- Modify: `tests/smoke.spec.js`

- [x] Add Playwright expectations for reader structure, external badges, recipient details, attachment status, security notice, quoted history, quick reply, and exception state entries.
- [x] Run `npx playwright test --config=playwright.config.js tests/smoke.spec.js --grep "mail reading pane"`; final verification passes with the implemented reader.

### Task 3: Types, Fixtures, And Utilities

**Files:**
- Create: `src/features/mail/types/mail.ts`
- Create: `src/features/mail/data/mockMailReadingStates.ts`
- Create: `src/features/mail/utils/mailReadingPane.ts`
- Modify: `src/domain/appModel.js`

- [x] Define address, attachment, security, and reading pane state types.
- [x] Add mock state ids for normal, external, risky, long thread, system, permission denied, deleted, loading, error, blocked, and external image cases.
- [x] Extend selected existing mails with reading pane metadata while preserving list shape.

### Task 4: Reading Pane Components

**Files:**
- Create: `src/features/mail/components/MailReadingPane.tsx`
- Modify: `src/App.jsx`

- [x] Implement action bar, header, recipient details, security notice, attachment list, mail body, quoted history, quick reply, and state view components.
- [x] Import and use `MailReadingPane` from `MailWorkspace`.
- [x] Preserve existing AI assistant and linked event entry points.

### Task 5: Interaction Wiring

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/features/mail/components/MailReadingPane.tsx`

- [x] Add local toast feedback for mark, follow-up, attachment preview/download, quick reply, and security actions.
- [x] Change read marking to delayed or scroll-based behavior.
- [x] Select the next visible mail after archive or delete when possible.

### Task 6: Verification

**Files:**
- Modify as needed after test results.

- [x] Run `npm run lint`.
- [x] Run `npm run typecheck`.
- [x] Run `npm run test:smoke`.
- [x] Run `npm run build`.
- [x] Open the local app with the in-app browser and verify the reader visually.
