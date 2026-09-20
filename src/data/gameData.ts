// Block types with properties
export interface BlockType {
  id: string;
  name: string;
  color: number;
  topColor?: number;
  sideColor?: number;
  hardness: number; // hits to break
  tool?: string; // required tool tier
  drops?: { item: string; count: number; chance: number }[];
  rareDrops?: { item: string; count: number; chance: number }[];
  unbreakable?: boolean;
  transparent?: boolean;
  layer: 'bedrock' | 'deep' | 'stone' | 'dirt' | 'surface' | 'tree' | 'ore';
  xp?: number;
}

export interface ItemType {
  id: string;
  name: string;
  icon: string;
  category: 'material' | 'tool' | 'block' | 'special';
  stackSize: number;
  toolTier?: number; // 0=hand, 1=wood, 2=stone, 3=iron, 4=diamond
  toolSpeed?: number;
  placeable?: boolean;
  blockId?: string;
  color?: number;
}

export interface CraftRecipe {
  id: string;
  name: string;
  icon: string;
  ingredients: { item: string; count: number }[];
  result: { item: string; count: number };
  category: 'tools' | 'materials' | 'building';
}

// ============ BLOCK TYPES ============
export const BLOCK_TYPES: Record<string, BlockType> = {
  bedrock: {
    id: 'bedrock', name: 'Бедрок', color: 0x1a1a1a,
    hardness: 999, unbreakable: true, layer: 'bedrock',
  },
  deepslate: {
    id: 'deepslate', name: 'Глубинный сланец', color: 0x3d3d4a,
    hardness: 6, layer: 'deep',
    drops: [{ item: 'cobblestone_deep', count: 1, chance: 1 }],
    rareDrops: [{ item: 'diamond', count: 1, chance: 0.03 }, { item: 'gold_ingot', count: 1, chance: 0.05 }],
  },
  stone: {
    id: 'stone', name: 'Камень', color: 0x7f7f7f,
    hardness: 4, layer: 'stone',
    drops: [{ item: 'cobblestone', count: 1, chance: 1 }],
    rareDrops: [{ item: 'iron_ingot', count: 1, chance: 0.08 }, { item: 'coal', count: 1, chance: 0.12 }],
  },
  coal_ore: {
    id: 'coal_ore', name: 'Угольная руда', color: 0x4a4a4a,
    hardness: 4, layer: 'ore',
    drops: [{ item: 'coal', count: 1, chance: 1 }, { item: 'coal', count: 1, chance: 0.5 }],
    rareDrops: [{ item: 'crystal', count: 1, chance: 0.15 }],
    xp: 2,
  },
  iron_ore: {
    id: 'iron_ore', name: 'Железная руда', color: 0x8a7060,
    hardness: 5, layer: 'ore',
    drops: [{ item: 'iron_ore_item', count: 1, chance: 1 }],
    rareDrops: [{ item: 'crystal', count: 1, chance: 0.2 }],
    xp: 3,
  },
  gold_ore: {
    id: 'gold_ore', name: 'Золотая руда', color: 0x9a8a50,
    hardness: 5, layer: 'ore',
    drops: [{ item: 'gold_ore_item', count: 1, chance: 1 }],
    rareDrops: [{ item: 'crystal', count: 1, chance: 0.25 }],
    xp: 5,
  },
  diamond_ore: {
    id: 'diamond_ore', name: 'Алмазная руда', color: 0x5a8a8a,
    hardness: 6, layer: 'ore',
    drops: [{ item: 'diamond', count: 1, chance: 1 }],
    rareDrops: [{ item: 'crystal', count: 1, chance: 0.4 }, { item: 'diamond', count: 1, chance: 0.3 }],
    xp: 10,
  },
  dirt: {
    id: 'dirt', name: 'Земля', color: 0x8B6914,
    hardness: 2, layer: 'dirt',
    drops: [{ item: 'dirt_block', count: 1, chance: 1 }],
  },
  grass: {
    id: 'grass', name: 'Трава', color: 0x5a9e3a, topColor: 0x5a9e3a, sideColor: 0x8B6914,
    hardness: 2, layer: 'surface',
    drops: [{ item: 'dirt_block', count: 1, chance: 1 }],
    rareDrops: [{ item: 'seeds', count: 1, chance: 0.3 }],
  },
  sand: {
    id: 'sand', name: 'Песок', color: 0xd4c475,
    hardness: 1, layer: 'surface',
    drops: [{ item: 'sand_block', count: 1, chance: 1 }],
  },
  oak_log: {
    id: 'oak_log', name: 'Дуб', color: 0x6B4226,
    hardness: 3, layer: 'tree',
    drops: [{ item: 'oak_log_item', count: 1, chance: 1 }],
  },
  oak_leaves: {
    id: 'oak_leaves', name: 'Листва', color: 0x2d7a2d,
    hardness: 1, transparent: true, layer: 'tree',
    drops: [{ item: 'stick', count: 1, chance: 0.3 }],
    rareDrops: [{ item: 'apple', count: 1, chance: 0.1 }],
  },
  chest: {
    id: 'chest', name: 'Сундук', color: 0x8B6914, topColor: 0xA0722A,
    hardness: 3, layer: 'ore',
    drops: [{ item: 'gold_ingot', count: 2, chance: 1 }, { item: 'diamond', count: 1, chance: 0.5 }],
    rareDrops: [{ item: 'crystal', count: 2, chance: 0.5 }, { item: 'emerald', count: 1, chance: 0.3 }],
    xp: 20,
  },
  planks: {
    id: 'planks', name: 'Доски', color: 0xBC8E4B,
    hardness: 3, layer: 'surface',
    drops: [{ item: 'planks_block', count: 1, chance: 1 }],
  },
  cobblestone_block: {
    id: 'cobblestone_block', name: 'Булыжник', color: 0x6a6a6a,
    hardness: 4, layer: 'stone',
    drops: [{ item: 'cobblestone_block_item', count: 1, chance: 1 }],
  },
  brick_block: {
    id: 'brick_block', name: 'Кирпич', color: 0x9B4A3A,
    hardness: 4, layer: 'stone',
    drops: [{ item: 'brick_block_item', count: 1, chance: 1 }],
  },
  glass_block: {
    id: 'glass_block', name: 'Стекло', color: 0xADD8E6,
    hardness: 1, transparent: true, layer: 'surface',
    drops: [], // drops nothing when broken
  },
  glowstone: {
    id: 'glowstone', name: 'Светокамень', color: 0xFFCC33,
    hardness: 2, layer: 'ore',
    drops: [{ item: 'glowstone_dust', count: 2, chance: 1 }],
    rareDrops: [{ item: 'crystal', count: 1, chance: 0.3 }],
    xp: 5,
  },
};

// ============ ITEM TYPES ============
export const ITEM_TYPES: Record<string, ItemType> = {
  // Materials
  cobblestone: { id: 'cobblestone', name: 'Булыжник', icon: '🪨', category: 'material', stackSize: 64 },
  cobblestone_deep: { id: 'cobblestone_deep', name: 'Глубинный булыжник', icon: '⬛', category: 'material', stackSize: 64 },
  coal: { id: 'coal', name: 'Уголь', icon: '⚫', category: 'material', stackSize: 64 },
  iron_ingot: { id: 'iron_ingot', name: 'Железный слиток', icon: '⬜', category: 'material', stackSize: 64 },
  gold_ingot: { id: 'gold_ingot', name: 'Золотой слиток', icon: '🟡', category: 'material', stackSize: 64 },
  diamond: { id: 'diamond', name: 'Алмаз', icon: '💎', category: 'material', stackSize: 64 },
  emerald: { id: 'emerald', name: 'Изумруд', icon: '🟢', category: 'material', stackSize: 64 },
  stick: { id: 'stick', name: 'Палка', icon: '🥢', category: 'material', stackSize: 64 },
  seeds: { id: 'seeds', name: 'Семена', icon: '🌱', category: 'material', stackSize: 64 },
  apple: { id: 'apple', name: 'Яблоко', icon: '🍎', category: 'material', stackSize: 64 },
  glowstone_dust: { id: 'glowstone_dust', name: 'Светокаменная пыль', icon: '✨', category: 'material', stackSize: 64 },
  iron_ore_item: { id: 'iron_ore_item', name: 'Железная руда', icon: '🔶', category: 'material', stackSize: 64 },
  gold_ore_item: { id: 'gold_ore_item', name: 'Золотая руда', icon: '🟠', category: 'material', stackSize: 64 },
  crystal: { id: 'crystal', name: 'Кристалл', icon: '💠', category: 'special', stackSize: 64 },
  oak_log_item: { id: 'oak_log_item', name: 'Древесина', icon: '🪵', category: 'material', stackSize: 64 },

  // Tools
  wood_pickaxe: { id: 'wood_pickaxe', name: 'Деревянная кирка', icon: '⛏️', category: 'tool', stackSize: 1, toolTier: 1, toolSpeed: 1.5 },
  stone_pickaxe: { id: 'stone_pickaxe', name: 'Каменная кирка', icon: '⛏️', category: 'tool', stackSize: 1, toolTier: 2, toolSpeed: 2.5 },
  iron_pickaxe: { id: 'iron_pickaxe', name: 'Железная кирка', icon: '⛏️', category: 'tool', stackSize: 1, toolTier: 3, toolSpeed: 4 },
  diamond_pickaxe: { id: 'diamond_pickaxe', name: 'Алмазная кирка', icon: '⛏️', category: 'tool', stackSize: 1, toolTier: 4, toolSpeed: 6 },

  // Placeable blocks
  dirt_block: { id: 'dirt_block', name: 'Земля', icon: '🟫', category: 'block', stackSize: 64, placeable: true, blockId: 'dirt', color: 0x8B6914 },
  sand_block: { id: 'sand_block', name: 'Песок', icon: '🟨', category: 'block', stackSize: 64, placeable: true, blockId: 'sand', color: 0xd4c475 },
  planks_block: { id: 'planks_block', name: 'Доски', icon: '🟧', category: 'block', stackSize: 64, placeable: true, blockId: 'planks', color: 0xBC8E4B },
  cobblestone_block_item: { id: 'cobblestone_block_item', name: 'Булыжник', icon: '⬜', category: 'block', stackSize: 64, placeable: true, blockId: 'cobblestone_block', color: 0x6a6a6a },
  brick_block_item: { id: 'brick_block_item', name: 'Кирпичи', icon: '🟥', category: 'block', stackSize: 64, placeable: true, blockId: 'brick_block', color: 0x9B4A3A },
  glass_block_item: { id: 'glass_block_item', name: 'Стекло', icon: '🔲', category: 'block', stackSize: 64, placeable: true, blockId: 'glass_block', color: 0xADD8E6 },
};

// ============ CRAFTING RECIPES ============
export const CRAFT_RECIPES: CraftRecipe[] = [
  // Materials
  { id: 'planks', name: 'Доски', icon: '🟧', ingredients: [{ item: 'oak_log_item', count: 1 }], result: { item: 'planks_block', count: 4 }, category: 'materials' },
  { id: 'sticks', name: 'Палки', icon: '🥢', ingredients: [{ item: 'planks_block', count: 2 }], result: { item: 'stick', count: 4 }, category: 'materials' },
  { id: 'glass', name: 'Стекло', icon: '🔲', ingredients: [{ item: 'sand_block', count: 1 }, { item: 'coal', count: 1 }], result: { item: 'glass_block_item', count: 1 }, category: 'materials' },
  { id: 'bricks', name: 'Кирпичи', icon: '🟥', ingredients: [{ item: 'cobblestone', count: 4 }, { item: 'coal', count: 1 }], result: { item: 'brick_block_item', count: 4 }, category: 'materials' },
  { id: 'iron_smelt', name: 'Железный слиток', icon: '⬜', ingredients: [{ item: 'iron_ore_item', count: 1 }, { item: 'coal', count: 1 }], result: { item: 'iron_ingot', count: 1 }, category: 'materials' },
  { id: 'gold_smelt', name: 'Золотой слиток', icon: '🟡', ingredients: [{ item: 'gold_ore_item', count: 1 }, { item: 'coal', count: 2 }], result: { item: 'gold_ingot', count: 1 }, category: 'materials' },

  // Tools
  { id: 'wood_pickaxe', name: 'Деревянная кирка', icon: '⛏️', ingredients: [{ item: 'planks_block', count: 3 }, { item: 'stick', count: 2 }], result: { item: 'wood_pickaxe', count: 1 }, category: 'tools' },
  { id: 'stone_pickaxe', name: 'Каменная кирка', icon: '⛏️', ingredients: [{ item: 'cobblestone', count: 3 }, { item: 'stick', count: 2 }], result: { item: 'stone_pickaxe', count: 1 }, category: 'tools' },
  { id: 'iron_pickaxe', name: 'Железная кирка', icon: '⛏️', ingredients: [{ item: 'iron_ingot', count: 3 }, { item: 'stick', count: 2 }], result: { item: 'iron_pickaxe', count: 1 }, category: 'tools' },
  { id: 'diamond_pickaxe', name: 'Алмазная кирка', icon: '⛏️', ingredients: [{ item: 'diamond', count: 3 }, { item: 'stick', count: 2 }], result: { item: 'diamond_pickaxe', count: 1 }, category: 'tools' },

  // Building
  { id: 'sand_from_deep', name: 'Песок', icon: '🟨', ingredients: [{ item: 'cobblestone_deep', count: 2 }], result: { item: 'sand_block', count: 1 }, category: 'building' },
];

// ============ WORLD GENERATION ============
export const WORLD_SIZE = 32;
export const WORLD_HEIGHT = 10;

export interface WorldBlock {
  type: string;
  health: number;
  maxHealth: number;
}

// Simple noise function
function noise2D(x: number, z: number, seed: number): number {
  const n = Math.sin(x * 12.9898 + z * 78.233 + seed) * 43758.5453;
  return n - Math.floor(n);
}

function smoothNoise(x: number, z: number, seed: number): number {
  const ix = Math.floor(x);
  const iz = Math.floor(z);
  const fx = x - ix;
  const fz = z - iz;
  
  const a = noise2D(ix, iz, seed);
  const b = noise2D(ix + 1, iz, seed);
  const c = noise2D(ix, iz + 1, seed);
  const d = noise2D(ix + 1, iz + 1, seed);
  
  const ux = fx * fx * (3 - 2 * fx);
  const uz = fz * fz * (3 - 2 * fz);
  
  return a * (1 - ux) * (1 - uz) + b * ux * (1 - uz) + c * (1 - ux) * uz + d * ux * uz;
}

export function generateWorld(): WorldBlock[][][] {
  const world: WorldBlock[][][] = [];
  const seed = Math.random() * 1000;
  
  for (let x = 0; x < WORLD_SIZE; x++) {
    world[x] = [];
    for (let z = 0; z < WORLD_SIZE; z++) {
      world[x][z] = [];
      
      // Terrain height using noise
      const n1 = smoothNoise(x * 0.08, z * 0.08, seed);
      const n2 = smoothNoise(x * 0.15, z * 0.15, seed + 100);
      const height = Math.floor(4 + n1 * 3 + n2 * 1.5);
      
      for (let y = 0; y < WORLD_HEIGHT; y++) {
        let type = 'air';
        
        if (y === 0) {
          type = 'bedrock';
        } else if (y < height - 3) {
          // Deep layers - deepslate with ores
          const oreChance = noise2D(x * 3.7 + y * 2.1, z * 4.3, seed + y * 10);
          if (oreChance > 0.92) type = 'diamond_ore';
          else if (oreChance > 0.85) type = 'gold_ore';
          else if (oreChance > 0.75) type = 'iron_ore';
          else if (oreChance > 0.65) type = 'glowstone';
          else type = 'deepslate';
        } else if (y < height - 1) {
          // Stone layer with ores
          const oreChance = noise2D(x * 2.7 + y * 1.1, z * 3.3, seed + y * 5);
          if (oreChance > 0.88) type = 'iron_ore';
          else if (oreChance > 0.80) type = 'coal_ore';
          else if (oreChance > 0.95) type = 'chest';
          else type = 'stone';
        } else if (y < height) {
          type = 'dirt';
        } else if (y === height) {
          // Surface
          const surfaceNoise = noise2D(x * 0.5, z * 0.5, seed + 200);
          if (surfaceNoise > 0.8) type = 'sand';
          else type = 'grass';
        }
        
        const blockType = BLOCK_TYPES[type];
        if (type !== 'air') {
          world[x][z][y] = {
            type,
            health: blockType.hardness,
            maxHealth: blockType.hardness,
          };
        }
      }
    }
  }
  
  // Add trees
  for (let i = 0; i < 15; i++) {
    const tx = Math.floor(Math.random() * (WORLD_SIZE - 4)) + 2;
    const tz = Math.floor(Math.random() * (WORLD_SIZE - 4)) + 2;
    
    // Find surface
    let surfaceY = -1;
    for (let y = WORLD_HEIGHT - 1; y >= 0; y--) {
      if (world[tx][tz][y] && world[tx][tz][y].type === 'grass') {
        surfaceY = y;
        break;
      }
    }
    
    if (surfaceY >= 0 && surfaceY + 6 < WORLD_HEIGHT) {
      // Trunk
      for (let h = 1; h <= 4; h++) {
        world[tx][tz][surfaceY + h] = { type: 'oak_log', health: 3, maxHealth: 3 };
      }
      // Leaves
      for (let lx = -2; lx <= 2; lx++) {
        for (let lz = -2; lz <= 2; lz++) {
          for (let ly = 3; ly <= 5; ly++) {
            const nx = tx + lx;
            const nz = tz + lz;
            if (nx >= 0 && nx < WORLD_SIZE && nz >= 0 && nz < WORLD_SIZE) {
              if (Math.abs(lx) + Math.abs(lz) < 4 && !world[nx][nz][surfaceY + ly]) {
                if (!(lx === 0 && lz === 0 && ly <= 4)) {
                  world[nx][nz][surfaceY + ly] = { type: 'oak_leaves', health: 1, maxHealth: 1 };
                }
              }
            }
          }
        }
      }
    }
  }
  
  return world;
}

// Get surface height at position
export function getSurfaceHeight(world: WorldBlock[][][], x: number, z: number): number {
  for (let y = WORLD_HEIGHT - 1; y >= 0; y--) {
    if (world[x]?.[z]?.[y]) return y;
  }
  return 0;
}
