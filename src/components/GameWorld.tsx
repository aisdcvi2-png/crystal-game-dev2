import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { BLOCK_TYPES, ITEM_TYPES, WORLD_SIZE, WORLD_HEIGHT, generateWorld, getSurfaceHeight, WorldBlock } from '../data/gameData';

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
}

export default function GameWorld({
  crystalsCollected, totalCrystals, onCrystalFound, playerPosition,
  availableCrystals, onBreakProgress, onBlockMined, selectedSlot, hotbar,
  onPlaceBlock, onCrystalPickup, droppedCrystals
}: GameWorldProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const velocityRef = useRef(new THREE.Vector3());
  const animFrameRef = useRef<number>(0);
  const mouseRef = useRef({ locked: false, leftDown: false, rightDown: false });
  const eulerRef = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  const pickaxeRef = useRef<THREE.Group | null>(null);
  const pickaxeSwingRef = useRef({ swinging: false, time: 0 });
  const worldDataRef = useRef<WorldBlock[][][]>([]);
  const blockMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
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

  // Keep refs updated
  useEffect(() => { hotbarRef.current = hotbar; }, [hotbar]);
  useEffect(() => { selectedSlotRef.current = selectedSlot; }, [selectedSlot]);
  useEffect(() => { onPlaceBlockRef.current = onPlaceBlock; }, [onPlaceBlock]);
  useEffect(() => { onCrystalPickupRef.current = onCrystalPickup; }, [onCrystalPickup]);
  useEffect(() => { droppedCrystalsRef.current = droppedCrystals; }, [droppedCrystals]);

  // Release pointer lock when needed (e.g. question shown)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && document.pointerLockElement) {
        document.exitPointerLock();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Sync dropped crystals with 3D scene
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Remove meshes for crystals no longer dropped
    crystalMeshesRef.current.forEach((mesh, id) => {
      if (!droppedCrystals.find(c => c.id === id)) {
        scene.remove(mesh);
        crystalMeshesRef.current.delete(id);
      }
    });

    // Add meshes for new dropped crystals
    droppedCrystals.forEach(crystal => {
      if (!crystalMeshesRef.current.has(crystal.id)) {
        const group = new THREE.Group();
        
        // Crystal body
        const crystalGeo = new THREE.OctahedronGeometry(0.35, 0);
        const crystalMat = new THREE.MeshPhongMaterial({
          color: 0xE040FB,
          emissive: 0xE040FB,
          emissiveIntensity: 0.6,
          transparent: true,
          opacity: 0.9,
          shininess: 150,
        });
        const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
        group.add(crystalMesh);

        // Glow
        const glowGeo = new THREE.SphereGeometry(0.6, 16, 16);
        const glowMat = new THREE.MeshBasicMaterial({
          color: 0xE040FB,
          transparent: true,
          opacity: 0.2,
        });
        const glow = new THREE.Mesh(glowGeo, glowMat);
        group.add(glow);

        // Light
        const light = new THREE.PointLight(0xE040FB, 1, 5);
        group.add(light);

        group.position.set(crystal.x + 0.5, crystal.y + 0.8, crystal.z + 0.5);
        scene.add(group);
        crystalMeshesRef.current.set(crystal.id, group);
      }
    });
  }, [droppedCrystals]);

  const getBlockKey = (x: number, y: number, z: number) => `${x},${y},${z}`;

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
    } else {
      const mat = new THREE.MeshLambertMaterial({ 
        color: blockType.color,
        transparent: blockType.transparent || false,
        opacity: blockType.transparent ? 0.5 : 1,
      });
      mesh = new THREE.Mesh(geo, mat);
    }
    
    mesh.position.set(x + 0.5, y + 0.5, z + 0.5);
    mesh.castShadow = !blockType.transparent;
    mesh.receiveShadow = true;
    mesh.userData = { blockType: type, x, y, z };
    scene.add(mesh);
    return mesh;
  }, []);

  const createWorld = useCallback(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    scene.fog = new THREE.Fog(0x87CEEB, 40, 80);
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

    // === BRIGHT LIGHTING ===
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff5e0, 1.2);
    sunLight.position.set(30, 60, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 120;
    sunLight.shadow.camera.left = -40;
    sunLight.shadow.camera.right = 40;
    sunLight.shadow.camera.top = 40;
    sunLight.shadow.camera.bottom = -40;
    scene.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0x87CEEB, 0x556B2F, 0.4);
    scene.add(hemiLight);

    // === GENERATE WORLD ===
    const worldData = generateWorld();
    worldDataRef.current = worldData;

    for (let x = 0; x < WORLD_SIZE; x++) {
      for (let z = 0; z < WORLD_SIZE; z++) {
        for (let y = 0; y < WORLD_HEIGHT; y++) {
          const block = worldData[x][z][y];
          if (!block) continue;

          const neighbors = [
            worldData[x+1]?.[z]?.[y],
            worldData[x-1]?.[z]?.[y],
            worldData[x]?.[z+1]?.[y],
            worldData[x]?.[z-1]?.[y],
            worldData[x]?.[z]?.[y+1],
            worldData[x]?.[z]?.[y-1],
          ];
          
          const isExposed = neighbors.some(n => !n) || x === 0 || x === WORLD_SIZE-1 || z === 0 || z === WORLD_SIZE-1;
          
          if (isExposed) {
            const mesh = createBlockMesh(scene, block.type, x, y, z);
            blockMeshesRef.current.set(getBlockKey(x, y, z), mesh);
          }
        }
      }
    }

    // === PICKAXE ===
    const pickaxe = new THREE.Group();
    const handleGeo = new THREE.BoxGeometry(0.06, 0.55, 0.06);
    const handleMat = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.position.set(0, -0.1, 0);
    pickaxe.add(handle);

    const headGeo = new THREE.BoxGeometry(0.3, 0.08, 0.08);
    const headMat = new THREE.MeshPhongMaterial({ color: 0x888888, shininess: 80 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.set(0.1, 0.18, 0);
    pickaxe.add(head);

    const bindGeo = new THREE.BoxGeometry(0.09, 0.04, 0.09);
    const bindMat = new THREE.MeshLambertMaterial({ color: 0x5D4037 });
    const bind = new THREE.Mesh(bindGeo, bindMat);
    bind.position.set(0, 0.1, 0);
    pickaxe.add(bind);

    pickaxe.position.set(0.45, -0.35, -0.5);
    pickaxe.rotation.set(0, 0.3, -0.6);
    camera.add(pickaxe);
    scene.add(camera);
    pickaxeRef.current = pickaxe;

    // === PLAYER SPAWN ===
    const spawnX = Math.floor(WORLD_SIZE / 2);
    const spawnZ = Math.floor(WORLD_SIZE / 2);
    const spawnY = getSurfaceHeight(worldData, spawnX, spawnZ) + 2;
    camera.position.set(spawnX + 0.5, spawnY + 1.5, spawnZ + 0.5);
    playerPosition.current.copy(camera.position);

    // === EVENT HANDLERS ===
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
      if (e.button === 0) {
        mouseRef.current.leftDown = false;
        onBreakProgress(0, 1, '');
      }
      if (e.button === 2) mouseRef.current.rightDown = false;
    };
    
    const handleContextMenu = (e: Event) => e.preventDefault();
    
    const handleClick = () => { 
      if (!document.pointerLockElement) {
        renderer.domElement.requestPointerLock();
      }
    };
    const handlePointerLockChange = () => {
      mouseRef.current.locked = document.pointerLockElement === renderer.domElement;
    };
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

    // === HELPERS ===
    const revealNeighbors = (x: number, y: number, z: number) => {
      const dirs = [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
      dirs.forEach(([dx, dy, dz]) => {
        const nx = x + dx, ny = y + dy, nz = z + dz;
        if (nx >= 0 && nx < WORLD_SIZE && ny >= 0 && ny < WORLD_HEIGHT && nz >= 0 && nz < WORLD_SIZE) {
          const key = getBlockKey(nx, ny, nz);
          if (worldData[nx][nz][ny] && !blockMeshesRef.current.has(key)) {
            const mesh = createBlockMesh(scene, worldData[nx][nz][ny].type, nx, ny, nz);
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
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(m => m.dispose());
        } else {
          mesh.material.dispose();
        }
        blockMeshesRef.current.delete(key);
      }
      worldData[x][z][y] = null as any;
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

    // === ANIMATION LOOP ===
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const time = Date.now() * 0.001;
      const dt = 0.016;

      // Player movement
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
      const px = Math.floor(newX);
      const pz = Math.floor(newZ);

      // X collision
      const checkX = Math.floor(newX + (velocityRef.current.x > 0 ? 0.3 : -0.3));
      if (checkX >= 0 && checkX < WORLD_SIZE && pz >= 0 && pz < WORLD_SIZE) {
        const blockAtFeet = worldData[checkX]?.[pz]?.[feetY];
        const blockAtBody = worldData[checkX]?.[pz]?.[feetY + 1];
        if ((blockAtFeet && !BLOCK_TYPES[blockAtFeet.type]?.transparent) || 
            (blockAtBody && !BLOCK_TYPES[blockAtBody.type]?.transparent)) {
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
        const blockAtFeet = worldData[cpx]?.[checkZ]?.[feetY];
        const blockAtBody = worldData[cpx]?.[checkZ]?.[feetY + 1];
        if ((blockAtFeet && !BLOCK_TYPES[blockAtFeet.type]?.transparent) || 
            (blockAtBody && !BLOCK_TYPES[blockAtBody.type]?.transparent)) {
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
          const groundBlock = worldData[gpx]?.[gpz]?.[groundCheck];
          if (groundBlock && !BLOCK_TYPES[groundBlock.type]?.transparent) {
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
          const ceilBlock = worldData[cpx2]?.[cpz2]?.[ceilCheck];
          if (ceilBlock && !BLOCK_TYPES[ceilBlock.type]?.transparent) {
            velocityRef.current.y = 0;
          }
        }
      }

      if (camera.position.y < -5) {
        const sx = Math.floor(WORLD_SIZE / 2);
        const sz = Math.floor(WORLD_SIZE / 2);
        const sy = getSurfaceHeight(worldDataRef.current, sx, sz) + 3;
        camera.position.set(sx + 0.5, sy, sz + 0.5);
        velocityRef.current.set(0, 0, 0);
      }

      playerPosition.current.copy(camera.position);

      // === PICKAXE ANIMATION ===
      if (pickaxeRef.current) {
        if (pickaxeSwingRef.current.swinging) {
          pickaxeSwingRef.current.time += 0.18;
          const t = pickaxeSwingRef.current.time;
          pickaxeRef.current.rotation.x = -Math.sin(t * Math.PI) * 1.5;
          pickaxeRef.current.rotation.z = -0.6 + Math.sin(t * Math.PI) * 0.4;
          if (t >= 1) {
            pickaxeSwingRef.current.swinging = false;
            pickaxeSwingRef.current.time = 0;
            pickaxeRef.current.rotation.x = 0;
            pickaxeRef.current.rotation.z = -0.6;
          }
        } else {
          pickaxeRef.current.rotation.x = Math.sin(time * 1.2) * 0.02;
          pickaxeRef.current.position.y = -0.35 + Math.sin(time * 1.8) * 0.008;
        }
      }

      // === MINING ===
      if (mouseRef.current.leftDown && mouseRef.current.locked) {
        raycasterRef.current.setFromCamera(new THREE.Vector2(0, 0), camera);
        raycasterRef.current.far = 6;
        
        const allMeshes = Array.from(blockMeshesRef.current.values());
        const intersects = raycasterRef.current.intersectObjects(allMeshes, false);
        
        if (intersects.length > 0) {
          const hit = intersects[0];
          const mesh = hit.object as THREE.Mesh;
          const { x, y, z } = mesh.userData;
          const blockData = worldData[x]?.[z]?.[y];
          
          if (blockData && !BLOCK_TYPES[blockData.type]?.unbreakable) {
            if (swingCooldownRef.current <= 0) {
              if (!pickaxeSwingRef.current.swinging) {
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
                  const pos = new THREE.Vector3(x + 0.5, y + 0.5, z + 0.5);
                  createParticles(pos, blockTypeData.color);
                  removeBlock(x, y, z);
                  revealNeighbors(x, y, z);
                  onBlockMined(blockData.type, x, y, z);
                  onBreakProgress(0, 1, '');
                }
              }
            }
          }
        }
      }

      // === PLACE BLOCK (right click) ===
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
                  if (!worldData[px][pz][py]) {
                    const playerBlockX = Math.floor(camera.position.x);
                    const playerBlockY = Math.floor(camera.position.y - 1);
                    const playerBlockZ = Math.floor(camera.position.z);
                    if (!(px === playerBlockX && pz === playerBlockZ && (py === playerBlockY || py === playerBlockY + 1))) {
                      const blockId = itemData.blockId;
                      worldData[px][pz][py] = {
                        type: blockId,
                        health: BLOCK_TYPES[blockId]?.hardness || 3,
                        maxHealth: BLOCK_TYPES[blockId]?.hardness || 3,
                      };
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

      // === CRYSTAL PICKUP ===
      droppedCrystalsRef.current.forEach(crystal => {
        const dist = camera.position.distanceTo(new THREE.Vector3(crystal.x + 0.5, crystal.y + 0.8, crystal.z + 0.5));
        if (dist < 2) {
          onCrystalPickupRef.current(crystal.id);
        }
      });

      // === ANIMATE CRYSTALS ===
      crystalMeshesRef.current.forEach((group) => {
        group.rotation.y += 0.03;
        group.position.y += Math.sin(time * 3) * 0.003;
      });

      // === UPDATE PARTICLES ===
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
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    const cleanup = createWorld();
    return cleanup;
  }, [createWorld]);

  return (
    <div ref={mountRef} className="absolute inset-0" />
  );
}
