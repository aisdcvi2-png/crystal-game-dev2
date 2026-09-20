// Block types with properties
export interface BlockType {
  id: string;
  name: string;
  description: string;
  color: number;
  topColor?: number;
  sideColor?: number;
  hardness: number;
  tool?: string;
  drops?: { item: string; count: number; chance: number }[];
  rareDrops?: { item: string; count: number; chance: number }[];
  unbreakable?: boolean;
  transparent?: boolean;
  layer: 'bedrock' | 'deep' | 'stone' | 'dirt' | 'surface' | 'tree' | 'ore';
  xp?: number;
  plantable?: boolean;
}

export interface ItemType {
  id: string;
  name: string;
  description: string;
  category: 'material' | 'tool' | 'block' | 'special' | 'food';
  stackSize: number;
  toolTier?: number;
  toolSpeed?: number;
  durability?: number;
  placeable?: boolean;
  blockId?: string;
  color?: number;
  plantable?: boolean;
  growsTo?: string;
}

export interface CraftRecipe {
  id: string;
  name: string;
  description: string;
  ingredients: { item: string; count: number }[];
  result: { item: string; count: number };
  category: 'tools' | 'materials' | 'building' | 'special';
  requiresQuestion?: boolean;
}

// Tool durability values (from Minecraft)
export const TOOL_DURABILITY = {
  wood: 60,
  stone: 132,
  iron: 251,
  diamond: 1562,
};

// Tool speed multipliers
export const TOOL_SPEED = {
  hand: 1,
  wood: 2,
  stone: 4,
  iron: 6,
  diamond: 8,
};

// ============ BLOCK TYPES ============
export const BLOCK_TYPES: Record<string, BlockType> = {
  bedrock: {
    id: 'bedrock', name: 'Бедрок', description: 'Неразрушимый камень в основе мира',
    color: 0x1a1a1a, hardness: 999, unbreakable: true, layer: 'bedrock',
  },
  deepslate: {
    id: 'deepslate', name: 'Глубинный сланец', description: 'Очень твёрдый камень из глубин',
    color: 0x3d3d4a, hardness: 6, layer: 'deep',
    drops: [{ item: 'cobblestone_deep', count: 1, chance: 1 }],
    rareDrops: [{ item: 'diamond', count: 1, chance: 0.02 }],
  },
  stone: {
    id: 'stone', name: 'Камень', description: 'Обычный камень, основа подземелий',
    color: 0x7f7f7f, hardness: 4, layer: 'stone',
    drops: [{ item: 'cobblestone', count: 1, chance: 1 }],
    rareDrops: [{ item: 'coal', count: 1, chance: 0.1 }],
  },
  coal_ore: {
    id: 'coal_ore', name: 'Угольная руда', description: 'Содержит уголь — топливо для крафта',
    color: 0x4a4a4a, hardness: 4, layer: 'ore',
    drops: [{ item: 'coal', count: 1, chance: 1 }],
    rareDrops: [{ item: 'crystal', count: 1, chance: 0.08 }],
    xp: 2,
  },
  iron_ore: {
    id: 'iron_ore', name: 'Железная руда', description: 'Содержит железо для инструментов',
    color: 0x8a7060, hardness: 5, layer: 'ore',
    drops: [{ item: 'iron_ore_item', count: 1, chance: 1 }],
    rareDrops: [{ item: 'crystal', count: 1, chance: 0.12 }],
    xp: 3,
  },
  gold_ore: {
    id: 'gold_ore', name: 'Золотая руда', description: 'Редкая руда с золотом',
    color: 0x9a8a50, hardness: 5, layer: 'ore',
    drops: [{ item: 'gold_ore_item', count: 1, chance: 1 }],
    rareDrops: [{ item: 'crystal', count: 1, chance: 0.15 }],
    xp: 5,
  },
  diamond_ore: {
    id: 'diamond_ore', name: 'Алмазная руда', description: 'Самая ценная руда! Даёт алмазы',
    color: 0x5a8a8a, hardness: 6, layer: 'ore',
    drops: [{ item: 'diamond', count: 1, chance: 1 }],
    rareDrops: [{ item: 'crystal', count: 1, chance: 0.25 }],
    xp: 10,
  },
  dirt: {
    id: 'dirt', name: 'Земля', description: 'Мягкая земля, можно сажать деревья',
    color: 0x8B6914, hardness: 2, layer: 'dirt',
    drops: [{ item: 'dirt_block', count: 1, chance: 1 }],
    plantable: true,
  },
  grass: {
    id: 'grass', name: 'Трава', description: 'Зелёная трава на поверхности',
    color: 0x5a9e3a, topColor: 0x5a9e3a, sideColor: 0x8B6914,
    hardness: 2, layer: 'surface',
    drops: [{ item: 'dirt_block', count: 1, chance: 1 }],
    rareDrops: [{ item: 'seeds', count: 1, chance: 0.2 }, { item: 'sapling', count: 1, chance: 0.05 }],
  },
  sand: {
    id: 'sand', name: 'Песок', description: 'Рыхлый песок, используется для стекла',
    color: 0xd4c475, hardness: 1, layer: 'surface',
    drops: [{ item: 'sand_block', count: 1, chance: 1 }],
  },
  oak_log: {
    id: 'oak_log', name: 'Дуб', description: 'Ствол дуба — источник древесины',
    color: 0x6B4226, hardness: 3, layer: 'tree',
    drops: [{ item: 'oak_log_item', count: 1, chance: 1 }],
  },
  oak_leaves: {
    id: 'oak_leaves', name: 'Листва', description: 'Листья дуба, могут дать саженец',
    color: 0x2d7a2d, hardness: 1, transparent: true, layer: 'tree',
    rareDrops: [{ item: 'sapling', count: 1, chance: 0.15 }, { item: 'stick', count: 1, chance: 0.2 }],
  },
  planks: {
    id: 'planks', name: 'Доски', description: 'Деревянные доски для строительства',
    color: 0xBC8E4B, hardness: 3, layer: 'surface',
    drops: [{ item: 'planks_block', count: 1, chance: 1 }],
  },
  cobblestone_block: {
    id: 'cobblestone_block', name: 'Булыжник', description: 'Крепкий камень для стен',
    color: 0x6a6a6a, hardness: 4, layer: 'stone',
    drops: [{ item: 'cobblestone_block_item', count: 1, chance: 1 }],
  },
  brick_block: {
    id: 'brick_block', name: 'Кирпич', description: 'Красивый кирпич для домов',
    color: 0x9B4A3A, hardness: 4, layer: 'stone',
    drops: [{ item: 'brick_block_item', count: 1, chance: 1 }],
  },
  glass_block: {
    id: 'glass_block', name: 'Стекло', description: 'Прозрачное стекло для окон',
    color: 0xADD8E6, hardness: 1, transparent: true, layer: 'surface',
    drops: [],
  },
};

// ============ ITEM TYPES ============
export const ITEM_TYPES: Record<string, ItemType> = {
  // Materials
  cobblestone: { id: 'cobblestone', name: 'Булыжник', description: 'Обычный камень, основа крафта', category: 'material', stackSize: 64 },
  cobblestone_deep: { id: 'cobblestone_deep', name: 'Глубинный булыжник', description: 'Очень твёрдый камень из глубин', category: 'material', stackSize: 64 },
  coal: { id: 'coal', name: 'Уголь', description: 'Топливо для плавки руды', category: 'material', stackSize: 64 },
  iron_ingot: { id: 'iron_ingot', name: 'Железный слиток', description: 'Для железных инструментов', category: 'material', stackSize: 64 },
  gold_ingot: { id: 'gold_ingot', name: 'Золотой слиток', description: 'Редкий материал для крафта', category: 'material', stackSize: 64 },
  diamond: { id: 'diamond', name: 'Алмаз', description: 'Самый ценный ресурс!', category: 'material', stackSize: 64 },
  emerald: { id: 'emerald', name: 'Изумруд', description: 'Очень редкий камень', category: 'material', stackSize: 64 },
  stick: { id: 'stick', name: 'Палка', description: 'Основа для инструментов', category: 'material', stackSize: 64 },
  seeds: { id: 'seeds', name: 'Семена', description: 'Можно посадить в землю', category: 'material', stackSize: 64, plantable: true },
  sapling: { id: 'sapling', name: 'Саженец', description: 'Посади чтобы выросло дерево!', category: 'material', stackSize: 64, plantable: true, growsTo: 'oak_log' },
  apple: { id: 'apple', name: 'Яблоко', description: 'Восстанавливает здоровье', category: 'food', stackSize: 64 },
  iron_ore_item: { id: 'iron_ore_item', name: 'Железная руда', description: 'Нужно переплавить с углём', category: 'material', stackSize: 64 },
  gold_ore_item: { id: 'gold_ore_item', name: 'Золотая руда', description: 'Нужно переплавить с углём', category: 'material', stackSize: 64 },
  crystal: { id: 'crystal', name: 'Кристалл', description: 'Магический кристалл! Ответь на вопрос', category: 'special', stackSize: 64 },
  oak_log_item: { id: 'oak_log_item', name: 'Древесина', description: 'Бревно дуба, можно сделать доски', category: 'material', stackSize: 64 },

  // Tools
  wood_pickaxe: { 
    id: 'wood_pickaxe', name: 'Деревянная кирка', 
    description: 'Базовая кирка. Скорость: x2', 
    category: 'tool', stackSize: 1, toolTier: 1, toolSpeed: 2, durability: TOOL_DURABILITY.wood 
  },
  stone_pickaxe: { 
    id: 'stone_pickaxe', name: 'Каменная кирка', 
    description: 'Крепкая кирка. Скорость: x4', 
    category: 'tool', stackSize: 1, toolTier: 2, toolSpeed: 4, durability: TOOL_DURABILITY.stone 
  },
  iron_pickaxe: { 
    id: 'iron_pickaxe', name: 'Железная кирка', 
    description: 'Продвинутая кирка. Скорость: x6', 
    category: 'tool', stackSize: 1, toolTier: 3, toolSpeed: 6, durability: TOOL_DURABILITY.iron 
  },
  diamond_pickaxe: { 
    id: 'diamond_pickaxe', name: 'Алмазная кирка', 
    description: 'Лучшая кирка! Скорость: x8', 
    category: 'tool', stackSize: 1, toolTier: 4, toolSpeed: 8, durability: TOOL_DURABILITY.diamond 
  },

  // Placeable blocks
  dirt_block: { id: 'dirt_block', name: 'Земля', description: 'Поставь землю для посадки', category: 'block', stackSize: 64, placeable: true, blockId: 'dirt', color: 0x8B6914 },
  sand_block: { id: 'sand_block', name: 'Песок', description: 'Поставь песок', category: 'block', stackSize: 64, placeable: true, blockId: 'sand', color: 0xd4c475 },
  planks_block: { id: 'planks_block', name: 'Доски', description: 'Строй из досок', category: 'block', stackSize: 64, placeable: true, blockId: 'planks', color: 0xBC8E4B },
  cobblestone_block_item: { id: 'cobblestone_block_item', name: 'Булыжник', description: 'Крепкие стены', category: 'block', stackSize: 64, placeable: true, blockId: 'cobblestone_block', color: 0x6a6a6a },
  brick_block_item: { id: 'brick_block_item', name: 'Кирпичи', description: 'Красивый кирпич', category: 'block', stackSize: 64, placeable: true, blockId: 'brick_block', color: 0x9B4A3A },
  glass_block_item: { id: 'glass_block_item', name: 'Стекло', description: 'Прозрачные окна', category: 'block', stackSize: 64, placeable: true, blockId: 'glass_block', color: 0xADD8E6 },
};

// ============ CRAFTING RECIPES ============
export const CRAFT_RECIPES: CraftRecipe[] = [
  // Basic materials
  { 
    id: 'planks', name: 'Доски', 
    description: '1 бревно = 4 доски',
    ingredients: [{ item: 'oak_log_item', count: 1 }], 
    result: { item: 'planks_block', count: 4 }, 
    category: 'materials' 
  },
  { 
    id: 'sticks', name: 'Палки', 
    description: '2 доски = 4 палки',
    ingredients: [{ item: 'planks_block', count: 2 }], 
    result: { item: 'stick', count: 4 }, 
    category: 'materials' 
  },
  { 
    id: 'glass', name: 'Стекло', 
    description: 'Переплавь песок с углём',
    ingredients: [{ item: 'sand_block', count: 1 }, { item: 'coal', count: 1 }], 
    result: { item: 'glass_block_item', count: 1 }, 
    category: 'materials' 
  },
  { 
    id: 'bricks', name: 'Кирпичи', 
    description: '4 камня + уголь = 4 кирпича',
    ingredients: [{ item: 'cobblestone', count: 4 }, { item: 'coal', count: 1 }], 
    result: { item: 'brick_block_item', count: 4 }, 
    category: 'materials' 
  },
  { 
    id: 'iron_smelt', name: 'Железный слиток', 
    description: 'Переплавь железную руду',
    ingredients: [{ item: 'iron_ore_item', count: 1 }, { item: 'coal', count: 1 }], 
    result: { item: 'iron_ingot', count: 1 }, 
    category: 'materials' 
  },
  { 
    id: 'gold_smelt', name: 'Золотой слиток', 
    description: 'Переплавь золотую руду',
    ingredients: [{ item: 'gold_ore_item', count: 1 }, { item: 'coal', count: 2 }], 
    result: { item: 'gold_ingot', count: 1 }, 
    category: 'materials' 
  },

  // Tools - require answering questions!
  { 
    id: 'wood_pickaxe', name: 'Деревянная кирка', 
    description: 'Базовая кирка. Скорость x2, прочность 60',
    ingredients: [{ item: 'planks_block', count: 3 }, { item: 'stick', count: 2 }], 
    result: { item: 'wood_pickaxe', count: 1 }, 
    category: 'tools' 
  },
  { 
    id: 'stone_pickaxe', name: 'Каменная кирка', 
    description: 'Крепкая кирка. Скорость x4, прочность 132',
    ingredients: [{ item: 'cobblestone', count: 3 }, { item: 'stick', count: 2 }], 
    result: { item: 'stone_pickaxe', count: 1 }, 
    category: 'tools',
    requiresQuestion: true
  },
  { 
    id: 'iron_pickaxe', name: 'Железная кирка', 
    description: 'Продвинутая кирка. Скорость x6, прочность 251',
    ingredients: [{ item: 'iron_ingot', count: 3 }, { item: 'stick', count: 2 }], 
    result: { item: 'iron_pickaxe', count: 1 }, 
    category: 'tools',
    requiresQuestion: true
  },
  { 
    id: 'diamond_pickaxe', name: 'Алмазная кирка', 
    description: 'Лучшая кирка! Скорость x8, прочность 1562',
    ingredients: [{ item: 'diamond', count: 3 }, { item: 'stick', count: 2 }], 
    result: { item: 'diamond_pickaxe', count: 1 }, 
    category: 'tools',
    requiresQuestion: true
  },

  // Special items
  { 
    id: 'torch', name: 'Факел', 
    description: 'Освещает пещеры',
    ingredients: [{ item: 'stick', count: 1 }, { item: 'coal', count: 1 }], 
    result: { item: 'torch', count: 4 }, 
    category: 'special' 
  },
];

// ============ WORLD GENERATION ============
export const WORLD_SIZE = 32;
export const WORLD_HEIGHT = 10;

export interface WorldBlock {
  type: string;
  health: number;
  maxHealth: number;
}

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
      
      const n1 = smoothNoise(x * 0.08, z * 0.08, seed);
      const n2 = smoothNoise(x * 0.15, z * 0.15, seed + 100);
      const height = Math.floor(4 + n1 * 3 + n2 * 1.5);
      
      for (let y = 0; y < WORLD_HEIGHT; y++) {
        let type = 'air';
        
        if (y === 0) {
          type = 'bedrock';
        } else if (y < height - 3) {
          const oreChance = noise2D(x * 3.7 + y * 2.1, z * 4.3, seed + y * 10);
          if (oreChance > 0.92) type = 'diamond_ore';
          else if (oreChance > 0.85) type = 'gold_ore';
          else if (oreChance > 0.75) type = 'iron_ore';
          else if (oreChance > 0.65) type = 'coal_ore';
          else type = 'deepslate';
        } else if (y < height - 1) {
          const oreChance = noise2D(x * 2.7 + y * 1.1, z * 3.3, seed + y * 5);
          if (oreChance > 0.88) type = 'iron_ore';
          else if (oreChance > 0.80) type = 'coal_ore';
          else type = 'stone';
        } else if (y < height) {
          type = 'dirt';
        } else if (y === height) {
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
    
    let surfaceY = -1;
    for (let y = WORLD_HEIGHT - 1; y >= 0; y--) {
      if (world[tx][tz][y] && world[tx][tz][y].type === 'grass') {
        surfaceY = y;
        break;
      }
    }
    
    if (surfaceY >= 0 && surfaceY + 6 < WORLD_HEIGHT) {
      for (let h = 1; h <= 4; h++) {
        world[tx][tz][surfaceY + h] = { type: 'oak_log', health: 3, maxHealth: 3 };
      }
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
