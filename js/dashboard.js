// dashboard.js
document.addEventListener('DOMContentLoaded', async () => {
  requireAuth();
  renderSidebar('dashboard');

  const mcid = getMcid();
  const data = await loadData();

  // Populate toolbar filter options
  const searchInput = document.getElementById('search-input');
  const categoryFilter = document.getElementById('category-filter');
  const resetBtn = document.getElementById('reset-btn');
  const tbody = document.getElementById('accounts-tbody');

  if (!mcid) {
    showEmpty(tbody, 'No Manager ID provided. Please select an account.');
    return;
  }

  let accounts = data.accounts.filter(a => a.mcid === mcid);

  function renderTable(list) {
    tbody.innerHTML = '';
    if (!list.length) {
      showEmpty(tbody, 'No accounts found for this Manager ID.');
      return;
    }
    list.forEach(acc => {
      const tr = document.createElement('tr');
      tr.setAttribute('data-testid', 'account-row');
      tr.innerHTML = `
        <td>
          <a class="account-name-link" href="profile.html?cid=${encodeURIComponent(acc.cid)}&mcid=${encodeURIComponent(acc.mcid)}"
             data-testid="account-name-link">${acc.business_name}</a>
          <span class="account-cid" data-testid="account-header-cid">${acc.cid}</span>
        </td>
        <td>${acc.category}</td>
        <td>${acc.weekly_budget} ${acc.currency}</td>
        <td>${acc.bids}</td>
        <td>${acc.review_score} / ${acc.review_count.toLocaleString()}</td>
        <td class="metric">
          <div class="metric-cell">
            <div class="current">${acc.lead_charged.current}</div>
            <div class="previous">${acc.lead_charged.previous}</div>
          </div>
        </td>
        <td class="metric">
          <div class="metric-cell">
            <div class="current">${acc.calls.current}</div>
            <div class="previous">${acc.calls.previous}</div>
          </div>
        </td>
        <td class="metric">
          <div class="metric-cell">
            <div class="current">${acc.connected_calls.current}</div>
            <div class="previous">${acc.connected_calls.previous}</div>
          </div>
        </td>
        <td class="metric">
          <div class="metric-cell">
            <div class="current">${acc.cost.current} ${acc.cost.currency}</div>
            <div class="previous">${acc.cost.previous} ${acc.cost.currency}</div>
          </div>
        </td>
      `;
      tr.querySelector('.account-name-link').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `profile.html?cid=${encodeURIComponent(acc.cid)}&mcid=${encodeURIComponent(acc.mcid)}`;
      });
      tbody.appendChild(tr);
    });
  }

  function applyFilters() {
    const query = searchInput.value.toLowerCase();
    const cat   = categoryFilter.value;
    let list = accounts;
    if (query) list = list.filter(a => a.business_name.toLowerCase().includes(query) || a.cid.includes(query));
    if (cat)   list = list.filter(a => a.category === cat);
    renderTable(list);
  }

  // Populate category dropdown
  const cats = [...new Set(accounts.map(a => a.category))].sort();
  cats.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c; opt.textContent = c;
    categoryFilter.appendChild(opt);
  });

  searchInput.addEventListener('input', applyFilters);
  categoryFilter.addEventListener('change', applyFilters);
  resetBtn.addEventListener('click', () => {
    searchInput.value = ''; categoryFilter.value = '';
    renderTable(accounts);
  });

  renderTable(accounts);
});

function showEmpty(tbody, msg) {
  tbody.innerHTML = `<tr><td colspan="9" class="empty-state">${msg}</td></tr>`;
}
