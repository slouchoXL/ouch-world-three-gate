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
 <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 24 24">
   <!-- Generator: Adobe Illustrator 29.7.1, SVG Export Plug-In . SVG Version: 2.1.1 Build 8)  -->
   <defs>
     <style>
       .st0 {
         fill: #fff;
       }
     </style>
   </defs>
   <path class="st0" d="M16.5,0H7.5C5,0,3,2,3,4.5v15c0,2.5,2,4.5,4.5,4.5h9c2.5,0,4.5-2,4.5-4.5V4.5c0-2.5-2-4.5-4.5-4.5ZM20,19.5c0,1.9-1.6,3.5-3.5,3.5H7.5c-1.9,0-3.5-1.6-3.5-3.5V4.5c0-1.9,1.6-3.5,3.5-3.5h9c1.9,0,3.5,1.6,3.5,3.5v15ZM12,8c1.4,0,2.5-1.1,2.5-2.5s-1.1-2.5-2.5-2.5-2.5,1.1-2.5,2.5,1.1,2.5,2.5,2.5ZM12,4c.8,0,1.5.7,1.5,1.5s-.7,1.5-1.5,1.5-1.5-.7-1.5-1.5.7-1.5,1.5-1.5ZM12,11c-2.8,0-5,2.2-5,5s2.2,5,5,5,5-2.2,5-5-2.2-5-5-5ZM12,20c-2.2,0-4-1.8-4-4s1.8-4,4-4,4,1.8,4,4-1.8,4-4,4ZM13,16c0,.6-.4,1-1,1s-1-.4-1-1,.4-1,1-1,1,.4,1,1Z"/>
 </svg>`,
  buy: `
  <svg id="Outline" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 24 24">
    <!-- Generator: Adobe Illustrator 29.7.1, SVG Export Plug-In . SVG Version: 2.1.1 Build 8)  -->
    <defs>
      <style>
        .st0 {
          fill: #fff;
        }
      </style>
    </defs>
    <path class="st0" d="M23.4,4.9c-.5-.6-1.2-.9-1.9-.9H4.5l-.3-1.8c-.2-1.2-1.2-2.2-2.5-2.2H.5C.2,0,0,.2,0,.5s.2.5.5.5h1.3c.7,0,1.4.6,1.5,1.3l1.8,12.8c.3,2.2,2.2,3.9,4.5,3.9h10c.3,0,.5-.2.5-.5s-.2-.5-.5-.5h-10c-1.7,0-3.2-1.3-3.5-3h12.6c2.1,0,4-1.5,4.4-3.6l.9-4.4c.1-.7,0-1.5-.5-2.1h0ZM23,6.8l-.9,4.4c-.3,1.6-1.8,2.8-3.4,2.8H5.9l-1.2-9h16.9c.5,0,.9.2,1.2.5s.4.8.3,1.2ZM7,20c-1.1,0-2,.9-2,2s.9,2,2,2,2-.9,2-2-.9-2-2-2ZM7,23c-.6,0-1-.4-1-1s.4-1,1-1,1,.4,1,1-.4,1-1,1ZM17,20c-1.1,0-2,.9-2,2s.9,2,2,2,2-.9,2-2-.9-2-2-2ZM17,23c-.6,0-1-.4-1-1s.4-1,1-1,1,.4,1,1-.4,1-1,1Z"/>
  </svg>`,
  explore: `
    <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 24 24">
      <!-- Generator: Adobe Illustrator 29.7.1, SVG Export Plug-In . SVG Version: 2.1.1 Build 8)  -->
      <defs>
        <style>
          .st0 {
            fill: #fff;
          }
        </style>
      </defs>
      <path class="st0" d="M23.6,4.8c-.5-1.1-1.5-1.9-2.6-2.2L13.7.2c-1.2-.4-2.4-.3-3.5.3-1.1.6-1.9,1.5-2.2,2.7l-.2.8h-3.3c-2.5,0-4.5,2-4.5,4.5v11c0,2.5,2,4.5,4.5,4.5h7c1.6,0,3-.8,3.8-2.1.2,0,.5,0,.7,0,1.9,0,3.6-1.2,4.3-3.1l3.6-10.7c.4-1.1.3-2.4-.3-3.5ZM11.5,23h-7c-1.9,0-3.5-1.6-3.5-3.5v-11c0-1.9,1.6-3.5,3.5-3.5h7c1.9,0,3.5,1.6,3.5,3.5v11c0,1.9-1.6,3.5-3.5,3.5ZM22.9,7.9l-3.6,10.7c-.5,1.5-2,2.5-3.6,2.4.2-.5.3-1,.3-1.5v-11c0-2.5-2-4.5-4.5-4.5h-2.7l.2-.5c.3-.9.9-1.6,1.7-2.1.8-.4,1.8-.5,2.7-.2l7.2,2.3c.9.3,1.6.9,2,1.7.4.8.5,1.8.2,2.7h0Z"/>
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

// --- iOS-safe inline SVG builder that strips embedded styles/fills ---
function createInlineSVG(markup){
  const tmp = document.createElement('div');
  tmp.innerHTML = markup.trim();
  const src = tmp.querySelector('svg');
  if (!src) return null;

  const NS = 'http://www.w3.org/2000/svg';

  function cloneNodeNS(node){
    if (node.nodeType === 3) return document.createTextNode(node.nodeValue);
    if (node.nodeType !== 1) return null;

    // Skip any <style> blocks embedded in the SVG
    if (node.tagName && node.tagName.toLowerCase() === 'style') return null;

    const el = document.createElementNS(NS, node.tagName.toLowerCase());

    // Copy attributes, but drop those that fight coloring/size
    for (let i = 0; i < node.attributes.length; i++){
      const a = node.attributes[i];
      const name = a.name.toLowerCase();
      if (name === 'class' || name === 'style' || name === 'fill' || name === 'stroke') continue;
      el.setAttribute(name, a.value);
    }

    // Recurse children
    for (let i = 0; i < node.childNodes.length; i++){
      const child = cloneNodeNS(node.childNodes[i]);
      if (child) el.appendChild(child);
    }

    // Ensure shapes inherit currentColor if they were hard-coded
    // (presentation attributes removed above; this is just a safety net)
    if (['path','rect','circle','ellipse','polygon','polyline','line','g'].includes(el.tagName)){
      // don’t set explicit fill/stroke; inheritance via CSS is enough
    }
    return el;
  }

  const out = document.createElementNS(NS, 'svg');

  // Carry over viewBox (not width/height)
  const vb = src.getAttribute('viewBox');
  if (vb) out.setAttribute('viewBox', vb);

  // Sensible default size; CSS can override
  out.setAttribute('width', '24');
  out.setAttribute('height', '24');
  out.setAttribute('focusable', 'false');
  out.setAttribute('aria-hidden', 'true');

  // Copy remaining attributes except width/height
  for (let i = 0; i < src.attributes.length; i++){
    const a = src.attributes[i];
    const name = a.name.toLowerCase();
    if (name === 'width' || name === 'height') continue;
    out.setAttribute(name, a.value);
  }

  // Children (with sanitization)
  for (let i = 0; i < src.childNodes.length; i++){
    const child = cloneNodeNS(src.childNodes[i]);
    if (child) out.appendChild(child);
  }

  // Force paint via currentColor
  out.style.fill = 'currentColor';
  out.style.stroke = 'currentColor';
  return out;
}
function highlightFooter(group){
  footer.querySelectorAll('.footer-icon').forEach(btn=>{
    const on = btn.dataset.group === group;
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.style.borderColor = on ? '#aaa' : 'var(--chip-border)';
    btn.style.transform   = on ? 'translateY(-1px)' : 'none';
  });
}

//let lastFooterKey = '';
let _footerRenderedOnce = false;

// robustly build an inline SVG that iOS Safari will actually paint
function createInlineSVG(markup){
  const tmp = document.createElement('div');
  tmp.innerHTML = markup.trim();
  const src = tmp.querySelector('svg');
  if (!src) return null;

  const NS = 'http://www.w3.org/2000/svg';

  function cloneNodeNS(node){
    if (node.nodeType === 3) {
      // text node (rare in icons)
      return document.createTextNode(node.nodeValue);
    }
    if (node.nodeType !== 1) return null;

    // create element in proper namespace
    const el = document.createElementNS(NS, node.tagName.toLowerCase());

    // copy attributes
    for (let i = 0; i < node.attributes.length; i++){
      const attr = node.attributes[i];
      el.setAttribute(attr.name, attr.value);
    }

    // recurse children
    for (let i = 0; i < node.childNodes.length; i++){
      const child = cloneNodeNS(node.childNodes[i]);
      if (child) el.appendChild(child);
    }
    return el;
  }

  const out = document.createElementNS(NS, 'svg');

  // viewBox if present
  const vb = src.getAttribute('viewBox');
  if (vb) out.setAttribute('viewBox', vb);

  // sensible default size; CSS can override
  out.setAttribute('width',  '24');
  out.setAttribute('height', '24');
  out.setAttribute('focusable', 'false');
  out.setAttribute('aria-hidden', 'true');

  // copy all attributes except width/height (we set those)
  for (let i = 0; i < src.attributes.length; i++){
    const a = src.attributes[i];
    if (a.name === 'width' || a.name === 'height') continue;
    out.setAttribute(a.name, a.value);
  }

  // copy children in correct namespace
  for (let i = 0; i < src.childNodes.length; i++){
    const child = cloneNodeNS(src.childNodes[i]);
    if (child) out.appendChild(child);
  }

  // force painting via currentColor (still respects hard-coded fills unless you override)
  out.style.fill = 'currentColor';
  out.style.stroke = 'currentColor';
  return out;
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

    // Try to build an inline SVG node; fallback to emoji if anything fails
    let inserted = false;
    try {
      if (ICON_SVGS[g]){
        const svgNode = createInlineSVG(ICON_SVGS[g]);
        if (svgNode){
          btn.appendChild(svgNode);
          inserted = true;
        }
      }
    } catch (e){
      // swallow and fallback to text below
    }
    if (!inserted){
      btn.textContent = iconFor[g] || '•';
    }

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

