// ui.js — footer icons + pills + overlay routing
import { CARDS, selectGroup, getCurrentIndex, selectIndex, previewIndex, indexForGroupSlug } from './main.module.js?v=row1';

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

const footer        = document.getElementById('siteFooter');
const pillsRail     = document.getElementById('pillsRail');
const overlayEl     = document.getElementById('overlay');
const overlayTitle  = document.getElementById('overlay-title');
const overlayBody   = document.getElementById('overlay-body');
const overlayClose  = document.getElementById('overlay-close');
const canvas        = document.getElementById('webgl');
const lanesWrap    = document.querySelector('.hover-lanes');
const laneEls      = document.querySelectorAll('.hover-lane');
const footerEl     = document.getElementById('siteFooter'); // you already have `footer`, but keep a local

const indexToGroup = i => CARDS[i]?.slug ?? 'listen';
const titleMap     = { listen: 'Listen', buy: 'Buy', explore: 'Explore' };

/* ---------- Render ---------- */
function renderPills(group, activePageSlug=null){
  setPillsAnchor(group);
  const defs = SITEMAP[group] ?? [];
  pillsRail.innerHTML = '';
  defs.forEach(({ slug, label })=>{
    const btn = document.createElement('button');
    btn.className = 'pill' + (activePageSlug===slug ? ' active' : '');
    btn.textContent = label;
    btn.setAttribute('data-page', `${group}/${slug}`);
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

function previewGroup(group){
  // Show that group’s pills + footer highlight
  highlightFooter(group);
  renderPills(group);
  // Optional: preview character (no motion if previewIndex is empty)
  previewIndex(indexForGroupSlug(group));
}

const lanes = document.querySelectorAll('#lanes .lane');
lanes.forEach(lane=>{
  lane.addEventListener('mouseenter', ()=>{
    const g = lane.dataset.group;
    if (!g) return;
    previewGroup(g);
  });
  lane.addEventListener('mouseleave', ()=>{
    // restore UI to the actual selected group
    const active = CARDS[getCurrentIndex()]?.slug || 'listen';
    highlightFooter(active);
    renderPills(active);
    previewIndex(getCurrentIndex()); // no-op if you left it empty
  });
});

/* ---------- Overlay content ---------- */
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
  overlayTitle.textContent = `${titleMap[group] ?? 'Section'} — ${labelFor(group,page)}`;
  overlayBody.innerHTML    = htmlFor(`${group}/${page}`);
  overlayEl.hidden = false;
  canvas?.classList.add('dim-3d');
  overlayEl.focus(); // accessibility
}
function labelFor(group, page){
  const d = (SITEMAP[group]||[]).find(x=>x.slug===page);
  return d?.label ?? page;
}

/* ---------- Router ---------- */
// Format: #/<group> or #/<group>/<page>
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

  if (page){
    openPage(group, page);
  } else {
    overlayEl.hidden = true;
    canvas?.classList.remove('dim-3d');
  }
}

function setPillsAnchor(group){
  // positions: left(16.67%), middle(50%), right(83.33%)
  const x =
    group === 'listen'  ? '16.6667%' :
    group === 'buy'     ? '50%'      :
    group === 'explore' ? '83.3333%' : '50%';
  pillsRail.style.left = x;
  pillsRail.style.transform = 'translateX(-50%)';
}



window.addEventListener('hashchange', ()=>{
  const { group, page } = parseHash();
  const g = ['listen','buy','explore'].includes(group) ? group : indexToGroup(getCurrentIndex());
  // Do not move camera again while inside overlay cross-nav:
  const syncScene = overlayEl.hidden;
  navigateTo(g, page || null, { syncScene });
});

/* ---------- Events ---------- */
// Footer icon clicks: switch group (no page)
footer.addEventListener('click', (e)=>{
  const btn = e.target.closest('.footer-icon');
  if (!btn) return;
  const group = btn.dataset.group;
  const overlayIsOpen = !overlayEl.hidden;
  const isHoverCapable = window.matchMedia('(hover:hover)').matches;

  if (isHoverCapable && !overlayIsOpen){
    // On desktop landing, clicking icon doesn't latch anything.
    // Let hover (lanes) control pills; do nothing here.
    return;
  }
  // On mobile or when overlay is open, a click navigates to that group:
  navigateTo(group, null);
});



// Hovering a footer icon previews that group's pills
footer.addEventListener('mouseenter', e=>{
  const btn = e.target.closest('.footer-icon');
  if (!btn) return;
  const g = btn.dataset.group;
  if (g) previewGroup(g);
}, true);

// When leaving the footer entirely, restore the “active” group
footer.addEventListener('mouseleave', ()=>{
  const active = indexToGroup(getCurrentIndex());
  renderPills(active, null);
  highlightFooter(active);
});

laneEls.forEach(lane=>{
  lane.addEventListener('mouseenter', ()=>{
    const g = lane.dataset.group;
    if (g) previewGroup(g);
  });
});
lanesWrap?.addEventListener('mouseleave', ()=>{
  const active = indexToGroup(getCurrentIndex());
  renderPills(active, null);
  highlightFooter(active);
});

// Scene → UI: active card changed
window.addEventListener('cardchange', (e)=>{
  const group = e.detail?.slug || indexToGroup(getCurrentIndex());
  // If a subpage is open, keep it open but update footer + pills
  highlightFooter(group);
  if (overlayEl.hidden) renderPills(group);
});

// Close overlay
overlayClose?.addEventListener('click', ()=>{
  navigateTo(indexToGroup(getCurrentIndex()), null, { syncScene:false });
});

/* ---------- Initial boot ---------- */
(function init(){
  // If URL already has a hash, honor it; otherwise sync to current card
  const { group, page } = parseHash();
  if (group){
    // Don’t spin the camera yet; let main.module set initial selection, then we just render UI.
    highlightFooter(group);
    renderPills(group, page || null);
    if (page){
      openPage(group, page);
    }
  } else {
    const g = indexToGroup(getCurrentIndex());
    highlightFooter(g);
    renderPills(g);
  }

  // a11y: trap focus to overlay when open (simple)
  overlayEl.addEventListener('keydown', (ev)=>{
    if (ev.key === 'Escape'){
      navigateTo(indexToGroup(getCurrentIndex()), null, { syncScene:false });
    }
  });
})();
