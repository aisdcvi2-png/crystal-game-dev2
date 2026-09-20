import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { BLOCK_TYPES, ITEM_TYPES, WORLD_SIZE, WORLD_HEIGHT, generateWorld, getSurfaceHeight, WorldBlock } from '../data/gameData';

interface GameWorldProps {
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
  onCrystalFound, playerPosition, availableCrystals, onBreakProgress, onBlockMined,
  selectedSlot, hotbar, onPlaceBlock, onCrystalPickup, droppedCrystals, onPortalActivated, hasPortalKey
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
  const onGroundRef = useRef(false);
  const hotbarRef = useRef(hotbar);
  const selectedSlotRef = useRef(selectedSlot);
  const onPlaceBlockRef = useRef(onPlaceBlock);
  const onCrystalPickupRef = useRef(onCrystalPickup);
  const droppedCrystalsRef = useRef(droppedCrystals);
  const crystalMeshesRef = useRef<Map<number, THREE.Group>>(new Map());
  const placeCooldownRef = useRef(0);
  const particlesRef = useRef<Array<{ mesh: THREE.Mesh; velocity: THREE.Vector3; life: number }>>([]);
  const portalMeshRef = useRef<THREE.Mesh | null>(null);
  const hasPortalKeyRef = useRef(hasPortalKey);
  const onPortalActivatedRef = useRef(onPortalActivated);

  useEffect(() => { hasPortalKeyRef.current = hasPortalKey; }, [hasPortalKey]);
  useEffect(() => { onPortalActivatedRef.current = onPortalActivated; }, [onPortalActivated]);

  useEffect(() => { hotbarRef.current = hotbar; }, [hotbar]);
  useEffect(() => { selectedSlotRef.current = selectedSlot; }, [selectedSlot]);
  useEffect(() => { onPlaceBlockRef.current = onPlaceBlock; }, [onPlaceBlock]);
  useEffect(() => { onCrystalPickupRef.current = onCrystalPickup; }, [onCrystalPickup]);
  useEffect(() => { droppedCrystalsRef.current = droppedCrystals; }, [droppedCrystals]);

  const getBlockKey = (x: number, y: number, z: number) => `${x},${y},${z}`;

  // Create textured material with pixel pattern
  const createTexturedMaterial = useCallback((color: number): THREE.MeshLambertMaterial => {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d')!;
    
    // Base color
    ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
    ctx.fillRect(0, 0, 16, 16);
    
    // Add pixel noise for texture
    const baseR = (color >> 16) & 255;
    const baseG = (color >> 8) & 255;
    const baseB = color & 255;
    
    for (let px = 0; px < 16; px++) {
      for (let py = 0; py < 16; py++) {
        const noise = (Math.random() - 0.5) * 40;
        const r = Math.max(0, Math.min(255, baseR + noise));
        const g = Math.max(0, Math.min(255, baseG + noise));
        const b = Math.max(0, Math.min(255, baseB + noise));
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(px, py, 1, 1);
      }
    }
    
    // Add grid lines for blocky look
    ctx.strokeStyle = `rgba(0,0,0,0.2)`;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 16; i += 4) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 16);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(16, i);
      ctx.stroke();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    
    return new THREE.MeshLambertMaterial({ map: texture });
  }, []);

  const createBlockMesh = useCallback((scene: THREE.Scene, type: string, x: number, y: number, z: number): THREE.Mesh => {
    const blockType = BLOCK_TYPES[type];
    const geo = new THREE.BoxGeometry(1, 1, 1);
    const mat = createTexturedMaterial(blockType.color);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x + 0.5, y + 0.5, z + 0.5);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = { blockType: type, x, y, z };
    scene.add(mesh);
    return mesh;
  }, [createTexturedMaterial]);

  const createWorld = useCallback(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    scene.fog = new THREE.Fog(0x87CEEB, 40, 80);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(1);
    renderer.shadowMap.enabled = false;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const sunLight = new THREE.DirectionalLight(0xffffff, 0.6);
    sunLight.position.set(40, 80, 30);
    scene.add(sunLight);

    // Generate world
    const worldData = generateWorld();
    worldDataRef.current = worldData;

    // Create block meshes
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

    // Pickaxe
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
    pickaxe.position.set(0.45, -0.35, -0.5);
    pickaxe.rotation.set(0, 0.3, -0.6);
    camera.add(pickaxe);
    scene.add(camera);
    pickaxeRef.current = pickaxe;

    // Player spawn
    const spawnX = Math.floor(WORLD_SIZE / 2);
    const spawnZ = Math.floor(WORLD_SIZE / 2);
    const spawnY = getSurfaceHeight(worldData, spawnX, spawnZ) + 2;
    camera.position.set(spawnX + 0.5, spawnY + 1.5, spawnZ + 0.5);
    playerPosition.current.copy(camera.position);

    // Portal at corner of the world
    const portalX = WORLD_SIZE - 5;
    const portalZ = WORLD_SIZE - 5;
    const portalY = getSurfaceHeight(worldData, portalX, portalZ) + 2;
    
    const portalGeo = new THREE.BoxGeometry(3, 4, 0.5);
    const portalMat = new THREE.MeshBasicMaterial({ 
      color: 0x9C27B0, 
      transparent: true, 
      opacity: 0.7,
    });
    const portalMesh = new THREE.Mesh(portalGeo, portalMat);
    portalMesh.position.set(portalX + 0.5, portalY, portalZ + 0.5);
    scene.add(portalMesh);
    portalMeshRef.current = portalMesh;

    // Portal glow
    const portalLight = new THREE.PointLight(0x9C27B0, 2, 10);
    portalLight.position.set(portalX + 0.5, portalY, portalZ + 0.5);
    scene.add(portalLight);

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
          if (worldData[nx][nz][ny] && !blockMeshesRef.current.has(key)) {
            const mesh = createBlockMesh(scene, worldData[nx][nz][ny].type, nx, ny, nz);
            blockMeshesRef.current.set(key, mesh);
          }
        }
      });
    };

    // Create break particles - floating mini cubes
    const createBreakParticles = (x: number, y: number, z: number, color: number) => {
      const particleCount = 8;
      for (let i = 0; i < particleCount; i++) {
        const size = 0.1 + Math.random() * 0.1;
        const geo = new THREE.BoxGeometry(size, size, size);
        const mat = new THREE.MeshLambertMaterial({ color, transparent: true, opacity: 1 });
        const particle = new THREE.Mesh(geo, mat);
        
        particle.position.set(
          x + 0.5 + (Math.random() - 0.5) * 0.5,
          y + 0.5 + (Math.random() - 0.5) * 0.5,
          z + 0.5 + (Math.random() - 0.5) * 0.5
        );
        
        scene.add(particle);
        
        particlesRef.current.push({
          mesh: particle,
          velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 0.05,
            Math.random() * 0.08 + 0.03,
            (Math.random() - 0.5) * 0.05
          ),
          life: 1.0
        });
      }
    };

    const removeBlock = (x: number, y: number, z: number) => {
      const key = getBlockKey(x, y, z);
      const mesh = blockMeshesRef.current.get(key);
      if (mesh) {
        const blockType = BLOCK_TYPES[(mesh.userData as any).blockType];
        createBreakParticles(x, y, z, blockType.color);
        scene.remove(mesh);
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) mesh.material.forEach(m => m.dispose());
        else mesh.material.dispose();
        blockMeshesRef.current.delete(key);
      }
      worldData[x][z][y] = null as any;
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

      const isSolid = (x: number, y: number, z: number) => {
        if (x < 0 || x >= WORLD_SIZE || y < 0 || y >= WORLD_HEIGHT || z < 0 || z >= WORLD_SIZE) return false;
        return !!worldData[x]?.[z]?.[y];
      };

      // X collision
      const checkX = Math.floor(newX + (velocityRef.current.x > 0 ? 0.3 : -0.3));
      const pz = Math.floor(newZ);
      if (isSolid(checkX, feetY, pz) || isSolid(checkX, feetY + 1, pz)) {
        velocityRef.current.x = 0;
      } else {
        camera.position.x = Math.max(0.5, Math.min(WORLD_SIZE - 0.5, newX));
      }

      // Z collision
      const checkZ = Math.floor(newZ + (velocityRef.current.z > 0 ? 0.3 : -0.3));
      const cpx = Math.floor(camera.position.x);
      if (isSolid(cpx, feetY, checkZ) || isSolid(cpx, feetY + 1, checkZ)) {
        velocityRef.current.z = 0;
      } else {
        camera.position.z = Math.max(0.5, Math.min(WORLD_SIZE - 0.5, newZ));
      }

      // Y collision
      camera.position.y = newY;
      if (velocityRef.current.y < 0) {
        const groundCheck = Math.floor(camera.position.y - 1.6);
        const gpx = Math.floor(camera.position.x);
        const gpz = Math.floor(camera.position.z);
        if (isSolid(gpx, groundCheck, gpz)) {
          camera.position.y = groundCheck + 2.6;
          velocityRef.current.y = 0;
          onGroundRef.current = true;
        }
      } else if (velocityRef.current.y > 0) {
        const ceilCheck = Math.floor(camera.position.y + 0.3);
        const cpx2 = Math.floor(camera.position.x);
        const cpz2 = Math.floor(camera.position.z);
        if (isSolid(cpx2, ceilCheck, cpz2)) {
          velocityRef.current.y = 0;
        }
      }

      if (camera.position.y < -5) {
        const sx = Math.floor(WORLD_SIZE / 2);
        const sz = Math.floor(WORLD_SIZE / 2);
        const sy = getSurfaceHeight(worldData, sx, sz) + 3;
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
        const ray = raycasterRef.current.ray;
        raycasterRef.current.setFromCamera(new THREE.Vector2(0, 0), camera);
        const maxDist = 5;
        const step = 0.2;
        let hitBlock = null;
        
        for (let d = 0; d < maxDist; d += step) {
          const point = ray.at(d, new THREE.Vector3());
          const bx = Math.floor(point.x);
          const by = Math.floor(point.y);
          const bz = Math.floor(point.z);
          
          if (bx >= 0 && bx < WORLD_SIZE && by >= 0 && by < WORLD_HEIGHT && bz >= 0 && bz < WORLD_SIZE) {
            const block = worldData[bx]?.[bz]?.[by];
            if (block) {
              hitBlock = { x: bx, y: by, z: bz, block, point };
              break;
            }
          }
        }
        
        if (hitBlock && !BLOCK_TYPES[hitBlock.block.type]?.unbreakable) {
          if (swingCooldownRef.current <= 0 && !pickaxeSwingRef.current.swinging) {
            pickaxeSwingRef.current.swinging = true;
            pickaxeSwingRef.current.time = 0;
            swingCooldownRef.current = 0.25;
            
            hitBlock.block.health -= 1;
            const blockTypeData = BLOCK_TYPES[hitBlock.block.type];
            const damageRatio = 1 - (hitBlock.block.health / hitBlock.block.maxHealth);
            
            onBreakProgress(hitBlock.block.maxHealth - hitBlock.block.health, hitBlock.block.maxHealth, blockTypeData.name);
            
            const blockKey = getBlockKey(hitBlock.x, hitBlock.y, hitBlock.z);
            const blockMesh = blockMeshesRef.current.get(blockKey);
            if (blockMesh && blockMesh.material && !Array.isArray(blockMesh.material)) {
              const baseColor = new THREE.Color(blockTypeData.color);
              baseColor.lerp(new THREE.Color(0x222222), damageRatio * 0.6);
              (blockMesh.material as THREE.MeshLambertMaterial).color = baseColor;
            }
            
            if (hitBlock.block.health <= 0) {
              removeBlock(hitBlock.x, hitBlock.y, hitBlock.z);
              revealNeighbors(hitBlock.x, hitBlock.y, hitBlock.z);
              onBlockMined(hitBlock.block.type, hitBlock.x, hitBlock.y, hitBlock.z);
              onBreakProgress(0, 1, '');
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
            const ray = raycasterRef.current.ray;
            const maxDist = 5;
            const step = 0.2;
            let lastEmpty = null;
            
            for (let d = 0; d < maxDist; d += step) {
              const point = ray.at(d, new THREE.Vector3());
              const bx = Math.floor(point.x);
              const by = Math.floor(point.y);
              const bz = Math.floor(point.z);
              
              if (bx >= 0 && bx < WORLD_SIZE && by >= 0 && by < WORLD_HEIGHT && bz >= 0 && bz < WORLD_SIZE) {
                const block = worldData[bx]?.[bz]?.[by];
                if (block) {
                  if (lastEmpty) {
                    const { x: px, y: py, z: pz } = lastEmpty;
                    const playerBlockX = Math.floor(camera.position.x);
                    const playerBlockY = Math.floor(camera.position.y - 1);
                    const playerBlockZ = Math.floor(camera.position.z);
                    if (!(px === playerBlockX && pz === playerBlockZ && (py === playerBlockY || py === playerBlockY + 1))) {
                      const blockId = itemData.blockId;
                      worldData[px][pz][py] = { type: blockId, health: BLOCK_TYPES[blockId]?.hardness || 3, maxHealth: BLOCK_TYPES[blockId]?.hardness || 3 };
                      const newMesh = createBlockMesh(scene, blockId, px, py, pz);
                      blockMeshesRef.current.set(getBlockKey(px, py, pz), newMesh);
                      onPlaceBlockRef.current(px, py, pz);
                      placeCooldownRef.current = 0.3;
                    }
                  }
                  break;
                } else if (!block) {
                  lastEmpty = { x: bx, y: by, z: bz };
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
        group.rotation.y += 0.02;
      });

      // Update break particles
      particlesRef.current = particlesRef.current.filter(p => {
        p.mesh.position.add(p.velocity);
        p.velocity.y -= 0.002; // gravity
        p.life -= 0.02;
        (p.mesh.material as THREE.MeshLambertMaterial).opacity = p.life;
        p.mesh.rotation.x += 0.1;
        p.mesh.rotation.y += 0.1;
        
        if (p.life <= 0) {
          scene.remove(p.mesh);
          p.mesh.geometry.dispose();
          (p.mesh.material as THREE.Material).dispose();
          return false;
        }
        return true;
      });

      // Animate portal
      if (portalMeshRef.current) {
        const mat = portalMeshRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.5 + Math.sin(time * 2) * 0.2;
        portalMeshRef.current.rotation.y = time * 0.5;

        // Check if player is near portal with key
        if (hasPortalKeyRef.current) {
          const dist = camera.position.distanceTo(portalMeshRef.current.position);
          if (dist < 4) {
            onPortalActivatedRef.current();
          }
        }
      }

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

  return <div ref={mountRef} className="absolute inset-0" />;
}
