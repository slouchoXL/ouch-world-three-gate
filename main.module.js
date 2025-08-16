// main.module.js — OUCH: three characters side-by-side (no carousel)
import * as THREE from 'three';
import { GLTFLoader }   from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader }  from 'three/addons/loaders/DRACOLoader.js';
import { KTX2Loader }   from 'three/addons/loaders/KTX2Loader.js';

/* ---------- DOM ---------- */
const canvas = document.getElementById('webgl');
canvas.style.visibility = 'hidden';
canvas.style.opacity = '0';

const modal       = document.getElementById('overlay');
const modalTitle  = document.getElementById('overlay-title');
const modalBody   = document.getElementById('overlay-body');
const modalClose  = document.getElementById('overlay-close');

/* ---------- Three setup ---------- */
const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:false });
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const CAMERA_Y = 1.2;
const TARGET_Y = 1.1;
const Z_ROW    = 0.0;
const Y_BASE   = 0.0;

const camera = new THREE.PerspectiveCamera(35, window.innerWidth/window.innerHeight, 0.1, 200);
scene.add(camera);

// Treat "hover:none" devices as mobile-like → always 1-up
const FORCE_ONE_UP = window.matchMedia('(hover:none)').matches;

// Mobile-only vertical composition tweak (moves models up in screen space)
const MOBILE_Y_BIAS = -0.28;       // try -0.20 .. -0.35 to taste (more negative = higher)
function currentYBias(){
  return FORCE_ONE_UP ? MOBILE_Y_BIAS : 0.0;
}

/* ---------- Responsive breakpoints (relative to first load) ---------- */
const BASELINE_WIDTH = window.innerWidth;
const TWO_UP_RATIO   = 0.75;
const ONE_UP_RATIO   = 0.6;

const BP_TWO_UP = Math.round(BASELINE_WIDTH * TWO_UP_RATIO);
const BP_ONE_UP = Math.round(BASELINE_WIDTH * ONE_UP_RATIO);

/* ---------- Camera sizing clamps ---------- */
const BASE_DIST     = { '3': 7.0, '2': 6.0, '1': 5.0 };
const MAX_DIST_MULT = 1.35;

/* ---------- Camera targets (lerped in loop) ---------- */
let renderStarted = false;
let camZTarget = 8;
const camLook = new THREE.Vector3(0, TARGET_Y, 0);

/* Safe standby so early frames aren’t “inside” a model */
camera.position.set(0, CAMERA_Y, 8);
camera.lookAt(0, TARGET_Y, 0);

/* ---------- Lights ---------- */
scene.add(new THREE.HemisphereLight(0xffffff, 0x222233, 1.0));
const dir = new THREE.DirectionalLight(0xffffff, 2.0);
dir.position.set(3,6,5);
scene.add(dir);

/* ---------- Row group ---------- */
const rowGroup = new THREE.Group();
rowGroup.name = 'RowGroup';
rowGroup.visible = false;
scene.add(rowGroup);

/* ---------- Floor (gradient) ---------- */
function makeFloorGradient({
  size = 512,
  base = '#FFFFFF',
  inner = 'rgba(0,0,0,0.55)',
  mid   = 'rgba(0,0,0,0.18)',
  outer = 'rgba(0,0,0,0.00)'
} = {}){
  const c = document.createElement('canvas'); c.width = c.height = size;
  const g = c.getContext('2d');
  g.fillStyle = base; g.fillRect(0,0,size,size);
  const cx=size/2, cy=size/2, r=size*0.48;
  const grad = g.createRadialGradient(cx, cy, r*0.12, cx, cy, r);
  grad.addColorStop(0.00, inner);
  grad.addColorStop(0.55, mid);
  grad.addColorStop(1.00, outer);
  g.globalCompositeOperation = 'multiply';
  g.fillStyle = grad; g.beginPath(); g.arc(cx, cy, r, 0, Math.PI*2); g.fill();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace; tex.flipY = false;
  return tex;
}
const ground = new THREE.Mesh(
  new THREE.CircleGeometry(12, 64),
  new THREE.MeshStandardMaterial({ color:0xffffff, map: makeFloorGradient(), metalness:0, roughness:1 })
);
ground.rotation.x = -Math.PI/2;
ground.position.y = 0.0;
ground.renderOrder = -1000;
scene.add(ground);

/* ---------- Loaders ---------- */
const gltfLoader  = new GLTFLoader();
const dracoLoader = new DRACOLoader().setDecoderPath('https://unpkg.com/three@0.165.0/examples/jsm/libs/draco/');
gltfLoader.setDRACOLoader(dracoLoader);
const ktx2Loader  = new KTX2Loader()
  .setTranscoderPath('https://unpkg.com/three@0.165.0/examples/jsm/libs/basis/')
  .detectSupport(renderer);
gltfLoader.setKTX2Loader(ktx2Loader);

/* ---------- Data ---------- */
const CARDS = [
  { name:'Sloucho',      url:'assets/sloucho.glb',      slug:'listen',  overlay:'listen'  },
  { name:'Ras',          url:'assets/ras.glb',          slug:'buy',     overlay:'buy'     },
  { name:'Super Maramu', url:'assets/super-maramu.glb', slug:'explore', overlay:'explore' },
];
let current    = 1;     // start with middle active
let layoutMode = '3';   // '3' | '2' | '1'

/* ---------- Material dim helpers ---------- */
function forEachMat(mat, fn){ Array.isArray(mat) ? mat.forEach(fn) : fn(mat); }
const originalMats = new WeakMap();
function setDim(group, dim = true){
  group.traverse(o=>{
    if (!o.isMesh || !o.material) return;
    forEachMat(o.material, (m)=>{
      const isStd = m.isMeshStandardMaterial || m.isMeshPhysicalMaterial || m.isMeshLambertMaterial || m.isMeshPhongMaterial || m.isMeshBasicMaterial;
      if (!isStd) return;
      if (dim){
        if (!originalMats.has(m)){
          originalMats.set(m, {
            color: m.color?.clone?.() ?? null,
            emissive: m.emissive?.clone?.() ?? null,
            emissiveIntensity: (typeof m.emissiveIntensity === 'number') ? m.emissiveIntensity : null,
            metalness: (typeof m.metalness === 'number') ? m.metalness : null,
            roughness: (typeof m.roughness === 'number') ? m.roughness : null,
            transparent: !!m.transparent,
            opacity: (typeof m.opacity === 'number') ? m.opacity : null,
            depthWrite: (typeof m.depthWrite === 'boolean') ? m.depthWrite : null,
          });
        }
        if (m.transparent) m.transparent = false;
        if (typeof m.opacity === 'number') m.opacity = 1.0;
        if (m.color) m.color.multiplyScalar(0.55);
        if (typeof m.metalness === 'number') m.metalness = Math.min(m.metalness, 0.2);
        if (typeof m.roughness === 'number') m.roughness = Math.max(m.roughness, 0.8);
        if (m.emissive) m.emissive.multiplyScalar(0.6);
        if (typeof m.emissiveIntensity === 'number') m.emissiveIntensity *= 0.6;
        if (typeof m.depthWrite === 'boolean') m.depthWrite = true;
        m.needsUpdate = true;
      } else {
        const orig = originalMats.get(m);
        if (orig){
          if (orig.color && m.color) m.color.copy(orig.color);
          if (orig.emissive && m.emissive) m.emissive.copy(orig.emissive);
          if (orig.emissiveIntensity !== null && typeof m.emissiveIntensity === 'number') m.emissiveIntensity = orig.emissiveIntensity;
          if (orig.metalness !== null && typeof m.metalness === 'number') m.metalness = orig.metalness;
          if (orig.roughness !== null && typeof m.roughness === 'number') m.roughness = orig.roughness;
          m.transparent = orig.transparent;
          if (orig.opacity !== null && typeof m.opacity === 'number') m.opacity = orig.opacity;
          if (orig.depthWrite !== null && typeof m.depthWrite === 'boolean') m.depthWrite = orig.depthWrite;
          m.needsUpdate = true;
        }
      }
    });
  });
}

/* ---------- Bounds & normalize ---------- */
function getMeshBounds(root){
  const box = new THREE.Box3(); let has = false;
  root.traverse(o=>{
    if (o.isMesh && o.geometry){
      o.updateWorldMatrix(true, false);
      if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
      const bb = o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld);
      if (isFinite(bb.min.x) && isFinite(bb.max.x)) { box.union(bb); has = true; }
    }
  });
  return has ? box : null;
}
function getMeshBoundsDeep(root){ return getMeshBounds(root); }

function normalizeAndGround(node, targetHeight = null, groundY = 0.0) {
  const box = getMeshBounds(node); if (!box) return;
  const height = box.max.y - box.min.y;
  if (targetHeight && isFinite(height) && height > targetHeight) {
    const s = targetHeight / height;
    node.scale.multiplyScalar(s);
    node.updateWorldMatrix(true, true);
  }
  const box2 = getMeshBounds(node); if (!box2) return;
  const dy = groundY - box2.min.y;
  node.position.y += dy + 0.005;
  node.updateWorldMatrix(true, true);
}

/* ---------- Anim ---------- */
const mixers  = new Map(); // i -> AnimationMixer
const actions = new Map(); // i -> { name: action }

function startIdle(mixer, clips){
  const idle = clips.find(c => /idle|breath|loop/i.test(c.name)) || clips[0];
  if (!idle) return;
  const a = mixer.clipAction(idle);
  a.setLoop(THREE.LoopPingPong, Infinity);
  a.clampWhenFinished = true;
  a.time = Math.random() * (idle.duration * 0.4);
  a.timeScale = 0.9 + Math.random() * 0.2;
  a.paused = false;
  a.play();
}

/* ---------- Initial placement (just to add to scene) ---------- */
function positionCard(node, i){
  const x = (i - 1) * 3.2;
  node.position.set(x, Y_BASE, Z_ROW);
  node.rotation.y = 0;
}

function applyActiveStyling(){
  for (let i=0;i<CARDS.length;i++){
    const node = cache.get(i); if (!node) continue;
    setDim(node, !(i === current));
    node.position.y = Y_BASE;
  }
}

function ensureIdleRunning(i){
  const actMap = actions.get(i);
  if (!actMap) return;
  const idleName = Object.keys(actMap).find(nm => /idle|breath|loop/i.test(nm)) || Object.keys(actMap)[0];
  const a = actMap[idleName];
  if (!a) return;
  a.enabled = true;
  a.paused  = false;
  if (!a.isRunning()) a.play();
}

/* ---------- Load ---------- */
const cache    = new Map();
const inflight = new Map();

async function ensureLoaded(i){
  if (cache.has(i))    return cache.get(i);
  if (inflight.has(i)) return inflight.get(i);

  const p = (async ()=>{
    const entry = CARDS[i];
    try {
      const glb = await gltfLoader.loadAsync(entry.url);
      const node = glb.scene;
      node.userData.cardIndex = i;
      node.traverse(o=>{ if (o.isMesh){ o.castShadow=false; o.receiveShadow=true; o.frustumCulled = true; }});
      normalizeAndGround(node, 1.75, 0.0);
      positionCard(node, i);
      rowGroup.add(node);
      cache.set(i, node);

      if (glb.animations?.length){
        const mixer = new THREE.AnimationMixer(node);
        mixers.set(i, mixer);
        const actMap = {};
        glb.animations.forEach(clip => actMap[clip.name] = mixer.clipAction(clip));
        actions.set(i, actMap);
        startIdle(mixer, glb.animations);
      }
      return node;
    } catch (e){
      console.warn('Failed to load', entry?.url, e);
      const node = new THREE.Group();
      node.userData.cardIndex = i;
      positionCard(node, i);
      rowGroup.add(node);
      cache.set(i, node);
      return node;
    } finally {
      inflight.delete(i);
    }
  })();

  inflight.set(i, p);
  return p;
}

/* ---------- Layout helpers ---------- */
function insetForMode(){
  // Keep 3-up a bit looser on first paint
  if (layoutMode === '3') return 0.02; // was 0.08 → more breathing room
  if (layoutMode === '2') return 0.07;
  return 0.08; // 1-up
}

function chooseLayoutMode(){
  if (FORCE_ONE_UP){
    const changed = (layoutMode !== '1');
    layoutMode = '1';
    return changed;
  }
    
  const w = window.innerWidth;
  const prev = layoutMode;
  const marginTwo = Math.round(BASELINE_WIDTH * 0.03);
  const marginOne = Math.round(BASELINE_WIDTH * 0.03);

  if (layoutMode === '3'){
    if (w < BP_TWO_UP - marginTwo) layoutMode = '2';
  } else if (layoutMode === '2'){
    if (w >= BP_TWO_UP + marginTwo) layoutMode = '3';
    else if (w < BP_ONE_UP - marginOne) layoutMode = '1';
  } else { // '1'
    if (w >= BP_ONE_UP + marginOne) layoutMode = '2';
  }

  return prev !== layoutMode;
}

// Always keep the current in view; fill with nearest neighbor(s)
function visibleIndices(){
  if (layoutMode === '3') return [0,1,2];

  if (layoutMode === '2'){
   const right = (current + 1) % CARDS.length;        // if middle is active, show the two outers
   return [ current , right ];        // if left is active, show left+middle
                            // if right is active, show middle+right
  }

  return [ current ]; // '1'
}

// Use the distance we’re going to (camZTarget) to compute stable lane spacing.
function positionVisibleByViewportLanes(indices, inset = 0.08){
  const vFov   = THREE.MathUtils.degToRad(camera.fov);
  const aspect = camera.aspect;
  const hFov   = 2 * Math.atan(Math.tan(vFov * 0.5) * aspect);

  const dist   = Math.abs((camZTarget ?? camera.position.z) - Z_ROW);
  const halfW  = Math.tan(hFov * 0.5) * dist;
  const W      = 2 * halfW;

  const usable   = W * (1 - inset * 2);
  const segW     = usable / Math.max(1, indices.length);
  const leftEdge = -usable / 2;

  // Place the visible ones
  indices.forEach((idx, i)=>{
    const n = cache.get(idx); if (!n) return;
    const cx = leftEdge + segW * (i + 0.5);
    n.position.set(cx, Y_BASE, Z_ROW);
    n.visible = true;
  });

  // Hide others + pause/resume their idle
  [0,1,2].forEach(i=>{
    const n = cache.get(i); if (!n) return;
    const vis = indices.includes(i);
    if (n.visible !== vis){
      n.visible = vis;
      const actMap = actions.get(i);
      if (actMap){
        const idleName = Object.keys(actMap).find(nm => /idle|breath|loop/i.test(nm)) || Object.keys(actMap)[0];
        const a = actMap[idleName];
        if (a){
          if (vis){
            // coming back: be 100% sure it’s running
            a.enabled = true;
            a.paused  = false;
            if (!a.isRunning()) a.play();
          } else {
            a.paused = true;
          }
        }
      }
    }
  });
}


function frameCameraToVisible(pad, instantCamera = false){
  if (pad == null) pad = (layoutMode === '3') ? 1.10 : (layoutMode === '2') ? 1.06 : 1.02;

  const temp = new THREE.Group();
  [0,1,2].forEach(i=>{ const n = cache.get(i); if (n?.visible) temp.add(n.clone()); });

  const box = getMeshBoundsDeep(temp);
  if (!box) return;

  const size   = new THREE.Vector3(); box.getSize(size);
  const vFov   = THREE.MathUtils.degToRad(camera.fov);
  const aspect = camera.aspect;
  const hFov   = 2 * Math.atan(Math.tan(vFov * 0.5) * aspect);

  const halfW = (size.x * 0.5) * pad;
  const halfH = (size.y * 0.5) * pad;

  const distFitW = halfW / Math.tan(hFov * 0.5);
  const distFitH = halfH / Math.tan(vFov * 0.5);
  const distFit  = Math.max(3.5, Math.max(distFitW, distFitH));

  const base    = BASE_DIST[layoutMode] ?? 10.0;
  const maxDist = base * MAX_DIST_MULT;
  const dist    = Math.min(Math.max(distFit, base), maxDist);

  camLook.set(rowGroup.position.x, TARGET_Y + currentYBias(), rowGroup.position.z);
  camZTarget = camLook.z + dist;
    
    if (instantCamera){
        camera.position.z = camZTarget;
    }
}

/* Emit one UI event with the current visible groups (in order) */
function emitLayoutChange(){
  const indices = visibleIndices();
  const groups  = indices.map(i => CARDS[i].slug);
  window.dispatchEvent(new CustomEvent('layoutchange', {
    detail: { mode: layoutMode, visibleIndices: indices, visibleGroups: groups }
  }));
}

/* One entry point to place, frame, and notify UI */
function applyLayout({ instantCamera = false } = {}){
  const indices = visibleIndices();
  frameCameraToVisible(undefined, instantCamera);                               // sets camZTarget
  if (instantCamera){
    // snap this frame so the card appears immediately
    camera.position.set(camLook.x, CAMERA_Y, camLook.z + (camZTarget - camLook.z));
  }
  positionVisibleByViewportLanes(indices, insetForMode());
  // make sure any newly visible idles are running
  indices.forEach(ensureIdleRunning);
  emitLayoutChange();
}

/* ---------- Select (no camera move) ---------- */
async function selectIndex(i, {instantCamera = false} ={}){
                    current = (i + CARDS.length) % CARDS.length;

                    // make sure all three are in memory
                    await Promise.all([0,1,2].map(ensureLoaded));

                    // dim non-current (no vertical “hop”)
                    applyActiveStyling();

                    // layout for current mode (3/2/1), keep current in view for 2-up/1-up
                      applyLayout({instantCamera});

                    // fire UI event for things that only care about the active card
                    const slug = CARDS[current]?.slug || null;
                    window.dispatchEvent(new CustomEvent('cardchange', { detail:{ index: current, slug } }));
                  }

// --- Hover mute so lanes/icons don't immediately re-preview after swipe ---
function muteHover(ms = 250){
  window.__hoverMuteUntil = performance.now() + ms; // ui.js checks this
}
function hoverMuted(){
  return performance.now() < (window.__hoverMuteUntil || 0);
}

/* ---------- Swipe / Drag / Trackpad navigation (smoother) ---------- */
const CAN_SWIPE = () => layoutMode !== '3'; // enable in 2-up & 1-up

const gestureTargets = [
  document.getElementById('lanes'),
  canvas
].filter(Boolean);

/* Tunables */
const DRAG_RANGE   = 140; // px for a “full” swipe (controls sensitivity/feel)
const H_SWIPE_PX   = 56;  // min horizontal distance to count as swipe
const V_CANCEL_PX  = 36;  // vertical drift tolerance (higher = less accidental cancels)
const FLICK_VX     = 0.35; // px/ms; faster than this triggers even if distance small
const COOLDOWN_MS  = 160; // ignore second swipe immediately after the first

/* State */
const drag = { active:false, x0:0, y0:0, t0:0, x:0, y:0, id:null };
let swipeCooldownUntil = 0;

/* helper: clamp */
const clamp = (v,min,max)=> Math.min(max, Math.max(min, v));

/* helper: ease progress for nicer feel (cubic) */
function easeProgress(p){
  const s = Math.sign(p), a = Math.abs(p);
  return s * (a*a*(3 - 2*a)); // smoothstep-ish
}

/* while dragging, softly preview highlight (no movement) */
function previewByProgress(dx){
  const raw = clamp(dx / DRAG_RANGE, -1, 1);
  const p   = easeProgress(raw);

  if (Math.abs(p) < 0.15){
    // close to center → keep current highlighted
    previewIndex(-1);
    return;
  }
  const dir = p < 0 ? +1 : -1; // dragging left shows NEXT, right shows PREV
  const neighbor = (current + dir + CARDS.length) % CARDS.length;

  // only preview if that neighbor is visible in this layout
  const visible = new Set(visibleIndices());
  if (visible.has(neighbor)) {
    previewIndex(neighbor);
  } else {
    previewIndex(-1);
  }
}

/* core handlers */
function startDrag(e){
  if (!CAN_SWIPE()) return;
  if (performance.now() < swipeCooldownUntil) return;

  drag.active = true;
  drag.id = e.pointerId ?? null;
  drag.x0 = e.clientX; drag.y0 = e.clientY;
  drag.t0 = performance.now();
  drag.x  = drag.x0;   drag.y  = drag.y0;

  try { e.currentTarget.setPointerCapture && drag.id!=null && e.currentTarget.setPointerCapture(drag.id); } catch {}
}

function moveDrag(e){
  if (!drag.active) return;
  e.preventDefault(); // keep the page from scrolling while we drag

  drag.x = e.clientX; drag.y = e.clientY;

  // cancel if it turned into a vertical scroll
  if (Math.abs(drag.y - drag.y0) > V_CANCEL_PX){
    cancelDrag(e);
    previewIndex(-1);
    return;
  }

  // live preview highlight based on horizontal progress
  previewByProgress(drag.x - drag.x0);
}

let lastPointerX = window.innerWidth / 2;


window.addEventListener('mousemove', (e)=>{
  lastPointerX = e.clientX;
});
window.addEventListener('touchmove', (e)=>{
  if (e.touches && e.touches[0]) lastPointerX = e.touches[0].clientX;
}, { passive: true });

// --- Mobile swipe: 1-up navigation
let touchStartX = 0, touchStartY = 0, touchActive = false;

window.addEventListener('touchstart', (e)=>{
  if (!FORCE_ONE_UP) return;        // only on mobile layout
  const t = e.touches && e.touches[0];
  if (!t) return;
  touchStartX = t.clientX;
  touchStartY = t.clientY;
  touchActive = true;
}, { passive: true });

window.addEventListener('touchmove', (e)=>{
  if (!FORCE_ONE_UP || !touchActive) return;
  const t = e.touches && e.touches[0]; if (!t) return;

  const dx = t.clientX - touchStartX;
  const dy = t.clientY - touchStartY;

  // If mostly horizontal and significant, prevent the page from scrolling
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 15){
    e.preventDefault(); // need passive:false (set below)
  }
}, { passive: false });

window.addEventListener('touchend', (e)=>{
  if (!FORCE_ONE_UP || !touchActive) return;
  touchActive = false;

  const t = (e.changedTouches && e.changedTouches[0]) || null;
  const dx = t ? (t.clientX - touchStartX) : 0;
  const dy = t ? (t.clientY - touchStartY) : 0;

  // Commit a swipe if horizontal & over threshold
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40){
    const dir = dx < 0 ? +1 : -1;           // left swipe → next, right swipe → prev
    // Instant snap feels best on mobile; change to false if you prefer eased camera
    selectIndex(current + dir, { instantCamera: true });
  }
}, { passive: true });

// Map a clientX to the visible index under that column (1/2/3-up aware)
function indexUnderPointer(clientX){
  const vis = visibleIndices();                 // e.g. [0,2] in 2-up
  const n   = Math.max(1, vis.length);
  const w   = Math.max(1, window.innerWidth);
  const col = Math.min(n - 1, Math.max(0, Math.floor((clientX / w) * n)));
  return vis[col];
}

// Apply hover-style highlight to whatever is under the pointer right now
function applyHoverFromPointer(clientX){
  const overlay = document.getElementById('overlay');
  const overlayOpen = overlay && !overlay.hidden;
  const hoverCapable = window.matchMedia('(hover:hover)').matches;
  if (!hoverCapable || overlayOpen) return;
  const idx = indexUnderPointer(clientX);
  if (typeof previewIndex === 'function') previewIndex(idx);
}

function endDrag(e){
  if (!dragging) return;
  dragging = false;

  const pt = e.changedTouches ? e.changedTouches[0] : e;
  const dx = pt.clientX - startX;
  const dt = Math.max(1, performance.now() - startT);
  const vx = Math.abs(dx) / dt;            // px per ms

  const passedDistance = Math.abs(dx) > H_SWIPE_PX;
  const passedVelocity = vx > FLICK_VX;

  if (passedDistance || passedVelocity){
    const dir     = dx < 0 ? +1 : -1;      // swipe left -> next (+1), right -> prev (-1)
    const target  = current + dir;

    // briefly suppress hover so swipe feels decisive (no flicker)
    if (typeof muteHover === 'function') muteHover(280);

    // switch selection; snap camera quickly (no Z easing lag)
    // make sure your selectIndex accepts the options object
    selectIndex(target, { instantCamera: false });

    // immediately set the highlight based on where the pointer actually is
    applyHoverFromPointer(pt.clientX);
  }
}

function cancelDrag(e){
  drag.active = false;
  drag.id = null;
}

/* attach to both #lanes and #webgl (topmost wins) */
gestureTargets.forEach(el=>{
  el.addEventListener('pointerdown',  startDrag, { passive: true  });
  el.addEventListener('pointermove',  moveDrag,  { passive: false }); // must be non-passive
  el.addEventListener('pointerup',    endDrag,   { passive: true  });
  el.addEventListener('pointercancel',cancelDrag,{ passive: true  });
  el.addEventListener('pointerleave', endDrag,   { passive: true  });
});

/* Trackpad: smooth two-finger left/right */
let wheelAccum = 0, wheelTimer = null;
gestureTargets.forEach(el=>{
  el.addEventListener('wheel', (e)=>{
    if (!CAN_SWIPE()) return;
    // ignore when mostly vertical
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX) * 1.6) return;

    wheelAccum += e.deltaX;

    // live preview as you scrub
    previewByProgress(wheelAccum);

    if (wheelTimer) clearTimeout(wheelTimer);
    wheelTimer = setTimeout(()=>{
      if (Math.abs(wheelAccum) > 110){
        const dir = wheelAccum > 0 ? +1 : -1;
        selectIndex(current + dir);
        swipeCooldownUntil = performance.now() + COOLDOWN_MS;
      }
      wheelAccum = 0;
      wheelTimer = null;
      previewIndex(-1);
    }, 90);
  }, { passive: true });
});

/* ---------- Group helpers ---------- */
function indexForGroupSlug(slug){
  const i = CARDS.findIndex(c => c.slug === slug);
  return i >= 0 ? i : 1;
}
function selectGroup(slug){ return selectIndex(indexForGroupSlug(slug)); }
function getCurrentIndex(){ return current; }

/* ---------- Overlay (compat for ui.js) ---------- */
function openOverlay(kind){
  renderer.domElement.classList.add('dim-3d');
  modalTitle.textContent =
    kind === 'listen'  ? 'Listen'  :
    kind === 'buy'     ? 'Buy'     :
    kind === 'explore' ? 'Explore' : 'Info';
  modalBody.innerHTML = `<p>Coming soon.</p>`;
  modal.hidden = false;
}
function closeOverlay(){
  modal.hidden = true;
  renderer.domElement.classList.remove('dim-3d');
}
modalClose?.addEventListener('click', closeOverlay);
window.addEventListener('keydown', (e)=>{ if (e.key === 'Escape' && !modal.hidden) closeOverlay(); });

window.addEventListener('keydown', (e)=>{
  // ignore when typing or overlay open
  const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
  if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.isContentEditable) return;
  const overlay = document.getElementById('overlay');
  if (overlay && !overlay.hidden) return;

  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
  if (e.repeat) return;           // no auto-repeat jitter
  e.preventDefault();

  const dir = (e.key === 'ArrowRight') ? +1 : -1;

  // briefly suppress hover so the change feels decisive
  if (typeof muteHover === 'function') muteHover(250);

  // snap camera for crisp feel; set to false if you want eased Z instead
  selectIndex(current + dir, { instantCamera: true });

  // immediately highlight whatever is actually under the pointer
  applyHoverFromPointer(lastPointerX);
});

/* ---------- Center row on origin ---------- */
function centerRowGroupAtOrigin(){
  const box = getMeshBoundsDeep(rowGroup);
  if (!box) return;
  const center = new THREE.Vector3();
  box.getCenter(center);
  rowGroup.position.x -= center.x;
  rowGroup.position.z -= center.z;
}

/* ---------- Boot ---------- */
async function boot(){
  // Put the camera far enough that first layout has room
  camera.position.set(0, CAMERA_Y, 10);
  camera.lookAt(0, TARGET_Y + currentYBias(), 0);
    
    // On mobile/touch, force 1-up so it never shows 2/3 models
     if (FORCE_ONE_UP) layoutMode = '1';

  await Promise.all([0,1,2].map(ensureLoaded));
  applyActiveStyling();
  centerRowGroupAtOrigin();

  chooseLayoutMode();
  applyLayout();                 // place + frame + notify UI

  await selectIndex(current);    // ensure idles + UI sync

  // First visible frame, then fade in and start the loop
  renderer.render(scene, camera);
  rowGroup.visible = true;

  canvas.style.transition = 'opacity .2s ease';
  canvas.style.opacity = '1';
  canvas.style.visibility = 'visible';

  startRenderLoop();
}

/* ---------- Loop ---------- */
const clock = new THREE.Clock();
function startRenderLoop(){
  if (renderStarted) return;
  renderStarted = true;
  requestAnimationFrame(loop);
}

function loop(){
  requestAnimationFrame(loop);
  const dt = Math.min(clock.getDelta(), 1/30);

  mixers.forEach(mx => mx.update(dt));

  // Smooth Z towards target
  const z = THREE.MathUtils.lerp(camera.position.z, camZTarget, 1 - Math.exp(-8 * dt));
  camera.position.set(camLook.x, CAMERA_Y, z);
  camera.lookAt(camLook);

  renderer.render(scene, camera);
}

                  /* ---------- Resize (debounced) ---------- */
                  let resizeTimer = null;
                  let lastW = window.innerWidth, lastH = window.innerHeight;

                  window.addEventListener('resize', ()=>{
                    const w = window.innerWidth, h = window.innerHeight;

                    // update renderer/camera immediately so our math uses the new aspect
                    camera.aspect = w / h;
                    camera.updateProjectionMatrix();
                    renderer.setSize(w, h);

                    if (resizeTimer) clearTimeout(resizeTimer);
                    resizeTimer = setTimeout(()=>{
                      // may flip 3↔2↔1 with hysteresis
                      const modeChanged = chooseLayoutMode();

                      // 1) place visible models into N equal lanes (use your per-mode inset)
                      positionVisibleByViewportLanes(visibleIndices(), insetForMode());

                      // 2) frame to the *visible* set (updates camZTarget; render loop eases)
                      frameCameraToVisible();

                      // 3) make sure any model that just returned is animating
                      visibleIndices().forEach(ensureIdleRunning);

                      // 4) tell the UI (icons/lanes/pills) what’s visible now
                      emitLayoutChange();

                      lastW = w; lastH = h;
                    }, 120);
                  });

/* ---------- Kick ---------- */
boot();

    function previewIndex(i){
      for (let k = 0; k < CARDS.length; k++){
        const node = cache.get(k); if (!node) continue;
        const highlight = (i >= 0) ? (k === i) : (k === current);
        setDim(node, !highlight);
        node.position.y = Y_BASE;
      }
    }

/* ---------- Exports for ui.js ---------- */
export { CARDS, selectGroup, getCurrentIndex, selectIndex, openOverlay, /* for preview hover */ previewIndex, indexForGroupSlug };

/* ---------- Hover preview (dim only) ---------- */

