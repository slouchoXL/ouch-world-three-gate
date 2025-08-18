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
   
  ],
  buy: [
    { slug: 'merch',     label:'Store' },
    { slug: 'tickets',   label:'Tickets' },
   
  ],
  explore: [
    { slug: 'packs', label:'Packs' },
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
const lanesRoot  = document.getElementById('lanes');

/* ---------- Helpers ---------- */
const indexToGroup = i => CARDS[i]?.slug ?? 'listen';
const titleMap     = { listen: 'Listen', buy: 'Buy', explore: 'Explore' };
const iconFor      = { listen:'🎧', buy:'💵', explore:'🧩' };

const IS_TOUCH = window.matchMedia('(hover:none)').matches;

/* ---------- Minimal SVG paths (no <defs>/<style>) ---------- */
/* We’ll use inline SVG on desktop; data-URI background on touch */
const ICON_SVGS = {
  listen: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16.5,0H7.5C5,0,3,2,3,4.5v15c0,2.5,2,4.5,4.5,4.5h9c2.5,0,4.5-2,4.5-4.5V4.5c0-2.5-2-4.5-4.5-4.5ZM20,19.5c0,1.9-1.6,3.5-3.5,3.5H7.5c-1.9,0-3.5-1.6-3.5-3.5V4.5c0-1.9,1.6-3.5,3.5-3.5h9c1.9,0,3.5,1.6,3.5,3.5v15ZM12,8c1.4,0,2.5-1.1,2.5-2.5s-1.1-2.5-2.5-2.5-2.5,1.1-2.5,2.5,1.1,2.5,2.5,2.5ZM12,4c.8,0,1.5.7,1.5,1.5s-.7,1.5-1.5,1.5-1.5-.7-1.5-1.5.7-1.5,1.5-1.5ZM12,11c-2.8,0-5,2.2-5,5s2.2,5,5,5,5-2.2,5-5-2.2-5-5-5ZM12,20c-2.2,0-4-1.8-4-4s1.8-4,4-4,4,1.8,4,4-1.8,4-4,4ZM13,16c0,.6-.4,1-1,1s-1-.4-1-1,.4-1,1-1,1,.4,1,1Z"/></svg>`,
  buy:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M23.4,4.9c-.5-.6-1.2-.9-1.9-.9H4.5l-.3-1.8c-.2-1.2-1.2-2.2-2.5-2.2H.5C.2,0,0,.2,0,.5s.2.5.5.5h1.3c.7,0,1.4.6,1.5,1.3l1.8,12.8c.3,2.2,2.2,3.9,4.5,3.9h10c.3,0,.5-.2,.5-.5s-.2-.5-.5-.5h-10c-1.7,0-3.2-1.3-3.5-3h12.6c2.1,0,4-1.5,4.4-3.6l.9-4.4c.1-.7,0-1.5-.5-2.1ZM23,6.8l-.9,4.4c-.3,1.6-1.8,2.8-3.4,2.8H5.9l-1.2-9h16.9c.5,0,.9.2,1.2.5s.4.8,.3,1.2ZM7,20c-1.1,0-2,.9-2,2s.9,2,2,2,2-.9,2-2-.9-2-2-2ZM7,23c-.6,0-1-.4-1-1s.4-1,1-1,1,.4,1,1-.4,1-1,1ZM17,20c-1.1,0-2,.9-2,2s.9,2,2,2,2-.9,2-2-.9-2-2-2ZM17,23c-.6,0-1-.4-1-1s.4-1,1-1,1,.4,1,1-.4,1-1,1Z"/></svg>`,
  explore:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M23.6,4.8c-.5-1.1-1.5-1.9-2.6-2.2L13.7.2c-1.2-.4-2.4-.3-3.5.3-1.1.6-1.9,1.5-2.2,2.7l-.2.8h-3.3c-2.5,0-4.5,2-4.5,4.5v11c0,2.5,2,4.5,4.5,4.5h7c1.6,0,3-.8,3.8-2.1.2,0,.5,0,.7,0,1.9,0,3.6-1.2,4.3-3.1l3.6-10.7c.4-1.1.3-2.4-.3-3.5ZM11.5,23h-7c-1.9,0-3.5-1.6-3.5-3.5v-11c0-1.9,1.6-3.5,3.5-3.5h7c1.9,0,3.5,1.6,3.5,3.5v11c0,1.9-1.6,3.5-3.5,3.5ZM22.9,7.9l-3.6,10.7c-.5,1.5-2,2.5-3.6,2.4.2-.5.3-1,.3-1.5v-11c0-2.5-2-4.5-4.5-4.5h-2.7l.2-.5c.3-.9.9-1.6,1.7-2.1.8-.4,1.8-.5,2.7-.2l7.2,2.3c.9.3,1.6.9,2,1.7.4.8.5,1.8.2,2.7Z"/></svg>`
};

/* ---------- Data-URI maker for mobile fallback ---------- */
function svgToDataURI(svg, color = '#fff'){
  // color the paths by injecting fill; we keep it simple & safe
  const painted = svg.replaceAll('<path ', `<path fill="${color}" `);
  const encoded = encodeURIComponent(painted)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  return `url("data:image/svg+xml,${encoded}")`;
}

/* ---------- Tray ---------- */
const HOVER_MUTE_MS = 180;
function hoverMuted(){ return performance.now() < (window.__hoverMuteUntil || 0); }
function muteHover(ms = HOVER_MUTE_MS){ window.__hoverMuteUntil = performance.now() + ms; }

let trayOpenFor = null;
let dragging = false;

function setTrayAnchorForVisible(groups, group){
  const n   = Math.max(1, groups.length);
  const idx = Math.max(0, groups.indexOf(group));
  const percent = ((idx + 0.5) / n) * 100;
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
  pillsRail.classList.add('open');
}
function closeTray(muteMs = HOVER_MUTE_MS){
  if (!trayOpenFor) return;
  pillsRail.classList.remove('open');
  trayOpenFor = null;
  muteHover(muteMs);
}

/* ---------- Inline SVG builder (desktop only) ---------- */
function createInlineSVG(markup){
  const tmp = document.createElement('div');
  tmp.innerHTML = markup.trim();
  const src = tmp.querySelector('svg');
  if (!src) return null;

  const NS = 'http://www.w3.org/2000/svg';
  function cloneNS(node){
    if (node.nodeType === 3) return document.createTextNode(node.nodeValue);
    if (node.nodeType !== 1) return null;
    if (node.tagName && node.tagName.toLowerCase() === 'style') return null;
    const el = document.createElementNS(NS, node.tagName.toLowerCase());
    for (let i=0;i<node.attributes.length;i++){
      const a = node.attributes[i];
      const n = a.name.toLowerCase();
      if (n === 'width' || n === 'height' || n === 'style' || n === 'class') continue;
      el.setAttribute(n, a.value);
    }
    for (let i=0;i<node.childNodes.length;i++){
      const c = cloneNS(node.childNodes[i]);
      if (c) el.appendChild(c);
    }
    return el;
  }

  const out = document.createElementNS(NS, 'svg');
  const vb = src.getAttribute('viewBox');
  if (vb) out.setAttribute('viewBox', vb);
  out.setAttribute('width','24'); out.setAttribute('height','24');
  out.setAttribute('focusable','false'); out.setAttribute('aria-hidden','true');

  for (let i=0;i<src.attributes.length;i++){
    const a = src.attributes[i];
    const n = a.name.toLowerCase();
    if (n === 'width' || n === 'height') continue;
    out.setAttribute(n, a.value);
  }
  for (let i=0;i<src.childNodes.length;i++){
    const c = cloneNS(src.childNodes[i]);
    if (c) out.appendChild(c);
  }
  out.style.fill = 'currentColor';
  out.style.stroke = 'currentColor';
  return out;
}

/* ---------- Footer icons ---------- */
let lastFooterKey = '';
let _footerRenderedOnce = false;

function renderFooterIcons(groups){
  const key = groups.join('|');
  if (_footerRenderedOnce && key === lastFooterKey && footer.childElementCount === groups.length) return;
  lastFooterKey = key;

  footer.replaceChildren();

  groups.forEach(g=>{
    const btn = document.createElement('button');
    btn.className = 'footer-icon';
    btn.dataset.group = g;
    btn.setAttribute('aria-label', g);

    if (IS_TOUCH){
      // Mobile/touch: background-image data URI (always paints on iOS/Android)
      const uri = svgToDataURI(ICON_SVGS[g] || '', '#ffffff'); // white on dark bg
      btn.style.backgroundImage = uri;
      btn.style.backgroundRepeat = 'no-repeat';
      btn.style.backgroundPosition = 'center';
      btn.style.backgroundSize = '22px 22px';
      // Provide textual fallback for a11y (not visible)
      btn.setAttribute('aria-hidden', 'false');
    } else {
      // Desktop: inline SVG that inherits currentColor
      let inserted = false;
      try{
        if (ICON_SVGS[g]){
          const svgEl = createInlineSVG(ICON_SVGS[g]);
          if (svgEl){ btn.appendChild(svgEl); inserted = true; }
        }
      }catch(_){}
      if (!inserted){
        btn.textContent = iconFor[g] || '•';
      }
    }

    footer.appendChild(btn);
  });

  footer.style.setProperty('--cols', String(Math.max(1, groups.length)));
    footer.classList.add('ready');
  _footerRenderedOnce = true;
}

function highlightFooter(group){
  footer.querySelectorAll('.footer-icon').forEach(btn=>{
    const on = btn.dataset.group === group;
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.style.transform = on ? 'translateY(-1px)' : 'none';
  });
}

/* ---------- Lanes (desktop hover only) ---------- */
function renderLanes(groups){
  const root = lanesRoot; if (!root) return;
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
      const g = lane.dataset.group; if (!g) return;
      previewIndex(indexForGroupSlug(g));
      highlightFooter(g);
    });
    lane.addEventListener('mouseleave', (e)=>{
      if (isInsideUISurfaces(e.relatedTarget)) return;
      previewIndex(-1);
      const active = indexToGroup(getCurrentIndex());
      highlightFooter(active);
    });
  });
}

/* ---------- Outside click / pointer tracking ---------- */
let lastPointerX = 0, lastPointerY = 0;
document.addEventListener('pointermove', (e)=>{
  lastPointerX = e.clientX; lastPointerY = e.clientY;
  if (trayOpenFor && !isOverTrayOrFooter(e.target)){
    scheduleGlobalClose();
  } else if (globalCloseTimer){
    clearTimeout(globalCloseTimer);
    globalCloseTimer = null;
  }
});
document.addEventListener('pointerdown', (e)=>{
  if (!trayOpenFor) return;
  if (!isOverTrayOrFooter(e.target)) closeTray(0);
});
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
    const el = document.elementFromPoint(lastPointerX, lastPointerY);
    if (!isOverTrayOrFooter(el)) closeTray(0);
  }, 150);
}

/* ---------- Overlay content & routing ---------- */
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
  pillsRail.classList.remove('open');
  trayOpenFor = null;
  overlayEl.focus();
}

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

/* ---------- Layout events ---------- */
let visibleGroups = ['listen','buy','explore'];

window.addEventListener('layoutchange', (e)=>{
  const groups = e.detail?.visibleGroups || e.detail?.groups;
  if (!Array.isArray(groups) || groups.length === 0) return;

  visibleGroups = groups.slice();

  renderFooterIcons(visibleGroups);
  renderLanes(visibleGroups);

  const currentGroup = indexToGroup(getCurrentIndex());
  const anchorGroup = visibleGroups.includes(currentGroup) ? currentGroup : visibleGroups[0];

  highlightFooter(anchorGroup);
  renderPills(anchorGroup);
  setTrayAnchorForVisible(visibleGroups, anchorGroup);

  if (pillsRail.classList.contains('open')){
    setTrayAnchorForVisible(visibleGroups, trayOpenFor || anchorGroup);
  }
});

/* ---------- Footer hover/click ---------- */
footer.addEventListener('mouseover', (e)=>{
if (hoverMuted()) return;
const btn = e.target.closest('.footer-icon');
 if (!btn || !footer.contains(btn)) return;
 // treat as hover if any input can hover and we’re not on touch
  const canHover = window.matchMedia('(any-hover: hover)').matches;
  if (!canHover) return;
  if (!overlayEl.hidden) return;
  openTrayFor(btn.dataset.group);
});

footer.addEventListener('mouseleave', (e)=>{
  if (e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('#pillsRail')) return;
  if (trayOpenFor && !isOverTrayOrFooter(e.relatedTarget)) scheduleGlobalClose();
});

footer.addEventListener('click', (e)=>{
  const btn = e.target.closest('.footer-icon');
  if (!btn) return;

  const group        = btn.dataset.group;
  const hoverCapable = window.matchMedia('(any-hover: hover)').matches;
  const overlayOpen  = !overlayEl.hidden;

  if (!hoverCapable && !overlayOpen){
    if (trayOpenFor === group){ closeTray(); } else { openTrayFor(group); }
    e.preventDefault(); e.stopPropagation();
    return;
  }
  if (hoverCapable && !overlayOpen){
    if (trayOpenFor === group){ closeTray(); } else { openTrayFor(group); }
    return;
  }
  navigateTo(group, null);
});

/* ---------- Keep tray open while hovering it ---------- */
let trayCloseTimer = null;
function cancelTrayClose(){ if (trayCloseTimer){ clearTimeout(trayCloseTimer); trayCloseTimer = null; } }
pillsRail.addEventListener('mouseenter', cancelTrayClose);
footer.addEventListener('mouseenter', cancelTrayClose);
pillsRail.addEventListener('mouseleave', (e)=>{
  const to = e.relatedTarget;
  if (to && (to.closest('#pillsRail') || to.closest('#siteFooter'))) return;
  scheduleTrayClose(120);
});
footer.addEventListener('mouseleave', (e)=>{
  const to = e.relatedTarget;
  if (to && (to.closest('#pillsRail') || to.closest('#siteFooter'))) return;
  scheduleTrayClose(120);
});
function scheduleTrayClose(delay = 120){
  cancelTrayClose();
  trayCloseTimer = setTimeout(()=>{
    const el = document.elementFromPoint(lastPointerX, lastPointerY);
    const overFooter = !!(el && el.closest && el.closest('#siteFooter'));
    const overTray   = !!(el && el.closest && el.closest('#pillsRail'));
    const laneEl     = el && el.closest && el.closest('#lanes .lane');
    if (overFooter || overTray) return;
    closeTray();
    if (laneEl && laneEl.dataset && laneEl.dataset.group){
      const g = laneEl.dataset.group;
      highlightFooter(g);
      renderPills(g);
      setTrayAnchorForVisible(visibleGroups, g);
      previewIndex(indexForGroupSlug(g));
    } else {
      const active = indexToGroup(getCurrentIndex());
      highlightFooter(active);
      renderPills(active);
      setTrayAnchorForVisible(visibleGroups, active);
      previewIndex(-1);
    }
  }, delay);
}

/* ---------- Scene → UI sync ---------- */
window.addEventListener('cardchange', (e)=>{
  const group = e.detail?.slug || indexToGroup(getCurrentIndex());
  highlightFooter(group);
  renderPills(group);
  setTrayAnchorForVisible(visibleGroups, group);
  if (pillsRail.classList.contains('open')){
    setTrayAnchorForVisible(visibleGroups, group);
  }
});

/* ---------- Overlay close ---------- */
overlayX?.addEventListener('click', ()=>{
  navigateTo(indexToGroup(getCurrentIndex()), null, { syncScene:false });
});

/* ---------- Boot ---------- */
(function init(){
    if (IS_TOUCH) {
        const active = indexToGroup (getCurrentIndex());
        visibleGroups = [active];
    }
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
