/* ============================================================
   script.js — 6G Wireless Researcher resume
   Role: canvas particle mesh, scroll reveal, navbar state,
   mobile menu, active-section highlight, skill bar animation.
   No external dependencies; plain ES5+ for broad support.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============================================================
     1. CANVAS PARTICLE MESH
     ============================================================ */
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h, dpr;
    const COUNT = 70;          // node count
    const LINK_DIST = 130;     // px distance to draw a link

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < COUNT; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 1.8 + 0.6
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = w; else if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; else if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 240, 255, 0.85)';
        ctx.shadowColor = 'rgba(0, 240, 255, 0.7)';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.5;
            ctx.strokeStyle = 'rgba(0, 240, 255, ' + alpha + ')';
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      resize();
      initParticles();
      draw();
      window.addEventListener('resize', function () {
        resize();
        initParticles();
      });
    }
  }

  /* ============================================================
     2. NAVBAR
     ============================================================ */
  const navbar = document.getElementById('navbar');
  function onScroll() {
    if (navbar) {
      if (window.scrollY > 40) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ============================================================
     3. MOBILE MENU TOGGLE
     ============================================================ */
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      const open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ============================================================
     4. SCROLL REVEAL
     ============================================================ */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ============================================================
     5. SKILL BARS
     ============================================================ */
  const skillSection = document.getElementById('skills');
  if ('IntersectionObserver' in window && skillSection) {
    const skillIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          skillSection.querySelectorAll('.bar-fill').forEach(function (bar) {
            bar.style.width = bar.getAttribute('data-level') + '%';
          });
          skillIO.unobserve(skillSection);
        }
      });
    }, { threshold: 0.3 });
    skillIO.observe(skillSection);
  } else if (skillSection) {
    document.querySelectorAll('.bar-fill').forEach(function (bar) {
      bar.style.width = bar.getAttribute('data-level') + '%';
    });
  }

  /* ============================================================
     6. ACTIVE SECTION HIGHLIGHT
     ============================================================ */
  const sections = document.querySelectorAll('main section[id]');
  if (links) {
    const navAnchors = links.querySelectorAll('a');
    if ('IntersectionObserver' in window) {
      const navIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navAnchors.forEach(function (a) {
              a.classList.toggle('active', a.getAttribute('href') === '#' + id);
            });
          }
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      sections.forEach(function (s) { navIO.observe(s); });
    }
  }

  /* ==========================================
     7. Dynamic Google Scholar Chart with Grid & Y-Axis
  ========================================== */
  const citations = [
      {year: "2020", value: 2},
      {year: "2021", value: 6},
      {year: "2022", value: 8},
      {year: "2023", value: 11},
      {year: "2024", value: 11},
      {year: "2025", value: 15},
      {year: "2026", value: 2}
  ];

  const chart = document.getElementById("citationChart");
  const yAxis = document.getElementById("citationYAxis");
  const grid = document.getElementById("citationGrid");

  if (chart && yAxis && grid) {
      const maxVal = Math.max(...citations.map(x => x.value));
      const steps = 3; // 3 segments, 4 ticks (15, 10, 5, 0)
      const stepVal = Math.ceil(maxVal / steps);
      const topTickVal = stepVal * steps;

      // 1. Build Y-Axis and Horizontal Grid Lines
      for (let i = steps; i >= 0; i--) {
          const val = stepVal * i;

          // Add Y-Axis label
          const label = document.createElement("span");
          label.innerText = val;
          yAxis.appendChild(label);

          // Add Grid Line
          const gridLine = document.createElement("div");
          gridLine.className = "citation-grid-line";
          grid.appendChild(gridLine);
      }

      // 2. Build Columns and Bars
      citations.forEach(item => {
          const column = document.createElement("div");
          column.className = "citation-column";

          const bar = document.createElement("div");
          bar.className = "citation-bar";

          // Calculate height relative to the max scale tick value
          const heightPct = (item.value / topTickVal) * 100;
          bar.style.height = heightPct + "%";
          bar.dataset.value = item.value;

          const year = document.createElement("div");
          year.className = "citation-label";
          year.innerText = item.year;

          column.appendChild(bar);
          column.appendChild(year);
          chart.appendChild(column);
      });
  }
})();