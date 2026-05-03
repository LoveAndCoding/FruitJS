---
adr: "0001"
title: "Clean break from v1 — no compatibility shim"
status: Accepted
created: 2026-05-03
related_rfc: ../0001-fruitjs-2.0.md
---

# ADR 0001: Clean break from v1 — no compatibility shim

## Status

Accepted (2026-05-03)

## Context

FruitJS v1 last had meaningful activity around 2015. It targets Node 0.8, depends entirely on packages that are now end-of-life (`marked@0.3.3`, `less@1.7`, `underscore@1.5`, `rsvp@2.0`, `optimist@0.6`), uses a `manifest.json` configuration format, and ships a single hardcoded theme rendered with underscore templates.

[RFC 0001](../0001-fruitjs-2.0.md) proposes a v2 rewrite on a wholly different substrate: TypeScript / ESM, `unified`+`remark`+`rehype`+MDX, Vite, pnpm workspaces, `fruit.config.ts`, and a feature surface (API extraction, Twoslash, doc-tests, MCP server, embeddings, agent indexes) with no analogue in v1.

The question this ADR settles: should v2 preserve any backward compatibility with v1 — config-format shim, migration codemod, deprecation aisle, or `legacy/` package?

## Decision

**No.** v2 is a clean break:

- The v1 `manifest.json` format is not read by v2. No shim, no auto-migration.
- No codemod is shipped to convert v1 sites to v2.
- No `legacy/` directory is included in the v2 source tree. v1 source survives only in git history (the pre-v2 tags / commits remain immutable).
- v2 is published under the same npm name (`fruitjs`) with a major-version bump. Existing v1 users — to the extent any exist — pin to the v1 line or run `fruitjs init` against v2 from scratch.
- v1 dogfood docs under `docs/manifest.json` and `docs/*.md` are deleted as part of Phase 0; a new dogfood doc set is authored from scratch in `apps/docs/` against v2's feature surface.

## Consequences

**Positive:**
- The v2 codebase carries zero historical baggage. Every design choice is made for the world v2 ships into, not for compatibility with a 2015 API surface.
- No engineering effort spent on a shim that would in practice be used by ~zero users.
- The v2 feature set (MDX, file-based routing, frontmatter contract, agent indexes) is sufficiently different from v1's that any "compatibility" would be cosmetic and misleading.
- Smaller, cleaner first release; faster path to Phase 4 (the headline agent-surface release).

**Negative / accepted:**
- Any v1 user who upgrades will need to re-author their site. Acceptable: realistic install base is ~zero, and the rewrite is severe enough that incremental upgrade was never going to be smooth.
- We give up the marketing line of "drop-in upgrade." Acceptable: v2's pitch is the new feature set, not continuity.

## Alternatives considered

1. **Ship a `manifest.json` reader that translates to `fruit.config.ts` on the fly.** Rejected: shim code outweighs the benefit; the configuration *shapes* are different enough that round-tripping is lossy.
2. **Provide a `fruitjs migrate` codemod.** Rejected for v0; could be added later if real users surface. Not worth blocking the rewrite on.
3. **Maintain v1 in a `legacy/` directory inside the v2 monorepo.** Rejected: pollutes the new tree and creates a perpetual maintenance tax. Git history is sufficient preservation.

## References

- [RFC 0001 — FruitJS 2.0](../0001-fruitjs-2.0.md), §"Context" and §"Files in the Current Repo Affected by the Eventual Implementation".
