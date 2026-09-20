// Block types
export interface BlockType {
  id: string;
  name: string;
  color: number;
  hardness: number;
  drops?: { item: string; count: number; chance: number }[];
  rareDrops?: { item: string; count: number; chance: number }[];
  unbreakable?: boolean;
}

// Item types
export interface ItemType {
  id: string;
  name: string;
  description: string;
  category: 'material' | 'tool' | 'block' | 'special';
  stackSize: number;
  durability?: number;
  placeable?: boolean;
  blockId?: string;
}

// Crafting recipes
export interface CraftRecipe {
  id: string;
  name: string;
  description: string;
  ingredients: { item: string; count: number }[];
  result: { item: string; count: number };
  category: 'tools' | 'materials' | 'building';
  requiresQuestion?: boolean;
}

export const TOOL_DURABILITY = {
  wood: 60,
  stone: 132,
  iron: 251,
  diamond: 1562,
};

// Block definitions
export const BLOCK_TYPES: Record<string, BlockType> = {
  bedrock: { id: 'bedrock', name: 'Бедрок', color: 0x1a1a1a, hardness: 999, unbreakable: true },
  stone: { id: 'stone', name: 'Камень', color: 0x7f7f7f, hardness: 4, drops: [{ item: 'cobblestone', count: 1, chance: 1 }], rareDrops: [{ item: 'crystal', count: 1, chance: 0.05 }] },
  coal_ore: { id: 'coal_ore', name: 'Угольная руда', color: 0x4a4a4a, hardness: 4, drops: [{ item: 'coal', count: 1, chance: 1 }], rareDrops: [{ item: 'crystal', count: 1, chance: 0.08 }] },
  iron_ore: { id: 'iron_ore', name: 'Железная руда', color: 0x8a7060, hardness: 5, drops: [{ item: 'iron_ore_item', count: 1, chance: 1 }], rareDrops: [{ item: 'crystal', count: 1, chance: 0.12 }] },
  gold_ore: { id: 'gold_ore', name: 'Золотая руда', color: 0x9a8a50, hardness: 5, drops: [{ item: 'gold_ore_item', count: 1, chance: 1 }], rareDrops: [{ item: 'crystal', count: 1, chance: 0.15 }] },
  diamond_ore: { id: 'diamond_ore', name: 'Алмазная руда', color: 0x5a8a8a, hardness: 6, drops: [{ item: 'diamond', count: 1, chance: 1 }], rareDrops: [{ item: 'crystal', count: 1, chance: 0.25 }] },
  dirt: { id: 'dirt', name: 'Земля', color: 0x8B6914, hardness: 2, drops: [{ item: 'dirt_block', count: 1, chance: 1 }] },
  grass: { id: 'grass', name: 'Трава', color: 0x5a9e3a, hardness: 2, drops: [{ item: 'dirt_block', count: 1, chance: 1 }], rareDrops: [{ item: 'seeds', count: 1, chance: 0.2 }] },
  sand: { id: 'sand', name: 'Песок', color: 0xd4c475, hardness: 1, drops: [{ item: 'sand_block', count: 1, chance: 1 }] },
  oak_log: { id: 'oak_log', name: 'Дуб', color: 0x6B4226, hardness: 3, drops: [{ item: 'oak_log_item', count: 1, chance: 1 }] },
  oak_leaves: { id: 'oak_leaves', name: 'Листва', color: 0x2d7a2d, hardness: 1, rareDrops: [{ item: 'stick', count: 1, chance: 0.2 }] },
};

// Item definitions
export const ITEM_TYPES: Record<string, ItemType> = {
  cobblestone: { id: 'cobblestone', name: 'Булыжник', description: 'Обычный камень', category: 'material', stackSize: 64 },
  coal: { id: 'coal', name: 'Уголь', description: 'Топливо для плавки', category: 'material', stackSize: 64 },
  iron_ingot: { id: 'iron_ingot', name: 'Железный слиток', description: 'Для железных инструментов', category: 'material', stackSize: 64 },
  gold_ingot: { id: 'gold_ingot', name: 'Золотой слиток', description: 'Редкий материал', category: 'material', stackSize: 64 },
  diamond: { id: 'diamond', name: 'Алмаз', description: 'Самый ценный ресурс!', category: 'material', stackSize: 64 },
  stick: { id: 'stick', name: 'Палка', description: 'Основа инструментов', category: 'material', stackSize: 64 },
  seeds: { id: 'seeds', name: 'Семена', description: 'Можно посадить', category: 'material', stackSize: 64 },
  iron_ore_item: { id: 'iron_ore_item', name: 'Железная руда', description: 'Нужно переплавить', category: 'material', stackSize: 64 },
  gold_ore_item: { id: 'gold_ore_item', name: 'Золотая руда', description: 'Нужно переплавить', category: 'material', stackSize: 64 },
  crystal: { id: 'crystal', name: 'Кристалл', description: 'Магический кристалл!', category: 'special', stackSize: 64 },
  oak_log_item: { id: 'oak_log_item', name: 'Древесина', description: 'Бревно дуба', category: 'material', stackSize: 64 },
  
  wood_pickaxe: { id: 'wood_pickaxe', name: 'Деревянная кирка', description: 'Прочность: 60', category: 'tool', stackSize: 1, durability: TOOL_DURABILITY.wood },
  stone_pickaxe: { id: 'stone_pickaxe', name: 'Каменная кирка', description: 'Прочность: 132', category: 'tool', stackSize: 1, durability: TOOL_DURABILITY.stone },
  iron_pickaxe: { id: 'iron_pickaxe', name: 'Железная кирка', description: 'Прочность: 251', category: 'tool', stackSize: 1, durability: TOOL_DURABILITY.iron },
  diamond_pickaxe: { id: 'diamond_pickaxe', name: 'Алмазная кирка', description: 'Прочность: 1562', category: 'tool', stackSize: 1, durability: TOOL_DURABILITY.diamond },
  
  dirt_block: { id: 'dirt_block', name: 'Земля', description: 'Поставь землю', category: 'block', stackSize: 64, placeable: true, blockId: 'dirt' },
  sand_block: { id: 'sand_block', name: 'Песок', description: 'Поставь песок', category: 'block', stackSize: 64, placeable: true, blockId: 'sand' },
};

// Crafting recipes
export const CRAFT_RECIPES: CraftRecipe[] = [
  { id: 'sticks', name: 'Палки', description: '2 доски = 4 палки', ingredients: [{ item: 'oak_log_item', count: 1 }], result: { item: 'stick', count: 4 }, category: 'materials' },
  { id: 'iron_smelt', name: 'Железный слиток', description: 'Руда + уголь', ingredients: [{ item: 'iron_ore_item', count: 1 }, { item: 'coal', count: 1 }], result: { item: 'iron_ingot', count: 1 }, category: 'materials' },
  { id: 'gold_smelt', name: 'Золотой слиток', description: 'Руда + 2 угля', ingredients: [{ item: 'gold_ore_item', count: 1 }, { item: 'coal', count: 2 }], result: { item: 'gold_ingot', count: 1 }, category: 'materials' },
  
  { id: 'wood_pickaxe', name: 'Деревянная кирка', description: 'Базовая кирка', ingredients: [{ item: 'oak_log_item', count: 3 }, { item: 'stick', count: 2 }], result: { item: 'wood_pickaxe', count: 1 }, category: 'tools' },
  { id: 'stone_pickaxe', name: 'Каменная кирка', description: 'Крепкая кирка', ingredients: [{ item: 'cobblestone', count: 3 }, { item: 'stick', count: 2 }], result: { item: 'stone_pickaxe', count: 1 }, category: 'tools', requiresQuestion: true },
  { id: 'iron_pickaxe', name: 'Железная кирка', description: 'Продвинутая кирка', ingredients: [{ item: 'iron_ingot', count: 3 }, { item: 'stick', count: 2 }], result: { item: 'iron_pickaxe', count: 1 }, category: 'tools', requiresQuestion: true },
  { id: 'diamond_pickaxe', name: 'Алмазная кирка', description: 'Лучшая кирка!', ingredients: [{ item: 'diamond', count: 3 }, { item: 'stick', count: 2 }], result: { item: 'diamond_pickaxe', count: 1 }, category: 'tools', requiresQuestion: true },
];

// World generation
export const WORLD_SIZE = 64;
export const WORLD_HEIGHT = 10;

export interface WorldBlock {
  type: string;
  health: number;
  maxHealth: number;
}

function noise(x: number, z: number, seed: number): number {
  const n = Math.sin(x * 12.9898 + z * 78.233 + seed) * 43758.5453;
  return n - Math.floor(n);
}

export function generateWorld(seed?: number): WorldBlock[][][] {
  const worldSeed = seed ?? Math.floor(Math.random() * 100000);
  const world: WorldBlock[][][] = [];

  for (let x = 0; x < WORLD_SIZE; x++) {
    world[x] = [];
    for (let z = 0; z < WORLD_SIZE; z++) {
      world[x][z] = [];
      
      const n1 = noise(x * 0.05, z * 0.05, worldSeed);
      const n2 = noise(x * 0.1, z * 0.1, worldSeed + 100);
      const height = Math.floor(3 + n1 * 3 + n2 * 1.5);

      for (let y = 0; y < WORLD_HEIGHT; y++) {
        let type = '';
        
        if (y === 0) {
          type = 'bedrock';
        } else if (y < height - 2) {
          const oreChance = noise(x * 2 + y, z * 3 + y, worldSeed + y * 5);
          if (oreChance > 0.92) type = 'diamond_ore';
          else if (oreChance > 0.85) type = 'gold_ore';
          else if (oreChance > 0.75) type = 'iron_ore';
          else if (oreChance > 0.65) type = 'coal_ore';
          else type = 'stone';
        } else if (y < height) {
          type = 'dirt';
        } else if (y === height) {
          const surfaceNoise = noise(x * 0.3, z * 0.3, worldSeed + 200);
          if (surfaceNoise > 0.85) type = 'sand';
          else type = 'grass';
        }

        if (type) {
          const blockType = BLOCK_TYPES[type];
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
  for (let i = 0; i < 20; i++) {
    const tx = Math.floor(Math.random() * (WORLD_SIZE - 4)) + 2;
    const tz = Math.floor(Math.random() * (WORLD_SIZE - 4)) + 2;
    
    let surfaceY = -1;
    for (let y = WORLD_HEIGHT - 1; y >= 0; y--) {
      if (world[tx][tz][y] && world[tx][tz][y].type === 'grass') {
        surfaceY = y;
        break;
      }
    }

    if (surfaceY >= 0 && surfaceY + 5 < WORLD_HEIGHT) {
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

export function getSurfaceHeight(world: WorldBlock[][][], x: number, z: number): number {
  for (let y = WORLD_HEIGHT - 1; y >= 0; y--) {
    if (world[x]?.[z]?.[y]) return y;
  }
  return 0;
}
