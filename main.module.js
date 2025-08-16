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

/* ---------- Responsive breakpoints (relative to first load) ---------- */
const BASELINE_WIDTH = window.innerWidth;
const TWO_UP_RATIO   = 0.75;
const ONE_UP_RATIO   = 0.45;

const BP_TWO_UP = Math.round(BASELINE_WIDTH * TWO_UP_RATIO);
const BP_ONE_UP = Math.round(BASELINE_WIDTH * ONE_UP_RATIO);

/* ---------- Camera sizing clamps ---------- */
const BASE_DIST     = { '3': 6.0, '2': 4.0, '1': 2.0 };
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
  if (layoutMode === '3') return 0.07; // was 0.08 → more breathing room
  if (layoutMode === '2') return 0.07;
  return 0.08; // 1-up
}

function chooseLayoutMode(){
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


function frameCameraToVisible(pad){
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

  camLook.set(rowGroup.position.x, TARGET_Y, rowGroup.position.z);
  camZTarget = camLook.z + dist;
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
                  function applyLayout(){
                    const indices = visibleIndices();
                    frameCameraToVisible();                               // set camZTarget (clamped)
                    positionVisibleByViewportLanes(indices, insetForMode()); // uses camZTarget for spacing
                    indices.forEach(ensureIdleRunning);                           // <-- make sure newly visible idles run
                    emitLayoutChange();                                   // tell UI what’s visible
                  }

/* ---------- Select (no camera move) ---------- */
                  async function selectIndex(i){
                    current = (i + CARDS.length) % CARDS.length;

                    // make sure all three are in memory
                    await Promise.all([0,1,2].map(ensureLoaded));

                    // dim non-current (no vertical “hop”)
                    applyActiveStyling();

                    // layout for current mode (3/2/1), keep current in view for 2-up/1-up
                    applyLayout();

                    // fire UI event for things that only care about the active card
                    const slug = CARDS[current]?.slug || null;
                    window.dispatchEvent(new CustomEvent('cardchange', { detail:{ index: current, slug } }));
                  }

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
  camera.lookAt(0, TARGET_Y, 0);

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

