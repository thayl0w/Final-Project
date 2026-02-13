import { STORAGE_KEYS, load, save, remove } from './storage.js';

const session = load(STORAGE_KEYS.session, null);
const next = new URLSearchParams(window.location.search).get('next') || 'dashboard.html';

if (session) {
  window.location.replace(next);
}

const loginTab = document.querySelector('#loginTab');
const signupTab = document.querySelector('#signupTab');
const loginForm = document.querySelector('#loginForm');
const signupForm = document.querySelector('#signupForm');
const authMessage = document.querySelector('#authMessage');

const loginEmail = document.querySelector('#loginEmail');
const loginPassword = document.querySelector('#loginPassword');
const signupName = document.querySelector('#signupName');
const signupEmail = document.querySelector('#signupEmail');
const signupPassword = document.querySelector('#signupPassword');

loginTab.addEventListener('click', () => setMode('login'));
signupTab.addEventListener('click', () => setMode('signup'));

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const users = load(STORAGE_KEYS.users, []);

  const user = users.find((item) =>
    item.email.toLowerCase() === loginEmail.value.trim().toLowerCase() && item.password === loginPassword.value
  );

  if (!user) {
    showMessage('Invalid email or password.');
    return;
  }

  save(STORAGE_KEYS.session, {
    name: user.name,
    email: user.email,
    loginAt: Date.now()
  });

  window.location.href = next;
});

signupForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = signupName.value.trim();
  const email = signupEmail.value.trim().toLowerCase();
  const password = signupPassword.value;

  if (!name || !email || !password) {
    showMessage('Please fill out all fields.');
    return;
  }

  if (password.length < 6) {
    showMessage('Password should be at least 6 characters.');
    return;
  }

  const users = load(STORAGE_KEYS.users, []);

  if (users.some((item) => item.email.toLowerCase() === email)) {
    showMessage('That email is already registered.');
    return;
  }

  users.push({ name, email, password });
  save(STORAGE_KEYS.users, users);
  save(STORAGE_KEYS.session, { name, email, loginAt: Date.now() });

  window.location.href = next;
});

function setMode(mode) {
  const loginActive = mode === 'login';
  loginTab.classList.toggle('active', loginActive);
  signupTab.classList.toggle('active', !loginActive);
  loginForm.classList.toggle('hidden', !loginActive);
  signupForm.classList.toggle('hidden', loginActive);
  showMessage('');
}

function showMessage(text) {
  authMessage.textContent = text;
}

window.logoutStudyBuddy = () => {
  remove(STORAGE_KEYS.session);
};
