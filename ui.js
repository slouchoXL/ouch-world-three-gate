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
const pillsRail  = document.getElementById('pillsRail'); // the tray
const overlayEl  = document.getElementById('overlay');
const overlayT   = document.getElementById('overlay-title');
const overlayB   = document.getElementById('overlay-body');
const overlayX   = document.getElementById('overlay-close');
const canvas     = document.getElementById('webgl');
const lanesRoot  = document.getElementById('lanes');

/* ---------- Helpers ---------- */
const indexToGroup = i => CARDS[i]?.slug ?? 'listen';
const titleMap     = { listen: 'Listen', buy: 'Buy', explore: 'Explore' };
const iconFor      = { listen:'🎧', buy:'💵', explore:'🧩' };

// Which groups are currently visible in 3D (default to 3-up)
let visibleGroups = ['listen','buy','explore'];

/* ---------- Hover mute (prevents tray flicker on fast exits) ---------- */
const HOVER_MUTE_MS = 180;
function hoverMuted(){ return performance.now() < (window.__hoverMuteUntil || 0); }
function muteHover(ms = HOVER_MUTE_MS){ window.__hoverMuteUntil = performance.now() + ms; }

/* ========= TRAY (pills) ========= */

let trayOpenFor = null; // 'listen' | 'buy' | 'explore' | null

// Center the tray over the selected icon *within current visible groups*
function setTrayAnchorForVisible(groups, group){
  const n   = Math.max(1, groups.length);
  const idx = Math.max(0, groups.indexOf(group));
  const percent = ((idx + 0.5) / n) * 100; // center of that column
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

function openTrayFor(group){
  if (!group) return;
  trayOpenFor = group;
  highlightFooter(group);
  renderPills(group);
  setTrayAnchorForVisible(visibleGroups, group);
  pillsRail.classList.add('open'); // show tray
}

function closeTray(muteMs = HOVER_MUTE_MS){
  if (!trayOpenFor) return;
  pillsRail.classList.remove('open'); // hide tray
  trayOpenFor = null;
  muteHover(muteMs); // guard against immediate lane hover
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
  footer.style.setProperty('--cols', String(Math.max(1, groups.length)));
}

let lastPointerX = 0, lastPointerY = 0;

// Track pointer globally
document.addEventListener('pointermove', (e)=>{
  lastPointerX = e.clientX; lastPointerY = e.clientY;
  // If tray is open and we are not over tray/footer, start a delayed close
  if (trayOpenFor && !isOverTrayOrFooter(e.target)){
    scheduleGlobalClose();
  } else if (globalCloseTimer){
    clearTimeout(globalCloseTimer);
    globalCloseTimer = null;
  }
});

// Click/tap anywhere outside tray/footer should close immediately
document.addEventListener('pointerdown', (e)=>{
  if (!trayOpenFor) return;
  if (!isOverTrayOrFooter(e.target)){
    closeTray(0);
  }
});

function renderLanes(groups){
  const root = lanesRoot;
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

  // Lanes: highlight only — DO NOT open the tray
  root.querySelectorAll('.lane').forEach(lane=>{
    lane.addEventListener('mouseenter', ()=>{
      if (hoverMuted()) return;
      const g = lane.dataset.group;
      if (!g) return;
      previewIndex(indexForGroupSlug(g)); // 3D highlight
      highlightFooter(g);                 // footer state
    });
    lane.addEventListener('mouseleave', (e)=>{
      if (isInsideUISurfaces(e.relatedTarget)) return;
      // Restore highlight to current; tray state untouched
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

function isOverTrayOrFooter(el){
  if (!el) return false;
  return !!(el.closest('#pillsRail') || el.closest('#siteFooter'));
}

let globalCloseTimer = null;
function scheduleGlobalClose(){
  if (!trayOpenFor) return;
  if (globalCloseTimer) clearTimeout(globalCloseTimer);
  globalCloseTimer = setTimeout(()=>{
    // only close if we're STILL not over tray/footer
    const el = document.elementFromPoint(lastPointerX, lastPointerY);
    if (!isOverTrayOrFooter(el)) closeTray(0);
  }, 150);
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
  trayOpenFor = null;
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
  navigateTo(g, page || null, { syncScene: overlayEl.hidden });
});

/* ========= EVENTS ========= */

// Layout → UI (from main.module.js)
window.addEventListener('layoutchange', (e)=>{
  const groups = e.detail?.visibleGroups || e.detail?.groups;
  if (!Array.isArray(groups) || groups.length === 0) return;

  visibleGroups = groups.slice();

  renderFooterIcons(visibleGroups);
  renderLanes(visibleGroups);

  const currentGroup = indexToGroup(getCurrentIndex());
  const anchorGroup = visibleGroups.includes(currentGroup)
    ? currentGroup
    : visibleGroups[0];

  highlightFooter(anchorGroup);
  renderPills(anchorGroup);
  setTrayAnchorForVisible(visibleGroups, anchorGroup);

  if (pillsRail.classList.contains('open')){
    // keep the tray centered over the correct column after layout changes
    setTrayAnchorForVisible(visibleGroups, trayOpenFor || anchorGroup);
  }
});

// Footer hover: open/close tray (desktop, overlay closed)
footer.addEventListener('mouseenter', e=>{
  if (hoverMuted()) return;
  const btn = e.target.closest('.footer-icon');
  if (!btn) return;
  if (!window.matchMedia('(hover:hover)').matches) return;
  if (!overlayEl.hidden) return;
  openTrayFor(btn.dataset.group);
}, true);

footer.addEventListener('mouseleave', (e)=>{
  // If you move directly into the tray, don't close here (keep it open)
  if (e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('#pillsRail')) return;
  // Otherwise, let the global watcher decide (starts a delayed close)
  if (trayOpenFor && !isOverTrayOrFooter(e.relatedTarget)){
    scheduleGlobalClose();
  }
});

// Footer click:
// - Desktop landing: toggle tray
// - Mobile or overlay open: navigate to group
footer.addEventListener('click', (e)=>{
  const btn = e.target.closest('.footer-icon');
  if (!btn) return;

  const hoverCapable = window.matchMedia('(hover:hover)').matches;
  const overlayOpen  = !overlayEl.hidden;

  if (hoverCapable && !overlayOpen){
    if (trayOpenFor === btn.dataset.group){
      closeTray();
    } else {
      openTrayFor(btn.dataset.group);
    }
    return;
  }
  navigateTo(btn.dataset.group, null);
});

// Keep tray open while hovering it; close when leaving (unless going back to footer)
pillsRail.addEventListener('mouseenter', ()=>{
  // cancel any pending close
});
// --- shared helpers for smooth closing ---
let trayCloseTimer = null;

function cancelTrayClose(){
  if (trayCloseTimer){ clearTimeout(trayCloseTimer); trayCloseTimer = null; }
}

function restoreActiveUI(){
  const active = indexToGroup(getCurrentIndex());
  highlightFooter(active);
  renderPills(active);
  setTrayAnchorForVisible(visibleGroups, active);
}

function scheduleTrayClose(delay = 120){
  cancelTrayClose();
  trayCloseTimer = setTimeout(()=>{
    closeTray();          // your function that hides the tray + hover mute
    restoreActiveUI();    // put footer/pills back to the active card
    previewIndex(-1);     // clear temporary highlight
  }, delay);
}

// keep the tray open while pointer is over it (or the footer)
pillsRail.addEventListener('mouseenter', cancelTrayClose);
footer.addEventListener('mouseenter', cancelTrayClose);

// close only if leaving BOTH tray and footer
pillsRail.addEventListener('mouseleave', (e)=>{
  const to = e.relatedTarget;
  if (to && (to.closest('#pillsRail') || to.closest('#siteFooter'))) return;
  scheduleTrayClose();
});

footer.addEventListener('mouseleave', (e)=>{
  const to = e.relatedTarget;
  if (to && (to.closest('#pillsRail') || to.closest('#siteFooter'))) return;
  scheduleTrayClose();
});

// Scene → UI: keep footer/pills in sync when current index changes
window.addEventListener('cardchange', (e)=>{
  const group = e.detail?.slug || indexToGroup(getCurrentIndex());
  highlightFooter(group);
  renderPills(group);
  setTrayAnchorForVisible(visibleGroups, group);
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
  renderFooterIcons(visibleGroups);
  renderLanes(visibleGroups);

  const { group, page } = parseHash();
  const g = group || indexToGroup(getCurrentIndex());
  highlightFooter(g);
  renderPills(g, page || null);
  setTrayAnchorForVisible(visibleGroups, g);
  if (page) openPage(g, page);

  overlayEl.addEventListener('keydown', (ev)=>{
    if (ev.key === 'Escape'){
      navigateTo(indexToGroup(getCurrentIndex()), null, { syncScene:false });
    }
  });
})();
