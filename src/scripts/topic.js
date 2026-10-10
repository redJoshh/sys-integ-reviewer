// Topic page enhancements: copy buttons, show/hide all answers, open answers
// for printing, and marking the current section in the table of contents.
(() => {
  // Copy buttons on code blocks.
  // Code inside answer choices is part of the choice, so it gets no button.
  document.querySelectorAll('.prose figure.code:not(.choice figure)').forEach((fig) => {
    const pre = fig.querySelector('pre');
    if (!pre) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy';
    btn.textContent = 'Copy code';
    let timer;
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(pre.textContent);
        btn.textContent = 'Copied';
      } catch {
        btn.textContent = 'Copy failed. Select the code instead.';
      }
      clearTimeout(timer);
      timer = setTimeout(() => { btn.textContent = 'Copy code'; }, 2000);
    });
    fig.append(btn);
  });

  // Show or hide every answer at once.
  const answers = [...document.querySelectorAll('details.answer, details.selftest')];
  const toggle = document.querySelector('[data-toggle-answers]');
  if (toggle && answers.length) {
    const sync = () => {
      const allOpen = answers.every((d) => d.open);
      toggle.textContent = allOpen ? 'Hide all answers' : 'Show all answers';
      toggle.setAttribute('aria-pressed', String(allOpen));
    };
    let bulk = false;
    toggle.addEventListener('click', () => {
      const open = !answers.every((d) => d.open);
      bulk = true;
      answers.forEach((d) => { d.open = open; });
      bulk = false;
      sync();
    });
    answers.forEach((d) => d.addEventListener('toggle', () => { if (!bulk) sync(); }));
    toggle.hidden = false;
    sync();
  }

  // Print every answer, then restore what was open.
  let openBefore = null;
  window.addEventListener('beforeprint', () => {
    openBefore = answers.map((d) => d.open);
    answers.forEach((d) => { d.open = true; });
  });
  window.addEventListener('afterprint', () => {
    if (openBefore) answers.forEach((d, i) => { d.open = openBefore[i]; });
  });

  // Highlight the section being read in the sticky table of contents.
  const links = [...document.querySelectorAll('.toc-side a[href^="#"]')];
  if (!links.length || !('IntersectionObserver' in window)) return;
  const byId = new Map(links.map((a) => [decodeURIComponent(a.hash.slice(1)), a]));
  const headings = [...byId.keys()].map((id) => document.getElementById(id)).filter(Boolean);
  const visible = new Set();
  const update = () => {
    let current = null;
    for (const h of headings) {
      if (h.getBoundingClientRect().top < window.innerHeight * 0.35) current = h;
    }
    links.forEach((a) => a.removeAttribute('aria-current'));
    if (current) byId.get(current.id).setAttribute('aria-current', 'true');
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
    update();
  }, { rootMargin: '0px 0px -60% 0px' });
  headings.forEach((h) => io.observe(h));
  window.addEventListener('scroll', () => { if (!visible.size) update(); }, { passive: true });
})();
