// profile.js
document.addEventListener('DOMContentLoaded', async () => {
  requireAuth();

  const mcid = getMcid();
  const cid  = getCid();

  if (!cid || !mcid) {
    window.location.href = mcid ? `dashboard.html?mcid=${mcid}` : 'account_picker.html';
    return;
  }

  const data = await loadData();
  const acc  = data.accounts.find(a => a.cid === cid && a.mcid === mcid);

  if (!acc) {
    // Mismatch error
    document.querySelector('.main-content').innerHTML = `
      <div class="error-screen">
        <h2>Access Denied</h2>
        <p>Account <strong>${cid}</strong> does not belong to the selected Manager account.</p>
        <a href="dashboard.html?mcid=${mcid}" class="btn-primary">Return to Dashboard</a>
      </div>`;
    return;
  }

  renderSidebar('profile');

  // Subheader
  document.getElementById('account-name-display').textContent = acc.business_name;
  document.getElementById('customer-id-display').textContent  = `Customer ID: ${acc.cid}`;
  document.querySelector('[data-testid="profile-header-cid"]').textContent = `Customer ID: ${acc.cid}`;

  // Ad status
  const toggle    = document.getElementById('ad-toggle');
  const toggleLabel    = document.getElementById('toggle-label');
  const toggleSubtitle = document.getElementById('toggle-subtitle');
  const pauseBanner    = document.getElementById('pause-banner');
  const scheduleSection = document.getElementById('schedule-section');

  function setToggleState(isOn) {
    toggle.classList.toggle('on', isOn);
    toggle.setAttribute('data-testid', isOn ? 'toggle-state-on' : 'toggle-state-off');
    toggleLabel.textContent = isOn ? 'Your ad is on' : 'Your ad is off';
    toggleSubtitle.textContent = isOn ? 'You will receive leads during the times you scheduled.' : '';
    pauseBanner.classList.toggle('visible', !isOn);
    scheduleSection.style.display = isOn ? '' : 'none';
  }

  let adOn = acc.ad_status === 'Active';
  setToggleState(adOn);
  toggle.addEventListener('click', () => { adOn = !adOn; setToggleState(adOn); });

  // Business profile
  document.querySelector('[data-testid="business-name"]').textContent  = acc.business_name;
  document.querySelector('[data-testid="phone"]').textContent           = acc.phone;
  document.querySelector('[data-testid="website"]').textContent         = acc.website;
  document.querySelector('[data-testid="license"]').textContent         = acc.license;
  document.querySelector('[data-testid="business-bio"]').textContent    = acc.business_bio;
  document.getElementById('postal-code-val').textContent = acc.postal_code;
  document.getElementById('address-val').textContent     = acc.address;

  // Budget card
  document.querySelector('[data-testid="bidding-strategy-value"]').textContent = acc.bidding_strategy;
  document.querySelector('[data-testid="budget-value"]').textContent           = acc.average_weekly_budget;
  document.querySelector('[data-testid="previous-7-days-value"]').textContent  = `${acc.previous_7_days_leads} leads`;

  // Job types
  const jtList = document.getElementById('job-types-list');
  acc.job_types.forEach(jt => {
    const div = document.createElement('div');
    div.className = 'job-type-item';
    div.setAttribute('data-testid', 'job-type-item');
    div.textContent = jt;
    jtList.appendChild(div);
  });
});
