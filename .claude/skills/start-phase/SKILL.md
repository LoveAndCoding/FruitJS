---
name: start-phase
description: Transition a roadmap phase from 🟦 not-started to 🟨 in-progress by scaffolding its tactical design doc and updating docs/ROADMAP.md. Use only when work on a phase actually begins.
---

# Start phase

## Steps

1. Read `docs/ROADMAP.md`; confirm the phase is currently 🟦.
2. Read the matching phase bullet in `docs/proposals/0001-fruitjs-2.0.md` under "Suggested Implementation Phasing" so the tactical doc inherits the right scope.
3. Create `docs/proposals/000N-phase-N-{name}.md` with this scaffold:

   ```markdown
   ---
   tactical_doc: "000N"
   phase: N
   title: "Phase N — <name>"
   status: In progress
   created: <YYYY-MM-DD>
   related_rfc: ./0001-fruitjs-2.0.md
   ---

   # Phase N — <name>

   ## Scope
   <What this phase delivers. Be specific about packages and files.>

   ## Out of scope for this phase
   <What is *not* in this phase, especially anything in adjacent phases.>

   ## Acceptance criteria
   - [ ] <Falsifiable checks; all must pass before the phase ships.>

   ## Task checklist
   - [ ] <Granular tasks; add and check off as work proceeds.>

   ## Open questions
   <Resolve in-phase. Promote to an ADR if a question turns out to be major.>

   ## References
   - [RFC 0001](./0001-fruitjs-2.0.md) §"Suggested Implementation Phasing"
   - <Relevant ADRs.>
   ```

4. Update `docs/ROADMAP.md`:
   - Phase status: 🟦 → 🟨.
   - Replace `_written when phase starts_` with a link to the new tactical doc.

5. When the phase ships, flip status to 🟩 in both files and check off remaining acceptance criteria.

## What not to do

- Don't scaffold tactical docs for phases that aren't being worked on now.
- Don't copy the RFC phase description into the tactical doc — link to it. Tactical = *how*; RFC = *what and why*.
- Don't skip the Acceptance Criteria section; it's how the phase is declared done.
