import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const canvas = document.getElementById('webgl');
const overlay = document.getElementById('overlay');
const progressEl = document.getElementById('progress');
const toggleAnimBtn = document.getElementById('toggleAnim');
const resetViewBtn = document.getElementById('resetView');

const renderer = new THREE.WebGLRenderer({ canvas, antialias:true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 200);
camera.position.set(0,1.5,3);
scene.add(camera);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0,1.4,0);

const hemi = new THREE.HemisphereLight(0xffffff, 0x202030, 1.0);
scene.add(hemi);
const key = new THREE.DirectionalLight(0xffffff, 1.2);
key.position.set(3,6,5);
scene.add(key);

const ground = new THREE.Mesh(
  new THREE.CircleGeometry(6,64),
  new THREE.MeshStandardMaterial({ color:0x111111, metalness:0, roughness:1 })
);
ground.rotation.x = -Math.PI/2;
scene.add(ground);

let mixer, activeAction, allActions=[], clock = new THREE.Clock();

const manager = new THREE.LoadingManager();
manager.onProgress = (url, loaded, total) => {
  const pct = Math.round((loaded/total)*100);
  progressEl.textContent = pct + '%';
  document.querySelector('.loader .bar').style.width = pct + '%';
};
manager.onLoad = () => setTimeout(()=> overlay.classList.add('hide'), 200);

const loader = new GLTFLoader(manager);
const MODEL_URL = 'assets/metahuman.glb';

loader.load(MODEL_URL,
  (gltf)=>{
    const root = gltf.scene;
    root.traverse(o=>{ if (o.isMesh) o.frustumCulled=false; });
    scene.add(root);
    frame(root);
    if (gltf.animations && gltf.animations.length){
      mixer = new THREE.AnimationMixer(root);
      gltf.animations.forEach(clip=>{
        const action = mixer.clipAction(clip); allActions.push({name:clip.name, action});
      });
      const idle = allActions.find(a=>/idle|breath|loop/i.test(a.name)) || allActions[0];
      activeAction = idle.action; activeAction.reset().fadeIn(0.25).play();
    }
    window.addEventListener('pointerdown', tryTriggerAlt);
  },
  (xhr)=>{
    if (xhr.lengthComputable){
      const pct = Math.round((xhr.loaded/xhr.total)*100);
      progressEl.textContent = pct + '%';
      document.querySelector('.loader .bar').style.width = pct + '%';
    }
  },
  (err)=>{
    progressEl.textContent = 'Error loading model';
    console.error(err);
  }
);

function frame(obj){
  const box = new THREE.Box3().setFromObject(obj);
  const size = new THREE.Vector3(); box.getSize(size);
  const center = new THREE.Vector3(); box.getCenter(center);
  controls.target.copy(center);
  const maxDim = Math.max(size.x, size.y, size.z);
  const dist = maxDim * 1.2 / Math.tan(THREE.MathUtils.degToRad(camera.fov*0.5));
  camera.position.copy(center).add(new THREE.Vector3(0,0.2,1).normalize().multiplyScalar(dist));
  camera.near = Math.max(0.01, dist/100); camera.far = dist*10 + maxDim; camera.updateProjectionMatrix();
}

function tryTriggerAlt(){
  if (!allActions.length) return;
  const alt = allActions.find(a=>/wave|salute|hello|gesture/i.test(a.name));
  if (!alt || activeAction===alt.action) return;
  activeAction.fadeOut(0.15);
  alt.action.reset().fadeIn(0.15).play();
  activeAction = alt.action;
  const dur = alt.action._clip?.duration || 1;
  setTimeout(()=>{
    const idle = allActions.find(a=>/idle|breath|loop/i.test(a.name)) || allActions[0];
    if (idle && activeAction!==idle.action){ alt.action.fadeOut(0.2); idle.action.reset().fadeIn(0.2).play(); activeAction=idle.action; }
  }, dur*1000-50);
}

// Gate UI logic
const gate = document.getElementById('gate');
const gateForm = document.getElementById('gateForm');
const gateInput = document.getElementById('gateInput');
const gateMsg = document.getElementById('gateMsg');

gateForm.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const password = gateInput.value.trim();
  if (!password) return;
  gateMsg.textContent = 'Checking…';

  const isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

  try {
      const res = await fetch('/.netlify/functions/redeem', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ password })
    });
    if (!res.ok) throw new Error('Invalid');
    const { url, title } = await res.json();
    tryTriggerAlt();                     // success anim
    gateMsg.textContent = `Unlocked: ${title}`;
    const a = document.createElement('a'); a.href = url; a.download = '';
    document.body.appendChild(a); a.click(); a.remove();
  } catch (err) {
    // DEV-only fallback when no backend is running
    if (isLocal && /^(Love is Fear|Test1)$/.test(password)) {
      tryTriggerAlt();
      gateMsg.textContent = `Unlocked (DEV): ${password}`;
      const blob = new Blob([`DEV unlock: ${password}`], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `${password}.txt`;
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
      return;
    }
    gateMsg.textContent = 'Sorry, that password doesn’t work.';
  }
});



window.addEventListener('resize', ()=>{
  const w = window.innerWidth, h = window.innerHeight;
  camera.aspect = w/h; camera.updateProjectionMatrix();
  renderer.setSize(w,h);
});

toggleAnimBtn.addEventListener('click', ()=>{
  if (!activeAction) return;
  activeAction.paused = !activeAction.paused;
});
resetViewBtn.addEventListener('click', ()=> controls.reset() );

(function loop(){
  requestAnimationFrame(loop);
  const dt = clock.getDelta();
  if (mixer) mixer.update(dt);
  controls.update();
  renderer.render(scene, camera);
})();
