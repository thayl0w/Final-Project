import { STORAGE_KEYS, load, remove } from './storage.js';

const session = load(STORAGE_KEYS.session, null);
const ctaBtn = document.querySelector('#landingCtaBtn');
const authNavLink = document.querySelector('#authNavLink');

if (session) {
  ctaBtn.href = 'dashboard.html';
  authNavLink.textContent = 'Logout';
  authNavLink.href = '#';
  authNavLink.addEventListener('click', (event) => {
    event.preventDefault();
    remove(STORAGE_KEYS.session);
    window.location.reload();
  });
} else {
  ctaBtn.href = 'auth.html?next=dashboard.html';
  authNavLink.textContent = 'Sign In';
  authNavLink.href = 'auth.html?next=dashboard.html';
}
