# Codex Project Rules

This is a Coremail enterprise office frontend prototype covering mail, calendar, contacts, search, settings, permissions, and multi-source work. Codex must implement against the product, design, component, data-model, information-architecture, pattern, and feature specs in `docs/`. This file is the working contract; detailed rules stay in `docs/`.

## 1. Required Reading

Before UI, interaction, layout, component, icon, or copy changes, read:

- `docs/product.md`
- `docs/design.md`
- `docs/components.md`
- `docs/information-architecture.md`

All page work must obey these four base docs first, then the relevant module pattern and feature spec.

Before data structure, mock data, state, filtering, sorting, or field changes, read:

- `docs/data-model.md`

Before module-specific work, read the relevant pattern:

- Mail pages: `docs/patterns/mail.md`
- Calendar pages: `docs/patterns/calendar.md`
- Contacts pages: `docs/patterns/contacts.md`
- Search pages: `docs/patterns/search.md`
- Permission, sharing, delegation, or visibility work: `docs/patterns/permission.md`

Before feature-specific work, read the relevant file in:

- `docs/features/`

If the task conflicts with docs, state the conflict first. Do not silently override product, design, IA, component, pattern, feature, or data-model rules.

## 2. Editable Areas

Allowed:

- `src/`
- `docs/`
- `AGENTS.md`
- Project config files when needed for the task

Forbidden unless explicitly required:

- `dist/`
- `node_modules/`
- `test-results/`
- Build artifacts
- Lock files, unless dependencies or package metadata changed

Do not delete assets or generated resources unless the user explicitly asks.

## 3. Product And Design Rules

- Must optimize for enterprise clarity, stability, density, and task efficiency.
- Must not add decorative UI, marketing-style sections, large explanation blocks, or card-heavy layouts without a documented reason.
- Must not change page hierarchy, navigation, layout model, copy, or interaction logic unless the task requires it.
- Must not invent new product rules when `docs/` already defines the behavior.
- Must preserve existing information architecture. Do not move search, details, reminders, shared permissions, mail lists, or calendar workflows to another layer for implementation convenience.
- For three-column layout, timestamps, reminders, search, mail list, reading pane, calendar, contacts, shared permissions, or settings behavior, read `docs/design.md`, the relevant `docs/patterns/*.md`, and the relevant `docs/features/*.md` before editing.
- Do not use large cards, marketing modules, AI packaging, or decorative icons instead of enterprise information structure.
- Do not implement only normal state. Consider loading, empty, error, permission-limited, security-risk, and unavailable states.
- Loading, empty, error, permission-limited, security-risk, and unavailable states are acceptance surfaces, not optional polish.

## 4. Component Rules

- Before adding a component, check `src/components/` and existing feature/page components.
- Reusable components belong in `src/components/`.
- Page-specific components belong in the page or feature directory that owns them.
- Do not duplicate components with the same responsibility.
- Do not introduce a new UI library unless the user explicitly asks.
- Preserve existing props, class names, DOM hierarchy, accessibility labels, and interaction behavior unless the task requires changing them.

## 5. Icon Rules

- All business UI icons must be rendered through `src/components/AppIcon.tsx`.
- Business pages must use `<AppIcon />` or local wrappers that call `<AppIcon />`.
- Do not import `lucide-react`, `react-icons`, or `@iconify/react` directly in business pages.
- Do not handwrite simple semantic SVG icons in business pages.
- Prefer `lucide:*` icons by default. Use other Iconify sets only when needed.
- Do not replace logos, brand marks, illustrations, or complex business-specific SVGs.
- Preserve icon `size`, `className`, `ariaLabel`, tooltip, and click behavior unless the task requires changing them.

## 6. Code Change Rules

- Make the smallest safe change that satisfies the task.
- Do not refactor unrelated files.
- Do not rename files, components, fields, or props unless necessary.
- Do not change business logic, layout, or visual style unless explicitly requested.
- Clean up unused imports after edits.
- Prefer existing project patterns over new abstractions.
- If intent is unclear or a change may violate docs, explain the risk and ask before editing.

## 7. Documentation Rules

- If behavior changes, update the owning doc.
- Product behavior goes in `docs/product.md`.
- Layout, interaction, timestamps, visual density, and three-column rules go in `docs/design.md`.
- Component and icon usage rules go in `docs/components.md`.
- Entity fields, mock data, state enums, and derived data rules go in `docs/data-model.md`.
- Page structure, navigation, and module hierarchy go in `docs/information-architecture.md`.
- Module-specific behavior goes in `docs/patterns/`.
- Feature-specific behavior goes in `docs/features/`.
- Do not copy long feature rules into `AGENTS.md`.

## 8. Validation Commands

Before reporting completion, inspect `package.json` and run only configured scripts.

Default priority:

1. `npm run lint`
2. `npm run typecheck` if configured
3. `npm run build`
4. Relevant tests if configured and related to the change, such as `npm run test:smoke`

If a script is missing, say it is not configured. Do not invent commands.

## 9. Completion Report

Every completion report must include:

- Files changed
- What changed
- What was intentionally not changed
- Validation commands run
- Validation result
- Risks or items needing human confirmation

## 10. Mail Reading Pane Rules

- Mail reading work must follow `docs/patterns/mail.md` and `docs/features/mail-body-page.md`.
- `docs/mail-body-page/` is a split reference set, not the primary upstream entry.
- The reading pane is a work-processing surface, not a passive article view.
- Key metadata, attachments, recipient relationship, security status, quoted history, quick reply, archive/delete feedback, delayed read marking, and continuous processing must follow the feature spec.
