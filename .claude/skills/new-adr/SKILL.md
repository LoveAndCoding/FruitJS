---
name: new-adr
description: Scaffold a new Architecture Decision Record under docs/proposals/decisions/. Use only for *major* decisions — ones spanning multiple phases, changing the public surface, or that a future session might re-litigate. Skip for minor implementation choices; those belong in code and PR descriptions.
---

# New ADR

## When this skill applies

Write an ADR when at least one is true:
- The decision affects more than one phase.
- It changes the public surface (CLI, config, plugin API, MDX components, agent surface).
- It rules out an alternative future maintainers might otherwise pick up.
- A future session would otherwise have to re-derive or re-litigate the choice.

If none apply, the decision is too small for an ADR. Capture it in the relevant tactical doc or PR description.

## Steps

1. List `docs/proposals/decisions/` to find the next 4-digit number.
2. Create `docs/proposals/decisions/000N-{slug}.md` with this scaffold:

   ```markdown
   ---
   adr: "000N"
   title: "<short title>"
   status: Proposed
   created: <YYYY-MM-DD>
   ---

   # ADR 000N: <title>

   ## Status
   Proposed (<YYYY-MM-DD>)

   ## Context
   <Forces and problem that prompted this.>

   ## Decision
   <The choice, stated plainly.>

   ## Consequences
   **Positive:** …
   **Negative / accepted:** …

   ## Alternatives considered
   1. **<Alternative>.** Rejected because …

   ## References
   - <RFC section, related ADRs, tactical doc.>
   ```

3. Append a row to the Decisions table in `docs/ROADMAP.md`.
4. Once settled, flip `status: Proposed` → `status: Accepted` and update the in-document Status date.

## What not to do

- Don't open ADRs for things like "use `pnpm test` not `npm test`" or "rename a variable."
- Don't edit accepted ADRs to reverse them. Write a new ADR that supersedes the old one; add a `Superseded by` reference to the original.
