// ui.js — responsive footer/lanes + pills + overlay routing
import {
  CARDS,
  selectGroup,
  getCurrentIndex,
  selectIndex,
  previewIndex,
  indexForGroupSlug
} from './main.module.js';

/* ---------- Sitemap (pills per group) ---------- */
const SITEMAP = {
  listen: [
    { slug: 'discography', label:'Discography' },
    { slug: 'radio',       label:'Radio' },
    { slug: 'guitar',      label:'Guitar Hero' },
  ],
  buy: [
    { slug: 'merch',     label:'Merch' },
    { slug: 'tickets',   label:'Tickets' },
    { slug: 'subscribe', label:'Subscribe' },
  ],
  explore: [
    { slug: 'packs', label:'Pack Opening' },
    { slug: 'dex',   label:'SlouchoDex' },
  ],
};

/* ---------- DOM ---------- */
const footer     = document.getElementById('siteFooter');
const pillsRail  = document.getElementById('pillsRail');
const overlayEl  = document.getElementById('overlay');
const overlayT   = document.getElementById('overlay-title');
const overlayB   = document.getElementById('overlay-body');
const overlayX   = document.getElementById('overlay-close');
const canvas     = document.getElementById('webgl');
const lanesRoot  = document.getElementById('lanes'); // container for hover lanes

/* ---------- Helpers ---------- */
const indexToGroup = i => CARDS[i]?.slug ?? 'listen';
const titleMap     = { listen: 'Listen', buy: 'Buy', explore: 'Explore' };
const iconFor      = { listen:'🎧', buy:'💵', explore:'🧩' };

// Which groups are currently visible in 3D (default to 3-up)
let visibleGroups = ['listen','buy','explore'];

/* ========= RENDERERS ========= */

function setPillsAnchorForVisible(groups, group){
  const n   = Math.max(1, groups.length);
  const idx = Math.max(0, groups.indexOf(group));
  const percent = ((idx + 0.5) / n) * 100; // center of that lane
  pillsRail.style.left = percent + '%';
  pillsRail.style.transform = 'translateX(-50%)';
}

function renderPills(group, activePageSlug = null){
  pillsRail.innerHTML = '';
  (SITEMAP[group] ?? []).forEach(({ slug, label })=>{
    const btn = document.createElement('button');
    btn.className = 'pill' + (activePageSlug === slug ? ' active' : '');
    btn.textContent = label;
    btn.dataset.page = `${group}/${slug}`;
    btn.addEventListener('click', ()=> navigateTo(group, slug));
    pillsRail.appendChild(btn);
  });
}

function highlightFooter(group){
  footer.querySelectorAll('.footer-icon').forEach(btn=>{
    const on = btn.dataset.group === group;
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.style.borderColor = on ? '#aaa' : 'var(--chip-border)';
    btn.style.transform   = on ? 'translateY(-1px)' : 'none';
  });
}

function renderFooterIcons(groups){
  footer.innerHTML = '';
  groups.forEach(g=>{
    const btn = document.createElement('button');
    btn.className = 'footer-icon';
    btn.dataset.group = g;
    btn.setAttribute('aria-label', g);
    btn.textContent = iconFor[g] || '•';
    footer.appendChild(btn);
  });
  // let CSS adapt columns: grid-template-columns: repeat(var(--cols), 1fr)
  footer.style.setProperty('--cols', String(groups.length));
}

function renderLanes(groups){
  if (!lanesRoot) return;
  lanesRoot.innerHTML = '';
  groups.forEach(g=>{
    const lane = document.createElement('div');
    lane.className = 'lane';
    lane.dataset.group = g;
    lanesRoot.appendChild(lane);
  });

  // Bind hover (desktop)
  lanesRoot.querySelectorAll('.lane').forEach(lane=>{
    lane.addEventListener('mouseenter', ()=>{
      const g = lane.dataset.group; if (!g) return;
      previewGroup(g);
    });
    lane.addEventListener('mouseleave', (e)=>{
      if (isInsideUISurfaces(e.relatedTarget)) return;
      restoreActive();
    });
  });
}

/* ========= PREVIEW / RESTORE ========= */

function isInsideUISurfaces(el){
  if (!el) return false;
  return !!(el.closest('#lanes') || el.closest('#siteFooter') || el.closest('#pillsRail'));
}

function previewGroup(group){
  highlightFooter(group);
  renderPills(group);
  setPillsAnchorForVisible(visibleGroups, group);
  // Only highlight in 3D; do NOT move or scale
  previewIndex(indexForGroupSlug(group));
}

function restoreActive(){
  const active = indexToGroup(getCurrentIndex());
  highlightFooter(active);
  renderPills(active);
  setPillsAnchorForVisible(visibleGroups, active);
  // Clear temporary preview and revert to normal dimming
  previewIndex(-1);
}

/* ========= OVERLAY CONTENT ========= */

function htmlFor(route){
  switch(route){
    case 'listen/discography': return `<p>Discography grid goes here.</p>`;
    case 'listen/radio':       return `<p>Radio player UI goes here.</p>`;
    case 'listen/guitar':      return `<p>Guitar Hero prototype goes here.</p>`;
    case 'buy/merch':          return `<p>Merch grid goes here.</p>`;
    case 'buy/tickets':        return `<p>Tickets UI goes here.</p>`;
    case 'buy/subscribe':      return `<p>Subscription page goes here.</p>`;
    case 'explore/packs':      return `<p>Daily pack opening goes here.</p>`;
    case 'explore/dex':        return `<p>SlouchoDex collection goes here.</p>`;
    default: return `<p>Coming soon: <strong>${route}</strong></p>`;
  }
}

function openPage(group, page){
  const label = (SITEMAP[group]||[]).find(x=>x.slug===page)?.label ?? page;
  overlayT.textContent = `${titleMap[group] ?? 'Section'} — ${label}`;
  overlayB.innerHTML   = htmlFor(`${group}/${page}`);
  overlayEl.hidden = false;
  canvas?.classList.add('dim-3d');
  overlayEl.focus();
}

/* ========= ROUTER ========= */

function parseHash(){
  const h = (location.hash || '').replace(/^#\/?/, '');
  const [group, page] = h.split('/');
  return { group, page };
}

function navigateTo(group, page=null, { syncScene=true } = {}){
  const newHash = page ? `#/${group}/${page}` : `#/${group}`;
  if (location.hash !== newHash) location.hash = newHash;

  highlightFooter(group);
  renderPills(group, page || null);
  setPillsAnchorForVisible(visibleGroups, group);

  if (syncScene) selectGroup(group);

  if (page){
    openPage(group, page);
  } else {
    overlayEl.hidden = true;
    canvas?.classList.remove('dim-3d');
  }
}

window.addEventListener('hashchange', ()=>{
  const { group, page } = parseHash();
  const g = ['listen','buy','explore'].includes(group) ? group : indexToGroup(getCurrentIndex());
  // Don’t re-aim camera if overlay is open (let in-overlay nav be “soft”)
  navigateTo(g, page || null, { syncScene: overlayEl.hidden });
});

/* ========= EVENTS ========= */

// From main.module.js whenever layout switches 3↔2↔1 or visible set changes
window.addEventListener('layoutchange', (e)=>{
  if (Array.isArray(e.detail?.groups) && e.detail.groups.length){
    visibleGroups = e.detail.groups.slice();
    renderFooterIcons(visibleGroups);
    renderLanes(visibleGroups);

    const active = indexToGroup(getCurrentIndex());
    // If active isn't visible anymore, pick the first visible
    const anchorGroup = visibleGroups.includes(active) ? active : visibleGroups[0];

    highlightFooter(anchorGroup);
    renderPills(anchorGroup);
    setPillsAnchorForVisible(visibleGroups, anchorGroup);
  }
});

// Footer hover (desktop)
footer.addEventListener('mouseenter', e=>{
  const btn = e.target.closest('.footer-icon'); if (!btn) return;
  const g = btn.dataset.group;
  previewGroup(g);
}, true);

footer.addEventListener('mouseleave', (e)=>{
  if (isInsideUISurfaces(e.relatedTarget)) return;
  restoreActive();
});

// Footer clicks:
// - Desktop landing (overlay closed): do nothing (hover controls)
// - Mobile or when overlay is open: click switches group
footer.addEventListener('click', (e)=>{
  const btn = e.target.closest('.footer-icon'); if (!btn) return;
  const group = btn.dataset.group;
  const overlayOpen = !overlayEl.hidden;
  const hoverCapable = window.matchMedia('(hover:hover)').matches;
  if (hoverCapable && !overlayOpen) return;
  navigateTo(group, null);
});

// Pills leave → restore
pillsRail.addEventListener('mouseleave', (e)=>{
  if (isInsideUISurfaces(e.relatedTarget)) return;
  restoreActive();
});

// Scene → UI: keep footer/pills in sync when current index changes
window.addEventListener('cardchange', (e)=>{
  const group = e.detail?.slug || indexToGroup(getCurrentIndex());
  highlightFooter(group);
  if (overlayEl.hidden){
    renderPills(group);
    setPillsAnchorForVisible(visibleGroups, group);
  }
});

// Close overlay
overlayX?.addEventListener('click', ()=>{
  navigateTo(indexToGroup(getCurrentIndex()), null, { syncScene:false });
});

/* ========= INITIAL BOOT ========= */

(function init(){
  // Build footer + lanes for the initial (3-up) state; main will correct via layoutchange
  renderFooterIcons(visibleGroups);
  renderLanes(visibleGroups);

  const { group, page } = parseHash();
  const g = group || indexToGroup(getCurrentIndex());
  highlightFooter(g);
  renderPills(g, page || null);
  setPillsAnchorForVisible(visibleGroups, g);
  if (page) openPage(g, page);

  // Accessibility: escape closes overlay
  overlayEl.addEventListener('keydown', (ev)=>{
    if (ev.key === 'Escape'){
      navigateTo(indexToGroup(getCurrentIndex()), null, { syncScene:false });
    }
  });
})();
