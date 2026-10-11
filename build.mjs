// Reviewer site generator: content-md-files/ -> dist/
// Run with `npm run build`. See CLAUDE.md for the rules this file enforces.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import { createHighlighter, createCssVariablesTheme, bundledLanguages } from 'shiki';
import { esc, htmlToText, slugify } from './src/templates/layout.mjs';
import { renderDashboard, renderNotFound } from './src/templates/dashboard.mjs';
import { renderHub } from './src/templates/hub.mjs';
import { renderTopic } from './src/templates/topic.mjs';

const started = Date.now();
const ROOT = path.dirname(fileURLToPath(import.meta.url));
const CONTENT = path.join(ROOT, 'content-md-files');
const DIST = path.join(ROOT, 'dist');
const SRC = path.join(ROOT, 'src');
const require = createRequire(import.meta.url);

const SITE = {
  name: 'Reviewer',
  url: (process.env.URL || process.env.SITE_URL || 'http://localhost:3000').replace(/\/$/, ''),
  builtOn: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
  fonts: { display: 'Bricolage Grotesque', body: 'Atkinson Hyperlegible' },
};
const WORDS_PER_MINUTE = 200;
const LONG_TOPIC_WORDS = 6000;
const SUMMARY_LENGTH = 160;

// Self-hosted fonts available to subjects. Add a family here (and install its
// @fontsource package) before naming it in a _subject.json.
const FONT_SOURCES = {
  'Atkinson Hyperlegible': { pkg: 'atkinson-hyperlegible', faces: [[400, 'normal'], [400, 'italic'], [700, 'normal']], fallback: 'system-ui, sans-serif' },
  'Barlow Condensed': { pkg: 'barlow-condensed', faces: [[500, 'normal'], [700, 'normal']], fallback: "'Arial Narrow', system-ui, sans-serif" },
  'Bricolage Grotesque': { pkg: 'bricolage-grotesque', faces: [[500, 'normal'], [800, 'normal']], fallback: 'system-ui, sans-serif' },
  'DotGothic16': { pkg: 'dotgothic16', faces: [[400, 'normal']], fallback: "Consolas, 'Courier New', monospace" },
  'Kalam': { pkg: 'kalam', faces: [[700, 'normal']], fallback: "'Segoe Print', 'Comic Sans MS', cursive" },
  'Red Hat Display': { pkg: 'red-hat-display', faces: [[700, 'normal'], [900, 'normal']], fallback: 'system-ui, sans-serif' },
  'Zilla Slab': { pkg: 'zilla-slab', faces: [[600, 'normal'], [700, 'normal']], fallback: 'Rockwell, Georgia, serif' },
  'JetBrains Mono': { pkg: 'jetbrains-mono', faces: [[400, 'normal'], [700, 'normal']], fallback: 'ui-monospace, Consolas, monospace' },
};
const CODE_FONT = 'JetBrains Mono';

const errors = [];
const warnings = [];
const fail = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);
const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');

// ---------------------------------------------------------------------------
// 1. Discovery
// ---------------------------------------------------------------------------

const isIgnored = (name) => name.startsWith('_') || name.startsWith('.') || /^readme\.md$/i.test(name);
const PREFIX = /^(\d+)[-_. ]+/;
const splitPrefix = (name) => {
  const m = name.match(PREFIX);
  return m ? { num: Number(m[1]), rest: name.slice(m[0].length) } : { num: null, rest: name };
};
const humanize = (s) => {
  // Hyphens between digits stay ("DevNet1-3"); other hyphens become spaces.
  const t = s.replace(/_+|(?<!\d)-+|-+(?!\d)/g, ' ').replace(/\s+/g, ' ').trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
};

function discover() {
  if (!fs.existsSync(CONTENT)) {
    fail(`No ${rel(CONTENT)}/ folder. Create ${rel(CONTENT)}/<subject>/ and add Markdown notes to it.`);
    return [];
  }
  const subjects = [];
  const subjectSlugs = new Map();

  for (const entry of fs.readdirSync(CONTENT, { withFileTypes: true })) {
    if (isIgnored(entry.name)) continue;
    const full = path.join(CONTENT, entry.name);
    if (entry.isFile()) {
      if (entry.name.toLowerCase().endsWith('.md')) {
        warn(`${rel(full)} is not inside a subject folder, so it was skipped. Move it to ${rel(CONTENT)}/<subject>/.`);
      }
      continue;
    }
    if (!entry.isDirectory()) continue;

    const files = collectMarkdown(full);
    if (!files.length) continue;

    const slug = slugify(entry.name);
    if (!slug) {
      fail(`${rel(full)}: the folder name has no letters or digits, so it cannot become a URL. Rename it, e.g. "subject-1".`);
      continue;
    }
    if (subjectSlugs.has(slug)) {
      fail(`${rel(full)} and ${rel(subjectSlugs.get(slug))} both become /${slug}/. Rename one of the folders.`);
      continue;
    }
    subjectSlugs.set(slug, full);

    let meta = {};
    const metaPath = path.join(full, '_subject.json');
    if (fs.existsSync(metaPath)) {
      try {
        meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
      } catch (e) {
        fail(`${rel(metaPath)} is not valid JSON: ${e.message}`);
      }
    }

    const subject = {
      folder: entry.name,
      dir: full,
      slug,
      url: `/${slug}/`,
      title: meta.title || entry.name,
      description: meta.description || '',
      design: meta.design || null,
      accent: meta.accent || meta.design?.palette?.[2] || null,
      categories: new Map(),
      topics: [],
    };

    for (const { file, categoryDir } of files) {
      let category = null;
      if (categoryDir) {
        const folder = path.basename(categoryDir);
        const { num, rest } = splitPrefix(folder);
        if (!subject.categories.has(categoryDir)) {
          subject.categories.set(categoryDir, { dir: categoryDir, slug: slugify(rest), title: humanize(rest), num, topics: [] });
        }
        category = subject.categories.get(categoryDir);
      }
      const topic = readTopic(file, subject, category);
      if (topic) subject.topics.push(topic);
    }

    const seen = new Map();
    for (const t of subject.topics) {
      if (seen.has(t.slug)) {
        fail(`${rel(t.file)} and ${rel(seen.get(t.slug).file)} both produce the slug "${t.slug}" in ${subject.slug}. Rename one of the files.`);
      } else seen.set(t.slug, t);
    }
    subjects.push(subject);
  }
  return subjects.sort((a, b) => a.title.localeCompare(b.title));
}

function collectMarkdown(subjectDir) {
  const out = [];
  (function walk(dir, depth) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (isIgnored(e.name)) continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name.toLowerCase() === 'assets') continue;
        walk(p, depth + 1);
      } else if (e.isFile() && e.name.toLowerCase().endsWith('.md')) {
        if (depth > 1) {
          const category = path.relative(subjectDir, p).split(path.sep)[0];
          fail(`${rel(p)} is nested ${depth} folders deep. Subjects support one category level; move it to ${rel(path.join(subjectDir, category, e.name))}.`);
        } else {
          out.push({ file: p, categoryDir: depth === 1 ? dir : null });
        }
      }
    }
  })(subjectDir, 0);
  return out;
}

function readTopic(file, subject, category) {
  const raw = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
  let parsed;
  try {
    parsed = matter(raw);
  } catch (e) {
    const line = e.mark && typeof e.mark.line === 'number' ? e.mark.line + 2 : '?';
    fail(`${rel(file)}: frontmatter YAML is invalid at line ${line}: ${e.reason || e.message}`);
    return null;
  }
  const body = parsed.content;
  if (!body.trim()) {
    fail(`${rel(file)} has no content after the frontmatter. Add notes to it or delete the file.`);
    return null;
  }
  const { num, rest } = splitPrefix(path.basename(file, path.extname(file)));
  const slug = slugify(rest);
  if (!slug) {
    fail(`${rel(file)}: the file name has no letters or digits, so it cannot become a URL. Rename it, e.g. "01-introduction.md".`);
    return null;
  }
  const fm = parsed.data || {};
  const h1s = scanH1s(body);
  const firstLine = body.split(/\r?\n/).find((l) => l.trim());
  const h1AtTop = h1s.length === 1 && /^#\s/.test(firstLine || '');

  // Title: frontmatter, then the H1 when the file has exactly one, then the file
  // name. A file with several H1s uses them as section headings instead.
  const title = String(fm.title || (h1s.length === 1 ? h1s[0] : humanize(rest)));
  const base = category ? `${subject.url}${category.slug}/` : subject.url;

  return {
    file,
    subject,
    category,
    num,
    slug,
    url: `${base}${slug}/`,
    fm,
    body,
    title,
    dropFirstH1: h1AtTop,
    headingShift: h1s.length && !h1AtTop ? 1 : 0,
    order: typeof fm.order === 'number' ? fm.order : null,
    examWeight: ['low', 'medium', 'high'].includes(String(fm.exam_weight).toLowerCase()) ? String(fm.exam_weight).toLowerCase() : null,
    tags: Array.isArray(fm.tags) ? fm.tags.map(String) : [],
    updated: fm.updated ? new Date(fm.updated) : null,
  };
}

const FENCE_OPEN = /^\s{0,3}(`{3,}|~{3,})/;
const isFenceClose = (line, fence) => new RegExp(`^\\s{0,3}${fence[0] === '`' ? '`' : '~'}{${fence.length},}\\s*$`).test(line);

function scanH1s(body) {
  const out = [];
  let fence = null;
  for (const line of body.split(/\r?\n/)) {
    if (fence) { if (isFenceClose(line, fence)) fence = null; continue; }
    const f = line.match(FENCE_OPEN);
    if (f) { fence = f[1]; continue; }
    const m = line.match(/^#\s+(.+?)\s*#*\s*$/);
    if (m) out.push(m[1]);
  }
  return out;
}

function compareTopics(a, b) {
  const an = a.num ?? Infinity, bn = b.num ?? Infinity;
  if (an !== bn) return an - bn;
  const ao = a.order ?? Infinity, bo = b.order ?? Infinity;
  if (ao !== bo) return ao - bo;
  return a.title.localeCompare(b.title);
}

// ---------------------------------------------------------------------------
// 2. Markdown pipeline
// ---------------------------------------------------------------------------

const cssVarsTheme = createCssVariablesTheme({ name: 'reviewer', variablePrefix: '--shiki-', fontStyle: true });
let highlighter;
let katex = null;

const md = new MarkdownIt({ html: true, linkify: true, typographer: false });

// Headings: shift levels so the page owns the only <h1>, add stable ids, and
// collect H2/H3 for the table of contents.
md.core.ruler.push('reviewer_headings', (state) => {
  const env = state.env;
  if (!env.topic) return;
  const tokens = state.tokens;
  for (let i = 0; i < tokens.length; i++) {
    const open = tokens[i];
    if (open.type !== 'heading_open') continue;
    const inline = tokens[i + 1];
    const close = tokens[i + 2];
    let level = Number(open.tag.slice(1));
    if (level === 1 && env.topic.dropFirstH1 && !env.droppedH1) {
      env.droppedH1 = true;
      tokens.splice(i, 3);
      i--;
      continue;
    }
    level = Math.min(level + env.topic.headingShift, 6);
    open.tag = close.tag = `h${level}`;
    const text = headingText(inline.content);
    const id = uniqueId(env, slugify(text) || 'section');
    open.attrSet('id', id);
    if (level === 2 || level === 3) env.headings.push({ level, text, id });
  }
});

// Callouts: > [!tip], > [!warning], > [!exam], > [!remember], > [!note]
const CALLOUTS = { tip: 'Tip', warning: 'Watch out', exam: 'On the exam', remember: 'Remember', note: 'Note' };
md.core.ruler.push('reviewer_callouts', (state) => {
  const tokens = state.tokens;
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].type !== 'blockquote_open') continue;
    const inline = tokens[i + 2];
    if (tokens[i + 1]?.type !== 'paragraph_open' || inline?.type !== 'inline') continue;
    const m = inline.content.match(/^\[!(\w+)\][ \t]*/);
    if (!m) continue;
    const type = m[1].toLowerCase();
    if (!CALLOUTS[type]) {
      warn(`${state.env.rel}: unknown callout type [!${m[1]}]. Use one of: ${Object.keys(CALLOUTS).join(', ')}.`);
      continue;
    }
    // Strip the marker from the first text child.
    const first = inline.children[0];
    if (first?.type === 'text') first.content = first.content.replace(/^\[!\w+\][ \t]*/, '');
    if (inline.children[1]?.type === 'softbreak' && !first.content) inline.children.splice(0, 2);
    let depth = 0;
    for (let j = i; j < tokens.length; j++) {
      if (tokens[j].type === 'blockquote_open') depth++;
      if (tokens[j].type === 'blockquote_close' && --depth === 0) { tokens[j].tag = 'aside'; break; }
    }
    tokens[i].tag = 'aside';
    tokens[i].attrSet('class', `callout callout-${type}`);
    const label = new state.Token('html_block', '', 0);
    label.content = `<p class="callout-label">${CALLOUTS[type]}</p>\n`;
    tokens.splice(i + 1, 0, label);
  }
});

// Task lists outside of question blocks.
md.core.ruler.push('reviewer_tasks', (state) => {
  const tokens = state.tokens;
  for (let i = 2; i < tokens.length; i++) {
    const inline = tokens[i];
    if (inline.type !== 'inline' || tokens[i - 1].type !== 'paragraph_open' || tokens[i - 2].type !== 'list_item_open') continue;
    const m = inline.content.match(/^\[([ xX])\]\s+/);
    const first = inline.children[0];
    if (!m || first?.type !== 'text') continue;
    first.content = first.content.replace(/^\[([ xX])\]\s+/, '');
    const box = new state.Token('html_inline', '', 0);
    box.content = `<input type="checkbox" disabled${m[1] === ' ' ? '' : ' checked'}> `;
    inline.children.unshift(box);
    tokens[i - 2].attrJoin('class', 'task');
  }
});

md.renderer.rules.fence = (tokens, idx) => {
  const t = tokens[idx];
  const lang = (t.info || '').trim().split(/\s+/)[0].toLowerCase();
  const code = t.content.replace(/\n$/, '');
  const known = lang && highlighter.getLoadedLanguages().includes(lang);
  const pre = known
    ? highlighter.codeToHtml(code, { lang, theme: 'reviewer' })
    : `<pre class="shiki" tabindex="0"><code>${esc(code)}</code></pre>`;
  return `<figure class="code"${lang ? ` data-lang="${esc(lang)}"` : ''}>${pre}</figure>\n`;
};

md.renderer.rules.image = (tokens, idx, opts, env, self) => {
  const t = tokens[idx];
  const src = t.attrGet('src');
  const alt = self.renderInlineAsText(t.children, opts, env);
  if (!alt.trim()) warn(`${env.rel}: image "${src}" has no alt text. Describe it inside the brackets: ![what it shows](${src}).`);
  const url = resolveLocal(src, env, 'Image');
  const title = t.attrGet('title');
  return `<img src="${esc(url)}" alt="${esc(alt)}" loading="lazy" decoding="async"${title ? ` title="${esc(title)}"` : ''}>`;
};

const defaultLinkOpen = md.renderer.rules.link_open || ((tokens, idx, opts, env, self) => self.renderToken(tokens, idx, opts));
md.renderer.rules.link_open = (tokens, idx, opts, env, self) => {
  const t = tokens[idx];
  const href = t.attrGet('href');
  if (env.topic && href) t.attrSet('href', resolveLocal(href, env, 'Link'));
  return defaultLinkOpen(tokens, idx, opts, env, self);
};

function headingText(content) {
  return htmlToText(md.renderInline(content)).trim();
}

function uniqueId(env, base) {
  const n = env.ids.get(base) || 0;
  env.ids.set(base, n + 1);
  return n ? `${base}-${n + 1}` : base;
}

// Resolve relative links and images against the Markdown file, copy local
// files into dist, and rewrite .md links to topic URLs.
function resolveLocal(href, env, kind) {
  if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('#') || href.startsWith('/') || href.startsWith('//')) return href;
  const [rawPath, hash] = href.split('#');
  let decoded;
  try { decoded = decodeURI(rawPath); } catch { decoded = rawPath; }
  const abs = path.resolve(path.dirname(env.topic.file), decoded);
  if (abs.toLowerCase().endsWith('.md')) {
    const target = topicsByFile.get(abs);
    if (!target) {
      warn(`${env.rel}: link to "${href}" does not match any topic. Check the file name.`);
      return href;
    }
    return target.url + (hash ? `#${hash}` : '');
  }
  if (!fs.existsSync(abs)) {
    warn(`${env.rel}: ${kind.toLowerCase()} "${href}" does not exist (looked for ${rel(abs)}).`);
    return href;
  }
  const subjectDir = env.topic.subject.dir;
  const inside = path.relative(subjectDir, abs);
  if (inside.startsWith('..') || path.isAbsolute(inside)) {
    warn(`${env.rel}: ${kind.toLowerCase()} "${href}" is outside the subject folder, so it was not copied. Move it into ${rel(subjectDir)}/assets/.`);
    return href;
  }
  const parts = inside.split(path.sep);
  const cat = env.topic.subject.categories.get(path.join(subjectDir, parts[0]));
  if (cat && parts.length > 1) parts[0] = cat.slug;
  const outRel = path.join(env.topic.subject.slug, ...parts);
  filesToCopy.set(path.join(DIST, outRel), abs);
  return '/' + outRel.split(path.sep).map(encodeURIComponent).join('/') + (hash ? `#${hash}` : '');
}

// --- Pre-pass on the Markdown source: question blocks, Q:/A: self-tests,
// --- wikilinks and math become placeholders that are swapped in after render.

const QSTART = /^\*\*(\d+)\.\s+(.+?)\\?\*\\?\*\s*$/;
const CHOICE = /^\s*[-*+]\s+\[( |x|X)?\]\s?(.*)$/;
const ANSWER_MARK = /^\s*(?:\u2705|\u2714\uFE0F?|\u2611\uFE0F?)\s*/u;
const HEADING = /^(#{1,6})\s+(.*?)\s*#*\s*$/;
const HR = /^\s{0,3}([-*_])(\s*\1){2,}\s*$/;
const QA_Q = /^Q:\s+(.*)$/;
const QA_A = /^A:\s+(.*)$/;

// A fence that belongs to a list item: indented under it, or opened right
// after the marker (`- [ ] ```python`). It stays inside the list's text block.
const LIST_ITEM = /^\s*(?:[-*+]|\d+[.)])\s/;
const ITEM_FENCE = /^\s*(?:[-*+]|\d+[.)])\s+(?:\[[ xX]?\]\s*)?(?:(?:✅|✔️?|☑️?)\s*)?(`{3,}|~{3,})/u;

function toBlocks(lines) {
  const blocks = [];
  let cur = null;
  let fence = null;
  let nested = null; // fence inside a list item
  lines.forEach((line, i) => {
    if (nested) {
      cur.lines.push(line);
      cur.code.add(cur.lines.length - 1);
      cur.end = i;
      if (new RegExp(`^\\s*${nested[0] === '`' ? '`' : '~'}{${nested.length},}\\s*$`).test(line)) nested = null;
      return;
    }
    if (fence) {
      cur.lines.push(line);
      cur.end = i;
      if (isFenceClose(line, fence)) { fence = null; blocks.push(cur); cur = null; }
      return;
    }
    const itemFence = line.match(ITEM_FENCE);
    const f = line.match(FENCE_OPEN);
    const inList = cur && cur.type === 'text' && cur.lines.some((l) => LIST_ITEM.test(l));
    if (itemFence || (f && inList && /^\s+/.test(line))) {
      if (!cur) cur = { type: 'text', lines: [], code: new Set(), start: i, end: i };
      cur.lines.push(line);
      cur.end = i;
      nested = (itemFence || f)[1];
      return;
    }
    if (f) {
      if (cur) blocks.push(cur);
      cur = { type: 'fence', lines: [line], start: i, end: i };
      fence = f[1];
      return;
    }
    if (!line.trim()) { if (cur) { blocks.push(cur); cur = null; } return; }
    if (!cur) cur = { type: 'text', lines: [], code: new Set(), start: i, end: i };
    cur.lines.push(line);
    cur.end = i;
  });
  if (cur) blocks.push(cur);
  return blocks;
}

function placeholder(env, html) {
  env.blocks.push(html);
  return `<!--reviewer:${env.blocks.length - 1}-->`;
}

// Inline transforms that run on every text line outside code spans.
function transformInline(line, env) {
  return line.split(/(`+[^`]*`+)/).map((part, i) => {
    if (i % 2) return part;
    part = part.replace(/\[\[([^\]|#]+)(#[^\]|]+)?(?:\|([^\]]+))?\]\]/g, (_, target, hash, label) => {
      const t = resolveWikilink(target.trim(), env.topic);
      const text = (label || target).trim();
      if (!t) {
        warn(`${env.rel}: wikilink [[${target.trim()}]] has no matching topic.`);
        return text;
      }
      return `[${text}](${t.url}${hash ? '#' + slugify(hash.slice(1)) : ''})`;
    });
    if (katex) {
      part = part.replace(/(?<![\\$\w])\$(?=\S)([^$\n]+?)(?<=\S)\$(?![\w$])/g, (_, tex) =>
        placeholder(env, katex.renderToString(tex, { throwOnError: false, output: 'html' })));
    }
    return part;
  }).join('');
}

function resolveWikilink(target, topic) {
  const [maybeSubject, maybeTopic] = target.includes('/') ? target.split('/') : [null, target];
  const pool = maybeSubject ? (subjectsBySlug.get(slugify(maybeSubject))?.topics || []) : topic.subject.topics;
  const want = slugify(splitPrefix(maybeTopic).rest);
  return pool.find((t) => t.slug === want) || pool.find((t) => t.title.toLowerCase() === maybeTopic.toLowerCase()) || null;
}

function prepass(body, env) {
  const lines = body.split(/\r?\n/);
  const blocks = toBlocks(lines);
  const replace = [];
  const sectionLevel = env.topic.headingShift ? 1 : 2;
  let section = null;
  let skippedTitle = false;

  for (const b of blocks) {
    if (b.type !== 'text') continue;
    // Display math: a block that is exactly $$ ... $$.
    const joined = b.lines.join('\n').trim();
    if (katex && /^\$\$[\s\S]+\$\$$/.test(joined)) {
      b.lines = [placeholder(env, `<div class="math-display">${katex.renderToString(joined.slice(2, -2), { displayMode: true, throwOnError: false, output: 'html' })}</div>`)];
      b.replaced = true;
      continue;
    }
    b.lines = b.lines.map((l, k) => (b.code.has(k) ? l : transformInline(l, env)));
  }

  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.type !== 'text') continue;
    for (const l of b.lines) {
      const h = l.match(HEADING);
      if (!h) continue;
      const level = h[1].length;
      if (level === 1 && env.topic.dropFirstH1 && !skippedTitle) { skippedTitle = true; continue; }
      if (level <= sectionLevel) section = { text: headingText(h[2]), id: slugify(headingText(h[2])) || 'section' };
    }

    if (QSTART.test(b.lines[0])) {
      const q = parseQuestion(blocks, i, env, section);
      if (q) {
        replace.push({ start: b.start, end: blocks[q.last].end, html: q.html });
        i = q.last;
        continue;
      }
    }

    if (QA_Q.test(b.lines[0])) {
      const st = parseSelfTest(blocks, i, env);
      if (st) {
        replace.push({ start: b.start, end: blocks[st.last].end, html: st.html });
        i = st.last;
        continue;
      }
    }
  }

  // Rebuild the source: transformed text blocks, untouched fences, and
  // placeholders for the structured blocks.
  const out = [...lines];
  for (const b of blocks) {
    if (b.type === 'text') {
      for (let k = b.start; k <= b.end; k++) out[k] = null;
      out[b.start] = b.lines.join('\n');
    }
  }
  for (const r of replace) {
    for (let k = r.start; k <= r.end; k++) out[k] = null;
    out[r.start] = `\n${placeholder(env, r.html)}\n`;
  }
  return out.filter((l) => l !== null).join('\n');
}

function parseQuestion(blocks, i, env, section) {
  const first = blocks[i];
  const m = first.lines[0].match(QSTART);
  const num = Number(m[1]);
  const stem = m[2];
  const pre = [];
  let choices = null;
  let match = null;
  let explanation = null;
  let last = i;

  // The stem block may continue with notes, or even run straight into choices.
  const rest = first.lines.slice(1);
  const firstChoice = rest.findIndex((l) => CHOICE.test(l));
  if (firstChoice >= 0) {
    if (firstChoice > 0) pre.push(rest.slice(0, firstChoice).join('\n'));
    choices = readChoices(rest.slice(firstChoice));
  } else if (rest.length) {
    pre.push(rest.join('\n'));
  }

  for (let j = i + 1; j < blocks.length && !choices && !match; j++) {
    const b = blocks[j];
    if (b.type === 'fence') { pre.push(b.lines.join('\n')); last = j; continue; }
    const head = b.lines[0];
    if (CHOICE.test(head)) { choices = readChoices(b.lines); last = j; break; }
    if (isMatchList(b.lines)) { match = readMatch(b.lines); last = j; break; }
    if (QSTART.test(head) || HEADING.test(head) || HR.test(head) || head.startsWith('>') || pre.length >= 4) return null;
    pre.push(b.lines.join('\n'));
    last = j;
  }
  if (!choices && !match) return null;

  const next = blocks[last + 1];
  if (next && next.type === 'text' && next.lines.every((l) => l.startsWith('>'))) {
    explanation = next.lines.map((l) => l.replace(/^>\s?/, '')).join('\n');
    last += 1;
  }

  const id = uniqueId(env, `${section ? section.id : 'question'}-q${num}`);
  if (match) return { html: renderMatch({ id, num, stem, pre, match, explanation, env, section }), last };
  const letters = choices.map((_, k) => String.fromCharCode(65 + k));
  const correct = choices.map((c, k) => (c.correct ? letters[k] : null)).filter(Boolean);
  const stemHtml = md.renderInline(stem, env);
  const choiceHtml = choices.map((c) => (c.block ? md.render(c.text, env) : md.renderInline(c.text, env)));
  const explanationHtml = explanation ? md.render(explanation, env) : '';

  env.questions.push({
    n: num,
    id,
    section: section ? section.text : null,
    sectionId: section ? section.id : null,
    text: htmlToText(stemHtml),
    answered: correct.length > 0,
    hay: [htmlToText(stemHtml), ...choiceHtml.map(htmlToText), htmlToText(explanationHtml)].join(' ').replace(/\s+/g, ' '),
  });

  const keyText = correct.length
    ? `Answer: ${correct.map((l) => `<strong>${l}</strong>`).join(correct.length === 2 ? ' and ' : ', ')}`
    : 'No answer is marked for this question in the notes.';

  const html = `<div class="q" id="${id}">
<p class="q-num" aria-hidden="true">${num}</p>
<p class="q-stem"><span class="visually-hidden">Question ${num}: </span>${stemHtml}</p>
${pre.length ? `<div class="q-extra">${md.render(pre.join('\n\n'), env)}</div>` : ''}
<ol class="choices">
${choices.map((c, k) => `<li class="choice${c.correct ? ' is-correct' : ''}"><span class="bubble" aria-hidden="true">${letters[k]}</span>${c.block ? `<div class="choice-text is-block"><div class="hl"><span class="visually-hidden">${letters[k]}. </span>${choiceHtml[k]}</div></div>` : `<span class="choice-text"><span class="hl"><span class="visually-hidden">${letters[k]}. </span>${choiceHtml[k]}</span></span>`}</li>`).join('\n')}
</ol>
<details class="answer">
<summary><span class="when-closed">Show answer</span><span class="when-open">Hide answer</span></summary>
<div class="answer-body">
<p class="answer-key">${keyText}</p>
${explanationHtml}
</div>
</details>
</div>`;
  return { html, last };
}

// Matching questions: a list of "- **Term:** description" pairs (the ✅ marker
// is optional). Descriptions are shuffled into a lettered pool; the shuffle is
// seeded by the question id, so letters stay stable between builds.
const MATCH_ITEM = /^\s*[-*+]\s+\*\*(.+?)\*\*\s*:?\s*(.*)$/;
const LIST_MARK = /^\s*[-*+]\s/;
const isMatchList = (lines) => {
  const items = lines.filter((l) => LIST_MARK.test(l));
  return items.length >= 2 && MATCH_ITEM.test(lines[0]) && items.every((l) => MATCH_ITEM.test(l) && !CHOICE.test(l));
};

function readMatch(lines) {
  const pairs = [];
  for (const l of lines) {
    const m = l.match(MATCH_ITEM);
    if (m && LIST_MARK.test(l)) pairs.push({ term: m[1].replace(/:\s*$/, '').trim(), desc: m[2].replace(ANSWER_MARK, '').trim() });
    else if (pairs.length) pairs[pairs.length - 1].desc += ' ' + l.trim();
  }
  return pairs;
}

function seededOrder(n, seed) {
  let h = 2166136261;
  for (const ch of seed) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
  h = h >>> 0 || 1;
  const rand = () => { h ^= h << 13; h >>>= 0; h ^= h >>> 17; h ^= h << 5; h >>>= 0; return h / 4294967296; };
  const order = [...Array(n).keys()];
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  if (order.every((v, i) => v === i)) order.push(order.shift()); // never leave it in answer order
  return order;
}

function renderMatch({ id, num, stem, pre, match, explanation, env, section }) {
  const order = seededOrder(match.length, id);
  const letters = match.map((_, k) => String.fromCharCode(65 + k));
  const answerOf = match.map((_, i) => letters[order.indexOf(i)]);
  const stemHtml = md.renderInline(stem, env);
  const termHtml = match.map((p) => md.renderInline(p.term, env));
  const descHtml = match.map((p) => md.renderInline(p.desc, env));
  const explanationHtml = explanation ? md.render(explanation, env) : '';

  env.questions.push({
    n: num,
    id,
    section: section ? section.text : null,
    sectionId: section ? section.id : null,
    text: htmlToText(stemHtml),
    answered: true,
    hay: [htmlToText(stemHtml), ...termHtml.map(htmlToText), ...descHtml.map(htmlToText), htmlToText(explanationHtml)].join(' ').replace(/\s+/g, ' '),
  });

  return `<div class="q q-match" id="${id}">
<p class="q-num" aria-hidden="true">${num}</p>
<p class="q-stem"><span class="visually-hidden">Question ${num}: </span>${stemHtml}</p>
${pre.length ? `<div class="q-extra">${md.render(pre.join('\n\n'), env)}</div>` : ''}
<ul class="match-terms">
${match.map((_, i) => `<li class="match-row" data-answer="${answerOf[i]}"><span class="match-term">${termHtml[i]}</span><span class="match-slot"></span></li>`).join('\n')}
</ul>
<ol class="match-pool">
${order.map((src, k) => `<li class="match-option"><span class="bubble" aria-hidden="true">${letters[k]}</span><span class="match-text"><span class="visually-hidden">${letters[k]}. </span>${descHtml[src]}</span></li>`).join('\n')}
</ol>
<details class="answer">
<summary><span class="when-closed">Show answer</span><span class="when-open">Hide answer</span></summary>
<div class="answer-body">
<dl class="match-key">
${match.map((_, i) => `<div><dt>${termHtml[i]}</dt><dd><strong>${answerOf[i]}</strong> ${descHtml[i]}</dd></div>`).join('\n')}
</dl>
${explanationHtml}
</div>
</details>
</div>`;
}

// Choices are usually one line, but may continue on indented lines (for
// example a code block inside the choice). Multi-line choices keep their line
// breaks, dedented, so they render as block Markdown.
function readChoices(lines) {
  const out = [];
  for (const l of lines) {
    const m = l.match(CHOICE);
    if (m && !(out.length && out[out.length - 1].inFence)) {
      out.push({ correct: /x/i.test(m[1] || ''), first: m[2].replace(ANSWER_MARK, '').trim(), more: [], inFence: false });
    } else if (out.length) {
      out[out.length - 1].more.push(l);
    }
    const c = out[out.length - 1];
    if (c && /(`{3,}|~{3,})/.test(m && c.more.length === 0 ? c.first : l)) c.inFence = !c.inFence;
  }
  return out.map(({ correct, first, more }) => {
    if (!more.length) return { correct, text: first, block: false };
    const indent = Math.min(...more.filter((l) => l.trim()).map((l) => l.match(/^\s*/)[0].length));
    const body = more.map((l) => l.slice(Math.min(indent, l.match(/^\s*/)[0].length)));
    const hasFence = more.some((l) => /^\s*(`{3,}|~{3,})/.test(l)) || /^(`{3,}|~{3,})/.test(first);
    if (!hasFence) return { correct, text: [first, ...more.map((l) => l.trim())].join(' '), block: false };
    return { correct, text: [first, ...body].join('\n').trim(), block: true };
  });
}

function parseSelfTest(blocks, i, env) {
  const q = [];
  let a = [];
  let last = i;
  let inAnswer = false;
  for (const l of blocks[i].lines) {
    if (!inAnswer && QA_A.test(l)) { inAnswer = true; a.push(l.replace(/^A:\s+/, '')); continue; }
    if (inAnswer) a.push(l);
    else q.push(l.replace(/^Q:\s+/, ''));
  }
  if (!inAnswer) {
    const next = blocks[i + 1];
    if (!next || next.type !== 'text' || !QA_A.test(next.lines[0])) return null;
    a = next.lines.map((l, k) => (k ? l : l.replace(/^A:\s+/, '')));
    last = i + 1;
  }
  const qHtml = md.renderInline(q.join(' '), env);
  env.selfTests += 1;
  return {
    last,
    html: `<details class="selftest">
<summary><span class="selftest-q">${qHtml}</span><span class="selftest-hint"><span class="when-closed">Show answer</span><span class="when-open">Hide answer</span></span></summary>
<div class="answer-body">${md.render(a.join('\n'), env)}</div>
</details>`,
  };
}

function firstParagraph(body) {
  const tokens = md.parse(body, {});
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].type === 'paragraph_open' && tokens[i].level === 0 && !QSTART.test(tokens[i + 1].content.split('\n')[0])) {
      const text = htmlToText(md.renderInline(tokens[i + 1].content)).replace(/\s+/g, ' ').trim();
      if (text) return text;
    }
  }
  return '';
}

// Fallback summary for a topic made only of questions: describe the set.
function questionSummary(t) {
  if (!t.questions.length) return '';
  const sections = t.headings.filter((h) => h.level === 2 && h.questions).length;
  const answered = t.questions.filter((q) => q.answered).length;
  const key = answered === t.questions.length ? ', with answers' : answered ? `, ${answered} with answers` : '';
  return `${t.questions.length} practice questions${sections > 1 ? ` across ${sections} sections` : ''}${key}.`;
}

function trimTo(text, max) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(' ') > 40 ? cut.lastIndexOf(' ') : max).replace(/[\s,.;:]+$/, '') + '…';
}

const hasMath = (body) => {
  const prose = body.replace(/(```|~~~)[\s\S]*?\1/g, '').replace(/`[^`\n]*`/g, '');
  return /\$\$[\s\S]+?\$\$/.test(prose) || /(?<![\\$\w])\$(?=\S)[^$\n]+?(?<=\S)\$(?![\w$])/.test(prose);
};

function renderTopicBody(topic) {
  const env = {
    topic,
    rel: rel(topic.file),
    headings: [],
    questions: [],
    selfTests: 0,
    blocks: [],
    ids: new Map(),
  };
  const source = prepass(topic.body, env);
  let html = md.render(source, env);
  // Twice: placeholders can sit inside other placeholders (math in a question).
  for (let pass = 0; pass < 2; pass++) {
    html = html.replace(/<!--reviewer:(\d+)-->/g, (_, n) => env.blocks[Number(n)]);
  }

  const counted = htmlToText(
    html.replace(/<summary[\s\S]*?<\/summary>/g, ' ')
      .replace(/<span class="(?:bubble|visually-hidden)"[^>]*>[^<]*<\/span>/g, ' ')
      .replace(/<p class="(?:q-num|answer-key|callout-label)"[^>]*>[\s\S]*?<\/p>/g, ' '),
  );
  const words = (counted.match(/[\p{L}\p{N}][\p{L}\p{N}'’_-]*/gu) || []).length;
  for (const h of env.headings) {
    if (h.level === 2) h.questions = env.questions.filter((q) => q.sectionId === h.id).length;
  }
  return { html, lead: firstParagraph(source), headings: env.headings, questions: env.questions, selfTests: env.selfTests, words, plain: counted.replace(/\s+/g, ' ').trim() };
}

// ---------------------------------------------------------------------------
// 3. Assets: fonts, styles, scripts
// ---------------------------------------------------------------------------

const filesToCopy = new Map(); // dist path -> source path
const hash = (buf) => crypto.createHash('sha256').update(buf).digest('hex').slice(0, 10);

function writeAsset(name, content) {
  const ext = path.extname(name);
  const dir = path.dirname(name);
  const out = `${path.basename(name, ext)}.${hash(content)}${ext}`;
  const file = path.join(DIST, 'assets', dir, out);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  return `/assets/${dir === '.' ? '' : dir + '/'}${out}`;
}

const fontFaceCache = new Map();
function fontFaces(family) {
  if (fontFaceCache.has(family)) return fontFaceCache.get(family);
  const src = FONT_SOURCES[family];
  if (!src) {
    warn(`Font "${family}" is not self-hosted yet. Add it to FONT_SOURCES in build.mjs and install @fontsource/<name>. Using a system font for now.`);
    fontFaceCache.set(family, '');
    return '';
  }
  const dir = path.join(path.dirname(require.resolve(`@fontsource/${src.pkg}/package.json`)), 'files');
  const css = src.faces.map(([weight, style]) => {
    const file = path.join(dir, `${src.pkg}-latin-${weight}-${style}.woff2`);
    if (!fs.existsSync(file)) { warn(`Missing font file ${rel(file)}.`); return ''; }
    const url = writeAsset(`fonts/${path.basename(file)}`, fs.readFileSync(file));
    return `@font-face{font-family:'${family}';font-style:${style};font-weight:${weight};font-display:swap;src:url(${url}) format('woff2');}`;
  }).join('\n');
  fontFaceCache.set(family, css);
  return css;
}
const fontStack = (family) => `'${family}', ${FONT_SOURCES[family]?.fallback || 'system-ui, sans-serif'}`;

// Strip a byte-order mark: these files are concatenated, and a BOM mid-file
// silently breaks the CSS rule that follows it.
const readSource = (file) => fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
const readStyle = (name) => readSource(path.join(SRC, 'styles', name));
const readScript = (name) => readSource(path.join(SRC, 'scripts', name));

function subjectThemeCss(subject) {
  const fonts = subject.design?.fonts || {};
  const display = fonts.display || SITE.fonts.display;
  const body = fonts.body || SITE.fonts.body;
  const faces = [...new Set([display, body])].map(fontFaces).join('\n');
  const scope = `[data-subject="${subject.slug}"]`;
  let css = `${faces}\n${scope}{--f-display:${fontStack(display)};--f-body:${fontStack(body)};}\n`;
  const themeFile = path.join(SRC, 'styles', 'themes', `${subject.slug}.css`);
  if (fs.existsSync(themeFile)) {
    css += readSource(themeFile);
  } else {
    // Generated fallback from the palette in _subject.json:
    // [background, ink, accent, highlight, warning, rule]
    const p = subject.design?.palette || [];
    const vars = [
      ['--c-bg', p[0]], ['--c-ink', p[1]], ['--c-accent', p[2]], ['--c-focus', p[2]], ['--c-link', p[2]],
      ['--c-mark', p[3]], ['--c-warn', p[4]], ['--c-rule', p[5]],
    ].filter(([, v]) => v).map(([k, v]) => `${k}:${v};`).join('');
    if (!p.length) notes.push(`${subject.slug} has no design in _subject.json, so it uses the default theme. Add one to give it its own look.`);
    css += `${scope}{${vars}}\n`;
  }
  return css;
}
const notes = [];

// ---------------------------------------------------------------------------
// 4. Main
// ---------------------------------------------------------------------------

const subjectsBySlug = new Map();
const topicsByFile = new Map();

async function main() {
  const subjects = discover();
  if (errors.length) return finish(subjects, 0);

  for (const s of subjects) {
    subjectsBySlug.set(s.slug, s);
    s.topics.sort(compareTopics);
    for (const t of s.topics) topicsByFile.set(t.file, t);
  }

  // Load only the languages the notes use, and KaTeX only if there is math.
  const langs = new Set();
  let anyMath = false;
  for (const s of subjects) for (const t of s.topics) {
    for (const m of t.body.matchAll(/^\s{0,3}(?:`{3,}|~{3,})\s*([\w+#-]+)/gm)) {
      const l = m[1].toLowerCase();
      if (l in bundledLanguages) langs.add(l);
    }
    t.hasMath = hasMath(t.body);
    anyMath ||= t.hasMath;
  }
  highlighter = await createHighlighter({ themes: [cssVarsTheme], langs: [...langs] });
  if (anyMath) katex = (await import('katex')).default;

  for (const s of subjects) {
    for (const t of s.topics) {
      Object.assign(t, renderTopicBody(t));
      t.summary = trimTo(String(t.fm.summary || t.lead || questionSummary(t)), SUMMARY_LENGTH);
      t.minutes = Math.max(1, Math.ceil(t.words / WORDS_PER_MINUTE));
      if (t.words > LONG_TOPIC_WORDS) warn(`${rel(t.file)} is ${t.words.toLocaleString('en')} words. Consider splitting it into smaller topics (limit ${LONG_TOPIC_WORDS.toLocaleString('en')}).`);
    }
    // Study order: uncategorized topics first, then categories in order.
    const loose = s.topics.filter((t) => !t.category);
    const cats = [...s.categories.values()].sort((a, b) => (a.num ?? Infinity) - (b.num ?? Infinity) || a.title.localeCompare(b.title));
    for (const c of cats) c.topics = s.topics.filter((t) => t.category === c);
    s.groups = [...(loose.length ? [{ category: null, topics: loose }] : []), ...cats.filter((c) => c.topics.length).map((c) => ({ category: c, topics: c.topics }))];
    s.ordered = s.groups.flatMap((g) => g.topics);
    s.ordered.forEach((t, k) => { t.index = k + 1; t.prev = s.ordered[k - 1] || null; t.next = s.ordered[k + 1] || null; });
    s.minutes = s.ordered.reduce((n, t) => n + t.minutes, 0);
    s.questionCount = s.ordered.reduce((n, t) => n + t.questions.length, 0);
    if (!s.description) s.description = `${s.ordered.length} ${s.ordered.length === 1 ? 'topic' : 'topics'} to review.`;
  }
  if (errors.length) return finish(subjects, 0);
  if (!subjects.length) warn(`No subjects found. Add a folder of Markdown notes to ${rel(CONTENT)}/ and rebuild.`);

  // Write output.
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  const codeFaces = fontFaces(CODE_FONT);
  const siteFaces = [SITE.fonts.display, SITE.fonts.body].map(fontFaces).join('\n');
  const assets = {
    base: writeAsset('base.css', readStyle('base.css')),
    dashboard: writeAsset('dashboard.css', `${siteFaces}\n${readStyle('dashboard.css')}`),
    hub: writeAsset('hub.css', readStyle('hub.css')),
    topic: writeAsset('topic.css', `${codeFaces}\n${readStyle('topic.css')}`),
    print: writeAsset('print.css', readStyle('print.css')),
    progress: writeAsset('progress.js', readScript('progress.js')),
    search: writeAsset('search.js', readScript('search.js')),
    topicJs: writeAsset('topic.js', readScript('topic.js')),
    quiz: writeAsset('quiz.js', readScript('quiz.js')),
    themes: {},
    katex: null,
  };
  for (const s of subjects) assets.themes[s.slug] = writeAsset(`theme-${s.slug}.css`, subjectThemeCss(s));
  if (anyMath) {
    const kdir = path.join(path.dirname(require.resolve('katex/package.json')), 'dist');
    const version = require('katex/package.json').version;
    fs.cpSync(path.join(kdir, 'fonts'), path.join(DIST, 'assets', `katex-${version}`, 'fonts'), { recursive: true });
    fs.copyFileSync(path.join(kdir, 'katex.min.css'), path.join(DIST, 'assets', `katex-${version}`, 'katex.min.css'));
    assets.katex = `/assets/katex-${version}/katex.min.css`;
  }

  const ctx = { site: SITE, subjects, assets };
  let pages = 0;
  const writePage = (urlPath, html) => {
    const file = urlPath === '/404.html' ? path.join(DIST, '404.html') : path.join(DIST, ...urlPath.split('/').filter(Boolean), 'index.html');
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, html);
    pages++;
  };

  writePage('/', renderDashboard(ctx));
  writePage('/404.html', renderNotFound(ctx));
  for (const s of subjects) {
    writePage(s.url, renderHub(ctx, s));
    for (const t of s.ordered) writePage(t.url, renderTopic(ctx, s, t));
    // Copy each subject's assets/ folders wholesale.
    for (const dir of [s.dir, ...s.categories.keys()]) {
      const a = path.join(dir, 'assets');
      if (!fs.existsSync(a)) continue;
      const cat = s.categories.get(dir);
      fs.cpSync(a, path.join(DIST, s.slug, ...(cat ? [cat.slug] : []), 'assets'), { recursive: true });
    }
  }
  for (const [dest, src] of filesToCopy) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }

  fs.writeFileSync(path.join(DIST, 'favicon.svg'), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="12" fill="none" stroke="#1B1F2A" stroke-width="3"/><circle cx="16" cy="16" r="6" fill="#1B1F2A"/></svg>');

  const searchIndex = {
    topics: subjects.flatMap((s) => s.ordered.map((t) => ({
      subject: s.title,
      title: t.title,
      url: t.url,
      summary: t.summary,
      headings: t.headings.map((h) => ({ text: h.text, id: h.id })),
      questions: t.questions.map((q) => ({ n: q.n, id: q.id, text: q.text, section: q.section, hay: q.hay })),
      excerpt: trimTo(t.plain, 400),
    }))),
  };
  fs.writeFileSync(path.join(DIST, 'search-index.json'), JSON.stringify(searchIndex));

  finish(subjects, pages);
}

function finish(subjects, pages) {
  const topics = subjects.reduce((n, s) => n + s.topics.length, 0);
  const questions = subjects.reduce((n, s) => n + (s.questionCount || 0), 0);
  const line = (s) => console.log(s);
  line('');
  if (errors.length) {
    line(`Build failed: ${errors.length} ${errors.length === 1 ? 'problem' : 'problems'} to fix`);
    for (const e of errors) line(`  x ${e}`);
  } else {
    line('Build finished');
    line(`  Subjects   ${subjects.length}`);
    line(`  Topics     ${topics}`);
    line(`  Questions  ${questions}`);
    line(`  Pages      ${pages}`);
    line(`  Time       ${Date.now() - started} ms`);
  }
  for (const n of notes) line(`  note: ${n}`);
  if (warnings.length) {
    line(`  Warnings   ${warnings.length}`);
    for (const w of warnings) line(`  ! ${w}`);
  } else if (!errors.length) {
    line('  Warnings   none');
  }
  line('');
  if (errors.length) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
