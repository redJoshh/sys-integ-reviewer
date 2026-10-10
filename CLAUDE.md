# CLAUDE.md — Reviewer Site Generator

This repository turns folders of Markdown study notes into a static reviewer website, deployed on Netlify. It is reused across many subjects. Every instruction here applies to every subject unless a subject's own `_subject.json` overrides it.

Read this whole file before writing any code. When a rule conflicts with a default habit of yours, the rule wins.

---

## 1. What we are building

A static site with three layers:

1. **Dashboard** (`/index.html`): the root page. It lists every subject and shows what is inside each one.
2. **Subject hub** (`/<subject>/index.html`): one per subject. It lists that subject's topics in study order.
3. **Topic page** (`/<subject>/<topic>/index.html`): one per Markdown file. This is where the actual reviewer content lives.

The site is a study tool first and a portfolio piece second. A student should be able to open it the night before an exam and find what they need within seconds.

---

## 2. Hard requirements (never break these)

1. **Each topic gets its own folder containing its own `index.html`.** No `topic.html` files, no single-page app routing, no hash routing. URLs are clean folder paths such as `/laravel/eloquent-orm/`.
2. **The root `index.html` is the dashboard for all subjects.** It is generated from the content folder, never hand-maintained.
3. **All content comes from the Markdown source folder.** Nothing is typed into HTML by hand. If the content changes, only the `.md` files change, and a rebuild updates the site.
4. **The design must not be generic.** See section 7. This is a requirement, not a preference.
5. **The output must deploy on Netlify with zero manual steps** beyond connecting the repo (or dragging `dist/` in).
6. **The build must fail loudly** on structural problems (section 5.5). A silently broken reviewer is worse than no reviewer.

---

## 3. Repository layout

```
/
├── CLAUDE.md
├── netlify.toml
├── package.json
├── build.mjs                  # the generator; the only build entry point
├── content-md-files/                   # SOURCE OF TRUTH: all Markdown lives here
│   ├── <subject-slug>/
│   │   ├── _subject.json      # optional: title, description, design direction, accent
│   │   ├── 01-first-topic.md
│   │   ├── 02-second-topic.md
│   │   └── assets/            # images used by this subject's notes
│   └── <another-subject>/
├── src/
│   ├── templates/             # dashboard, subject hub, topic page templates
│   ├── styles/                # base styles + per-subject theme layers
│   └── scripts/               # small vanilla JS (search, progress, nav)
└── dist/                      # GENERATED. Never edit by hand. Git-ignored.
```

Rules:

- `content-md-files/` is the only place study material lives. If the user gives you notes elsewhere, move or point the build at `content-md-files/`; do not duplicate them.
- `dist/` is always a pure build output. It must be safe to delete and regenerate at any time.
- The folder name is the subject slug, normalized by lowercasing and replacing spaces/special characters with hyphens (`PE1` becomes `/pe1/`). The folder name itself stays as the display fallback title when there is no `_subject.json` (so `PE1` still displays as "PE1"). The file name (minus the numeric prefix and extension) is the topic slug.

### Output mapping

| Source                                        | Output                                  |
| --------------------------------------------- | --------------------------------------- |
| (all of `content-md-files/`)                  | `dist/index.html` (dashboard)           |
| `content-md-files/laravel/`                   | `dist/laravel/index.html` (subject hub) |
| `content-md-files/laravel/02-eloquent-orm.md` | `dist/laravel/eloquent-orm/index.html`  |
| `content-md-files/laravel/assets/erd.png`     | `dist/laravel/assets/erd.png`           |

Links between pages are root-absolute and end with a trailing slash (`/laravel/eloquent-orm/`). Netlify serves these correctly. For local preview use `npx serve dist` (not `file://`, which breaks root-absolute paths).

---

## 4. Netlify configuration

`netlify.toml` must contain at least:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

Also:

- Add a custom `404.html` (generated, themed like the dashboard, with a link back to it and a list of subjects).
- `package.json` scripts: `build` (runs `node build.mjs`), `dev` (build, then serve `dist` and rebuild on change in `content-md-files/` and `src/`).
- Keep dependencies minimal: a Markdown parser (`marked` or `markdown-it`), a frontmatter parser (`gray-matter`), and a syntax highlighter that runs at build time (`shiki` or `highlight.js`). No client-side framework. No bundler unless a real need appears.
- Do not rely on any runtime server, serverless function, or database. Everything is static.

---

## 5. Extracting content from the Markdown folder

### 5.1 Discovery

- Recursively walk `content-md-files/`. Every top-level folder that contains at least one `.md` file is a subject.
- Ignore files and folders starting with `_` or `.` (except `_subject.json`), and ignore `README.md`/`readme.md` (case-insensitive). Only `content-md-files/` is scanned: `CLAUDE.md` and `readme.md` at the repo root are project docs, never content.
- Sort topics by numeric filename prefix (`01-`, `02-`), then by frontmatter `order`, then alphabetically. Strip the prefix from the slug.
- Nested folders inside a subject are **categories**. A file at `content-md-files/laravel/database/01-migrations.md` becomes `dist/laravel/database/migrations/index.html`, and the subject hub groups topics under the `database` category heading. Support one level of nesting; fail clearly if there is more.

### 5.2 Frontmatter

Optional but supported. The build must work when it is missing.

```yaml
---
title: Eloquent ORM
summary: Models, relationships, query scopes, mass assignment.
order: 2
tags: [models, relationships]
exam_weight: high # optional: low | medium | high
updated: 2026-10-04
---
```

Fallbacks when fields are missing:

- `title`: the first `# H1` in the file, then the humanized file name.
- `summary`: the first paragraph of the file, trimmed to about 160 characters.
- `order`: filename prefix, then alphabetical.

### 5.3 Markdown features to support

- GitHub-flavored Markdown: tables, task lists, strikethrough, autolinks, fenced code blocks with language tags.
- Build-time syntax highlighting with a copy button on code blocks.
- Heading anchors (stable slugs) and an auto-generated table of contents from H2 and H3.
- Callouts using blockquote syntax: `> [!tip]`, `> [!warning]`, `> [!exam]`, `> [!remember]`. Each type needs its own visual treatment, not just a different color.
- Collapsible self-test blocks, because this is a reviewer: a `<details>` element, or a `Q:` / `A:` pair syntax, that hides the answer until clicked.
- Math via KaTeX at build time, only if a subject's notes contain `$...$` or `$$...$$`.
- Images with relative paths (`./assets/x.png`) must resolve and be copied. Add `loading="lazy"` and require alt text (warn if missing).
- Obsidian-style `[[wikilinks]]` resolve to topic pages if present; otherwise warn.

### 5.4 Cross-linking and navigation data

During the build, assemble one in-memory model: subjects → categories → topics, each with title, summary, slug, headings, word count, and estimated reading time. Every template renders from this model. Also emit `dist/search-index.json` (title, headings, and plain-text excerpts per topic) so client-side search works with no backend.

### 5.5 Build failures and warnings

**Fail the build (non-zero exit) when:**

- Two topics in the same subject produce the same slug.
- Two subject folders produce the same slug after normalization.
- Frontmatter YAML is invalid (name the file and line).
- A topic has no content after the frontmatter.
- Nesting is deeper than one category level.

**Warn (build continues) when:**

- A relative image or internal link does not resolve.
- An image has no alt text.
- A wikilink has no target.
- A topic is longer than about 6,000 words (suggest splitting it).

Print a short, readable summary at the end of every build: subjects, topics, pages generated, warnings.

---

## 6. Page requirements

### Dashboard (`/`)

- Shows every subject with its title, description, topic count, and total estimated reading time.
- Shows study progress per subject if the student has any (stored in `localStorage`; see 6.4).
- Has global search across all subjects.
- Gives a clear "continue where you left off" entry when progress exists.
- Is built from scratch for this project's identity. It is not a grid of identical cards.

### Subject hub (`/<subject>/`)

- Lists topics in study order, grouped by category when categories exist.
- Shows summary, reading time, and `exam_weight` where provided.
- Shows progress through the subject.

### Topic page (`/<subject>/<topic>/`)

- Readable measure: body text lines under about 75 characters.
- Sticky or otherwise persistent table of contents on wide screens; a collapsed one on mobile.
- Previous and next topic links at the bottom, plus a way back to the subject hub and the dashboard from anywhere.
- A "mark as reviewed" control that saves to `localStorage`.
- A print stylesheet that produces a clean, ink-friendly study sheet (no navigation, no backgrounds, code blocks still readable).

### 6.4 Behavior and performance

- Vanilla JS only, loaded with `defer`, and every page must remain readable with JavaScript disabled (progress, search, and copy buttons are enhancements).
- Each page ships only the CSS and JS it needs. No external CDN dependencies for core function; self-host fonts.
- Each page has a unique `<title>`, meta description (from `summary`), canonical URL, and Open Graph tags.

---

## 7. Design: must not be generic

Treat every build like a design studio brief from a client who has already rejected templated work. Distinctive means the choices come from the **subject matter**, not from a style you reach for by habit.

### 7.1 Design process (do this before writing any CSS)

1. **Identify the subject and audience.** For the dashboard: a student with several subjects and limited time. For each subject: what is its world? A networking subject, a nursing subject, and a law subject should not look related beyond shared structure.
2. **Write a short design plan** and keep it in the response before coding:
   - **Color:** 4 to 6 named hex values.
   - **Type:** typefaces and their roles. One family or two; if two, make them clearly different.
   - **Layout:** one-sentence concept plus a quick ASCII wireframe. State alignment.
   - **Principles:** what makes this design unmistakably this one.
3. **Review the plan against the brief.** If any part is what you would produce for any similar page, revise it and say what you changed.
4. **Then build.** Afterward, critique the result (screenshots if your environment supports them) and remove one decorative element.

### 7.2 Per-subject identity

The shared build system supplies structure; each subject supplies its own look.

- A subject may define its direction in `content-md-files/<subject>/_subject.json`:

```json
{
  "title": "Laravel Backend",
  "description": "Migrations, Eloquent, and the request lifecycle.",
  "design": {
    "mood": "short phrase describing the visual world",
    "palette": ["#hex", "#hex", "#hex", "#hex"],
    "fonts": { "display": "Family A", "body": "Family B" }
  }
}
```

- If `design` is missing, derive a direction from the subject's content and name, write it into the design plan, and propose saving it to `_subject.json` so the identity stays stable between builds.
- Implement themes with CSS custom properties on a `[data-subject="..."]` scope so subjects change color, type, and texture without forking the templates.
- Two subjects open side by side should be recognizable as different subjects at a glance, while navigation behaves the same everywhere.

### 7.3 Avoid these defaults

These are the common signs of a generated page. Use them only when the brief explicitly asks.

- Warm cream background with a high-contrast serif and a terracotta accent.
- Near-black background with one acid-green or vermilion accent.
- Newspaper layout with hairline rules and zero border radius.
- The "SaaS card kit": identical rounded cards, one radius everywhere, the same soft grey shadow, gradient washes as decoration.
- A tracked-out ALL-CAPS eyebrow above every heading.
- Meta strings joined with middle dots (`A · B · C`), labels like `WORD — fragment`, and arrows appended to every link.
- Numbered markers (`01 / 02 / 03`) on content that is not a real sequence. (Study-order numbering of topics is a real sequence and is fine.)
- Accenting one word in a headline with italic or a different color.
- Monospace for every small label.
- Fade-and-slide-up on every section, and hover transitions on every card.
- Emoji as icons.

### 7.4 Typography and layout

- Choose typefaces deliberately for the subject, not your usual defaults. Set a clear type scale with deliberate weights and spacing.
- Serif body text gets slightly more line height than sans-serif.
- Vary the layout between the three page types. The dashboard, hub, and topic page serve different jobs and should look like it.
- Use structure (borders, dividers, labels) only when it encodes real information about the content.
- Spend boldness in one place per page: one memorable element, everything else quiet and disciplined.

### 7.5 Motion

- At most one orchestrated page-load moment per page, and only if it helps orientation.
- Motion that responds to a person's action (expanding a self-test, opening the TOC, marking reviewed) is welcome.
- Respect `prefers-reduced-motion`.

### 7.6 Quality floor (always, without announcing it)

- Responsive from 360px wide up.
- Visible keyboard focus on every interactive element.
- Text contrast of at least WCAG AA, including inside code blocks and callouts.
- Semantic HTML: one `<h1>` per page, landmarks (`header`, `nav`, `main`), skip link.
- Light and dark modes that are designed, not auto-inverted. If only one is feasible, ship one excellent mode.

---

## 8. Copy and microcopy

- Write from the student's point of view. Name things by what students understand: "Review topics," not "Content index."
- Sentence case. Active voice. Buttons say exactly what happens: "Mark as reviewed," and the confirmation says "Reviewed."
- Keep one name for each action across the whole site.
- Empty and error states say what happened and what to do next. They do not apologize.
- Do not invent study content. Structure and microcopy are yours to write; subject matter comes only from the `.md` files.

---

## 9. Working agreement

**When asked to add a subject:** create `content-md-files/<slug>/`, add notes, optionally add `_subject.json`, run `npm run build`. Do not touch templates unless the subject needs a new content pattern.

**When asked to change design:** edit `src/styles/` and `src/templates/`. Never edit `dist/`.

**When content looks wrong on the site:** fix the Markdown or the parser. Do not patch generated HTML.

**When a rule here seems to conflict with a request:** say so in one sentence, follow the request if the user confirms, and suggest updating this file so the decision sticks.

**Before reporting a task done, verify:**

- [ ] `npm run build` exits cleanly and prints a summary.
- [ ] `dist/index.html` exists and links to every subject.
- [ ] Every topic has `dist/<subject>/<topic>/index.html`.
- [ ] No broken internal links or missing images (check the warnings list).
- [ ] The design plan was written and reviewed before coding.
- [ ] None of the default traits in 7.3 slipped in unnoticed.
- [ ] Pages work with JavaScript disabled and are readable at 360px wide.
- [ ] `netlify.toml` still points at `npm run build` and `dist`.

Report back in a few sentences: what was built, any assumptions made, and what you left out.
