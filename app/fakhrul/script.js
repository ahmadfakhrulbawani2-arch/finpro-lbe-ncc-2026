import PortfolioData from './db/main.json' with { type: 'json' };

// lenis
// Initialize Lenis
const lenis = new Lenis({
  autoRaf: true,
  duration: 1.2,
  smoothWheel: true,
  smoothTouch: false,
  wheelMultiplier: 1,
  touchMultiplier: 1,
  easing: (t) => 1 - Math.pow(1 - t, 3),
});

const icon = (name, size = 20) => {
  const paths = {
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    github:
      '<path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.18-3.37-1.18-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.54 1.04 1.54 1.04.9 1.54 2.35 1.1 2.92.84.09-.65.35-1.1.64-1.36-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03A9.54 9.54 0 0 1 12 6.8c.85 0 1.7.11 2.5.34 1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.85-2.35 4.69-4.58 4.94.36.31.68.9.68 1.8v2.67c0 .26.18.57.69.47A10 10 0 0 0 12 2Z"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.07.07l2-2a5 5 0 0 0-7.07-7.07l-1.15 1.15M14 11a5 5 0 0 0-7.07-.07l-2 2A5 5 0 0 0 12 20l1.15-1.15"/>',
    spark:
      '<path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2Z"/>',
  };
  return `<svg
      width="${size}"
      height="${size}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      ${paths[name]}
    </svg>`;
};

function techIcon(label) {
  const short = {
    Java: '/public/icons/java-icon.png',
    Python: '/public/icons/Python-logo-notext.svg.webp',
    'C++': '/public/icons/ISO_C++_Logo.svg.webp',
    C: '/public/icons/C_Programming_Language.svg.webp',
    'C#': '/public/icons/Logo_C_sharp.svg.webp',
    Go: '/public/icons/Go-Logo_Blue.svg',
    NextJS: '/public/icons/next-js-icon.png',
    ReactJs: '/public/icons/React-icon.svg.webp',
    'Gin Gonic': '/public/icons/gin-icon.svg',
    ExpressJs: '/public/icons/expressjs-icon.png',
  };
  return short[label] || label.slice(0, 2);
}

function render(data) {
  const projects = data.projects
    .map(
      (project, index) => `
    <article class="project-card project-${index + 1}">
      <div class="project-image"><img src="${project.image}" alt="${project.imageAlt}" loading="lazy"><span class="project-number">0${index + 1}</span></div>
      <div class="project-copy"><h3>${project.title}</h3><p>${project.description}</p>
        <div class="project-links">
          ${project.github ? `<a href="${project.github}" target="_blank" rel="noreferrer">${icon('github', 17)} Code</a>` : ''}
          ${project.demo ? `<a class="demo-link" href="${project.demo}" target="_blank" rel="noreferrer">Live demo ${icon('arrow', 16)}</a>` : ''}
        </div>
      </div>
    </article>`
    )
    .join('');
  return `
    <nav class="topbar">
      <a class="wordmark" href="#home"
        ><span>✦</span>${data.profile.firstName}<b>.</b></a
      >
      <div class="nav-links">
        <a href="#about">About</a><a href="#stack">Stack</a
        ><a href="#projects">Projects</a>
      </div>
      <a class="nav-hello" href="#contact">Say hello <span>↗</span></a>
    </nav>
    <main>
      <section class="hero section-shell" id="home">
        <div class="hero-copy">
          <p class="eyebrow"><span></span> Available for interesting things</p>
          <h1>${data.profile.heroTitle}</h1>
          <p class="hero-description">${data.profile.heroDescription}</p>
          <div class="hero-actions">
            <a class="button button-dark" href="#projects"
              >See my work ${icon('arrow', 18)}</a
            ><a class="text-link" href="#contact"
              >Let’s make a thing <span>↓</span></a
            >
          </div>
        </div>
        <div class="hero-art">
          <div class="sun"></div>
          <div class="cloud cloud-one">☁</div>
          <div class="cloud cloud-two">☁</div>
          <div class="orbit orbit-one"></div>
          <div class="orbit orbit-two"></div>
          <div class="hero-sticker">
            <span>CODE</span><strong>+</strong><span>CREATE</span>
          </div>
          <div class="planet-face">
            <div class="eye left"></div>
            <div class="eye right"></div>
            <div class="smile"></div>
          </div>
          <div class="star star-one">✦</div>
          <div class="star star-two">✦</div>
        </div>
      </section>
      <section class="about section-shell" id="about">
        <div class="section-label">01 — ABOUT ME</div>
        <div class="about-grid">
          <div class="photo-frame">
            <div class="tape">hello!</div>
            <img src="${data.profile.photo}" alt="${data.profile.photoAlt}" />
            <div class="flower">✿</div>
          </div>
          <div class="about-copy">
            <p class="kicker">A little intro</p>
            <h2>${data.profile.aboutTitle}</h2>
            <p>${data.profile.aboutText}</p>
            <div class="currently">
              <span class="pin"></span>
              <div><b>Currently</b><br />${data.profile.currently}</div>
            </div>
          </div>
        </div>
      </section>
      <section class="stack section-shell" id="stack">
        <div class="section-label">02 — MY TOOLBOX</div>
        <div class="stack-head">
          <h2>Tech I enjoy<br /><em>playing with.</em></h2>
          <p>
            A practical stack for turning curious ideas into fast, friendly
            digital experiences.
          </p>
        </div>
        <div class="tech-grid">
          ${data.techStack
            .map(
              (tech, i) => `
          <div class="tech-chip chip-${i % 6} chip-d-${i % 2}">
            <span><img src="${techIcon(tech)}" class="tech-icon"></span>${tech}
          </div>
          `
            )
            .join('')}
        </div>
      </section>
      <section class="projects section-shell" id="projects">
        <div class="projects-title">
          <div class="section-label">03 — SELECTED WORK</div>
          <h2>Things I’ve<br />made <span>so far.</span></h2>
          <div class="scribble">↘</div>
        </div>
        <div class="project-grid">${projects}</div>
      </section>
      <section class="contact section-shell" id="contact">
        <div class="contact-card">
          <div class="contact-doodle"><span>✉</span></div>
          <p class="eyebrow"><span></span> Got an idea?</p>
          <h2>Let’s make something <em>nice.</em></h2>
          <p>${data.profile.contactBlurb}</p>
          <form id="contact-form">
            <label
              ><span>Your name</span
              ><input
                required
                name="name"
                placeholder="What should I call you?" /></label
            ><label
              ><span>Your email</span
              ><input
                required
                type="email"
                name="email"
                placeholder="you@example.com" /></label
            ><label class="full"
              ><span>Your message</span
              ><textarea
                required
                name="message"
                placeholder="Tell me a little about your idea..."
              ></textarea></label
            ><button class="button button-coral" type="submit">
              Send it my way ${icon('arrow', 18)}
            </button>
            <p class="form-note" aria-live="polite"></p>
          </form>
        </div>
      </section>
    </main>
    <footer>
      <a class="wordmark" href="#home"
        ><span>✦</span>${data.profile.firstName}<b>.</b></a
      >
      <p>Made with a suspicious amount of ☕ and curiosity.</p>
      <div>
        <a href="${data.social.github}" target="_blank" rel="noreferrer"
          >GitHub</a
        ><a href="${data.social.linkedin}" target="_blank" rel="noreferrer"
          >LinkedIn</a
        >
      </div>
    </footer>`;
}

async function mountPortfolio(root) {
  try {
    const data = PortfolioData;
    root.innerHTML = render(data);
    root.querySelector('#contact-form').addEventListener('submit', (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const message = form.querySelector('.form-note');
      message.textContent = `Thanks, ${new FormData(form).get('name')} — your note is ready to send!`;
      form.reset();
    });
  } catch (error) {
    root.innerHTML =
      '<p class="load-error">Portfolio data could not be loaded. Please try refreshing.</p>';
  }
}

mountPortfolio(document.querySelector('#root'));
