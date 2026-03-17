/* ============================================================
   script.js — Aby Kuruvilla Portfolio
   ============================================================ */

/* ── INTRO ANIMATION ── */
document.addEventListener('DOMContentLoaded', () => {

  /* ── INTRO LOGO ── */
  const host = document.getElementById('intro-logo-host');
  if (host && window.AKLogo) {
    AKLogo.launch(host, { size: 140, delay: 0 });
  }

  /* ── INTRO TEXT CHARACTER ANIMATION ── */
  /* FIX: moved inside DOMContentLoaded so introEl exists when queried */
  const introText = "Aby Kuruvilla";
  const introEl   = document.getElementById('intro-text');
  if (introEl) {
    [...introText].forEach((ch, i) => {
      const span = document.createElement('span');
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      span.style.animationDelay = `${0.05 * i}s`;
      introEl.appendChild(span);
    });
  }

  /* ── NAV LOGO (fires after intro overlay fades) ── */
  /* Guarded with null check; kept in case a #nav-logo-host element is added later */
  setTimeout(() => {
    const navHost = document.getElementById('nav-logo-host');
    if (navHost && window.AKLogo) {
      AKLogo.launch(navHost, { size: 36, delay: 500 });
    }
  }, 2800);

  /* ── NAV LOGO STROKE ANIMATION — continuous loop with 5s gap ──
     Draws the AK strokes sequentially, holds them visible, then
     resets and repeats every (draw duration + 5s hold + fade out).
     Runs on the inline SVG already in the HTML nav.
  ── */
  (function navLogoLoop() {

    // Strokes in draw order: [id, dashLength, delayMs]
    const strokes = [
      ['nav-aL',  80, 0],
      ['nav-kV',  80, 80],
      ['nav-aR',  80, 160],
      ['nav-kU',  80, 260],
      ['nav-aCB', 40, 380],
      ['nav-kD',  80, 440],
    ];
    const dots    = ['nav-dA', 'nav-dK'];
    const DRAW_DONE   = 700;  // ms — all strokes finished drawing
    const HOLD        = 5000; // ms — stay visible
    const FADE_OUT    = 350;  // ms — fade/reset duration
    const CYCLE       = DRAW_DONE + HOLD + FADE_OUT + 200; // total cycle length

    function drawStrokes() {
      // Draw phase — set dashoffset → 0 on each stroke with staggered delay
      strokes.forEach(([id, , delay]) => {
        setTimeout(() => {
          const el = document.getElementById(id);
          if (!el) return;
          el.style.transition = 'stroke-dashoffset 0.55s cubic-bezier(.4,0,.2,1)';
          el.style.strokeDashoffset = '0';
        }, delay);
      });

      // Dots pop in after strokes are drawn
      setTimeout(() => {
        dots.forEach(id => {
          const el = document.getElementById(id);
          if (!el) return;
          el.style.opacity   = '0.95';
          el.style.transform = 'scale(1)';
        });
      }, DRAW_DONE);

      // After hold period — fade strokes back out
      setTimeout(() => {
        strokes.forEach(([id, dash]) => {
          const el = document.getElementById(id);
          if (!el) return;
          el.style.transition = `stroke-dashoffset ${FADE_OUT}ms ease-in`;
          el.style.strokeDashoffset = String(dash);
        });
        dots.forEach(id => {
          const el = document.getElementById(id);
          if (!el) return;
          el.style.opacity   = '0';
          el.style.transform = 'scale(0)';
        });
      }, DRAW_DONE + HOLD);
    }

    // First run after page settles (after intro overlay)
    setTimeout(() => {
      drawStrokes();
      // Then repeat on the full cycle interval
      setInterval(drawStrokes, CYCLE);
    }, 800);

  })();

});

/* ── CUSTOM CURSOR ── */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
});

function animCursor() {
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animCursor);
}
animCursor();

/* ── PROGRESS BAR ── */
const bar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  bar.style.transform = `scaleX(${pct})`;
});

/* ── NAV SCROLL ── */
const nav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── MOBILE MENU ── */
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const ham  = document.getElementById('hamburger');
  menu.classList.toggle('open');
  ham.classList.toggle('open');
}

/* ── SCROLL REVEAL ── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');

      /* ── Animate skill bars inside revealed elements ── */
      e.target.querySelectorAll('.skill-bar').forEach(b => {
        /* FIX: use data-width value instead of hardcoded scaleX(1) so bars
           animate to their correct percentage, not always 100% */
        b.style.transform = `scaleX(${b.dataset.width})`;
      });

      /* ── Count-up numbers ── */
      e.target.querySelectorAll('.count-up').forEach(el => {
        const target = parseInt(el.dataset.target);
        let current = 0;
        const step = Math.ceil(target / 40);
        const interval = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current + (target >= 100 ? '%' : '+');
          if (current >= target) clearInterval(interval);
        }, 40);
      });
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ── SKILL BAR OBSERVER (section-level trigger) ── */
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-bar').forEach(b => {
        setTimeout(() => {
          /* FIX: animate to the correct data-width value */
          b.style.transform = `scaleX(${b.dataset.width})`;
        }, 200);
      });
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.skills-col').forEach(el => skillObserver.observe(el));

/* ── GOLD PARTICLES ── */
const particleContainer = document.getElementById('hero-particles');
if (particleContainer) {
  for (let i = 0; i < 22; i++) {
    const p = document.createElement('span');
    p.style.left = Math.random() * 100 + '%';
    p.style.top  = (40 + Math.random() * 50) + '%';
    p.style.setProperty('--d',     (5 + Math.random() * 8) + 's');
    p.style.setProperty('--delay', (Math.random() * 6) + 's');
    p.style.opacity = 0;
    p.style.width   = p.style.height = (1 + Math.random() * 2.5) + 'px';
    p.style.background = Math.random() > 0.5 ? 'var(--accent)' : 'var(--accent2)';
    particleContainer.appendChild(p);
  }
}

/* ── 3D TILT ON PROJECT CARDS ── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-8px) scale(1.01) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


/* ═══════════════════════════════════════════════════════════
   PREMIUM ANIMATION ENHANCEMENTS
═══════════════════════════════════════════════════════════ */

/* ── CURSOR TRAIL ── */
let lastTrailTime = 0;
document.addEventListener('mousemove', e => {
  const now = Date.now();
  if (now - lastTrailTime < 40) return;
  lastTrailTime = now;
  const dot = document.createElement('div');
  dot.className = 'cursor-trail';
  dot.style.left   = e.clientX + 'px';
  dot.style.top    = e.clientY + 'px';
  dot.style.width  = dot.style.height = (2 + Math.random() * 3) + 'px';
  document.body.appendChild(dot);
  setTimeout(() => dot.remove(), 600);
});

/* ── MAGNETIC CURSOR on interactive elements ── */
document.querySelectorAll('a, button, .project-card, .about-card, .stat-box, .floating-tag').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('cursor-hover');
    ring.classList.add('cursor-hover');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('cursor-hover');
    ring.classList.remove('cursor-hover');
  });
});

/* ── HERO NAME GLITCH — inject data-text ── */
const heroEm = document.querySelector('.hero-name em');
if (heroEm) heroEm.setAttribute('data-text', heroEm.textContent.trim());

/* ── SECTION TITLE — trigger underline animation ── */
const sectionTitleObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.3 });
document.querySelectorAll('.section-title').forEach(el => sectionTitleObserver.observe(el));

/* ── MAGNETIC TILT on stat boxes ── */
document.querySelectorAll('.stat-box').forEach(box => {
  box.addEventListener('mousemove', e => {
    const rect = box.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 10;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 10;
    box.style.transform = `translateY(-3px) rotateY(${x}deg) rotateX(${-y}deg)`;
  });
  box.addEventListener('mouseleave', () => {
    box.style.transform = '';
  });
});

/* ── TESTIMONIAL CARDS — mouse-follow tilt ── */
document.querySelectorAll('.testimonial-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 8;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 8;
    card.style.transform = `translateY(-6px) rotateY(${x}deg) rotateX(${-y}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── ABOUT CARDS — mouse-follow tilt ── */
document.querySelectorAll('.about-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 12;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 12;
    card.style.transform = `translateY(-4px) rotateY(${x}deg) rotateX(${-y}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── ACTIVE NAV LINK on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const sectionHighlightObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + id) {
          link.style.color = 'var(--accent)';
        }
      });
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => sectionHighlightObs.observe(s));

/* ── HERO CONTENT — subtle mouse parallax ── */
const heroContent = document.querySelector('.hero-content');
const heroSection = document.getElementById('hero');
if (heroSection && heroContent) {
  heroSection.addEventListener('mousemove', e => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    heroContent.style.transform = `translate(${dx * 8}px, ${dy * 5}px)`;
  });
  heroSection.addEventListener('mouseleave', () => {
    heroContent.style.transition = 'transform 0.8s cubic-bezier(.16,1,.3,1)';
    heroContent.style.transform  = '';
  });
  heroSection.addEventListener('mouseenter', () => {
    heroContent.style.transition = 'transform 0.1s linear';
  });
}

/* ── HERO VISUAL — counter-parallax ── */
const heroVisual = document.querySelector('.hero-visual');
if (heroSection && heroVisual) {
  heroSection.addEventListener('mousemove', e => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    heroVisual.style.transform = `translate(${-dx * 12}px, ${-dy * 8}px)`;
  });
  heroSection.addEventListener('mouseleave', () => {
    heroVisual.style.transition = 'transform 0.8s cubic-bezier(.16,1,.3,1), opacity 1.2s ease';
    heroVisual.style.transform  = '';
  });
  heroSection.addEventListener('mouseenter', () => {
    heroVisual.style.transition = 'transform 0.1s linear, opacity 1.2s ease';
  });
}

/* ── CONTACT LINKS — staggered entrance ── */
const contactObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.contact-link').forEach((link, i) => {
        link.style.opacity   = '0';
        link.style.transform = 'translateX(-20px)';
        setTimeout(() => {
          link.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(.16,1,.3,1), border-color 0.3s, color 0.3s';
          link.style.opacity   = '1';
          link.style.transform = 'translateX(0)';
        }, 200 + i * 100);
      });
    }
  });
}, { threshold: 0.3 });
const contactSection = document.getElementById('contact');
if (contactSection) contactObserver.observe(contactSection);

/* ── SKILL ITEMS — wave stagger on visibility ── */
const skillItemObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-item').forEach((item, i) => {
        item.style.opacity   = '0';
        item.style.transform = 'translateX(-16px)';
        setTimeout(() => {
          item.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(.16,1,.3,1)';
          item.style.opacity   = '1';
          item.style.transform = 'translateX(0)';
        }, i * 80);
      });
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.skills-col').forEach(col => skillItemObserver.observe(col));

/* ── PROJECT CARDS — staggered entrance ── */
const projectObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.project-card').forEach((card, i) => {
        card.style.opacity   = '0';
        card.style.transform = 'translateY(40px) scale(0.96)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.7s ease, transform 0.7s cubic-bezier(.16,1,.3,1), border-color 0.4s';
          card.style.opacity   = '1';
          card.style.transform = 'translateY(0) scale(1)';
        }, 100 + i * 120);
      });
    }
  });
}, { threshold: 0.1 });
const projectsSection = document.getElementById('projects');
if (projectsSection) projectObserver.observe(projectsSection);

/* ── PROCESS STEPS — sequential dot pulse on enter ── */
const processObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.process-step').forEach((step, i) => {
        setTimeout(() => {
          const dot = step.querySelector('.step-dot');
          if (!dot) return;
          dot.style.transition = 'background 0.3s, box-shadow 0.3s, transform 0.3s';
          dot.style.background = 'var(--accent)';
          dot.style.boxShadow  = '0 0 16px rgba(212,168,75,0.6)';
          dot.style.transform  = 'scale(1.4)';
          setTimeout(() => {
            dot.style.background = 'var(--bg)';
            dot.style.boxShadow  = 'none';
            dot.style.transform  = 'scale(1)';
          }, 400);
        }, 400 + i * 180);
      });
    }
  });
}, { threshold: 0.3 });
const processSection = document.getElementById('process');
if (processSection) processObs.observe(processSection);

/* ── SMOOTH SCROLL with fixed nav offset ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── LOGO letter-spacing morphs on scroll ── */
const logoEl = document.querySelector('.logo');
if (logoEl) {
  window.addEventListener('scroll', () => {
    const ratio = Math.min(window.scrollY / 300, 1);
    logoEl.style.letterSpacing = (0.05 + ratio * 0.06) + 'em';
  }, { passive: true });
}

/* ── FOOTER links — reveal on enter ── */
const footerObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.footer-links a').forEach((link, i) => {
        link.style.opacity   = '0';
        link.style.transform = 'translateY(10px)';
        setTimeout(() => {
          link.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(.16,1,.3,1), color 0.3s';
          link.style.opacity   = '1';
          link.style.transform = 'translateY(0)';
        }, i * 80);
      });
    }
  });
}, { threshold: 0.5 });
const footerEl = document.querySelector('footer');
if (footerEl) footerObs.observe(footerEl);
// ── Section cinematic entry observer ──
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('in-view');
  });
}, { threshold: 0.08 });

document.querySelectorAll('section').forEach(s => sectionObserver.observe(s));