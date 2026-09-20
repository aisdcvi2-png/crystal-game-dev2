import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { BLOCK_TYPES, ITEM_TYPES, WORLD_SIZE, WORLD_HEIGHT, generateWorld, getSurfaceHeight, WorldData, WorldBlock, BiomeType, BIOMES } from '../data/gameData';

interface NPC {
  mesh: THREE.Group;
  position: THREE.Vector3;
  target: THREE.Vector3;
  speed: number;
  lastGreet: number;
}

interface GameWorldProps {
  crystalsCollected: number;
  totalCrystals: number;
  onCrystalFound: (crystalId: number) => void;
  playerPosition: React.MutableRefObject<THREE.Vector3>;
  availableCrystals: number[];
  onBreakProgress: (progress: number, maxHealth: number, blockName: string) => void;
  onBlockMined: (blockType: string, x: number, y: number, z: number) => void;
  selectedSlot: number;
  hotbar: (string | null)[];
  onPlaceBlock: (x: number, y: number, z: number) => void;
  onCrystalPickup: (crystalId: number) => void;
  droppedCrystals: { id: number; x: number; y: number; z: number }[];
  onPortalActivated: () => void;
  hasPortalKey: boolean;
}

export default function GameWorld({
  crystalsCollected, totalCrystals, onCrystalFound, playerPosition,
  availableCrystals, onBreakProgress, onBlockMined, selectedSlot, hotbar,
  onPlaceBlock, onCrystalPickup, droppedCrystals, onPortalActivated, hasPortalKey
}: GameWorldProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const velocityRef = useRef(new THREE.Vector3());
  const animFrameRef = useRef<number>(0);
  const mouseRef = useRef({ locked: false, leftDown: false, rightDown: false });
  const eulerRef = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  const pickaxeRef = useRef<THREE.Group | null>(null);
  const pickaxeSwingRef = useRef({ swinging: false, time: 0 });
  const worldDataRef = useRef<WorldData | null>(null);
  const blockMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const waterMeshesRef = useRef<THREE.Mesh[]>([]);
  const raycasterRef = useRef(new THREE.Raycaster());
  const swingCooldownRef = useRef(0);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const particlesRef = useRef<THREE.Points[]>([]);
  const onGroundRef = useRef(false);
  const hotbarRef = useRef(hotbar);
  const selectedSlotRef = useRef(selectedSlot);
  const onPlaceBlockRef = useRef(onPlaceBlock);
  const onCrystalPickupRef = useRef(onCrystalPickup);
  const droppedCrystalsRef = useRef(droppedCrystals);
  const crystalMeshesRef = useRef<Map<number, THREE.Group>>(new Map());
  const placeCooldownRef = useRef(0);
  const npcsRef = useRef<NPC[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const portalMeshRef = useRef<THREE.Mesh | null>(null);
  const hasPortalKeyRef = useRef(hasPortalKey);

  useEffect(() => { hotbarRef.current = hotbar; }, [hotbar]);
  useEffect(() => { selectedSlotRef.current = selectedSlot; }, [selectedSlot]);
  useEffect(() => { onPlaceBlockRef.current = onPlaceBlock; }, [onPlaceBlock]);
  useEffect(() => { onCrystalPickupRef.current = onCrystalPickup; }, [onCrystalPickup]);
  useEffect(() => { droppedCrystalsRef.current = droppedCrystals; }, [droppedCrystals]);
  useEffect(() => { hasPortalKeyRef.current = hasPortalKey; }, [hasPortalKey]);

  // Auto-release mouse
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && document.pointerLockElement) document.exitPointerLock();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Sync dropped crystals
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    crystalMeshesRef.current.forEach((mesh, id) => {
      if (!droppedCrystals.find(c => c.id === id)) {
        scene.remove(mesh);
        crystalMeshesRef.current.delete(id);
      }
    });
    droppedCrystals.forEach(crystal => {
      if (!crystalMeshesRef.current.has(crystal.id)) {
        const group = new THREE.Group();
        const crystalGeo = new THREE.OctahedronGeometry(0.35, 0);
        const crystalMat = new THREE.MeshPhongMaterial({ color: 0xE040FB, emissive: 0xE040FB, emissiveIntensity: 0.6, transparent: true, opacity: 0.9, shininess: 150 });
        group.add(new THREE.Mesh(crystalGeo, crystalMat));
        const glowGeo = new THREE.SphereGeometry(0.6, 16, 16);
        const glowMat = new THREE.MeshBasicMaterial({ color: 0xE040FB, transparent: true, opacity: 0.2 });
        group.add(new THREE.Mesh(glowGeo, glowMat));
        group.add(new THREE.PointLight(0xE040FB, 1, 5));
        group.position.set(crystal.x + 0.5, crystal.y + 0.8, crystal.z + 0.5);
        scene.add(group);
        crystalMeshesRef.current.set(crystal.id, group);
      }
    });
  }, [droppedCrystals]);

  const getBlockKey = (x: number, y: number, z: number) => `${x},${y},${z}`;

  const playGreetSound = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    const now = ctx.currentTime;
    
    // Create "привет" sound using oscillators
    const notes = [440, 550, 660]; // Simple greeting melody
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.15, now + i * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.14);
      osc.start(now + i * 0.15);
      osc.stop(now + i * 0.15 + 0.15);
    });
  }, []);

  const createNPC = useCallback((scene: THREE.Scene, x: number, z: number): NPC => {
    const group = new THREE.Group();
    
    // Head
    const headGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const headMat = new THREE.MeshLambertMaterial({ color: 0xffdbac });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.7;
    group.add(head);

    // Eyes
    const eyeGeo = new THREE.BoxGeometry(0.08, 0.08, 0.08);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.12, 1.75, 0.26);
    group.add(leftEye);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.12, 1.75, 0.26);
    group.add(rightEye);

    // Body
    const bodyGeo = new THREE.BoxGeometry(0.5, 0.7, 0.3);
    const bodyMat = new THREE.MeshLambertMaterial({ color: 0x4a90e2 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.1;
    group.add(body);

    // Arms
    const armGeo = new THREE.BoxGeometry(0.2, 0.6, 0.2);
    const armMat = new THREE.MeshLambertMaterial({ color: 0xffdbac });
    const leftArm = new THREE.Mesh(armGeo, armMat);
    leftArm.position.set(-0.35, 1.1, 0);
    group.add(leftArm);
    const rightArm = new THREE.Mesh(armGeo, armMat);
    rightArm.position.set(0.35, 1.1, 0);
    group.add(rightArm);

    // Legs
    const legGeo = new THREE.BoxGeometry(0.2, 0.6, 0.2);
    const legMat = new THREE.MeshLambertMaterial({ color: 0x3d5a80 });
    const leftLeg = new THREE.Mesh(legGeo, legMat);
    leftLeg.position.set(-0.15, 0.4, 0);
    group.add(leftLeg);
    const rightLeg = new THREE.Mesh(legGeo, legMat);
    rightLeg.position.set(0.15, 0.4, 0);
    group.add(rightLeg);

    group.position.set(x, 0, z);
    scene.add(group);

    return {
      mesh: group,
      position: new THREE.Vector3(x, 0, z),
      target: new THREE.Vector3(x + (Math.random() - 0.5) * 10, 0, z + (Math.random() - 0.5) * 10),
      speed: 0.02 + Math.random() * 0.02,
      lastGreet: 0,
    };
  }, []);

  const createBlockMesh = useCallback((scene: THREE.Scene, type: string, x: number, y: number, z: number): THREE.Mesh => {
    const blockType = BLOCK_TYPES[type];
    const geo = new THREE.BoxGeometry(1, 1, 1);
    let mesh: THREE.Mesh;
    
    if (blockType.topColor && blockType.sideColor) {
      const materials = [
        new THREE.MeshLambertMaterial({ color: blockType.sideColor }),
        new THREE.MeshLambertMaterial({ color: blockType.sideColor }),
        new THREE.MeshLambertMaterial({ color: blockType.topColor }),
        new THREE.MeshLambertMaterial({ color: blockType.sideColor }),
        new THREE.MeshLambertMaterial({ color: blockType.sideColor }),
        new THREE.MeshLambertMaterial({ color: blockType.sideColor }),
      ];
      mesh = new THREE.Mesh(geo, materials);
    } else if (blockType.liquid) {
      const mat = new THREE.MeshPhongMaterial({ color: blockType.color, transparent: true, opacity: 0.6, shininess: 100 });
      mesh = new THREE.Mesh(geo, mat);
    } else {
      const mat = new THREE.MeshLambertMaterial({ color: blockType.color, transparent: blockType.transparent || false, opacity: blockType.transparent ? 0.5 : 1 });
      mesh = new THREE.Mesh(geo, mat);
    }
    
    mesh.position.set(x + 0.5, y + 0.5, z + 0.5);
    mesh.castShadow = !blockType.transparent && !blockType.liquid;
    mesh.receiveShadow = true;
    mesh.userData = { blockType: type, x, y, z };
    scene.add(mesh);
    return mesh;
  }, []);

  const createWorld = useCallback(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    scene.fog = new THREE.Fog(0x87CEEB, 50, 100);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const sunLight = new THREE.DirectionalLight(0xfff5e0, 1.2);
    sunLight.position.set(40, 80, 30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 150;
    sunLight.shadow.camera.left = -50;
    sunLight.shadow.camera.right = 50;
    sunLight.shadow.camera.top = 50;
    sunLight.shadow.camera.bottom = -50;
    scene.add(sunLight);
    const hemiLight = new THREE.HemisphereLight(0x87CEEB, 0x556B2F, 0.4);
    scene.add(hemiLight);

    // Generate world
    const worldData = generateWorld();
    worldDataRef.current = worldData;

    // Create block meshes
    for (let x = 0; x < WORLD_SIZE; x++) {
      for (let z = 0; z < WORLD_SIZE; z++) {
        for (let y = 0; y < WORLD_HEIGHT; y++) {
          const block = worldData.blocks[x][z][y];
          if (!block) continue;

          const neighbors = [
            worldData.blocks[x+1]?.[z]?.[y],
            worldData.blocks[x-1]?.[z]?.[y],
            worldData.blocks[x]?.[z+1]?.[y],
            worldData.blocks[x]?.[z-1]?.[y],
            worldData.blocks[x]?.[z]?.[y+1],
            worldData.blocks[x]?.[z]?.[y-1],
          ];
          
          const isExposed = neighbors.some(n => !n) || x === 0 || x === WORLD_SIZE-1 || z === 0 || z === WORLD_SIZE-1;
          
          if (isExposed) {
            const mesh = createBlockMesh(scene, block.type, x, y, z);
            blockMeshesRef.current.set(getBlockKey(x, y, z), mesh);
          }
        }
      }
    }

    // Pickaxe
    const pickaxe = new THREE.Group();
    const handleGeo = new THREE.BoxGeometry(0.06, 0.55, 0.06);
    const handleMat = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.position.set(0, -0.1, 0);
    pickaxe.add(handle);
    const headGeo = new THREE.BoxGeometry(0.3, 0.08, 0.08);
    const headMat = new THREE.MeshPhongMaterial({ color: 0x888888, shininess: 80 });
    pickaxe.add(new THREE.Mesh(headGeo, headMat).translateX(0.1).translateY(0.18));
    pickaxe.position.set(0.45, -0.35, -0.5);
    pickaxe.rotation.set(0, 0.3, -0.6);
    camera.add(pickaxe);
    scene.add(camera);
    pickaxeRef.current = pickaxe;

    // Portal at portal location
    if (worldData.portalLocation) {
      const { x: px, z: pz } = worldData.portalLocation;
      const py = getSurfaceHeight(worldData.blocks, px, pz) + 2;
      const portalGeo = new THREE.PlaneGeometry(3, 3);
      const portalMat = new THREE.MeshBasicMaterial({ 
        color: 0x9C27B0, 
        transparent: true, 
        opacity: 0.5, 
        side: THREE.DoubleSide 
      });
      const portalMesh = new THREE.Mesh(portalGeo, portalMat);
      portalMesh.position.set(px + 0.5, py, pz + 0.5);
      portalMesh.userData = { isPortal: true };
      scene.add(portalMesh);
      portalMeshRef.current = portalMesh;

      // Portal light
      const portalLight = new THREE.PointLight(0x9C27B0, 2, 10);
      portalLight.position.set(px + 0.5, py, pz + 0.5);
      scene.add(portalLight);
    }

    // Spawn NPCs
    const npcPositions = [
      { x: 20, z: 20 }, { x: 40, z: 15 }, { x: 60, z: 40 },
      { x: 25, z: 55 }, { x: 50, z: 60 }, { x: 15, z: 40 },
    ];
    npcPositions.forEach(pos => {
      const surfaceY = getSurfaceHeight(worldData.blocks, pos.x, pos.z);
      const npc = createNPC(scene, pos.x + 0.5, pos.z + 0.5);
      npc.position.y = surfaceY + 1;
      npc.mesh.position.y = surfaceY + 1;
      npc.target.y = surfaceY + 1;
      npcsRef.current.push(npc);
    });

    // Player spawn
    const spawnX = Math.floor(WORLD_SIZE / 2);
    const spawnZ = Math.floor(WORLD_SIZE / 2);
    const spawnY = getSurfaceHeight(worldData.blocks, spawnX, spawnZ) + 2;
    camera.position.set(spawnX + 0.5, spawnY + 1.5, spawnZ + 0.5);
    playerPosition.current.copy(camera.position);

    // Events
    const handleKeyDown = (e: KeyboardEvent) => { keysRef.current[e.code] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keysRef.current[e.code] = false; };
    const handleMouseMove = (e: MouseEvent) => {
      if (mouseRef.current.locked) {
        eulerRef.current.y -= e.movementX * 0.002;
        eulerRef.current.x -= e.movementY * 0.002;
        eulerRef.current.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, eulerRef.current.x));
        camera.quaternion.setFromEuler(eulerRef.current);
      }
    };
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) mouseRef.current.leftDown = true;
      if (e.button === 2) mouseRef.current.rightDown = true;
    };
    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 0) { mouseRef.current.leftDown = false; onBreakProgress(0, 1, ''); }
      if (e.button === 2) mouseRef.current.rightDown = false;
    };
    const handleContextMenu = (e: Event) => e.preventDefault();
    const handleClick = () => { if (!document.pointerLockElement) renderer.domElement.requestPointerLock(); };
    const handlePointerLockChange = () => { mouseRef.current.locked = document.pointerLockElement === renderer.domElement; };
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('contextmenu', handleContextMenu);
    renderer.domElement.addEventListener('click', handleClick);
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    window.addEventListener('resize', handleResize);

    const revealNeighbors = (x: number, y: number, z: number) => {
      const dirs = [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
      dirs.forEach(([dx, dy, dz]) => {
        const nx = x + dx, ny = y + dy, nz = z + dz;
        if (nx >= 0 && nx < WORLD_SIZE && ny >= 0 && ny < WORLD_HEIGHT && nz >= 0 && nz < WORLD_SIZE) {
          const key = getBlockKey(nx, ny, nz);
          if (worldData.blocks[nx][nz][ny] && !blockMeshesRef.current.has(key)) {
            const mesh = createBlockMesh(scene, worldData.blocks[nx][nz][ny].type, nx, ny, nz);
            blockMeshesRef.current.set(key, mesh);
          }
        }
      });
    };

    const removeBlock = (x: number, y: number, z: number) => {
      const key = getBlockKey(x, y, z);
      const mesh = blockMeshesRef.current.get(key);
      if (mesh) {
        scene.remove(mesh);
        if (Array.isArray(mesh.material)) mesh.material.forEach(m => m.dispose());
        else mesh.material.dispose();
        blockMeshesRef.current.delete(key);
      }
      worldData.blocks[x][z][y] = null as any;
    };

    const createParticles = (pos: THREE.Vector3, color: number) => {
      const count = 10;
      const geo = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        positions[i * 3] = pos.x + (Math.random() - 0.5) * 0.8;
        positions[i * 3 + 1] = pos.y + (Math.random() - 0.5) * 0.8;
        positions[i * 3 + 2] = pos.z + (Math.random() - 0.5) * 0.8;
      }
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.PointsMaterial({ color, size: 0.12, transparent: true, opacity: 1 });
      const points = new THREE.Points(geo, mat);
      scene.add(points);
      particlesRef.current.push(points);
    };

    // Animation loop
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const time = Date.now() * 0.001;
      const dt = 0.016;

      // Movement
      const speed = 0.1;
      const direction = new THREE.Vector3();
      if (keysRef.current['KeyW'] || keysRef.current['ArrowUp']) direction.z -= 1;
      if (keysRef.current['KeyS'] || keysRef.current['ArrowDown']) direction.z += 1;
      if (keysRef.current['KeyA'] || keysRef.current['ArrowLeft']) direction.x -= 1;
      if (keysRef.current['KeyD'] || keysRef.current['ArrowRight']) direction.x += 1;
      direction.normalize();
      direction.applyQuaternion(camera.quaternion);
      direction.y = 0;
      direction.normalize();
      velocityRef.current.x = direction.x * speed;
      velocityRef.current.z = direction.z * speed;
      if (keysRef.current['Space'] && onGroundRef.current) {
        velocityRef.current.y = 0.16;
        onGroundRef.current = false;
      }
      velocityRef.current.y -= 0.007;

      const newX = camera.position.x + velocityRef.current.x;
      const newY = camera.position.y + velocityRef.current.y;
      const newZ = camera.position.z + velocityRef.current.z;
      const feetY = Math.floor(newY - 1.5);

      // X collision
      const checkX = Math.floor(newX + (velocityRef.current.x > 0 ? 0.3 : -0.3));
      const pz = Math.floor(newZ);
      if (checkX >= 0 && checkX < WORLD_SIZE && pz >= 0 && pz < WORLD_SIZE) {
        const b1 = worldData.blocks[checkX]?.[pz]?.[feetY];
        const b2 = worldData.blocks[checkX]?.[pz]?.[feetY + 1];
        if ((b1 && !BLOCK_TYPES[b1.type]?.transparent && !BLOCK_TYPES[b1.type]?.liquid) || 
            (b2 && !BLOCK_TYPES[b2.type]?.transparent && !BLOCK_TYPES[b2.type]?.liquid)) {
          velocityRef.current.x = 0;
        } else {
          camera.position.x = newX;
        }
      } else {
        camera.position.x = Math.max(0.5, Math.min(WORLD_SIZE - 0.5, newX));
      }

      // Z collision
      const checkZ = Math.floor(newZ + (velocityRef.current.z > 0 ? 0.3 : -0.3));
      const cpx = Math.floor(camera.position.x);
      if (cpx >= 0 && cpx < WORLD_SIZE && checkZ >= 0 && checkZ < WORLD_SIZE) {
        const b1 = worldData.blocks[cpx]?.[checkZ]?.[feetY];
        const b2 = worldData.blocks[cpx]?.[checkZ]?.[feetY + 1];
        if ((b1 && !BLOCK_TYPES[b1.type]?.transparent && !BLOCK_TYPES[b1.type]?.liquid) || 
            (b2 && !BLOCK_TYPES[b2.type]?.transparent && !BLOCK_TYPES[b2.type]?.liquid)) {
          velocityRef.current.z = 0;
        } else {
          camera.position.z = newZ;
        }
      } else {
        camera.position.z = Math.max(0.5, Math.min(WORLD_SIZE - 0.5, newZ));
      }

      camera.position.y = newY;
      if (velocityRef.current.y < 0) {
        const groundCheck = Math.floor(camera.position.y - 1.6);
        const gpx = Math.floor(camera.position.x);
        const gpz = Math.floor(camera.position.z);
        if (gpx >= 0 && gpx < WORLD_SIZE && gpz >= 0 && gpz < WORLD_SIZE) {
          const gb = worldData.blocks[gpx]?.[gpz]?.[groundCheck];
          if (gb && !BLOCK_TYPES[gb.type]?.transparent && !BLOCK_TYPES[gb.type]?.liquid) {
            camera.position.y = groundCheck + 2.6;
            velocityRef.current.y = 0;
            onGroundRef.current = true;
          }
        }
      }
      if (velocityRef.current.y > 0) {
        const ceilCheck = Math.floor(camera.position.y + 0.3);
        const cpx2 = Math.floor(camera.position.x);
        const cpz2 = Math.floor(camera.position.z);
        if (cpx2 >= 0 && cpx2 < WORLD_SIZE && cpz2 >= 0 && cpz2 < WORLD_SIZE) {
          const cb = worldData.blocks[cpx2]?.[cpz2]?.[ceilCheck];
          if (cb && !BLOCK_TYPES[cb.type]?.transparent && !BLOCK_TYPES[cb.type]?.liquid) {
            velocityRef.current.y = 0;
          }
        }
      }
      if (camera.position.y < -5) {
        const sx = Math.floor(WORLD_SIZE / 2);
        const sz = Math.floor(WORLD_SIZE / 2);
        const sy = getSurfaceHeight(worldData.blocks, sx, sz) + 3;
        camera.position.set(sx + 0.5, sy, sz + 0.5);
        velocityRef.current.set(0, 0, 0);
      }
      playerPosition.current.copy(camera.position);

      // Pickaxe animation
      if (pickaxeRef.current) {
        if (pickaxeSwingRef.current.swinging) {
          pickaxeSwingRef.current.time += 0.18;
          const t = pickaxeSwingRef.current.time;
          pickaxeRef.current.rotation.x = -Math.sin(t * Math.PI) * 1.5;
          if (t >= 1) {
            pickaxeSwingRef.current.swinging = false;
            pickaxeSwingRef.current.time = 0;
            pickaxeRef.current.rotation.x = 0;
          }
        } else {
          pickaxeRef.current.rotation.x = Math.sin(time * 1.2) * 0.02;
        }
      }

      // Mining
      if (mouseRef.current.leftDown && mouseRef.current.locked) {
        raycasterRef.current.setFromCamera(new THREE.Vector2(0, 0), camera);
        raycasterRef.current.far = 6;
        const allMeshes = Array.from(blockMeshesRef.current.values());
        const intersects = raycasterRef.current.intersectObjects(allMeshes, false);
        if (intersects.length > 0) {
          const hit = intersects[0];
          const mesh = hit.object as THREE.Mesh;
          const { x, y, z } = mesh.userData;
          const blockData = worldData.blocks[x]?.[z]?.[y];
          if (blockData && !BLOCK_TYPES[blockData.type]?.unbreakable) {
            if (swingCooldownRef.current <= 0 && !pickaxeSwingRef.current.swinging) {
              pickaxeSwingRef.current.swinging = true;
              pickaxeSwingRef.current.time = 0;
              swingCooldownRef.current = 0.25;
              const selectedItem = hotbarRef.current[selectedSlotRef.current];
              let toolSpeed = 1;
              if (selectedItem) {
                const itemData = ITEM_TYPES[selectedItem];
                if (itemData?.toolSpeed) toolSpeed = itemData.toolSpeed;
              }
              blockData.health -= toolSpeed;
              const blockTypeData = BLOCK_TYPES[blockData.type];
              const damageRatio = 1 - (blockData.health / blockData.maxHealth);
              if (mesh.material && !Array.isArray(mesh.material)) {
                const baseColor = new THREE.Color(blockTypeData.color);
                baseColor.lerp(new THREE.Color(0x222222), damageRatio * 0.5);
                (mesh.material as THREE.MeshLambertMaterial).color = baseColor;
              }
              createParticles(hit.point, blockTypeData.color);
              onBreakProgress(blockData.maxHealth - blockData.health, blockData.maxHealth, blockTypeData.name);
              if (blockData.health <= 0) {
                createParticles(new THREE.Vector3(x + 0.5, y + 0.5, z + 0.5), blockTypeData.color);
                removeBlock(x, y, z);
                revealNeighbors(x, y, z);
                onBlockMined(blockData.type, x, y, z);
                onBreakProgress(0, 1, '');
              }
            }
          }
        }
      }

      // Place block
      if (mouseRef.current.rightDown && mouseRef.current.locked && placeCooldownRef.current <= 0) {
        const selectedItem = hotbarRef.current[selectedSlotRef.current];
        if (selectedItem) {
          const itemData = ITEM_TYPES[selectedItem];
          if (itemData?.placeable && itemData.blockId) {
            raycasterRef.current.setFromCamera(new THREE.Vector2(0, 0), camera);
            raycasterRef.current.far = 6;
            const allMeshes = Array.from(blockMeshesRef.current.values());
            const intersects = raycasterRef.current.intersectObjects(allMeshes, false);
            if (intersects.length > 0) {
              const hit = intersects[0];
              const normal = hit.face?.normal;
              if (normal) {
                const mesh = hit.object as THREE.Mesh;
                const { x, y, z } = mesh.userData;
                const px = x + Math.round(normal.x);
                const py = y + Math.round(normal.y);
                const pz = z + Math.round(normal.z);
                if (px >= 0 && px < WORLD_SIZE && py >= 0 && py < WORLD_HEIGHT && pz >= 0 && pz < WORLD_SIZE) {
                  if (!worldData.blocks[px][pz][py]) {
                    const playerBlockX = Math.floor(camera.position.x);
                    const playerBlockY = Math.floor(camera.position.y - 1);
                    const playerBlockZ = Math.floor(camera.position.z);
                    if (!(px === playerBlockX && pz === playerBlockZ && (py === playerBlockY || py === playerBlockY + 1))) {
                      const blockId = itemData.blockId;
                      worldData.blocks[px][pz][py] = { type: blockId, health: BLOCK_TYPES[blockId]?.hardness || 3, maxHealth: BLOCK_TYPES[blockId]?.hardness || 3 };
                      const newMesh = createBlockMesh(scene, blockId, px, py, pz);
                      blockMeshesRef.current.set(getBlockKey(px, py, pz), newMesh);
                      onPlaceBlockRef.current(px, py, pz);
                      placeCooldownRef.current = 0.3;
                    }
                  }
                }
              }
            }
          }
        }
      }
      if (placeCooldownRef.current > 0) placeCooldownRef.current -= dt;
      if (swingCooldownRef.current > 0) swingCooldownRef.current -= dt;

      // Crystal pickup
      droppedCrystalsRef.current.forEach(crystal => {
        const dist = camera.position.distanceTo(new THREE.Vector3(crystal.x + 0.5, crystal.y + 0.8, crystal.z + 0.5));
        if (dist < 2) onCrystalPickupRef.current(crystal.id);
      });

      // Animate crystals
      crystalMeshesRef.current.forEach((group) => {
        group.rotation.y += 0.03;
        group.position.y += Math.sin(time * 3) * 0.003;
      });

      // Animate portal
      if (portalMeshRef.current) {
        const mat = portalMeshRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.3 + Math.sin(time * 2) * 0.2;
        portalMeshRef.current.rotation.y = time * 0.5;

        // Check if player is near portal with key
        if (hasPortalKeyRef.current) {
          const dist = camera.position.distanceTo(portalMeshRef.current.position);
          if (dist < 3) {
            onPortalActivated();
          }
        }
      }

      // NPC movement
      npcsRef.current.forEach(npc => {
        const dir = new THREE.Vector3().subVectors(npc.target, npc.position);
        dir.y = 0;
        if (dir.length() < 1) {
          // Pick new target
          npc.target.set(
            npc.position.x + (Math.random() - 0.5) * 15,
            npc.position.y,
            npc.position.z + (Math.random() - 0.5) * 15
          );
          npc.target.x = Math.max(2, Math.min(WORLD_SIZE - 2, npc.target.x));
          npc.target.z = Math.max(2, Math.min(WORLD_SIZE - 2, npc.target.z));
          // Update Y to surface
          const tx = Math.floor(npc.target.x);
          const tz = Math.floor(npc.target.z);
          if (tx >= 0 && tx < WORLD_SIZE && tz >= 0 && tz < WORLD_SIZE) {
            npc.target.y = getSurfaceHeight(worldData.blocks, tx, tz) + 1;
          }
        }
        dir.normalize();
        npc.position.add(dir.multiplyScalar(npc.speed));
        
        // Keep on surface
        const bx = Math.floor(npc.position.x);
        const bz = Math.floor(npc.position.z);
        if (bx >= 0 && bx < WORLD_SIZE && bz >= 0 && bz < WORLD_SIZE) {
          const surfaceY = getSurfaceHeight(worldData.blocks, bx, bz);
          npc.position.y = surfaceY + 1;
        }
        
        npc.mesh.position.copy(npc.position);
        npc.mesh.lookAt(npc.target.x, npc.position.y, npc.target.z);

        // Walking animation
        const walkPhase = time * 5;
        npc.mesh.children.forEach((child, i) => {
          if (i >= 5) { // Legs
            (child as THREE.Mesh).rotation.x = Math.sin(walkPhase + (i === 5 ? 0 : Math.PI)) * 0.5;
          }
          if (i >= 3 && i <= 4) { // Arms
            (child as THREE.Mesh).rotation.x = Math.sin(walkPhase + (i === 3 ? Math.PI : 0)) * 0.3;
          }
        });

        // Greet player when close
        const distToPlayer = npc.position.distanceTo(camera.position);
        if (distToPlayer < 5 && time - npc.lastGreet > 5) {
          npc.lastGreet = time;
          playGreetSound();
        }
      });

      // Particles
      particlesRef.current = particlesRef.current.filter(p => {
        const mat = p.material as THREE.PointsMaterial;
        mat.opacity -= 0.03;
        p.position.y += 0.01;
        if (mat.opacity <= 0) {
          scene.remove(p);
          p.geometry.dispose();
          mat.dispose();
          return false;
        }
        return true;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('contextmenu', handleContextMenu);
      renderer.domElement.removeEventListener('click', handleClick);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    const cleanup = createWorld();
    return cleanup;
  }, [createWorld]);

  return <div ref={mountRef} className="absolute inset-0" />;
}
