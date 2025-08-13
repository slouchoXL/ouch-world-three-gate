// main.module.js — carousel with solid-dimmed neighbors (no transparency)

// Imports via import map (defined in index.html)
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader }   from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader }  from 'three/addons/loaders/DRACOLoader.js';
import { KTX2Loader }   from 'three/addons/loaders/KTX2Loader.js';

// ---------- DOM ----------
const canvas        = document.getElementById('webgl');
const chipsEl       = document.getElementById('chips');
const intro         = document.getElementById('intro');
const introContinue = document.getElementById('intro-continue');
const modal         = document.getElementById('overlay');
const modalTitle    = document.getElementById('overlay-title');
const modalBody     = document.getElementById('overlay-body');
const modalClose    = document.getElementById('overlay-close');
// Animation state per card index
const mixers  = new Map();   // i -> THREE.AnimationMixer
const actions = new Map();   // i -> { [clipName]: THREE.AnimationAction }
const navPrev    = document.getElementById('navPrev');
const navNext    = document.getElementById('navNext');
const navCurrent = document.getElementById('navCurrent');
let navCooldownUntil = 0;        // timestamp (ms)
const NAV_COOLDOWN_MS = 360;     // lockout between moves

function tryNavigate(delta){
  const now = performance.now();
  if (now < navCooldownUntil) return;   // ignore extra triggers
  navCooldownUntil = now + NAV_COOLDOWN_MS;
  selectIndex(current + delta);
}

// ---------- Three setup ----------
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
// Lock mouse controls so carousel logic is in charge
controls.enabled = false;

// Lights + ground
scene.add(new THREE.HemisphereLight(0xffffff, 0x222233, 1.0));
const key = new THREE.DirectionalLight(0xffffff, 2.0);
key.position.set(3,6,5);
scene.add(key);

const ground = new THREE.Mesh(
  new THREE.CircleGeometry(10, 64),
  new THREE.MeshStandardMaterial({ color:0x0e0e0e, roughness:1, metalness:0 })
);
ground.rotation.x = -Math.PI/2;
ground.position.y = -0.001;
scene.add(ground);

// ---------- Loaders (after renderer exists) ----------
const gltfLoader  = new GLTFLoader();
const dracoLoader = new DRACOLoader().setDecoderPath('https://unpkg.com/three@0.165.0/examples/jsm/libs/draco/');
gltfLoader.setDRACOLoader(dracoLoader);
const ktx2Loader  = new KTX2Loader()
  .setTranscoderPath('https://unpkg.com/three@0.165.0/examples/jsm/libs/basis/')
  .detectSupport(renderer);
gltfLoader.setKTX2Loader(ktx2Loader);

// ---------- Carousel data (update URLs to your GLBs) ----------
const CARDS = [
  { name:'Sloucho',     url:'assets/sloucho.glb',     overlay:'chat' },
  { name:'Shop',        url:'assets/props-shop.glb',  overlay:'shop' },
  { name:'Music',       url:'assets/props-music.glb', overlay:'music' },
  { name:'Secret Code', url:'assets/props-code.glb',  overlay:'code' },
  { name:'Subscribe',   url:'assets/props-sub.glb',   overlay:'subscribe' },
  { name:'Events',      url:'assets/props-events.glb',overlay:'events' },
];

// ---------- Ring layout ----------
const ringRadius   = 2.6;                 // base radius for items
const activeRadius = ringRadius * 0.92;   // bring active slightly closer
const ringCenterY  = 1.1;                 // vertical center of the carousel
let current = 0;
const CAMERA_Y = 2.5;
const TARGET_Y = 2;

// Orbital camera state
let camAngle = 0;                 // current azimuth
let camAngleTarget = 0;           // target azimuth
let camRadius = ringRadius * 1.9; // current radius
let camRadiusTarget = camRadius;  // target radius
let camCenter = new THREE.Vector3(0, TARGET_Y, 0);        // current look target
let camCenterTarget = camCenter.clone();                  // target look target

function polar(index, total){
  const angle = (index / total) * Math.PI * 2;
  return { angle, x: Math.sin(angle)*ringRadius, z: Math.cos(angle)*ringRadius };
}
function positionCard(node, i, n){
  const { angle } = polar(i, n);
  node.position.set(Math.sin(angle)*ringRadius, ringCenterY, Math.cos(angle)*ringRadius);
  node.rotation.y = angle; // face OUTWARD by default
}

// Global flag so drag handler won't also fire
let wheelGestureActive = false;

function attachTrackpadSwipe(el){
  let acc = 0;
  const THRESH = 130;        // swipe sensitivity (raise if still too sensitive)
  const GESTURE_IDLE = 140; // ms without wheel to end gesture
  const COOLDOWN_MS = 350;  // block repeats for a moment
  let gestureTimer = null;
  let cooling = false;

  function endGestureSoon(){
    clearTimeout(gestureTimer);
    gestureTimer = setTimeout(()=>{
      acc = 0;
      wheelGestureActive = false;
    }, GESTURE_IDLE);
  }

  el.addEventListener('wheel', (e)=>{
    if (!canInteract()) return;

    // Only mostly-horizontal gestures
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;

    e.preventDefault();        // don't scroll the page
    wheelGestureActive = true; // tell drag handler to stand down
    endGestureSoon();

    // Normalize to "pixels" (deltaMode: 0=pixels, 1=lines, 2=pages)
    const scale = (e.deltaMode === 1) ? 16 : (e.deltaMode === 2) ? window.innerHeight : 1;
    acc += e.deltaX * scale;

    if (cooling) return;

    // Decide direction once per gesture, clamp to one step
    if (acc >= THRESH){
      cooling = true; acc = 0;
        tryNavigate(current + 1);            // swipe left → next
      setTimeout(()=> cooling = false, COOLDOWN_MS);
    } else if (acc <= -THRESH){
      cooling = true; acc = 0;
        tryNavigate(current - 1);            // swipe right → prev
      setTimeout(()=> cooling = false, COOLDOWN_MS);
    }
  }, { passive:false });
}
// --- Swipe / drag navigation (touch + mouse, pointer events) ---
/*function attachSwipeNav(el){
  // Make sure the browser doesn't intercept touch gestures
  el.style.touchAction = 'none';

  const SWIPE_MIN_PX   = 40;   // horizontal distance to count as a swipe
  const SWIPE_MAX_TIME = 600;  // ms; long drags won't trigger a swipe
  const SLOPE_LIMIT    = 0.6;  // require mostly horizontal: |dy/dx| < 0.6

  let active = false, startX = 0, startY = 0, startT = 0, didSwipe = false, pointerId = null;

  function onDown(e){
      if (wheelGestureActive) return;
    if (!canInteract()) return;
    active = true; didSwipe = false;
    pointerId = e.pointerId;
    el.setPointerCapture?.(pointerId);
    startX = e.clientX; startY = e.clientY; startT = performance.now();
  }

  function onMove(e){
    if (!active || didSwipe) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    // Optional: small inertial preview (commented out; enable if you want)
    // camAngleTarget = nearestAngle(camAngle, angleForIndex(current) - dx * 0.002);
  }

  function onUp(e){
    if (!active) return;
    active = false;
    el.releasePointerCapture?.(pointerId);

    const dt = performance.now() - startT;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    // Check quick & mostly horizontal
    if (dt <= SWIPE_MAX_TIME && Math.abs(dx) >= SWIPE_MIN_PX && Math.abs(dy) / Math.abs(dx) < SLOPE_LIMIT){
      didSwipe = true;
      if (dx < 0) tryNavigate(current + 1);   // swipe left → next
      else        tryNavigate(current - 1);   // swipe right → prev
    }
  }

  el.addEventListener('pointerdown', onDown, { passive: true });
  el.addEventListener('pointermove', onMove,  { passive: true });
  el.addEventListener('pointerup',   onUp,    { passive: true });
  el.addEventListener('pointercancel', ()=>{ active=false; }, { passive:true });
}*/

function nearestAngle(current, target){
  // Shift target by ±2π so the delta to current is within [-π, +π]
  const TAU = Math.PI * 2;
  let t = target;
  while (t - current >  Math.PI) t -= TAU;
  while (t - current < -Math.PI) t += TAU;
  return t;
}

// ---------- Cache + solid dimming (no transparency) ----------
const cache = new Map();
const originalMats = new WeakMap();

function forEachMat(mat, fn){
  if (Array.isArray(mat)) mat.forEach(fn);
  else fn(mat);
}

// Dim unselected meshes without transparency
function setDim(group, dim = true){
  group.traverse(o=>{
    if (!o.isMesh || !o.material) return;

    forEachMat(o.material, (m)=>{
      const isStd = m.isMeshStandardMaterial || m.isMeshPhysicalMaterial || m.isMeshLambertMaterial || m.isMeshPhongMaterial || m.isMeshBasicMaterial;
      if (!isStd) return;

      if (dim){
        if (!originalMats.has(m)){
          originalMats.set(m, {
            color: m.color ? m.color.clone() : null,
            emissive: m.emissive ? m.emissive.clone() : null,
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

        // Darken color but keep texture detail
        if (m.color) m.color.multiplyScalar(0.25); // tweak 0.45–0.7

        // Mellow highlights so they read "muted"
        if (typeof m.metalness === 'number') m.metalness = Math.min(m.metalness, 0.2);
        if (typeof m.roughness === 'number') m.roughness = Math.max(m.roughness, 0.8);

        // Reduce emissive pop
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

// ---------- Loading ----------
async function ensureLoaded(i){
  if (cache.has(i)) return cache.get(i);
  const entry = CARDS[i];
  try {
    const glb = await gltfLoader.loadAsync(entry.url);
    const node = glb.scene;
      // --- Animation wiring ---
      if (glb.animations && glb.animations.length) {
        const mixer = new THREE.AnimationMixer(node);
        mixers.set(i, mixer);

        const actMap = {};
        glb.animations.forEach((clip)=>{
          actMap[clip.name] = mixer.clipAction(clip);
        });
        actions.set(i, actMap);

        // pick an idle-ish clip, else the first
        const idleName = glb.animations.find(c=>/idle|breath|loop/i.test(c.name))?.name
                       ?? glb.animations[0].name;

        // start paused; we'll unpause when this card is selected
        Object.values(actMap).forEach(a=>{ a.paused = true; a.enabled = true; });
        actMap[idleName].reset().play();
      }
    node.traverse(o=>{ if (o.isMesh){ o.castShadow=false; o.receiveShadow=true; o.frustumCulled = true; }});
    positionCard(node, i, CARDS.length);
    scene.add(node);
    cache.set(i, node);
    return node;
  } catch (e){
    console.warn('Failed to load', entry.url, e);
    const node = new THREE.Group();
    positionCard(node, i, CARDS.length);
    scene.add(node);
    cache.set(i, node);
    return node;
  }
}

// ---------- Chips ----------
function buildChips(){
  // Set initial label and listeners
  updateChips();
  navPrev.addEventListener('click', ()=> canInteract() && tryNavigate(current-1));
  navNext.addEventListener('click', ()=> canInteract() && tryNavigate(current+1));
  navCurrent.addEventListener('click', ()=> canInteract() && openOverlay(CARDS[current].overlay));
}

function updateChips(){
  if (!navCurrent) return;
  navCurrent.textContent = CARDS[current]?.name ?? '';
}

// ---------- Camera tween ----------
let camTween = null;
function startCameraTween(i){
  const node = cache.get(i);

  // Fit distance from the object's size, but keep Y fixed
  let center = new THREE.Vector3(0, 0, 0);
  let dist   = ringRadius * 1.9;

  if (node){
    const box  = new THREE.Box3().setFromObject(node);
    const size = new THREE.Vector3(); box.getSize(size);
    const cen  = new THREE.Vector3(); box.getCenter(cen);

    // We only care about X/Z for aim; Y will be clamped to TARGET_Y
    center.set(cen.x, TARGET_Y, cen.z);

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = THREE.MathUtils.degToRad(camera.fov);
    dist = (maxDim * 0.5) / Math.tan(fov * 0.5);
    dist *= 1.35;             // padding: increase to pull back further
    dist = Math.max(dist, 3.5); // never closer than this
  } else {
    center.set(0, TARGET_Y, 0);
  }

  // Camera sits at same azimuth angle as selected item, fixed height
  const { angle } = polar(i, CARDS.length);
  const endPos = new THREE.Vector3(
    center.x + Math.sin(angle) * dist,
    CAMERA_Y,                                  // << fixed Y
    center.z + Math.cos(angle) * dist
  );

  const startPos    = camera.position.clone();
  const startTarget = controls.target.clone();
  const endTarget   = center;                  // << fixed TARGET_Y in center

  camTween = {
    t: 0,
    dur: 1.2,
    update(dt){
      this.t = Math.min(this.t + dt, this.dur);
      const k = 1 - (1 - this.t / this.dur) * (1 - this.t / this.dur); // easeOutQuad
      camera.position.lerpVectors(startPos, endPos, k);
      controls.target.lerpVectors(startTarget, endTarget, k);
      camera.lookAt(controls.target);
      if (this.t >= this.dur) camTween = null;
    }
  };
}
function easeOutQuad(x){ return 1 - (1 - x) * (1 - x); }

// ---------- Make active face the camera ----------
function faceActiveToCamera(){
  const node = cache.get(current);
  if (!node) return;
  const dx = camera.position.x - node.position.x;
  const dz = camera.position.z - node.position.z;
  node.rotation.y = Math.atan2(dx, dz);
}
function angleForIndex(i){
  return (i / CARDS.length) * Math.PI * 2;
}

// Shortest-path angular lerp
function lerpAngle(a, b, t){
  let delta = ((b - a + Math.PI) % (Math.PI * 2)) - Math.PI;
  return a + delta * t;
}

// Compute a “fit” distance for the selected node (so full body is visible)
function computeFit(i){
  const node = cache.get(i);
  if (!node) {
    return { center: new THREE.Vector3(0, TARGET_Y, 0), dist: ringRadius * 2.0 };
  }
  const box  = new THREE.Box3().setFromObject(node);
  const size = new THREE.Vector3(); box.getSize(size);
  const cen  = new THREE.Vector3(); box.getCenter(cen);

  const center = new THREE.Vector3(cen.x, TARGET_Y, cen.z);
  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = THREE.MathUtils.degToRad(camera.fov);
  let dist = (maxDim * 0.5) / Math.tan(fov * 0.5);

  // Padding + floor so it never gets too close
  dist *= 1.35;                  // pull further back globally
  dist = Math.max(dist, 3.6);    // never closer than this

  return { center, dist };
}

// ---------- Select / place / dim ----------
async function selectIndex(i){
  current = (i + CARDS.length) % CARDS.length;
  updateChips();

  // ensure current + neighbors
  const n = CARDS.length;
  const toLoad = [current, (current+1)%n, (current-1+n)%n];
  await Promise.all(toLoad.map(ensureLoaded));

  // place all, pull active closer + slight lift, and dim others
  for (let k=0;k<n;k++){
    const node = cache.get(k); if (!node) continue;
    const { angle } = polar(k, n);
    const isActive = (k === current);
    const r = isActive ? activeRadius : ringRadius;
    node.position.set(Math.sin(angle)*r, isActive ? ringCenterY + 0.08 : ringCenterY, Math.cos(angle)*r);
    node.rotation.y = angle; // outward baseline; active will be adjusted next
    setDim(node, !isActive);
  }
    // --- Play/pause per selection ---
    mixers.forEach((mx, idx)=>{
      const actMap = actions.get(idx);
      if (!actMap) return;
      const isActive = (idx === current);
      Object.values(actMap).forEach(a=> a.paused = !isActive);
    });
  // camera tween to this index + then face active to camera
    // Set orbital targets (angle, radius, center) — no XYZ lerp
    camAngleTarget = nearestAngle(camAngle, angleForIndex(current));

   const fit = computeFit(current);
   camRadiusTarget = Math.max(fit.dist, 4);
   camCenterTarget.copy(fit.center);

   // Immediately yaw the active mesh toward the camera (optional refine each frame)

  faceActiveToCamera();
}

// ---------- Overlays ----------
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

// Keyboard nav (disabled when modal or intro showing)
function canInteract(){ return modal.hidden && intro.hidden; }
window.addEventListener('keydown', (e)=>{
  if (!canInteract()) return;
  if (e.key === 'ArrowRight') tryNavigate(current+1);
  if (e.key === 'ArrowLeft')  tryNavigate(current-1);
  if (e.key === 'Enter' || e.key === ' ') openOverlay(CARDS[current].overlay);
});

// ---------- Intro gate (first visit; must dismiss) ----------
function maybeShowIntro(){
  const visited = localStorage.getItem('visited_ouch') === 'true';
  if (visited){ intro.hidden = true; return; }

  intro.hidden = false;          // lock interactions until dismissed
  selectIndex(0);                // ensure Sloucho is selected

  introContinue?.addEventListener('click', ()=>{
    intro.hidden = true;
    localStorage.setItem('visited_ouch','true');
  }, { once:true });
}

// ---------- Boot ----------
(async function boot(){
  buildChips();
    //attachSwipeNav (renderer.domElement);
    attachTrackpadSwipe(renderer.domElement);
  // preload Sloucho + immediate neighbors
  await ensureLoaded(0);
  const n = CARDS.length;
  [1, n-1].forEach(i => ensureLoaded(i));

  // initial camera position aligned with sloucho
  current = 0;
  selectIndex(0);

  // show intro gate if first visit
  maybeShowIntro();
})();

// ---------- Render loop ----------
const clock = new THREE.Clock();
function loop(){
  requestAnimationFrame(loop);
  const dt = clock.getDelta();
    const mx = mixers.get(current);
    if (mx) mx.update(dt);

  // Smooth factors (frame-rate independent-ish)
  const angSpeed = 3.0;   // higher = snappier angle
  const radSpeed = 2.2;   // higher = snappier zoom
  const ctrSpeed = 2.0;

  const tAng = 1 - Math.exp(-angSpeed * dt);
  const tRad = 1 - Math.exp(-radSpeed * dt);
  const tCtr = 1 - Math.exp(-ctrSpeed * dt);

  camAngle = lerpAngle(camAngle, camAngleTarget, tAng);
  camRadius = THREE.MathUtils.lerp(camRadius, camRadiusTarget, tRad);
  camCenter.lerp(camCenterTarget, tCtr);

  // Convert polar → Cartesian (keep Y fixed)
  const x = camCenter.x + Math.sin(camAngle) * camRadius;
  const z = camCenter.z + Math.cos(camAngle) * camRadius;
  camera.position.set(x, CAMERA_Y, z);
  controls.target.copy(camCenter);
  camera.lookAt(controls.target);

  // Keep active object facing camera while we move
  faceActiveToCamera();

  renderer.render(scene, camera);
}
loop();

// ---------- Resize ----------
window.addEventListener('resize', ()=>{
  const w = window.innerWidth, h = window.innerHeight;
  camera.aspect = w/h; camera.updateProjectionMatrix();
  renderer.setSize(w,h);
});
