'use strict';

/* ==========================================================================
   Portfolio renderer
   Reads data.json and builds the page. You should not need to edit this file
   to change your content.
   ========================================================================== */

const DATA_URL = 'data.json';

const DEFAULT_HEADINGS = {
  about: 'About',
  experience: 'Experience',
  projects: 'Projects',
  skills: 'Skills',
  education: 'Education',
  contact: 'Contact',
};

const BUILDERS = {
  about: buildAbout,
  experience: buildExperience,
  projects: buildProjects,
  skills: buildSkills,
  education: buildEducation,
  contact: buildContact,
};

/* --------------------------------------------------------------------------
   Small helpers
   -------------------------------------------------------------------------- */

/** Create an element. Text is always inserted as text, never as HTML. */
function h(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (value === null || value === undefined || value === false) continue;
    if (key === 'class') node.className = value;
    else if (key === 'text') node.textContent = value;
    else node.setAttribute(key, value === true ? '' : value);
  }
  for (const child of children.flat()) {
    if (child === null || child === undefined || child === false) continue;
    node.append(child.nodeType ? child : document.createTextNode(String(child)));
  }
  return node;
}

function link(label, url, className = 'link') {
  const external = /^https?:\/\//i.test(url);
  return h(
    'a',
    {
      class: className,
      href: url,
      target: external ? '_blank' : null,
      rel: external ? 'noopener noreferrer' : null,
    },
    label,
    external ? h('span', { class: 'sr-only', text: ' (opens in a new tab)' }) : null
  );
}

function tagList(tags) {
  if (!Array.isArray(tags) || tags.length === 0) return null;
  return h('ul', { class: 'tags', 'aria-label': 'Technologies' },
    tags.map((tag) => h('li', { class: 'tag', text: tag }))
  );
}

function dateRange(start, end) {
  return [start, end].filter(Boolean).join(' – ');
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

/* --------------------------------------------------------------------------
   Loading data
   -------------------------------------------------------------------------- */

async function loadData() {
  let response;
  try {
    response = await fetch(DATA_URL, { cache: 'no-cache' });
  } catch (cause) {
    const err = new Error('Could not fetch ' + DATA_URL);
    err.kind = 'fetch';
    throw err;
  }
  if (!response.ok) {
    const err = new Error(DATA_URL + ' responded with status ' + response.status);
    err.kind = 'fetch';
    throw err;
  }
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (cause) {
    const err = new Error(cause.message);
    err.kind = 'parse';
    throw err;
  }
}

function renderError(main, err) {
  const isParse = err.kind === 'parse';
  main.replaceChildren(
    h('div', { class: 'wrap load-error' },
      h('h1', { text: isParse ? 'data.json has a syntax error' : "Couldn't load data.json" }),
      isParse
        ? h('p', { text: err.message + '. Common causes are a trailing comma, a missing quote, or a double quote inside text that is not escaped as \\".' })
        : h('p', { text: 'If you opened index.html straight from your files, the browser blocks reading data.json. Serve the folder instead by running this in it:' }),
      isParse ? null : h('pre', {}, h('code', { text: 'python3 -m http.server 8000' })),
      isParse ? null : h('p', { text: 'Then open http://localhost:8000. Hosting the folder on GitHub Pages, Netlify or Vercel also fixes this.' })
    )
  );
}

/* --------------------------------------------------------------------------
   Page-level setup (title, accent, favicon)
   -------------------------------------------------------------------------- */

function applySite(site, profile) {
  if (site.title) document.title = site.title;

  if (site.description) {
    document.querySelector('meta[name="description"]')?.setAttribute('content', site.description);
  }

  if (site.accentColor) {
    document.documentElement.style.setProperty('--accent', site.accentColor);
  }

  setFavicon(profile.name || '', site.accentColor || '#3B3BFF');
}

function setFavicon(name, accent) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => [...word][0])
    .join('')
    .toUpperCase()
    .replace(/[<>&"']/g, '');
  if (!initials) return;

  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' +
    '<rect width="64" height="64" rx="12" fill="' + accent + '"/>' +
    '<text x="32" y="43" text-anchor="middle" font-family="Arial, sans-serif" ' +
    'font-weight="700" font-size="30" fill="#fff">' + initials + '</text></svg>';

  const icon = document.querySelector('link[rel="icon"]');
  if (icon) icon.href = 'data:image/svg+xml,' + encodeURIComponent(svg);
}

/* --------------------------------------------------------------------------
   Navigation and theme
   -------------------------------------------------------------------------- */

function buildThemeToggle() {
  const root = document.documentElement;
  const button = h('button', { class: 'theme-toggle', type: 'button' });

  const sync = () => {
    const dark = root.dataset.theme === 'dark';
    button.textContent = dark ? 'Light' : 'Dark';
    button.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  };

  button.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) { /* storage unavailable */ }
    sync();
  });

  sync();
  return button;
}

function buildNav(name, sections) {
  const nav = document.getElementById('site-nav');
  nav.replaceChildren(
    h('div', { class: 'wrap nav-inner' },
      h('a', { class: 'nav-brand', href: '#top', text: name }),
      h('nav', { class: 'nav-links-wrap', 'aria-label': 'Sections' },
        h('ul', { class: 'nav-links' },
          sections.map((s) => h('li', {}, h('a', { href: '#' + s.id, text: s.heading })))
        )
      ),
      buildThemeToggle()
    )
  );
  nav.hidden = false;
  return [...nav.querySelectorAll('.nav-links a')];
}

/** Marks the nav link for the section currently in view. */
function trackActiveSection(links) {
  if (!('IntersectionObserver' in window)) return;
  const byId = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        links.forEach((a) => a.removeAttribute('aria-current'));
        byId.get(entry.target.id)?.setAttribute('aria-current', 'true');
      }
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );

  document.querySelectorAll('.section').forEach((section) => {
    if (byId.has(section.id)) observer.observe(section);
  });
}

/* --------------------------------------------------------------------------
   Hero
   The name is set in a variable font. It opens light and narrow, settles to
   bold, and then follows the pointer: left is light and narrow, right is
   heavy and wide.
   -------------------------------------------------------------------------- */

function buildHero(profile) {
  const name = profile.name || 'Your Name';

  const title = h('h1', { class: 'hero-name' });
  name.split(/\s+/).filter(Boolean).forEach((word, i, words) => {
    title.append(h('span', { class: 'hero-word', text: word }));
    if (i < words.length - 1) title.append(' ');
  });

  const socials = (profile.socials || []).map((s) => h('li', {}, link(s.label, s.url)));
  if (profile.resumeUrl) {
    socials.push(h('li', {}, link(profile.resumeLabel || 'Résumé', profile.resumeUrl)));
  }

  const hero = h('section', { class: 'hero', id: 'top', 'aria-label': 'Introduction' },
    h('div', { class: 'wrap' },
      title,
      h('div', { class: 'hero-meta' },
        h('div', {},
          profile.role ? h('p', { class: 'hero-role', text: profile.role }) : null,
          profile.tagline ? h('p', { class: 'hero-tagline', text: profile.tagline }) : null
        ),
        h('div', { class: 'hero-aside' },
          profile.location ? h('p', { class: 'hero-location', text: profile.location }) : null,
          profile.availability ? h('p', { class: 'hero-availability', text: profile.availability }) : null,
          socials.length ? h('ul', { class: 'hero-links' }, socials) : null
        )
      )
    )
  );

  animateName(hero, title);
  return hero;
}

function animateName(area, target) {
  const REST = { wght: 700, wdth: 100 };
  const apply = (s) => {
    target.style.fontVariationSettings =
      '"wght" ' + s.wght.toFixed(0) + ', "wdth" ' + s.wdth.toFixed(1) + ', "opsz" 96';
  };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    apply(REST);
    return;
  }

  let current = { wght: 200, wdth: 75 };
  let goal = { ...REST };
  let frame = null;
  apply(current);

  const tick = () => {
    current.wght += (goal.wght - current.wght) * 0.08;
    current.wdth += (goal.wdth - current.wdth) * 0.08;
    apply(current);

    const settled = Math.abs(goal.wght - current.wght) < 0.5 && Math.abs(goal.wdth - current.wdth) < 0.05;
    if (settled) {
      current = { ...goal };
      apply(current);
      frame = null;
      return;
    }
    frame = requestAnimationFrame(tick);
  };
  const run = () => { if (frame === null) frame = requestAnimationFrame(tick); };

  area.addEventListener('pointermove', (event) => {
    const box = area.getBoundingClientRect();
    const x = clamp((event.clientX - box.left) / box.width, 0, 1);
    goal = { wght: 300 + x * 500, wdth: 75 + x * 25 };
    run();
  });
  area.addEventListener('pointerleave', () => {
    goal = { ...REST };
    run();
  });

  // Wait for the font so the opening animation is actually visible.
  const fontReady = document.fonts
    ? Promise.race([
        document.fonts.load('700 96px "Bricolage Grotesque"'),
        new Promise((resolve) => setTimeout(resolve, 1500)),
      ]).catch(() => {})
    : Promise.resolve();
  fontReady.then(run);
}

/* --------------------------------------------------------------------------
   Sections
   -------------------------------------------------------------------------- */

function sectionShell(id, heading, body) {
  return h('section', { class: 'section', id, 'aria-labelledby': id + '-title' },
    h('div', { class: 'wrap section-grid' },
      h('h2', { class: 'section-title', id: id + '-title', text: heading }),
      h('div', { class: 'section-body' }, body)
    )
  );
}

function buildAbout(data) {
  const paragraphs = data.paragraphs || [];
  if (!paragraphs.length) return null;

  return h('div', { class: data.photo ? 'about has-photo' : 'about' },
    h('div', { class: 'prose' }, paragraphs.map((text) => h('p', { text }))),
    data.photo
      ? h('img', { class: 'about-photo', src: data.photo, alt: data.photoAlt || '', loading: 'lazy' })
      : null
  );
}

function entry({ dates, title, org, orgUrl, summary, highlights, tags }) {
  return h('article', { class: 'entry' },
    h('p', { class: 'entry-dates', text: dates }),
    h('div', {},
      h('h3', { class: 'entry-title', text: title }),
      org ? h('p', { class: 'entry-org' }, orgUrl ? link(org, orgUrl) : org) : null,
      summary ? h('p', { class: 'entry-summary', text: summary }) : null,
      highlights && highlights.length
        ? h('ul', { class: 'entry-list' }, highlights.map((text) => h('li', { text })))
        : null,
      tagList(tags)
    )
  );
}

function buildExperience(data) {
  const items = data.items || [];
  if (!items.length) return null;

  return h('div', { class: 'entries' },
    items.map((job) =>
      entry({
        dates: dateRange(job.start, job.end),
        title: job.role,
        org: job.company,
        orgUrl: job.url,
        summary: job.summary,
        highlights: job.highlights,
        tags: job.tags,
      })
    )
  );
}

function buildEducation(data) {
  const items = data.items || [];
  if (!items.length) return null;

  return h('div', { class: 'entries' },
    items.map((item) =>
      entry({
        dates: dateRange(item.start, item.end),
        title: item.degree,
        org: item.school,
        orgUrl: item.url,
        summary: item.note,
      })
    )
  );
}

function buildProjects(data) {
  const items = data.items || [];
  if (!items.length) return null;

  return h('div', { class: 'projects' },
    items.map((project) =>
      h('article', { class: 'project' },
        project.image
          ? h('img', { class: 'project-image', src: project.image, alt: project.imageAlt || '', loading: 'lazy' })
          : null,
        h('div', { class: 'project-head' },
          h('h3', { class: 'project-title', text: project.title }),
          project.year ? h('span', { class: 'project-year', text: project.year }) : null
        ),
        project.description ? h('p', { class: 'project-desc', text: project.description }) : null,
        tagList(project.tags),
        project.links && project.links.length
          ? h('ul', { class: 'project-links' },
              project.links.map((l) => h('li', {}, link(l.label, l.url)))
            )
          : null
      )
    )
  );
}

function buildSkills(data) {
  const groups = data.groups || [];
  if (!groups.length) return null;

  return h('div', { class: 'skills' },
    groups.map((g) =>
      h('div', { class: 'skill-group' },
        h('h3', { class: 'skill-group-title', text: g.group }),
        h('ul', { class: 'skill-list' }, (g.items || []).map((item) => h('li', { text: item })))
      )
    )
  );
}

function buildContact(data) {
  if (!data.email) return null;

  const copyButton = h('button', { class: 'button', type: 'button', 'aria-live': 'polite', text: 'Copy email' });
  copyButton.addEventListener('click', async () => {
    const ok = await copyText(data.email);
    copyButton.textContent = ok ? 'Copied' : 'Copy failed';
    setTimeout(() => { copyButton.textContent = 'Copy email'; }, 2000);
  });

  return h('div', { class: 'contact' },
    data.message ? h('p', { class: 'contact-message', text: data.message }) : null,
    h('a', { class: 'contact-email', href: 'mailto:' + data.email, text: data.email }),
    h('div', { class: 'contact-actions' }, copyButton)
  );
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) { /* fall through to the legacy method */ }

  const box = h('textarea', { readonly: true, style: 'position:fixed;opacity:0' });
  box.value = text;
  document.body.append(box);
  box.select();
  let ok = false;
  try { ok = document.execCommand('copy'); } catch (e) { /* ignore */ }
  box.remove();
  return ok;
}

/* --------------------------------------------------------------------------
   Footer
   -------------------------------------------------------------------------- */

function buildFooter(site, profile) {
  const footer = document.getElementById('site-footer');
  footer.replaceChildren(
    h('div', { class: 'wrap footer-inner' },
      h('p', { text: '© ' + new Date().getFullYear() + ' ' + (profile.name || '') }),
      site.footer ? h('p', { text: site.footer }) : null
    )
  );
  footer.hidden = false;
}

/* --------------------------------------------------------------------------
   Start
   -------------------------------------------------------------------------- */

async function init() {
  const main = document.getElementById('main');

  let data;
  try {
    data = await loadData();
  } catch (err) {
    renderError(main, err);
    return;
  }

  const site = data.site || {};
  const profile = data.profile || {};
  applySite(site, profile);

  const order = Array.isArray(site.sections) && site.sections.length
    ? site.sections
    : Object.keys(BUILDERS);

  const sections = [];
  for (const id of order) {
    const build = BUILDERS[id];
    const config = data[id];
    if (!build || !config) continue;

    const body = build(config);
    if (!body) continue;

    const heading = config.heading || DEFAULT_HEADINGS[id];
    sections.push({ id, heading, node: sectionShell(id, heading, body) });
  }

  main.replaceChildren(buildHero(profile), ...sections.map((s) => s.node));

  const navLinks = buildNav(profile.name || 'Home', sections);
  trackActiveSection(navLinks);
  buildFooter(site, profile);
}

init();
