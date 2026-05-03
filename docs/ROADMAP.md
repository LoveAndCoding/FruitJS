---
title: FruitJS 2.0 Roadmap
summary: Phase-by-phase status index for the v1→v2 rewrite. Updated as phases progress.
---

# FruitJS 2.0 Roadmap

This is the live status index for the FruitJS 2.0 rewrite. The strategic "what and why" lives in the [RFC](./proposals/0001-fruitjs-2.0.md); this file tracks **where each phase stands** and links to its tactical artifacts.

> **Session start ritual:** read this file, then the active phase's epic issue, then that phase's tactical design doc (if one exists), then any [ADRs](./proposals/decisions/) touching the area you're working on.

## Status legend

| Symbol | Meaning |
|---|---|
| 🟦 | not started |
| 🟨 | in progress |
| 🟩 | done |
| ⬛ | blocked |

## Phases

| Phase | Status | Summary | Epic | Tactical doc |
|---|---|---|---|---|
| **0 — Scaffold** | 🟦 | Delete v1 source from the working tree (preserved in git history). pnpm workspace, TS, Vitest, Vite, ESLint. | _epic TBD_ | _written when phase starts_ |
| **1 — Core engine** | 🟦 | unified/remark/rehype/MDX pipeline; file-based routing; default theme; new CLI (`init`, `dev`, `build`). | _epic TBD_ | _written when phase starts_ |
| **2 — API ref + Twoslash + Shiki** | 🟦 | Type-aware code blocks, generated API reference from `ts-morph`. | _epic TBD_ | _written when phase starts_ |
| **3 — Search + versioning + lint** | 🟦 | Pagefind, version dirs, broken-link checks. | _epic TBD_ | _written when phase starts_ |
| **4 — Agent surface** | 🟦 | `llms.txt`, `docs.json`, stable IDs, FruitJS's own MCP server, plus `mcp-introspect` for documenting MCP-shaped libraries. *Headline release.* | _epic TBD_ | _written when phase starts_ |
| **5 — Doc-tests + embeddings + playground + MCP federation** | 🟦 | Vitest doc-tests, embeddings emission, `<Playground>`, optional relay of the documented library's MCP tools through `fruitjs serve --mcp`. | _epic TBD_ | _written when phase starts_ |
| **6 — Plugin API public** | 🟦 | Stable plugin contract published; community plugins unblocked. | _epic TBD_ | _written when phase starts_ |

Each phase is independently shippable behind a `next` dist-tag.

## Decisions

Cross-phase decisions live in [`docs/proposals/decisions/`](./proposals/decisions/) as ADRs. New sessions should skim this list before re-litigating settled choices.

| ADR | Title |
|---|---|
| [0001](./proposals/decisions/0001-clean-break-from-v1.md) | Clean break from v1 — no compatibility shim |

## How to update this file

- When a phase moves to `in progress`, change its 🟦 to 🟨 and add a link to the tactical design doc.
- When a phase ships, change its 🟨 to 🟩.
- When an epic issue is opened on GitHub, replace `_epic TBD_` with the issue link (`#NN`).
- When a new ADR lands, append a row to the Decisions table.
