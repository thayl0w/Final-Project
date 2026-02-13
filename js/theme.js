import { load, save, STORAGE_KEYS } from './storage.js';

let currentTheme = load(STORAGE_KEYS.theme, 'light');

export function initTheme(toggleBtn) {
  applyTheme(currentTheme);
  toggleBtn.checked = currentTheme === 'dark';

  toggleBtn.addEventListener('change', () => {
    currentTheme = toggleBtn.checked ? 'dark' : 'light';
    save(STORAGE_KEYS.theme, currentTheme);
    applyTheme(currentTheme);
  });
}

function applyTheme(theme) {
  const root = document.documentElement;
  root.classList.toggle('theme-dark', theme === 'dark');
  root.classList.toggle('theme-light', theme !== 'dark');
}
