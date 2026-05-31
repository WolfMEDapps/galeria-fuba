// ============================================================
//  main.js — Galería FPS · Three.js r182
//  Fixes: escala 1:1, near=0.1/far=400, sRGB textura, colisiones reales
// ============================================================

import * as THREE from 'three';
import { GLTFLoader }     from 'three/addons/loaders/GLTFLoader.js';
import { EXRLoader }      from 'three/addons/loaders/EXRLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass }     from 'three/addons/postprocessing/RenderPass.js';
import { SSAOPass }       from 'three/addons/postprocessing/SSAOPass.js';
import { OutputPass }     from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass }      from 'three/addons/postprocessing/ShaderPass.js';
import { HorizontalBlurShader } from 'three/addons/shaders/HorizontalBlurShader.js';
import { VerticalBlurShader }   from 'three/addons/shaders/VerticalBlurShader.js';

// ================================================================
//  UI_CONFIG — Configuración visual completa de la interfaz
//  Modifica aquí para cambiar el look de la ventana y el panel.
// ================================================================
const UI_CONFIG = {

  // ── VENTANA / CANVAS ─────────────────────────────────────────
  BODY_BG:                '#000000',      // Color de fondo de la página

  // ── CROSSHAIR ────────────────────────────────────────────────
  CROSSHAIR_SIZE:         '16px',         // Ancho y alto del cuadro del crosshair
  CROSSHAIR_COLOR:        'rgba(82,67,67,0.8)', // Color de las líneas
  CROSSHAIR_THICKNESS:    '1.5px',        // Grosor de las líneas
  CROSSHAIR_BORDER_RADIUS:'1px',          // Radio de las puntas

  // ── TIPOGRAFÍA ───────────────────────────────────────────────
  // Nombre del archivo de fuente en assets/fuentes/ (.ttf o .otf)
  // Si el archivo no existe, se usa la fuente de respaldo.
  FUENTE_ARCHIVO:         '',             // Ej: 'MiFuente.otf' — dejar vacío para usar respaldo
  FUENTE_NOMBRE:          'PanelFont',    // Nombre interno que se le asigna a la fuente cargada
  FUENTE_RESPALDO:        '"Courier New", monospace', // Fuente si FUENTE_ARCHIVO no carga

  // ── PANEL — CONTENEDOR ───────────────────────────────────────
  PANEL_ANCHO:            '280px',        // Ancho del panel abierto
  PANEL_BG:               'rgba(0,0,0,0.88)', // Fondo del panel
  PANEL_COLOR_TEXTO:      '#e0e0e0',      // Color del texto general
  PANEL_BORDE_COLOR:      'rgba(255,255,255,0.12)', // Color del borde izquierdo
  PANEL_BORDE_GROSOR:     '1px',          // Grosor del borde izquierdo
  PANEL_PADDING:          '12px',         // Padding interno del panel
  PANEL_FONT_SIZE:        '11px',         // Tamaño de fuente del panel
  PANEL_TRANSITION:       '0.25s ease',   // Velocidad de animación apertura/cierre

  // ── PANEL — TOGGLE LATERAL ───────────────────────────────────
  TOGGLE_ANCHO:           '18px',         // Ancho del botón lateral
  TOGGLE_BG:              'rgba(0,0,0,0.72)', // Fondo del botón lateral
  TOGGLE_COLOR:           '#888888',      // Color del texto del botón lateral
  TOGGLE_BORDE_COLOR:     'rgba(255,255,255,0.10)', // Borde del toggle
  TOGGLE_FONT_SIZE:       '11px',         // Tamaño de fuente del toggle
  TOGGLE_LETRA_ESPACIADO: '2px',          // Espaciado entre letras del toggle
  TOGGLE_OPACIDAD:        '0.7',          // Opacidad normal del toggle
  TOGGLE_OPACIDAD_HOVER:  '1',            // Opacidad al pasar el mouse

  // ── PANEL — ACENTO (color principal interactivo) ─────────────
  ACENTO:                 '#bfbfbf',      // Color de acento principal (sliders, headers, activos)
  ACENTO_INACTIVO:        '#555',         // Color de elementos inactivos
  ACENTO_TEXTO_LABEL:     '#aaa',         // Color de las etiquetas de sliders

  // ── PANEL — SECCIONES COLAPSABLES ───────────────────────────
  SEC_MARGIN_TOP:         '8px',          // Separación entre secciones
  SEC_HEADER_BG:          'rgba(107, 97, 66, 0.27)',  // Fondo del header de sección
  SEC_HEADER_BORDE:       'rgba(119, 122, 110, 0.2)',  // Borde del header de sección
  SEC_HEADER_BORDE_RADIO: '3px',          // Radio del borde del header
  SEC_HEADER_PADDING:     '6px 8px',      // Padding del header
  SEC_HEADER_FONT_SIZE:   '11px',         // Tamaño de fuente del header
  SEC_HEADER_FONT_WEIGHT: 'bold',         // Peso de fuente del header
  SEC_HEADER_LETRA_ESP:   '0.5px',        // Espaciado entre letras del header
  SEC_BODY_PADDING:       '8px 2px 4px 2px', // Padding del contenido de la sección

  // ── PANEL — SLIDERS ──────────────────────────────────────────
  SLIDER_MARGIN_BOTTOM:   '9px',          // Espacio entre sliders
  SLIDER_LABEL_MARGIN:    '2px',          // Margen bajo la etiqueta del slider
  SLIDER_VALOR_MIN_ANCHO: '46px',         // Ancho mínimo del valor numérico

  // ── PANEL — COLOR PICKERS ────────────────────────────────────
  COLORPICKER_ANCHO:      '60px',         // Ancho del input color
  COLORPICKER_ALTO:       '22px',         // Alto del input color
  COLORPICKER_BORDE:      '1px solid #333', // Borde del input color
  COLORPICKER_MARGIN:     '8px',          // Margen inferior del color row

  // ── PANEL — BOTONES TOGGLE ───────────────────────────────────
  TOGBTN_FONT_SIZE:       '10px',         // Tamaño de fuente del toggle button
  TOGBTN_PADDING:         '2px 8px',      // Padding del toggle button
  TOGBTN_MARGIN_BOTTOM:   '8px',          // Margen inferior del toggle button
  TOGBTN_MARGIN_RIGHT:    '4px',          // Margen derecho (entre botones)
  TOGBTN_BG_ACTIVO:       'rgba(107,97,66,0.12)', // Fondo del toggle activo

  // ── PANEL — BOTONES DE ARCHIVO ───────────────────────────────
  BTN_ARCHIVO_PADDING:    '7px',          // Padding de botones de carga/guardado
  BTN_ARCHIVO_MARGIN:     '6px',          // Margen inferior entre botones
  BTN_ARCHIVO_FONT_SIZE:  '11px',         // Tamaño de fuente de botones de archivo

};

// ── Aplicar estilos de ventana ───────────────────────────────
document.body.style.background = UI_CONFIG.BODY_BG;

// ── Aplicar estilos del crosshair vía CSS dinámico ───────────
(()=>{
  const s = document.createElement('style');
  const sz   = UI_CONFIG.CROSSHAIR_SIZE;
  const half = `calc(${sz} / 2 - ${UI_CONFIG.CROSSHAIR_THICKNESS} / 2)`;
  s.textContent = `
    #crosshair {
      width: ${sz}; height: ${sz};
    }
    #crosshair::before, #crosshair::after {
      background: ${UI_CONFIG.CROSSHAIR_COLOR};
      border-radius: ${UI_CONFIG.CROSSHAIR_BORDER_RADIUS};
    }
    #crosshair::before {
      width: ${UI_CONFIG.CROSSHAIR_THICKNESS};
      height: ${sz};
      top: 0;
      left: ${half};
    }
    #crosshair::after {
      width: ${sz};
      height: ${UI_CONFIG.CROSSHAIR_THICKNESS};
      top: ${half};
      left: 0;
    }
  `;
  document.head.appendChild(s);
})();

// ── Sistema de fuentes tipográficas ──────────────────────────
// Carga la fuente desde assets/fuentes/ si FUENTE_ARCHIVO está definido.
// Si falla o está vacío, usa FUENTE_RESPALDO sin romper nada.
let _fontFamily = UI_CONFIG.FUENTE_RESPALDO;
if (UI_CONFIG.FUENTE_ARCHIVO) {
  const _ff = new FontFace(
    UI_CONFIG.FUENTE_NOMBRE,
    `url('./assets/fuentes/${UI_CONFIG.FUENTE_ARCHIVO}')`
  );
  _ff.load()
    .then(font => {
      document.fonts.add(font);
      _fontFamily = `'${UI_CONFIG.FUENTE_NOMBRE}', ${UI_CONFIG.FUENTE_RESPALDO}`;
      // Aplicar al panel si ya existe
      if (typeof panel !== 'undefined') panel.style.fontFamily = _fontFamily;
    })
    .catch(() => {
      // Fuente no encontrada — se mantiene FUENTE_RESPALDO silenciosamente
    });
}


const canvas   = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(2.0);
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled   = false;
renderer.shadowMap.type      = THREE.PCFSoftShadowMap;
renderer.outputColorSpace    = THREE.SRGBColorSpace;
renderer.toneMapping         = 1;
renderer.toneMappingExposure = 2.250;

// ─── Scene ───────────────────────────────────────────────────
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x1a1a1a, 100, 240);

// ─── Cámara ──────────────────────────────────────────────────
// Modelo: 200×200×17 unidades Blender  (1u ≈ 1m)
// near=0.1 → sin z-fighting en paredes cercanas
// far=400  → cubre toda la galería
const camera = new THREE.PerspectiveCamera(72, innerWidth / innerHeight, 0.1, 400);

// ─── Jerarquía del Player ────────────────────────────────────
const playerBody = new THREE.Object3D();
const yawObj     = new THREE.Object3D();
const pitchObj   = new THREE.Object3D();
scene.add(playerBody);
playerBody.add(yawObj);
yawObj.add(pitchObj);
pitchObj.add(camera);
// Ojos a 1.65 u sobre el suelo
camera.position.set(0, 0, 0);

const SPHERE_R = 0.4;  // radio colisionador en unidades del modelo

// Spawn
let FLOOR_Y = 7.1;
playerBody.position.set(-10.967925668409944, FLOOR_Y, 79.87830335556019);

// ─── SISTEMA DE FONDOS 360 ───────────────────────────────────
// Soporta .exr, .jpg y .png desde assets/fondo/
// El manifiesto fondo.json lista los archivos disponibles.
let _hdriTexture   = null; // envMap activo para vidrios
let _fondoActivo   = null; // nombre del fondo activo
let _fondoLista    = [];   // archivos leídos del JSON
const _textureLoader = new THREE.TextureLoader();

function _cargarFondo(nombre) {
  const ruta = './assets/fondo/' + nombre;
  const ext  = nombre.split('.').pop().toLowerCase();

  const onLoad = (texture) => {
    texture.mapping  = THREE.EquirectangularReflectionMapping;
    // Disponer textura anterior si existe
    if (_hdriTexture && _hdriTexture !== texture) {
      _hdriTexture.dispose();
    }
    scene.background = texture;
    _hdriTexture     = texture;
    _fondoActivo     = nombre;
    glassScene && _applyGlassEnvMap();
    _refreshFondoBtns();
  };

  if (ext === 'exr') {
    const exrLoader = new EXRLoader();
    exrLoader.load(ruta, onLoad);
  } else {
    _textureLoader.load(ruta, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      onLoad(texture);
    });
  }
}

// Cargar manifiesto y primer fondo al iniciar
fetch('./assets/fondo/fondo.json')
  .then(r => r.json())
  .then(lista => {
    _fondoLista = lista;
    if (lista.length > 0) _cargarFondo(lista[0]);
    // Si el panel ya está construido, agregar la sección fondo
    if (typeof _buildFondoPanel === 'function') _buildFondoPanel();
  })
  .catch(() => {
    // Sin fondo.json — intentar carga directa del EXR original como fallback
    const exrFallback = new EXRLoader();
    exrFallback.load('./assets/Campo.exr', (texture) => {
      texture.mapping  = THREE.EquirectangularReflectionMapping;
      scene.background = texture;
      _hdriTexture     = texture;
      glassScene && _applyGlassEnvMap();
    });
  });

// ─── Post-processing: SSAO alta calidad ──────────────────────
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const ssaoPass = new SSAOPass(scene, camera, innerWidth, innerHeight);
ssaoPass.kernelRadius = 4.40;
ssaoPass.kernelSize   = 64;
ssaoPass.minDistance  = 0.0027;
ssaoPass.maxDistance  = 0.0299;
ssaoPass.normalMaterial.side = THREE.DoubleSide;
composer.addPass(ssaoPass);

// ─── Edge Blur — suavizado de bordes vinculado a _renderScale ────────────
// HorizontalBlurShader + VerticalBlurShader aplicados en dos passes.
// El uniform 'h' (horizontal) y 'v' (vertical) es 1/ancho y 1/alto del
// buffer de render. A menor escala el buffer es más pequeño → el blur
// es proporcionalmente mayor, compensando el pixelado automáticamente.
const hBlurPass = new ShaderPass(HorizontalBlurShader);
const vBlurPass = new ShaderPass(VerticalBlurShader);
// Valores iniciales para _renderScale = 2.0
const _edgeBlurStrength = { value: 0.3 }; // multiplicador manual desde panel
const _controls = {}; // referencias DOM de controles del panel para sincronización
hBlurPass.uniforms['h'].value = (1 / (innerWidth  * 2.0)) * _edgeBlurStrength.value;
vBlurPass.uniforms['v'].value = (1 / (innerHeight * 2.0)) * _edgeBlurStrength.value;
hBlurPass.enabled = true;
vBlurPass.enabled = true;
composer.addPass(hBlurPass);
composer.addPass(vBlurPass);
composer.addPass(new OutputPass());

// ─── Partículas de polvo flotante ────────────────────────────
// 800 partículas distribuidas por el interior del modelo (180×14×180u)
// Cada partícula tiene velocidad y drift aleatorios independientes.
const DUST_COUNT  = 1500;
const DUST_SPREAD = { x: 180, y: 14, z: 180 }; // área de distribución
const DUST_FLOOR  = 0.5;   // altura mínima sobre el suelo

// Posiciones iniciales aleatorias
const dustPositions = new Float32Array(DUST_COUNT * 3);
const dustVelocities = new Float32Array(DUST_COUNT * 3); // drift por partícula

for (let i = 0; i < DUST_COUNT; i++) {
  dustPositions[i * 3    ] = (Math.random() - 0.5) * DUST_SPREAD.x;
  dustPositions[i * 3 + 1] = DUST_FLOOR + Math.random() * DUST_SPREAD.y;
  dustPositions[i * 3 + 2] = (Math.random() - 0.5) * DUST_SPREAD.z;

  // Velocidad muy lenta y aleatoria — deriva suave en 3 ejes
  dustVelocities[i * 3    ] = (Math.random() - 0.5) * 0.1;
  dustVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
  dustVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
}

const dustGeo = new THREE.BufferGeometry();
dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));

// Textura circular para partículas — canvas 32×32 con gradiente radial
const _dustCanvas = document.createElement('canvas');
_dustCanvas.width = _dustCanvas.height = 32;
const _dustCtx = _dustCanvas.getContext('2d');
const _dustGrad = _dustCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
_dustGrad.addColorStop(0,   'rgba(255,255,255,1)');
_dustGrad.addColorStop(0.5, 'rgba(255,255,255,0.8)');
_dustGrad.addColorStop(1,   'rgba(255,255,255,0)');
_dustCtx.fillStyle = _dustGrad;
_dustCtx.fillRect(0, 0, 32, 32);
const _dustAlphaMap = new THREE.CanvasTexture(_dustCanvas);

const dustMat = new THREE.PointsMaterial({
  color:           0x000000,
  size:            0.080,
  transparent:     true,
  opacity:         0.449,
  depthWrite:      false,
  sizeAttenuation: true,
  alphaMap:        _dustAlphaMap,
  alphaTest:       0.01,
});

const dustSystem = new THREE.Points(dustGeo, dustMat);
scene.add(dustSystem);

// ─── Colisiones contra malla real del GLB ────────────────────
const collisionMeshes = [];
const _rc  = new THREE.Raycaster();
_rc.firstHitOnly = true;

// 16 direcciones solo en el plano horizontal (YXZ) — el suelo lo maneja FLOOR_Y
const _HDIRS = (() => {
  const d = [];
  const N = 16;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    d.push(new THREE.Vector3(Math.cos(a), 0, Math.sin(a)));
  }
  return d;
})();

// 6 direcciones cardinales para detectar techo/rampas
const _VDIRS = [
  new THREE.Vector3( 0,  1, 0),
  new THREE.Vector3( 0, -1, 0),
];

const _fn = new THREE.Vector3();

function resolveCollisions() {
  const pos = playerBody.position;

  // Suelo y límites
  if (pos.y < FLOOR_Y) { pos.y = FLOOR_Y; velY = 0; }
  if (pos.x < -105) pos.x = -105; if (pos.x > 105) pos.x = 105;
  if (pos.z < -105) pos.z = -105; if (pos.z > 105) pos.z = 105;

  if (collisionMeshes.length === 0) return;

  // Horizontal: empujar fuera de paredes
  for (const dir of _HDIRS) {
    _rc.set(pos, dir);
    _rc.near = 0;
    _rc.far  = SPHERE_R;
    const hits = _rc.intersectObjects(collisionMeshes, false);
    if (!hits.length || !hits[0].face) continue;
    const pen = SPHERE_R - hits[0].distance;
    if (pen <= 0) continue;
    _fn.copy(hits[0].face.normal)
       .transformDirection(hits[0].object.matrixWorld)
       .normalize();
    _fn.y = 0; // solo empuje horizontal
    if (_fn.lengthSq() < 0.001) continue;
    _fn.normalize();
    pos.addScaledVector(_fn, pen + 0.001);
  }

  // Re-suelo
  if (pos.y < FLOOR_Y) { pos.y = FLOOR_Y; velY = 0; }
}


// ─── GLTFLoader ──────────────────────────────────────────────
const loader   = new GLTFLoader();
const barFill  = document.getElementById('bar-fill');
const barLabel = document.getElementById('bar-label');
const startBtn = document.getElementById('start-btn');
const overlay  = document.getElementById('overlay');
const overlayDesc = document.getElementById('overlay-desc');

// Al presionar el botón → ocultar overlay y activar el juego
startBtn.addEventListener('click', () => {
  overlay.classList.add('fade-out');
  setTimeout(() => { overlay.style.display = 'none'; }, 620);
  canvas.requestPointerLock();
});

loader.load(
  './assets/GALERIA.glb',
  (gltf) => {
    const model = gltf.scene;
    model.traverse(obj => {
      if (!obj.isMesh) return;
      const old = obj.material;
      if (!old) return;
      const mat = new THREE.MeshLambertMaterial({
        map:  old.map,
        side: THREE.DoubleSide,
      });
      // Fix: caras traseras no deben recibir iluminación completa.
      // Invertimos la normal en el shader para caras traseras → iluminación correcta.
      mat.onBeforeCompile = (shader) => {
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <normal_fragment_begin>',
          `#include <normal_fragment_begin>
          if ( gl_FrontFacing == false ) normal = -normal;`
        );
      };
      if (mat.map) {
        mat.map.colorSpace = THREE.SRGBColorSpace;
        mat.map.needsUpdate = true;
      }
      mat.polygonOffset       = true;
      mat.polygonOffsetFactor = 1;
      mat.polygonOffsetUnits  = 1;
      obj.material = mat;
      sceneMaterials.push(mat);
      sceneMeshes.push(obj);
      // Registrar para colisiones contra malla real
      obj.geometry.computeBoundingBox();
      collisionMeshes.push(obj);
    });
    scene.add(model);
    // Carga completada — mostrar botón y texto de contexto
    barFill.style.width  = '100%';
    barLabel.textContent = 'Listo';
    if (overlayDesc) overlayDesc.style.display = 'block';
    startBtn.style.display = 'block';
  },
  (xhr) => {
    if (!xhr.total) return;
    const pct = xhr.loaded / xhr.total * 100;
    barFill.style.width  = pct + '%';
    barLabel.textContent = `cargando... ${pct.toFixed(0)}%`;
  },
  (err) => {
    console.error('[GLTFLoader]', err);
    barLabel.textContent   = '⚠ No se encontró assets/GALERIA.glb';
    startBtn.textContent   = '⚠ Error de carga';
    startBtn.style.display = 'block';
    startBtn.disabled      = true;
  }
);

// ─── Input ───────────────────────────────────────────────────
const keys = {};
document.addEventListener('keydown', e => {
  keys[e.code] = true;
  if (e.code === 'KeyR' && isLocked) {
    playerBody.position.set(_spawnX, FLOOR_Y, _spawnZ); velY = 0; yaw = _spawnYaw;
  }
});
document.addEventListener('keyup', e => { keys[e.code] = false; });

let yaw = -6.305199999999978, pitch = 0;
document.addEventListener('mousemove', e => {
  if (!isLocked) return;
  yaw   -= e.movementX * 0.0022;
  pitch -= e.movementY * 0.0022;
  pitch  = Math.max(-Math.PI / 2.1, Math.min(Math.PI / 2.1, pitch));
});

// ─── Pointer Lock ────────────────────────────────────────────
let isLocked = false;
canvas.addEventListener('click', () => canvas.requestPointerLock());
document.addEventListener('pointerlockchange', () => {
  isLocked = document.pointerLockElement === canvas;
});

// ─── Física ──────────────────────────────────────────────────
const SPEED   = 10.0;  // más rápido para galería grande (200u)
const GRAVITY = -18;
let   velY    = 0;
const moveDir = new THREE.Vector3();
const euler   = new THREE.Euler(0, 0, 0, 'YXZ');

// ─── HUD ─────────────────────────────────────────────────────
// (sin elementos HUD — pantalla limpia)

// ─── Loop ────────────────────────────────────────────────────
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);

  yawObj.rotation.y   = yaw;
  pitchObj.rotation.x = pitch;

  if (isLocked) {
    moveDir.set(0, 0, 0);
    if (keys['KeyW'] || keys['ArrowUp'])    moveDir.z -= 1;
    if (keys['KeyS'] || keys['ArrowDown'])  moveDir.z += 1;
    if (keys['KeyA'] || keys['ArrowLeft'])  moveDir.x -= 1;
    if (keys['KeyD'] || keys['ArrowRight']) moveDir.x += 1;
    moveDir.normalize();
    euler.set(0, yaw, 0);
    moveDir.applyEuler(euler);
    playerBody.position.addScaledVector(moveDir, SPEED * dt);
    velY += GRAVITY * dt;
    playerBody.position.y += velY * dt;
    resolveCollisions();
  }

  // ── Animar partículas de polvo ────────────────────────────
  const pos = dustGeo.attributes.position.array;
  for (let i = 0; i < DUST_COUNT; i++) {
    const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;
    pos[ix] += dustVelocities[ix] * dt;
    pos[iy] += dustVelocities[iy] * dt;
    pos[iz] += dustVelocities[iz] * dt;

    // Si la partícula sale del área, reaparece en el lado opuesto
    const hx = DUST_SPREAD.x / 2, hz = DUST_SPREAD.z / 2;
    if (pos[ix] >  hx) pos[ix] = -hx;
    if (pos[ix] < -hx) pos[ix] =  hx;
    if (pos[iz] >  hz) pos[iz] = -hz;
    if (pos[iz] < -hz) pos[iz] =  hz;
    // Rebotar verticalmente entre suelo y techo
    if (pos[iy] > DUST_FLOOR + DUST_SPREAD.y || pos[iy] < DUST_FLOOR) {
      dustVelocities[iy] *= -1;
    }
  }
  dustGeo.attributes.position.needsUpdate = true;

  composer.render();
}
animate();

// ─── Resize ──────────────────────────────────────────────────
// Nota: este listener respeta el _renderScale activo.
window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  composer.setSize(innerWidth * _renderScale, innerHeight * _renderScale);
  ssaoPass.setSize(innerWidth * _renderScale, innerHeight * _renderScale);
  hBlurPass.uniforms['h'].value = (1 / (innerWidth  * _renderScale)) * _edgeBlurStrength.value;
  vBlurPass.uniforms['v'].value = (1 / (innerHeight * _renderScale)) * _edgeBlurStrength.value;
});

const sceneMaterials = [];
const sceneMeshes    = [];

// ─── Luces ───────────────────────────────────────────────────
let _shadowMapSize = 2048; // valor global para guardar/restaurar
const sceneLights = [];
let _lucesGltfScene = null; // referencia al gltf.scene de luces activo

function _loadLucesGLB(url, onDone){
  const loader2 = new GLTFLoader();
  loader2.load(url, (gltf)=>{
    if(_lucesGltfScene) scene.remove(_lucesGltfScene);
    sceneLights.length = 0;
    _lucesGltfScene = gltf.scene;
    let idx = 0;
    gltf.scene.traverse(obj => {
      if (!obj.isLight) return;
      // Nombre directo del GLB
      const nodeName = obj.name || obj.userData?.name || `Luz_${idx+1}`;
      // Valores por defecto fijos
      obj.intensity  = 90.0;
      obj.distance   = 100.0;
      obj.castShadow = false;
      obj.color.set('#c3c2bc');   // ← agrega esta línea con el color que quieras
      sceneLights.push({ name: nodeName, light: obj });
      idx++;
    });
    scene.add(gltf.scene);
    if(onDone) onDone();
  }, null, (err)=>console.error('[LucesLoader]', err));
}

// Carga inicial
_loadLucesGLB('./assets/LUCES.glb', ()=>{ buildLightsPanel(); });

// Carga automática de VIDRIOS.glb si existe
fetch('./assets/VIDRIOS.glb', { method: 'HEAD' })
  .then(r => { if(r.ok) _loadGlassGLB('./assets/VIDRIOS.glb', ()=>{ _buildGlassPanel(); }); })
  .catch(() => {});

// ─── SISTEMA DE VIDEOS — variables y carga inicial ──────────
let _videoScene       = null;   // gltf.scene de VIDEOS.glb activo
let _videoElements    = [];     // [{mesh, video, texture}]
let _videoGLBBuffer   = null;   // ArrayBuffer para embeber en .galeria
let _videoManifest    = [];     // lista de archivos desde videos.json
let _galleryEntered   = false;  // true después de "Iniciar recorrido"

// Manifiesto — se resuelve antes de procesar mallas
const _videoManifestPromise = fetch('./assets/video/videos.json')
  .then(r => r.json())
  .then(lista => { _videoManifest = lista; return lista; })
  .catch(() => { _videoManifest = []; return []; });

// Carga automática de VIDEOS.glb si existe
fetch('./assets/VIDEOS.glb', { method: 'HEAD' })
  .then(r => { if(r.ok){
    fetch('./assets/VIDEOS.glb').then(r2=>r2.arrayBuffer()).then(buf=>{ _videoGLBBuffer=buf; });
    _loadVideosGLB('./assets/VIDEOS.glb');
  }})
  .catch(() => {});

// Iniciar videos cuando el usuario entre a la galería
startBtn.addEventListener('click', () => {
  _galleryEntered = true;
  _startVideos();
});

// ─── SISTEMA DE OBJETOS — variables y carga inicial ─────────
let _objetosScene     = null;   // gltf.scene de OBJETOS.glb activo
let _objetosMeshes    = [];     // mallas cargadas (para limpieza)
let _objetosMaterials = [];     // materiales (para sincronizar con escena)
let _objetosGLBBuffer = null;   // ArrayBuffer para embeber en .galeria

// Carga automática de OBJETOS.glb si existe
fetch('./assets/OBJETOS.glb', { method: 'HEAD' })
  .then(r => { if(r.ok){
    fetch('./assets/OBJETOS.glb').then(r2=>r2.arrayBuffer()).then(buf=>{ _objetosGLBBuffer=buf; });
    _loadObjetosGLB('./assets/OBJETOS.glb');
  }})
  .catch(() => {});

// ─── PANEL ───────────────────────────────────────────────────
const panelWrap = document.createElement('div');
panelWrap.style.cssText = `position:fixed;top:0;right:0;height:100vh;display:flex;align-items:stretch;z-index:9999;pointer-events:none;`;
document.body.appendChild(panelWrap);

// Botón toggle lateral
const panelToggle = document.createElement('div');
panelToggle.style.cssText = `pointer-events:all;cursor:pointer;width:${UI_CONFIG.TOGGLE_ANCHO};display:flex;align-items:center;justify-content:center;background:${UI_CONFIG.TOGGLE_BG};border-left:${UI_CONFIG.PANEL_BORDE_GROSOR} solid ${UI_CONFIG.TOGGLE_BORDE_COLOR};border-right:none;color:${UI_CONFIG.TOGGLE_COLOR};font-size:${UI_CONFIG.TOGGLE_FONT_SIZE};user-select:none;writing-mode:vertical-rl;letter-spacing:${UI_CONFIG.TOGGLE_LETRA_ESPACIADO};opacity:${UI_CONFIG.TOGGLE_OPACIDAD};transition:opacity 0.2s;`;
panelToggle.textContent = '▶ AJUSTES';
panelToggle.addEventListener('mouseenter',()=>panelToggle.style.opacity=UI_CONFIG.TOGGLE_OPACIDAD_HOVER);
panelToggle.addEventListener('mouseleave',()=>panelToggle.style.opacity=UI_CONFIG.TOGGLE_OPACIDAD);
panelWrap.appendChild(panelToggle);

const panel = document.createElement('div');
panel.style.cssText = `pointer-events:all;width:${UI_CONFIG.PANEL_ANCHO};height:100vh;overflow-y:auto;background:${UI_CONFIG.PANEL_BG};color:${UI_CONFIG.PANEL_COLOR_TEXTO};font-family:${_fontFamily};font-size:${UI_CONFIG.PANEL_FONT_SIZE};padding:${UI_CONFIG.PANEL_PADDING};border-left:${UI_CONFIG.PANEL_BORDE_GROSOR} solid ${UI_CONFIG.PANEL_BORDE_COLOR};transition:width ${UI_CONFIG.PANEL_TRANSITION},opacity ${UI_CONFIG.PANEL_TRANSITION},padding ${UI_CONFIG.PANEL_TRANSITION};`;
panelWrap.appendChild(panel);

let _panelOpen = false;
function _setPanelOpen(open){
  _panelOpen = open;
  panel.style.width   = open ? UI_CONFIG.PANEL_ANCHO : '0';
  panel.style.opacity = open ? '1'                   : '0';
  panel.style.padding = open ? UI_CONFIG.PANEL_PADDING : '0';
  panel.style.overflow= open ? 'auto'                : 'hidden';
  panelToggle.textContent = open ? '▶ AJUSTES' : '◀ AJUSTES';
}
panelToggle.addEventListener('click', ()=> _setPanelOpen(!_panelOpen));
// Panel colapsado al iniciar
_setPanelOpen(false);

function slider(label,min,max,value,step,onChange,key){
  const wrap=document.createElement('div');wrap.style.cssText=`margin-bottom:${UI_CONFIG.SLIDER_MARGIN_BOTTOM};`;
  const val=document.createElement('span');val.textContent=Number(value).toFixed(3);val.style.cssText=`float:right;color:${UI_CONFIG.ACENTO};min-width:${UI_CONFIG.SLIDER_VALOR_MIN_ANCHO};text-align:right;`;
  const lbl=document.createElement('div');lbl.style.cssText=`margin-bottom:${UI_CONFIG.SLIDER_LABEL_MARGIN};color:${UI_CONFIG.ACENTO_TEXTO_LABEL};`;lbl.appendChild(document.createTextNode(label));lbl.appendChild(val);
  const inp=document.createElement('input');inp.type='range';inp.min=min;inp.max=max;inp.step=step;inp.value=value;inp.style.cssText=`width:100%;accent-color:${UI_CONFIG.ACENTO};`;
  inp.addEventListener('input',()=>{val.textContent=Number(inp.value).toFixed(3);onChange(parseFloat(inp.value));});
  if(key) _controls[key]={inp,val};
  wrap.appendChild(lbl);wrap.appendChild(inp);return wrap;
}
let _currentSecBody = null;
function sec(t){
  const wrap=document.createElement('div');wrap.style.cssText=`margin-top:${UI_CONFIG.SEC_MARGIN_TOP};`;
  const h=document.createElement('div');
  h.style.cssText=`display:flex;align-items:center;justify-content:space-between;padding:${UI_CONFIG.SEC_HEADER_PADDING};background:${UI_CONFIG.SEC_HEADER_BG};border:1px solid ${UI_CONFIG.SEC_HEADER_BORDE};border-radius:${UI_CONFIG.SEC_HEADER_BORDE_RADIO};cursor:pointer;user-select:none;`;
  const htxt=document.createElement('span');htxt.textContent=t;htxt.style.cssText=`color:${UI_CONFIG.ACENTO};font-weight:${UI_CONFIG.SEC_HEADER_FONT_WEIGHT};font-size:${UI_CONFIG.SEC_HEADER_FONT_SIZE};letter-spacing:${UI_CONFIG.SEC_HEADER_LETRA_ESP};`;
  const arr=document.createElement('span');arr.textContent='▾';arr.style.cssText=`color:${UI_CONFIG.ACENTO};font-size:'+UI_CONFIG.PANEL_FONT_SIZE+';display:inline-block;transition:transform 0.18s;`;
  h.appendChild(htxt);h.appendChild(arr);
  const body=document.createElement('div');body.style.cssText=`padding:${UI_CONFIG.SEC_BODY_PADDING};display:none;`;
  arr.style.transform='rotate(-90deg)';
  h.addEventListener('click',()=>{
    const open=body.style.display!=='none';
    body.style.display=open?'none':'block';
    arr.style.transform=open?'rotate(-90deg)':'';
  });
  wrap.appendChild(h);wrap.appendChild(body);
  wrap._secBody=body;
  return wrap;
}
// Override panel.appendChild para redirigir contenido al body del sec activo
const _origPanelAppend=panel.appendChild.bind(panel);
panel.appendChild=function(el){
  if(el&&el._secBody){ _currentSecBody=el._secBody; return _origPanelAppend(el); }
  if(_currentSecBody){ return _currentSecBody.appendChild(el); }
  return _origPanelAppend(el);
};
function colorRow(label,hex,onChange,key){
  const row=document.createElement('div');row.style.cssText=`display:flex;align-items:center;justify-content:space-between;margin-bottom:${UI_CONFIG.COLORPICKER_MARGIN};`;
  const l=document.createElement('span');l.textContent=label;l.style.color=UI_CONFIG.ACENTO_TEXTO_LABEL;
  const i=document.createElement('input');i.type='color';i.value=hex;i.style.cssText=`width:${UI_CONFIG.COLORPICKER_ANCHO};height:${UI_CONFIG.COLORPICKER_ALTO};border:${UI_CONFIG.COLORPICKER_BORDE};cursor:pointer;`;
  i.addEventListener('input',()=>onChange(i.value));
  if(key) _controls[key]={inp:i};
  row.appendChild(l);row.appendChild(i);return row;
}
function togBtn(labelOn,labelOff,initOn,onChange,key){
  const b=document.createElement('button');
  b.textContent=initOn?labelOn:labelOff;
  b.style.cssText=`font-size:${UI_CONFIG.TOGBTN_FONT_SIZE};padding:${UI_CONFIG.TOGBTN_PADDING};cursor:pointer;margin-bottom:${UI_CONFIG.TOGBTN_MARGIN_BOTTOM};margin-right:${UI_CONFIG.TOGBTN_MARGIN_RIGHT};font-family:${_fontFamily};border:1px solid;background:${UI_CONFIG.TOGBTN_BG_ACTIVO};`;
  b.style.color=initOn?UI_CONFIG.ACENTO:UI_CONFIG.ACENTO_INACTIVO;
  b.style.borderColor=initOn?UI_CONFIG.ACENTO:UI_CONFIG.ACENTO_INACTIVO;
  let on=initOn;
  b.addEventListener('click',()=>{on=!on;onChange(on);b.textContent=on?labelOn:labelOff;b.style.color=on?UI_CONFIG.ACENTO:UI_CONFIG.ACENTO_INACTIVO;b.style.borderColor=on?UI_CONFIG.ACENTO:UI_CONFIG.ACENTO_INACTIVO;});
  if(key) _controls[key]={setOn:(v)=>{if(on!==v){on=v;b.textContent=v?labelOn:labelOff;b.style.color=v?UI_CONFIG.ACENTO:UI_CONFIG.ACENTO_INACTIVO;b.style.borderColor=v?UI_CONFIG.ACENTO:UI_CONFIG.ACENTO_INACTIVO;}}};
  return b;
}

panel.appendChild(sec('RENDERER'));
panel.appendChild(slider('Exposición',0.1,4,2.250,0.01,v=>{renderer.toneMappingExposure=v;},'exposure'));
panel.appendChild(slider('ToneMapping',0,5,1,1,v=>{renderer.toneMapping=v;sceneMaterials.forEach(m=>{m.needsUpdate=true;});},'toneMapping'));

// ─── SECCIÓN FONDO ────────────────────────────────────────────
panel.appendChild(sec('FONDO 360'));

const _fondoBtnWrap = document.createElement('div');
_fondoBtnWrap.style.cssText = 'display:flex;flex-direction:column;gap:4px;';

function _refreshFondoBtns() {
  _fondoBtnWrap.querySelectorAll('button[data-fondo]').forEach(b => {
    const active = b.dataset.fondo === _fondoActivo;
    b.style.background  = active ? `rgba(107,97,66,0.25)` : `rgba(107,97,66,0.06)`;
    b.style.color       = active ? UI_CONFIG.ACENTO       : UI_CONFIG.ACENTO_INACTIVO;
    b.style.borderColor = active ? `rgba(174,175,160,0.50)` : `rgba(174,175,160,0.15)`;
    b.style.fontWeight  = active ? 'bold'                 : 'normal';
  });
}

function _buildFondoPanel() {
  _fondoBtnWrap.innerHTML = '';
  if (_fondoLista.length === 0) {
    const msg = document.createElement('div');
    msg.textContent = 'Sin archivos en assets/fondo/';
    msg.style.cssText = `color:${UI_CONFIG.ACENTO_INACTIVO};font-size:${UI_CONFIG.PANEL_FONT_SIZE};padding:4px 0;`;
    _fondoBtnWrap.appendChild(msg);
    return;
  }
  _fondoLista.forEach(nombre => {
    const b = document.createElement('button');
    b.textContent   = nombre;
    b.dataset.fondo = nombre;
    b.style.cssText = `width:100%;padding:5px 8px;text-align:left;font-family:${_fontFamily};font-size:${UI_CONFIG.PANEL_FONT_SIZE};cursor:pointer;border-radius:${UI_CONFIG.SEC_HEADER_BORDE_RADIO};border:1px solid;transition:background 0.12s,color 0.12s,border-color 0.12s;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;`;
    b.addEventListener('click', () => _cargarFondo(nombre));
    _fondoBtnWrap.appendChild(b);
  });
  _refreshFondoBtns();
}

// Botón para quitar el fondo
const btnSinFondo = document.createElement('button');
btnSinFondo.textContent = '○  Sin fondo';
btnSinFondo.style.cssText = `width:100%;padding:5px 8px;text-align:left;font-family:${_fontFamily};font-size:${UI_CONFIG.PANEL_FONT_SIZE};cursor:pointer;border-radius:${UI_CONFIG.SEC_HEADER_BORDE_RADIO};border:1px solid rgba(174,175,160,0.15);background:rgba(107,97,66,0.06);color:${UI_CONFIG.ACENTO_INACTIVO};margin-top:4px;`;
btnSinFondo.addEventListener('click', () => {
  if (_hdriTexture) { _hdriTexture.dispose(); _hdriTexture = null; }
  scene.background = null;
  _fondoActivo = null;
  _refreshFondoBtns();
  btnSinFondo.style.color       = UI_CONFIG.ACENTO;
  btnSinFondo.style.borderColor = 'rgba(174,175,160,0.50)';
  btnSinFondo.style.fontWeight  = 'bold';
  btnSinFondo.style.background  = 'rgba(107,97,66,0.25)';
});

if (_currentSecBody) {
  _currentSecBody.appendChild(_fondoBtnWrap);
  _currentSecBody.appendChild(btnSinFondo);
}

// Construir panel si la lista ya fue cargada
if (_fondoLista.length > 0) _buildFondoPanel();

panel.appendChild(sec('SOMBRAS'));
panel.appendChild(slider('Tamaño Mapa',256,4096,2048,256,v=>{
  _shadowMapSize=v;
  sceneLights.forEach(({light})=>{if(light.castShadow){light.shadow.mapSize.set(v,v);if(light.shadow.map){light.shadow.map.dispose();light.shadow.map=null;}}});
  renderer.shadowMap.needsUpdate=true;
},'shadowMapSize'));
panel.appendChild(slider('Opacidad',0,1,1,0.01,v=>{sceneLights.forEach(({light})=>{if(light.shadow)light.shadow.intensity=v;});},'shadowOpacity'));
panel.appendChild(sec('NIEBLA'));
panel.appendChild(slider('Near',0,300,100,1,v=>{scene.fog.near=v;},'fogNear'));
panel.appendChild(slider('Far',50,600,240,1,v=>{scene.fog.far=v;},'fogFar'));
panel.appendChild(colorRow('Color Niebla','#1a1a1a',v=>{scene.fog.color.set(v);},'fogColor'));
panel.appendChild(sec('EDGE BLUR'));
panel.appendChild(togBtn('● Blur ON','○ Blur OFF',true,on=>{
  hBlurPass.enabled=on; vBlurPass.enabled=on;
},'edgeBlurEnabled'));
panel.appendChild(slider('Intensidad',0,4,0.3,0.05,v=>{
  _edgeBlurStrength.value=v;
  hBlurPass.uniforms['h'].value=(1/(innerWidth *_renderScale))*v;
  vBlurPass.uniforms['v'].value=(1/(innerHeight*_renderScale))*v;
},'edgeBlurStrength'));
panel.appendChild(sec('SSAO'));
panel.appendChild(slider('Kernel Radius',0,30,4.40,0.01,v=>{ssaoPass.kernelRadius=v;},'ssaoKR'));
panel.appendChild(slider('Min Distance',0,0.05,0.0027,0.0001,v=>{ssaoPass.minDistance=v;},'ssaoMin'));
panel.appendChild(slider('Max Distance',0,0.2,0.0299,0.0001,v=>{ssaoPass.maxDistance=v;},'ssaoMax'));
panel.appendChild(colorRow('Color AO','#000000',v=>{if(ssaoPass.ssaoMaterial)ssaoPass.ssaoMaterial.uniforms['aoColor']&&(ssaoPass.ssaoMaterial.uniforms['aoColor'].value.set(v));},'ssaoAoColor'));
panel.appendChild(sec('POLVO'));
panel.appendChild(slider('Tamaño',0,0.5,0.1230,0.001,v=>{dustMat.size=v;dustMat.needsUpdate=true;},'dustSize'));
panel.appendChild(slider('Opacidad',0,1,0.5510,0.001,v=>{dustMat.opacity=v;},'dustOpacity'));
panel.appendChild(colorRow('Color Polvo','#000000',v=>{dustMat.color.set(v);dustMat.needsUpdate=true;},'dustColor'));
// ─── Variables de spawn guardado ─────────────────────────────
let _spawnX = -10.967925668409944, _spawnZ = 79.87830335556019, _spawnYaw = -6.305199999999978;

panel.appendChild(sec('PLAYER'));
panel.appendChild(slider('Altura',0.5,16,7.1,0.1,v=>{
  FLOOR_Y=v;
  // Si el jugador está por debajo del nuevo suelo, lo subimos suavemente.
  // No forzamos la Y directamente para no romper las colisiones laterales.
  if(playerBody.position.y < FLOOR_Y) { playerBody.position.y = FLOOR_Y; velY = 0; }
},'floorY'));

// Display de posición y dirección en tiempo real
const posDisplay = document.createElement('div');
posDisplay.style.cssText = `margin-bottom:${UI_CONFIG.SLIDER_MARGIN_BOTTOM};`;
posDisplay.innerHTML = `
  <div style="color:${UI_CONFIG.ACENTO_TEXTO_LABEL};margin-bottom:4px;">Posición actual</div>
  <div style="background:rgba(0,0,0,0.4);border:1px solid rgba(76, 79, 55, 0.15);border-radius:${UI_CONFIG.SEC_HEADER_BORDE_RADIO};padding:6px 8px;font-size:${UI_CONFIG.PANEL_FONT_SIZE};line-height:1.8;">
    <span style="color:${UI_CONFIG.ACENTO_INACTIVO};">X</span> <span id="_posX" style="color:${UI_CONFIG.ACENTO};min-width:60px;display:inline-block;">0.00</span>
    <span style="color:${UI_CONFIG.ACENTO_INACTIVO};">Z</span> <span id="_posZ" style="color:${UI_CONFIG.ACENTO};min-width:60px;display:inline-block;">0.00</span><br>
    <span style="color:${UI_CONFIG.ACENTO_INACTIVO};">Yaw</span> <span id="_posYaw" style="color:${UI_CONFIG.ACENTO};">0.00°</span>
  </div>
`;
if(_currentSecBody) _currentSecBody.appendChild(posDisplay);

// Botón guardar spawn
const btnSpawn = document.createElement('button');
btnSpawn.textContent = 'GUARDAR COMO SPAWN';
btnSpawn.style.cssText = `width:100%;padding:6px 8px;margin-bottom:${UI_CONFIG.SLIDER_MARGIN_BOTTOM};background:rgba(102, 102, 83, 0.16);border:1px solid rgba(174, 199, 186, 0.63);color:${UI_CONFIG.ACENTO};font-family:${_fontFamily};font-size:${UI_CONFIG.PANEL_FONT_SIZE};cursor:pointer;border-radius:${UI_CONFIG.SEC_HEADER_BORDE_RADIO};`;
btnSpawn.addEventListener('click', () => {
  _spawnX   = playerBody.position.x;
  _spawnZ   = playerBody.position.z;
  _spawnYaw = yaw;
  btnSpawn.textContent = '✅ SPAWN GUARDADO';
  setTimeout(() => btnSpawn.textContent = 'GUARDAR COMO SPAWN', 2000);
});
if(_currentSecBody) _currentSecBody.appendChild(btnSpawn);

// Actualizar display cada frame — se engancha al loop de animate
const _origAnimate = animate;
// Actualizamos el display via requestAnimationFrame independiente
(function _updatePosDisplay() {
  requestAnimationFrame(_updatePosDisplay);
  const xEl  = document.getElementById('_posX');
  const zEl  = document.getElementById('_posZ');
  const yawEl= document.getElementById('_posYaw');
  if(xEl)   xEl.textContent   = playerBody.position.x.toFixed(2);
  if(zEl)   zEl.textContent   = playerBody.position.z.toFixed(2);
  if(yawEl) yawEl.textContent = ((yaw * 180 / Math.PI) % 360).toFixed(1) + '°';
})();

// ─── SECCIÓN: RENDIMIENTO / RESOLUCIÓN ───────────────────────
// Escala la resolución interna del render sin cambiar el tamaño
// del canvas en pantalla. Útil para correr en GPUs más débiles.

let _renderScale = 2.0; // factor activo (1.0 = resolución nativa)

function _applyRenderScale(scale) {
  _renderScale = scale;
  renderer.setPixelRatio(scale);
  renderer.setSize(innerWidth, innerHeight);
  composer.setSize(innerWidth * scale, innerHeight * scale);
  ssaoPass.setSize(innerWidth * scale, innerHeight * scale);
  // Recalcular edge blur: a menor escala el buffer es menor
  // → 1/w sube → más blur automático para compensar el pixelado.
  hBlurPass.uniforms['h'].value = (1 / (innerWidth  * scale)) * _edgeBlurStrength.value;
  vBlurPass.uniforms['v'].value = (1 / (innerHeight * scale)) * _edgeBlurStrength.value;
}

panel.appendChild(sec('RENDIMIENTO'));

// Presets de calidad
const QUALITY_PRESETS = [
  { label: 'Normal  75%', scale: 0.75 },
  { label: 'Alto   100%', scale: 1.00 },
  { label: 'Ultra  150%', scale: 1.50 },
];

const presetWrap = document.createElement('div');
presetWrap.style.cssText = 'display:flex;flex-direction:column;gap:4px;margin-bottom:10px;';

function _refreshPresets() {
  presetWrap.querySelectorAll('button[data-scale]').forEach(b => {
    const active = Math.abs(parseFloat(b.dataset.scale) - _renderScale) < 0.001;
    b.style.background  = active ? 'rgba(107,97,66,0.25)'    : 'rgba(107,97,66,0.06)';
    b.style.color       = active ? UI_CONFIG.ACENTO           : UI_CONFIG.ACENTO_INACTIVO;
    b.style.borderColor = active ? 'rgba(174,175,160,0.50)'           : 'rgba(174,175,160,0.15)';
    b.style.fontWeight  = active ? 'bold'                     : 'normal';
  });
}

QUALITY_PRESETS.forEach(({ label, scale }) => {
  const b = document.createElement('button');
  b.textContent = label;
  b.dataset.scale = scale;
  b.style.cssText = `width:100%;padding:5px 8px;text-align:left;font-family:${_fontFamily};font-size:${UI_CONFIG.PANEL_FONT_SIZE};cursor:pointer;border-radius:${UI_CONFIG.SEC_HEADER_BORDE_RADIO};border:1px solid;transition:background 0.12s,color 0.12s,border-color 0.12s;`;
  b.addEventListener('click', () => { _applyRenderScale(scale); _refreshPresets(); });
  presetWrap.appendChild(b);
});

if (_currentSecBody) {
  _currentSecBody.appendChild(presetWrap);
}
_refreshPresets();

// Slider de escala manual (ajuste fino entre presets)
panel.appendChild(slider('Escala manual', 0.10, 2.0, 1.0, 0.05, v => {
  _applyRenderScale(v);
  _refreshPresets();
},'renderScale'));

// Romper redirección al sec body — lo que sigue va directo al panel
_currentSecBody=null;

// ─── SECCIÓN: PRESENTACIÓN ───────────────────────────────────
panel.appendChild(sec('PRESENTACIÓN'));

let _activeFrame = null; // null = responsive

function _applyFrame(w, h) {
  _activeFrame = (w && h) ? { w, h } : null;
  if (_activeFrame) {
    renderer.setSize(w, h);
    composer.setSize(w * _renderScale, h * _renderScale);
    ssaoPass.setSize(w * _renderScale, h * _renderScale);
    camera.aspect = w / h;
    canvas.style.width     = w + 'px';
    canvas.style.height    = h + 'px';
    canvas.style.position  = 'absolute';
    canvas.style.top       = '50%';
    canvas.style.left      = '50%';
    canvas.style.transform = 'translate(-50%,-50%)';
  } else {
    renderer.setSize(innerWidth, innerHeight);
    composer.setSize(innerWidth * _renderScale, innerHeight * _renderScale);
    ssaoPass.setSize(innerWidth * _renderScale, innerHeight * _renderScale);
    camera.aspect = innerWidth / innerHeight;
    canvas.style.cssText   = '';
  }
  camera.updateProjectionMatrix();
  _refreshFrameBtns();
}

const frameBtnWrap = document.createElement('div');
frameBtnWrap.style.cssText = 'display:flex;flex-direction:column;gap:6px;';

// Botón Responsive
const btnResponsive = document.createElement('button');
btnResponsive.textContent = '📐  Responsive';
btnResponsive.style.cssText = `width:100%;padding:5px 8px;text-align:left;font-family:${_fontFamily};font-size:${UI_CONFIG.PANEL_FONT_SIZE};cursor:pointer;border-radius:${UI_CONFIG.SEC_HEADER_BORDE_RADIO};border:1px solid;transition:background 0.12s,color 0.12s,border-color 0.12s;background:rgba(107,97,66,0.25);color:${UI_CONFIG.ACENTO};border-color:rgba(174,175,160,0.50);font-weight:bold;`;
btnResponsive.addEventListener('click', () => _applyFrame(null, null));
frameBtnWrap.appendChild(btnResponsive);

// Inputs de tamaño personalizado
const customRow = document.createElement('div');
customRow.style.cssText = 'display:flex;align-items:center;gap:4px;margin-top:2px;';
const inpW = document.createElement('input');
inpW.type='number'; inpW.placeholder='Ancho'; inpW.min=320; inpW.max=3840;
inpW.style.cssText=`width:72px;padding:3px 5px;background:rgba(0,0,0,0.5);border:1px solid #333;color:${UI_CONFIG.ACENTO};font-family:${_fontFamily};font-size:${UI_CONFIG.PANEL_FONT_SIZE};border-radius:${UI_CONFIG.SEC_HEADER_BORDE_RADIO};`;
const sep = document.createElement('span');
sep.textContent='×'; sep.style.color=UI_CONFIG.ACENTO_INACTIVO;
const inpH = document.createElement('input');
inpH.type='number'; inpH.placeholder='Alto'; inpH.min=240; inpH.max=2160;
inpH.style.cssText=`width:72px;padding:3px 5px;background:rgba(0,0,0,0.5);border:1px solid #333;color:${UI_CONFIG.ACENTO};font-family:${_fontFamily};font-size:${UI_CONFIG.PANEL_FONT_SIZE};border-radius:${UI_CONFIG.SEC_HEADER_BORDE_RADIO};`;
const btnAplicar = document.createElement('button');
btnAplicar.textContent='OK';
btnAplicar.style.cssText=`padding:3px 8px;background:${UI_CONFIG.TOGBTN_BG_ACTIVO};border:1px solid ${UI_CONFIG.ACENTO};color:${UI_CONFIG.ACENTO};font-family:${_fontFamily};font-size:${UI_CONFIG.PANEL_FONT_SIZE};cursor:pointer;border-radius:${UI_CONFIG.SEC_HEADER_BORDE_RADIO};`;
btnAplicar.addEventListener('click',()=>{
  const w=parseInt(inpW.value), h=parseInt(inpH.value);
  if(!w||!h||w<320||h<240){ return; }
  const maxW=screen.width, maxH=screen.height;
  if(w>=maxW||h>=maxH){ inpW.style.borderColor='#ff3232'; inpH.style.borderColor='#ff3232'; return; }
  inpW.style.borderColor='#333'; inpH.style.borderColor='#333';
  _applyFrame(w, h);
});
customRow.appendChild(inpW); customRow.appendChild(sep);
customRow.appendChild(inpH); customRow.appendChild(btnAplicar);
frameBtnWrap.appendChild(customRow);

function _refreshFrameBtns(){
  const isResponsive = _activeFrame === null;
  btnResponsive.style.background  = isResponsive ? 'rgba(107,97,66,0.25)' : 'rgba(107,97,66,0.06)';
  btnResponsive.style.color       = isResponsive ? UI_CONFIG.ACENTO : UI_CONFIG.ACENTO_INACTIVO;
  btnResponsive.style.borderColor = isResponsive ? 'rgba(174,175,160,0.50)' : 'rgba(174,175,160,0.15)';
  btnResponsive.style.fontWeight  = isResponsive ? 'bold'    : 'normal';
}

if(_currentSecBody) _currentSecBody.appendChild(frameBtnWrap);

const lightsSection=document.createElement('div');
_origPanelAppend(lightsSection);

// ─── Botones cargar / eliminar LUCES.glb ─────────────────────
const lucesControls=document.createElement('div');
lucesControls.style.cssText='margin-top:14px;';

const btnCargar=document.createElement('button');
btnCargar.textContent='CARGAR LUCES.glb';
btnCargar.style.cssText='width:100%;padding:7px;margin-bottom:6px;background:rgba(107,97,66,0.12);border:1px solid rgba(174,175,160,0.30);color:#999;font-family:'+_fontFamily+';font-size:'+UI_CONFIG.PANEL_FONT_SIZE+';cursor:pointer;';
btnCargar.addEventListener('click',()=>{
  const inp=document.createElement('input');
  inp.type='file';inp.accept='.glb';
  inp.addEventListener('change',()=>{
    if(!inp.files[0]) return;
    const file=inp.files[0];
    // Guardar buffer para embeber en .galeria
    file.arrayBuffer().then(buf=>{ _lucesGLBBuffer=buf; });
    const url=URL.createObjectURL(file);
    lightsSection.innerHTML='';
    _loadLucesGLB(url, ()=>{
      buildLightsPanel();
      URL.revokeObjectURL(url);
    });
  });
  inp.click();
});
lucesControls.appendChild(btnCargar);

const btnEliminar=document.createElement('button');
btnEliminar.textContent='🗑 ELIMINAR LUCES';
btnEliminar.style.cssText='width:100%;padding:7px;background:rgba(140,90,80,0.10);border:1px solid rgba(160,110,100,0.30);color:#997070;font-family:'+_fontFamily+';font-size:'+UI_CONFIG.PANEL_FONT_SIZE+';cursor:pointer;';
btnEliminar.addEventListener('click',()=>{
  if(_lucesGltfScene){ scene.remove(_lucesGltfScene); _lucesGltfScene=null; }
  sceneLights.length=0;
  lightsSection.innerHTML='';
  renderer.shadowMap.enabled=false;
  sceneMeshes.forEach(m=>{m.castShadow=false;m.receiveShadow=false;});
});
lucesControls.appendChild(btnEliminar);
_origPanelAppend(lucesControls);

function buildLightsPanel(){
  // Título sección global — colapsable
  const secWrap=sec('LUCES INDIVIDUALES');
  lightsSection.appendChild(secWrap);
  const secBody=secWrap._secBody;

  secBody.appendChild(slider('Escala Global',0,5,1.0,0.01,v=>{
    sceneLights.forEach(({light})=>{light.intensity=light._base*v;});
  }));

  sceneLights.forEach(({name,light},i)=>{
    light._base=light.intensity;

    // Header de cada luz — colapsable
    const luzWrap=document.createElement('div');luzWrap.style.cssText='margin-top:10px;border:1px solid rgba(255,255,255,0.10);border-radius:3px;overflow:hidden;';
    const luzH=document.createElement('div');
    luzH.style.cssText='display:flex;align-items:center;justify-content:space-between;padding:5px 8px;background:rgba(255,255,255,0.05);cursor:pointer;user-select:none;';
    const luzName=document.createElement('span');luzName.textContent=name;luzName.style.cssText='color:#ccc;font-size:'+UI_CONFIG.PANEL_FONT_SIZE+';font-weight:bold;';
    const luzArr=document.createElement('span');luzArr.textContent='▾';luzArr.style.cssText='color:#555;font-size:9px;display:inline-block;transition:transform 0.18s;';
    luzH.appendChild(luzName);luzH.appendChild(luzArr);
    const luzBody=document.createElement('div');luzBody.style.cssText='padding:6px 6px 2px 6px;display:none;';
    luzH.addEventListener('click',()=>{
      const open=luzBody.style.display!=='none';
      luzBody.style.display=open?'none':'block';
      luzArr.style.transform=open?'rotate(-90deg)':'';
    });
    luzWrap.appendChild(luzH);luzWrap.appendChild(luzBody);

    luzBody.appendChild(slider('Intensidad',0,300,light.intensity,0.1,v=>{light.intensity=v;light._base=v;}));
    if(light.isPointLight||light.isSpotLight)
      luzBody.appendChild(slider('Distancia',0,200,light.distance||0,1,v=>{light.distance=v;}));
    luzBody.appendChild(colorRow('Color','#'+light.color.getHexString(),v=>{light.color.set(v);}));
    luzBody.appendChild(togBtn('● ON','○ OFF',true,on=>{light.visible=on;}));
    luzBody.appendChild(togBtn('🔲 Sombras ON','🔲 Sombras OFF',light.castShadow,on=>{
      light.castShadow=on;
      if(on){light.shadow.mapSize.set(_shadowMapSize,_shadowMapSize);light.shadow.bias=-0.0003;light.shadow.normalBias=0.02;if(light.isSpotLight)light.shadow.camera.near=0.5;}
      const anyShadow=sceneLights.some(s=>s.light.castShadow);
      renderer.shadowMap.enabled=anyShadow;
      sceneMeshes.forEach(m=>{m.castShadow=anyShadow;m.receiveShadow=anyShadow;});
    }));
    secBody.appendChild(luzWrap);
  });
}

// ─── SISTEMA DE VIDRIOS ───────────────────────────────────────
// Usa MeshStandardMaterial + CubeCamera estática.
// La CubeCamera renderiza la escena una sola vez al cargar el GLB
// y genera un envMap que refleja paredes, piso y luces reales.
// Costo: un render de 6 caras al cargar → cero costo por frame.

let glassScene       = null;
let glassMaterials   = [];
let _glassGLBBuffer  = null;

// CubeCamera compartida — se crea una vez y se reutiliza
let _glassCubeCamera    = null;
let _glassCubeRenderTarget = null;

function _buildGlassCubeCamera() {
  if (_glassCubeRenderTarget) _glassCubeRenderTarget.dispose();
  _glassCubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
    format:           THREE.RGBAFormat,
    generateMipmaps:  true,
    minFilter:        THREE.LinearMipmapLinearFilter,
  });
  _glassCubeCamera = new THREE.CubeCamera(0.1, 400, _glassCubeRenderTarget);
  // Posición en el centro aproximado de la galería
  _glassCubeCamera.position.set(0, 7, 0);
  scene.add(_glassCubeCamera);
}

function _updateGlassCubeMap() {
  if (!_glassCubeCamera) return;
  // Ocultar vidrios durante el render del cubeMap para evitar auto-reflejo
  if (glassScene) glassScene.visible = false;
  _glassCubeCamera.update(renderer, scene);
  if (glassScene) glassScene.visible = true;
  // Aplicar el cubeMap a todos los materiales
  glassMaterials.forEach(m => {
    m.envMap          = _glassCubeRenderTarget.texture;
    m.envMapIntensity = glassParams.envMapIntensity;
    m.needsUpdate     = true;
  });
}

// Parámetros globales de vidrio
const glassParams = {
  roughness:        0.200,
  metalness:        0.100,
  envMapIntensity:  0.000,
  color:            '#877341',
  opacity:          0.010,
};

function _applyGlassEnvMap() {
  // Mantida por compatibilidad — ahora usa CubeCamera, no HDRI
  _updateGlassCubeMap();
}

function _applyGlassParams() {
  glassMaterials.forEach(m => {
    m.roughness        = glassParams.roughness;
    m.metalness        = glassParams.metalness;
    m.envMapIntensity  = glassParams.envMapIntensity;
    m.color.set(glassParams.color);
    m.opacity          = glassParams.opacity;
    m.needsUpdate      = true;
  });
}

function _loadGlassGLB(url, onDone) {
  const loaderG = new GLTFLoader();
  loaderG.load(url, (gltf) => {
    if (glassScene) { scene.remove(glassScene); glassScene = null; }
    glassMaterials = [];
    glassScene = gltf.scene;

    // Construir CubeCamera si no existe aún
    if (!_glassCubeCamera) _buildGlassCubeCamera();

    gltf.scene.traverse(obj => {
      if (!obj.isMesh) return;
      const oldColor = obj.material?.color
        ? '#' + obj.material.color.getHexString()
        : glassParams.color;

      const mat = new THREE.MeshStandardMaterial({
        roughness:       glassParams.roughness,
        metalness:       glassParams.metalness,
        color:           new THREE.Color(oldColor),
        opacity:         glassParams.opacity,
        transparent:     true,
        side:            THREE.DoubleSide,
        envMapIntensity: glassParams.envMapIntensity,
        depthWrite:      false,
      });
      obj.material    = mat;
      obj.renderOrder = 1;
      glassMaterials.push(mat);
    });

    scene.add(gltf.scene);

    // Renderizar el cubeMap una sola vez después de que la escena esté lista
    requestAnimationFrame(() => {
      _updateGlassCubeMap();
      if (onDone) onDone();
    });

  }, null, (err) => console.error('[GlassLoader]', err));
}

// ─── Sección VIDRIOS en el panel ─────────────────────────────
_currentSecBody = null;

const glassSection = document.createElement('div');
_origPanelAppend(glassSection);

const glassControls = document.createElement('div');
glassControls.style.cssText = 'margin-top:14px;';

const btnCargarVidrio = document.createElement('button');
btnCargarVidrio.textContent = '🪟 CARGAR VIDRIOS.glb';
btnCargarVidrio.style.cssText = 'width:100%;padding:7px;margin-bottom:6px;background:rgba(107,97,66,0.12);border:1px solid rgba(174,175,160,0.30);color:#999;font-family:'+_fontFamily+';font-size:'+UI_CONFIG.PANEL_FONT_SIZE+';cursor:pointer;';
btnCargarVidrio.addEventListener('click', () => {
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = '.glb';
  inp.addEventListener('change', () => {
    if (!inp.files[0]) return;
    const file = inp.files[0];
    file.arrayBuffer().then(buf => { _glassGLBBuffer = buf; });
    const url = URL.createObjectURL(file);
    glassSection.innerHTML = '';
    _buildGlassPanel();
    _loadGlassGLB(url, () => {
      URL.revokeObjectURL(url);
      btnCargarVidrio.textContent = '✅ VIDRIOS CARGADOS';
      setTimeout(() => btnCargarVidrio.textContent = '🪟 CARGAR VIDRIOS.glb', 2000);
    });
  });
  inp.click();
});
glassControls.appendChild(btnCargarVidrio);

const btnEliminarVidrio = document.createElement('button');
btnEliminarVidrio.textContent = '🗑 ELIMINAR VIDRIOS';
btnEliminarVidrio.style.cssText = 'width:100%;padding:7px;background:rgba(140,90,80,0.10);border:1px solid rgba(160,110,100,0.30);color:#997070;font-family:'+_fontFamily+';font-size:'+UI_CONFIG.PANEL_FONT_SIZE+';cursor:pointer;';
btnEliminarVidrio.addEventListener('click', () => {
  if (glassScene) { scene.remove(glassScene); glassScene = null; }
  glassMaterials = [];
  glassSection.innerHTML = '';
  _glassGLBBuffer = null;
});
glassControls.appendChild(btnEliminarVidrio);
_origPanelAppend(glassControls);

// ─── Botones cargar / eliminar VIDEOS.glb ────────────────────
const videoControls = document.createElement('div');
videoControls.style.cssText = 'margin-top:14px;';

const btnCargarVideo = document.createElement('button');
btnCargarVideo.textContent = '🎬 CARGAR VIDEOS.glb';
btnCargarVideo.style.cssText = 'width:100%;padding:7px;margin-bottom:6px;background:rgba(107,97,66,0.12);border:1px solid rgba(174,175,160,0.30);color:#999;font-family:'+_fontFamily+';font-size:'+UI_CONFIG.PANEL_FONT_SIZE+';cursor:pointer;';
btnCargarVideo.addEventListener('click', () => {
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = '.glb';
  inp.addEventListener('change', () => {
    if (!inp.files[0]) return;
    const file = inp.files[0];
    file.arrayBuffer().then(buf => { _videoGLBBuffer = buf; });
    const url = URL.createObjectURL(file);
    _loadVideosGLB(url, () => {
      URL.revokeObjectURL(url);
      btnCargarVideo.textContent = '✅ VIDEOS CARGADOS';
      setTimeout(() => btnCargarVideo.textContent = '🎬 CARGAR VIDEOS.glb', 2000);
    });
  });
  inp.click();
});
videoControls.appendChild(btnCargarVideo);

const btnEliminarVideo = document.createElement('button');
btnEliminarVideo.textContent = '🗑 ELIMINAR VIDEOS';
btnEliminarVideo.style.cssText = 'width:100%;padding:7px;background:rgba(140,90,80,0.10);border:1px solid rgba(160,110,100,0.30);color:#997070;font-family:'+_fontFamily+';font-size:'+UI_CONFIG.PANEL_FONT_SIZE+';cursor:pointer;';
btnEliminarVideo.addEventListener('click', () => {
  _disposeVideos();
  if (_videoScene) { scene.remove(_videoScene); _videoScene = null; }
  _videoGLBBuffer = null;
});
videoControls.appendChild(btnEliminarVideo);
_origPanelAppend(videoControls);

// ─── Botones cargar / eliminar OBJETOS.glb ───────────────────
const objetosControls = document.createElement('div');
objetosControls.style.cssText = 'margin-top:14px;';

const btnCargarObjetos = document.createElement('button');
btnCargarObjetos.textContent = '🪑 CARGAR OBJETOS.glb';
btnCargarObjetos.style.cssText = 'width:100%;padding:7px;margin-bottom:6px;background:rgba(107,97,66,0.12);border:1px solid rgba(174,175,160,0.30);color:#999;font-family:'+_fontFamily+';font-size:'+UI_CONFIG.PANEL_FONT_SIZE+';cursor:pointer;';
btnCargarObjetos.addEventListener('click', () => {
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = '.glb';
  inp.addEventListener('change', () => {
    if (!inp.files[0]) return;
    const file = inp.files[0];
    file.arrayBuffer().then(buf => { _objetosGLBBuffer = buf; });
    const url = URL.createObjectURL(file);
    _loadObjetosGLB(url, () => {
      URL.revokeObjectURL(url);
      btnCargarObjetos.textContent = '✅ OBJETOS CARGADOS';
      setTimeout(() => btnCargarObjetos.textContent = '🪑 CARGAR OBJETOS.glb', 2000);
    });
  });
  inp.click();
});
objetosControls.appendChild(btnCargarObjetos);

const btnEliminarObjetos = document.createElement('button');
btnEliminarObjetos.textContent = '🗑 ELIMINAR OBJETOS';
btnEliminarObjetos.style.cssText = 'width:100%;padding:7px;background:rgba(140,90,80,0.10);border:1px solid rgba(160,110,100,0.30);color:#997070;font-family:'+_fontFamily+';font-size:'+UI_CONFIG.PANEL_FONT_SIZE+';cursor:pointer;';
btnEliminarObjetos.addEventListener('click', () => {
  _disposeObjetos();
  if (_objetosScene) { scene.remove(_objetosScene); _objetosScene = null; }
  _objetosGLBBuffer = null;
});
objetosControls.appendChild(btnEliminarObjetos);
_origPanelAppend(objetosControls);

function _buildGlassPanel() {
  const secWrap = sec('VIDRIOS');
  glassSection.appendChild(secWrap);
  const sb = secWrap._secBody;

  const mkSlider = (label, min, max, val, step, key) => {
    const el = slider(label, min, max, val, step, v => {
      glassParams[key] = v;
      _applyGlassParams();
    });
    sb.appendChild(el);
  };

  mkSlider('Rugosidad',      0, 1,   glassParams.roughness,       0.01, 'roughness');
  mkSlider('Metalness',      0, 1,   glassParams.metalness,       0.01, 'metalness');
  mkSlider('Intensidad Env', 0, 3,   glassParams.envMapIntensity, 0.05, 'envMapIntensity');
  mkSlider('Opacidad',       0, 1,   glassParams.opacity,         0.01, 'opacity');

  const cr = colorRow('Tinte', glassParams.color, v => {
    glassParams.color = v;
    _applyGlassParams();
  });
  sb.appendChild(cr);

  // Botón para forzar re-render del cubeMap (útil si cambian las luces)
  const btnRefresh = document.createElement('button');
  btnRefresh.textContent = '🔄 ACTUALIZAR REFLEJO';
  btnRefresh.style.cssText = 'width:100%;margin-top:6px;padding:5px 8px;background:rgba(107,97,66,0.12);border:1px solid rgba(174,175,160,0.30);color:#999;font-family:'+_fontFamily+';font-size:'+UI_CONFIG.PANEL_FONT_SIZE+';cursor:pointer;border-radius:2px;';
  btnRefresh.addEventListener('click', () => {
    _updateGlassCubeMap();
    btnRefresh.textContent = '✅ REFLEJO ACTUALIZADO';
    setTimeout(() => btnRefresh.textContent = '🔄 ACTUALIZAR REFLEJO', 2000);
  });
  sb.appendChild(btnRefresh);
}

// ─── FIN SISTEMA DE VIDRIOS ───────────────────────────────────

// ─── SISTEMA DE VIDEOS — funciones ───────────────────────────

function _findVideoFile(meshName) {
  const lower = meshName.toLowerCase();
  return _videoManifest.find(f => {
    const name = f.substring(0, f.lastIndexOf('.')).toLowerCase();
    return name === lower;
  }) || null;
}

function _loadVideosGLB(url, onDone) {
  const loaderV = new GLTFLoader();
  loaderV.load(url, (gltf) => {
    // Esperar a que el manifiesto esté listo antes de procesar mallas
    _videoManifestPromise.then(() => {
      _disposeVideos();
      if (_videoScene) scene.remove(_videoScene);
      _videoScene = gltf.scene;

      gltf.scene.traverse(obj => {
        if (!obj.isMesh) return;
        const meshName = obj.name || '';
        const videoFile = _findVideoFile(meshName);

        if (!videoFile) {
          console.warn('[Videos] Sin video para mesh "' + meshName + '"');
          obj.material = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
          return;
        }

        const video = document.createElement('video');
        video.src         = './assets/video/' + videoFile;
        video.crossOrigin = 'anonymous';
        video.loop        = true;
        video.muted       = true;
        video.playsInline = true;
        video.preload     = 'auto';

        const texture = new THREE.VideoTexture(video);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.flipY      = false; // GLB usa flipY=false

        const mat = new THREE.MeshBasicMaterial({
          map:        texture,
          side:       THREE.DoubleSide,
          toneMapped: false,
        });

        obj.material = mat;
        _videoElements.push({ mesh: obj, video, texture });
      });

      scene.add(gltf.scene);

      // Si el usuario ya entró a la galería, reproducir de inmediato
      if (_galleryEntered) _startVideos();

      if (onDone) onDone();
    });
  }, null, (err) => console.error('[VideosLoader]', err));
}

function _startVideos() {
  _videoElements.forEach(({ video }) => {
    video.play().catch(() => {});
  });
}

function _disposeVideos() {
  _videoElements.forEach(({ video, texture }) => {
    video.pause();
    video.src = '';
    video.load();
    texture.dispose();
  });
  _videoElements = [];
}

// ─── FIN SISTEMA DE VIDEOS ───────────────────────────────────

// ─── SISTEMA DE OBJETOS — funciones ──────────────────────────

function _loadObjetosGLB(url, onDone) {
  const loaderO = new GLTFLoader();
  loaderO.load(url, (gltf) => {
    _disposeObjetos();
    if (_objetosScene) scene.remove(_objetosScene);
    _objetosScene = gltf.scene;

    gltf.scene.traverse(obj => {
      if (!obj.isMesh) return;
      const old = obj.material;
      if (!old) return;
      const mat = new THREE.MeshLambertMaterial({
        map:  old.map,
        side: THREE.DoubleSide,
      });
      mat.onBeforeCompile = (shader) => {
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <normal_fragment_begin>',
          `#include <normal_fragment_begin>
          if ( gl_FrontFacing == false ) normal = -normal;`
        );
      };
      if (mat.map) {
        mat.map.colorSpace = THREE.SRGBColorSpace;
        mat.map.needsUpdate = true;
      }
      mat.polygonOffset       = true;
      mat.polygonOffsetFactor = 1;
      mat.polygonOffsetUnits  = 1;
      obj.material = mat;
      _objetosMaterials.push(mat);
      _objetosMeshes.push(obj);
      sceneMaterials.push(mat);
      sceneMeshes.push(obj);
      // NO se agrega a collisionMeshes — sin colisión
    });

    // Sincronizar sombras con estado actual
    const anyShadow = renderer.shadowMap.enabled;
    _objetosMeshes.forEach(m => { m.castShadow = anyShadow; m.receiveShadow = anyShadow; });

    scene.add(gltf.scene);
    if (onDone) onDone();
  }, null, (err) => console.error('[ObjetosLoader]', err));
}

function _disposeObjetos() {
  _objetosMeshes.forEach(m => {
    const idx = sceneMeshes.indexOf(m);
    if (idx !== -1) sceneMeshes.splice(idx, 1);
  });
  _objetosMaterials.forEach(m => {
    const idx = sceneMaterials.indexOf(m);
    if (idx !== -1) sceneMaterials.splice(idx, 1);
    m.dispose();
  });
  _objetosMeshes = [];
  _objetosMaterials = [];
}

// ─── FIN SISTEMA DE OBJETOS ──────────────────────────────────

// ─── ESTADO COMPLETO ──────────────────────────────────────────
function _getState(){
  return {
    version: 1,
    pixelRatio:          renderer.getPixelRatio(),
    toneMapping:         renderer.toneMapping,
    exposure:            renderer.toneMappingExposure,
    fogNear:             scene.fog.near,
    fogFar:              scene.fog.far,
    fogColor:            '#'+scene.fog.color.getHexString(),
    ssaoKR:              ssaoPass.kernelRadius,
    ssaoMin:             ssaoPass.minDistance,
    ssaoMax:             ssaoPass.maxDistance,
    ssaoAoColor:         ssaoPass.ssaoMaterial?.uniforms?.aoColor?.value ? '#'+new THREE.Color().copy(ssaoPass.ssaoMaterial.uniforms.aoColor.value).getHexString() : '#000000',
    materialsRoughness:  sceneMaterials[0]?.roughness ?? 1.0,
    materialsSpecular:   sceneMaterials[0]?.specularIntensity ?? 0.0,
    dustSize:            dustMat.size,
    dustOpacity:         dustMat.opacity,
    dustColor:           '#'+dustMat.color.getHexString(),
    floorY:              FLOOR_Y,
    spawnX:              _spawnX,
    spawnZ:              _spawnZ,
    spawnYaw:            _spawnYaw,
    playerX:             playerBody.position.x,
    playerY:             playerBody.position.y,
    playerZ:             playerBody.position.z,
    playerYaw:           yaw,
    playerPitch:         pitch,
    shadowMapSize:       _shadowMapSize,
    shadowEnabled:       renderer.shadowMap.enabled,
    shadowOpacity:       sceneLights.find(({light})=>light.shadow)?.light.shadow.intensity ?? 1,
    edgeBlurEnabled:     hBlurPass.enabled,
    edgeBlurStrength:    _edgeBlurStrength.value,
    renderScale:         _renderScale,
    frame:               _activeFrame ? { w: _activeFrame.w, h: _activeFrame.h } : null,
    glass: { ...glassParams },
    lights: sceneLights.map(({name,light})=>({
      name,
      intensity:     light.intensity,
      color:         '#'+light.color.getHexString(),
      distance:      light.distance||0,
      castShadow:    light.castShadow,
      visible:       light.visible,
      shadowMapSize: light.castShadow ? light.shadow.mapSize.x : _shadowMapSize,
    }))
  };
}

// Sincroniza los controles DOM del panel con un estado (llamado al final de _applyState)
function _syncControls(s){
  const setSlider=(key,v)=>{ const c=_controls[key]; if(!c) return; c.inp.value=v; if(c.val) c.val.textContent=Number(v).toFixed(3); };
  const setColor =(key,v)=>{ const c=_controls[key]; if(c) c.inp.value=v; };
  const setToggle=(key,v)=>{ const c=_controls[key]; if(c) c.setOn(v); };
  if(s.exposure!==undefined)          setSlider('exposure',s.exposure);
  if(s.toneMapping!==undefined)        setSlider('toneMapping',s.toneMapping);
  if(s.shadowMapSize!==undefined)      setSlider('shadowMapSize',s.shadowMapSize);
  if(s.shadowOpacity!==undefined)      setSlider('shadowOpacity',s.shadowOpacity);
  if(s.fogNear!==undefined)            setSlider('fogNear',s.fogNear);
  if(s.fogFar!==undefined)             setSlider('fogFar',s.fogFar);
  if(s.fogColor)                       setColor('fogColor',s.fogColor);
  if(s.edgeBlurEnabled!==undefined)    setToggle('edgeBlurEnabled',s.edgeBlurEnabled);
  if(s.edgeBlurStrength!==undefined)   setSlider('edgeBlurStrength',s.edgeBlurStrength);
  if(s.ssaoKR!==undefined)             setSlider('ssaoKR',s.ssaoKR);
  if(s.ssaoMin!==undefined)            setSlider('ssaoMin',s.ssaoMin);
  if(s.ssaoMax!==undefined)            setSlider('ssaoMax',s.ssaoMax);
  if(s.ssaoAoColor)                    setColor('ssaoAoColor',s.ssaoAoColor);
  if(s.materialsRoughness!==undefined) setSlider('materialsRoughness',s.materialsRoughness);
  if(s.materialsSpecular!==undefined)  setSlider('materialsSpecular',s.materialsSpecular);
  if(s.dustSize!==undefined)           setSlider('dustSize',s.dustSize);
  if(s.dustOpacity!==undefined)        setSlider('dustOpacity',s.dustOpacity);
  if(s.dustColor)                      setColor('dustColor',s.dustColor);
  if(s.floorY!==undefined)             setSlider('floorY',s.floorY);
  if(s.renderScale!==undefined)        { setSlider('renderScale',s.renderScale); _refreshPresets(); }
  if(s.frame!==undefined){
    if(s.frame){ inpW.value=s.frame.w; inpH.value=s.frame.h; }
    else { inpW.value=''; inpH.value=''; }
    _refreshFrameBtns();
  }
}

// Aplica un estado completo a la escena (usado al cargar .galeria)
function _applyState(s){
  if(s.toneMapping!==undefined) renderer.toneMapping=s.toneMapping;
  if(s.exposure)     renderer.toneMappingExposure=s.exposure;
  if(s.fogNear)      scene.fog.near=s.fogNear;
  if(s.fogFar)       scene.fog.far=s.fogFar;
  if(s.fogColor)     scene.fog.color.set(s.fogColor);
  if(s.ssaoKR)       ssaoPass.kernelRadius=s.ssaoKR;
  if(s.ssaoMin)      ssaoPass.minDistance=s.ssaoMin;
  if(s.ssaoMax)      ssaoPass.maxDistance=s.ssaoMax;
  if(s.ssaoAoColor && ssaoPass.ssaoMaterial?.uniforms?.aoColor) ssaoPass.ssaoMaterial.uniforms.aoColor.value.set(s.ssaoAoColor);
  if(s.materialsRoughness!==undefined) sceneMaterials.forEach(m=>{m.roughness=s.materialsRoughness; m.needsUpdate=true;});
  if(s.materialsSpecular!==undefined)  sceneMaterials.forEach(m=>{m.specularIntensity=s.materialsSpecular; m.needsUpdate=true;});
  if(s.dustSize)     { dustMat.size=s.dustSize; dustMat.needsUpdate=true; }
  if(s.dustOpacity!==undefined) dustMat.opacity=s.dustOpacity;
  if(s.dustColor)    { dustMat.color.set(s.dustColor); dustMat.needsUpdate=true; }
  if(s.floorY)       { FLOOR_Y=s.floorY; playerBody.position.y=s.floorY; }
  if(s.spawnX  !== undefined) _spawnX   = s.spawnX;
  if(s.spawnZ  !== undefined) _spawnZ   = s.spawnZ;
  if(s.spawnYaw!== undefined) _spawnYaw = s.spawnYaw;
  if(s.playerX !== undefined) playerBody.position.x = s.playerX;
  if(s.playerY !== undefined) playerBody.position.y = s.playerY;
  if(s.playerZ !== undefined) playerBody.position.z = s.playerZ;
  if(s.playerYaw   !== undefined) yaw   = s.playerYaw;
  if(s.playerPitch !== undefined) pitch = s.playerPitch;
  if(s.frame !== undefined) _applyFrame(s.frame ? s.frame.w : null, s.frame ? s.frame.h : null);
  if(s.shadowMapSize){ _shadowMapSize=s.shadowMapSize; }
  if(s.shadowOpacity!==undefined) sceneLights.forEach(({light})=>{ if(light.shadow) light.shadow.intensity=s.shadowOpacity; });
  if(s.edgeBlurEnabled!==undefined){ hBlurPass.enabled=s.edgeBlurEnabled; vBlurPass.enabled=s.edgeBlurEnabled; }
  if(s.edgeBlurStrength!==undefined){ _edgeBlurStrength.value=s.edgeBlurStrength; hBlurPass.uniforms['h'].value=(1/(innerWidth*_renderScale))*s.edgeBlurStrength; vBlurPass.uniforms['v'].value=(1/(innerHeight*_renderScale))*s.edgeBlurStrength; }
  if(s.renderScale){ _applyRenderScale(s.renderScale); }
  // Restaurar parámetros de vidrio
  if(s.glass){
    Object.assign(glassParams, s.glass);
    _applyGlassParams();
  }
  sceneMaterials.forEach(m=>{m.needsUpdate=true;});
  // Aplicar luces si vienen en el estado
  if(s.lights && sceneLights.length){
    s.lights.forEach((ld,i)=>{
      const sl=sceneLights[i];
      if(!sl) return;
      sl.light.intensity=ld.intensity;
      sl.light.color.set(ld.color);
      sl.light.distance=ld.distance||0;
      sl.light.castShadow=ld.castShadow;
      if(ld.visible!==undefined) sl.light.visible=ld.visible;
      if(ld.castShadow){
        const ms=ld.shadowMapSize||_shadowMapSize;
        sl.light.shadow.mapSize.set(ms,ms);
        sl.light.shadow.bias=-0.0003;
        sl.light.shadow.normalBias=0.02;
        if(sl.light.isSpotLight) sl.light.shadow.camera.near=0.5;
      }
    });
    const anyShadow=sceneLights.some(s=>s.light.castShadow);
    renderer.shadowMap.enabled=anyShadow;
    sceneMeshes.forEach(m=>{m.castShadow=anyShadow;m.receiveShadow=anyShadow;});
  }
  _syncControls(s);
}

// ─── BOTÓN COPIAR VALORES ─────────────────────────────────────
const btn=document.createElement('button');
btn.textContent='📋 COPIAR VALORES';
btn.style.cssText='width:100%;margin-top:8px;padding:8px;background:rgba(107,97,66,0.12);border:1px solid rgba(174,175,160,0.30);color:#999;font-family:'+_fontFamily+';font-size:'+UI_CONFIG.PANEL_FONT_SIZE+';cursor:pointer;';
btn.addEventListener('click',()=>{
  const s=_getState();
  const lc=s.lights.map(l=>`  // ${l.name}: intensity=${l.intensity.toFixed(5)}, color=${l.color}, distance=${l.distance.toFixed(1)}, castShadow=${l.castShadow}, visible=${l.visible}, shadowMapSize=${l.shadowMapSize}`).join('\n');
  const txt=
`renderer.setPixelRatio(${s.pixelRatio.toFixed(2)});
renderer.shadowMap.enabled   = ${s.shadowEnabled};
renderer.toneMapping         = ${s.toneMapping};
renderer.toneMappingExposure = ${s.exposure.toFixed(3)};
scene.fog = new THREE.Fog(${s.fogColor}, ${s.fogNear.toFixed(1)}, ${s.fogFar.toFixed(1)});
let FLOOR_Y       = ${s.floorY.toFixed(1)};
// SPAWN
playerBody.position.set(${s.spawnX.toFixed(6)}, FLOOR_Y, ${s.spawnZ.toFixed(6)});
let _spawnX = ${s.spawnX.toFixed(6)}, _spawnZ = ${s.spawnZ.toFixed(6)}, _spawnYaw = ${s.spawnYaw.toFixed(6)};
_shadowMapSize    = ${s.shadowMapSize};
// SOMBRAS
shadowOpacity = ${s.shadowOpacity.toFixed(4)};
// SSAO
ssaoPass.kernelRadius = ${s.ssaoKR.toFixed(2)};
ssaoPass.minDistance  = ${s.ssaoMin.toFixed(4)};
ssaoPass.maxDistance  = ${s.ssaoMax.toFixed(4)};
ssaoAoColor = ${s.ssaoAoColor};
// MATERIALES
materialsRoughness = ${s.materialsRoughness.toFixed(4)};
materialsSpecular  = ${s.materialsSpecular.toFixed(4)};
// POLVO
dustMat.size    = ${s.dustSize.toFixed(4)};
dustMat.opacity = ${s.dustOpacity.toFixed(4)};
dustMat.color   = ${s.dustColor};
// EDGE BLUR
hBlurPass.enabled = ${s.edgeBlurEnabled};
vBlurPass.enabled = ${s.edgeBlurEnabled};
_edgeBlurStrength.value = ${s.edgeBlurStrength.toFixed(4)};
// RENDIMIENTO
_renderScale = ${s.renderScale.toFixed(2)};
// LUCES
${lc}`;
  navigator.clipboard.writeText(txt).then(()=>{btn.textContent='✅ COPIADO';setTimeout(()=>btn.textContent='📋 COPIAR VALORES',2000);});
});
_origPanelAppend(btn);

// ─── GUARDAR / CARGAR .galeria ────────────────────────────────
// El archivo .galeria es un JSON que incluye todos los parámetros
// + el GLB de luces embebido en base64 (solo ~9KB).

// Variable que guarda el ArrayBuffer del LUCES.glb activo para embeber
let _lucesGLBBuffer = null;

// Leer LUCES.glb inicial y guardar buffer
fetch('./assets/LUCES.glb').then(r=>r.arrayBuffer()).then(buf=>{ _lucesGLBBuffer=buf; });

const btnGuardar=document.createElement('button');
btnGuardar.textContent='💾 GUARDAR ESCENA .galeria';
btnGuardar.style.cssText='width:100%;margin-top:8px;padding:8px;background:rgba(107,97,66,0.12);border:1px solid rgba(174,175,160,0.30);color:#999;font-family:'+_fontFamily+';font-size:'+UI_CONFIG.PANEL_FONT_SIZE+';cursor:pointer;';
btnGuardar.addEventListener('click',async()=>{
  const state=_getState();
  // Embeber LUCES.glb como base64 si está disponible
  if(_lucesGLBBuffer){
    const bytes=new Uint8Array(_lucesGLBBuffer);
    let binary='';
    bytes.forEach(b=>binary+=String.fromCharCode(b));
    state._lucesGLB=btoa(binary);
  }
  if(_glassGLBBuffer){
    const bytes2=new Uint8Array(_glassGLBBuffer);
    let binary2='';
    bytes2.forEach(b=>binary2+=String.fromCharCode(b));
    state._glassGLB=btoa(binary2);
  }
  if(_videoGLBBuffer){
    const bytes3=new Uint8Array(_videoGLBBuffer);
    let binary3='';
    bytes3.forEach(b=>binary3+=String.fromCharCode(b));
    state._videoGLB=btoa(binary3);
  }
  if(_objetosGLBBuffer){
    const bytes4=new Uint8Array(_objetosGLBBuffer);
    let binary4='';
    bytes4.forEach(b=>binary4+=String.fromCharCode(b));
    state._objetosGLB=btoa(binary4);
  }
  const json=JSON.stringify(state,null,2);
  const blob=new Blob([json],{type:'application/json'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='escena.galeria';
  a.click();
  URL.revokeObjectURL(a.href);
  btnGuardar.textContent='✅ GUARDADO';
  setTimeout(()=>btnGuardar.textContent='💾 GUARDAR ESCENA .galeria',2000);
});
_origPanelAppend(btnGuardar);

const btnCargarEscena=document.createElement('button');
btnCargarEscena.textContent='📂 CARGAR ESCENA .galeria';
btnCargarEscena.style.cssText='width:100%;margin-top:6px;padding:8px;background:rgba(107,97,66,0.12);border:1px solid rgba(174,175,160,0.30);color:#999;font-family:'+_fontFamily+';font-size:'+UI_CONFIG.PANEL_FONT_SIZE+';cursor:pointer;';
btnCargarEscena.addEventListener('click',()=>{
  const inp=document.createElement('input');
  inp.type='file';inp.accept='.galeria,application/json';
  inp.addEventListener('change',async()=>{
    if(!inp.files[0]) return;
    const text=await inp.files[0].text();
    let state;
    try{ state=JSON.parse(text); } catch(e){ alert('Archivo .galeria inválido'); return; }
    // Si tiene GLB embebido, cargarlo primero
    if(state._lucesGLB){
      const binary=atob(state._lucesGLB);
      const bytes=new Uint8Array(binary.length);
      for(let i=0;i<binary.length;i++) bytes[i]=binary.charCodeAt(i);
      _lucesGLBBuffer=bytes.buffer;
      const blob=new Blob([bytes],{type:'model/gltf-binary'});
      const url=URL.createObjectURL(blob);
      lightsSection.innerHTML='';
      _loadLucesGLB(url,()=>{
        buildLightsPanel();
        URL.revokeObjectURL(url);
        _applyState(state);
        // Reconstruir panel de luces con valores aplicados
        lightsSection.innerHTML='';
        buildLightsPanel();
      }, false);
    } else {
      _applyState(state);
    }
    // Restaurar vidrios embebidos si existen
    if(state._glassGLB){
      const bin=atob(state._glassGLB);
      const b=new Uint8Array(bin.length);
      for(let i=0;i<bin.length;i++) b[i]=bin.charCodeAt(i);
      _glassGLBBuffer=b.buffer;
      const blobG=new Blob([b],{type:'model/gltf-binary'});
      const urlG=URL.createObjectURL(blobG);
      glassSection.innerHTML='';
      _buildGlassPanel();
      _loadGlassGLB(urlG,()=>{ URL.revokeObjectURL(urlG); _applyGlassParams(); });
    }
    // Restaurar videos embebidos si existen
    if(state._videoGLB){
      const binV=atob(state._videoGLB);
      const bV=new Uint8Array(binV.length);
      for(let i=0;i<binV.length;i++) bV[i]=binV.charCodeAt(i);
      _videoGLBBuffer=bV.buffer;
      const blobV=new Blob([bV],{type:'model/gltf-binary'});
      const urlV=URL.createObjectURL(blobV);
      _loadVideosGLB(urlV,()=>{ URL.revokeObjectURL(urlV); });
    }
    // Restaurar objetos embebidos si existen
    if(state._objetosGLB){
      const binO=atob(state._objetosGLB);
      const bO=new Uint8Array(binO.length);
      for(let i=0;i<binO.length;i++) bO[i]=binO.charCodeAt(i);
      _objetosGLBBuffer=bO.buffer;
      const blobO=new Blob([bO],{type:'model/gltf-binary'});
      const urlO=URL.createObjectURL(blobO);
      _loadObjetosGLB(urlO,()=>{ URL.revokeObjectURL(urlO); });
    }
    btnCargarEscena.textContent='✅ CARGADO';
    setTimeout(()=>btnCargarEscena.textContent='📂 CARGAR ESCENA .galeria',2000);
  });
  inp.click();
});
_origPanelAppend(btnCargarEscena);
