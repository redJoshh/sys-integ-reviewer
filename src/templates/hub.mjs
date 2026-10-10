// Subject hub (/<subject>/): topics in study order, grouped by category.

import { esc, layout, minutes, plural, quizData } from './layout.mjs';

const WEIGHT_LABEL = { low: 'Exam weight: low', medium: 'Exam weight: medium', high: 'Exam weight: high' };

function topicItem(t) {
  return `<li class="topic-item" data-topic-item data-topic-url="${esc(t.url)}">
<span class="topic-num" aria-hidden="true">${t.index}</span>
<div class="topic-body">
<a class="topic-title" href="${t.url}">${esc(t.title)}</a>
${t.summary ? `<p class="topic-summary">${esc(t.summary)}</p>` : ''}
<p class="topic-meta">
<span>${minutes(t.minutes)} read</span>
${t.questions.length ? `<span>${plural(t.questions.length, 'question')}</span>` : ''}
${t.examWeight ? `<span class="weight weight-${t.examWeight}">${WEIGHT_LABEL[t.examWeight]}</span>` : ''}
${t.questions.length ? `<span class="topic-score" data-quiz="${esc(quizData([t]))}" data-quiz-text="summary" hidden></span>` : ''}
<span class="topic-status" data-status hidden>Reviewed</span>
</p>
</div>
</li>`;
}

export function renderHub({ site, assets }, s) {
  const groups = s.groups.map((g) => {
    const list = `<ol class="topic-list" start="${g.topics[0].index}">\n${g.topics.map(topicItem).join('\n')}\n</ol>`;
    return g.category ? `<section class="topic-group" aria-labelledby="cat-${esc(g.category.slug)}">
<h3 id="cat-${esc(g.category.slug)}">${esc(g.category.title)}</h3>
${list}
</section>` : list;
  }).join('\n');

  const main = `<main id="main" class="hub" tabindex="-1">
<header class="sheet-head">
<div class="sheet-title">
<h1>${esc(s.title)}</h1>
<p class="sheet-desc">${esc(s.description)}</p>
</div>
<dl class="sheet-fields">
<div><dt>Topics</dt><dd>${s.ordered.length}</dd></div>
${s.questionCount ? `<div><dt>Questions</dt><dd>${s.questionCount}</dd></div>` : ''}
<div><dt>Reading time</dt><dd>${minutes(s.minutes)}</dd></div>
<div data-progress="${esc(JSON.stringify(s.ordered.map((t) => t.url)))}" data-progress-always hidden><dt>Reviewed</dt><dd data-progress-text></dd></div>
${s.questionCount ? `<div data-quiz="${esc(quizData(s.ordered))}" data-quiz-always hidden><dt>Exam score</dt><dd data-quiz-text="score"></dd></div>` : ''}
</dl>
</header>
<section class="topics" aria-labelledby="topics-heading">
<h2 id="topics-heading">Review topics</h2>
${groups}
</section>
</main>`;

  return layout({
    site,
    title: `${s.title} | ${site.name}`,
    description: s.description,
    url: s.url,
    subject: s.slug,
    styles: [assets.base, assets.hub, assets.themes[s.slug]],
    scripts: [assets.progress],
    crumbs: [{ label: 'All subjects', href: '/' }, { label: s.title }],
    themeColor: s.design?.palette?.[0] || '#F5F6F8',
    main,
  });
}
