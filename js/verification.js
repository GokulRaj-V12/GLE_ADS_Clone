// verification.js
const PILL_CLASS = {
  'Complete':       'pill-green',
  'Passed':         'pill-green',
  'Continue':       'pill-yellow',
  'Expiring':       'pill-yellow',
  'Under Review':   'pill-yellow',
  'Expired':        'pill-red',
  'Failed':         'pill-red',
  'Action Required':'pill-red',
  'Start':          'pill-blue',
};

const VERIFICATION_ITEMS = [
  { key: 'insurance',              title: 'Insurance details',       subtitle: 'Proof of valid insurance',       testid: 'insurance-card' },
  { key: 'gbp',                    title: 'Google Business Profile', subtitle: 'Profile linking',                testid: 'gbp-card' },
  { key: 'featured_professionals', title: 'Featured professionals',  subtitle: 'Team member showcase',           testid: 'featured-professionals-card' },
  { key: 'license',                title: 'License',                 subtitle: 'License check',                  testid: 'license-card' },
  { key: 'billing',                title: 'Billing information',     subtitle: 'Payment details to run Ad',      testid: 'billing-card' },
  { key: 'background_check',       title: 'Background check',        subtitle: 'Standard checks & verification', testid: 'background-check-card' },
  { key: 'bidding_budget',         title: 'Bidding and budget',      subtitle: 'Budget optimization',            testid: 'bidding-budget-card' },
];

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
    document.querySelector('.main-content').innerHTML = `
      <div class="error-screen">
        <h2>Access Denied</h2>
        <p>Account <strong>${cid}</strong> does not belong to the selected Manager account.</p>
        <a href="dashboard.html?mcid=${mcid}" class="btn-primary">Return to Dashboard</a>
      </div>`;
    return;
  }

  renderSidebar('verification');

  document.getElementById('account-name-display').textContent = acc.business_name;
  document.getElementById('customer-id-display').textContent  = `Customer ID: ${acc.cid}`;

  const vd = acc.verification_details;
  const checklist = document.getElementById('verification-checklist');
  const detailPanel = document.getElementById('detail-panel');

  // Check if all complete
  const allComplete = VERIFICATION_ITEMS.every(item => {
    const status = vd[item.key]?.status;
    return status === 'Complete' || status === 'Passed';
  });

  // Render checklist cards
  checklist.innerHTML = '';
  VERIFICATION_ITEMS.forEach(item => {
    const d = vd[item.key] || {};
    const status = d.status || 'Start';
    const pillClass = PILL_CLASS[status] || 'pill-blue';

    const card = document.createElement('div');
    card.className = 'checklist-card';
    card.setAttribute('data-testid', 'checklist-item');
    card.setAttribute('data-key', item.key);
    card.setAttribute('data-testid-specific', item.testid);
    card.innerHTML = `
      <div class="checklist-card-text">
        <div class="checklist-card-title">${item.title}</div>
        <div class="checklist-card-subtitle">${item.subtitle}</div>
      </div>
      <span class="pill ${pillClass}" data-testid="verification-pill">${status}</span>
    `;
    card.addEventListener('click', () => {
      document.querySelectorAll('.checklist-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      renderDetailPanel(item, d, acc.category);
    });
    checklist.appendChild(card);
  });

  // Show default or success
  if (allComplete) {
    renderSuccessPanel(detailPanel);
  } else {
    renderDefaultPanel(detailPanel);
  }

  function renderDetailPanel(item, d, category) {
    const status = d.status || 'Start';

    if (item.key === 'featured_professionals') {
      renderFeaturedPanel(detailPanel, category);
      return;
    }

    const isFailure = ['Expired', 'Failed', 'Action Required', 'Under Review', 'Expiring'].includes(status);
    const isSuccess = status === 'Complete' || status === 'Passed';

    if (isSuccess) {
      renderSuccessPanel(detailPanel);
      return;
    }

    if (isFailure) {
      detailPanel.innerHTML = `
        <div data-testid="detail-panel">
          <h3 class="detail-title">${item.title}</h3>
          <div class="timeline">
            <div class="timeline-step">
              <div class="timeline-icon-col">
                <div class="timeline-dot green">✓</div>
                <div class="timeline-connector"></div>
              </div>
              <div class="timeline-content">
                <div class="timeline-label">Document submitted</div>
              </div>
            </div>
            <div class="timeline-step">
              <div class="timeline-icon-col">
                <div class="timeline-dot red">⚠</div>
                <div class="timeline-connector"></div>
              </div>
              <div class="timeline-content">
                <div class="timeline-label">Verification no longer valid</div>
                ${d.document ? `<div class="timeline-detail" data-testid="failure-reason-detail">📄 ${d.document}</div>` : ''}
                ${d.expiry_date ? `<div class="timeline-detail">Expired: ${d.expiry_date}</div>` : ''}
                ${d.reason ? `<div class="timeline-detail" data-testid="failure-reason-detail">${d.reason}</div>` : ''}
              </div>
            </div>
            <div class="timeline-step">
              <div class="timeline-icon-col">
                <div class="timeline-dot blue">↑</div>
              </div>
              <div class="timeline-content">
                <div class="timeline-label">Submit document</div>
                <a class="timeline-link" href="#">Why is ${item.title.toLowerCase()} required?</a>
                <button class="btn-primary" data-testid="attach-file-btn">Attach file</button>
              </div>
            </div>
          </div>
          <div class="info-box-yellow">
            <div class="info-box-title">Verified ✓ : ${item.title} requirements for a Google badge</div>
            <div class="info-box-text">
              To maintain your Google Verified status, you must keep your ${item.title.toLowerCase()} current and up to date.
              Expired or failed verifications will pause your ads until resolved.
            </div>
            <a href="#" class="info-box-link">Learn more</a>
          </div>
        </div>`;
      return;
    }

    // Start state
    renderDefaultPanel(detailPanel);
  }

  function renderDefaultPanel(panel) {
    panel.innerHTML = `
      <div class="detail-default" data-testid="detail-panel">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <p>Select a verification item on the left to view details.</p>
      </div>`;
  }

  function renderSuccessPanel(panel) {
    panel.innerHTML = `
      <div class="success-state" data-testid="detail-panel">
        <div class="success-header">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Verified ✓
        </div>
        <p class="success-title" data-testid="success-message">
          Congratulations! Your Google Verified ad is now live.
        </p>
        <a href="#" class="info-box-link">Learn more</a>
        <div class="progress-section">
          <div class="progress-label">
            <span>Verification progress</span>
            <span><strong>100%</strong></span>
          </div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill" data-testid="progress-bar" style="width:100%"></div>
          </div>
        </div>
      </div>`;
  }

  function renderFeaturedPanel(panel, category) {
    panel.innerHTML = `
      <div data-testid="detail-panel">
        <p class="fp-title">${category} Professionals</p>
        <button class="btn-primary" style="margin-bottom:20px">+ Add an employee</button>
        <div class="fp-form">
          <input class="fp-input" type="email" placeholder="Email address" />
          <select class="fp-select"><option>Please select license</option></select>
          <input class="fp-input" type="text" placeholder="License number" />
          <label class="fp-checkbox">
            <input type="checkbox" checked /> This is a business owner and/or a senior partner
          </label>
          <label class="fp-checkbox">
            <input type="checkbox" checked /> Feature this professional
          </label>
          <div class="photo-upload">
            <div class="photo-upload-label">PHOTO</div>
            <div>Add a headshot — <a href="#">Choose file</a></div>
            <div style="margin-top:6px"><a href="#" style="font-size:11px">See headshot requirements</a></div>
          </div>
          <button class="btn-primary">Save</button>
        </div>
      </div>`;
  }
});
