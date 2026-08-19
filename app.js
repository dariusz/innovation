'use strict';

/**
 * app.js — theme persistence + Reveal.js bootstrap for the BigTalk deck.
 *
 * Split into two phases:
 *   1. Runs immediately (this script is loaded in <head>, before the body
 *      paints) — applies the saved/default theme so there's no flash.
 *   2. Runs on DOMContentLoaded — everything that needs the slide markup
 *      or the theme-toggle button to exist: Reveal init + the toggle.
 */

const THEME_STORAGE_KEY = 'bigtalk-theme';
const THEME_DARK = 'dark';
const THEME_LIGHT = 'light';

const REVEAL_CONFIG = {
  hash: true,
  controls: true,
  progress: true,
  slideNumber: 'c/t',
  center: false,
  transition: 'fade',
  width: 1280,
  height: 800,
  margin: 0.03,
};

/** Reads the saved theme, falling back to light if storage is unavailable or empty. */
function getStoredTheme() {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) === THEME_DARK ? THEME_DARK : THEME_LIGHT;
  } catch (e) {
    return THEME_LIGHT;
  }
}

/** Persists the theme choice; silently no-ops if storage is unavailable (e.g. private mode). */
function storeTheme(theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (e) {
    /* ignore */
  }
}

/** Applies a theme to the document root. */
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
}

function getCurrentTheme() {
  return document.documentElement.dataset.theme === THEME_DARK ? THEME_DARK : THEME_LIGHT;
}

// Phase 1: apply the theme before first paint.
applyTheme(getStoredTheme());

/** Wires up the theme-toggle button (click) and the "T" keyboard shortcut. */
function initThemeToggle() {
  const button = document.getElementById('theme-toggle');
  if (!button) return;

  const updateLabel = () => {
    button.textContent = getCurrentTheme() === THEME_DARK ? 'Light' : 'Dark';
  };

  const toggleTheme = () => {
    const next = getCurrentTheme() === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    applyTheme(next);
    storeTheme(next);
    updateLabel();
  };

  updateLabel();

  button.addEventListener('click', (event) => {
    event.preventDefault();
    toggleTheme();
    button.blur();
  });

  document.addEventListener('keydown', (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key === 't' || event.key === 'T') {
      event.preventDefault();
      toggleTheme();
    }
  });
}

function init() {
  Reveal.initialize(REVEAL_CONFIG);
  initThemeToggle();
}

// Phase 2: everything that depends on the slide markup / toggle button.
document.addEventListener('DOMContentLoaded', init);
