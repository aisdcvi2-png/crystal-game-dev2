// Block types
export interface BlockType {
  id: string;
  name: string;
  color: number;
  hardness: number;
  drops?: { item: string; count: number; chance: number }[];
  rareDrops?: { item: string; count: number; chance: number }[];
  unbreakable?: boolean;
  light?: number;
  climbable?: boolean;
  transparent?: boolean;
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
  toolDamage?: number;
  light?: number;
  climbable?: boolean;
  transparent?: boolean;
  plantable?: boolean;
  growsTo?: string;
}

// Crafting recipes
export interface CraftRecipe {
  id: string;
  name: string;
  description: string;
  ingredients: { item: string; count: number }[];
  result: { item: string; count: number };
  category: 'tools' | 'materials' | 'building' | 'special';
  requiresQuestion?: boolean;
  requiresWorkbench?: boolean;
  requiresAdvancedWorkbench?: boolean;
}

// Dropped items on ground
export interface DroppedItem {
  id: string;
  itemId: string;
  x: number;
  y: number;
  z: number;
  pickupTime?: number; // For torches, when they will burn out
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
  stone: { id: 'stone', name: 'Камень', color: 0x7f7f7f, hardness: 8, drops: [{ item: 'cobblestone', count: 1, chance: 1 }], rareDrops: [{ item: 'crystal', count: 1, chance: 0.30 }] },
  coal_ore: { id: 'coal_ore', name: 'Угольная руда', color: 0x4a4a4a, hardness: 8, drops: [{ item: 'coal', count: 1, chance: 1 }], rareDrops: [{ item: 'crystal', count: 1, chance: 0.50 }] },
  iron_ore: { id: 'iron_ore', name: 'Железная руда', color: 0x8a7060, hardness: 10, drops: [{ item: 'iron_ore_item', count: 1, chance: 1 }], rareDrops: [{ item: 'crystal', count: 1, chance: 0.70 }] },
  gold_ore: { id: 'gold_ore', name: 'Золотая руда', color: 0x9a8a50, hardness: 10, drops: [{ item: 'gold_ore_item', count: 1, chance: 1 }], rareDrops: [{ item: 'crystal', count: 1, chance: 0.85 }] },
  diamond_ore: { id: 'diamond_ore', name: 'Алмазная руда', color: 0x5a8a8a, hardness: 12, drops: [{ item: 'diamond', count: 1, chance: 1 }], rareDrops: [{ item: 'crystal', count: 1, chance: 1.0 }] },
  dirt: { id: 'dirt', name: 'Земля', color: 0x8B6914, hardness: 4, drops: [{ item: 'dirt_block', count: 1, chance: 1 }] },
  grass: { id: 'grass', name: 'Трава', color: 0x5a9e3a, hardness: 4, drops: [{ item: 'dirt_block', count: 1, chance: 1 }], rareDrops: [{ item: 'seeds', count: 1, chance: 0.2 }] },
  sand: { id: 'sand', name: 'Песок', color: 0xd4c475, hardness: 3, drops: [{ item: 'sand_block', count: 1, chance: 1 }] },
  oak_log: { id: 'oak_log', name: 'Дуб', color: 0x6B4226, hardness: 6, drops: [{ item: 'oak_log_item', count: 1, chance: 1 }] },
  oak_leaves: { id: 'oak_leaves', name: 'Листва', color: 0x2d7a2d, hardness: 2, rareDrops: [{ item: 'stick', count: 1, chance: 0.2 }] },
  sapling: { id: 'sapling', name: 'Саженец', color: 0x4CAF50, hardness: 1, drops: [{ item: 'seeds', count: 1, chance: 1 }] },
  
  // Utility blocks
  torch: { id: 'torch', name: 'Факел', color: 0xFFA500, hardness: 1, drops: [{ item: 'torch', count: 1, chance: 1 }], light: 14 },
  crafting_table: { id: 'crafting_table', name: 'Верстак 2x2', color: 0x8B4513, hardness: 4, drops: [{ item: 'crafting_table', count: 1, chance: 1 }] },
  advanced_workbench: { id: 'advanced_workbench', name: 'Верстак 3x3', color: 0x654321, hardness: 4, drops: [{ item: 'advanced_workbench', count: 1, chance: 1 }] },
  furnace: { id: 'furnace', name: 'Печь', color: 0x808080, hardness: 6, drops: [{ item: 'furnace', count: 1, chance: 1 }], light: 13 },
  chest: { id: 'chest', name: 'Сундук', color: 0x8B4513, hardness: 4, drops: [{ item: 'chest', count: 1, chance: 1 }] },
  ladder: { id: 'ladder', name: 'Лестница', color: 0xA0522D, hardness: 2, drops: [{ item: 'ladder', count: 1, chance: 1 }], climbable: true },
  glass: { id: 'glass', name: 'Стекло', color: 0xADD8E6, hardness: 1, drops: [], transparent: true },
};

// Item definitions
export const ITEM_TYPES: Record<string, ItemType> = {
  cobblestone: { id: 'cobblestone', name: 'Булыжник', description: 'Обычный камень', category: 'material', stackSize: 64 },
  coal: { id: 'coal', name: 'Уголь', description: 'Топливо для плавки', category: 'material', stackSize: 64 },
  iron_ingot: { id: 'iron_ingot', name: 'Железный слиток', description: 'Для железных инструментов', category: 'material', stackSize: 64 },
  gold_ingot: { id: 'gold_ingot', name: 'Золотой слиток', description: 'Редкий материал', category: 'material', stackSize: 64 },
  diamond: { id: 'diamond', name: 'Алмаз', description: 'Самый ценный ресурс!', category: 'material', stackSize: 64 },
  stick: { id: 'stick', name: 'Палка', description: 'Урон: 2, Прочность: 10', category: 'tool', stackSize: 1, toolDamage: 2, durability: 10 },
  seeds: { id: 'seeds', name: 'Семена', description: 'Посади в землю', category: 'material', stackSize: 64, plantable: true, growsTo: 'oak_log' },
  iron_ore_item: { id: 'iron_ore_item', name: 'Железная руда', description: 'Нужно переплавить', category: 'material', stackSize: 64 },
  gold_ore_item: { id: 'gold_ore_item', name: 'Золотая руда', description: 'Нужно переплавить', category: 'material', stackSize: 64 },
  crystal: { id: 'crystal', name: 'Кристалл', description: 'Магический кристалл!', category: 'special', stackSize: 64 },
  portal_key: { id: 'portal_key', name: 'Ключ портала', description: 'Открывает портал в новый мир!', category: 'special', stackSize: 1 },
  oak_log_item: { id: 'oak_log_item', name: 'Древесина', description: 'Бревно дуба', category: 'material', stackSize: 64 },
  
  wood_pickaxe: { id: 'wood_pickaxe', name: 'Деревянная кирка', description: 'Прочность: 60, Урон: 1', category: 'tool', stackSize: 1, durability: TOOL_DURABILITY.wood, toolDamage: 1 },
  stone_pickaxe: { id: 'stone_pickaxe', name: 'Каменная кирка', description: 'Прочность: 132, Урон: 2', category: 'tool', stackSize: 1, durability: TOOL_DURABILITY.stone, toolDamage: 2 },
  iron_pickaxe: { id: 'iron_pickaxe', name: 'Железная кирка', description: 'Прочность: 251, Урон: 3', category: 'tool', stackSize: 1, durability: TOOL_DURABILITY.iron, toolDamage: 3 },
  diamond_pickaxe: { id: 'diamond_pickaxe', name: 'Алмазная кирка', description: 'Прочность: 1562, Урон: 4', category: 'tool', stackSize: 1, durability: TOOL_DURABILITY.diamond, toolDamage: 4 },
  
  // Utility blocks
  torch: { id: 'torch', name: 'Факел', description: 'Освещает пещеры', category: 'block', stackSize: 64, placeable: true, blockId: 'torch', light: 14 },
  crafting_table: { id: 'crafting_table', name: 'Верстак 2x2', description: 'Базовый верстак', category: 'block', stackSize: 64, placeable: true, blockId: 'crafting_table' },
  advanced_workbench: { id: 'advanced_workbench', name: 'Верстак 3x3', description: 'Продвинутый верстак', category: 'block', stackSize: 64, placeable: true, blockId: 'advanced_workbench' },
  furnace: { id: 'furnace', name: 'Печь', description: 'Для плавки руды', category: 'block', stackSize: 64, placeable: true, blockId: 'furnace', light: 13 },
  chest: { id: 'chest', name: 'Сундук', description: 'Храни предметы', category: 'block', stackSize: 64, placeable: true, blockId: 'chest' },
  ladder: { id: 'ladder', name: 'Лестница', description: 'Для подъёма', category: 'block', stackSize: 64, placeable: true, blockId: 'ladder', climbable: true },
  glass: { id: 'glass', name: 'Стекло', description: 'Прозрачный блок', category: 'block', stackSize: 64, placeable: true, blockId: 'glass', transparent: true },
  
  dirt_block: { id: 'dirt_block', name: 'Земля', description: 'Поставь землю', category: 'block', stackSize: 64, placeable: true, blockId: 'dirt' },
  sand_block: { id: 'sand_block', name: 'Песок', description: 'Поставь песок', category: 'block', stackSize: 64, placeable: true, blockId: 'sand' },
};

// Crafting recipes - Minecraft style
export const CRAFT_RECIPES: CraftRecipe[] = [
  // Basic materials (2x2 crafting, always available)
  { id: 'planks', name: 'Доски', description: '1 бревно = 4 доски', ingredients: [{ item: 'oak_log_item', count: 1 }], result: { item: 'planks_block', count: 4 }, category: 'materials' },
  { id: 'sticks', name: 'Палки', description: '2 доски = 4 палки', ingredients: [{ item: 'planks_block', count: 2 }], result: { item: 'stick', count: 4 }, category: 'materials' },
  
  // Advanced workbench (3x3 crafting)
  { id: 'advanced_workbench', name: 'Верстак 3x3', description: '4 доски + 4 камня', ingredients: [{ item: 'planks_block', count: 4 }, { item: 'cobblestone', count: 4 }], result: { item: 'advanced_workbench', count: 1 }, category: 'building' },
  
  // Advanced materials (requires advanced workbench 3x3)
  { id: 'torch', name: 'Факел', description: 'Уголь + палка = 4 факела', ingredients: [{ item: 'coal', count: 1 }, { item: 'stick', count: 1 }], result: { item: 'torch', count: 4 }, category: 'materials', requiresAdvancedWorkbench: true },
  { id: 'iron_smelt', name: 'Железный слиток', description: 'Руда + уголь', ingredients: [{ item: 'iron_ore_item', count: 1 }, { item: 'coal', count: 1 }], result: { item: 'iron_ingot', count: 1 }, category: 'materials', requiresAdvancedWorkbench: true },
  { id: 'gold_smelt', name: 'Золотой слиток', description: 'Руда + 2 угля', ingredients: [{ item: 'gold_ore_item', count: 1 }, { item: 'coal', count: 2 }], result: { item: 'gold_ingot', count: 1 }, category: 'materials', requiresAdvancedWorkbench: true },
  { id: 'glass', name: 'Стекло', description: 'Песок + уголь = 4 стекла', ingredients: [{ item: 'sand_block', count: 1 }, { item: 'coal', count: 1 }], result: { item: 'glass', count: 4 }, category: 'materials', requiresAdvancedWorkbench: true },
  { id: 'bricks', name: 'Кирпичи', description: '4 камня + уголь = 4 кирпича', ingredients: [{ item: 'cobblestone', count: 4 }, { item: 'coal', count: 1 }], result: { item: 'brick_block_item', count: 4 }, category: 'materials', requiresAdvancedWorkbench: true },
  
  // Tools (requires advanced workbench)
  { id: 'wood_pickaxe', name: 'Деревянная кирка', description: '3 доски + 2 палки', ingredients: [{ item: 'planks_block', count: 3 }, { item: 'stick', count: 2 }], result: { item: 'wood_pickaxe', count: 1 }, category: 'tools', requiresAdvancedWorkbench: true },
  { id: 'stone_pickaxe', name: 'Каменная кирка', description: '3 камня + 2 палки', ingredients: [{ item: 'cobblestone', count: 3 }, { item: 'stick', count: 2 }], result: { item: 'stone_pickaxe', count: 1 }, category: 'tools', requiresAdvancedWorkbench: true, requiresQuestion: true },
  { id: 'iron_pickaxe', name: 'Железная кирка', description: '3 слитка + 2 палки', ingredients: [{ item: 'iron_ingot', count: 3 }, { item: 'stick', count: 2 }], result: { item: 'iron_pickaxe', count: 1 }, category: 'tools', requiresAdvancedWorkbench: true, requiresQuestion: true },
  { id: 'diamond_pickaxe', name: 'Алмазная кирка', description: '3 алмаза + 2 палки', ingredients: [{ item: 'diamond', count: 3 }, { item: 'stick', count: 2 }], result: { item: 'diamond_pickaxe', count: 1 }, category: 'tools', requiresAdvancedWorkbench: true, requiresQuestion: true },
  
  // Building blocks (requires advanced workbench)
  { id: 'furnace', name: 'Печь', description: '8 камней', ingredients: [{ item: 'cobblestone', count: 8 }], result: { item: 'furnace', count: 1 }, category: 'building', requiresAdvancedWorkbench: true },
  { id: 'chest', name: 'Сундук', description: '8 досок', ingredients: [{ item: 'planks_block', count: 8 }], result: { item: 'chest', count: 1 }, category: 'building', requiresAdvancedWorkbench: true },
  { id: 'ladder', name: 'Лестница', description: '7 палок = 3 лестницы', ingredients: [{ item: 'stick', count: 7 }], result: { item: 'ladder', count: 3 }, category: 'building', requiresAdvancedWorkbench: true },
  { id: 'glass_block', name: 'Стеклянный блок', description: '4 стекла', ingredients: [{ item: 'glass', count: 4 }], result: { item: 'glass_block_item', count: 1 }, category: 'building', requiresAdvancedWorkbench: true },
  
  // Special (requires advanced workbench)
  { id: 'portal_key', name: 'Ключ портала', description: '20 кристаллов + 5 алмазов', ingredients: [{ item: 'crystal', count: 20 }, { item: 'diamond', count: 5 }], result: { item: 'portal_key', count: 1 }, category: 'special', requiresAdvancedWorkbench: true },
];

// World generation
export const WORLD_SIZE = 64;
export const WORLD_HEIGHT = 32;

export interface WorldBlock {
  type: string;
  health: number;
  maxHealth: number;
}

// Improved noise functions for smoother terrain
function hash(x: number, z: number, seed: number): number {
  let h = seed + x * 374761393 + z * 668265263;
  h = (h ^ (h >> 13)) * 1274126177;
  h = h ^ (h >> 16);
  return (h & 0x7fffffff) / 0x7fffffff;
}

function smoothNoise(x: number, z: number, seed: number): number {
  const ix = Math.floor(x);
  const iz = Math.floor(z);
  const fx = x - ix;
  const fz = z - iz;
  
  // Smooth interpolation
  const ux = fx * fx * (3 - 2 * fx);
  const uz = fz * fz * (3 - 2 * fz);
  
  const a = hash(ix, iz, seed);
  const b = hash(ix + 1, iz, seed);
  const c = hash(ix, iz + 1, seed);
  const d = hash(ix + 1, iz + 1, seed);
  
  return a + (b - a) * ux + (c - a) * uz + (a - b - c + d) * ux * uz;
}

function fbm(x: number, z: number, seed: number, octaves: number = 4): number {
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let maxValue = 0;
  
  for (let i = 0; i < octaves; i++) {
    value += smoothNoise(x * frequency, z * frequency, seed + i * 100) * amplitude;
    maxValue += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }
  
  return value / maxValue;
}

function noise(x: number, z: number, seed: number): number {
  return fbm(x, z, seed, 3);
}

export function generateWorld(seed?: number): WorldBlock[][][] {
  const worldSeed = seed ?? Math.floor(Math.random() * 100000);
  const world: WorldBlock[][][] = [];

  for (let x = 0; x < WORLD_SIZE; x++) {
    world[x] = [];
    for (let z = 0; z < WORLD_SIZE; z++) {
      world[x][z] = [];
      
      // Higher terrain with more variation
      const baseHeight = fbm(x * 0.02, z * 0.02, worldSeed, 4);
      const detail = fbm(x * 0.06, z * 0.06, worldSeed + 100, 3);
      const height = Math.floor(5 + baseHeight * 6 + detail * 2);

      for (let y = 0; y < WORLD_HEIGHT; y++) {
        let type = '';
        
        if (y === 0) {
          type = 'bedrock';
        } else if (y < height - 2) {
          // Geological distribution - ores by depth
          const depth = height - y;
          const oreChance = noise(x * 2 + y, z * 3 + y, worldSeed + y * 5);
          
          if (y <= 4 && oreChance > 0.85) {
            // Diamonds only in deepest layers (y <= 4)
            type = 'diamond_ore';
          } else if (y <= 8 && oreChance > 0.75) {
            // Gold in deep layers (y <= 8)
            type = 'gold_ore';
          } else if (y <= 12 && oreChance > 0.60) {
            // Iron in middle-deep layers (y <= 12)
            type = 'iron_ore';
          } else if (y <= 16 && oreChance > 0.40) {
            // Coal in upper layers (y <= 16)
            type = 'coal_ore';
          } else {
            type = 'stone';
          }
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

  // Add many trees with guaranteed generation
  for (let tx = 3; tx < WORLD_SIZE - 3; tx += 5) {
    for (let tz = 3; tz < WORLD_SIZE - 3; tz += 5) {
      // Random chance to place tree
      if (Math.random() > 0.7) continue;
      
      let surfaceY = -1;
      for (let y = WORLD_HEIGHT - 1; y >= 0; y--) {
        if (world[tx]?.[tz]?.[y] && world[tx][tz][y].type === 'grass') {
          surfaceY = y;
          break;
        }
      }

      if (surfaceY >= 0 && surfaceY + 8 < WORLD_HEIGHT) {
        const treeHeight = 5 + Math.floor(Math.random() * 2);
        
        // Trunk
        for (let h = 1; h <= treeHeight; h++) {
          world[tx][tz][surfaceY + h] = { type: 'oak_log', health: 3, maxHealth: 3 };
        }
        
        // Leaves - big round crown
        for (let ly = treeHeight - 1; ly <= treeHeight + 2; ly++) {
          const radius = ly >= treeHeight + 1 ? 1 : 2;
          for (let lx = -radius; lx <= radius; lx++) {
            for (let lz = -radius; lz <= radius; lz++) {
              const nx = tx + lx;
              const nz = tz + lz;
              
              if (nx >= 0 && nx < WORLD_SIZE && nz >= 0 && nz < WORLD_SIZE) {
                if (!world[nx][nz][surfaceY + ly]) {
                  if (!(lx === 0 && lz === 0 && ly <= treeHeight)) {
                    world[nx][nz][surfaceY + ly] = { type: 'oak_leaves', health: 1, maxHealth: 1 };
                  }
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
