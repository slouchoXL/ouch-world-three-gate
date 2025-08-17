// ui.js — responsive footer/lanes + tray pills + overlay routing
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
const pillsRail  = document.getElementById('pillsRail'); // acts as the tray
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

// optional hover-muting window (used during swipe/drag on desktop if you want)
function hoverMuted(){
  return performance.now() < (window.__hoverMuteUntil || 0);
}

/* ---------- Tray control + hover mute ---------- */
let trayOpenFor = null;                   // 'listen' | 'buy' | 'explore' | null
const HOVER_MUTE_MS = 180;
function hoverMuted(){ return performance.now() < (window.__hoverMuteUntil || 0); }
function muteHover(ms = HOVER_MUTE_MS){ window.__hoverMuteUntil = performance.now() + ms; }

function openTrayFor(group){
  if (!group) return;
  trayOpenFor = group;
  highlightFooter(group);
  renderPills(group);
  setPillsAnchorForVisible(visibleGroups, group);
  pillsRail.classList.add('open');        // show tray
}

function closeTray(muteMs = HOVER_MUTE_MS){
  if (!trayOpenFor) return;
  pillsRail.classList.remove('open');     // hide tray
  trayOpenFor = null;
  muteHover(muteMs);                      // brief guard against lane hover
}

/* ========= TRAY (pills) ========= */

// Center the tray above the selected icon *within current visible groups*
function setTrayAnchorForVisible(groups, group){
  const n   = Math.max(1, groups.length);
  const idx = Math.max(0, groups.indexOf(group));
  const percent = ((idx + 0.5) / n) * 100; // center of that column
  pillsRail.style.left = percent + '%';
  // Y is animated via CSS; here we only center horizontally
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

let hideTimer = null;
function showTray(group, {keepPreview=false} = {}){
  if (hideTimer){ clearTimeout(hideTimer); hideTimer = null; }
  highlightFooter(group);
  renderPills(group);
  setTrayAnchorForVisible(visibleGroups, group);
  pillsRail.classList.add('open');
  if (!keepPreview){
    // just a highlight (no movement)
    previewIndex(indexForGroupSlug(group));
  }
}
function hideTray(delay = 90){
  if (hideTimer) clearTimeout(hideTimer);
  hideTimer = setTimeout(()=>{
    pillsRail.classList.remove('open');
    // Clear preview: restore dimming to current
    previewIndex(-1);
  }, delay);
}

/* ========= FOOTER & LANES ========= */

function highlightFooter(group){
  footer.querySelectorAll('.footer-icon').forEach(btn=>{
    const on = btn.dataset.group === group;
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.style.borderColor = on ? '#aaa' : 'var(--chip-border)';
    btn.style.transform   = on ? 'translateY(-1px)' : 'none';
  });
}

let lastFooterKey = '';
function renderFooterIcons(groups){
  const key = groups.join('|');
  if (key === lastFooterKey && footer.childElementCount === groups.length) return;
  lastFooterKey = key;

  footer.replaceChildren();
  groups.forEach(g=>{
    const btn = document.createElement('button');
    btn.className = 'footer-icon';
    btn.dataset.group = g;
    btn.setAttribute('aria-label', g);
    btn.textContent = iconFor[g] || '•';
    footer.appendChild(btn);
  });
  // Let CSS adapt columns: grid-template-columns: repeat(var(--cols, 3), 1fr)
  footer.style.setProperty('--cols', String(Math.max(1, groups.length)));
}

function renderLanes(groups){
  const root = document.getElementById('lanes');
  if (!root) return;

  const hoverCapable = window.matchMedia('(hover:hover)').matches;
  root.style.display = hoverCapable ? '' : 'none';
  if (!hoverCapable){ root.replaceChildren(); return; }

  root.replaceChildren();
  const n = Math.max(1, groups.length);
  const widthPct = 100 / n;

  groups.forEach((g, i)=>{
    const lane = document.createElement('div');
    lane.className = 'lane';
    lane.dataset.group = g;
    lane.style.left = (i * widthPct) + '%';
    lane.style.width = widthPct + '%';
    root.appendChild(lane);
  });

  root.querySelectorAll('.lane').forEach(lane=>{
    lane.addEventListener('mouseenter', ()=>{
      if (hoverMuted()) return;
      const g = lane.dataset.group;
      if (!g) return;
      // highlight only; do NOT open tray here
      previewIndex(indexForGroupSlug(g));
      highlightFooter(g);
      // keep tray state as-is
    });

    lane.addEventListener('mouseleave', (e)=>{
      if (isInsideUISurfaces(e.relatedTarget)) return;
      // don’t close tray here; just restore highlight
      previewIndex(-1);
      const active = indexToGroup(getCurrentIndex());
      highlightFooter(active);
    });
  });
}

function isInsideUISurfaces(el){
  if (!el) return false;
  return !!(el.closest('#lanes') || el.closest('#siteFooter') || el.closest('#pillsRail'));
}

function previewGroup(group){
  highlightFooter(group);
  renderPills(group);                         // prep content (tray may be closed)
  setTrayAnchorForVisible(visibleGroups, group);
  previewIndex(indexForGroupSlug(group));    // only highlight; no motion
}

function restoreActive(){
  const active = indexToGroup(getCurrentIndex());
  highlightFooter(active);
  renderPills(active);
  setTrayAnchorForVisible(visibleGroups, active);
  previewIndex(-1); // clear preview → restore normal dimming
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
  pillsRail.classList.remove('open'); // close tray when overlay opens
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
  setTrayAnchorForVisible(visibleGroups, group);

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

// Layout → UI (from main.module.js)
window.addEventListener('layoutchange', (e)=>{
  const groups = e.detail?.visibleGroups || e.detail?.groups;
  if (!Array.isArray(groups) || groups.length === 0) return;

  // 1) persist the new visibility model
  visibleGroups = groups.slice();

  // 2) rebuild UI surfaces to match (icons + lanes)
  renderFooterIcons(visibleGroups);
  renderLanes(visibleGroups);

  // 3) choose the anchor group (current if still visible, else first visible)
  const currentGroup = indexToGroup(getCurrentIndex());
  const anchorGroup = visibleGroups.includes(currentGroup)
    ? currentGroup
    : visibleGroups[0];

  // 4) update footer highlight + pills and anchor them under the right column
  highlightFooter(anchorGroup);
  renderPills(anchorGroup);
  setTrayAnchorForVisible(visibleGroups, anchorGroup);

  // If the tray is open, keep it pinned over the new anchor
  if (pillsRail.classList.contains('open')){
    setTrayAnchorForVisible(visibleGroups, anchorGroup);
  }
});

// Footer hover (desktop): open tray above that icon
// Footer hover: open tray over that icon (desktop only, overlay closed)
footer.addEventListener('mouseenter', e=>{
  if (hoverMuted()) return;
  const btn = e.target.closest('.footer-icon');
  if (!btn) return;
  if (!window.matchMedia('(hover:hover)').matches) return;
  if (!overlayEl.hidden) return;          // don’t flap while overlay is open
  openTrayFor(btn.dataset.group);
}, true);

footer.addEventListener('mouseleave', (e)=>{
  if (isInsideUISurfaces(e.relatedTarget)) return;
  // close tray and restore highlights
  closeTray();
  const active = indexToGroup(getCurrentIndex());
  highlightFooter(active);
  renderPills(active);
  setPillsAnchorForVisible(visibleGroups, active);
  previewIndex(-1);
});

// Footer click: mobile (or overlay open) navigates; desktop landing uses hover
footer.addEventListener('click', (e)=>{
  const btn = e.target.closest('.footer-icon');
  if (!btn) return;
  const hoverCapable = window.matchMedia('(hover:hover)').matches;
  const overlayOpen  = !overlayEl.hidden;

  if (hoverCapable && !overlayOpen){
    // desktop landing: hover already opened tray; keep click to toggle it
    if (trayOpenFor === btn.dataset.group){
      closeTray();
    } else {
      openTrayFor(btn.dataset.group);
    }
    return;
  }
  // mobile or overlay open → navigate
  navigateTo(btn.dataset.group, null);
});

// Keep tray open while hovering it; close when leaving it (unless going back to footer)
pillsRail.addEventListener('mouseenter', ()=>{
  if (hideTimer){ clearTimeout(hideTimer); hideTimer = null; }
});
pillsRail.addEventListener('mouseleave', (e)=>{
  if (isInsideUISurfaces(e.relatedTarget)) return;
  closeTray();                             // add hover mute
  const active = indexToGroup(getCurrentIndex());
  highlightFooter(active);
  renderPills(active);
  setPillsAnchorForVisible(visibleGroups, active);
  previewIndex(-1);
});

// Scene → UI: keep footer/pills in sync when current index changes
window.addEventListener('cardchange', (e)=>{
  const group = e.detail?.slug || indexToGroup(getCurrentIndex());
  highlightFooter(group);
  renderPills(group);
  setTrayAnchorForVisible(visibleGroups, group);
  // Keep tray position if it is open
  if (pillsRail.classList.contains('open')){
    setTrayAnchorForVisible(visibleGroups, group);
  }
});

// Close overlay
overlayX?.addEventListener('click', ()=>{
  navigateTo(indexToGroup(getCurrentIndex()), null, { syncScene:false });
});

/* ========= INITIAL BOOT ========= */

(function init(){
  // Build initial UI surfaces; main.module will refine via layoutchange
  renderFooterIcons(visibleGroups);
  renderLanes(visibleGroups);

  const { group, page } = parseHash();
  const g = group || indexToGroup(getCurrentIndex());
  highlightFooter(g);
  renderPills(g, page || null);
  setTrayAnchorForVisible(visibleGroups, g);
  if (page) openPage(g, page);

  // Accessibility: escape closes overlay
  overlayEl.addEventListener('keydown', (ev)=>{
    if (ev.key === 'Escape'){
      navigateTo(indexToGroup(getCurrentIndex()), null, { syncScene:false });
    }
  });
})();
