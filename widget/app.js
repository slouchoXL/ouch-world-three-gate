// ===== API base detection =====
let BASE = '';
if (typeof window !== 'undefined' && window.__PACKS_API_BASE) {
  BASE = window.__PACKS_API_BASE;
}
BASE = BASE.replace(/\/+$/, ''); // trim trailing slashes


import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

// ===== Supabase client (REUSE the one created in index.html) ===========
const supa = window.supa || null; // do NOT create another client here

// ===== session bridge: parent → iframe =====
window.addEventListener('message', async (e) => {
  const msg = e?.data;
  if (!msg || msg.type !== 'supabase-session') return;

  try {
    const { access_token, refresh_token } = msg.session || {};
    if (access_token && refresh_token && supa?.auth) {
      await supa.auth.setSession({ access_token, refresh_token });
      console.log('[widget] ✅ session set from parent');
      // Optional: if your UI needs to refresh after auth, do it here.
      // e.g., re-fetch inventory or emit a custom event:
      // document.dispatchEvent(new Event('supabase-session-ready'));
    }
  } catch (err) {
    console.error('[widget] setSession failed:', err);
  }
});

// ===== 3D capability probe + feature flag (Step 0) =====
function supportsWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
  } catch {
    return false;
  }
}

// URL flag: ?three=1
const wants3D  = new URLSearchParams(location.search).get('three') === '1';
const enable3D = wants3D && supportsWebGL();

// Handy for quick checks in console or other modules
window.__PACKS_3D = { wants3D, enable3D };



// ===== player id (anon fallback preserved for testing) =================
const PLAYER_ID_KEY = 'packs:playerId';
function makeUuid(){
  return (crypto.randomUUID && crypto.randomUUID()) ||
    ([1e7]+-1e3+-4e3+-8e3+-1e11)
      .replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c/4).toString(16));
}

let PLAYER_ID = localStorage.getItem(PLAYER_ID_KEY);
if (!PLAYER_ID) {
  PLAYER_ID = makeUuid();
  localStorage.setItem(PLAYER_ID_KEY, PLAYER_ID);
}

/* ========= CHANGED: no-op; do NOT rewrite PLAYER_ID to 'u_<uuid>' anymore ========= */
async function maybeUpgradePlayerIdToUser(){
  // We no longer mirror Supabase user id into PLAYER_ID.
  // Real identity is sent via Authorization: Bearer <JWT>.
  return;
}
await maybeUpgradePlayerIdToUser();

// ---- Auth header helper (Supabase if signed-in, else X-Player-Id) ----
// FIXED: Auth header helper that works even when Supabase auth calls hang
async function getAuthHeader() {
  try {
    // First try the normal Supabase way (with timeout)
    if (supa?.auth) {
      const sessionPromise = supa.auth.getSession();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 1000)
      );
      
      try {
        const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise]);
        if (session?.access_token) {
          return { Authorization: `Bearer ${session.access_token}` };
        }
      } catch (e) {
        console.log('Supabase auth call timed out, falling back to localStorage');
      }
    }
    
    // Fallback: Read directly from localStorage when Supabase auth hangs
    const authKey = 'sb-srdwkfjterotzjwzoauj-auth-token';
    const authData = localStorage.getItem(authKey);
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        if (parsed.access_token && parsed.expires_at && parsed.expires_at > Date.now() / 1000) {
          console.log('Using localStorage auth token');
          return { Authorization: `Bearer ${parsed.access_token}` };
        }
      } catch (e) {
        console.log('Failed to parse localStorage auth token:', e);
      }
    }
  } catch (e) {
    console.log('Auth header error:', e);
  }
  
  // Final fallback to anonymous
  return { 'X-Player-Id': PLAYER_ID };
}

// Core fetch with correct headers
async function jfetch(path, options = {}) {
  const url = `${BASE}${path}`;
    const authHeader = await getAuthHeader();
    const playerId = localStorage.getItem('packs:playerId');
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
      ...authHeader,
      ...(playerId ? { 'X-Player-Id': playerId } : {}),
    ...(options.headers || {})
  };
  const r = await fetch(url, { headers, ...options });
  if (!r.ok) {
    let msg = `${options.method || 'GET'} ${url} ${r.status}`;
    try { const j = await r.json(); if (j && j.error) msg = j.error; } catch {}
    throw new Error(msg);
  }
  return r.json();
}

// ===== DEBUG FUNCTION =====
async function testAuthFlow() {
  console.log('=== AUTH DEBUG START ===');
  
  // 1. Check Supabase session
  if (supa?.auth) {
    const { data: { session }, error: sessionError } = await supa.auth.getSession();
    console.log('Current session:', session ? 'Present' : 'None');
    console.log('Session error:', sessionError);
    console.log('User ID:', session?.user?.id || 'None');
    console.log('Access token present:', !!session?.access_token);
    
    if (session?.access_token) {
      // 2. Test backend auth
      try {
        console.log('Testing backend authentication...');
        const response = await fetch(`${BASE}/api/debug/auth-test`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log('✅ Backend auth test SUCCESS:', result);
        } else {
          const errorText = await response.text();
          console.error('❌ Backend auth test FAILED:', response.status, errorText);
        }
      } catch (e) {
        console.error('❌ Backend auth test ERROR:', e);
      }
    } else {
      console.log('⚠️ No access token - skipping backend test');
    }
  } else {
    console.log('❌ Supabase client not available');
  }
  
  // 3. Test current auth header
  try {
    const authHeader = await getAuthHeader();
    console.log('Current auth header:', authHeader);
  } catch (e) {
    console.error('Auth header error:', e);
  }
  
  console.log('=== AUTH DEBUG END ===');
}

// Make testAuthFlow available globally for console access
window.testAuthFlow = testAuthFlow;

// ===== tiny DOM helpers =====
const $  = (sel, root=document) => root.querySelector(sel);
const el = (tag, className) => { const n = document.createElement(tag); if (className) n.className = className; return n; };
function uuid4(){ return makeUuid(); }

// ===== state / refs =====
let packs   = [];
let inv     = { balance:{ COIN: 999 }, items: [] };
let opening = null; // { openingId, results:[...] }

const balanceEl = $('#balance');
const priceEl   = $('#price');
const cta       = $('#cta');
const anchor    = $('.anchor');
const packImg   = $('.pack-img');
const trayEl    = $('#tray');
const overlay   = $('#overlay');
const overlayImg= $('#overlay-img');
const errorEl   = $('#error');

// Ensure we have a #stack layer inside anchor
let stackEl = $('#stack');
if (!stackEl) {
  stackEl = el('div'); stackEl.id = 'stack'; stackEl.hidden = true;
  anchor.appendChild(stackEl);
}

// --- Step 2: crossfade helper + handoff guard ---
let hasHandoff = false;

// ---- Debug taps for console ----



async function crossfade(a, b, ms = 350) {
  // ensure starting states
  a.style.opacity = (a.style.opacity === '') ? '1' : a.style.opacity;
  b.style.opacity = '0';
  b.hidden = false;

  // animate both
  a.style.transition = `opacity ${ms}ms ease`;
  b.style.transition = `opacity ${ms}ms ease`;

  // force a layout so transitions apply
  void b.offsetWidth;

  a.style.opacity = '0';
  requestAnimationFrame(() => { b.style.opacity = '1'; });

  return new Promise(r => setTimeout(r, ms));
}


const threeCanvas = $('#three-canvas');
let packs3D = null;

// ===== Step 1: Minimal 3D Scene Manager (stub) =====
class PacksSceneManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });

    // scene + camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    this.camera.position.set(0, 0, 6);

    // lights (simple + cheap)
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(2, 4, 3);
    this.scene.add(dir);

    // placeholder mesh (replace later with pack GLB)
    const geo = new THREE.BoxGeometry(1.4, 1.4, 1.4);
    const mat = new THREE.MeshStandardMaterial({ metalness: 0.2, roughness: 0.5 });
    this.cube = new THREE.Mesh(geo, mat);
    this.scene.add(this.cube);

    // DPR + initial size
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this._resize(); // sets sizes + camera aspect

    // binders
    this._raf = null;
    this._tick = this._tick.bind(this);
    this._onResize = this._onResize.bind(this);
    this._onVisibility = this._onVisibility.bind(this);

    // events
    window.addEventListener('resize', this._onResize);
    document.addEventListener('visibilitychange', this._onVisibility);

    // start loop
    this._tick();
  }

  _resize() {
    // fit to the canvas’ CSS size
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    if (w === 0 || h === 0) return;

    // update renderer size only if needed
    const needResize =
      this.canvas.width  !== Math.floor(w * this.renderer.getPixelRatio()) ||
      this.canvas.height !== Math.floor(h * this.renderer.getPixelRatio());

    if (needResize) {
      this.renderer.setSize(w, h, false);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    }
  }

  _tick(now) {
    // cheap idle anim for visual confirmation
    const t = (now || 0) * 0.001;
    if (this.cube) {
      this.cube.rotation.y = t * 0.6;
      this.cube.rotation.x = t * 0.25;
    }

    this._resize();
    this.renderer.render(this.scene, this.camera);
    this._raf = requestAnimationFrame(this._tick);
  }

  _onResize() {
    this._resize();
  }

  _onVisibility() {
    if (document.hidden) {
      if (this._raf) cancelAnimationFrame(this._raf);
      this._raf = null;
      return;
    }
    if (!this._raf) this._tick();
  }
    
    // 👉 ADD THESE HELPERS INSIDE THE CLASS
    hidePack() {
      if (this.cube) this.cube.visible = false;
    }
    showPack() {
      if (this.cube) {
        this.cube.visible = true;
        this.cube.scale.setScalar(1);
      }
    }
    // 👈 END OF HELPERS

  dispose() {
    window.removeEventListener('resize', this._onResize);
    document.removeEventListener('visibilitychange', this._onVisibility);
    if (this._raf) cancelAnimationFrame(this._raf);
    this._raf = null;

    // dispose basic resources
    this.scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.geometry?.dispose?.();
        if (obj.material?.dispose) obj.material.dispose();
      }
    });
    this.renderer.dispose();
  }
}

if (enable3D && threeCanvas) {
  // keep hidden; we’ll reveal on first click via crossfade
  threeCanvas.hidden = true;
  packs3D = new PacksSceneManager(threeCanvas);
  window.__packs3D = packs3D;
}

/* ---- Step 2: Debug taps for console (safe) ---- */
if (typeof window !== 'undefined') {
  window.__packsDebug = {
    // flags
    get wants3D()   { return typeof wants3D   !== 'undefined' ? wants3D   : undefined; },
    get enable3D()  { return typeof enable3D  !== 'undefined' ? enable3D  : undefined; },
    get hasHandoff(){ return typeof hasHandoff!== 'undefined' ? hasHandoff: undefined; }, // ok if you haven't added it yet

    // UI state
    get ctaDisabled()    { try { return !!cta?.disabled; } catch { return undefined; } },
    get canvasHidden()   { try { return !!threeCanvas?.hidden; } catch { return undefined; } },
    get canvasOpacity()  { try { return threeCanvas ? getComputedStyle(threeCanvas).opacity : undefined; } catch { return undefined; } },
    get pngVisible()     { try { return packImg ? !packImg.hidden && getComputedStyle(packImg).opacity : undefined; } catch { return undefined; } },

    // objects to poke at
    get packs3D()  { return typeof packs3D !== 'undefined' ? packs3D : undefined; },
    packImg, threeCanvas, cta,
  };
}


// ===== helpers =====

// Add this function to app.js
async function testBackendAuth() {
  console.log('=== BACKEND AUTH TEST START ===');
  try {
    const whoami = await jfetch('/api/debug/whoami');
    console.log('Whoami response:', whoami);
    
    const inventory = await jfetch('/api/inventory');
    console.log('Current inventory balance:', inventory?.balance?.COIN);
    console.log('Current inventory items count:', inventory?.items?.length);
    
    // Test if we can hit the debug endpoints
    try {
      const dbTest = await jfetch('/api/debug/db');
      console.log('DB connection test:', dbTest.ok ? 'PASSED' : 'FAILED');
    } catch (e) {
      console.log('DB test failed:', e.message);
    }
    
  } catch (e) {
    console.error('Backend auth test failed:', e);
  }
  console.log('=== BACKEND AUTH TEST END ===');
}

// Make it available in console for manual testing
window.testBackendAuth = testBackendAuth;

function rarityClass(r){ return String(r || 'common').toLowerCase(); }
function prettyRarity(r){ r = rarityClass(r); return r.charAt(0).toUpperCase() + r.slice(1); }

function showError(msg){
  errorEl.textContent = msg;
  errorEl.hidden = false;
  setTimeout(()=> errorEl.hidden = true, 3000);
}

function padToFive(results = []){
  if (results.length >= 5) return results.slice(0, 5);
  const out = results.slice();
  const need = 5 - out.length;
  for (let i=0;i<need;i++){
    out.push({
      itemId: `placeholder-${i+1}`,
      name: 'Card',
      rarity: 'common',
      imageUrl: '/assets/card-front.png',
      isDupe: false
    });
  }
  return out;
}

// Always use your PNG, never API art (for this phase)
function cardFrontSrc(_item){
  return '/assets/card-front.png';
}

// Normalize any inventory response to {balance, items}
function normalizeInventory(x){
  if (x && x.inventory) return x.inventory; // /collection/add
  if (x && (x.balance || x.items)) return x; // /inventory
  return { balance:{COIN:0}, items:[] };
}

// ===== render meta =====
function renderMeta(){
  const pack = packs[0];
  balanceEl.textContent = `Balance: ${inv?.balance?.COIN ?? 0}`;
  priceEl.textContent   = pack ? `Price: ${pack.price.amount} ${pack.price.currency}` : 'Price: —';
}

// ===== STACK render =====
function showStack(items){
  packImg.hidden = true;
  trayEl.hidden  = true;
  stackEl.hidden = false;
  stackEl.replaceChildren();

  items.forEach((it) => {
    const btn = el('button', 'stack-card');
    const img = el('img', 'card-img');
    img.src = cardFrontSrc(it);
    img.alt = it.name || 'Card';

    const tag = el('div', `tag ${rarityClass(it.rarity)}`);
    tag.textContent = prettyRarity(it.rarity);

    btn.appendChild(img);
    btn.appendChild(tag);
    btn.addEventListener('click', () => onRevealTop(btn));

    stackEl.appendChild(btn);
  });
}

function onRevealTop(btn){
  if (btn !== stackEl.lastElementChild) return;
  stackEl.removeChild(btn);
  if (!stackEl.children.length) {
    showTray(opening.results);
  }
}

// ===== TRAY render =====
function showTray(items){
  stackEl.hidden = true;
  trayEl.hidden  = false;
  trayEl.classList.remove('has-preview');
  trayEl.replaceChildren();

  items.forEach((it, idx) => {
    const pos = idx + 1;
    const btn = el('button', 'tray-card');
    btn.setAttribute('data-pos', String(pos));

    const img = el('img');
    img.src = cardFrontSrc(it);
    img.alt = it.name || 'Card';

    btn.appendChild(img);
    btn.addEventListener('click', () => openOverlay(btn, img.src));
    trayEl.appendChild(btn);
  });

  cta.textContent = 'Add to collection';
  cta.hidden = false;
  cta.disabled = false;
  cta.onclick = onCollectClick;
}

async function onCollectClick(){
  if (!overlay.hidden) return;
  cta.disabled = true;
  cta.textContent = 'Adding…';
  
  console.log('[DEBUG] Starting collection process...');
  console.log('[DEBUG] Opening data:', opening);
  
  try{
    const itemIds = (opening?.results || []).map(it => it.itemId);
    console.log('[DEBUG] Items to collect:', itemIds);

    const authHeader = await getAuthHeader();
    console.log('[DEBUG] Auth header:', authHeader);

    const addRes = await fetch(`${BASE}/api/collection/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify({ itemIds }),
    });

    console.log('[DEBUG] Response status:', addRes.status);

    if (!addRes.ok) {
      const errorText = await addRes.text();
      console.error('[DEBUG] Response error:', errorText);
      throw new Error(`Add-to-inventory ${addRes.status}: ${errorText}`);
    }

    const res = await addRes.json();
    console.log('[DEBUG] Collection response:', res);
    console.log('[DEBUG] Has inventory in response:', !!res.inventory);
    console.log('[DEBUG] Inventory items count:', res.inventory?.items?.length);
    console.log('[DEBUG] Inventory progress exists:', !!res.inventory?.progress);

    // --- ADDED: expose dupe payout as a quick toast ---
    if (res?.dupes) {
      const shards = Number(res.dupes.awardedShards || 0);
      const tokens = Number(
        // prefer mintedTokens; fall back to possible variants
        res.dupes.mintedTokens ?? res.dupes.minted_tokens ?? res.dupes.minted ?? 0
      );

      if (shards > 0 || tokens > 0) {
        const parts = [];
        if (shards > 0) parts.push(`+${shards} shard${shards === 1 ? '' : 's'}`);
        if (tokens > 0) parts.push(`+${tokens} Guarantee token${tokens === 1 ? '' : 's'} 🎯`);
        const msg = parts.join(' • ');
        if (typeof showToast === 'function') {
          showToast(msg);
        } else {
          // lightweight inline fallback toast
          const el = document.createElement('div');
          el.textContent = msg;
          Object.assign(el.style, {
            position:'fixed', left:'50%', bottom:'24px', transform:'translateX(-50%)',
            background:'#111', color:'#fff', padding:'10px 14px', borderRadius:'8px',
            boxShadow:'0 6px 18px rgba(0,0,0,.25)', zIndex:9999, opacity:0,
            transition:'opacity .2s ease'
          });
          document.body.appendChild(el);
          requestAnimationFrame(()=> el.style.opacity = 1);
          setTimeout(()=> { el.style.opacity = 0; setTimeout(()=> el.remove(), 220); }, 2200);
        }
      }
    }
    // --- /ADDED ---

    if (res?.inventory?.items) {
      const newItems = res.inventory.items.slice(-5);
      console.log('[DEBUG] Last 5 items in updated inventory:');
      newItems.forEach((item, index) => {
        console.log(`[DEBUG] Inventory Item ${index}: ID="${item.itemId}", Name="${item.name}", Rarity="${item.rarity}"`);
      });
    }

    if (res?.inventory) {
      inv = normalizeInventory(res.inventory);
      console.log('[DEBUG] Normalized inventory:', inv);
      renderMeta();
      
      // Notify parent (inventory page) — include dupes so it can show a banner if desired
      console.log('[DEBUG] Sending message to parent...');
      if (window.parent !== window) {
        window.parent.postMessage({
          type: 'inventory-updated',
          inventory: inv,
          dupes: res.dupes || null,
          debug: 'from-packs-widget'
        }, '*');
        console.log('[DEBUG] Message sent to parent');
      } else {
        console.log('[DEBUG] No parent window found');
      }
    } else {
      console.error('[DEBUG] No inventory in response!');
    }

    // Clean up UI
    opening = null;
    stackEl.hidden = true;
    trayEl.hidden = true;
    packImg.hidden = false;
      
      if (enable3D && threeCanvas) {
        threeCanvas.hidden = true;
        threeCanvas.style.opacity = '0';
        packImg.style.opacity = '1';
        hasHandoff = false;
        // optional, if you ever set this elsewhere:
        // document.body.classList.remove('is-3d');
      }

      // ⬅️ add this line so the pack is visible next time we crossfade to 3D
       if (enable3D && packs3D) packs3D.showPack();
      
    cta.textContent = 'Open Pack';
    cta.disabled = false;
    cta.onclick = null;
    cta.addEventListener('click', onOpenClick, { once:true });
    
  } catch(e){
    console.error('[DEBUG] Collection failed:', e);
    showError(String(e.message || e));
    cta.textContent = 'Open Pack';
    cta.disabled = false;
    cta.onclick = null;
    cta.addEventListener('click', onOpenClick, { once:true });
  }
}


  /*  opening = null;
    stackEl.hidden = true;
    trayEl.hidden  = true;
    packImg.hidden = false;

    cta.textContent = 'Open Pack';
    cta.disabled = false;
    cta.onclick = null;
    cta.addEventListener('click', onOpenClick, { once:true });
  } catch(e){
    showError(String(e.message || e));
    cta.textContent = 'Open Pack';
    cta.disabled = false;
    cta.onclick = null;
    cta.addEventListener('click', onOpenClick, { once:true });
  }
}*/
// ===== OVERLAY =====
function openOverlay(cardBtn, src){
  overlayImg.src = src;
  overlay.hidden = false;
  trayEl.classList.add('has-preview');
  cardBtn.classList.add('is-active');
}
function closeOverlay(){
  overlay.hidden = true;
  trayEl.classList.remove('has-preview');
  const active = trayEl.querySelector('.tray-card.is-active');
  if (active) active.classList.remove('is-active');
}
overlay.addEventListener('click', closeOverlay);

// ===== init / flow =====

// (Optional) require sign-in to open packs:
async function requireSignedInOrPrompt() {
  if (!supa) return false;
  const { data: { session } } = await supa.auth.getSession();
  if (session?.user) return true;

  // Redirect to parent for authentication
  if (window.parent !== window) {
    // We're in iframe - tell parent to show login modal
    window.parent.postMessage({ type: 'show_login_modal' }, '*');
  } else {
    // Direct access - redirect to packs page
    window.location.href = '/packs';
  }
  
  cta.textContent = 'Sign in required';
  cta.hidden = false;
  cta.disabled = true;
  return false;
}

// Live-reload balance/meta on auth changes without creating loops
if (supa?.auth) {
  supa.auth.onAuthStateChange(async (event, session) => {
    console.log(`Auth state changed: ${event}`, session?.user?.id || 'no user');
    
    if (event === 'SIGNED_IN' && session?.user) {
      // no PLAYER_ID rewrite; JWT drives identity
      try {
        const fresh = await jfetch('/api/inventory');
        inv = normalizeInventory(fresh);
        renderMeta();
        console.log('✅ Inventory refreshed after sign-in');
        
        // DEBUG: Test auth flow after successful sign-in
        setTimeout(() => testAuthFlow(), 1000);
      } catch (e) {
        console.error('❌ Failed to refresh inventory after sign-in:', e);
      }
      // keep CTA as-is; user can open packs now
    } else if (event === 'SIGNED_OUT') {
      // fall back to anon id for testing only
      let anon = localStorage.getItem(PLAYER_ID_KEY);
      if (!anon) {
        anon = makeUuid();
        localStorage.setItem(PLAYER_ID_KEY, anon);
      }
      PLAYER_ID = anon;
      try {
        const fresh = await jfetch('/api/inventory');
        inv = normalizeInventory(fresh);
        renderMeta();
        console.log('✅ Fell back to anonymous inventory');
      } catch (e) {
        console.error('❌ Failed to load anonymous inventory:', e);
      }
      // encourage sign-in for pack opening
      cta.textContent = 'Sign in to open packs';
      cta.hidden = false;
      cta.disabled = false;
    }
  });
}

async function init(){
  try{
    const packsResp = await jfetch('/api/packs'); // public
    packs = packsResp.packs || [];

    // ===== CHANGED: require sign-in before inventory/open =====
    const ok = await requireSignedInOrPrompt();
    if (!ok) {
      console.log('⚠️ User not signed in - showing sign-in prompt');
      return;
    }

    const invResp = await jfetch('/api/inventory'); // DB-backed when signed in
    inv   = normalizeInventory(invResp);
    renderMeta();

    cta.textContent = 'Open Pack';
    cta.hidden = false;
    cta.disabled = false;
    cta.addEventListener('click', onOpenClick, { once:true });
    
    console.log('✅ App initialized successfully');
    
    // DEBUG: Test auth flow on initial load (after a delay)
    setTimeout(() => testAuthFlow(), 2000);
  } catch(e){
    console.error('❌ App initialization failed:', e);
    showError(String(e.message || e));
  }
}

async function onOpenClick(){
  try{
    const pack = packs[0];
    if (!pack) return;

    // ===== Ensure user is signed in (JWT present) =====
    if (supa?.auth) {
      const { data: { session } } = await supa.auth.getSession();
      if (!session?.user) {
        showError('Please sign in to open packs.');
        cta.hidden = false;
        cta.disabled = false;
        cta.textContent = 'Sign in to open packs';
        return;
      }
    }

    // ===== Step 2: handoff (only once per open cycle) =====
    if (enable3D && threeCanvas && !hasHandoff) {
      cta.disabled = true; // prevent double-fire during fade
      await crossfade(packImg, threeCanvas, 350);
      hasHandoff = true;
    }

    // Prep UI for opening
    cta.hidden = true;
    cta.disabled = true;
    packImg.hidden = true;
    trayEl.hidden  = true;

    console.log('🎁 Opening pack...');
    const res = await jfetch('/api/packs/open', {
      method: 'POST',
      body: JSON.stringify({ packId: pack.id, idempotencyKey: uuid4() })
    });

    opening = { ...res, results: padToFive(res.results || []) };
    console.log('✅ Pack opened successfully:', opening);

    // Refresh meta/balance (non-blocking for UX)
    try {
      const fresh = await jfetch('/api/inventory');
      inv = normalizeInventory(fresh);
      renderMeta();
    } catch (e) {
      console.error('❌ Failed to refresh inventory after pack opening:', e);
    }

    // Keep a handle to restore canvas stacking after reveal/fallback
    let prevZ = '';
    let prevPE = '';

    // ===== Step 2.1: cinematic rarity burst =====
    if (
      enable3D &&
      threeCanvas &&
      Array.isArray(opening.results) &&
      opening.results.length === 5
    ) {
      prevZ = threeCanvas.style.zIndex;
      prevPE = threeCanvas.style.pointerEvents;

      // Put canvas on top and allow clicks for upcoming reveal
      threeCanvas.style.zIndex = '999';
      threeCanvas.style.pointerEvents = 'auto';
      threeCanvas.hidden = false;
      threeCanvas.style.opacity = '1';

      // Fire burst if helper exists
      if (typeof window.__packsBurstFrom === 'function') {
        window.__packsBurstFrom(opening.results);
        await new Promise(r => setTimeout(r, 900)); // let burst finish
      }
    }

    // ===== Step 3: sequential 3D reveal (strict 1→5), fallback to 2D if not ready =====
    if (enable3D && packs3D && Array.isArray(opening.results) && opening.results.length === 5) {
      // Hide the pack placeholder during reveal (no cube visible)
      packs3D.hidePack?.();

      // Build placeholder meshes and show first item
      packs3D.setItems(opening.results);
      packs3D.showActive(0);

      // CTA + canvas accept current active item
      cta.hidden = false;
      cta.disabled = false;
      cta.textContent = 'Take item (1/5)';
      cta.onclick = null;

      const onAcceptClick = () => packs3D.acceptActive();
      const onCanvasClick = () => packs3D.acceptActive();

      cta.addEventListener('click', onAcceptClick);
      threeCanvas.addEventListener('click', onCanvasClick);

      packs3D.onAcceptProgress = (acceptedCount, total) => {
        const next = Math.min(acceptedCount + 1, total);
        cta.textContent = `Take item (${next}/${total})`;
      };

      packs3D.onAllAccepted = () => {
        // Cleanup listeners and restore canvas stacking
        cta.removeEventListener('click', onAcceptClick);
        threeCanvas.removeEventListener('click', onCanvasClick);
        threeCanvas.style.zIndex = prevZ || '9';
        threeCanvas.style.pointerEvents = prevPE || '';

        // Proceed to your existing 2D tray summary
        showTray(opening.results);
      };

      // NOTE: Do not call showStack here; reveal will drive to tray.
      return;
    }

    // ===== 2D fallback (no WebGL or not exactly 5 items) =====
    if (enable3D && threeCanvas) {
      // If we raised z-index for burst but aren't doing 3D reveal, restore it
      threeCanvas.style.zIndex = prevZ || '9';
      threeCanvas.style.pointerEvents = prevPE || '';
    }
    showStack(opening.results);

  } catch(e){
    console.error('❌ Pack opening failed:', e);
    showError(String(e.message || e));
    cta.hidden = false;
    cta.disabled = false;
    cta.textContent = 'Open Pack';
    cta.addEventListener('click', onOpenClick, { once:true });
  }
}


init();


/* ==== Debug taps (safe, parent-bridged) ==== */
(() => {
  const safe = (fn) => { try { return fn(); } catch { return undefined; } };

  const dbg = {
    // flags
    get enable3D()     { return safe(() => enable3D); },
    get hasHandoff()   { return safe(() => hasHandoff); },

    // UI state
    get pngVisible()   { return safe(() => !packImg.hidden && getComputedStyle(packImg).opacity); },
    get canvasHidden() { return safe(() => threeCanvas.hidden); },
    get canvasOpacity(){ return safe(() => getComputedStyle(threeCanvas).opacity); },
    get ctaDisabled()  { return safe(() => cta.disabled); },

    // objects
    get packs3D()      { return safe(() => packs3D); },
    get packImg()      { return safe(() => packImg); },
    get threeCanvas()  { return safe(() => threeCanvas); },
    get cta()          { return safe(() => cta); },
  };

  if (typeof window !== 'undefined') {
    // Always attach inside the widget
    window.__packsDebug = dbg;

    // Also attach to parent *if* same-origin (so you can use the parent console)
    try {
      if (window.parent && window.parent !== window) {
        // Accessing parent.location throws if cross-origin, hence the try/catch
        if (window.parent.location.origin === window.location.origin) {
          window.parent.__packsDebug = dbg;
        }
      }
    } catch {}

    console.log('[debug] __packsDebug attached', { inIframe: window.parent !== window });
  }
})();

/* ==== Step 2.1 — Cinematic Rarity Burst (append-only) ==== */
(() => {
  const RARITY = {
    common:    '#64748B',
    rare:      '#3B82F6',
    epic:      '#A855F7',
    legendary: '#F59E0B',
  };

  function attachBurstAPI(manager) {
    if (!manager || manager.__burstReady) return !!manager && manager.__burstReady;

    const THREERef = (typeof THREE !== 'undefined') ? THREE : (manager.THREE || null);
    if (!THREERef) {
      console.warn('[burst] THREE not found; cannot attach burst API.');
      return false;
    }

    const group = new THREERef.Group();
    manager.scene.add(group);

    manager.__burst = {
      active: false,
      start: 0,
      ttl: 900,            // total lifetime in ms
      spheres: [],
      _raf: 0,
      _last: 0,
      group,
    };

    manager.startRarityBurst = function startRarityBurst(colors) {
      try {
        if (!Array.isArray(colors) || colors.length === 0) return;

        // Clear any prior burst
        manager.clearRarityBurst();

        const sphereGeo = new THREERef.SphereGeometry(0.09, 16, 16);

        for (let i = 0; i < colors.length; i++) {
          const col = new THREERef.Color(colors[i] || RARITY.common);
          const mat = new THREERef.MeshStandardMaterial({
            color: col,
            emissive: col,
            emissiveIntensity: 0.9,
            transparent: true,
            opacity: 0.0,
            metalness: 0.1,
            roughness: 0.25,
          });

          const m = new THREERef.Mesh(sphereGeo, mat);

          // Start near center; tweak Y if your pack sits higher.
          m.position.set(0, 0.2, 0);

          // Random outward velocity (m/s-ish)
          const dir = new THREERef.Vector3(
            (Math.random() * 2 - 1),
            (Math.random() * 0.6 + 0.2),
            (Math.random() * 2 - 1)
          ).normalize();
          const speed = 1.6 + Math.random() * 0.8;
          m.userData = { v: dir.multiplyScalar(speed) };

          group.add(m);
          manager.__burst.spheres.push(m);
        }

        manager.__burst.active = true;
        manager.__burst.start = performance.now();
        manager.__burst._last = 0;

        // Per-frame-ish update via rAF; your renderer is already running.
        const tick = () => {
          if (!manager.__burst.active) return;
          const now = performance.now();
          const t = now - manager.__burst.start;
          const ttl = manager.__burst.ttl;

          const last = manager.__burst._last || now - 16;
          manager.__burst._last = now;

          const dt = Math.min(33, now - last) / 1000; // seconds
          const gravity = -2.2;

          // Opacity ease: quick in (180ms), quick out (last 260ms)
          const fadeIn = Math.min(t / 180, 1);
          const fadeOut = t > ttl - 260 ? 1 - (t - (ttl - 260)) / 260 : 1;
          const alpha = Math.max(0, Math.min(1, fadeIn * fadeOut));

          for (const s of manager.__burst.spheres) {
            s.userData.v.y += gravity * dt;
            s.position.addScaledVector(s.userData.v, dt);
            s.scale.setScalar(0.9 + (t / ttl) * 0.4);
            s.material.opacity = alpha;
          }

          if (t >= ttl) {
            manager.clearRarityBurst();
            return;
          }
          manager.__burst._raf = requestAnimationFrame(tick);
        };

        manager.__burst._raf = requestAnimationFrame(tick);
      } catch (e) {
        console.warn('[burst] failed to start', e);
      }
    };

    manager.clearRarityBurst = function clearRarityBurst() {
      try {
        if (manager.__burst._raf) cancelAnimationFrame(manager.__burst._raf);
      } catch (_) {}
      for (const s of manager.__burst.spheres) {
        try { s.geometry.dispose?.(); } catch (_) {}
        try { s.material.dispose?.(); } catch (_) {}
        try { group.remove(s); } catch (_) {}
      }
      manager.__burst.spheres = [];
      manager.__burst.active = false;
      manager.__burst._raf = 0;
      manager.__burst._last = 0;
    };

    manager.__burstReady = true;
    return true;
  }

  function whenPacks3DReady(cb) {
    const tryNow = () => {
      if (window.__packs3D) { cb(window.__packs3D); return true; }
      return false;
    };
    if (!tryNow()) {
      const iid = setInterval(() => { if (tryNow()) clearInterval(iid); }, 50);
      // safety timeout; not strictly necessary
      setTimeout(() => clearInterval(iid), 10000);
    }
  }

  // Attach burst API when the 3D manager exists
  whenPacks3DReady(attachBurstAPI);

  // Patch fetch so we can trigger the burst right when results arrive
  if (typeof window !== 'undefined' && window.fetch && !window.__packsBurstFetchPatched) {
    const origFetch = window.fetch.bind(window);
    window.fetch = async function(input, init) {
      const res = await origFetch(input, init);

      try {
        const url = (typeof input === 'string') ? input : (input && input.url) || '';
        if (url && url.includes('/api/packs/open')) {
          const clone = res.clone();
          clone.json().then((data) => {
            // Try a few common shapes
            let items = null;
            if (Array.isArray(data)) items = data;
            else if (Array.isArray(data.items)) items = data.items;
            else if (data && data.result && Array.isArray(data.result.items)) items = data.result.items;

            if (items && items.length === 5) {
              const colors = items.map(it => {
                const r = (it && (it.rarity || it.rarityTier || it.tier)) || 'common';
                return RARITY[r] || RARITY.common;
              });
              whenPacks3DReady((mgr) => {
                attachBurstAPI(mgr);
                mgr.startRarityBurst(colors);
              });
            }
          }).catch(() => { /* non-JSON or early read; ignore */ });
        }
      } catch (_) { /* ignore */ }

      return res;
    };
    window.__packsBurstFetchPatched = true;
  }
})();
/* ==== Step 2.1 — Cinematic Rarity Burst (explicit trigger) ==== */
/* ==== Step 2.1 — Cinematic Rarity Burst (append-only, zero-touch) ==== */
(() => {
  const RARITY = {
    common:    '#64748B',
    rare:      '#3B82F6',
    epic:      '#A855F7',
    legendary: '#F59E0B',
  };

  // Helper: detect if 3D is actually running
  function is3DReady() {
    return !!window.__packs3D && !!(window.__packs3D.scene) && !!(window.__packs3D.renderer);
  }

  // Attach the burst API onto an existing PacksSceneManager instance
  function attachBurstAPI(manager) {
    if (!manager || manager.__burstReady) return !!manager && manager.__burstReady;

    const T = (typeof THREE !== 'undefined' ? THREE : (manager.THREE || window.THREE));
    if (!T) {
      console.warn('[burst] THREE not found; cannot attach burst API.');
      return false;
    }

    const group = new T.Group();
    manager.scene.add(group);

    manager.__burst = {
      active: false,
      start: 0,
      ttl: 900,        // total lifetime (ms)
      spheres: [],
      _raf: 0,
      _last: 0,
      group,
    };

    manager.startRarityBurst = function startRarityBurst(colors) {
      try {
        if (!Array.isArray(colors) || colors.length === 0) return;

        manager.clearRarityBurst?.();

        const geo = new T.SphereGeometry(0.09, 16, 16);

        for (let i = 0; i < colors.length; i++) {
          const col = new T.Color(colors[i] || RARITY.common);
          const mat = new T.MeshStandardMaterial({
            color: col,
            emissive: col,
            emissiveIntensity: 0.9,
            transparent: true,
            opacity: 0.0,
            metalness: 0.1,
            roughness: 0.25,
          });

          const m = new T.Mesh(geo, mat);

          // Spawn near pack center; tweak Y if your pack sits higher/lower
          m.position.set(0, 0.2, 0);

          // Random outward velocity (m/s-ish)
          const dir = new T.Vector3(
            (Math.random()*2-1), (Math.random()*0.6+0.2), (Math.random()*2-1)
          ).normalize();
          const speed = 1.6 + Math.random()*0.8;
          m.userData = { v: dir.multiplyScalar(speed) };

          group.add(m);
          manager.__burst.spheres.push(m);
        }

        manager.__burst.active = true;
        manager.__burst.start = performance.now();
        manager.__burst._last = 0;

        // Self-contained rAF to animate burst (uses the manager's render loop to draw)
        const tick = () => {
          if (!manager.__burst.active) return;
          const now = performance.now();
          const t = now - manager.__burst.start;
          const ttl = manager.__burst.ttl;

          const last = manager.__burst._last || now - 16;
          manager.__burst._last = now;
          const dt = Math.min(33, now - last) / 1000;

          // Opacity ease: quick in (180ms), quick out (last 260ms)
          const fadeIn = Math.min(t / 180, 1);
          const fadeOut = t > ttl - 260 ? 1 - (t - (ttl - 260)) / 260 : 1;
          const alpha = Math.max(0, Math.min(1, fadeIn * fadeOut));

          // Gentle gravity arc
          const gravity = -2.2;

          for (const s of manager.__burst.spheres) {
            s.userData.v.y += gravity * dt;
            s.position.addScaledVector(s.userData.v, dt);
            s.scale.setScalar(0.9 + (t/ttl)*0.4);
            s.material.opacity = alpha;
          }

          if (t >= ttl) { manager.clearRarityBurst(); return; }
          manager.__burst._raf = requestAnimationFrame(tick);
        };

        manager.__burst._raf = requestAnimationFrame(tick);
      } catch (e) {
        console.warn('[burst] failed to start', e);
      }
    };

    manager.clearRarityBurst = function clearRarityBurst() {
      try { if (manager.__burst._raf) cancelAnimationFrame(manager.__burst._raf); } catch {}
      for (const s of manager.__burst.spheres) {
        try { s.geometry.dispose?.(); } catch {}
        try { s.material.dispose?.(); } catch {}
        try { group.remove(s); } catch {}
      }
      manager.__burst.spheres = [];
      manager.__burst.active = false;
      manager.__burst._raf = 0;
      manager.__burst._last = 0;
    };

    manager.__burstReady = true;
    return true;
  }

  // Trigger from an items array (length 5) -> picks rarity colors and fires the burst
  function triggerBurst(items) {
    if (!is3DReady() || !Array.isArray(items) || items.length !== 5) return;
    const mgr = window.__packs3D;
    if (!attachBurstAPI(mgr)) return;
    const colors = items.map(it => {
      const r = (it && (it.rarity || it.rarityTier || it.tier)) || 'common';
      return RARITY[r] || RARITY.common;
    });
    mgr.startRarityBurst(colors);
  }

  // Expose manual entry if you ever want to trigger from the console or code
  window.__packsBurstFrom = function(items){ try { triggerBurst(items); } catch(e) {} };

  // 1) Try to automatically wrap a global showStack(items) if present
  (function wrapShowStackOnce() {
    if (window.__packsBurstShowStackWrapped) return;
    const check = () => {
      if (typeof window.showStack === 'function') {
        const orig = window.showStack;
        window.showStack = function wrappedShowStack(items) {
          try { triggerBurst(items); } catch(e) {}
          return orig.apply(this, arguments);
        };
        window.__packsBurstShowStackWrapped = true;
        console.log('[burst] showStack wrapped');
        return true;
      }
      return false;
    };
    if (!check()) {
      const id = setInterval(() => { if (check()) clearInterval(id); }, 100);
      setTimeout(() => clearInterval(id), 8000);
    }
  })();

  // 2) Also patch fetch for /api/packs/open as a fallback if showStack isn't global
  (function patchFetchOnce() {
    if (window.__packsBurstFetchPatched || typeof window.fetch !== 'function') return;
    const origFetch = window.fetch.bind(window);
    window.fetch = async function(input, init) {
      const res = await origFetch(input, init);
      try {
        const url = (typeof input === 'string') ? input : (input && input.url) || '';
        if (url && url.includes('/api/packs/open')) {
          const clone = res.clone();
          // Try to parse JSON; ignore if stream is already read elsewhere
          clone.json().then((data) => {
            let items = null;
            if (Array.isArray(data)) items = data;
            else if (data && Array.isArray(data.items)) items = data.items;
            else if (data && data.result && Array.isArray(data.result.items)) items = data.result.items;

            if (items && items.length === 5) {
              triggerBurst(items);
            }
          }).catch(() => {});
        }
      } catch (_) {}
      return res;
    };
    window.__packsBurstFetchPatched = true;
    console.log('[burst] fetch patched');
  })();

  // 3) If the 3D manager appears later, ensure the burst API is attached
  (function waitForManager() {
    if (is3DReady()) { attachBurstAPI(window.__packs3D); return; }
    const id = setInterval(() => {
      if (is3DReady()) { attachBurstAPI(window.__packs3D); clearInterval(id); }
    }, 100);
    setTimeout(() => clearInterval(id), 10000);
  })();

  // Breadcrumb so you can see the patch loaded
  console.log('[burst] Step 2.1 patch ready');
})();

