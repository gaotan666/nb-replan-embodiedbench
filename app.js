(() => {
  const data = window.SHOWCASE_DATA;
  if (!data) throw new Error('Missing showcase data');
  const fmt = number => Number(number).toFixed(1);
  for (const key of ['alfred', 'habitat']) {
    const body = document.getElementById(`${key}-rows`);
    const local = data.benchmarks[key];
    const rows = [{name: 'NB-Replan（本地）', total: local.total,
      successes: local.successes, avg: local.avg, six: local.six}, ...local.references];
    for (const row of rows) {
      const tr = document.createElement('tr');
      for (const value of [row.name, row.total, row.successes,
        fmt(row.avg), ...row.six.map(fmt)]) {
        const td = document.createElement('td'); td.textContent = value; tr.append(td);
      }
      body.append(tr);
    }
  }

  function createDemo(key, demo) {
    const card = document.createElement('article'); card.className = 'demo';
    const title = document.createElement('h4'); title.textContent = demo.title;
    const instruction = document.createElement('p'); instruction.className = 'instruction';
    instruction.textContent = `任务：${demo.instruction}`;
    const frame = document.createElement('div'); frame.className = 'frame';
    const image = document.createElement('img'); image.alt = demo.title; frame.append(image);
    const step = document.createElement('p'); step.className = 'step';
    const action = document.createElement('p'); action.className = 'action';
    const memory = document.createElement('p'); memory.className = 'memory';
    const controls = document.createElement('div'); controls.className = 'controls';
    const back = document.createElement('button'); back.type = 'button'; back.textContent = '上一步';
    const play = document.createElement('button'); play.type = 'button'; play.className = 'play'; play.textContent = '播放';
    const next = document.createElement('button'); next.type = 'button'; next.textContent = '下一步';
    controls.append(back, play, next);
    const slider = document.createElement('input'); slider.className = 'slider'; slider.type = 'range';
    slider.min = 0; slider.max = demo.frames.length - 1; slider.value = 0;
    slider.setAttribute('aria-label', `${demo.title} 回放进度`);
    card.append(title, instruction, frame, step, action, memory, controls, slider);
    document.getElementById(`${key}-demos`).append(card);
    let position = 0, timer = null, fadeTimer = null, token = 0;
    function stop() { if (timer) clearInterval(timer); timer = null; play.textContent = '播放'; }
    function show(index, smooth) {
      position = Math.max(0, Math.min(demo.frames.length - 1, index));
      const current = demo.frames[position]; const currentToken = ++token;
      if (fadeTimer) clearTimeout(fadeTimer);
      if (smooth) {
        image.style.opacity = '.35';
        fadeTimer = setTimeout(() => {
          if (token !== currentToken) return;
          image.src = current.image; image.style.opacity = '1';
        }, 180);
      } else { image.src = current.image; image.style.opacity = '1'; }
      image.alt = `${demo.environment} 第 ${position} 步仿真画面`;
      step.textContent = `第 ${position} / ${demo.frames.length - 1} 步`;
      action.textContent = current.action;
      slider.value = position;
      memory.hidden = !current.memory;
      if (current.memory) memory.textContent = current.memory.replaced_action
        ? `约束修补：${current.memory.replaced_action} → ${current.action}`
        : `约束库参与规划 · ${current.memory.operator || 'obey'}`;
    }
    back.addEventListener('click', () => { stop(); show(position - 1, true); });
    next.addEventListener('click', () => { stop(); show(position + 1, true); });
    slider.addEventListener('input', event => { stop(); show(Number(event.target.value), true); });
    play.addEventListener('click', () => {
      if (timer) { stop(); return; }
      if (position === demo.frames.length - 1) show(0, false);
      play.textContent = '暂停';
      timer = setInterval(() => {
        if (position >= demo.frames.length - 1) { stop(); return; }
        show(position + 1, true);
      }, 1900);
    });
    show(0, false);
  }
  for (const [key, demo] of Object.entries(data.demos))
    createDemo(key.startsWith('alfred') ? 'alfred' : 'habitat', demo);
})();
