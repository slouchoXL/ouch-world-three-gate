// main.module.js — OUCH carousel (dim neighbors, smooth cam, intro gate, floor, wheel+mobile swipe, primed idle poses)

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

// ---- Picking (click/tap) ----
const raycaster = new THREE.Raycaster();
const pointer   = new THREE.Vector2();

function objectToCardIndex(obj){
  while (obj){
    if (obj.userData && typeof obj.userData.cardIndex === 'number') return obj.userData.cardIndex;
    obj = obj.parent;
  }
  return null;
}
function setPointerFromEvent(e, el){
  const rect = el.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  pointer.set(x, y);
}

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
controls.enabled = false; // navigation via buttons/keys/swipe only

// Key+fill lights
scene.add(new THREE.HemisphereLight(0xffffff, 0x222233, 1.0));
const key = new THREE.DirectionalLight(0xffffff, 2.0);
key.position.set(3,6,5);
scene.add(key);

/* ---------- Per-card lighting ---------- */
function addTopLight(node) {
  node.updateWorldMatrix(true, true);
  const box = new THREE.Box3().setFromObject(node);
  const height = Math.max(0.001, box.max.y - box.min.y);

  const key = new THREE.PointLight(0xffe8cc, 2.2, 0, 2.0);
  key.name = 'CardTopLight';
  key.position.set(0, height * 0.7 + 0.35, 0);

  const rim = new THREE.DirectionalLight(0xffffff, 0.6);
  rim.name = 'CardRimLight';
  rim.position.set(0.8, 1.4, -0.9);

  const fill = new THREE.PointLight(0x88aaff, 0.35, 0, 2.0);
  fill.name = 'CardFillLight';
  fill.position.set(0.25, height * 0.45, 0.45);

  node.add(key, rim, fill);
}
function setLightLevel(node, active = true) {
  node.traverse(o => {
    if (!o.isLight) return;
    switch (o.name) {
      case 'CardTopLight':  o.intensity = active ? 2.2  : 0.6; break;
      case 'CardRimLight':  o.intensity = active ? 0.6  : 0.18; break;
      case 'CardFillLight': o.intensity = active ? 0.35 : 0.12; break;
    }
  });
}

/* ---------- Floor (zero-asset gradient) ---------- */
function makeFloorGradient({
  size = 512,
  base = '#0a0a0a',
  inner = 'rgba(0,0,0,0.55)',
  mid   = 'rgba(0,0,0,0.18)',
  outer = 'rgba(0,0,0,0.00)'
} = {}){
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  g.fillStyle = base; g.fillRect(0,0,size,size);
  const cx=size/2, cy=size/2, r=size*0.48;
  const grad = g.createRadialGradient(cx, cy, r*0.12, cx, cy, r);
  grad.addColorStop(0.00, inner);
  grad.addColorStop(0.55, mid);
  grad.addColorStop(1.00, outer);
  g.globalCompositeOperation = 'multiply';
  g.fillStyle = grad;
  g.beginPath(); g.arc(cx, cy, r, 0, Math.PI*2); g.fill();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.flipY = false;
  tex.needsUpdate = true;
  return tex;
}
const prevGround = scene.getObjectByName('Ground');
if (prevGround) scene.remove(prevGround);
const floorTex = makeFloorGradient();
const ground = new THREE.Mesh(
  new THREE.CircleGeometry(12, 64),
  new THREE.MeshStandardMaterial({ color:0xffffff, map: floorTex, metalness:0, roughness:1 })
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

/* ---------- Carousel data ---------- */
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
const ringCenterY  = 0.0;
let current = 0;

/* Fixed camera height/target (no vertical bob) */
const CAMERA_Y = 1.1;
const TARGET_Y = 1.1;

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
function angleForIndex(i){ return (i / CARDS.length) * Math.PI * 2; }
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
  dist *= 1.35;
  dist = Math.max(dist, 4);
  return { center, dist };
}
function placeOnGround(node, groundY = 0.0){
  node.updateWorldMatrix(true, true);
  const box = new THREE.Box3().setFromObject(node);
  if (!isFinite(box.min.y) || !isFinite(box.max.y)) return;
  const delta = groundY - box.min.y;
  node.position.y += delta + 0.005;
}

/* ---------- NEW: idle pose helpers ---------- */
function findIdleClip(clips){
  return clips.find(c => /idle|breath|loop/i.test(c.name)) || clips[0] || null;
}
// Park model in a nice pose without running constantly
function primeIdlePose(mixer, clips, tSeconds = 0.4){
  const idle = findIdleClip(clips);
  if (!idle) return null;
  const action = mixer.clipAction(idle);
  action.enabled = true;
  action.setLoop(THREE.LoopPingPong, Infinity); // prevents end snap later
  action.clampWhenFinished = true;
  action.play();
  action.time = Math.min(tSeconds, idle.duration * 0.25); // small offset is nicer than exact frame 0
  mixer.update(0);     // apply pose immediately
  action.paused = true; // hold until card becomes active
  return action;
}

/* ---------- Cache / animations / in-flight ---------- */
const cache    = new Map(); // i -> THREE.Group
const inflight = new Map(); // i -> Promise<THREE.Group>
const mixers   = new Map(); // i -> AnimationMixer
const actions  = new Map(); // i -> { name: action }

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
            renderOrder: o.renderOrder
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
      positionCard(node, i, CARDS.length);

      // NEW: sit on the ground and add lights for every successful load
      placeOnGround(node, 0.0);
      addTopLight(node);

      scene.add(node);
      cache.set(i, node);

      if (glb.animations && glb.animations.length){
        const mixer = new THREE.AnimationMixer(node);
        mixers.set(i, mixer);
        const actMap = {};
        glb.animations.forEach(clip => actMap[clip.name] = mixer.clipAction(clip));
        actions.set(i, actMap);

        // NEW: park in an idle-ish pose, paused
        primeIdlePose(mixer, glb.animations, entry.idleAt ?? 0.4);
      }
      return node;

    } catch (e){
      console.warn('Failed to load', entry?.url, e);
      const node = new THREE.Group();
      node.userData.cardIndex = i;
      positionCard(node, i, CARDS.length);
      placeOnGround(node, 0.0);
      addTopLight(node);
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

function dedupeCard(i){
  let keptOne = false;
  for (let k = scene.children.length - 1; k >= 0; k--){
    const c = scene.children[k];
    if (c?.userData?.cardIndex === i){
      if (!keptOne){ keptOne = true; continue; }
      scene.remove(c);
    }
  }
}

/* ---------- Nav pill ---------- */
function updateChips(){ if (navCurrent) navCurrent.textContent = CARDS[current]?.name ?? ''; }
function buildChips(){
  updateChips();
  navPrev?.addEventListener('click', ()=> canInteract() && selectIndex(current - 1));
  navNext?.addEventListener('click', ()=> canInteract() && selectIndex(current + 1));
  navCurrent?.addEventListener('click', ()=> canInteract() && openOverlay(CARDS[current].overlay));
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
  current = (i + CARDS.length) % CARDS.length;
  updateChips();

  const n = CARDS.length;
  dedupeCard(current);
  dedupeCard((current+1)%n);
  dedupeCard((current-1+n)%n);

  await Promise.all([ current, (current+1)%n, (current-1+n)%n ].map(ensureLoaded));

  for (let k=0;k<n;k++){
    const node = cache.get(k); if (!node) continue;
    const { angle } = polar(k, n);
    const isActive = (k === current);
    const r = isActive ? activeRadius : ringRadius;
    node.position.set(Math.sin(angle)*r, isActive ? ringCenterY + 0.08 : ringCenterY, Math.cos(angle)*r);
    node.rotation.y = angle;
    setDim(node, !isActive);
    setLightLevel(node, isActive);
  }

  camAngleTarget = nearestAngle(camAngle, angleForIndex(current));
  const fit = computeFit(current);
  camRadiusTarget = fit.dist;
  camCenterTarget.copy(fit.center);

  // NEW: only active card runs; neighbors stay frozen in primed pose
  mixers.forEach((mx, idx)=>{
    const actMap = actions.get(idx);
    if (!actMap) return;
    const isActive = (idx === current);
    const idleName = Object.keys(actMap).find(n => /idle|breath|loop/i.test(n)) || Object.keys(actMap)[0];
    const a = actMap[idleName];
    if (!a) return;
    if (isActive){
      a.enabled = true;
      a.paused = false;
      a.setLoop(THREE.LoopPingPong, Infinity);
      a.play();
    } else {
      a.paused = true; // keep parked
    }
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

/* ---------- Mac trackpad two-finger swipe (wheel) ---------- */
function attachTrackpadSwipe(el){
  let acc = 0, cooling = false, idleTimer = null;
  const THRESH = 180, GESTURE_IDLE = 200, COOLDOWN_MS = 400;
  function endGestureSoon(){ clearTimeout(idleTimer); idleTimer = setTimeout(()=>{ acc = 0; }, GESTURE_IDLE); }
  el.addEventListener('wheel', (e)=>{
    if (!canInteract()) return;
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    const scale = (e.deltaMode === 1) ? 16 : (e.deltaMode === 2) ? window.innerHeight : 1;
    acc += e.deltaX * scale; endGestureSoon();
    if (cooling) return;
    if (acc >= THRESH){ acc = 0; cooling = true; selectIndex(current + 1); setTimeout(()=> cooling = false, COOLDOWN_MS); }
    else if (acc <= -THRESH){ acc = 0; cooling = true; selectIndex(current - 1); setTimeout(()=> cooling = false, COOLDOWN_MS); }
  }, { passive:false });
}

/* ---------- Mobile swipe (touch only) ---------- */
function attachMobileSwipe(el){
  el.style.touchAction = 'pan-y';
  const SWIPE_MIN_PX=70, SWIPE_MAX_TIME=600, SLOPE_LIMIT=0.55, COOLDOWN_MS=320;
  let active=false, startX=0,startY=0,startT=0,pointerId=null, cooling=false;
  function onDown(e){
    if (e.pointerType!=='touch') return;
    if (!canInteract()||cooling) return;
    active=true; pointerId=e.pointerId; startX=e.clientX; startY=e.clientY; startT=performance.now();
    el.setPointerCapture?.(pointerId);
  }
  function onUp(e){
    if (!active||e.pointerType!=='touch') return;
    active=false; el.releasePointerCapture?.(pointerId);
    const dt=performance.now()-startT, dx=e.clientX-startX, dy=e.clientY-startY;
    const mostlyH=Math.abs(dy)/Math.max(1,Math.abs(dx))<SLOPE_LIMIT;
    if (mostlyH && dt<=SWIPE_MAX_TIME && Math.abs(dx)>=SWIPE_MIN_PX && !cooling){
      cooling=true; (dx<0?selectIndex(current+1):selectIndex(current-1)); setTimeout(()=>cooling=false, COOLDOWN_MS);
    }
  }
  el.addEventListener('pointerdown', onDown, { passive:true });
  el.addEventListener('pointerup',   onUp,   { passive:true });
  el.addEventListener('pointercancel', ()=>{ active=false; }, { passive:true });
}

/* ---------- Intro (first visit gate) ---------- */
function maybeShowIntro(){
  const visited = localStorage.getItem('visited_ouch') === 'true';
  if (visited){ intro.hidden = true; return; }
  intro.hidden = false; // lock until dismissed
  selectIndex(0);
  introContinue?.addEventListener('click', ()=>{
    intro.hidden = true;
    localStorage.setItem('visited_ouch','true');
  }, { once:true });
}

/* ---------- Click-to-open overlay / navigate ---------- */
function attachClickPick(el){
  let downPos = null, downTime = 0;
  el.addEventListener('pointerdown', (e)=>{
    if (!canInteract()) return;
    downPos = { x: e.clientX, y: e.clientY };
    downTime = performance.now();
  }, { passive: true });
  el.addEventListener('pointerup', (e)=>{
    if (!canInteract()) return;
    const dt = performance.now() - downTime;
    const dx = downPos ? Math.abs(e.clientX - downPos.x) : 999;
    const dy = downPos ? Math.abs(e.clientY - downPos.y) : 999;
    if (dt > 600 || dx > 8 || dy > 8) return; // not a tap
    setPointerFromEvent(e, el);
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(scene.children, true);
    if (!hits.length) return;
    const idx = objectToCardIndex(hits[0].object);
    if (idx === null) return;
    if (idx === current) openOverlay(CARDS[current].overlay);
    else selectIndex(idx);
  }, { passive: true });
}

/* ---------- Boot ---------- */
(async function boot(){
  buildChips();

  // Preload Sloucho + neighbors
  await ensureLoaded(0);
  const n = CARDS.length;
  [1, n-1].forEach(i => ensureLoaded(i));

  // Prime camera targets before first select
  const fit0 = computeFit(0);
  camAngle       = angleForIndex(0);
  camAngleTarget = camAngle;
  camRadius      = Math.max(fit0.dist, 6.5);
  camRadiusTarget= camRadius;
  camCenter.set(0, TARGET_Y, 0);
  camCenterTarget.copy(camCenter);

  await selectIndex(0);

  attachTrackpadSwipe(renderer.domElement);
  attachMobileSwipe(renderer.domElement);
  attachClickPick (renderer.domElement);

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
  const dt = Math.min(clock.getDelta(), 1/30);
  const angSpeed = 2.2, radSpeed = 2.0, ctrSpeed = 1.8;
  const tAng = 1 - Math.exp(-angSpeed * dt);
  const tRad = 1 - Math.exp(-radSpeed * dt);
  const tCtr = 1 - Math.exp(-ctrSpeed * dt);
  camAngle  = lerpAngle(camAngle,  camAngleTarget,  tAng);
  camRadius = THREE.MathUtils.lerp(camRadius, camRadiusTarget, tRad);
  camCenter.lerp(camCenterTarget, tCtr);
  const x = camCenter.x + Math.sin(camAngle) * camRadius;
  const z = camCenter.z + Math.cos(camAngle) * camRadius;
  camera.position.set(x, CAMERA_Y, z);
  controls.target.copy(camCenter);
  camera.lookAt(controls.target);
  const mx = mixers.get(current);
  if (mx) mx.update(dt);
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
