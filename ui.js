// ui.js — footer icons + pills + overlay routing (no flicker version)
import {
  CARDS,
  selectGroup,
  getCurrentIndex,
  selectIndex,
  previewIndex,
  indexForGroupSlug
} from './main.module.js';

const SITEMAP = {
  listen:  [
    { slug: 'discography', label:'Discography' },
    { slug: 'radio',       label:'Radio' },
    { slug: 'guitar',      label:'Guitar Hero' },
  ],
  buy: [
    { slug: 'merch',       label:'Merch' },
    { slug: 'tickets',     label:'Tickets' },
    { slug: 'subscribe',   label:'Subscribe' },
  ],
  explore: [
    { slug: 'packs',       label:'Pack Opening' },
    { slug: 'dex',         label:'SlouchoDex' },
  ],
};

const footer      = document.getElementById('siteFooter');
const pillsRail   = document.getElementById('pillsRail');
const overlayEl   = document.getElementById('overlay');
const overlayBody = document.getElementById('overlay-body');
const overlayTit  = document.getElementById('overlay-title');
const overlayClose= document.getElementById('overlay-close');
const canvas      = document.getElementById('webgl');
const lanesWrap   = document.getElementById('lanes');                 // <- three full-height lanes
const laneEls     = lanesWrap ? lanesWrap.querySelectorAll('.lane') : [];

const titleMap = { listen:'Listen', buy:'Buy', explore:'Explore' };
const indexToGroup = i => CARDS[i]?.slug ?? 'listen';

// ----- helpers -----
function isInsideUISurfaces(el){
  if (!el) return false;
  return !!(el.closest('#lanes') || el.closest('#siteFooter') || el.closest('#pillsRail'));
}

function highlightFooter(group){
  footer.querySelectorAll('.footer-icon').forEach(btn=>{
    const on = btn.dataset.group === group;
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.style.borderColor = on ? '#aaa' : 'var(--chip-border)';
    btn.style.transform   = on ? 'translateY(-1px)' : 'none';
  });
}

// Pills: build once as 3 columns, then just toggle which is visible
function buildPillsOnce(){
  pillsRail.innerHTML = '';
  ['listen','buy','explore'].forEach(group=>{
    const col = document.createElement('div');
    col.className = 'pill-col';
    col.dataset.group = group;
    (SITEMAP[group] || []).forEach(({slug,label})=>{
      const btn = document.createElement('button');
      btn.className = 'pill';
      btn.textContent = label;
      btn.dataset.page = `${group}/${slug}`;
      btn.addEventListener('click', ()=> navigateTo(group, slug));
      col.appendChild(btn);
    });
    pillsRail.appendChild(col);
  });
}

function setActivePillColumn(group){
  pillsRail.querySelectorAll('.pill-col').forEach(col=>{
    col.classList.toggle('on', col.dataset.group === group);
  });
}
function setActivePillHighlight(group, pageSlug){
  pillsRail.querySelectorAll('.pill').forEach(p=>{
    const [g, s] = (p.dataset.page||'').split('/');
    p.classList.toggle('active', g===group && s===pageSlug);
  });
}

function previewGroup(group){
  highlightFooter(group);
  setActivePillColumn(group);
  previewIndex(indexForGroupSlug(group)); // visual dim only; no movement
}

function restoreActive(){
  const active = indexToGroup(getCurrentIndex());
  highlightFooter(active);
  setActivePillColumn(active);
  setActivePillHighlight(active, null);
  // do not call selectGroup here; just restore pills/footer state
}

// ----- overlay content -----
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
  overlayTit.textContent = `${titleMap[group] ?? 'Section'} — ${(SITEMAP[group]||[]).find(x=>x.slug===page)?.label ?? page}`;
  overlayBody.innerHTML  = htmlFor(`${group}/${page}`);
  overlayEl.hidden = false;
  canvas?.classList.add('dim-3d');
  overlayEl.focus();
}

function closeOverlay(){
  overlayEl.hidden = true;
  canvas?.classList.remove('dim-3d');
}
overlayClose?.addEventListener('click', ()=>{
  // return to group-only state
  const g = indexToGroup(getCurrentIndex());
  navigateTo(g, null, { syncScene:false });
});

// ----- router -----
function parseHash(){
  const h = (location.hash || '').replace(/^#\/?/, '');
  const [group, page] = h.split('/');
  return { group, page };
}

function navigateTo(group, page=null, { syncScene=true } = {}){
  const newHash = page ? `#/${group}/${page}` : `#/${group}`;
  if (location.hash !== newHash) location.hash = newHash;

  highlightFooter(group);
  setActivePillColumn(group);
  setActivePillHighlight(group, page || null);

  if (syncScene) selectGroup(group);

  if (page) openPage(group, page);
  else      closeOverlay();
}

window.addEventListener('hashchange', ()=>{
  const { group, page } = parseHash();
  const g = ['listen','buy','explore'].includes(group) ? group : indexToGroup(getCurrentIndex());
  const syncScene = overlayEl.hidden; // don’t re-spin while inside overlay nav
  navigateTo(g, page || null, { syncScene });
});

// ----- events -----
// Lanes: preview on enter; guarded restore on leave
laneEls.forEach(lane=>{
  lane.addEventListener('mouseenter', ()=>{
    const g = lane.dataset.group; if (!g) return;
    previewGroup(g);
  });
  lane.addEventListener('mouseleave', (e)=>{
    if (isInsideUISurfaces(e.relatedTarget)) return; // went to pills/footer/another lane
    restoreActive();
  });
});

// Footer: preview on hover
footer.addEventListener('mouseenter', e=>{
  const btn = e.target.closest('.footer-icon'); if (!btn) return;
  const g = btn.dataset.group;
  previewGroup(g);
}, true);

footer.addEventListener('mouseleave', (e)=>{
  if (isInsideUISurfaces(e.relatedTarget)) return;
  restoreActive();
});

// Footer: click behavior
footer.addEventListener('click', (e)=>{
  const btn = e.target.closest('.footer-icon'); if (!btn) return;
  const g = btn.dataset.group;
  const isHoverCapable = window.matchMedia('(hover:hover)').matches;
  const overlayOpen = !overlayEl.hidden;

  // On desktop landing (no overlay), click doesn’t “latch” — hover controls preview.
  if (isHoverCapable && !overlayOpen) return;

  // On mobile or when overlay is open, click navigates to that group.
  navigateTo(g, null);
});

// Pills: keep preview while over pills; restore only when truly leaving all UI
pillsRail.addEventListener('mouseleave', (e)=>{
  if (isInsideUISurfaces(e.relatedTarget)) return;
  restoreActive();
});

// Scene → UI: active card changed (e.g., programmatic select)
window.addEventListener('cardchange', ()=>{
  const g = indexToGroup(getCurrentIndex());
  highlightFooter(g);
  if (overlayEl.hidden){
    setActivePillColumn(g);
    setActivePillHighlight(g, null);
  }
});

// ----- boot -----
(function init(){
  buildPillsOnce();

  const { group, page } = parseHash();
  const g = group || indexToGroup(getCurrentIndex());

  highlightFooter(g);
  setActivePillColumn(g);
  setActivePillHighlight(g, page || null);

  if (page) openPage(g, page);
})();
