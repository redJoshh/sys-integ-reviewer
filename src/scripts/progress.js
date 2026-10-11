// Study progress in localStorage: reviewed topics and the last topic opened.
(() => {
  const KEY = 'reviewer:progress:v1';
  const load = () => {
    try {
      const d = JSON.parse(localStorage.getItem(KEY));
      return { reviewed: (d && d.reviewed) || {}, last: (d && d.last) || null };
    } catch {
      return { reviewed: {}, last: null };
    }
  };
  const save = (d) => {
    try { localStorage.setItem(KEY, JSON.stringify(d)); } catch { /* storage full or blocked */ }
  };

  // Topic page: remember the visit and wire up "Mark as reviewed".
  const topic = document.querySelector('[data-topic]');
  if (topic) {
    const url = topic.dataset.topicUrl;
    const d = load();
    d.last = { url, title: topic.dataset.topicTitle, subject: topic.dataset.subjectTitle, at: Date.now() };
    save(d);

    const buttons = document.querySelectorAll('[data-mark]');
    const render = () => {
      const on = Boolean(load().reviewed[url]);
      buttons.forEach((b) => {
        b.hidden = false;
        b.setAttribute('aria-pressed', String(on));
        b.textContent = on ? 'Reviewed' : 'Mark as reviewed';
      });
    };
    buttons.forEach((b) => b.addEventListener('click', () => {
      const fresh = load();
      if (fresh.reviewed[url]) delete fresh.reviewed[url];
      else fresh.reviewed[url] = Date.now();
      save(fresh);
      render();
    }));
    render();
  }

  const data = load();

  // Hub: fill the bubble of each reviewed topic.
  document.querySelectorAll('[data-topic-item]').forEach((li) => {
    if (!data.reviewed[li.dataset.topicUrl]) return;
    li.classList.add('is-reviewed');
    const status = li.querySelector('[data-status]');
    if (status) status.hidden = false;
  });

  // Dashboard and hub: "n of m" per subject.
  document.querySelectorAll('[data-progress]').forEach((el) => {
    let urls = [];
    try { urls = JSON.parse(el.dataset.progress); } catch { return; }
    const done = urls.filter((u) => data.reviewed[u]).length;
    if (!done && !('progressAlways' in el.dataset)) return;
    el.hidden = false;
    const text = el.querySelector('[data-progress-text]');
    if (text) text.textContent = `${done} of ${urls.length}`;
    const meter = el.closest('li') && el.closest('li').querySelector('[data-progress-meter]');
    if (meter) {
      meter.hidden = false;
      meter.style.setProperty('--done', `${Math.round((done / urls.length) * 100)}%`);
      meter.setAttribute('role', 'img');
      meter.setAttribute('aria-label', `${done} of ${urls.length} topics reviewed`);
    }
  });

  // Dashboard and hub: exam scores, totalled from the answers quiz.js saves
  // per topic under reviewer:quiz:v1:<topic url>.
  const quizCache = new Map();
  const quizFor = (url) => {
    if (!quizCache.has(url)) {
      let saved = {};
      try { saved = JSON.parse(localStorage.getItem(`reviewer:quiz:v1:${url}`)) || {}; } catch { /* ignore */ }
      const answers = Object.values(saved).filter((a) => a && typeof a.right === 'boolean');
      quizCache.set(url, { answered: answers.length, right: answers.filter((a) => a.right).length });
    }
    return quizCache.get(url);
  };
  const pct = (n, d) => `${Math.round((n / d) * 100)}%`;

  document.querySelectorAll('[data-quiz]').forEach((el) => {
    let topics = [];
    try { topics = JSON.parse(el.dataset.quiz); } catch { return; }
    let answered = 0;
    let right = 0;
    let total = 0;
    for (const t of topics) {
      const q = quizFor(t.url);
      answered += Math.min(q.answered, t.total);
      right += Math.min(q.right, t.total);
      total += t.total;
    }
    if (!answered && !('quizAlways' in el.dataset)) return;
    const out = el.dataset.quizText ? el : el.querySelector('[data-quiz-text]');
    if (!out) return;
    const kind = out.dataset.quizText;
    if (kind === 'answered') out.textContent = `${answered} of ${total}`;
    else if (kind === 'score') {
      if (!answered) out.textContent = 'Not started';
      else {
        out.textContent = pct(right, answered);
        const sub = document.createElement('span');
        sub.className = 'fact-sub';
        sub.textContent = answered < total ? `${right} of ${answered} correct, ${total - answered} left` : `${right} of ${total} correct, finished`;
        out.append(sub);
      }
    }
    else if (kind === 'summary') {
      out.textContent = answered < total
        ? `Exam: ${right} of ${answered} correct, ${total - answered} left`
        : `Exam finished: ${right} of ${total} correct (${pct(right, total)})`;
    }
    el.hidden = false;
  });

  // Dashboard: continue where you left off.
  const cont = document.querySelector('[data-continue]');
  if (cont && data.last && data.last.url) {
    const link = cont.querySelector('[data-continue-link]');
    // Saved URLs are site-relative; the site may live under a folder.
    link.href = (document.documentElement.dataset.base || '') + data.last.url;
    link.textContent = data.last.title;
    const reviewed = data.reviewed[data.last.url] ? 'You marked it as reviewed.' : 'Not marked as reviewed yet.';
    cont.querySelector('[data-continue-meta]').textContent = `${data.last.subject}. ${reviewed}`;
    cont.hidden = false;
  }
})();
