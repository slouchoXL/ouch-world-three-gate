// main.module.js — carousel with solid-dim neighbors, orbital cam, intro, buttons+keys+trackpad swipe

// Imports via <script type="importmap"> in index.html
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader }   from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader }  from 'three/addons/loaders/DRACOLoader.js';
import { KTX2Loader }   from 'three/addons/loaders/KTX2Loader.js';

/* ---------- DOM ---------- */
const canvas        = document.getElementById('webgl');
const navPrev       = document.getElementById('navPrev');
const navNext       = document.getElementById('navNext');
const navCurrent    = document.getElementById('navCurrent');
const intro         = document.getElementById('intro');
const introContinue = document.getElementById('intro-continue');
const modal         = document.getElementById('overlay');
const modalTitle    = document.getElementById('overlay-title');
const modalBody     = document.getElementById('overlay-body');
const modalClose    = document.getElementById('overlay-close');
const cache         = new Map ();
const inflight      = new Map ();
let lastWheelTime   = 0;

/* ---------- Three setup ---------- */
const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:false });
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 200);
scene.add(camera);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enabled = false; // lock mouse controls; nav is via buttons/keys/swipe

// Lights + ground
scene.add(new THREE.HemisphereLight(0xffffff, 0x222233, 1.0));
const key = new THREE.DirectionalLight(0xffffff, 2.0);
key.position.set(3,6,5);
scene.add(key);


function makeFloorGradient({
  size = 512,
  base = '#0a0a0a',     // floor color
  inner = 'rgba(255,0,0,0.55)', // center darkening
  mid   = 'rgba(0,0,0,0.18)', // mid ring
  outer = 'rgba(0,0,0,0.00)'  // fade to transparent
} = {}){
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');

  // Base fill
  g.fillStyle = base;
  g.fillRect(0,0,size,size);

  // Radial gradient vignette
  const cx = size/2, cy = size/2;
  const r  = size * 0.48;
  const grad = g.createRadialGradient(cx, cy, r*0.12, cx, cy, r);
  grad.addColorStop(0.00, inner);
  grad.addColorStop(0.55, mid);
  grad.addColorStop(1.00, outer);

  g.globalCompositeOperation = 'multiply';
  g.fillStyle = grad;
  g.beginPath(); g.arc(cx, cy, r, 0, Math.PI*2); g.fill();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.flipY = false;
  return tex;
}

// Ground (soft, cheap)
// --- Remove any previous ground (avoid duplicates) ---
const oldGround = scene.getObjectByName('Ground');
if (oldGround) scene.remove(oldGround);

// --- New high-contrast floor so we can see it clearly ---
const floorTex = makeFloorGradient({
  base:  '#0a0a0a',
  inner: 'rgba(0,0,0,0.80)', // strong for visibility; we can dial it back later
  mid:   'rgba(0,0,0,0.30)',
  outer: 'rgba(0,0,0,0.00)'
});

const ground = new THREE.Mesh(
  new THREE.CircleGeometry(12, 64),  // a bit larger so it fills the view
 ground.material = new THREE.MeshStandardMaterial({
    color: 0xff0000,     // keep 1.0 so the map shows true color
    map: floorTex,
    metalness: 0,
    roughness: 1
  })
);
ground.name = 'Ground';
ground.rotation.x = -Math.PI/2;
ground.position.y = 0.02;   // lift slightly to avoid z-fighting with y=0
scene.add(ground);

console.log('[GROUND] Floor gradient applied:', ground);

/* ---------- Loaders ---------- */
const gltfLoader  = new GLTFLoader();
const dracoLoader = new DRACOLoader().setDecoderPath('https://unpkg.com/three@0.165.0/examples/jsm/libs/draco/');
gltfLoader.setDRACOLoader(dracoLoader);
const ktx2Loader  = new KTX2Loader()
  .setTranscoderPath('https://unpkg.com/three@0.165.0/examples/jsm/libs/basis/')
  .detectSupport(renderer);
gltfLoader.setKTX2Loader(ktx2Loader);

/* ---------- Carousel data (update URLs) ---------- */
const CARDS = [
  { name:'Sloucho',     url:'assets/sloucho.glb',     overlay:'chat' },
  { name:'Shop',        url:'assets/props-shop.glb',  overlay:'shop' },
  { name:'Music',       url:'assets/props-music.glb', overlay:'music' },
  { name:'Secret Code', url:'assets/props-code.glb',  overlay:'code' },
  { name:'Subscribe',   url:'assets/props-sub.glb',   overlay:'subscribe' },
  { name:'Events',      url:'assets/props-events.glb',overlay:'events' },
];

/* ---------- Ring layout ---------- */
const ringRadius   = 2.6;
const activeRadius = ringRadius * 0.92;
const ringCenterY  = 1.1;
let current = 0;

/* Fixed camera height/target (no vertical bob) */
const CAMERA_Y = 2;
const TARGET_Y = 2;

/* ---------- Helpers ---------- */
function polar(index, total){
  const angle = (index / total) * Math.PI * 2;
  return { angle, x: Math.sin(angle)*ringRadius, z: Math.cos(angle)*ringRadius };
}
function positionCard(node, i, n){
  const { angle } = polar(i, n);
  node.position.set(Math.sin(angle)*ringRadius, ringCenterY, Math.cos(angle)*ringRadius);
  node.rotation.y = angle; // outward
}
function angleForIndex(i){
  return (i / CARDS.length) * Math.PI * 2;
}
function nearestAngle(current, target){
  const TAU = Math.PI * 2;
  let t = target;
  while (t - current >  Math.PI) t -= TAU;
  while (t - current < -Math.PI) t += TAU;
  return t;
}
function computeFit(i){
  const node = cache.get(i);
  if (!node) return { center: new THREE.Vector3(0, TARGET_Y, 0), dist: ringRadius * 2.0 };
  const box  = new THREE.Box3().setFromObject(node);
  const size = new THREE.Vector3(); box.getSize(size);
  const cen  = new THREE.Vector3(); box.getCenter(cen);

  const center = new THREE.Vector3(cen.x, TARGET_Y, cen.z);
  const fov = THREE.MathUtils.degToRad(camera.fov);
  let maxDim = Math.max(size.x, size.y, size.z);
  let dist = (maxDim * 0.5) / Math.tan(fov * 0.5);
  dist *= 1.35;              // padding
  dist = Math.max(dist, 4); // never too close
  return { center, dist };
}

// -- Cheap radial floor texture (no downloads) --

/* ---------- Cache + dimming ---------- */

const originalMats = new WeakMap();
function forEachMat(mat, fn){ Array.isArray(mat) ? mat.forEach(fn) : fn(mat); }
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
            renderOrder: o.renderOrder
          });
        }
        if (m.transparent) m.transparent = false;
        if (typeof m.opacity === 'number') m.opacity = 1.0;
        if (m.color) m.color.multiplyScalar(0.55);  // dim strength
        if (typeof m.metalness === 'number') m.metalness = Math.min(m.metalness, 0.2);
        if (typeof m.roughness === 'number') m.roughness = Math.max(m.roughness, 0.8);
        if (m.emissive) m.emissive.multiplyScalar(0.6);
        if (typeof m.emissiveIntensity === 'number') m.emissiveIntensity *= 0.6;
        if (typeof m.depthWrite === 'boolean') m.depthWrite = true;
        o.renderOrder = 0;
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
          o.renderOrder = (typeof orig.renderOrder === 'number') ? orig.renderOrder : 0;
          m.needsUpdate = true;
        }
      }
    });
  });
}

/* ---------- Animation state ---------- */
const mixers  = new Map(); // i -> AnimationMixer
const actions = new Map(); // i -> { name: action }

/* ---------- Load GLBs ---------- */
async function ensureLoaded(i){
  if (cache.has(i))    return cache.get(i);
  if (inflight.has(i)) return inflight.get(i);

  const p = (async ()=>{
    const entry = CARDS[i];
    try {
      const glb = await gltfLoader.loadAsync(entry.url);
      const node = glb.scene;
      node.userData.cardIndex = i; // tag for dedupe
      node.traverse(o=>{
        if (o.isMesh){ o.castShadow = false; o.receiveShadow = true; o.frustumCulled = true; }
      });
      positionCard(node, i, CARDS.length);
      scene.add(node);
      cache.set(i, node);

      // — Animations —
      if (glb.animations && glb.animations.length){
        const mixer = new THREE.AnimationMixer(node);
        mixers.set(i, mixer);
        const actMap = {};
        glb.animations.forEach(clip => actMap[clip.name] = mixer.clipAction(clip));
        actions.set(i, actMap);
        const idleName = glb.animations.find(c=>/idle|breath|loop/i.test(c.name))?.name
                      ?? glb.animations[0].name;
        Object.values(actMap).forEach(a=>{ a.paused = true; a.enabled = true; });
        actMap[idleName].reset().play();
      }

      return node;
    } catch (e){
      console.warn('Failed to load', entry?.url, e);
      const node = new THREE.Group();
      node.userData.cardIndex = i;
      positionCard(node, i, CARDS.length);
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

/* ---------- Nav pill ---------- */
function buildChips(){
  updateChips();
  navPrev.addEventListener('click', ()=> canInteract() && selectIndex(current - 1));
  navNext.addEventListener('click', ()=> canInteract() && selectIndex(current + 1));
  navCurrent.addEventListener('click', ()=> canInteract() && openOverlay(CARDS[current].overlay));
}
function updateChips(){
  if (navCurrent) navCurrent.textContent = CARDS[current]?.name ?? '';
}

/* ---------- Camera orbital smoothing ---------- */
let camAngle = 0, camAngleTarget = 0;
let camRadius = ringRadius * 1.9, camRadiusTarget = camRadius;
let camCenter = new THREE.Vector3(0, TARGET_Y, 0);
let camCenterTarget = camCenter.clone();

function faceActiveToCamera(){
  const node = cache.get(current);
  if (!node) return;
  const dx = camera.position.x - node.position.x;
  const dz = camera.position.z - node.position.z;
  node.rotation.y = Math.atan2(dx, dz);
}

/* ---------- Select / place / dim / play ---------- */
async function selectIndex(i){
    function dedupeCard(i){
      let found = false;
      // remove extra scene children tagged with this index
      for (let k = scene.children.length - 1; k >= 0; k--){
        const c = scene.children[k];
        if (c?.userData?.cardIndex === i){
          if (!found){ found = true; continue; } // keep the first
          scene.remove(c);
        }
      }
    }
  current = (i + CARDS.length) % CARDS.length;
    dedupeCard (current);
  updateChips();

  const n = CARDS.length;
    dedupeCard ((current+1)%n);
    dedupeCard ((current-1)%n);
  const toLoad = [current, (current+1)%n, (current-1+n)%n];
  await Promise.all(toLoad.map(ensureLoaded));

  for (let k=0;k<n;k++){
    const node = cache.get(k); if (!node) continue;
    const { angle } = polar(k, n);
    const isActive = (k === current);
    const r = isActive ? activeRadius : ringRadius;
    node.position.set(Math.sin(angle)*r, isActive ? ringCenterY + 0.08 : ringCenterY, Math.cos(angle)*r);
    node.rotation.y = angle;
    setDim(node, !isActive);
  }

  // Camera targets (shortest turn)
  camAngleTarget = nearestAngle(camAngle, angleForIndex(current));
  const fit = computeFit(current);
  camRadiusTarget = fit.dist;
  camCenterTarget.copy(fit.center);

  // Anim: only active plays
  mixers.forEach((mx, idx)=>{
    const actMap = actions.get(idx);
    if (!actMap) return;
    const isActive = (idx === current);
    Object.values(actMap).forEach(a=> a.paused = !isActive);
  });

  faceActiveToCamera();
}

/* ---------- Overlays ---------- */
function openOverlay(kind){
  renderer.domElement.classList.add('dim-3d');
  modalTitle.textContent =
    kind === 'chat' ? 'Talk to Sloucho' :
    kind === 'shop' ? 'Shop' :
    kind === 'music' ? 'Sloucho Radio' :
    kind === 'code' ? 'Secret Code' :
    kind === 'subscribe' ? 'Subscribe' :
    kind === 'events' ? 'Events' : 'Info';

  modalBody.innerHTML =
    kind === 'chat' ? `<p>Ask me anything about OUCH™.</p>` :
    kind === 'shop' ? `<p>Product grid goes here.</p>` :
    kind === 'music' ? `<p>Player UI goes here.</p>` :
    kind === 'code' ? `<p>Password pill goes here.</p>` :
    kind === 'subscribe' ? `<p>Email form goes here.</p>` :
    kind === 'events' ? `<p>Upcoming shows.</p>` :
    `<p>Coming soon.</p>`;
  modal.hidden = false;
}
function closeOverlay(){
  modal.hidden = true;
  renderer.domElement.classList.remove('dim-3d');
}
modalClose?.addEventListener('click', closeOverlay);
window.addEventListener('keydown', (e)=>{ if (e.key === 'Escape' && !modal.hidden) closeOverlay(); });

/* ---------- Keyboard ---------- */
function canInteract(){ return modal.hidden && intro.hidden; }
window.addEventListener('keydown', (e)=>{
  if (!canInteract()) return;
  if (e.key === 'ArrowRight') selectIndex(current + 1);
  if (e.key === 'ArrowLeft')  selectIndex(current - 1);
  if (e.key === 'Enter' || e.key === ' ') openOverlay(CARDS[current].overlay);
});

/* ---------- Trackpad two-finger swipe (horizontal wheel) ---------- */
function attachTrackpadSwipe(el){
  let acc = 0;
  let cooling = false;
  let idleTimer = null;

  const THRESH       = 200; // increase if you still get doubles
  const GESTURE_IDLE = 180; // ms without wheel to end gesture
  const COOLDOWN_MS  = 450; // one step per gesture

  function endGestureSoon(){
    clearTimeout(idleTimer);
    idleTimer = setTimeout(()=>{ acc = 0; }, GESTURE_IDLE);
  }

  el.addEventListener('wheel', (e)=>{
    if (!canInteract()) return;
    // mostly horizontal only
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;

    e.preventDefault(); // avoid page/history swipe

    // normalize
    const scale = (e.deltaMode === 1) ? 16 : (e.deltaMode === 2) ? window.innerHeight : 1;
    acc += e.deltaX * scale;
    endGestureSoon();

    if (cooling) return;

    if (acc >= THRESH){
      acc = 0; cooling = true;
      selectIndex(current + 1);
      setTimeout(()=> cooling = false, COOLDOWN_MS);
    } else if (acc <= -THRESH){
      acc = 0; cooling = true;
      selectIndex(current - 1);
      setTimeout(()=> cooling = false, COOLDOWN_MS);
    }
  }, { passive:false });
}

/* ---------- Intro (first visit gate) ---------- */
function maybeShowIntro(){
  const visited = localStorage.getItem('visited_ouch') === 'true';
  if (visited){ intro.hidden = true; return; }

  intro.hidden = false; // lock until dismissed
  selectIndex(0);       // ensure Sloucho selected

  introContinue?.addEventListener('click', ()=>{
    intro.hidden = true;
    localStorage.setItem('visited_ouch','true');
  }, { once:true });
}

/* ---------- Boot ---------- */
(async function boot(){
  buildChips();
  // preload Sloucho + neighbors
  await ensureLoaded(0);
  const n = CARDS.length;
  [1, n-1].forEach(i => ensureLoaded(i));

  // start focused on Sloucho
  current = 0;
  selectIndex(0);

  // swipe via trackpad
  attachTrackpadSwipe(renderer.domElement);

  // intro gate
  maybeShowIntro();
})();

/* ---------- Render loop ---------- */
const clock = new THREE.Clock();
function lerpAngle(a, b, t){
  let delta = ((b - a + Math.PI) % (Math.PI * 2)) - Math.PI;
  return a + delta * t;
}
function loop(){
  requestAnimationFrame(loop);
  const dt = Math.min(clock.getDelta(), 1/30); // clamp for consistent smoothing

  // smoothing speeds (lower = slower)
  const angSpeed = 3.0;
  const radSpeed = 2.2;
  const ctrSpeed = 2.0;

  const tAng = 1 - Math.exp(-angSpeed * dt);
  const tRad = 1 - Math.exp(-radSpeed * dt);
  const tCtr = 1 - Math.exp(-ctrSpeed * dt);

  camAngle  = lerpAngle(camAngle, camAngleTarget, tAng);
  camRadius = THREE.MathUtils.lerp(camRadius, camRadiusTarget, tRad);
  camCenter.lerp(camCenterTarget, tCtr);

  const x = camCenter.x + Math.sin(camAngle) * camRadius;
  const z = camCenter.z + Math.cos(camAngle) * camRadius;
  camera.position.set(x, CAMERA_Y, z);
  controls.target.copy(camCenter);
  camera.lookAt(controls.target);

  // tick active animation
  const mx = mixers.get(current);
  if (mx) mx.update(dt);

  // keep selected facing camera while moving
  faceActiveToCamera();

  renderer.render(scene, camera);
}
loop();

/* ---------- Resize ---------- */
window.addEventListener('resize', ()=>{
  const w = window.innerWidth, h = window.innerHeight;
  camera.aspect = w/h; camera.updateProjectionMatrix();
  renderer.setSize(w,h);
});
