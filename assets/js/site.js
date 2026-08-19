/* Stringfellow Construction Group LLC — site behaviour
   Three jobs: the mobile menu, the header state, and scroll reveals.
   Nothing else. */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Copyright year ---- */

  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---- Mobile menu ---- */

  var burger = document.querySelector('.burger');
  var nav = document.querySelector('.nav');

  if (burger && nav) {
    var setMenu = function (open) {
      burger.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };

    burger.addEventListener('click', function () {
      setMenu(burger.getAttribute('aria-expanded') !== 'true');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        burger.focus();
      }
    });

    // A resize past the breakpoint should leave the menu in a sane state.
    window.matchMedia('(min-width: 1021px)').addEventListener('change', function (e) {
      if (e.matches) setMenu(false);
    });
  }

  /* ---- Services dropdown ----
     Desktop only. Below 1021px the menu is always expanded as a plain list,
     so there is nothing to toggle. */

  var trigger = document.querySelector('.nav__trigger');
  var menu = document.getElementById('svc-menu');
  var desktop = window.matchMedia('(min-width: 1021px)');

  if (trigger && menu) {
    var setMenuOpen = function (open) {
      trigger.setAttribute('aria-expanded', String(open));
      menu.setAttribute('data-open', String(open));
    };

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      setMenuOpen(trigger.getAttribute('aria-expanded') !== 'true');
    });

    // Click anywhere outside closes it.
    document.addEventListener('click', function (e) {
      if (!desktop.matches) return;
      if (!e.target.closest('.nav__has-menu')) setMenuOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (trigger.getAttribute('aria-expanded') !== 'true') return;
      setMenuOpen(false);
      trigger.focus();
    });

    // Tabbing out of the menu closes it.
    menu.addEventListener('focusout', function (e) {
      if (!desktop.matches) return;
      if (!menu.contains(e.relatedTarget) && e.relatedTarget !== trigger) {
        setMenuOpen(false);
      }
    });

    desktop.addEventListener('change', function () { setMenuOpen(false); });
  }

  /* ---- Header condenses once you leave the top ---- */

  var hdr = document.querySelector('.hdr');

  if (hdr) {
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        hdr.classList.toggle('is-stuck', window.scrollY > 24);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- Scroll reveals ---- */

  var targets = document.querySelectorAll('.reveal');

  if (!targets.length) return;

  if (reduced || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('is-in'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.06 });

  // Stagger siblings so groups arrive as a set rather than all at once.
  var groups = new Map();
  targets.forEach(function (el) {
    var parent = el.parentElement;
    var n = groups.get(parent) || 0;
    if (!el.style.getPropertyValue('--d')) {
      el.style.setProperty('--d', Math.min(n, 6) * 70 + 'ms');
    }
    groups.set(parent, n + 1);
    io.observe(el);
  });
})();
