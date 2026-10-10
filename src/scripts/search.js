// Client-side search over /search-index.json: topic titles, headings,
// questions, and excerpts across every subject.
(() => {
  const form = document.querySelector('[data-search]');
  if (!form) return;
  const input = form.querySelector('input');
  const status = form.querySelector('[data-search-status]');
  const list = document.querySelector('[data-search-results]');
  const MAX = 25;
  let index = null;
  let loading = null;

  form.hidden = false;
  form.addEventListener('submit', (e) => e.preventDefault());

  const load = () => {
    loading = loading || fetch('/search-index.json')
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then((d) => { index = d; })
      .catch(() => { status.textContent = 'Search could not load. Browse the subjects below instead.'; });
    return loading;
  };
  input.addEventListener('focus', load, { once: true });
  input.addEventListener('input', () => load().then(run));

  const norm = (s) => String(s || '').toLowerCase();

  function run() {
    if (!index) return;
    const q = input.value.trim();
    list.replaceChildren();
    if (q.length < 2) { list.hidden = true; status.textContent = ''; return; }
    const terms = norm(q).split(/\s+/).filter(Boolean);
    const has = (s) => { const h = norm(s); return terms.every((t) => h.includes(t)); };

    const results = [];
    for (const t of index.topics) {
      if (has(t.title)) results.push({ score: 4, title: t.title, url: t.url, where: t.subject });
      for (const h of t.headings) if (has(h.text)) results.push({ score: 3, title: h.text, url: `${t.url}#${h.id}`, where: `${t.subject}, ${t.title}` });
      for (const x of t.questions) {
        if (has(x.hay)) results.push({ score: has(x.text) ? 2 : 1.5, title: `Question ${x.n}: ${x.text}`, url: `${t.url}#${x.id}`, where: [t.subject, x.section || t.title].join(', ') });
      }
      if (!has(t.title) && (has(t.summary) || has(t.excerpt))) results.push({ score: 1, title: t.title, url: t.url, where: t.subject });
    }
    results.sort((a, b) => b.score - a.score);

    if (!results.length) {
      list.hidden = true;
      status.textContent = `No matches for “${q}”. Try a shorter word, or browse the subjects below.`;
      return;
    }
    const shown = results.slice(0, MAX);
    status.textContent = results.length > MAX ? `Showing the first ${MAX} of ${results.length} matches.` : `${results.length} ${results.length === 1 ? 'match' : 'matches'}.`;
    const pattern = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    for (const r of shown) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = r.url;
      const title = document.createElement('span');
      title.className = 'result-title';
      highlight(title, r.title, pattern);
      const where = document.createElement('span');
      where.className = 'result-where';
      where.textContent = r.where;
      a.append(title, where);
      li.append(a);
      list.append(li);
    }
    list.hidden = false;
  }

  function highlight(el, text, pattern) {
    text.split(pattern).forEach((part, i) => {
      if (i % 2) { const m = document.createElement('mark'); m.textContent = part; el.append(m); }
      else if (part) el.append(document.createTextNode(part));
    });
  }
})();
