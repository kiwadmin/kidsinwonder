/* Kids in Wonder — small, quiet interactions. Reduced-motion aware. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Mobile menu --- */
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.querySelector('.mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      menu.classList.toggle('open', !open);
    });
    // close on link tap
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        toggle.setAttribute('aria-expanded', 'false');
        menu.classList.remove('open');
      });
    });
  }

  /* --- Sticky header shadow on scroll --- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* --- Hero unlock: the one key-turn moment --- */
  var hero = document.querySelector('.hero');
  if (hero) {
    if (reduce) {
      hero.classList.add('unlock'); // reveal instantly, animation suppressed by CSS
    } else {
      // next frame so the initial state paints first
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { hero.classList.add('unlock'); });
      });
    }
  }

  /* --- Gentle in-view reveals --- */
  var ios = document.querySelectorAll('.io');
  if (ios.length) {
    if (reduce || !('IntersectionObserver' in window)) {
      ios.forEach(function (el) { el.classList.add('in'); });
    } else {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
      ios.forEach(function (el) { obs.observe(el); });
    }
  }

  /* --- Current year in footer --- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();

/* 새 소식 배너 — 닫으면 그 키는 다시 뜨지 않습니다 (이 기기에 한함). */
(function () {
  'use strict';
  document.querySelectorAll('[data-notice]').forEach(function (el) {
    var key = 'kiw-notice-' + el.getAttribute('data-notice');
    var seen = false;
    try { seen = localStorage.getItem(key) === '1'; } catch (e) {}
    if (seen) { el.remove(); return; }
    el.hidden = false;
    var x = el.querySelector('.notice-x');
    if (x) {
      x.addEventListener('click', function () {
        try { localStorage.setItem(key, '1'); } catch (e) {}
        el.remove();
      });
    }
  });
})();
