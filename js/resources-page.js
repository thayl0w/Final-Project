import { STORAGE_KEYS, load, save } from './storage.js';
import { initTheme } from './theme.js';
import { searchYouTubeVideos } from './api.js';
import { renderResources } from './ui.js';
import { validateResourceInput } from './validation.js';

const themeToggle = document.querySelector('#themeToggle');
const resourceForm = document.querySelector('#resourceForm');
const resourceQuery = document.querySelector('#resourceQuery');
const youtubeKey = document.querySelector('#youtubeKey');
const resourceResults = document.querySelector('#resourceResults');

initTheme(themeToggle);
youtubeKey.value = load(STORAGE_KEYS.youtubeKey, '');

resourceForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const query = resourceQuery.value.trim();
  const validationError = validateResourceInput(query);
  if (validationError) {
    alert(validationError);
    return;
  }

  const key = youtubeKey.value.trim();
  save(STORAGE_KEYS.youtubeKey, key);

  resourceResults.innerHTML = '<p>Searching...</p>';

  try {
    const result = await searchYouTubeVideos(query, key);
    renderResources(resourceResults, result);
  } catch (error) {
    resourceResults.innerHTML = `<p>${error.message}</p>`;
  }
});
