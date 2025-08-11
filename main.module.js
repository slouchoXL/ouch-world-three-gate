import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// (optional)
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';


// ---------- DOM refs ----------
const canvas = document.getElementById('webgl');
const overlay = document.getElementById('overlay');
const progressEl = document.getElementById('progress');

const gate      = document.getElementById('gate');
const pwdInput  = document.getElementById('password');
const gateMsg   = document.getElementById('gate-msg');

const toggleAnimBtn = document.getElementById('toggleAnim');
const resetViewBtn  = document.getElementById('resetView');

// ---------- Three.js setup ----------
const renderer = new THREE.WebGLRenderer({ canvas, antialias:true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 200);
camera.position.set(0,1.5,3);
scene.add(camera);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0,1.4,0);

// Lights
scene.add(new THREE.HemisphereLight(0xffffff, 0x202030, 1.0));
const key = new THREE.DirectionalLight(0xffffff, 1.2);
key.position.set(3,6,5);
scene.add(key);

// Ground
const ground = new THREE.Mesh(
  new THREE.CircleGeometry(6,64),
  new THREE.MeshStandardMaterial({ color:0x111111, metalness:0, roughness:1 })
);
ground.rotation.x = -Math.PI/2;
scene.add(ground);

// ---------- Loading / Model ----------
let mixer, activeAction, allActions = [];
const clock = new THREE.Clock();

const manager = new THREE.LoadingManager();
manager.onProgress = (url, loaded, total) => {
  const pct = Math.round((loaded/total)*100);
  progressEl.textContent = pct + '%';
  const bar = document.querySelector('.loader .bar');
  if (bar) bar.style.width = pct + '%';
};
manager.onError = (url) => {
  const label = document.querySelector('.loader .label');
  if (label) label.textContent = '404: ' + url;
  console.error('Loading error:', url);
};
manager.onLoad = () => setTimeout(()=> overlay?.classList.add('hide'), 200);

const loader = new GLTFLoader(manager);
// const draco = new DRACOLoader(); draco.setDecoderPath('https://unpkg.com/three@0.165.0/examples/jsm/libs/draco/'); loader.setDRACOLoader(draco);

const MODEL_URL = 'assets/metahuman.glb';

loader.load(
  MODEL_URL,
  (gltf)=>{
    const root = gltf.scene;
    root.traverse(o=>{ if (o.isMesh) o.frustumCulled = false; });
    scene.add(root);
    frameToObject(root);

    if (gltf.animations && gltf.animations.length){
      mixer = new THREE.AnimationMixer(root);
      gltf.animations.forEach(clip=>{
        const action = mixer.clipAction(clip);
        allActions.push({ name: clip.name, action });
      });
      const idle = allActions.find(a=>/idle|breath|loop/i.test(a.name)) || allActions[0];
      activeAction = idle?.action;
      activeAction?.reset().fadeIn(0.25).play();
    }
  },
  (xhr)=>{
    if (xhr.lengthComputable){
      const pct = Math.round((xhr.loaded/xhr.total)*100);
      progressEl.textContent = pct + '%';
      const bar = document.querySelector('.loader .bar');
      if (bar) bar.style.width = pct + '%';
    }
  },
  (err)=> {
    // Fallback placeholder so you still see something if GLB is missing
    progressEl.textContent = 'Using placeholder model';
    console.warn('GLB load error, using placeholder:', err);
    const geo = new THREE.TorusKnotGeometry(0.6, 0.22, 220, 32);
    const mat = new THREE.MeshStandardMaterial({ color:0x8888ff, roughness:0.2, metalness:0.6 });
    const knot = new THREE.Mesh(geo, mat);
    knot.position.y = 1.2;
    scene.add(knot);
    frameToObject(knot);
    // idle rotation
    const rot = ()=> { knot.rotation.y += 0.01; requestAnimationFrame(rot); };
    rot();
    overlay?.classList.add('hide');
  }
);

// Fit camera to object
function frameToObject(obj){
  const box = new THREE.Box3().setFromObject(obj);
  const size = new THREE.Vector3(); box.getSize(size);
  const center = new THREE.Vector3(); box.getCenter(center);
  controls.target.copy(center);
  const maxDim = Math.max(size.x, size.y, size.z);
  const dist = maxDim * 1.2 / Math.tan(THREE.MathUtils.degToRad(camera.fov*0.5));
  camera.position.copy(center).add(new THREE.Vector3(0,0.2,1).normalize().multiplyScalar(dist));
  camera.near = Math.max(0.01, dist/100);
  camera.far = dist*10 + maxDim;
  camera.updateProjectionMatrix();
}

// Optional alt gesture trigger (wave/salute clip) on success
function tryTriggerAlt(){
  if (!allActions.length) return;
  const alt = allActions.find(a=>/wave|salute|hello|gesture/i.test(a.name));
  if (!alt) return;
  if (activeAction) activeAction.fadeOut(0.12);
  alt.action.reset().fadeIn(0.12).play();
  activeAction = alt.action;
  const dur = alt.action._clip?.duration || 1;
  setTimeout(()=>{
    const idle = allActions.find(a=>/idle|breath|loop/i.test(a.name)) || allActions[0];
    if (idle && activeAction!==idle.action){
      alt.action.fadeOut(0.2);
      idle.action.reset().fadeIn(0.2).play();
      activeAction = idle.action;
    }
  }, dur*1000 - 40);
}

// ---------- Gate logic (pill input → download button) ----------
const isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

async function redeem(password){
  const res = await fetch('/.netlify/functions/redeem', {
    method:'POST',
    headers:{ 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  });
  if (!res.ok) throw new Error('Redeem failed: ' + res.status);
  return res.json(); // { url, title }
}

async function checkPassword(){
  const password = (pwdInput?.value || '').trim();
  if (!password) return;

  gateMsg.textContent = 'Checking…';
  gateMsg.style.color = 'var(--text)';

  try {
    const { url, title } = await redeem(password);

    tryTriggerAlt();
    gateMsg.textContent = `Unlocked: ${title}`;
    gateMsg.style.color = 'var(--success)';

    morphToDownloadButton(url, title);

  } catch (err) {
    if (isLocal && /Failed to fetch|NetworkError|TypeError/i.test(String(err)) && /^(Love is Fear|Test1)$/.test(pwdInput.value.trim())){
      const title = pwdInput.value.trim();
      tryTriggerAlt();
      gateMsg.textContent = `Unlocked (DEV): ${title}`;
      gateMsg.style.color = 'var(--success)';
      const blob = new Blob([`DEV unlock: ${title}`], { type:'text/plain' });
      const url = URL.createObjectURL(blob);
      morphToDownloadButton(url, title, ()=> URL.revokeObjectURL(url));
      return;
    }

    gateMsg.textContent = 'Sorry, that password does not work.';
    gateMsg.style.color = 'var(--warning)';
    console.error(err);
  }
}

function morphToDownloadButton(url, title, onAfterClick){
  const btn = document.createElement('button');
  btn.textContent = `Download ${title}`;
  btn.setAttribute('type', 'button');
  btn.addEventListener('click', ()=>{
    try {
      const a = document.createElement('a');
      a.href = url;
      a.download = '';
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      window.open(url, '_blank', 'noopener');
    }
    if (onAfterClick) onAfterClick();
  });

  gate.innerHTML = '';
  gate.appendChild(btn);
}

pwdInput?.addEventListener('keydown', (e)=>{
  if (e.key === 'Enter') checkPassword();
});

// ---------- Misc UI ----------
toggleAnimBtn?.addEventListener('click', ()=>{
  if (!activeAction) return;
  activeAction.paused = !activeAction.paused;
});
resetViewBtn?.addEventListener('click', ()=> controls.reset());

// ---------- Render loop & resize ----------
window.addEventListener('resize', ()=>{
  const w = window.innerWidth, h = window.innerHeight;
  camera.aspect = w/h;
  camera.updateProjectionMatrix();
  renderer.setSize(w,h);
});

(function loop(){
  requestAnimationFrame(loop);
  const dt = clock.getDelta();
  if (mixer) mixer.update(dt);
  controls.update();
  renderer.render(scene, camera);
})();
