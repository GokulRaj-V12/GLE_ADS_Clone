// auth.js — Login logic + auth guard
const AUTH_KEY = 'lsa_auth';
const CREDENTIALS = { username: 'admin', password: 'password123' };

function isAuthenticated() {
  return localStorage.getItem(AUTH_KEY) === 'true';
}

function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
  }
}

function logout() {
  localStorage.removeItem(AUTH_KEY);
  window.location.href = 'login.html';
}

// Login form handler (only runs on login.html)
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  if (!form) return;

  if (isAuthenticated()) {
    window.location.href = 'account_picker.html';
    return;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.querySelector('[data-testid="login-username"]').value.trim();
    const password = document.querySelector('[data-testid="login-password"]').value;
    const errorEl = document.querySelector('[data-testid="login-error"]');

    if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
      localStorage.setItem(AUTH_KEY, 'true');
      window.location.href = 'account_picker.html';
    } else {
      errorEl.textContent = 'Invalid credentials. Please try again.';
      errorEl.style.display = 'block';
    }
  });
});
