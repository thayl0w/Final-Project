import { STORAGE_KEYS, load, remove, save } from './storage.js';
import { initTheme } from './theme.js';

const themeToggle = document.querySelector('#themeToggle');
const youtubeKey = document.querySelector('#youtubeKey');
const saveKeyBtn = document.querySelector('#saveKeyBtn');
const clearDataBtn = document.querySelector('#clearDataBtn');
const settingsMessage = document.querySelector('#settingsMessage');

initTheme(themeToggle);
youtubeKey.value = load(STORAGE_KEYS.youtubeKey, '');

saveKeyBtn.addEventListener('click', () => {
  save(STORAGE_KEYS.youtubeKey, youtubeKey.value.trim());
  showMessage('API key saved.');
});

clearDataBtn.addEventListener('click', () => {
  const confirmed = confirm('Clear tasks, schedules, timer sessions, and saved key?');
  if (!confirmed) {
    return;
  }

  remove(STORAGE_KEYS.tasks);
  remove(STORAGE_KEYS.schedules);
  remove(STORAGE_KEYS.timerSessions);
  remove(STORAGE_KEYS.youtubeKey);
  showMessage('Local data cleared.');
});

function showMessage(text) {
  settingsMessage.textContent = text;
}
