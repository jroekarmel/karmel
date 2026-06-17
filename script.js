(() => {
  const root = document.documentElement;
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  const navLinks = nav ? nav.querySelectorAll('a') : [];
  const themeToggleSelector = '[data-theme-toggle]';
  const navToggleSelector = '.nav-toggle';

  const navMarkup = `
    <nav class="main-nav" id="main-navigation" aria-label="Hauptnavigation">
      <ul>
        <li class="nav-group"><a href="index.html">Homepage</a></li>
        <li class="nav-group"><a href="skapulier-intro.html">Was ist das Skapulier</a></li>
        <li class="nav-group"><a href="skapulier-novene.html">Skapuliernovene</a></li>
        <li class="nav-group nav-group--has-dropdown">
          <a href="skapulierfest.html" class="nav-parent-link" aria-haspopup="true">Skapulierfest</a>
          <div class="dropdown" aria-label="Untermenü Skapulierfest">
            <a href="skapulierfest.html#fest-wien">Wien</a>
            <a href="skapulierfest.html#fest-linz">Linz</a>
          </div>
        </li>
        <li class="nav-group"><a href="wir-karmeliten.html">Über die Karmeliten</a></li>
      </ul>
    </nav>
  `;

  const navMount = document.querySelector('[data-nav-mount]');
  if (navMount) navMount.innerHTML = navMarkup;

  let theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', theme);

  const updateThemeLabel = () => {
    if (!themeToggle) return;
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Hellen Modus aktivieren' : 'Dunklen Modus aktivieren');
    themeToggle.querySelector('.theme-toggle__icon').textContent = theme === 'dark' ? '☀' : '◐';
  };

  updateThemeLabel();

  themeToggle?.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', theme);
    localStorage.setItem('myStyle', theme);
    updateThemeLabel();
  });

  (function () {
    const root = document.documentElement;
    const step = 10;
    const min = 80;
    const max = 160;
    const storageKey = 'fontSizePercent';

    let size = parseInt(localStorage.getItem(storageKey), 10);
    if (Number.isNaN(size)) size = 100;

    function applySize(value) {
      const clamped = Math.min(max, Math.max(min, value));
      root.style.fontSize = clamped + '%';
      localStorage.setItem(storageKey, String(clamped));
      return clamped;
    }

    applySize(size);

    document.querySelector('[data-font-increase]')?.addEventListener('click', function () {
      size = applySize(size + step);
    });

        document.querySelector('[data-font-reset]')?.addEventListener('click', function () {
      size = applySize(100);
    });

    document.querySelector('[data-font-decrease]')?.addEventListener('click', function () {
      size = applySize(size - step);
    });
  })();


  window.onload = function () {
    if (localStorage.getItem('myStyle')) {
      theme = localStorage.getItem('myStyle');
      root.setAttribute ("data-theme", theme);
      updateThemeLabel();
    }
  }



  const closeNav = () => {
    if (!nav || !navToggle) return;
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  navToggle?.addEventListener('click', () => {
    if (!nav) return;
    const isOpen = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 920) closeNav();
    });
  });

  document.addEventListener('click', (event) => {
    if (!nav || !navToggle || window.innerWidth > 920) return;
    const clickedInsideNav = nav.contains(event.target);
    const clickedToggle = navToggle.contains(event.target);
    if (!clickedInsideNav && !clickedToggle) closeNav();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeNav();
  });
})();

 function setupToggle(toggleId, wrapId, openText, closedText) {
  const toggle = document.getElementById(toggleId);
  const wrap = document.getElementById(wrapId);

  if (!toggle || !wrap) return;

  toggle.addEventListener('click', function (event) {
    event.preventDefault();

    const isOpen = this.getAttribute('aria-expanded') === 'true';
    const nextState = !isOpen;

    this.setAttribute('aria-expanded', String(nextState));
    wrap.hidden = !nextState;
    this.textContent = nextState ? openText : closedText;
  });
}
// Event-Rendering
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("event-list");

  try {
    const response = await fetch("events.json");
    if (!response.ok) throw new Error("JSON konnte nicht geladen werden.");

    const data = await response.json();

    container.innerHTML = data.events.map(event => {
      const imageHtml = event.image
        ? `
          <div class="image-zoom">
            <img
              src="${event.image}"
              alt="${event.alt || ""}"
              loading="lazy"
              width="1080"
              height="1080"
            >
          </div>
        `
        : "";

      const scheduleHtml = event.schedule.map(item => `
        <li>
          <time datetime="${event.date}T${item.time}">${item.time} Uhr</time>
          ${item.text}
        </li>
      `).join("");

      const notesHtml = event.notes.map(note => `<p>${note}</p>`).join("");

      const buttonHtml = event.button
        ? `
          <a
            class="button button-primary"
            href="${event.button.href}"
            target="_blank"
            rel="noopener noreferrer"
          >
            ${event.button.label}
          </a>
        `
        : "";

      return `
        <article class="event-card">
          <div class="split-layout">
            <div>
              <p class="section-label">${event.section}</p>
              <h2>${event.title}</h2>
              ${imageHtml}
            </div>

            <div class="event-details">
              <p>
                <strong>Termin:</strong>
                <time datetime="${event.date}">${event.dateLabel}</time>
              </p>

              <ul class="event-program" role="list">
                ${scheduleHtml}
              </ul>

              ${notesHtml}
              ${buttonHtml}
            </div>
          </div>
        </article>
      `;
    }).join("");

  } catch (error) {
    container.innerHTML = `<p>Die Veranstaltungsdaten konnten derzeit nicht geladen werden.</p>`;
    console.error(error);
  }
});

setupToggle('mailchimp-toggle', 'mailchimp-form-wrap', 'Anmeldung schließen', 'Anmeldung / Mailchimp');
setupToggle('beschreibung-toggle', 'beschreibung-wrap', 'Beschreibung schließen', 'Beschreibung');
setupToggle('datenschutz-toggle', 'datenschutz-wrap', 'Datenschutz schließen', 'Datenschutz');
setupToggle('impressum-toggle', 'impressum-wrap', 'Impressum schließen', 'Impressum');

