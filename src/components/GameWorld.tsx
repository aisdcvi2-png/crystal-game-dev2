import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { BLOCK_TYPES, ITEM_TYPES, WORLD_SIZE, WORLD_HEIGHT, generateWorld, getSurfaceHeight, WorldBlock } from '../data/gameData';

interface GameWorldProps {
  onCrystalFound: (crystalId: number) => void;
  playerPosition: React.MutableRefObject<THREE.Vector3>;
  availableCrystals: number[];
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
  onCrystalFound, playerPosition, availableCrystals, onBlockMined,
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
  const instancedMeshesRef = useRef<Map<string, { mesh: THREE.InstancedMesh; positions: Map<string, number>; originalColors: Map<string, THREE.Color> }>>(new Map());
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
  const blockGeoRef = useRef<THREE.BoxGeometry | null>(null);

  useEffect(() => { hotbarRef.current = hotbar; }, [hotbar]);
  useEffect(() => { selectedSlotRef.current = selectedSlot; }, [selectedSlot]);
  useEffect(() => { onPlaceBlockRef.current = onPlaceBlock; }, [onPlaceBlock]);
  useEffect(() => { onCrystalPickupRef.current = onCrystalPickup; }, [onCrystalPickup]);
  useEffect(() => { droppedCrystalsRef.current = droppedCrystals; }, [droppedCrystals]);
  useEffect(() => { hasPortalKeyRef.current = hasPortalKey; }, [hasPortalKey]);
  useEffect(() => { onPortalActivatedRef.current = onPortalActivated; }, [onPortalActivated]);

  const getBlockKey = (x: number, y: number, z: number) => `${x},${y},${z}`;

  // Create textured material
  const createTexturedMaterial = useCallback((color: number): THREE.MeshLambertMaterial => {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d')!;
    
    ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
    ctx.fillRect(0, 0, 16, 16);
    
    const baseR = (color >> 16) & 255;
    const baseG = (color >> 8) & 255;
    const baseB = color & 255;
    
    for (let px = 0; px < 16; px++) {
      for (let py = 0; py < 16; py++) {
        const noise = (Math.random() - 0.5) * 30;
        const r = Math.max(0, Math.min(255, baseR + noise));
        const g = Math.max(0, Math.min(255, baseG + noise));
        const b = Math.max(0, Math.min(255, baseB + noise));
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(px, py, 1, 1);
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    
    return new THREE.MeshLambertMaterial({ map: texture });
  }, []);

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

    // Shared geometry
    const blockGeo = new THREE.BoxGeometry(1, 1, 1);
    blockGeoRef.current = blockGeo;

    // Group blocks by type for InstancedMesh
    const blocksByType: Map<string, Array<{ x: number; y: number; z: number }>> = new Map();

    for (let x = 0; x < WORLD_SIZE; x++) {
      for (let z = 0; z < WORLD_SIZE; z++) {
        for (let y = 0; y < WORLD_HEIGHT; y++) {
          const block = worldData[x][z][y];
          if (!block) continue;

          // Check if block is exposed (has at least one empty neighbor)
          let isExposed = false;
          
          // Check all 6 directions
          if (!worldData[x+1]?.[z]?.[y]) isExposed = true;
          else if (!worldData[x-1]?.[z]?.[y]) isExposed = true;
          else if (!worldData[x]?.[z+1]?.[y]) isExposed = true;
          else if (!worldData[x]?.[z-1]?.[y]) isExposed = true;
          else if (!worldData[x]?.[z]?.[y+1]) isExposed = true;
          else if (!worldData[x]?.[z]?.[y-1]) isExposed = true;
          
          // Also expose blocks at world boundaries
          if (x === 0 || x === WORLD_SIZE-1 || z === 0 || z === WORLD_SIZE-1) isExposed = true;
          if (y === 0 || y === WORLD_HEIGHT-1) isExposed = true;
          
          if (isExposed) {
            if (!blocksByType.has(block.type)) {
              blocksByType.set(block.type, []);
            }
            blocksByType.get(block.type)!.push({ x, y, z });
          }
        }
      }
    }

    // Create InstancedMesh for each block type with maximum capacity
    const matrix = new THREE.Matrix4();
    const maxBlocksPerType = WORLD_SIZE * WORLD_SIZE * WORLD_HEIGHT;
    
    blocksByType.forEach((positions, type) => {
      const blockType = BLOCK_TYPES[type];
      const material = createTexturedMaterial(blockType.color);
      
      // Create instanced mesh with maximum capacity
      const instancedMesh = new THREE.InstancedMesh(blockGeo, material, maxBlocksPerType);
      instancedMesh.count = positions.length; // Only render visible blocks
      
      const positionMap = new Map<string, number>();
      const color = new THREE.Color();
      
      positions.forEach((pos, index) => {
        matrix.setPosition(pos.x + 0.5, pos.y + 0.5, pos.z + 0.5);
        instancedMesh.setMatrixAt(index, matrix);
        positionMap.set(getBlockKey(pos.x, pos.y, pos.z), index);
        
        // Initialize instance colors
        color.set(blockType.color);
        instancedMesh.setColorAt(index, color);
      });
      
      instancedMesh.instanceMatrix.needsUpdate = true;
      if (instancedMesh.instanceColor) {
        instancedMesh.instanceColor.needsUpdate = true;
      }
      instancedMesh.userData = { blockType: type };
      scene.add(instancedMesh);
      
      // Store original colors for damage visualization
      const originalColors = new Map<string, THREE.Color>();
      positions.forEach((pos) => {
        const key = getBlockKey(pos.x, pos.y, pos.z);
        originalColors.set(key, new THREE.Color(blockType.color));
      });
      
      instancedMeshesRef.current.set(type, { mesh: instancedMesh, positions: positionMap, originalColors });
    });

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

    // Portal
    const portalX = WORLD_SIZE - 5;
    const portalZ = WORLD_SIZE - 5;
    const portalY = getSurfaceHeight(worldData, portalX, portalZ) + 2;
    
    const portalGeo = new THREE.BoxGeometry(3, 4, 0.5);
    const portalMat = new THREE.MeshBasicMaterial({ color: 0x9C27B0, transparent: true, opacity: 0.7 });
    const portalMesh = new THREE.Mesh(portalGeo, portalMat);
    portalMesh.position.set(portalX + 0.5, portalY, portalZ + 0.5);
    scene.add(portalMesh);
    portalMeshRef.current = portalMesh;

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
      if (e.button === 0) { mouseRef.current.leftDown = false; }
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

    // Reveal neighboring blocks when a block is removed
    const revealNeighbors = (x: number, y: number, z: number) => {
      const directions = [
        [1, 0, 0], [-1, 0, 0],
        [0, 1, 0], [0, -1, 0],
        [0, 0, 1], [0, 0, -1]
      ];

      directions.forEach(([dx, dy, dz]) => {
        const nx = x + dx;
        const ny = y + dy;
        const nz = z + dz;

        if (nx < 0 || nx >= WORLD_SIZE || ny < 0 || ny >= WORLD_HEIGHT || nz < 0 || nz >= WORLD_SIZE) {
          return;
        }

        const neighborBlock = worldData[nx][nz][ny];
        if (!neighborBlock) return;

        const key = getBlockKey(nx, ny, nz);
        const typeData = instancedMeshesRef.current.get(neighborBlock.type);
        
        if (typeData && !typeData.positions.has(key)) {
          // This neighbor block should now be visible
          // Use current count as the new index and increment count
          const newIndex = typeData.mesh.count;
          
          matrix.identity();
          matrix.setPosition(nx + 0.5, ny + 0.5, nz + 0.5);
          typeData.mesh.setMatrixAt(newIndex, matrix);
          typeData.mesh.instanceMatrix.needsUpdate = true;
          
          // Initialize color for new block
          const blockType = BLOCK_TYPES[neighborBlock.type];
          const color = new THREE.Color(blockType.color);
          typeData.mesh.setColorAt(newIndex, color);
          if (typeData.mesh.instanceColor) {
            typeData.mesh.instanceColor.needsUpdate = true;
          }
          
          // Store original color
          typeData.originalColors.set(key, color.clone());
          
          typeData.mesh.count++;
          typeData.positions.set(key, newIndex);
        }
      });
    };

    // Remove block from instanced mesh
    const removeBlock = (x: number, y: number, z: number) => {
      const key = getBlockKey(x, y, z);
      const block = worldData[x][z][y];
      if (!block) return;

      const typeData = instancedMeshesRef.current.get(block.type);
      if (typeData) {
        const instanceIndex = typeData.positions.get(key);
        if (instanceIndex !== undefined) {
          // Hide instance by moving it far away
          matrix.identity();
          matrix.setPosition(0, -10000, 0);
          typeData.mesh.setMatrixAt(instanceIndex, matrix);
          typeData.mesh.instanceMatrix.needsUpdate = true;
          typeData.positions.delete(key);
        }
      }

      // Create particles
      const particleCount = 6;
      for (let i = 0; i < particleCount; i++) {
        const size = 0.08 + Math.random() * 0.08;
        const geo = new THREE.BoxGeometry(size, size, size);
        const mat = new THREE.MeshLambertMaterial({ color: BLOCK_TYPES[block.type].color, transparent: true, opacity: 1 });
        const particle = new THREE.Mesh(geo, mat);
        particle.position.set(x + 0.5 + (Math.random() - 0.5) * 0.5, y + 0.5 + (Math.random() - 0.5) * 0.5, z + 0.5 + (Math.random() - 0.5) * 0.5);
        scene.add(particle);
        particlesRef.current.push({
          mesh: particle,
          velocity: new THREE.Vector3((Math.random() - 0.5) * 0.04, Math.random() * 0.06 + 0.02, (Math.random() - 0.5) * 0.04),
          life: 1.0
        });
      }

      worldData[x][z][y] = null as any;
    };

    // Add block to instanced mesh
    const addBlock = (x: number, y: number, z: number, type: string) => {
      const typeData = instancedMeshesRef.current.get(type);
      if (!typeData) return;

      const key = getBlockKey(x, y, z);
      
      // If block already exists, just update position
      if (typeData.positions.has(key)) {
        const index = typeData.positions.get(key)!;
        matrix.identity();
        matrix.setPosition(x + 0.5, y + 0.5, z + 0.5);
        typeData.mesh.setMatrixAt(index, matrix);
        typeData.mesh.instanceMatrix.needsUpdate = true;
        return;
      }

      // Add new block instance
      const newIndex = typeData.mesh.count;
      matrix.identity();
      matrix.setPosition(x + 0.5, y + 0.5, z + 0.5);
      typeData.mesh.setMatrixAt(newIndex, matrix);
      typeData.mesh.instanceMatrix.needsUpdate = true;
      
      // Initialize color for new block
      const blockType = BLOCK_TYPES[type];
      const color = new THREE.Color(blockType.color);
      typeData.mesh.setColorAt(newIndex, color);
      if (typeData.mesh.instanceColor) {
        typeData.mesh.instanceColor.needsUpdate = true;
      }
      
      // Store original color
      typeData.originalColors.set(key, color.clone());
      
      typeData.mesh.count++;
      typeData.positions.set(key, newIndex);
    };

    // Animation loop
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const time = Date.now() * 0.001;

      // Movement - slower speed
      const speed = 0.06;
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
        velocityRef.current.y = 0.18;
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

      const checkX = Math.floor(newX + (velocityRef.current.x > 0 ? 0.3 : -0.3));
      const pz = Math.floor(newZ);
      if (isSolid(checkX, feetY, pz) || isSolid(checkX, feetY + 1, pz)) {
        velocityRef.current.x = 0;
      } else {
        camera.position.x = Math.max(0.5, Math.min(WORLD_SIZE - 0.5, newX));
      }

      const checkZ = Math.floor(newZ + (velocityRef.current.z > 0 ? 0.3 : -0.3));
      const cpx = Math.floor(camera.position.x);
      if (isSolid(cpx, feetY, checkZ) || isSolid(cpx, feetY + 1, checkZ)) {
        velocityRef.current.z = 0;
      } else {
        camera.position.z = Math.max(0.5, Math.min(WORLD_SIZE - 0.5, newZ));
      }

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

      // Pickaxe animation - slower and smoother
      if (pickaxeRef.current) {
        if (pickaxeSwingRef.current.swinging) {
          pickaxeSwingRef.current.time += 0.08; // Slower animation (was 0.18)
          const t = pickaxeSwingRef.current.time;
          
          // Smoother swing with easing
          const swingAngle = Math.sin(t * Math.PI) * 1.2;
          const tiltAngle = Math.sin(t * Math.PI * 0.5) * 0.3;
          
          pickaxeRef.current.rotation.x = -swingAngle;
          pickaxeRef.current.rotation.z = -0.6 + tiltAngle;
          
          if (t >= 1) {
            pickaxeSwingRef.current.swinging = false;
            pickaxeSwingRef.current.time = 0;
            pickaxeRef.current.rotation.x = 0;
            pickaxeRef.current.rotation.z = -0.6;
          }
        } else {
          // Idle animation - gentle bobbing
          pickaxeRef.current.rotation.x = Math.sin(time * 1.5) * 0.03;
          pickaxeRef.current.position.y = -0.35 + Math.sin(time * 2) * 0.01;
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
            swingCooldownRef.current = 0.8; // Slower mining - 0.8 seconds between hits
            
            // Get tool damage from equipped item
            const selectedItem = hotbarRef.current[selectedSlotRef.current];
            let toolDamage = 1; // Hand damage
            if (selectedItem) {
              const itemData = ITEM_TYPES[selectedItem];
              if (itemData?.toolDamage) {
                toolDamage = itemData.toolDamage;
              }
            }
            
            hitBlock.block.health -= toolDamage;
            const blockTypeData = BLOCK_TYPES[hitBlock.block.type];
            
            // Visual damage - darken block based on remaining health
            const key = getBlockKey(hitBlock.x, hitBlock.y, hitBlock.z);
            const typeData = instancedMeshesRef.current.get(hitBlock.block.type);
            if (typeData) {
              const instanceIndex = typeData.positions.get(key);
              if (instanceIndex !== undefined) {
                const originalColor = typeData.originalColors.get(key);
                if (originalColor) {
                  const damageRatio = 1 - (hitBlock.block.health / hitBlock.block.maxHealth);
                  const damagedColor = originalColor.clone();
                  
                  // Create crack effect by darkening
                  if (damageRatio > 0.25) {
                    damagedColor.multiplyScalar(0.8); // 25% darker
                  }
                  if (damageRatio > 0.5) {
                    damagedColor.multiplyScalar(0.7); // 30% darker
                  }
                  if (damageRatio > 0.75) {
                    damagedColor.multiplyScalar(0.6); // 20% darker
                  }
                  
                  // Update instance color
                  typeData.mesh.setColorAt(instanceIndex, damagedColor);
                  if (typeData.mesh.instanceColor) {
                    typeData.mesh.instanceColor.needsUpdate = true;
                  }
                }
              }
            }
            
            if (hitBlock.block.health <= 0) {
              removeBlock(hitBlock.x, hitBlock.y, hitBlock.z);
              revealNeighbors(hitBlock.x, hitBlock.y, hitBlock.z);
              onBlockMined(hitBlock.block.type, hitBlock.x, hitBlock.y, hitBlock.z);
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
                      addBlock(px, py, pz, blockId);
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
      if (placeCooldownRef.current > 0) placeCooldownRef.current -= 0.016;
      if (swingCooldownRef.current > 0) swingCooldownRef.current -= 0.016;

      // Crystal pickup
      droppedCrystalsRef.current.forEach(crystal => {
        const dist = camera.position.distanceTo(new THREE.Vector3(crystal.x + 0.5, crystal.y + 0.8, crystal.z + 0.5));
        if (dist < 2) onCrystalPickupRef.current(crystal.id);
      });

      // Animate crystals
      crystalMeshesRef.current.forEach((group) => {
        group.rotation.y += 0.02;
      });

      // Update particles
      particlesRef.current = particlesRef.current.filter(p => {
        p.mesh.position.add(p.velocity);
        p.velocity.y -= 0.002;
        p.life -= 0.025;
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
  }, [createTexturedMaterial]);

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
