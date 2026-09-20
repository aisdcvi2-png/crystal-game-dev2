import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

interface GameWorldProps {
  crystalsCollected: number;
  totalCrystals: number;
  onCrystalCollected: (crystalId: number) => void;
  playerPosition: React.MutableRefObject<THREE.Vector3>;
  availableCrystals: number[];
}

export default function GameWorld({ crystalsCollected, totalCrystals, onCrystalCollected, playerPosition, availableCrystals }: GameWorldProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const crystalsRef = useRef<THREE.Mesh[]>([]);
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const velocityRef = useRef(new THREE.Vector3());
  const isJumpingRef = useRef(false);
  const animFrameRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0, locked: false });
  const eulerRef = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));

  const createWorld = useCallback(() => {
    if (!mountRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    scene.fog = new THREE.Fog(0x87CEEB, 50, 120);
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
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 80, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 200;
    directionalLight.shadow.camera.left = -60;
    directionalLight.shadow.camera.right = 60;
    directionalLight.shadow.camera.top = 60;
    directionalLight.shadow.camera.bottom = -60;
    scene.add(directionalLight);

    // Ground - Minecraft style blocks
    const groundSize = 60;
    const blockSize = 2;
    const grassColors = [0x4CAF50, 0x43A047, 0x388E3C, 0x66BB6A];
    
    for (let x = -groundSize / 2; x < groundSize / 2; x += blockSize) {
      for (let z = -groundSize / 2; z < groundSize / 2; z += blockSize) {
        const color = grassColors[Math.floor(Math.random() * grassColors.length)];
        const geometry = new THREE.BoxGeometry(blockSize, 0.5, blockSize);
        const material = new THREE.MeshLambertMaterial({ color });
        const block = new THREE.Mesh(geometry, material);
        block.position.set(x, -0.25, z);
        block.receiveShadow = true;
        scene.add(block);
      }
    }

    // Trees (Minecraft style)
    const treePositions = [
      [-15, 0, -15], [20, 0, -10], [-10, 0, 20], [25, 0, 15],
      [-20, 0, -25], [15, 0, 25], [-25, 0, 10], [10, 0, -20],
      [0, 0, -25], [-20, 0, 0], [25, 0, -20], [-15, 0, 25]
    ];

    treePositions.forEach(([x, , z]) => {
      // Trunk
      const trunkGeo = new THREE.BoxGeometry(1, 5, 1);
      const trunkMat = new THREE.MeshLambertMaterial({ color: 0x795548 });
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.set(x, 2.5, z);
      trunk.castShadow = true;
      scene.add(trunk);

      // Leaves
      const leavesGeo = new THREE.BoxGeometry(4, 4, 4);
      const leavesMat = new THREE.MeshLambertMaterial({ color: 0x2E7D32 });
      const leaves = new THREE.Mesh(leavesGeo, leavesMat);
      leaves.position.set(x, 6, z);
      leaves.castShadow = true;
      scene.add(leaves);
    });

    // Some stone blocks scattered
    const stonePositions = [
      [-8, 0, -8], [12, 0, 5], [-5, 0, 12], [8, 0, -12],
      [-18, 0, 8], [18, 0, -8], [5, 0, 18], [-12, 0, -18]
    ];

    stonePositions.forEach(([x, , z]) => {
      const height = Math.random() * 2 + 1;
      const stoneGeo = new THREE.BoxGeometry(2, height, 2);
      const stoneMat = new THREE.MeshLambertMaterial({ color: 0x9E9E9E });
      const stone = new THREE.Mesh(stoneGeo, stoneMat);
      stone.position.set(x, height / 2, z);
      stone.castShadow = true;
      stone.receiveShadow = true;
      scene.add(stone);
    });

    // Crystals
    const crystalColors = [0xE040FB, 0x00BCD4, 0xFFD600, 0xFF1744, 0x76FF03];
    const crystalPositions: [number, number, number][] = [];
    
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const radius = 10 + Math.random() * 15;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      crystalPositions.push([x, 1.5, z]);
    }

    crystalsRef.current = [];
    crystalPositions.forEach(([x, y, z], index) => {
      const crystalGroup = new THREE.Group();
      
      // Main crystal body
      const crystalGeo = new THREE.OctahedronGeometry(0.5, 0);
      const color = crystalColors[index % crystalColors.length];
      const crystalMat = new THREE.MeshPhongMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.85,
        shininess: 100,
      });
      const crystal = new THREE.Mesh(crystalGeo, crystalMat);
      crystal.castShadow = true;
      crystalGroup.add(crystal);

      // Glow effect
      const glowGeo = new THREE.SphereGeometry(0.8, 16, 16);
      const glowMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.15,
      });
      const glow = new THREE.Mesh(glowGeo, glowMat);
      crystalGroup.add(glow);

      // Point light
      const pointLight = new THREE.PointLight(color, 0.5, 5);
      crystalGroup.add(pointLight);

      crystalGroup.position.set(x, y, z);
      crystalGroup.userData = { id: index, collected: false };
      scene.add(crystalGroup);
      crystalsRef.current.push(crystalGroup as unknown as THREE.Mesh);
    });

    // Clouds
    for (let i = 0; i < 10; i++) {
      const cloudGeo = new THREE.BoxGeometry(
        4 + Math.random() * 4,
        1,
        3 + Math.random() * 3
      );
      const cloudMat = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
      const cloud = new THREE.Mesh(cloudGeo, cloudMat);
      cloud.position.set(
        Math.random() * 80 - 40,
        20 + Math.random() * 10,
        Math.random() * 80 - 40
      );
      scene.add(cloud);
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
        eulerRef.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, eulerRef.current.x));
        camera.quaternion.setFromEuler(eulerRef.current);
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
    renderer.domElement.addEventListener('click', handleClick);
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      // Player movement
      const speed = 0.15;
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
        velocityRef.current.y = 0.2;
        isJumpingRef.current = true;
      }

      velocityRef.current.y -= 0.008; // gravity
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
      camera.position.x = Math.max(-28, Math.min(28, camera.position.x));
      camera.position.z = Math.max(-28, Math.min(28, camera.position.z));

      playerPosition.current.copy(camera.position);

      // Animate crystals
      const time = Date.now() * 0.001;
      crystalsRef.current.forEach((crystal, index) => {
        if (!crystal.userData.collected) {
          crystal.rotation.y = time * 2 + index;
          crystal.position.y = 1.5 + Math.sin(time * 2 + index) * 0.3;
        }
      });

      // Check crystal collection
      crystalsRef.current.forEach((crystal, index) => {
        if (!crystal.userData.collected && crystal.visible) {
          const dist = camera.position.distanceTo(crystal.position);
          if (dist < 2.5) {
            crystal.userData.collected = true;
            onCrystalCollected(index);
          }
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('click', handleClick);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [onCrystalCollected, playerPosition]);

  useEffect(() => {
    const cleanup = createWorld();
    return cleanup;
  }, [createWorld]);

  // Update crystal visibility based on available crystals
  useEffect(() => {
    crystalsRef.current.forEach((crystal, index) => {
      if (availableCrystals.includes(index)) {
        crystal.visible = true;
        crystal.userData.collected = false; // Reset so it can be collected again
      } else {
        crystal.visible = false;
        crystal.userData.collected = true;
      }
    });
  }, [availableCrystals]);

  return (
    <div ref={mountRef} className="absolute inset-0" />
  );
}
