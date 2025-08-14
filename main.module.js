// main.module.js — carousel + centerpiece + dimming + smooth cam + wheel & touch swipe

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader }   from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader }  from 'three/addons/loaders/DRACOLoader.js';
import { KTX2Loader }   from 'three/addons/loaders/KTX2Loader.js';

/* ---------- DOM ---------- */
const canvas = document.getElementById('webgl');
const overlay = document.getElementById('overlay');
const progressEl = document.getElementById('progress');
const btnPrev = document.getElementById('nav-prev');
const btnNext = document.getElementById('nav-next');

/* ---------- Renderer / Scene / Camera ---------- */
const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:false });
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.05, 200);
scene.add(camera);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;

/* ---------- Lights ---------- */
scene.add(new THREE.HemisphereLight(0xffffff, 0x222233, 1.0));
const key = new THREE.DirectionalLight(0xffffff, 2.0);
key.position.set(3,6,5);
scene.add(key);

/* ---------- Ground (procedural gradient) ---------- */
function makeFloorGradient(size=512){
  const c = document.createElement('canvas'); c.width=c.height=size;
  const g = c.getContext('2d');
  g.fillStyle = '#0a0a0a'; g.fillRect(0,0,size,size);
  const cx=size/2, cy=size/2, r=size*0.48;
  const grad = g.createRadialGradient(cx,cy,r*0.12,cx,cy,r);
  grad.addColorStop(0.00,'rgba(0,0,0,0.55)');
  grad.addColorStop(0.55,'rgba(0,0,0,0.18)');
  grad.addColorStop(1.00,'rgba(0,0,0,0.00)');
  g.globalCompositeOperation='multiply'; g.fillStyle=grad;
  g.beginPath(); g.arc(cx,cy,r,0,Math.PI*2); g.fill();
  const tex = new THREE.CanvasTexture(c); tex.colorSpace=THREE.SRGBColorSpace; tex.flipY=false;
  return tex;
}
const ground = new THREE.Mesh(
  new THREE.CircleGeometry(12,64),
  new THREE.MeshStandardMaterial({ color:0xffffff, map: makeFloorGradient(), metalness:0, roughness:1 })
);
ground.rotation.x = -Math.PI/2;
ground.position.y = 0.0;
ground.renderOrder = -1000;
scene.add(ground);

/* ---------- Loaders ---------- */
const manager = new THREE.LoadingManager();
manager.onProgress = (url, loaded, total)=>{
  const pct = Math.round((loaded/Math.max(1,total))*100);
  progressEl && (progressEl.textContent = pct + '%');
};
manager.onLoad = ()=> overlay?.classList.add('hide');

const gltfLoader = new GLTFLoader(manager);
gltfLoader.setDRACOLoader(new DRACOLoader().setDecoderPath('https://unpkg.com/three@0.165.0/examples/jsm/libs/draco/'));
gltfLoader.setKTX2Loader(new KTX2Loader().setTranscoderPath('https://unpkg.com/three@0.165.0/examples/jsm/libs/basis/').detectSupport(renderer));

/* ---------- Helpers ---------- */
function placeOnGround(node, groundY=0){
  node.updateWorldMatrix(true,true);
  const box = new THREE.Box3().setFromObject(node);
  if (!isFinite(box.min.y) || !isFinite(box.max.y)) return;
  const delta = groundY - box.min.y;
  node.position.y += delta + 0.005; // tiny lift
}

function setDimmed(node, dim){
  node.traverse((o)=>{
    if (!o.isMesh) return;
    const m = o.material;
    if (!m) return;
    if (!o.userData.__orig) {
      o.userData.__orig = {
        color: m.color ? m.color.clone() : null,
        emissive: m.emissive ? m.emissive.clone() : null,
        metalness: m.metalness,
        roughness: m.roughness
      };
    }
    const orig = o.userData.__orig;
    if (dim){
      if (m.color && orig.color){ m.color.copy(orig.color).multiplyScalar(0.35); }
      if (m.emissive && orig.emissive){ m.emissive.copy(orig.emissive).multiplyScalar(0.2); }
      if ('metalness' in m && orig.metalness!==undefined) m.metalness = Math.min(0.2, orig.metalness ?? 0);
      if ('roughness' in m && orig.roughness!==undefined) m.roughness = Math.max(0.9, orig.roughness ?? 1);
      m.transparent = false;
      m.needsUpdate = true;
    } else {
      if (orig.color && m.color) m.color.copy(orig.color);
      if (orig.emissive && m.emissive) m.emissive.copy(orig.emissive);
      if ('metalness' in m && orig.metalness!==undefined) m.metalness = orig.metalness;
      if ('roughness' in m && orig.roughness!==undefined) m.roughness = orig.roughness;
      m.needsUpdate = true;
    }
  });
}

function objectToCardIndex(obj){
  while (obj){
    if (obj.userData && typeof obj.userData.cardIndex === 'number') return obj.userData.cardIndex;
    obj = obj.parent;
  }
  return null;
}

/* ---------- Centerpiece (background GLB) ---------- */
async function loadCenterpiece(url){
  try {
    const glb = await gltfLoader.loadAsync(url);
    const node = glb.scene;
    node.userData.isBackdrop = true;
    node.traverse(o=>{
      if (o.isMesh){
        const m = o.material;
        if (m && (m.isMeshStandardMaterial || m.isMeshPhysicalMaterial)){
          m.metalness = 0.0;
          m.roughness = Math.min(1.0, (m.roughness ?? 1.0) * 1.1);
          if (m.color) m.color.multiplyScalar(0.7);
          m.needsUpdate = true;
        }
      }
    });
    scene.add(node);
    placeOnGround(node, 0.0);
    node.renderOrder = -500;
    return node;
  } catch(e){
    console.warn('Centerpiece failed:', e);
    return null;
  }
}

/* ---------- Carousel config ---------- */
const CARDS = [
  { name:'Sloucho',     url:'assets/sloucho.glb',     overlay:'chat',      accent:'#ffffff' },
  { name:'Shop',        url:'assets/props-shop.glb',  overlay:'shop',      accent:'#ffc12e' },
  { name:'Music',       url:'assets/props-music.glb', overlay:'music',     accent:'#2ed0ff' },
  { name:'Secret Code', url:'assets/props-code.glb',  overlay:'code',      accent:'#9bff2e' },
  { name:'Subscribe',   url:'assets/props-sub.glb',   overlay:'subscribe', accent:'#ff3b3b' },
  { name:'Events',      url:'assets/props-events.glb',overlay:'events',    accent:'#c09cff' },
];

// Tiny per-item nudge/scale if needed
const TUNE = {
  'Sloucho':     { scale: 1.0, y: 0.0 },
  'Shop':        { scale: 1.0, y: 0.0 },
  'Music':       { scale: 1.0, y: 0.0 },
  'Secret Code': { scale: 1.0, y: 0.0 },
  'Subscribe':   { scale: 1.0, y: 0.0 },
  'Events':      { scale: 1.0, y: 0.0 },
};

/* ---------- Carousel placement ---------- */
const RADIUS = 2.8;
const HEIGHT = 0.0;
let current = 0;

function polar(i, n){
  const angle = (i / n) * Math.PI * 2;
  return { angle, x: Math.sin(angle)*RADIUS, z: Math.cos(angle)*RADIUS };
}

function positionCard(node, i, n){
  const {angle, x, z} = polar(i,n);
  node.position.set(x, HEIGHT, z);
  // face outward, so when camera aligns to index it sees the front
  node.rotation.y = Math.atan2(-x, -z);
}

/* ---------- Camera tween (fixed distance & Y) ---------- */
const CAM_TARGET_Y   = 1.25;
const CAM_DISTANCE   = 4.4;   // tweak to see full character
const CAM_SMOOTH     = 0.12;  // smaller = smoother/slower
const TARGET = new THREE.Vector3(0, CAM_TARGET_Y, 0);
let desiredPos   = new THREE.Vector3();
let desiredLook  = TARGET.clone();

function computeDesiredForIndex(idx){
  const n = CARDS.length;
  const { angle } = polar(idx, n);
  const cx = Math.sin(angle) * (RADIUS + CAM_DISTANCE);
  const cz = Math.cos(angle) * (RADIUS + CAM_DISTANCE);
  desiredPos.set(cx, CAM_TARGET_Y, cz);
  desiredLook.set(0, CAM_TARGET_Y, 0);
}

function applyCameraLerp(dt){
  const k = 1 - Math.pow(1-CAM_SMOOTH, dt*60);
  camera.position.lerp(desiredPos, k);
  controls.target.lerp(desiredLook, k);
  controls.update();
}

/* ---------- Load & cache ---------- */
async function ensureLoaded(card, index){
  if (card.node) return card.node;

  const glb = await gltfLoader.loadAsync(card.url);
  const node = glb.scene;
  node.userData.cardIndex = index;

  // animations
  let mixer = null;
  if (glb.animations?.length){
    mixer = new THREE.AnimationMixer(node);
    const idle = glb.animations.find(a=>/idle|breath|loop/i.test(a.name)) || glb.animations[0];
    mixer.clipAction(idle).reset().play();
  }

  node.traverse(o=>{ if (o.isMesh) o.frustumCulled = false; });
  scene.add(node);
  placeOnGround(node, 0.0);

  const t = TUNE[card.name] || {};
  node.scale.setScalar(t.scale ?? 1);
  node.position.y += (t.y ?? 0);

  positionCard(node, index, CARDS.length);
  card.node = node;
  card.mixer = mixer;
  return node;
}

/* ---------- Dim states ---------- */
function updateDimStates(){
  CARDS.forEach((card, i)=>{
    if (!card.node) return;
    setDimmed(card.node, i !== current);
  });
}

/* ---------- Navigation ---------- */
function wrap(i, n){ return (i % n + n) % n; }

async function selectIndex(i){
  current = wrap(i, CARDS.length);
  await ensureLoaded(CARDS[current], current);
  computeDesiredForIndex(current);
  updateDimStates();
}

function tryNavigate(delta){
  selectIndex(current + delta);
}

/* ---------- Interaction: click/tap ---------- */
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function openOverlay(kind){
  // hook into your UI system; placeholder to avoid errors
  console.log('Open overlay:', kind);
}

canvas.addEventListener('click', (ev)=>{
  const rect = canvas.getBoundingClientRect();
  mouse.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(scene.children, true);
  const hit = hits.find(h => !h.object?.userData?.isBackdrop && objectToCardIndex(h.object) !== null);
  if (!hit) return;
  const idx = objectToCardIndex(hit.object);
  if (idx === null) return;
  if (idx === current){
    const card = CARDS[current];
    if (card.overlay) openOverlay(card.overlay);
  } else {
    selectIndex(idx);
  }
});

/* ---------- Wheel (trackpad two-finger swipe) ---------- */
let wheelLock = false;
canvas.addEventListener('wheel', (e)=>{
  if (wheelLock) return;
  const mag = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
  if (Math.abs(mag) < 10) return; // ignore jitter
  wheelLock = true;
  tryNavigate(mag > 0 ? +1 : -1);
  setTimeout(()=> wheelLock = false, 320); // debounce
}, { passive:true });

/* ---------- Touch (mobile swipe) ---------- */
let touchStartX = 0, touchStartY = 0, touchActive = false;
const SWIPE_THRESH = 40;   // px
const SWIPE_DEBOUNCE = 320;
let touchLock = false;

canvas.addEventListener('touchstart', (e)=>{
  if (e.touches.length !== 1) return;
  touchActive = true;
  const t = e.touches[0];
  touchStartX = t.clientX;
  touchStartY = t.clientY;
}, { passive:true });

canvas.addEventListener('touchmove', (e)=>{
  // prevent page scroll on intended horizontal swipe
  if (!touchActive) return;
  const t = e.touches[0];
  const dx = t.clientX - touchStartX;
  const dy = t.clientY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy)) e.preventDefault();
}, { passive:false });

canvas.addEventListener('touchend', ()=>{
  if (!touchActive || touchLock) return;
  touchActive = false;

  // we need the last move to compute delta; store as globals during move
  // simplify: treat any end after start as a swipe by tracking last position on move
  // Instead, accumulate deltas in move — but for brevity just compare start vs end via pointer events:
}, { passive:true });

// Better: pointer events unifying touch/mouse — to get end position
let pointerStart = null;
canvas.addEventListener('pointerdown', (e)=>{
  if (e.pointerType !== 'touch') return;
  pointerStart = { x: e.clientX, y: e.clientY };
}, { passive:true });

canvas.addEventListener('pointerup', (e)=>{
  if (e.pointerType !== 'touch' || !pointerStart) return;
  if (touchLock) return;
  const dx = e.clientX - pointerStart.x;
  const dy = e.clientY - pointerStart.y;
  pointerStart = null;

  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESH){
    touchLock = true;
    tryNavigate(dx < 0 ? +1 : -1); // swipe left -> next, right -> prev
    setTimeout(()=> touchLock = false, SWIPE_DEBOUNCE);
  }
}, { passive:true });

/* ---------- Buttons (if present) ---------- */
btnPrev && btnPrev.addEventListener('click', ()=> tryNavigate(-1));
btnNext && btnNext.addEventListener('click', ()=> tryNavigate(+1));

/* ---------- Animate ---------- */
const clock = new THREE.Clock();
function loop(){
  requestAnimationFrame(loop);
  const dt = Math.min(clock.getDelta(), 1/30);

  // update any mixers
  for (const card of CARDS){
    if (card.mixer) card.mixer.update(dt);
  }

  applyCameraLerp(dt);
  renderer.render(scene, camera);
}
loop();

/* ---------- Boot ---------- */
(async function boot(){
  // Optional background piece behind carousel
  await loadCenterpiece('assets/centerpiece.glb'); // change or remove if unused

  // Preload the first item, set camera
  await ensureLoaded(CARDS[0], 0);
  computeDesiredForIndex(0);
  updateDimStates();

  // Lazy-load neighbors (snappy first interaction)
  const n1 = (0 + 1) % CARDS.length;
  const p1 = (0 - 1 + CARDS.length) % CARDS.length;
  ensureLoaded(CARDS[n1], n1);
  ensureLoaded(CARDS[p1], p1);

  // Frame initial camera immediately
  camera.position.copy(desiredPos);
  controls.target.copy(desiredLook);
  controls.update();

  // Place all items (loaded ones now; others when they load)
  CARDS.forEach((card, i)=>{
    if (card.node) positionCard(card.node, i, CARDS.length);
  });
})();

/* ---------- Resize ---------- */
window.addEventListener('resize', ()=>{
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
