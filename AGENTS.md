# AGENTS.md

Perpetual guide for coding agents (and humans) working in this repo. Read this, then the docs.

## Start here

Before changing anything, read in this order:

1. `docs/ROADMAP.md` — current phase and status.
2. The active phase's tactical doc at `docs/proposals/000N-phase-N-{name}.md`, if one exists.
3. Relevant ADRs in `docs/proposals/decisions/`.
4. `docs/proposals/0001-fruitjs-2.0.md` — the RFC, for cross-cutting context.

The ROADMAP is "what's happening now"; the RFC is "why we're doing this." The RFC's Out-of-Scope section is binding — push back before drifting into it.

## Where things live

| Artifact | Path | Purpose |
|---|---|---|
| RFC | `docs/proposals/0001-fruitjs-2.0.md` | Strategic plan. Edit only when direction shifts. |
| Roadmap | `docs/ROADMAP.md` | Live status. Update when a phase moves. |
| Tactical doc | `docs/proposals/000N-phase-N-{name}.md` | Per-phase plan + task checklist. Created when the phase starts. |
| ADR | `docs/proposals/decisions/000N-{slug}.md` | One major decision per file. |

## When to write what

- **Tactical doc:** when a phase moves 🟦 → 🟨. Use the `start-phase` skill. Don't pre-write docs for inactive phases.
- **ADR:** for *major* decisions only — ones spanning multiple phases, changing the public surface, or that a future session might re-litigate. Use the `new-adr` skill. Minor choices stay in code and PR descriptions.
- **Roadmap:** update on every phase status change (🟦 → 🟨 → 🟩) and every new ADR.

## Phase discipline

- Don't touch code or files outside the active phase's scope without an ADR explaining why.
- Phases ship behind the `next` dist-tag; nothing lands on `latest` until signed off.

## Commit hygiene

- Stage files explicitly by name. Never `git add -A` or `git add .`.
- If `git status` shows binary or untracked files you didn't author, leave them.
- Match existing commit-message style: short imperative title, optional body explaining *why*.
- Develop on the branch specified for your task; never push to `main` directly.
