// spinner.js — 1.2s loading overlay on every page
(function () {
  const overlay = document.getElementById('spinner-overlay');
  if (!overlay) return;
  setTimeout(() => {
    overlay.classList.add('hidden');
    document.body.classList.add('fade-in');
    setTimeout(() => overlay.remove(), 350);
  }, 1200);
})();
