// Root dashboard (/) and the 404 page, which shares its look.

import { esc, layout, minutes, plural, quizData } from './layout.mjs';

function subjectRows(subjects, headingLevel) {
  const h = `h${headingLevel}`;
  return `<ul class="subjects">
${subjects.map((s) => `<li class="subject-row"${s.accent ? ` style="--spine:${esc(s.accent)}"` : ''}>
<${h} class="subject-name"><a href="${s.url}">${esc(s.title)}</a></${h}>
<p class="subject-desc">${esc(s.description)}</p>
<dl class="facts">
<div><dt>Topics</dt><dd>${s.ordered.length}</dd></div>
${s.questionCount ? `<div><dt>Questions</dt><dd>${s.questionCount}</dd></div>` : ''}
<div><dt>Reading time</dt><dd>${minutes(s.minutes)}</dd></div>
<div data-progress="${esc(JSON.stringify(s.ordered.map((t) => t.url)))}" hidden><dt>Reviewed</dt><dd data-progress-text></dd></div>
${s.questionCount ? `<div data-quiz="${esc(quizData(s.ordered))}" hidden><dt>Exam score</dt><dd data-quiz-text="score"></dd></div>` : ''}
</dl>
<div class="meter" data-progress-meter="${esc(s.slug)}" hidden><span></span></div>
</li>`).join('\n')}
</ul>`;
}

export function renderDashboard({ site, subjects, assets }) {
  const topicCount = subjects.reduce((n, s) => n + s.ordered.length, 0);
  const main = `<main id="main" class="dash" tabindex="-1">
<div class="dash-intro">
<h1>Review your subjects</h1>
<p class="lede">${subjects.length ? `${plural(subjects.length, 'subject')} and ${plural(topicCount, 'topic')}, in study order. Open a subject, or search across all of them.` : 'No subjects yet. Add a folder of Markdown notes to content-md-files/ and rebuild the site.'}</p>
</div>
<form class="search" role="search" data-search hidden>
<label for="search-input">Search all subjects</label>
<input id="search-input" type="search" name="q" autocomplete="off" spellcheck="false" placeholder="A term, function, or error name" aria-describedby="search-status">
<p id="search-status" class="search-status" data-search-status aria-live="polite"></p>
</form>
<ol class="search-results" data-search-results hidden></ol>
<section class="continue" data-continue hidden aria-labelledby="continue-heading">
<h2 id="continue-heading">Continue where you left off</h2>
<a data-continue-link href="/"></a>
<p data-continue-meta></p>
</section>
${subjects.length ? `<section class="subject-list" aria-labelledby="subjects-heading">
<h2 id="subjects-heading">Subjects</h2>
${subjectRows(subjects, 3)}
</section>` : ''}
</main>`;

  return layout({
    site,
    title: `${site.name}: all subjects`,
    description: subjects.length ? `Review notes for ${subjects.map((s) => s.title).join(', ')}.` : 'Review notes, built from Markdown.',
    url: '/',
    styles: [assets.base, assets.dashboard],
    scripts: [assets.progress, assets.search],
    main,
  });
}

export function renderNotFound({ site, subjects, assets }) {
  const main = `<main id="main" class="dash" tabindex="-1">
<div class="dash-intro">
<h1>This page does not exist</h1>
<p class="lede">The link may be out of date, or the topic was renamed. Pick a subject below, or go to <a href="/">all subjects</a>.</p>
</div>
${subjects.length ? `<section class="subject-list" aria-labelledby="subjects-heading">
<h2 id="subjects-heading">Subjects</h2>
${subjectRows(subjects, 3)}
</section>` : ''}
</main>`;
  return layout({
    site,
    title: `Page not found | ${site.name}`,
    description: 'This page does not exist. Pick a subject to keep reviewing.',
    url: '/404.html',
    styles: [assets.base, assets.dashboard],
    scripts: [assets.progress],
    main,
  });
}
