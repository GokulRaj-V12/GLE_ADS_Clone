// sidebar.js — Render sidebar + collapse + active state
const NAV_ITEMS = [
  { id: 'live-accounts',    label: 'Live accounts',          page: 'dashboard',        icon: 'chart', badge: false },
  { id: 'managed-accounts', label: 'Managed accounts',       page: 'managed-accounts', icon: 'people', badge: false },
  { id: 'manager-access',   label: 'Manager Account Access', page: 'account-access',   icon: 'briefcase', badge: false },
  { id: 'manager-notifs',   label: 'Manager Notifications',  page: 'notifications',    icon: 'bell', badge: false },
  { id: 'manager-alerts',   label: 'Manager Alerts',         page: 'alerts',           icon: 'warning', badge: true },
  { id: 'webhooks',         label: 'Webhook Integration',    page: 'webhooks',         icon: 'link', badge: false },
  { id: 'verification',     label: 'Business Verification',  page: 'verification',     icon: 'check', badge: false },
  { id: 'leads',            label: 'Leads',                  page: 'leads',            icon: 'clipboard', badge: false },
  { id: 'policy-manager',   label: 'Policy Manager',         page: 'policy-manager',   icon: 'gear', badge: false },
  { id: 'reports',          label: 'Reports',                page: 'reports',          icon: 'chartline', badge: false },
  { id: 'profile',          label: 'Profile & budget',       page: 'profile',          icon: 'person', badge: false },
  { id: 'billing',          label: 'Billing',                page: 'billing',          icon: 'card', badge: false },
  { id: 'promotions',       label: 'Promotions',             page: 'promotions',       icon: 'gift', badge: false },
  { id: 'account-access',   label: 'Account Access',         page: 'account-access',   icon: 'lock', badge: false },
  { id: 'notifications',    label: 'Notifications',          page: 'notifications',    icon: 'bell2', badge: false },
  { id: 'help',             label: 'Help center',            page: 'help',             icon: 'question', badge: false },
];

const ICONS = {
  chart:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="12" width="4" height="9" rx="1"/><rect x="10" y="7" width="4" height="14" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/></svg>`,
  people:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="7" r="4"/><path d="M1 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2"/><path d="M17 11a4 4 0 0 1 0-8"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg>`,
  briefcase: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="12.01"/></svg>`,
  bell:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  warning:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  link:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  check:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="20 6 9 17 4 12"/></svg>`,
  clipboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>`,
  gear:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  chartline: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  person:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  card:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
  gift:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>`,
  lock:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  bell2:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  question:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  menu:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
  chevron:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>`,
};

function buildSidebarHref(page, mcid, cid) {
  if (page === 'help') return null;
  const params = new URLSearchParams();
  if (mcid) params.set('mcid', mcid);
  if (cid && (page === 'verification' || page === 'profile')) params.set('cid', cid);
  const qs = params.toString();
  return `${page}.html${qs ? '?' + qs : ''}`;
}

function renderSidebar(activePage) {
  const sidebar  = document.getElementById('sidebar');
  if (!sidebar) return;

  const mcid = getMcid ? getMcid() : null;
  const cid  = getCid  ? getCid()  : null;
  const collapsed = localStorage.getItem('sidebar_collapsed') === 'true';
  if (collapsed) sidebar.classList.add('collapsed');

  // Toggle btn
  sidebar.innerHTML = `
    <button class="sidebar-toggle" data-testid="sidebar-toggle" title="Toggle sidebar">
      ${ICONS.chevron}
    </button>
    <ul class="sidebar-nav" data-testid="sidebar-nav"></ul>
  `;

  const nav = sidebar.querySelector('.sidebar-nav');

  NAV_ITEMS.forEach(item => {
    const li = document.createElement('li');
    li.className = 'sidebar-nav-item' + (activePage === item.page ? ' active' : '');

    let href = buildSidebarHref(item.page, mcid, cid);
    const tag = item.page === 'help' ? 'a' : 'a';
    const target = item.page === 'help' ? ' target="_blank" rel="noopener"' : '';
    const hrefStr = item.page === 'help' ? 'https://support.google.com' : (href || '#');

    li.innerHTML = `
      <a href="${hrefStr}"${target} data-testid="sidebar-nav-link" data-page="${item.page}">
        <span class="nav-icon">${ICONS[item.icon] || ''}</span>
        <span class="nav-label">${item.label}</span>
        ${item.badge ? '<span class="alert-badge" data-testid="alert-badge"></span>' : ''}
      </a>
    `;
    nav.appendChild(li);
  });

  // Collapse toggle
  sidebar.querySelector('.sidebar-toggle').addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    const isCollapsed = sidebar.classList.contains('collapsed');
    localStorage.setItem('sidebar_collapsed', isCollapsed);
    const mainContent = document.querySelector('.main-content');
    if (mainContent) mainContent.classList.toggle('sidebar-collapsed', isCollapsed);
  });

  if (collapsed) {
    const mc = document.querySelector('.main-content');
    if (mc) mc.classList.add('sidebar-collapsed');
  }
}
