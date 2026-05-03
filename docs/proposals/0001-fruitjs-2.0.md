---
rfc: "0001"
title: "FruitJS 2.0 — Modernized Documentation Platform"
status: Proposed
created: 2026-05-03
---

# FruitJS 2.0 — Modernized Documentation Platform

## Context

FruitJS today (`v0.7.0`, last meaningful activity ~2015) is a Node 0.8-era markdown→HTML compiler. It depends on `marked@0.3.3`, `less@1.7`, `underscore@1.5`, `rsvp@2.0`, and `optimist@0.6` — every single one obsolete. It outputs a single hardcoded theme, has no syntax highlighting, no search, no API extraction, no versioning, and no awareness that AI agents now read docs alongside humans.

The world has moved on twice over:
1. **Static site generators have matured** — Docusaurus, VitePress, Nextra, Starlight, Mintlify are the bar.
2. **Agentic coding has changed what "documentation" means.** LLM-driven IDEs (Claude Code, Cursor) and autonomous agents now read docs to plan changes, write code, and answer questions. They need stable IDs, structured indexes, semantic chunks, embeddings, and MCP-style query surfaces — not just pretty HTML.

This proposal defines **FruitJS 2.0**: a major-version rewrite that keeps the brand and the spiritual goal ("make a codebase more useful by documenting it well") while replacing the entire substrate. It is positioned as a full doc platform — peer to Docusaurus/Mintlify on the human side, and ahead of the pack on the agent-native side.

FruitJS v1 is old enough that there is no realistic install base to protect. **v2 is a clean break** — no `manifest.json` compatibility shim, no migration codemod, no deprecation aisle. The v1 source is frozen in git history; v2 ships as a brand-new code surface under the same npm name with a major-version bump.

---

## Target Audience & Codebase Shape

FruitJS 2.0 is built for **open-source TypeScript / JavaScript libraries, SDKs, frameworks, and developer tools** — npm packages whose primary value is a programmatic API consumed by other developers and, increasingly, by AI agents writing integration code.

**Primary fit:**
- A library author publishing an SDK, framework, or CLI on npm (e.g., a Drizzle-, tRPC-, Hono-, Tanstack-shaped project).
- Internal platform teams documenting an SDK or developer tool used across an org.
- API/HTTP-client libraries where reference accuracy and type-checked snippets matter.

**Out of scope by design — and what to use instead:**
- **UI component libraries (Storybook's space).** FruitJS is *not* a Storybook competitor. Visual component workshops, controls/args, isolated render harnesses, and a11y addons are Storybook's job. FruitJS pairs *alongside* Storybook for component-library projects: FruitJS handles guides, API reference, design-token docs, and the agent surface; Storybook handles the visual workshop. An optional `<Playground>` in MDX exists for inline demos but is not a replacement for Storybook's stories.
- **Marketing/product sites.** Astro, Next.js, plain Vite are better fits. FruitJS optimizes for technical reference density, not landing-page composition.
- **End-user help centers.** Mintlify/Intercom-style "how do I reset my password" docs are not the target shape.

**Why this target specifically.** Every headline feature lines up with the API-library shape:
- API extraction from `.ts` source (`ts-morph`) — meaningful only when there's a typed public API.
- Twoslash type-checked code blocks — needs a real `tsconfig.json` to compile against.
- Doc-tests via Vitest — requires runnable code samples, i.e., a library you can `import`.
- Versioning with `since` / `deprecated` — semver-shaped releases.
- MCP server + `llms.txt` + embeddings — agents are most often asked "write code that uses *this library*", and that's exactly the surface FruitJS exposes.

A useful one-line pitch: **"FruitJS turns your library's source and markdown into a doc site, an API reference, a doc-test suite, and an MCP server — so humans and agents both have a fast path from your code to working integrations."**

---

## Audiences & Jobs

FruitJS 2.0 designs around three first-class consumers and three first-class authoring jobs.

| Consumer | What they need |
|---|---|
| **Humans (readers)** | Fast, searchable, dark-mode, mobile, runnable examples, accurate API ref |
| **AI agents** | `llms.txt`, structured `docs.json`, stable anchors, MCP query interface, embeddings |
| **CI / automation** | Verifiable doc-tests, type-checked snippets, broken-link checks, machine-readable diffs |

| Job | What it looks like |
|---|---|
| **Write** | MDX + components, frontmatter, file-based routing, AI-assisted summaries |
| **Maintain** | API ref auto-extracted from source, doc-tested code, versioning, lint/spell |
| **Consume** | Static site, search, MCP server, RAG-ready bundle, PDF/offline export |

---

## Proposed Stack

| Layer | Choice | Rationale |
|---|---|---|
| Language | TypeScript, ESM-first, Node 20+ | Type safety in core, plugins, and config |
| Markdown pipeline | `unified` + `remark` + `rehype` + MDX | Modern, plugin-rich replacement for `marked` |
| Code highlighting | Shiki + Twoslash | Native TS hover types in code samples |
| Templating | JSX components in MDX, statically rendered | Replaces underscore `<%= %>` templates |
| Bundler | Vite (theme assets, dev server) | Fast HMR, modern defaults |
| Styles | CSS modules + design-token CSS variables | Replaces `less@1.7` |
| Search | Pagefind | Zero-infra full-text, builds at compile time |
| Promises | Native `async`/`await` | Replaces `rsvp` |
| CLI args | `clipanion` or `cac` | Replaces `optimist` |
| Config | `fruit.config.ts` | Replaces `manifest.json` (no compat shim) |
| API extraction | TypeScript Compiler API + `ts-morph` + TSDoc | Real API ref, not hand-maintained |
| Doc-tests | Vitest in-band on tagged code blocks | Catches doc bit-rot |
| Repo layout | pnpm workspaces monorepo | Core / CLI / themes / plugins separated |

---

## Major Feature Areas

### 1. Authoring (write)
- **File-based routing.** Drop a `.md` / `.mdx` into `docs/` and it ships. No more enumerating every page in a manifest.
- **MDX with first-class components.** `<Tabs>`, `<CodeGroup>`, `<Callout>`, `<ApiRef name="..."/>`, `<Playground>`, `<Steps>`. Themed and overridable.
- **Frontmatter contract.** YAML frontmatter declares stable `id`, `summary`, `since`, `deprecated`, `agentVisibility: human | agent | both`, ordering, tags. The same frontmatter feeds both the human nav and the agent index.
- **Auto-summaries.** `fruitjs author --summarize` calls a configured LLM (BYO key) to draft one-line `summary:` frontmatter values for retrieval; humans approve via PR.
- **Lint + spell** via `vale` and `markdownlint`, opt-in.

### 2. Maintenance (keep current)
- **API reference extracted from source.** A `<ApiRef>` MDX component or a generated `api/` tree. Pulls signatures, TSDoc, examples, deprecations directly from `.ts`/`.tsx` via `ts-morph`. Reruns on build — no hand-syncing.
- **Type-checked code samples (Twoslash).** ` ```ts twoslash ` blocks are compiled against the project's real `tsconfig.json`. Hover-type popovers render in the site; type errors fail the build.
- **Doc-tests.** ` ```ts test ` blocks run via Vitest as part of `fruitjs check`. Stops the "examples drifted from the API" failure mode that plagues every old doc site.
- **Versioning.** `docs/v1/`, `docs/v2/`, `docs/next/`. Auto-generated "Added in 2.1", "Deprecated in 3.0" badges from frontmatter. Cross-version diffs.
- **Broken-link / dead-anchor checks** at build time.

### 3. Human consumption (read)
- **Default theme:** responsive, accessible (WCAG AA), light/dark, low-JS, prefers-reduced-motion aware. Built on CSS-variable design tokens; theme override via shadcn-style "copy the component into your repo".
- **Search:** Pagefind generates a static, on-device search index. No Algolia bill.
- **Live runnable examples** via WebContainers or StackBlitz embeds, gated by an MDX `<Playground>`.
- **Print/PDF export** (`fruitjs build --pdf`).
- **Static-first**, optional SSR.

### 4. Agent consumption — the new differentiator
This is the area where FruitJS 2.0 leapfrogs the incumbents.

- **`llms.txt` + `llms-full.txt`** emitted at site root, following the emerging convention. `llms.txt` is a curated, link-bearing index; `llms-full.txt` is the full corpus inlined.
- **`docs.json`** — a structured machine index of every page, heading, code symbol, signature, and example, keyed by stable IDs. Diffable across releases.
- **Stable anchors everywhere.** Every heading and every documented symbol gets a permalink derived from the frontmatter `id`, not from the (volatile) heading text.
- **`embeddings.bin`** — pre-computed vector index emitted alongside the build (configurable model). A self-hosted RAG bundle that an agent can load directly.
- **MCP server.** `fruitjs serve --mcp` exposes the docs as a Model Context Protocol server with tools like `search_docs`, `get_page`, `get_symbol`, `list_versions`, `diff_versions`. Claude Code, Cursor, and other MCP-aware tools plug in directly. This is the headline feature.
- **Per-page agent affordances.** Frontmatter `agentVisibility` flags hide marketing/landing pages from the agent index while keeping deep technical content visible. Tone differs: agents prefer terse, full-context pages; humans prefer progressive disclosure. The build can render two views from one source.
- **Stable provenance.** Every fragment in `docs.json` carries a content hash so agents can detect when guidance has changed.

### 5. Documenting MCP-shaped libraries (the new SDK shape)

A growing share of new libraries ship as MCP servers — sometimes alongside a traditional SDK, sometimes instead of one. A doc platform aimed at "make a library more useful" has to treat the MCP surface as first-class, the same way it treats functions, classes, and types. FruitJS 2.0 takes this stance:

- **`<McpRef>` MDX component.** The MCP analogue of `<ApiRef>`. Extracts tool / resource / prompt definitions from a library's MCP server module (input schema, output schema, description, examples) and renders them with the same fidelity as a function reference. Pulls from the same source of truth the live server uses, so docs can't drift.
- **`@fruitjs/plugin-mcp-introspect`.** Boots the documented MCP server in-process at build time, enumerates tools / resources / prompts, and emits structured entries into `docs.json`, `llms.txt`, and a new `mcp.json` artifact. `mcp.json` is a machine-readable description of the documented MCP surface — diffable across versions, consumable by agents that want a structural summary without the prose.
- **Federated `fruitjs serve --mcp`.** Optional config: when the documented library is itself an MCP server, the FruitJS MCP endpoint can relay (proxy) that server's tools alongside its own doc-query tools. An agent gets one connection that exposes both `search_docs(...)` and `the_library_tool(...)`, with doc context immediately available when calling the live tool. The "docs + live API" combined endpoint. Off by default, opt-in per project.
- **What we deliberately don't do.** FruitJS is not an MCP federation hub or registry. It does not discover, integrate, or proxy *unrelated* MCP servers — only the one being documented. Building a generic federation layer is out of scope; that's a different product.

### 6. Plugin API
- Typed plugin interface: `onContent`, `onPage`, `onBuild`, `onAgentIndex`, `onSchema`.
- Plugins are normal npm packages. First-party plugins under `@fruitjs/plugin-*`: `api-ref`, `twoslash`, `mermaid`, `playground`, `mcp-server`, `mcp-introspect`, `embeddings`, `pdf`, `versioning`.
- Themes are also packages, declared in config.

---

## New Setup (replaces `manifest.json`)

```ts
// fruit.config.ts
import { defineConfig } from '@fruitjs/core'
import apiRef from '@fruitjs/plugin-api-ref'
import mcp from '@fruitjs/plugin-mcp-server'
import embeddings from '@fruitjs/plugin-embeddings'

export default defineConfig({
  name: 'My Library',
  contentDir: 'docs',
  versions: { current: 'v2', archived: ['v1'] },
  theme: '@fruitjs/theme-default',
  agent: {
    llmsTxt: true,
    docsJson: true,
    embeddings: { model: 'text-embedding-3-small' },
    mcp: { enabled: true },
  },
  plugins: [
    apiRef({ entry: 'src/index.ts' }),
    mcp(),
    embeddings(),
  ],
})
```

No v1 compatibility. The old `manifest.json` format is gone. Existing v1 users (if any) start fresh with `fruitjs init`.

### CLI surface

| Command | Purpose |
|---|---|
| `fruitjs init` | Scaffold a new project |
| `fruitjs dev` | Hot-reload preview server |
| `fruitjs build` | Static site + `llms.txt` + `docs.json` + `embeddings.bin` |
| `fruitjs check` | Lint + doc-tests + twoslash + broken links |
| `fruitjs serve --mcp` | Run the MCP docs server |
| `fruitjs api` | Extract / refresh API reference |

---

## Proposed Repo Layout (v2)

```
fruitjs/
  packages/
    core/                # engine: pipeline, registry, types
    cli/                 # `fruitjs` binary
    themes/
      default/           # responsive, accessible, low-JS
    plugins/
      api-ref/
      twoslash/
      mermaid/
      playground/
      mcp-server/
      embeddings/
      pdf/
      versioning/
  examples/              # real projects using fruitjs
  apps/
    docs/                # FruitJS dogfooding its own docs
```

The v1 source is preserved only in git history; no `legacy/` directory ships in the v2 tree.

---

## Files in the Current Repo Affected by the Eventual Implementation

When implementation begins (separate task), these are the files this proposal supersedes:

- `src/Document.js`, `src/MarkedProcessor.js`, `src/Menu.js`, `src/Theme.js`, `src/File.js`, `src/Page.js`, `src/Utils.js` → replaced by TypeScript modules under `packages/core/src/`.
- `bin/cli` → replaced by `packages/cli/src/index.ts` using `clipanion`/`cac`.
- `fruit.js` (root export) → replaced by `packages/core/src/index.ts`.
- `themes/default/` (underscore templates + LESS) → replaced by `packages/themes/default/` (MDX components + CSS-variable tokens).
- `package.json` → split into per-package manifests under a pnpm workspace root.
- `docs/manifest.json` + `docs/*.md` → deleted. New dogfood docs are authored from scratch in `apps/docs/` against the v2 config and feature set.
- `test/` → replaced by Vitest suites colocated with each package. The v1 scenario manifests are not preserved; v2 test scenarios are written against the new pipeline.

---

## Suggested Implementation Phasing

1. **Phase 0 — Scaffold.** Delete v1 source from the working tree (preserve in git history). Set up pnpm workspace, TS, Vitest, Vite, ESLint.
2. **Phase 1 — Core engine.** unified/remark/rehype/MDX pipeline; file-based routing; default theme; new CLI (`init`, `dev`, `build`).
3. **Phase 2 — API ref + Twoslash + Shiki.** Real type-aware code blocks, generated API reference from `ts-morph`.
4. **Phase 3 — Search + versioning + lint.** Pagefind, version dirs, broken-link checks.
5. **Phase 4 — Agent surface.** `llms.txt`, `docs.json`, stable IDs, FruitJS's own MCP server, plus `mcp-introspect` for documenting MCP-shaped libraries (`<McpRef>`, `mcp.json`). *Headline release.*
6. **Phase 5 — Doc-tests + embeddings + playground + MCP federation.** Optional relay of the documented library's MCP tools through `fruitjs serve --mcp`.
7. **Phase 6 — Plugin API public.** Community plugins unblocked.

Each phase is independently shippable behind a `next` dist-tag.

---

## Multi-Session Capture & Continuity

A six-phase rewrite is well beyond one session. To make it resumable across many sessions (and possibly many authors / agents), work is captured in four places, each with a clear job:

1. **North-star RFC — this document, in the repo.** Lands as `docs/proposals/0001-fruitjs-2.0.md`. The canonical "what we're building and why". Strategic, not tactical. Edited only when high-level direction shifts.

2. **`docs/ROADMAP.md` — thin index, dogfooded.** Lists each phase, its state (`not started` / `in progress` / `done`), and links to its tactical design doc once one exists. Living in `docs/` means it gets pulled into the dogfooded site once Phase 1 ships — visitors and agents both see it. That's intentional: the roadmap is part of the product surface.

3. **Per-phase tactical docs — created lazily.** When a phase actually starts, write `docs/proposals/000N-phase-N-{name}.md` covering file-level changes, package boundaries, and acceptance criteria *for that phase*. The tactical doc is also where the in-flight task checklist for that phase lives. Don't pre-write all six tactical docs — they'll drift before they're needed.

4. **ADR log — `docs/proposals/decisions/`.** Every cross-phase decision (e.g. "unified over markdown-it", "federate the documented MCP server but not arbitrary MCP servers", "no v1 compat shim") gets a short ADR. New sessions read the ADR log to avoid re-litigating settled choices.

### Session start ritual
A new session picks up by reading, in order: `docs/ROADMAP.md` → the active phase's tactical design doc (if one exists) → ADRs touching the area being worked on → the RFC for any cross-cutting context. With this ritual the RFC stays the strategic anchor while individual sessions stay focused on tactical work — nobody has to re-derive the architecture from scratch.

### v0 deliverable from this proposal
The first commit out of *this* planning work touches only:

- `docs/proposals/0001-fruitjs-2.0.md` — this document, copied verbatim from the plan file.
- `docs/ROADMAP.md` — initial scaffold listing the seven phases, all marked "not started".
- `docs/proposals/decisions/0001-clean-break-from-v1.md` — first ADR; captures the no-compat-shim decision.

No code changes, no `package.json` edits, no v1 deletions yet. The pre-existing `.gitattributes`/PNG corruption is *not* part of this commit; it gets fixed in its own change. Implementation work begins as Phase 0 in a follow-up session.

---

## Verification

This proposal is a design document, not yet code. When implemented, end-to-end verification is:

1. `pnpm -r build && pnpm -r test` — every package builds and unit-tests green.
2. `cd apps/docs && fruitjs build` — FruitJS dogfoods its own docs; output includes `index.html`, `llms.txt`, `llms-full.txt`, `docs.json`, `embeddings.bin`, search index.
3. `fruitjs check` — every in-repo code sample passes Twoslash type-check and tagged doc-tests pass under Vitest.
4. `fruitjs serve --mcp` — connect from Claude Code (`claude mcp add fruitjs ...`); confirm `search_docs`, `get_page`, `get_symbol` tools return correct content.
5. Lighthouse on the default theme: ≥95 across performance, a11y, best-practices, SEO.
6. Compare `docs.json` between two builds with a content change → diff is minimal and stable (verifies stable-ID design).
7. Pair-with-Storybook smoke test: take a real component-library project (e.g. a small shadcn-style repo), run Storybook for the visual workshop and FruitJS for the narrative + API + agent surface, and confirm the two coexist without conflict.
8. MCP-shaped-library smoke test: point FruitJS at a small library that ships an MCP server (one tool, one resource, one prompt). Confirm `<McpRef>` renders the surface, `mcp.json` is emitted with the right schemas, and (with federation enabled) `fruitjs serve --mcp` exposes both `search_docs` and the library's tool through the same endpoint.

---

## Out of Scope (deliberate)

- Hosted SaaS tier. v2 is OSS-first; a hosted offering is a follow-up.
- AI-authored content ungated by humans. The platform *assists* authoring (summaries, draft suggestions) but never auto-publishes generated prose.
- Non-JS ecosystems. Python/Rust/Go API extraction is plugin territory, not core.
