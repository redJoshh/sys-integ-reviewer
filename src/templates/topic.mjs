// Topic page (/<subject>/<topic>/): the reviewer content itself.

import { esc, href, layout, minutes, plural } from './layout.mjs';

const WEIGHT_LABEL = { low: 'Exam weight: low', medium: 'Exam weight: medium', high: 'Exam weight: high' };

function tocList(headings) {
  return `<ol>
${headings.map((h) => `<li class="toc-l${h.level}"><a href="#${esc(h.id)}">${esc(h.text)}${h.questions ? `<span class="toc-count">${plural(h.questions, 'question')}</span>` : ''}</a></li>`).join('\n')}
</ol>`;
}

export function renderTopic({ site, assets }, s, t) {
  const hasAnswers = t.questions.length + t.selfTests > 0;
  const meta = [
    `${minutes(t.minutes)} read`,
    t.questions.length ? plural(t.questions.length, 'question') : null,
    t.updated && !Number.isNaN(t.updated.getTime()) ? `Updated ${t.updated.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}` : null,
  ].filter(Boolean);

  const toc = t.headings.length ? t.headings : null;
  const crumbs = [{ label: 'All subjects', href: '/' }, { label: s.title, href: s.url }];
  if (t.category) crumbs.push({ label: t.category.title, href: `${s.url}#cat-${t.category.slug}` });
  crumbs.push({ label: t.title });

  const main = `<main id="main" class="topic" tabindex="-1" data-topic data-topic-url="${esc(t.url)}" data-topic-title="${esc(t.title)}" data-subject-title="${esc(s.title)}">
<header class="topic-head">
<p class="topic-place">Topic ${t.index} of ${s.ordered.length} in <a href="${href(s.url)}">${esc(s.title)}</a></p>
<h1>${esc(t.title)}</h1>
${t.summary ? `<p class="topic-summary">${esc(t.summary)}</p>` : ''}
<p class="topic-meta">${meta.map((m) => `<span>${esc(m)}</span>`).join('')}${t.examWeight ? `<span class="weight weight-${t.examWeight}">${WEIGHT_LABEL[t.examWeight]}</span>` : ''}</p>
<div class="toolbar">
${hasAnswers ? '<button type="button" class="btn" data-toggle-answers aria-pressed="false" hidden>Show all answers</button>' : ''}
<button type="button" class="btn btn-mark" data-mark aria-pressed="false" hidden>Mark as reviewed</button>
</div>
</header>
${toc ? `<details class="toc toc-mobile">
<summary>On this page</summary>
<nav aria-label="On this page (compact)">${tocList(toc)}</nav>
</details>` : ''}
<div class="topic-layout${toc ? '' : ' no-toc'}">
<article class="prose">
${t.html}
</article>
${toc ? `<aside class="toc toc-side">
<nav aria-labelledby="toc-heading">
<h2 id="toc-heading">On this page</h2>
${tocList(toc)}
</nav>
</aside>` : ''}
</div>
<footer class="topic-end">
<div class="end-mark">
<p>Done with this topic?</p>
<button type="button" class="btn btn-mark" data-mark aria-pressed="false" hidden>Mark as reviewed</button>
<noscript><p>Turn on JavaScript to track which topics you have reviewed.</p></noscript>
</div>
<nav class="pager" aria-label="Topics in ${esc(s.title)}">
${t.prev ? `<a class="pager-prev" href="${href(t.prev.url)}" rel="prev"><span class="pager-label">Previous topic</span><span class="pager-title">${esc(t.prev.title)}</span></a>` : ''}
${t.next ? `<a class="pager-next" href="${href(t.next.url)}" rel="next"><span class="pager-label">Next topic</span><span class="pager-title">${esc(t.next.title)}</span></a>` : ''}
<a class="pager-hub" href="${href(s.url)}"><span class="pager-label">All topics in</span><span class="pager-title">${esc(s.title)}</span></a>
</nav>
</footer>
</main>`;

  return layout({
    site,
    title: `${t.title} | ${s.title}`,
    description: t.summary || `${t.title}, from ${s.title}.`,
    url: t.url,
    ogType: 'article',
    subject: s.slug,
    styles: [assets.base, assets.topic, assets.themes[s.slug], t.hasMath ? assets.katex : null],
    printStyles: [assets.print],
    scripts: [assets.progress, assets.topicJs, t.questions.length ? assets.quiz : null].filter(Boolean),
    crumbs,
    themeColor: s.design?.palette?.[0] || '#F5F6F8',
    main,
  });
}
