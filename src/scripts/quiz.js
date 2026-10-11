// Exam mode: pick answers, check them, and keep a running score. Answers are
// saved per topic in localStorage. Without JS the questions still work as
// show/hide answer keys.
(() => {
  const prose = document.querySelector('.prose');
  const questions = prose ? [...prose.querySelectorAll('.q')] : [];
  if (!questions.length) return;

  const page = document.querySelector('[data-topic]');
  const KEY = `reviewer:quiz:v1:${page ? page.dataset.topicUrl : location.pathname}`;
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch { /* storage blocked */ } };
  let saved = load();

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  };

  const items = [];

  const addControls = (q, after, hint) => {
    const controls = el('div', 'q-controls');
    const btn = el('button', 'btn btn-small', 'Check answer');
    btn.type = 'button';
    controls.append(btn);
    if (hint) controls.append(el('p', 'q-hint', hint));
    const feedback = el('p', 'q-feedback');
    feedback.setAttribute('role', 'status');
    controls.append(feedback);
    after.after(controls);
    q.classList.add('is-quiz');
    return { btn, feedback };
  };

  const wire = (item) => {
    items.push(item);
    item.btn.addEventListener('click', () => (item.result ? reset(item, true) : check(item)));
    item.inputs.forEach((input) => {
      input.addEventListener('change', () => { if (!item.result) item.feedback.textContent = ''; });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !item.result) { e.preventDefault(); check(item); }
      });
    });
    // Opening the answer before checking shows it without scoring it.
    if (item.details) item.details.addEventListener('toggle', () => { if (!item.result) reveal(item, item.details.open); });
  };

  // Matching question: a letter dropdown for each term.
  const setupMatch = (q) => {
    const rows = [...q.querySelectorAll('.match-row')];
    const letters = [...q.querySelectorAll('.match-option .bubble')].map((b) => b.textContent.trim());
    if (rows.length < 2 || !letters.length) return;
    const inputs = rows.map((row, i) => {
      const select = el('select', 'match-select');
      select.id = `${q.id}-m${i}`;
      const label = el('label', 'visually-hidden', `Letter for ${row.querySelector('.match-term').textContent.trim()}`);
      label.htmlFor = select.id;
      select.append(new Option('Choose', ''), ...letters.map((l) => new Option(l, l)));
      row.querySelector('.match-slot').append(label, select);
      return select;
    });
    const { btn, feedback } = addControls(q, q.querySelector('.match-pool'), 'Choose a letter for each term.');
    wire({ kind: 'match', q, rows, inputs, answers: rows.map((r) => r.dataset.answer), btn, feedback, details: q.querySelector('details.answer'), result: null });
  };

  // Fill-in-the-blank: a text box in place of the blank, or one labelled box
  // per lettered blank ([a], [b], ...) under a code snippet.
  const norm = (s) => s.trim().toLowerCase()
    .replace(/^[`'"]+|[`'"]+$/g, '')
    .replace(/\s+/g, ' ')
    .replace(/^\$/, '')
    .replace(/\(\)$/, '')
    .replace(/[/;]$/, '');

  const inlineBlank = (q, input) => {
    // Swap the "______" in the question text for the text box.
    const walker = document.createTreeWalker(q.querySelector('.q-stem'), NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const m = node.data.match(/_{4,}/);
      if (!m) continue;
      const after = node.splitText(m.index);
      after.data = after.data.slice(m[0].length);
      after.before(input);
      return true;
    }
    return false;
  };

  const setupBlank = (q) => {
    let blanks;
    try { blanks = JSON.parse(q.dataset.blanks); } catch { return; }
    if (!Array.isArray(blanks) || !blanks.length) return;
    const num = q.querySelector('.q-num') ? q.querySelector('.q-num').textContent.trim() : '';
    const inputs = blanks.map((b, i) => {
      const input = el('input', 'blank-input');
      input.type = 'text';
      input.id = `${q.id}-b${i}`;
      input.autocomplete = 'off';
      input.spellcheck = false;
      input.setAttribute('autocapitalize', 'off');
      return input;
    });
    let after = q.querySelector('.q-extra') || q.querySelector('.q-stem');
    if (blanks.length === 1 && !blanks[0].label && inlineBlank(q, inputs[0])) {
      inputs[0].setAttribute('aria-label', `Your answer for question ${num}`);
    } else {
      const grid = el('div', 'blank-grid');
      inputs.forEach((input, i) => {
        const row = el('div', 'blank-row');
        const label = el('label', 'blank-label', blanks[i].label ? `[${blanks[i].label}]` : 'Your answer');
        label.htmlFor = input.id;
        row.append(label, input);
        grid.append(row);
      });
      after.after(grid);
      after = grid;
    }
    const { btn, feedback } = addControls(q, after, blanks.length > 1 ? `Fill in all ${blanks.length} blanks.` : '');
    wire({ kind: 'blank', q, inputs, blanks, btn, feedback, details: q.querySelector('details.answer'), result: null });
  };

  const blankRight = (blank, value) => blank.accept.some((a) => norm(a) === norm(value));

  questions.forEach((q) => {
    if (q.classList.contains('q-match')) { setupMatch(q); return; }
    if (q.classList.contains('q-blank')) { setupBlank(q); return; }
    const choices = [...q.querySelectorAll('.choice')];
    const correct = choices.map((c, i) => (c.classList.contains('is-correct') ? i : -1)).filter((i) => i >= 0);
    if (!choices.length || !correct.length) return; // nothing to grade against
    const multi = correct.length > 1;

    const stem = q.querySelector('.q-stem');
    if (stem && !stem.id) stem.id = `${q.id}-stem`;
    const list = q.querySelector('.choices');
    list.setAttribute('role', multi ? 'group' : 'radiogroup');
    if (stem) list.setAttribute('aria-labelledby', stem.id);

    const inputs = choices.map((li, i) => {
      const label = el('label', 'choice-label');
      const input = el('input', 'choice-input');
      input.type = multi ? 'checkbox' : 'radio';
      input.name = q.id;
      input.value = String(i);
      label.append(input, ...li.childNodes);
      li.append(label);
      return input;
    });

    const { btn, feedback } = addControls(q, list, multi ? `Choose ${correct.length} answers.` : '');
    wire({ kind: 'choice', q, choices, inputs, correct, multi, btn, feedback, details: q.querySelector('details.answer'), result: null });
  });

  if (!items.length) return;

  function check(item) {
    if (item.kind === 'blank') {
      const picked = item.inputs.map((i) => i.value.trim());
      if (picked.some((v) => !v)) {
        item.feedback.textContent = item.inputs.length > 1 ? 'Fill in every blank first.' : 'Type an answer first.';
        return;
      }
      const right = picked.every((v, i) => blankRight(item.blanks[i], v));
      apply(item, picked, right);
      saved[item.q.id] = { picked, right };
      save();
      updateScore();
      return;
    }
    if (item.kind === 'match') {
      const picked = item.inputs.map((s) => s.value);
      if (picked.some((v) => !v)) { item.feedback.textContent = 'Choose a letter for every term first.'; return; }
      const right = picked.every((v, i) => v === item.answers[i]);
      apply(item, picked, right);
      saved[item.q.id] = { picked, right };
      save();
      updateScore();
      return;
    }
    const picked = item.inputs.filter((i) => i.checked).map((i) => Number(i.value));
    const need = item.correct.length;
    if (!picked.length) {
      item.feedback.textContent = item.multi ? `Choose ${need} answers first.` : 'Choose an answer first.';
      return;
    }
    if (item.multi && picked.length !== need) {
      item.feedback.textContent = `Choose ${need} answers. You have ${picked.length}.`;
      return;
    }
    const right = picked.every((i) => item.correct.includes(i));
    apply(item, picked, right);
    saved[item.q.id] = { picked, right };
    save();
    updateScore();
  }

  function apply(item, picked, right) {
    item.result = right ? 'right' : 'wrong';
    item.q.classList.remove('is-revealed');
    item.q.classList.add('is-checked', right ? 'is-right' : 'is-wrong');
    if (item.kind === 'blank') {
      const missed = [];
      item.inputs.forEach((input, i) => {
        const good = blankRight(item.blanks[i], picked[i]);
        input.value = picked[i];
        input.disabled = true;
        input.classList.add(good ? 'is-blank-right' : 'is-blank-wrong');
        if (!good) missed.push(`${item.blanks[i].label ? `[${item.blanks[i].label}] ` : ''}${item.blanks[i].accept[0]}`);
      });
      const ok = item.inputs.length - missed.length;
      if (right) item.feedback.textContent = 'Correct.';
      else if (item.inputs.length === 1) item.feedback.textContent = `Not quite. The answer is ${missed[0]}.`;
      else item.feedback.textContent = `${ok} of ${item.inputs.length} blanks correct. Missed: ${missed.join(', ')}.`;
    } else if (item.kind === 'match') {
      let ok = 0;
      item.rows.forEach((row, i) => {
        const good = picked[i] === item.answers[i];
        if (good) ok += 1;
        item.inputs[i].value = picked[i];
        item.inputs[i].disabled = true;
        row.classList.add(good ? 'is-match-right' : 'is-match-wrong');
        if (!good) row.querySelector('.match-slot').append(el('span', 'pick-note', `Answer: ${item.answers[i]}`));
      });
      item.feedback.textContent = right ? 'Correct.' : `${ok} of ${item.rows.length} matched. The right letters are shown.`;
    } else {
      item.inputs.forEach((input, i) => { input.checked = picked.includes(i); input.disabled = true; });
      item.choices.forEach((li, i) => {
        if (!picked.includes(i)) return;
        li.classList.add('is-picked');
        li.querySelector('.choice-text').append(el('span', 'pick-note', 'Your answer'));
      });
      item.feedback.textContent = right ? 'Correct.' : 'Incorrect. The right answer is highlighted.';
    }
    item.btn.textContent = 'Try again';
    item.btn.hidden = false;
    if (item.details) item.details.open = true;
  }

  function reset(item, user) {
    item.result = null;
    item.q.classList.remove('is-checked', 'is-right', 'is-wrong', 'is-revealed');
    item.inputs.forEach((input) => {
      input.checked = false;
      if (input.tagName === 'SELECT' || item.kind === 'blank') input.value = '';
      input.disabled = false;
      input.classList.remove('is-blank-right', 'is-blank-wrong');
    });
    (item.kind === 'match' ? item.rows : item.kind === 'blank' ? [] : item.choices).forEach((li) => {
      li.classList.remove('is-picked', 'is-match-right', 'is-match-wrong');
      const note = li.querySelector('.pick-note');
      if (note) note.remove();
    });
    item.feedback.textContent = '';
    item.btn.textContent = 'Check answer';
    item.btn.hidden = false;
    if (item.details) item.details.open = false;
    if (user) {
      delete saved[item.q.id];
      save();
      updateScore();
      item.inputs[0].focus();
    }
  }

  function reveal(item, shown) {
    item.q.classList.toggle('is-revealed', shown);
    item.inputs.forEach((input) => { input.disabled = shown; });
    item.btn.hidden = shown;
    item.feedback.textContent = shown ? 'Answer shown, so this one is not scored. Hide it to try the question.' : '';
  }

  // Score bar, pinned to the bottom of the question column.
  const bar = el('div', 'scorebar');
  bar.setAttribute('role', 'region');
  bar.setAttribute('aria-label', 'Your score');
  const scoreText = el('p', 'scorebar-text');
  const resetAll = el('button', 'btn btn-small', 'Reset answers');
  resetAll.type = 'button';
  bar.append(scoreText, resetAll);
  prose.append(bar);

  resetAll.addEventListener('click', () => {
    const answered = items.filter((i) => i.result).length;
    if (!window.confirm(`Clear your ${answered} ${answered === 1 ? 'answer' : 'answers'} on this page and start over?`)) return;
    items.forEach((i) => reset(i, false));
    saved = {};
    save();
    updateScore();
    window.scrollTo({ top: 0 });
  });

  // Group questions by the H2 section they sit under, for the table of contents.
  const sections = new Map();
  let current = null;
  for (const node of prose.children) {
    if (node.tagName === 'H2') { current = node.id; sections.set(current, []); continue; }
    const item = items.find((i) => i.q === node);
    if (item && current) sections.get(current).push(item);
  }

  function updateScore() {
    const answered = items.filter((i) => i.result).length;
    const right = items.filter((i) => i.result === 'right').length;
    const total = items.length;
    if (!answered) scoreText.textContent = `${total} questions. Pick an answer, then check it.`;
    else if (answered < total) scoreText.textContent = `${right} of ${answered} correct. ${total - answered} to go.`;
    else scoreText.textContent = `Finished: ${right} out of ${total} correct (${Math.round((right / total) * 100)}%).`;
    resetAll.hidden = !answered;

    for (const [id, list] of sections) {
      if (!list.length) continue;
      const done = list.filter((i) => i.result).length;
      const ok = list.filter((i) => i.result === 'right').length;
      const label = done ? `${done} of ${list.length} answered, ${ok} correct` : `${list.length} ${list.length === 1 ? 'question' : 'questions'}`;
      document.querySelectorAll(`.toc a[href="#${CSS.escape(id)}"] .toc-count`).forEach((c) => { c.textContent = label; });
    }
  }

  // Restore saved answers.
  for (const item of items) {
    const s = saved[item.q.id];
    if (!s || !Array.isArray(s.picked)) continue;
    if (item.kind === 'blank') {
      if (s.picked.length !== item.inputs.length || !s.picked.every((v) => typeof v === 'string' && v)) continue;
      apply(item, s.picked, s.picked.every((v, i) => blankRight(item.blanks[i], v)));
      continue;
    }
    if (item.kind === 'match') {
      // Only restore if every saved letter still exists (the notes may have changed).
      const valid = s.picked.length === item.rows.length && s.picked.every((v) => [...item.inputs[0].options].some((o) => o.value && o.value === v));
      if (valid) apply(item, s.picked, s.picked.every((v, i) => v === item.answers[i]));
      continue;
    }
    const picked = s.picked.filter((i) => Number.isInteger(i) && i >= 0 && i < item.inputs.length);
    if (!picked.length) continue;
    apply(item, picked, picked.length === item.correct.length && picked.every((i) => item.correct.includes(i)));
  }
  updateScore();
})();
