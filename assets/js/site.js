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

  /* ---- Assessment prompt ----
     Opens three seconds in. Dismissal is stored, so a visitor is asked
     once and then left alone across the whole site. Never appears on the
     assessment itself or on the internal brand sheet. */

  var AP_KEY = 'scg.assessment.prompt.v1';
  var AP_DELAY = 3000;
  var AP_SKIP = ['/assessment', '/brand'];

  (function assessmentPrompt() {
    var path = window.location.pathname.replace(/\/+$/, '') || '/';
    if (AP_SKIP.indexOf(path) !== -1) return;

    var seen;
    try { seen = window.localStorage.getItem(AP_KEY); } catch (err) { seen = null; }
    if (seen) return;

    var remember = function () {
      try { window.localStorage.setItem(AP_KEY, String(Date.now())); } catch (err) { /* private mode */ }
    };

    var timer = window.setTimeout(function () {
      var wrap = document.createElement('div');
      wrap.className = 'ap';
      wrap.setAttribute('role', 'dialog');
      wrap.setAttribute('aria-modal', 'true');
      wrap.setAttribute('aria-labelledby', 'ap-h');
      wrap.innerHTML = [
        '<div class="ap__panel">',
        '  <button class="ap__close" type="button" aria-label="Close">&#215;</button>',
        '  <p class="ap__meta"><span class="ap__bar"></span><span class="label label--amber">Form SCG-CF/01</span></p>',
        '  <h2 class="d3 ap__h" id="ap-h">Not sure where you fit?</h2>',
        '  <p class="ap__d">Answer a few questions about your situation and the assessment tells you which tier it actually calls for — including when the honest answer is that you don’t need us.</p>',
        '  <div class="ap__facts">',
        '    <div class="ap__fact"><span class="ap__fk">Sections</span><span class="ap__fv">08</span></div>',
        '    <div class="ap__fact"><span class="ap__fk">Time</span><span class="ap__fv">~6 min</span></div>',
        '    <div class="ap__fact"><span class="ap__fk">Output</span><span class="ap__fv">Tier</span></div>',
        '  </div>',
        '  <div class="btn-row">',
        '    <a class="btn btn--primary" href="/assessment">Take the assessment</a>',
        '    <button class="btn btn--ghost" type="button" data-ap-dismiss>Not now</button>',
        '  </div>',
        '  <p class="ap__note">Your answers stay in your browser until you send them.</p>',
        '</div>'
      ].join('');
      document.body.appendChild(wrap);

      var opener = document.activeElement;
      var panel = wrap.querySelector('.ap__panel');
      var focusables = panel.querySelectorAll('a[href], button');

      var close = function () {
        remember();
        wrap.setAttribute('data-open', 'false');
        document.removeEventListener('keydown', onKey);
        window.setTimeout(function () { wrap.remove(); }, 340);
        if (opener && opener.focus) opener.focus();
      };

      var onKey = function (e) {
        if (e.key === 'Escape') { close(); return; }
        if (e.key !== 'Tab') return;
        // Keep focus inside the dialog while it is open.
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      };

      wrap.querySelector('.ap__close').addEventListener('click', close);
      wrap.querySelector('[data-ap-dismiss]').addEventListener('click', close);
      // Taking the assessment counts as answering; don't ask again either way.
      wrap.querySelector('a.btn').addEventListener('click', remember);
      wrap.addEventListener('click', function (e) { if (e.target === wrap) close(); });
      document.addEventListener('keydown', onKey);

      // Next frame, so the opening transition actually runs.
      window.requestAnimationFrame(function () {
        wrap.setAttribute('data-open', 'true');
        focusables[0].focus();
      });
    }, AP_DELAY);

    // Someone who navigates before it fires shouldn't get it mid-click.
    window.addEventListener('pagehide', function () { window.clearTimeout(timer); });
  })();

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
