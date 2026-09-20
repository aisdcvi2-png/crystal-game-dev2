import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

interface GameWorldProps {
  crystalsCollected: number;
  totalCrystals: number;
  onCrystalCollected: (crystalId: number) => void;
  playerPosition: React.MutableRefObject<THREE.Vector3>;
  availableCrystals: number[];
  onBreakProgress?: (progress: number, maxHealth: number, isOre: boolean) => void;
}

interface OreBlock {
  group: THREE.Group;
  hasCrystal: boolean;
  crystalId: number;
  health: number;
  maxHealth: number;
  breaking: boolean;
  breakProgress: number;
  position: THREE.Vector3;
  originalColor: number;
  crackMeshes: THREE.Mesh[];
}

export default function GameWorld({ crystalsCollected, totalCrystals, onCrystalCollected, playerPosition, availableCrystals, onBreakProgress }: GameWorldProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const velocityRef = useRef(new THREE.Vector3());
  const isJumpingRef = useRef(false);
  const animFrameRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0, locked: false, leftDown: false });
  const eulerRef = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  const pickaxeRef = useRef<THREE.Group | null>(null);
  const pickaxeSwingRef = useRef({ swinging: false, time: 0 });
  const oreBlocksRef = useRef<OreBlock[]>([]);
  const raycasterRef = useRef(new THREE.Raycaster());
  const breakOverlayRef = useRef<THREE.Mesh | null>(null);
  const crystalDropRef = useRef<THREE.Group[]>([]);
  const lastBreakSoundRef = useRef(0);
  const particlesRef = useRef<THREE.Points[]>([]);
  const swingCooldownRef = useRef(0);

  const createPickaxe = (scene: THREE.Scene, camera: THREE.PerspectiveCamera) => {
    const pickaxe = new THREE.Group();

    // Handle (wooden stick)
    const handleGeo = new THREE.BoxGeometry(0.08, 0.6, 0.08);
    const handleMat = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.position.set(0, -0.15, 0);
    handle.rotation.z = -0.3;
    pickaxe.add(handle);

    // Pickaxe head (diamond-like)
    const headShape = new THREE.Shape();
    headShape.moveTo(-0.2, 0);
    headShape.lineTo(0, 0.15);
    headShape.lineTo(0.2, 0);
    headShape.lineTo(0.15, -0.05);
    headShape.lineTo(-0.15, -0.05);
    headShape.closePath();

    const headGeo = new THREE.ExtrudeGeometry(headShape, { depth: 0.06, bevelEnabled: false });
    const headMat = new THREE.MeshPhongMaterial({
      color: 0x00BCD4,
      emissive: 0x004D5A,
      emissiveIntensity: 0.3,
      shininess: 100,
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.set(-0.03, 0.15, -0.03);
    head.rotation.z = -0.3;
    pickaxe.add(head);

    // Binding
    const bindGeo = new THREE.BoxGeometry(0.12, 0.05, 0.12);
    const bindMat = new THREE.MeshLambertMaterial({ color: 0x5D4037 });
    const bind = new THREE.Mesh(bindGeo, bindMat);
    bind.position.set(0, 0.08, 0);
    bind.rotation.z = -0.3;
    pickaxe.add(bind);

    // Position in front of camera
    pickaxe.position.set(0.4, -0.35, -0.5);
    pickaxe.rotation.set(0, 0, -0.5);
    camera.add(pickaxe);
    scene.add(camera);
    pickaxeRef.current = pickaxe;
  };

  const createOreBlocks = (scene: THREE.Scene) => {
    const oreBlocks: OreBlock[] = [];
    const crystalColors = [0xE040FB, 0x00BCD4, 0xFFD600, 0xFF1744, 0x76FF03, 0x2196F3, 0xFF9800, 0x9C27B0];

    // Create stone blocks with crystals inside
    const positions: [number, number, number][] = [];
    
    // Generate random positions for ore blocks
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 5 + Math.random() * 22;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle * radius * 0.1) * radius;
      const clampedX = Math.max(-26, Math.min(26, x));
      const clampedZ = Math.max(-26, Math.min(26, z));
      positions.push([clampedX, 0, clampedZ]);
    }

    positions.forEach((pos, index) => {
      const group = new THREE.Group();
      const hasCrystal = index < 20; // First 20 blocks have crystals
      const crystalId = hasCrystal ? index : -1;

      // Stone block (ore)
      const size = 1.5 + Math.random() * 0.5;
      const blockGeo = new THREE.BoxGeometry(size, size, size);
      
      // Color based on crystal type
      const color = hasCrystal ? crystalColors[index % crystalColors.length] : 0x757575;
      const stoneColor = hasCrystal ? 
        new THREE.Color(color).lerp(new THREE.Color(0x616161), 0.6).getHex() : 
        0x757575;
      
      const blockMat = new THREE.MeshLambertMaterial({ color: stoneColor });
      const block = new THREE.Mesh(blockGeo, blockMat);
      block.castShadow = true;
      block.receiveShadow = true;
      group.add(block);

      // Crystal veins on surface (if has crystal)
      if (hasCrystal) {
        for (let v = 0; v < 4; v++) {
          const veinGeo = new THREE.BoxGeometry(0.15, 0.15, 0.15);
          const veinMat = new THREE.MeshPhongMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.5,
            shininess: 100,
          });
          const vein = new THREE.Mesh(veinGeo, veinMat);
          const face = Math.floor(Math.random() * 6);
          const offset = (Math.random() - 0.5) * size * 0.6;
          const offset2 = (Math.random() - 0.5) * size * 0.6;
          
          switch (face) {
            case 0: vein.position.set(size / 2 + 0.01, offset, offset2); break;
            case 1: vein.position.set(-size / 2 - 0.01, offset, offset2); break;
            case 2: vein.position.set(offset, size / 2 + 0.01, offset2); break;
            case 3: vein.position.set(offset, -size / 2 - 0.01, offset2); break;
            case 4: vein.position.set(offset, offset2, size / 2 + 0.01); break;
            case 5: vein.position.set(offset, offset2, -size / 2 - 0.01); break;
          }
          group.add(vein);
        }

        // Glow effect for ore blocks
        const glowGeo = new THREE.SphereGeometry(size * 0.8, 8, 8);
        const glowMat = new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: 0.08,
        });
        const glow = new THREE.Mesh(glowGeo, glowMat);
        group.add(glow);
      }

      // Crack overlays (hidden initially)
      const crackMeshes: THREE.Mesh[] = [];
      for (let c = 0; c < 4; c++) {
        const crackGeo = new THREE.PlaneGeometry(size * 0.8, size * 0.8);
        const crackMat = new THREE.MeshBasicMaterial({
          color: 0x000000,
          transparent: true,
          opacity: 0,
          side: THREE.DoubleSide,
        });
        const crack = new THREE.Mesh(crackGeo, crackMat);
        
        const face = c;
        switch (face) {
          case 0: crack.position.set(size / 2 + 0.02, 0, 0); crack.rotation.y = Math.PI / 2; break;
          case 1: crack.position.set(-size / 2 - 0.02, 0, 0); crack.rotation.y = Math.PI / 2; break;
          case 2: crack.position.set(0, size / 2 + 0.02, 0); crack.rotation.x = Math.PI / 2; break;
          case 3: crack.position.set(0, 0, size / 2 + 0.02); break;
        }
        crack.visible = false;
        group.add(crack);
        crackMeshes.push(crack);
      }

      group.position.set(pos[0], size / 2, pos[2]);
      group.userData = { type: 'ore', index };
      scene.add(group);

      oreBlocks.push({
        group,
        hasCrystal,
        crystalId,
        health: hasCrystal ? 5 : 3,
        maxHealth: hasCrystal ? 5 : 3,
        breaking: false,
        breakProgress: 0,
        position: new THREE.Vector3(pos[0], size / 2, pos[2]),
        originalColor: stoneColor,
        crackMeshes,
      });
    });

    oreBlocksRef.current = oreBlocks;
  };

  const createWorld = useCallback(() => {
    if (!mountRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    scene.fog = new THREE.Fog(0x1a1a2e, 30, 80);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(0, 3, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.8;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting - darker cave-like atmosphere
    const ambientLight = new THREE.AmbientLight(0x404060, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffeedd, 0.6);
    directionalLight.position.set(30, 50, 30);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 150;
    directionalLight.shadow.camera.left = -40;
    directionalLight.shadow.camera.right = 40;
    directionalLight.shadow.camera.top = 40;
    directionalLight.shadow.camera.bottom = -40;
    scene.add(directionalLight);

    // Point lights for atmosphere
    const torchLight1 = new THREE.PointLight(0xff6600, 0.8, 15);
    torchLight1.position.set(-10, 4, -10);
    scene.add(torchLight1);

    const torchLight2 = new THREE.PointLight(0xff6600, 0.8, 15);
    torchLight2.position.set(10, 4, 10);
    scene.add(torchLight2);

    // Ground - dark stone blocks
    const groundSize = 60;
    const blockSize = 2;
    const groundColors = [0x37474F, 0x455A64, 0x263238, 0x3E4E55];
    
    for (let x = -groundSize / 2; x < groundSize / 2; x += blockSize) {
      for (let z = -groundSize / 2; z < groundSize / 2; z += blockSize) {
        const color = groundColors[Math.floor(Math.random() * groundColors.length)];
        const geometry = new THREE.BoxGeometry(blockSize, 0.5, blockSize);
        const material = new THREE.MeshLambertMaterial({ color });
        const block = new THREE.Mesh(geometry, material);
        block.position.set(x, -0.25, z);
        block.receiveShadow = true;
        scene.add(block);
      }
    }

    // Create ore blocks
    createOreBlocks(scene);

    // Create pickaxe
    createPickaxe(scene, camera);

    // Background decoration - cave walls
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2;
      const radius = 28 + Math.random() * 5;
      const height = 3 + Math.random() * 8;
      const wallGeo = new THREE.BoxGeometry(3, height, 3);
      const wallMat = new THREE.MeshLambertMaterial({ 
        color: new THREE.Color(0x263238).lerp(new THREE.Color(0x1a1a2e), Math.random() * 0.5) 
      });
      const wall = new THREE.Mesh(wallGeo, wallMat);
      wall.position.set(
        Math.cos(angle) * radius,
        height / 2,
        Math.sin(angle) * radius
      );
      wall.castShadow = true;
      scene.add(wall);
    }

    // Ceiling stalactites
    for (let i = 0; i < 15; i++) {
      const stalGeo = new THREE.ConeGeometry(0.3 + Math.random() * 0.5, 2 + Math.random() * 3, 4);
      const stalMat = new THREE.MeshLambertMaterial({ color: 0x455A64 });
      const stal = new THREE.Mesh(stalGeo, stalMat);
      stal.position.set(
        (Math.random() - 0.5) * 50,
        12 + Math.random() * 3,
        (Math.random() - 0.5) * 50
      );
      stal.rotation.x = Math.PI;
      scene.add(stal);
    }

    // Event listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.code] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (mouseRef.current.locked) {
        eulerRef.current.y -= e.movementX * 0.002;
        eulerRef.current.x -= e.movementY * 0.002;
        eulerRef.current.x = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, eulerRef.current.x));
        camera.quaternion.setFromEuler(eulerRef.current);
      }
    };
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        mouseRef.current.leftDown = true;
      }
    };
    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 0) {
        mouseRef.current.leftDown = false;
        // Reset all breaking blocks
        oreBlocksRef.current.forEach(ore => {
          ore.breaking = false;
          ore.breakProgress = 0;
        });
        // Reset break progress in HUD
        if (onBreakProgress) {
          onBreakProgress(0, 1, false);
        }
      }
    };
    const handleClick = () => {
      renderer.domElement.requestPointerLock();
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
    renderer.domElement.addEventListener('click', handleClick);
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const time = Date.now() * 0.001;

      // Player movement
      const speed = 0.12;
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

      // Gravity and jumping
      if (keysRef.current['Space'] && !isJumpingRef.current) {
        velocityRef.current.y = 0.18;
        isJumpingRef.current = true;
      }

      velocityRef.current.y -= 0.008;
      camera.position.x += velocityRef.current.x;
      camera.position.y += velocityRef.current.y;
      camera.position.z += velocityRef.current.z;

      // Ground collision
      if (camera.position.y < 3) {
        camera.position.y = 3;
        velocityRef.current.y = 0;
        isJumpingRef.current = false;
      }

      // Keep player in bounds
      camera.position.x = Math.max(-26, Math.min(26, camera.position.x));
      camera.position.z = Math.max(-26, Math.min(26, camera.position.z));

      playerPosition.current.copy(camera.position);

      // Pickaxe swing animation
      if (pickaxeRef.current) {
        if (pickaxeSwingRef.current.swinging) {
          pickaxeSwingRef.current.time += 0.15;
          const swingAngle = Math.sin(pickaxeSwingRef.current.time * Math.PI) * 1.2;
          pickaxeRef.current.rotation.x = swingAngle;
          pickaxeRef.current.rotation.z = -0.5 + swingAngle * 0.3;
          
          if (pickaxeSwingRef.current.time >= 1) {
            pickaxeSwingRef.current.swinging = false;
            pickaxeSwingRef.current.time = 0;
            pickaxeRef.current.rotation.x = 0;
            pickaxeRef.current.rotation.z = -0.5;
          }
        } else {
          // Idle bobbing
          pickaxeRef.current.rotation.x = Math.sin(time * 1.5) * 0.03;
          pickaxeRef.current.position.y = -0.35 + Math.sin(time * 2) * 0.01;
        }
      }

      // Mining logic - raycast from camera center
      if (mouseRef.current.leftDown && mouseRef.current.locked) {
        raycasterRef.current.setFromCamera(new THREE.Vector2(0, 0), camera);
        
        // Check intersection with ore blocks
        const allMeshes: THREE.Object3D[] = [];
        oreBlocksRef.current.forEach(ore => {
          ore.group.traverse(child => {
            if (child instanceof THREE.Mesh) {
              allMeshes.push(child);
            }
          });
        });

        const intersects = raycasterRef.current.intersectObjects(allMeshes, false);
        
        if (intersects.length > 0 && intersects[0].distance < 5) {
          // Find which ore block was hit
          const hitObject = intersects[0].object;
          let hitOre: OreBlock | null = null;
          
          for (const ore of oreBlocksRef.current) {
            let found = false;
            ore.group.traverse(child => {
              if (child === hitObject) found = true;
            });
            if (found) {
              hitOre = ore;
              break;
            }
          }

          if (hitOre) {
            // Swing cooldown
            if (swingCooldownRef.current <= 0) {
              // Start swing animation
              if (!pickaxeSwingRef.current.swinging) {
                pickaxeSwingRef.current.swinging = true;
                pickaxeSwingRef.current.time = 0;
                swingCooldownRef.current = 0.3;
                
                // Damage the block
                hitOre.breakProgress += 1;
                
                // Notify parent about break progress
                if (onBreakProgress) {
                  onBreakProgress(hitOre.breakProgress, hitOre.maxHealth, hitOre.hasCrystal);
                }
                
                // Show cracks
                const crackLevel = Math.floor((hitOre.breakProgress / hitOre.maxHealth) * 4);
                hitOre.crackMeshes.forEach((crack, i) => {
                  if (i < crackLevel) {
                    crack.visible = true;
                    (crack.material as THREE.MeshBasicMaterial).opacity = 0.3 + (i * 0.15);
                  }
                });

                // Darken block based on damage
                const damageRatio = hitOre.breakProgress / hitOre.maxHealth;
                const blockMesh = hitOre.group.children[0] as THREE.Mesh;
                if (blockMesh && blockMesh.material) {
                  const baseColor = new THREE.Color(hitOre.originalColor);
                  baseColor.lerp(new THREE.Color(0x1a1a1a), damageRatio * 0.5);
                  (blockMesh.material as THREE.MeshLambertMaterial).color = baseColor;
                }

                // Create hit particles
                createHitParticles(scene, intersects[0].point, hitOre.originalColor);

                // Check if block is broken
                if (hitOre.breakProgress >= hitOre.maxHealth) {
                  breakBlock(scene, hitOre);
                }
              }
            }
          }
        }
      }

      // Update swing cooldown
      if (swingCooldownRef.current > 0) {
        swingCooldownRef.current -= 0.016;
      }

      // Animate ore block glow
      oreBlocksRef.current.forEach((ore, index) => {
        if (ore.hasCrystal && ore.breakProgress < ore.maxHealth) {
          const glowChild = ore.group.children.find(c => 
            c instanceof THREE.Mesh && (c as THREE.Mesh).geometry instanceof THREE.SphereGeometry
          );
          if (glowChild) {
            (glowChild as THREE.Mesh).scale.setScalar(1 + Math.sin(time * 3 + index) * 0.1);
          }
          // Pulse veins
          ore.group.children.forEach((child, ci) => {
            if (ci > 0 && ci < 5 && child instanceof THREE.Mesh) {
              const mat = child.material as THREE.MeshPhongMaterial;
              if (mat.emissiveIntensity !== undefined) {
                mat.emissiveIntensity = 0.3 + Math.sin(time * 4 + index + ci) * 0.3;
              }
            }
          });
        }
      });

      // Animate crystal drops
      crystalDropRef.current.forEach((drop, i) => {
        drop.rotation.y += 0.05;
        drop.position.y += Math.sin(time * 3 + i) * 0.005;
      });

      // Update particles
      particlesRef.current = particlesRef.current.filter(p => {
        const mat = p.material as THREE.PointsMaterial;
        mat.opacity -= 0.02;
        p.position.y += 0.02;
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

    const createHitParticles = (scene: THREE.Scene, position: THREE.Vector3, color: number) => {
      const particleCount = 8;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = position.x + (Math.random() - 0.5) * 0.5;
        positions[i * 3 + 1] = position.y + (Math.random() - 0.5) * 0.5;
        positions[i * 3 + 2] = position.z + (Math.random() - 0.5) * 0.5;
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      
      const material = new THREE.PointsMaterial({
        color,
        size: 0.15,
        transparent: true,
        opacity: 1,
      });
      
      const particles = new THREE.Points(geometry, material);
      scene.add(particles);
      particlesRef.current.push(particles);
    };

    const breakBlock = (scene: THREE.Scene, ore: OreBlock) => {
      // Create explosion particles
      for (let i = 0; i < 3; i++) {
        createHitParticles(scene, ore.position.clone().add(new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          Math.random(),
          (Math.random() - 0.5) * 2
        )), ore.originalColor);
      }

      // Remove block from scene
      scene.remove(ore.group);
      
      // If block had a crystal, drop it
      if (ore.hasCrystal && availableCrystals.includes(ore.crystalId)) {
        // Create crystal drop
        const crystalGroup = new THREE.Group();
        const crystalGeo = new THREE.OctahedronGeometry(0.4, 0);
        const crystalColor = ore.originalColor;
        const crystalMat = new THREE.MeshPhongMaterial({
          color: crystalColor,
          emissive: crystalColor,
          emissiveIntensity: 0.5,
          transparent: true,
          opacity: 0.9,
          shininess: 100,
        });
        const crystal = new THREE.Mesh(crystalGeo, crystalMat);
        crystalGroup.add(crystal);

        // Glow
        const glowGeo = new THREE.SphereGeometry(0.6, 8, 8);
        const glowMat = new THREE.MeshBasicMaterial({
          color: crystalColor,
          transparent: true,
          opacity: 0.2,
        });
        const glow = new THREE.Mesh(glowGeo, glowMat);
        crystalGroup.add(glow);

        // Light
        const light = new THREE.PointLight(crystalColor, 1, 5);
        crystalGroup.add(light);

        crystalGroup.position.copy(ore.position);
        crystalGroup.position.y = 1.5;
        scene.add(crystalGroup);
        crystalDropRef.current.push(crystalGroup);

        // Notify parent
        onCrystalCollected(ore.crystalId);

        // Remove drop after delay
        setTimeout(() => {
          scene.remove(crystalGroup);
          crystalDropRef.current = crystalDropRef.current.filter(d => d !== crystalGroup);
        }, 3000);
      }

      // Remove from ore blocks ref
      oreBlocksRef.current = oreBlocksRef.current.filter(o => o !== ore);
    };

    animate();

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      renderer.domElement.removeEventListener('click', handleClick);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [onCrystalCollected, playerPosition, availableCrystals, onBreakProgress]);

  useEffect(() => {
    const cleanup = createWorld();
    return cleanup;
  }, [createWorld]);

  return (
    <div ref={mountRef} className="absolute inset-0" />
  );
}
