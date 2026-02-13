import { STORAGE_KEYS, load, remove } from './storage.js';

const session = load(STORAGE_KEYS.session, null);
const protectedPages = ['dashboard.html', 'schedule.html', 'resources.html', 'settings.html'];
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

if (protectedPages.includes(currentPage) && !session) {
  window.location.replace(`auth.html?next=${encodeURIComponent(currentPage)}`);
}

const logoutLinks = document.querySelectorAll('[data-logout]');
logoutLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    remove(STORAGE_KEYS.session);
    window.location.href = 'index.html';
  });
});

const userBadges = document.querySelectorAll('[data-user-name]');
userBadges.forEach((node) => {
  node.textContent = session?.name || 'Guest';
});
