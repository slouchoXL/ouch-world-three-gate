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

// Inline SVGs that inherit currentColor (so your hover/active styles still work)
const ICON_SVGS = {
  listen: `
 <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24">
   <path d="M16.5,0H7.5C5.019,0,3,2.019,3,4.5v15c0,2.481,2.019,4.5,4.5,4.5h9c2.481,0,4.5-2.019,4.5-4.5V4.5c0-2.481-2.019-4.5-4.5-4.5Zm3.5,19.5c0,1.93-1.57,3.5-3.5,3.5H7.5c-1.93,0-3.5-1.57-3.5-3.5V4.5c0-1.93,1.57-3.5,3.5-3.5h9c1.93,0,3.5,1.57,3.5,3.5v15ZM12,8c1.379,0,2.5-1.122,2.5-2.5s-1.121-2.5-2.5-2.5-2.5,1.122-2.5,2.5,1.121,2.5,2.5,2.5Zm0-4c.827,0,1.5,.673,1.5,1.5s-.673,1.5-1.5,1.5-1.5-.673-1.5-1.5,.673-1.5,1.5-1.5Zm0,7c-2.757,0-5,2.243-5,5s2.243,5,5,5,5-2.243,5-5-2.243-5-5-5Zm0,9c-2.206,0-4-1.794-4-4s1.794-4,4-4,4,1.794,4,4-1.794,4-4,4Zm1-4c0,.552-.448,1-1,1s-1-.448-1-1,.448-1,1-1,1,.448,1,1Z"/>
 </svg>`,
  buy: `
  <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24">
    <path d="m23.433,4.915c-.477-.582-1.182-.915-1.934-.915H4.49l-.256-1.843c-.17-1.229-1.234-2.157-2.476-2.157H.5C.224,0,0,.224,0,.5s.224.5.5.5h1.259c.745,0,1.383.556,1.485,1.294l1.781,12.825c.308,2.212,2.225,3.881,4.457,3.881h10.018c.276,0,.5-.224.5-.5s-.224-.5-.5-.5h-10.018c-1.73,0-3.214-1.289-3.462-3h12.64c2.138,0,3.993-1.521,4.412-3.617l.879-4.393c.147-.738-.042-1.494-.519-2.075Zm-.462,1.879l-.879,4.393c-.326,1.63-1.77,2.813-3.432,2.813H5.879l-1.25-9h16.87c.451,0,.874.2,1.16.549.286.349.399.803.312,1.245Zm-15.971,13.206c-1.103,0-2,.897-2,2s.897,2,2,2,2-.897,2-2-.897-2-2-2Zm0,3c-.552,0-1-.449-1-1s.448-1,1-1,1,.449,1,1-.448,1-1,1Zm10-3c-1.103,0-2,.897-2,2s.897,2,2,2,2-.897,2-2-.897-2-2-2Zm0,3c-.552,0-1-.449-1-1s.448-1,1-1,1,.449,1,1-.448,1-1,1Z"/>
  </svg>`,
  explore: `
    <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24">
      <path d="M23.551,4.779c-.548-1.078-1.482-1.875-2.634-2.246L13.72,.217c-1.159-.373-2.393-.267-3.472,.3-1.079,.567-1.866,1.521-2.217,2.688l-.239,.794h-3.293C2.019,4,0,6.019,0,8.5v11c0,2.481,2.019,4.5,4.5,4.5h7c1.584,0,2.973-.827,3.775-2.068,.239,.039,.477,.074,.713,.074,1.902,0,3.646-1.216,4.266-3.088l3.557-10.688c.38-1.147,.288-2.373-.26-3.451ZM11.5,23H4.5c-1.93,0-3.5-1.57-3.5-3.5V8.5c0-1.93,1.57-3.5,3.5-3.5h7c1.93,0,3.5,1.57,3.5,3.5v11c0,1.93-1.57,3.5-3.5,3.5ZM22.861,7.916l-3.557,10.687c-.51,1.543-1.998,2.496-3.576,2.38,.164-.467,.271-.961,.271-1.483V8.5c0-2.481-2.019-4.5-4.5-4.5h-2.664l.152-.506c.273-.908,.886-1.65,1.725-2.091,.839-.441,1.801-.523,2.7-.233l7.197,2.316c.896,.288,1.623,.908,2.049,1.747,.426,.838,.497,1.791,.202,2.683Z"/>
    </svg>`

};

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
      btn.innerHTML = ICON_SVGS[g] || '•';
  //  btn.textContent = iconFor[g] || '•';
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
       // cancelTrayClose();
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

  const group        = btn.dataset.group;
  const hoverCapable = window.matchMedia('(hover:hover)').matches;
  const overlayOpen  = !overlayEl.hidden;

  if (!hoverCapable && !overlayOpen){
    // MOBILE / TOUCH: toggle tray (don’t navigate)
    if (trayOpenFor === group){
      closeTray();         // hides tray + brief hover mute
    } else {
      openTrayFor(group);  // centers + fills + shows the tray
    }
    e.preventDefault();
    e.stopPropagation();
    return;
  }

  if (hoverCapable && !overlayOpen){
    // DESKTOP landing: toggle tray on click (hover also opens it)
    if (trayOpenFor === group){
      closeTray();
    } else {
      openTrayFor(group);
    }
    return;
  }

  // When overlay is open, clicks should navigate instead of toggling
  navigateTo(group, null);
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
    // What are we over *at the moment of closing*?
    const el = document.elementFromPoint(lastPointerX, lastPointerY);
    const overFooter = !!(el && el.closest && el.closest('#siteFooter'));
    const overTray   = !!(el && el.closest && el.closest('#pillsRail'));
    const laneEl     = el && el.closest && el.closest('#lanes .lane');

    // If we somehow ended up back over tray/footer, abort closing.
    if (overFooter || overTray) return;

    // Close the tray now.
    closeTray(); // also applies the hover mute

    // If pointer is over a lane, keep THAT lane highlighted.
    if (laneEl && laneEl.dataset && laneEl.dataset.group){
      const g = laneEl.dataset.group;
      highlightFooter(g);
      renderPills(g);                     // prepares content (tray can remain closed)
      setTrayAnchorForVisible(visibleGroups, g);
      previewIndex(indexForGroupSlug(g)); // 3D highlight for that lane
    } else {
      // Otherwise go back to the currently active (middle) selection.
      restoreActiveUI();
      previewIndex(-1);
    }
  }, delay);
}
// keep the tray open while pointer is over it (or the footer)
pillsRail.addEventListener('mouseenter', cancelTrayClose);
footer.addEventListener('mouseenter', cancelTrayClose);

// close only if leaving BOTH tray and footer
pillsRail.addEventListener('mouseleave', (e)=>{
  const to = e.relatedTarget;
  if (to && (to.closest('#pillsRail') || to.closest('#siteFooter'))) return;
  scheduleTrayClose(120);   // lane-aware delayed close
});

footer.addEventListener('mouseleave', (e)=>{
  const to = e.relatedTarget;
  if (to && (to.closest('#pillsRail') || to.closest('#siteFooter'))) return;
  scheduleTrayClose(120);   // lane-aware delayed close
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

