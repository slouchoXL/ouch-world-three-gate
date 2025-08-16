// main.module.js — OUCH: three characters side-by-side (no carousel)
console.log('OUCH row layout build loaded');
// Imports via <script type="importmap"> in index.html
import * as THREE from 'three';
import { GLTFLoader }   from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader }  from 'three/addons/loaders/DRACOLoader.js';
import { KTX2Loader }   from 'three/addons/loaders/KTX2Loader.js';

/* ---------- DOM ---------- */
const canvas        = document.getElementById('webgl');
const modal         = document.getElementById('overlay');
const modalTitle    = document.getElementById('overlay-title');
const modalBody     = document.getElementById('overlay-body');
const modalClose    = document.getElementById('overlay-close');

/* ---------- Three setup ---------- */
const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:false });
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const CAMERA_Y = 1.1;
const TARGET_Y = 1.1;
const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 200);
scene.add(camera);

/* Lights */
scene.add(new THREE.HemisphereLight(0xffffff, 0x222233, 1.0));
const dir = new THREE.DirectionalLight(0xffffff, 2.0);
dir.position.set(3,6,5);
scene.add(dir);

/* Floor (gradient) */
function makeFloorGradient({
  size = 512,
  base = '#0a0a0a',
  inner = 'rgba(0,0,0,0.55)',
  mid   = 'rgba(0,0,0,0.18)',
  outer = 'rgba(0,0,0,0.00)'
} = {}){
  const c = document.createElement('canvas'); c.width = c.height = size;
  const g = c.getContext('2d');
  g.fillStyle = base; g.fillRect(0,0,size,size);
  const cx=size/2, cy=size/2, r=size*0.48;
  const grad = g.createRadialGradient(cx, cy, r*0.12, cx, cy, r);
  grad.addColorStop(0.00, inner); grad.addColorStop(0.55, mid); grad.addColorStop(1.00, outer);
  g.globalCompositeOperation = 'multiply';
  g.fillStyle = grad; g.beginPath(); g.arc(cx, cy, r, 0, Math.PI*2); g.fill();
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.flipY = false;
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
let current = 1; // start with middle one active

/* ---------- Helpers ---------- */
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

function getMeshBounds(root){
  const box = new THREE.Box3(); let has = false;
  root.traverse(o=>{
    if (o.isMesh && o.geometry){
      o.updateWorldMatrix(true, false);
      if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
      const bb = o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld);
      box.union(bb); has = true;
    }
  });
  return has ? box : null;
}

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

/* ---------- Cache / animations ---------- */
const cache    = new Map(); // i -> THREE.Group
const inflight = new Map(); // i -> Promise<THREE.Group>
const mixers   = new Map(); // i -> AnimationMixer
const actions  = new Map(); // i -> { name: action }

function findIdleClip(clips){
  return clips.find(c => /idle|breath|loop/i.test(c.name)) || clips[0] || null;
}
function primeIdlePose(mixer, clips, tSeconds = 0.4){
  const idle = findIdleClip(clips); if (!idle) return null;
  const action = mixer.clipAction(idle);
  action.enabled = true;
  action.setLoop(THREE.LoopPingPong, Infinity);
  action.clampWhenFinished = true;
  action.play();
  action.time = Math.min(tSeconds, idle.duration * 0.25);
  mixer.update(0);
  action.paused = true;
  return action;
}

/* ---------- Layout: three columns ---------- */
const SPACING = 3.2;      // x distance between characters
const Y_BASE  = 0.0;
const Z_ROW   = 0.0;

function positionCard(node, i){
  // i: 0,1,2  -> x: -SPACING, 0, +SPACING
  const x = (i - 1) * SPACING;
  node.position.set(x, Y_BASE, Z_ROW);
  node.rotation.y = 0; // face camera
}

function applyActiveStyling(){
  for (let i=0;i<CARDS.length;i++){
    const node = cache.get(i); if (!node) continue;
    const isActive = (i === current);
    setDim(node, !isActive);
    node.position.y = isActive ? Y_BASE + 0.08 : Y_BASE;
  }
}

/* ---------- Load ---------- */
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
      scene.add(node);
      cache.set(i, node);

      if (glb.animations && glb.animations.length){
        const mixer = new THREE.AnimationMixer(node);
        mixers.set(i, mixer);
        const actMap = {};
        glb.animations.forEach(clip => actMap[clip.name] = mixer.clipAction(clip));
        actions.set(i, actMap);
        primeIdlePose(mixer, glb.animations, entry.idleAt ?? 0.4);
      }
      return node;
    } catch (e){
      console.warn('Failed to load', entry?.url, e);
      const node = new THREE.Group();
      node.userData.cardIndex = i;
      positionCard(node, i);
      scene.add(node);
      cache.set(i, node);
      return node;
    } finally {
      inflight.delete(i);
    }
  })();

  inflight.set(i, p);
  return p;
}

/* ---------- Public selection (no camera move) ---------- */
async function selectIndex(i){
  current = (i + CARDS.length) % CARDS.length;
  // Ensure all are loaded (cheap for 3)
  await Promise.all([0,1,2].map(ensureLoaded));
  applyActiveStyling();

  // play idle only on active
  mixers.forEach((mx, idx)=>{
    const actMap = actions.get(idx); if (!actMap) return;
    const idleName = Object.keys(actMap).find(n => /idle|breath|loop/i.test(n)) || Object.keys(actMap)[0];
    const a = actMap[idleName]; if (!a) return;
    a.paused = !(idx === current);
    if (!a.isRunning()) a.play();
  });

  // Notify UI
  const slug = CARDS[current]?.slug || null;
  window.dispatchEvent(new CustomEvent('cardchange', { detail:{ index: current, slug } }));
}

/* Map slug -> index */
function indexForGroupSlug(slug){
  const i = CARDS.findIndex(c => c.slug === slug);
  return i >= 0 ? i : 1;
}
function selectGroup(slug){ return selectIndex(indexForGroupSlug(slug)); }
function getCurrentIndex(){ return current; }

/* ---------- Overlay (kept for compatibility with ui.js routes if needed) ---------- */
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

/* ---------- Boot ---------- */
(async function boot(){
  // Load all three
  await Promise.all([0,1,2].map(ensureLoaded));

  // Place & style
  applyActiveStyling();

  // Frame camera to see all three comfortably
  frameCameraToRow();

  // Start mixers paused except active (handled in selectIndex)
  await selectIndex(current);
})();

function frameCameraToRow(){
  // Compute combined bounds of all loaded nodes
  const group = new THREE.Group();
  [0,1,2].forEach(i=>{ const n = cache.get(i); if (n) group.add(n.clone()); });
  const box = getMeshBounds(group);
  const size = new THREE.Vector3(); box?.getSize(size);
  const cen  = new THREE.Vector3(); box?.getCenter(cen);

  const fov = THREE.MathUtils.degToRad(camera.fov);
  const maxDim = Math.max(size.x || 6, size.y || 2);
  let dist = (maxDim * 0.6) / Math.tan(fov * 0.5); // a bit wider than half
  dist = Math.max(dist, 6.0);

  const look = new THREE.Vector3(0, TARGET_Y, 0);
  camera.position.set(0, CAMERA_Y, dist);
  camera.lookAt(look);
}

/* ---------- Render loop ---------- */
const clock = new THREE.Clock();
function loop(){
  requestAnimationFrame(loop);
  const dt = Math.min(clock.getDelta(), 1/30);

  const mx = mixers.get(current);
  if (mx) mx.update(dt);

  renderer.render(scene, camera);
}
loop();

/* ---------- Resize ---------- */
window.addEventListener('resize', ()=>{
  const w = window.innerWidth, h = window.innerHeight;
  camera.aspect = w/h; camera.updateProjectionMatrix();
  renderer.setSize(w,h);
  frameCameraToRow();
});

/* ---------- Exports for ui.js ---------- */
export { CARDS, selectGroup, getCurrentIndex, selectIndex, openOverlay };

