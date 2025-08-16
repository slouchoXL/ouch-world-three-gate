// main.module.js — OUCH: three characters side-by-side (no carousel)
import * as THREE from 'three';
import { GLTFLoader }   from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader }  from 'three/addons/loaders/DRACOLoader.js';
import { KTX2Loader }   from 'three/addons/loaders/KTX2Loader.js';

/* ---------- DOM ---------- */
const canvas      = document.getElementById('webgl');
canvas.style.visibility = 'hidden';
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

// Optional: prevent the “first-frame flash” by starting hidden and fading in after boot
canvas.style.opacity = '0';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const CAMERA_Y = 1.2;
const TARGET_Y = 1.1;
let screenYBias = -0.3;

const camera = new THREE.PerspectiveCamera(35, window.innerWidth/window.innerHeight, 0.1, 200);
scene.add(camera);

// Dynamic breakpoints based on the initial viewport
const BASELINE_WIDTH = window.innerWidth;
const TWO_UP_RATIO   = 0.75; // 2-up kicks in at ~75% of initial width
const ONE_UP_RATIO   = 0.45; // optional: 1-up around 45% of initial width

// Compute breakpoints once, based on baseline (not changing as you resize)
const BP_TWO_UP = Math.round(BASELINE_WIDTH * TWO_UP_RATIO);
const BP_ONE_UP = Math.round(BASELINE_WIDTH * ONE_UP_RATIO);

// --- tiny globals near the top (after camera creation) ---
let renderStarted = false;
let camZTarget = 8;
let camLook = new THREE.Vector3(0, TARGET_Y, 0);

// Put camera in a safe standby pose so if anything renders early it’s not “inside” a model
camera.position.set(0, CAMERA_Y, 8);
camera.lookAt(0, TARGET_Y, 0);

// Lights
scene.add(new THREE.HemisphereLight(0xffffff, 0x222233, 1.0));
const dir = new THREE.DirectionalLight(0xffffff, 2.0);
dir.position.set(3,6,5);
scene.add(dir);

// One parent for the whole row
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
ground.name = 'Ground';
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
let current = 1; // start with the middle one active
// --- Responsive layout mode (3-up / 2-up / 1-up) ---
let layoutMode = '3'; // '3' | '2' | '1'

//let lastW = window.innerWidth;
//let lastH = window.innerHeight;
//let resizeTimer = null;

// Change these breakpoints if you like:
const BP_ONE_UP   = 700;  // < 700px => 1-up
const BP_TWO_UP   = 1100; // 700–1099 => 2-up, >= 1100 => 3-up

/* ---------- Material dimming helpers ---------- */
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

function setProvisionalCameraZ(z = 10){
  const look = new THREE.Vector3(0, TARGET_Y + screenYBias, 0);
  camera.position.set(0, CAMERA_Y, z);
  camera.lookAt(look);
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

/* ---------- Anim helpers ---------- */
const mixers   = new Map(); // i -> AnimationMixer
const actions  = new Map(); // i -> { name: action }
function findIdleClip(clips){
  return clips.find(c => /idle|breath|loop/i.test(c.name)) || clips[0] || null;
}
function startIdle(mixer, clips){
  const idle = clips.find(c => /idle|breath|loop/i.test(c.name)) || clips[0];
  if (!idle) return;
  const action = mixer.clipAction(idle);
  action.setLoop(THREE.LoopPingPong, Infinity);
  action.clampWhenFinished = true;
  action.time = Math.random() * (idle.duration * 0.4);
  action.play();
  action.paused = false;
  action.timeScale = 0.9 + Math.random() * 0.2; // 0.9–1.1x
}

/* ---------- Layout: three columns ---------- */
const SPACING = 3.2;      // x distance between characters
const Y_BASE  = 0.0;
const Z_ROW   = 0.0;

function positionCard(node, i){
  const x = (i - 1) * SPACING;
  node.position.set(x, Y_BASE, Z_ROW);
  node.rotation.y = 0; // face camera
}

function applyActiveStyling(){
  for (let i=0;i<CARDS.length;i++){
    const node = cache.get(i); if (!node) continue;
    const isActive = (i === current);
    setDim(node, !isActive);
    node.position.y = Y_BASE;
  }
}

/* ---------- Load ---------- */
const cache    = new Map(); // i -> THREE.Group
const inflight = new Map(); // i -> Promise<THREE.Group>

async function ensureLoaded(i){
  if (cache.has(i))     return cache.get(i);
  if (inflight.has(i))  return inflight.get(i);

  const p = (async ()=>{
    const entry = CARDS[i];
    try {
      const glb = await gltfLoader.loadAsync(entry.url);
      const node = glb.scene;
      node.userData.cardIndex = i;
      node.traverse(o=>{ if (o.isMesh){ o.castShadow=false; o.receiveShadow=true; o.frustumCulled = true; }});
      normalizeAndGround(node, /*targetHeight*/ 1.75, /*groundY*/ 0.0);
      positionCard(node, i);
      rowGroup.add(node);
      cache.set(i, node);

      if (glb.animations && glb.animations.length){
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

/* ---------- Select (no camera move) ---------- */
async function selectIndex(i){
  current = (i + CARDS.length) % CARDS.length;

  await Promise.all([0,1,2].map(ensureLoaded));
  applyActiveStyling();

  // Place visible characters into lanes (1/2/3-up), then frame camera
  positionVisibleByViewportLanes(visibleIndices(), insetForMode());
  frameCameraToVisible(1.02);  // sets camLook + camZTarget (see patch below)

  // Let ALL characters animate idles (no pausing)
  mixers.forEach((mx, idx)=>{
    const actMap = actions.get(idx); if (!actMap) return;
    const idleName = Object.keys(actMap).find(n => /idle|breath|loop/i.test(n)) || Object.keys(actMap)[0];
    const a = actMap[idleName]; if (!a) return;
    a.enabled = true;
    a.setLoop(THREE.LoopPingPong, Infinity);
    a.paused = false;
    if (!a.isRunning()) a.play();
  });

  const slug = CARDS[current]?.slug || null;
  window.dispatchEvent(new CustomEvent('cardchange', { detail:{ index: current, slug } }));
}
/* ---------- Group → index helpers ---------- */
function indexForGroupSlug(slug){
  const i = CARDS.findIndex(c => c.slug === slug);
  return i >= 0 ? i : 1;
}
function selectGroup(slug){ return selectIndex(indexForGroupSlug(slug)); }
function getCurrentIndex(){ return current; }

/* ---------- Overlay (kept for ui.js) ---------- */
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

/* ---------- Center, Frame, Layout ---------- */
function centerRowGroupAtOrigin(){
  const box = getMeshBoundsDeep(rowGroup);
  if (!box) return;
  const center = new THREE.Vector3();
  box.getCenter(center);
  rowGroup.position.x -= center.x;
  rowGroup.position.z -= center.z;
}

// NEW: set camera targets (with optional instant snap on first frame)
/*function frameCameraToRow(pad = 1.02, instant = false){
  const box = getMeshBoundsDeep(rowGroup);
  if (!box) return;

  const size = new THREE.Vector3(); box.getSize(size);

  const vFov = THREE.MathUtils.degToRad(camera.fov);
  const aspect = camera.aspect;
  const hFov = 2 * Math.atan(Math.tan(vFov * 0.5) * aspect);

  const halfW = (size.x * 0.5) * pad;
  const halfH = (size.y * 0.5) * pad;

  const distW = halfW / Math.tan(hFov * 0.5);
  const distH = halfH / Math.tan(vFov * 0.5);
  let dist = Math.max(distW, distH);
  dist = Math.max(dist, 3.5);

  camLook.set(rowGroup.position.x, TARGET_Y + screenYBias, rowGroup.position.z);
  camZTarget = camLook.z + dist;

  if (instant || !renderStarted){
    camera.position.set(camLook.x, CAMERA_Y, camZTarget);
    camera.lookAt(camLook);
  }
}*/

function frameCameraToVisible(pad = 1.02){
  const temp = new THREE.Group();
  [0,1,2].forEach(i=>{
    const n = cache.get(i);
    if (n?.visible) temp.add(n.clone());
  });

  const box = getMeshBoundsDeep(temp);
  if (!box) return;

  const size = new THREE.Vector3(); box.getSize(size);
  const vFov = THREE.MathUtils.degToRad(camera.fov);
  const aspect = camera.aspect;
  const hFov = 2 * Math.atan(Math.tan(vFov * 0.5) * aspect);

  const halfW = (size.x * 0.5) * pad;
  const halfH = (size.y * 0.5) * pad;

  const distW = halfW / Math.tan(hFov * 0.5);
  const distH = halfH / Math.tan(vFov * 0.5);
  const dist = Math.max(3.5, Math.max(distW, distH));

  // Set targets; loop() will smoothly lerp Z to camZTarget
  camLook.set(rowGroup.position.x, TARGET_Y + screenYBias, rowGroup.position.z);
  camZTarget = camLook.z + dist;
}

// Position the three models at the centers of three equal screen lanes.
/*function layoutRowByViewportThirds(inset = 0.08){
  const vFov = THREE.MathUtils.degToRad(camera.fov);
  const aspect = camera.aspect;
  const hFov = 2 * Math.atan(Math.tan(vFov * 0.5) * aspect);

  const dist = Math.abs(camera.position.z - Z_ROW);
  const halfW = Math.tan(hFov * 0.5) * dist;
  const W = 2 * halfW;

  const usable = W * (1 - inset * 2);
  const leftEdgeX  = -usable / 2;
  const segmentW   = usable / 3;

  const targets = [
    leftEdgeX + segmentW * 0.5,
    leftEdgeX + segmentW * 1.5,
    leftEdgeX + segmentW * 2.5
  ];

  [0,1,2].forEach(i=>{
    const n = cache.get(i); if (!n) return;
    n.position.x = targets[i];
  });
}*/

function chooseLayoutMode(){
  const w = window.innerWidth;
  const prev = layoutMode;

  // Hysteresis margins ~3% of baseline to prevent flapping near thresholds
  const marginTwo = Math.round(BASELINE_WIDTH * 0.03);
  const marginOne = Math.round(BASELINE_WIDTH * 0.03);

  if (layoutMode === '3'){
    // Only drop to 2-up once we’re clearly below the 75% line
    if (w < BP_TWO_UP - marginTwo) layoutMode = '2';
  } else if (layoutMode === '2'){
    // Go back to 3-up only after we’re comfortably above the 75% line
    if (w >= BP_TWO_UP + marginTwo)            layoutMode = '3';
    else if (w < BP_ONE_UP - marginOne)        layoutMode = '1';
  } else { // '1'
    if (w >= BP_ONE_UP + marginOne) layoutMode = '2';
  }

  return prev !== layoutMode;
}

// Which models should be shown in this mode?
function visibleIndices(){
  if (layoutMode === '3') return [0,1,2];
  if (layoutMode === '2') return [ current, (current + 1) % CARDS.length ];
  return [ current ]; // '1'
}

// Choose horizontal inset based on current layout mode
function insetForMode(){
  // More inset for 3-up to keep models breathing room on first paint
  if (layoutMode === '3') return 0.16; // was 0.08
  if (layoutMode === '2') return 0.10;
  return 0.08; // 1-up
}

// Position N visible nodes at N equal screen lanes (horizontally)
function positionVisibleByViewportLanes(indices, inset = 0.08){
  const vFov = THREE.MathUtils.degToRad(camera.fov);
  const aspect = camera.aspect;
  const hFov = 2 * Math.atan(Math.tan(vFov * 0.5) * aspect);

  const dist = Math.abs(camera.position.z - Z_ROW);
  const halfW = Math.tan(hFov * 0.5) * dist;
  const W = 2 * halfW;

  const usable = W * (1 - inset * 2);
  const segW = usable / Math.max(1, indices.length);
  const leftEdgeX = -usable / 2;

  indices.forEach((idx, i)=>{
    const n = cache.get(idx); if (!n) return;
    const cx = leftEdgeX + segW * (i + 0.5);
    n.position.x = cx;
    n.position.y = Y_BASE;
    n.position.z = Z_ROW;
  });

  // Hide the others
  [0,1,2].forEach(i=>{
    const n = cache.get(i); if (!n) return;
    n.visible = indices.includes(i);
  });
}

// Hover preview (dim others) without changing `current`
function previewIndex(i){
  for (let k = 0; k < CARDS.length; k++){
    const node = cache.get(k); if (!node) continue;
    const highlight = (i >= 0) ? (k === i) : (k === current);
    setDim(node, !highlight);
    node.position.y = Y_BASE;
  }
}

/* ---------- Boot ---------- */
async function boot(){
    setProvisionalCameraZ(10);
    
  await Promise.all([0,1,2].map(ensureLoaded)); // load
  applyActiveStyling();
  centerRowGroupAtOrigin();
    
   // layoutRowByViewportThirds(0.08);
    chooseLayoutMode();
    positionVisibleByViewportLanes(visibleIndices(), insetForMode());
    frameCameraToVisible(1.02, /*instant*/true); // set cam instantly for first frame

  await selectIndex(current);

  // First visible frame, then fade in and start the loop
  renderer.render(scene, camera);
    rowGroup.visible = true;
  canvas.style.transition = 'opacity .2s ease';
  canvas.style.opacity = '1';
    canvas.style.visibility = 'visible';

  startRenderLoop();
}

// Start render loop only once (after boot)
function startRenderLoop(){
  if (renderStarted) return;
  renderStarted = true;
  requestAnimationFrame(loop);
}

/* ---------- Render loop (smooth camera Z) ---------- */
const clock = new THREE.Clock();
function loop(){
  requestAnimationFrame(loop);
  const dt = Math.min(clock.getDelta(), 1/30);

  mixers.forEach(mx => mx.update(dt));

  // Ease camera Z toward target to avoid “size jump” on layout/resize
  const z = THREE.MathUtils.lerp(camera.position.z, camZTarget, 1 - Math.exp(-8 * dt));
  camera.position.set(camLook.x, CAMERA_Y, z);
  camera.lookAt(camLook);

  renderer.render(scene, camera);
}

/* ---------- Resize (debounced & thresholded) ---------- */
let resizeTimer = null;
let lastW = window.innerWidth, lastH = window.innerHeight;

window.addEventListener('resize', ()=>{
  const w = window.innerWidth, h = window.innerHeight;

  // Apply size immediately so math below uses the new aspect
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);

  const dW = Math.abs(w - lastW);
  const dH = Math.abs(h - lastH);
  const aspectDelta = Math.abs((w/h) - (lastW/lastH));

  // Debounce heavy work a hair
  if (resizeTimer) clearTimeout(resizeTimer);
  resizeTimer = setTimeout(()=>{
    // Re-evaluate layout mode (3 / 2 / 1)
    const modeChanged = chooseLayoutMode();

    // Re-place the visible models into N equal lanes
    positionVisibleByViewportLanes(visibleIndices(), insetForMode());

    // Re-frame to **visible** models so size looks consistent
    frameCameraToVisible(1.02);

    // Update last-known size after we finish
    lastW = w; lastH = h;
  }, 120);
});

/* ---------- Kick things off ---------- */
boot();

/* ---------- Exports for ui.js ---------- */
export { CARDS, selectGroup, getCurrentIndex, selectIndex, openOverlay, previewIndex, indexForGroupSlug };
