export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // API routes
    if (path === '/mcu/api/state') {
      if (request.method === 'GET') {
        const seen = await env.MCU_DATA.get('seen');
        return new Response(seen || '[]', {
          headers: { 'Content-Type': 'application/json' },
        });
      }
      if (request.method === 'PUT') {
        const body = await request.json();
        if (!Array.isArray(body)) {
          return new Response(JSON.stringify({ error: 'Expected array' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        await env.MCU_DATA.put('seen', JSON.stringify(body));
        return new Response(JSON.stringify({ ok: true }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response('Method not allowed', { status: 405 });
    }

    // Serve HTML at /mcu
    if (path === '/mcu' || path === '/mcu/') {
      return new Response(HTML, {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' },
      });
    }

    return new Response('Not found', { status: 404 });
  },
};

const FILMS = [
  { phase: 1, title: 'Iron Man', year: 2008 },
  { phase: 1, title: 'The Incredible Hulk', year: 2008 },
  { phase: 1, title: 'Iron Man 2', year: 2010 },
  { phase: 1, title: 'Thor', year: 2011 },
  { phase: 1, title: 'Captain America: The First Avenger', year: 2011 },
  { phase: 1, title: 'The Avengers', year: 2012 },

  { phase: 2, title: 'Iron Man 3', year: 2013 },
  { phase: 2, title: 'Thor: The Dark World', year: 2013 },
  { phase: 2, title: 'Captain America: The Winter Soldier', year: 2014 },
  { phase: 2, title: 'Guardians of the Galaxy', year: 2014 },
  { phase: 2, title: 'Avengers: Age of Ultron', year: 2015 },
  { phase: 2, title: 'Ant-Man', year: 2015 },

  { phase: 3, title: 'Captain America: Civil War', year: 2016 },
  { phase: 3, title: 'Doctor Strange', year: 2016 },
  { phase: 3, title: 'Guardians of the Galaxy Vol. 2', year: 2017 },
  { phase: 3, title: 'Spider-Man: Homecoming', year: 2017 },
  { phase: 3, title: 'Thor: Ragnarok', year: 2017 },
  { phase: 3, title: 'Black Panther', year: 2018 },
  { phase: 3, title: 'Avengers: Infinity War', year: 2018 },
  { phase: 3, title: 'Ant-Man and the Wasp', year: 2018 },
  { phase: 3, title: 'Captain Marvel', year: 2019 },
  { phase: 3, title: 'Avengers: Endgame', year: 2019 },
  { phase: 3, title: 'Spider-Man: Far From Home', year: 2019 },

  { phase: 4, title: 'Black Widow', year: 2021 },
  { phase: 4, title: 'Shang-Chi and the Legend of the Ten Rings', year: 2021 },
  { phase: 4, title: 'Eternals', year: 2021 },
  { phase: 4, title: 'Spider-Man: No Way Home', year: 2021 },
  { phase: 4, title: 'Doctor Strange in the Multiverse of Madness', year: 2022 },
  { phase: 4, title: 'Thor: Love and Thunder', year: 2022 },
  { phase: 4, title: 'Black Panther: Wakanda Forever', year: 2022 },

  { phase: 5, title: 'Ant-Man and the Wasp: Quantumania', year: 2023 },
  { phase: 5, title: 'Guardians of the Galaxy Vol. 3', year: 2023 },
  { phase: 5, title: 'The Marvels', year: 2023 },
  { phase: 5, title: 'Deadpool & Wolverine', year: 2024 },
  { phase: 5, title: 'Captain America: Brave New World', year: 2025 },
  { phase: 5, title: 'Thunderbolts*', year: 2025 },

  { phase: 6, title: 'The Fantastic Four: First Steps', year: 2025 },
  { phase: 6, title: 'Avengers: Doomsday', year: 2026 },
  { phase: 6, title: 'Avengers: Secret Wars', year: 2027 },
];

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>MCU Film Tracker</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #0a0a0f;
    color: #e0e0e0;
    min-height: 100vh;
    padding: 2rem 1rem;
  }

  .container {
    max-width: 720px;
    margin: 0 auto;
  }

  header {
    text-align: center;
    margin-bottom: 2rem;
  }

  header h1 {
    font-size: 2rem;
    font-weight: 700;
    background: linear-gradient(135deg, #e62429, #f0c808);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.5rem;
  }

  .progress {
    font-size: 0.95rem;
    color: #888;
  }

  .progress-bar {
    height: 6px;
    background: #1a1a2e;
    border-radius: 3px;
    margin-top: 0.75rem;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #e62429, #f0c808);
    border-radius: 3px;
    transition: width 0.4s ease;
  }

  .phase {
    margin-bottom: 1.5rem;
  }

  .phase-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #1a1a2e;
  }

  .phase-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #c0c0c0;
  }

  .phase-count {
    font-size: 0.8rem;
    color: #666;
  }

  .film {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.6rem 0.75rem;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.15s;
    user-select: none;
  }

  .film:hover {
    background: #12121f;
  }

  .film.seen {
    opacity: 0.55;
  }

  .checkbox {
    width: 22px;
    height: 22px;
    border: 2px solid #333;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.2s;
  }

  .film.seen .checkbox {
    background: #e62429;
    border-color: #e62429;
  }

  .checkmark {
    display: none;
    color: white;
    font-size: 14px;
    font-weight: bold;
    line-height: 1;
  }

  .film.seen .checkmark {
    display: block;
  }

  .film-info {
    flex: 1;
    min-width: 0;
  }

  .film-title {
    font-size: 0.95rem;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .film-year {
    font-size: 0.8rem;
    color: #666;
  }

  .loading {
    text-align: center;
    padding: 3rem;
    color: #666;
  }

  @media (max-width: 480px) {
    body { padding: 1rem 0.5rem; }
    header h1 { font-size: 1.5rem; }
    .film { padding: 0.5rem; gap: 0.5rem; }
  }
</style>
</head>
<body>
<div class="container">
  <header>
    <h1>MCU Film Tracker</h1>
    <div class="progress"><span id="count">0</span> of <span id="total">0</span> films watched</div>
    <div class="progress-bar"><div class="progress-fill" id="bar"></div></div>
  </header>
  <main id="app"><div class="loading">Loading…</div></main>
</div>
<script>
const FILMS = ${JSON.stringify(FILMS)};
let seen = new Set();
let saving = false;

async function loadState() {
  try {
    const res = await fetch('/mcu/api/state');
    const data = await res.json();
    seen = new Set(data);
  } catch (e) {
    console.error('Failed to load state:', e);
  }
  render();
}

async function saveState() {
  if (saving) return;
  saving = true;
  try {
    await fetch('/mcu/api/state', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([...seen]),
    });
  } catch (e) {
    console.error('Failed to save state:', e);
  }
  saving = false;
}

function toggle(title) {
  if (seen.has(title)) seen.delete(title);
  else seen.add(title);
  render();
  saveState();
}

function render() {
  const phases = {};
  FILMS.forEach(f => {
    if (!phases[f.phase]) phases[f.phase] = [];
    phases[f.phase].push(f);
  });

  const app = document.getElementById('app');
  app.innerHTML = '';

  for (const [phase, films] of Object.entries(phases)) {
    const phaseCount = films.filter(f => seen.has(f.title)).length;
    const section = document.createElement('div');
    section.className = 'phase';
    section.innerHTML =
      '<div class="phase-header">' +
        '<span class="phase-title">Phase ' + phase + '</span>' +
        '<span class="phase-count">' + phaseCount + ' / ' + films.length + '</span>' +
      '</div>';

    films.forEach(f => {
      const el = document.createElement('div');
      el.className = 'film' + (seen.has(f.title) ? ' seen' : '');
      el.onclick = () => toggle(f.title);
      el.innerHTML =
        '<div class="checkbox"><span class="checkmark">✓</span></div>' +
        '<div class="film-info">' +
          '<div class="film-title">' + f.title + '</div>' +
          '<div class="film-year">' + f.year + '</div>' +
        '</div>';
      section.appendChild(el);
    });

    app.appendChild(section);
  }

  document.getElementById('count').textContent = seen.size;
  document.getElementById('total').textContent = FILMS.length;
  document.getElementById('bar').style.width =
    (FILMS.length ? (seen.size / FILMS.length * 100) : 0) + '%';
}

loadState();
</script>
</body>
</html>`;
