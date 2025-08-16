// ui.js — pills + hover thirds + overlay routing (clean)
import { CARDS, selectGroup, getCurrentIndex, selectIndex, previewIndex, indexForGroupSlug } from './main.module.js';

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

const footer     = document.getElementById('siteFooter');
const pillsRail  = document.getElementById('pillsRail');
const overlayEl  = document.getElementById('overlay');
const overlayT   = document.getElementById('overlay-title');
const overlayB   = document.getElementById('overlay-body');
const overlayX   = document.getElementById('overlay-close');
const canvas     = document.getElementById('webgl');
const lanes      = document.querySelectorAll('#lanes .lane');

const indexToGroup = i => CARDS[i]?.slug ?? 'listen';
const titleMap     = { listen: 'Listen', buy: 'Buy', explore: 'Explore' };

function setPillsAnchor(group){
  const x =
    group === 'listen'  ? '16.6667%' :
    group === 'buy'     ? '50%'      :
    group === 'explore' ? '83.3333%' : '50%';
  pillsRail.style.left = x;
  pillsRail.style.transform = 'translateX(-50%)';
}

function renderPills(group, activePageSlug=null){
  setPillsAnchor(group);
  pillsRail.innerHTML = '';
  (SITEMAP[group] ?? []).forEach(({ slug, label })=>{
    const btn = document.createElement('button');
    btn.className = 'pill' + (activePageSlug===slug ? ' active' : '');
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

function isInsideUISurfaces(el){
  if (!el) return false;
  return !!(el.closest('#lanes') || el.closest('#siteFooter') || el.closest('#pillsRail'));
}

function restoreActive(){
  const active = indexToGroup(getCurrentIndex());
  highlightFooter(active);
  renderPills(active);
  // Clear the temporary dimming preview
  previewIndex(-1); // implement as "clear preview" in main: if i<0, undim all to default/active
}

function previewGroup(group){
  highlightFooter(group);
  renderPills(group);
  previewIndex(indexForGroupSlug(group)); // only highlight; no position jump
}

/* ----- Hover thirds (desktop) ----- */
lanes.forEach(lane=>{
  lane.addEventListener('mouseenter', ()=>{
    const g = lane.dataset.group; if (!g) return;
    previewGroup(g);
  });
  lane.addEventListener('mouseleave', (e)=>{
    if (isInsideUISurfaces(e.relatedTarget)) return;
    restoreActive();
  });
});

/* ----- Footer hover (desktop) ----- */
footer.addEventListener('mouseenter', e=>{
  const btn = e.target.closest('.footer-icon'); if (!btn) return;
  const g = btn.dataset.group;
  previewGroup(g);
}, true);

footer.addEventListener('mouseleave', (e)=>{
  if (isInsideUISurfaces(e.relatedTarget)) return;
  restoreActive();
});

/* Footer clicks:
   - On desktop landing (overlay closed), clicking does nothing (hover controls).
   - On mobile or when overlay is open, clicking navigates to that group. */
footer.addEventListener('click', (e)=>{
  const btn = e.target.closest('.footer-icon'); if (!btn) return;
  const group = btn.dataset.group;
  const overlayOpen = !overlayEl.hidden;
  const hoverCapable = window.matchMedia('(hover:hover)').matches;
  if (hoverCapable && !overlayOpen) return; // desktop landing: hover-only
  navigateTo(group, null);
});

/* ----- Pills rail leave → restore ----- */
pillsRail.addEventListener('mouseleave', (e)=>{
  if (isInsideUISurfaces(e.relatedTarget)) return;
  restoreActive();
});

/* ----- Overlay content ----- */
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
  overlayT.textContent = `${titleMap[group] ?? 'Section'} — ${(SITEMAP[group]||[]).find(x=>x.slug===page)?.label ?? page}`;
  overlayB.innerHTML   = htmlFor(`${group}/${page}`);
  overlayEl.hidden = false;
  canvas?.classList.add('dim-3d');
  overlayEl.focus();
}

/* ----- Router ----- */
function parseHash(){
  const h = (location.hash || '').replace(/^#\/?/, '');
  const [group, page] = h.split('/');
  return { group, page };
}
function navigateTo(group, page=null, {syncScene=true} = {}){
  const newHash = page ? `#/${group}/${page}` : `#/${group}`;
  if (location.hash !== newHash) location.hash = newHash;

  highlightFooter(group);
  renderPills(group, page || null);
  if (syncScene) selectGroup(group);

  if (page){ openPage(group, page); }
  else { overlayEl.hidden = true; canvas?.classList.remove('dim-3d'); }
}

window.addEventListener('hashchange', ()=>{
  const { group, page } = parseHash();
  const g = ['listen','buy','explore'].includes(group) ? group : indexToGroup(getCurrentIndex());
  navigateTo(g, page || null, { syncScene: overlayEl.hidden });
});

/* Close overlay */
overlayX?.addEventListener('click', ()=>{
  navigateTo(indexToGroup(getCurrentIndex()), null, { syncScene:false });
});

/* ----- Initial boot ----- */
(function init(){
  const { group, page } = parseHash();
  const g = group || indexToGroup(getCurrentIndex());
  highlightFooter(g);
  renderPills(g, page || null);
  if (page) openPage(g, page);

  overlayEl.addEventListener('keydown', ev=>{
    if (ev.key === 'Escape'){
      navigateTo(indexToGroup(getCurrentIndex()), null, { syncScene:false });
    }
  });
})();
