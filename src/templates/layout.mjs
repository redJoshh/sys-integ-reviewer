// Shared page shell and small helpers used by every template.

const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ENTITIES[c]);

export function htmlToText(html) {
  return String(html)
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<\/(p|li|h[1-6]|div|pre|tr|figure|details|summary|blockquote|aside)>/gi, ' ')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&(#x?[0-9a-f]+|amp|lt|gt|quot|apos|nbsp);/gi, (m, e) => {
      const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }[e.toLowerCase()];
      if (named) return named;
      const code = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    });
}

export function slugify(s) {
  return String(s)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Data the browser needs to total saved exam answers: topic URL and question count.
export const quizData = (topics) => JSON.stringify(topics.filter((t) => t.questions.length).map((t) => ({ url: t.url, total: t.questions.length })));

export const plural = (n, word, many = `${word}s`) => `${n} ${n === 1 ? word : many}`;

export function minutes(n) {
  if (n < 60) return `${n} min`;
  const h = Math.floor(n / 60);
  const m = n % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

function breadcrumbs(crumbs) {
  return `<nav class="crumbs" aria-label="Breadcrumb"><ol>${crumbs
    .map((c) => (c.href ? `<li><a href="${esc(c.href)}">${esc(c.label)}</a></li>` : `<li aria-current="page">${esc(c.label)}</li>`))
    .join('')}</ol></nav>`;
}

export function layout({ site, title, description, url, ogType = 'website', subject = null, styles = [], printStyles = [], scripts = [], crumbs = [], themeColor = '#F5F6F8', main }) {
  const canonical = site.url + url;
  return `<!doctype html>
<html lang="en"${subject ? ` data-subject="${esc(subject)}"` : ''}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canonical)}">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta name="theme-color" content="${esc(themeColor)}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
${styles.filter(Boolean).map((h) => `<link rel="stylesheet" href="${h}">`).join('\n')}
${printStyles.map((h) => `<link rel="stylesheet" href="${h}" media="print">`).join('\n')}
${scripts.map((h) => `<script src="${h}" defer></script>`).join('\n')}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
<a class="brand" href="/"${url === '/' ? ' aria-current="page"' : ''}>${esc(site.name)}</a>
${crumbs.length ? breadcrumbs(crumbs) : ''}
</header>
${main}
<footer class="site-footer"><p>Built from the Markdown notes on ${esc(site.builtOn)}.</p></footer>
</body>
</html>
`;
}
