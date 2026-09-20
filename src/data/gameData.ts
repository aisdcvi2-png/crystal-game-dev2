// Biome types
export type BiomeType = 'plains' | 'forest' | 'desert' | 'snow' | 'ocean';

export interface BiomeConfig {
  name: string;
  surfaceBlock: string;
  subSurfaceBlock: string;
  treeDensity: number;
  treeType: 'oak' | 'spruce' | 'cactus' | 'none';
  grassColor: number;
  waterLevel: number;
  hasSnow: boolean;
}

export const BIOMES: Record<BiomeType, BiomeConfig> = {
  plains: {
    name: 'Равнины',
    surfaceBlock: 'grass',
    subSurfaceBlock: 'dirt',
    treeDensity: 0.02,
    treeType: 'oak',
    grassColor: 0x5a9e3a,
    waterLevel: -1,
    hasSnow: false,
  },
  forest: {
    name: 'Лес',
    surfaceBlock: 'grass',
    subSurfaceBlock: 'dirt',
    treeDensity: 0.15,
    treeType: 'oak',
    grassColor: 0x3d8a2a,
    waterLevel: -1,
    hasSnow: false,
  },
  desert: {
    name: 'Пустыня',
    surfaceBlock: 'sand',
    subSurfaceBlock: 'sand',
    treeDensity: 0.005,
    treeType: 'cactus',
    grassColor: 0xd4c475,
    waterLevel: -1,
    hasSnow: false,
  },
  snow: {
    name: 'Снежные земли',
    surfaceBlock: 'snow',
    subSurfaceBlock: 'dirt',
    treeDensity: 0.06,
    treeType: 'spruce',
    grassColor: 0xffffff,
    waterLevel: -1,
    hasSnow: true,
  },
  ocean: {
    name: 'Океан',
    surfaceBlock: 'sand',
    subSurfaceBlock: 'sand',
    treeDensity: 0,
    treeType: 'none',
    grassColor: 0x5a9e3a,
    waterLevel: 4,
    hasSnow: false,
  },
};

// Block types
export interface BlockType {
  id: string;
  name: string;
  description: string;
  color: number;
  topColor?: number;
  sideColor?: number;
  hardness: number;
  drops?: { item: string; count: number; chance: number }[];
  rareDrops?: { item: string; count: number; chance: number }[];
  unbreakable?: boolean;
  transparent?: boolean;
  liquid?: boolean;
  plantable?: boolean;
  layer: 'bedrock' | 'deep' | 'stone' | 'dirt' | 'surface' | 'tree' | 'ore';
}

export interface ItemType {
  id: string;
  name: string;
  description: string;
  category: 'material' | 'tool' | 'block' | 'special' | 'food';
  stackSize: number;
  toolTier?: number;
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

export const TOOL_DURABILITY = { wood: 60, stone: 132, iron: 251, diamond: 1562 };

// ============ BLOCK TYPES ============
export const BLOCK_TYPES: Record<string, BlockType> = {
  bedrock: { id: 'bedrock', name: 'Бедрок', description: 'Неразрушимый', color: 0x1a1a1a, hardness: 999, unbreakable: true, layer: 'bedrock' },
  deepslate: { id: 'deepslate', name: 'Глубинный сланец', description: 'Очень твёрдый', color: 0x3d3d4a, hardness: 6, layer: 'deep', drops: [{ item: 'cobblestone', count: 1, chance: 1 }], rareDrops: [{ item: 'diamond', count: 1, chance: 0.02 }] },
  stone: { id: 'stone', name: 'Камень', description: 'Обычный камень', color: 0x7f7f7f, hardness: 4, layer: 'stone', drops: [{ item: 'cobblestone', count: 1, chance: 1 }], rareDrops: [{ item: 'coal', count: 1, chance: 0.1 }] },
  coal_ore: { id: 'coal_ore', name: 'Угольная руда', description: 'Содержит уголь', color: 0x4a4a4a, hardness: 4, layer: 'ore', drops: [{ item: 'coal', count: 1, chance: 1 }], rareDrops: [{ item: 'crystal', count: 1, chance: 0.08 }] },
  iron_ore: { id: 'iron_ore', name: 'Железная руда', description: 'Содержит железо', color: 0x8a7060, hardness: 5, layer: 'ore', drops: [{ item: 'iron_ore_item', count: 1, chance: 1 }], rareDrops: [{ item: 'crystal', count: 1, chance: 0.12 }] },
  gold_ore: { id: 'gold_ore', name: 'Золотая руда', description: 'Редкая руда', color: 0x9a8a50, hardness: 5, layer: 'ore', drops: [{ item: 'gold_ore_item', count: 1, chance: 1 }], rareDrops: [{ item: 'crystal', count: 1, chance: 0.15 }] },
  diamond_ore: { id: 'diamond_ore', name: 'Алмазная руда', description: 'Самая ценная!', color: 0x5a8a8a, hardness: 6, layer: 'ore', drops: [{ item: 'diamond', count: 1, chance: 1 }], rareDrops: [{ item: 'crystal', count: 1, chance: 0.25 }] },
  dirt: { id: 'dirt', name: 'Земля', description: 'Мягкая земля', color: 0x8B6914, hardness: 2, layer: 'dirt', drops: [{ item: 'dirt_block', count: 1, chance: 1 }], plantable: true },
  grass: { id: 'grass', name: 'Трава', description: 'Зелёная трава', color: 0x5a9e3a, topColor: 0x5a9e3a, sideColor: 0x8B6914, hardness: 2, layer: 'surface', drops: [{ item: 'dirt_block', count: 1, chance: 1 }], rareDrops: [{ item: 'seeds', count: 1, chance: 0.2 }, { item: 'sapling', count: 1, chance: 0.05 }], plantable: true },
  snow: { id: 'snow', name: 'Снег', description: 'Белый снег', color: 0xf0f0f0, topColor: 0xffffff, sideColor: 0xe0e0e0, hardness: 1, layer: 'surface', drops: [] },
  sand: { id: 'sand', name: 'Песок', description: 'Рыхлый песок', color: 0xd4c475, hardness: 1, layer: 'surface', drops: [{ item: 'sand_block', count: 1, chance: 1 }] },
  water: { id: 'water', name: 'Вода', description: 'Прозрачная вода', color: 0x3498db, hardness: 999, unbreakable: true, transparent: true, liquid: true, layer: 'surface' },
  oak_log: { id: 'oak_log', name: 'Дуб', description: 'Ствол дуба', color: 0x6B4226, hardness: 3, layer: 'tree', drops: [{ item: 'oak_log_item', count: 1, chance: 1 }] },
  oak_leaves: { id: 'oak_leaves', name: 'Листва дуба', description: 'Листья дуба', color: 0x2d7a2d, hardness: 1, transparent: true, layer: 'tree', rareDrops: [{ item: 'sapling', count: 1, chance: 0.15 }, { item: 'stick', count: 1, chance: 0.2 }] },
  spruce_log: { id: 'spruce_log', name: 'Ель', description: 'Ствол ели', color: 0x3d2817, hardness: 3, layer: 'tree', drops: [{ item: 'oak_log_item', count: 1, chance: 1 }] },
  spruce_leaves: { id: 'spruce_leaves', name: 'Хвоя', description: 'Хвоя ели', color: 0x1a4a1a, hardness: 1, transparent: true, layer: 'tree', rareDrops: [{ item: 'sapling', count: 1, chance: 0.1 }] },
  cactus: { id: 'cactus', name: 'Кактус', description: 'Колючий кактус', color: 0x2d7a2d, hardness: 2, layer: 'tree', drops: [{ item: 'cactus_block', count: 1, chance: 1 }] },
  planks: { id: 'planks', name: 'Доски', description: 'Деревянные доски', color: 0xBC8E4B, hardness: 3, layer: 'surface', drops: [{ item: 'planks_block', count: 1, chance: 1 }] },
  cobblestone_block: { id: 'cobblestone_block', name: 'Булыжник', description: 'Крепкий камень', color: 0x6a6a6a, hardness: 4, layer: 'stone', drops: [{ item: 'cobblestone_block_item', count: 1, chance: 1 }] },
  brick_block: { id: 'brick_block', name: 'Кирпич', description: 'Красивый кирпич', color: 0x9B4A3A, hardness: 4, layer: 'stone', drops: [{ item: 'brick_block_item', count: 1, chance: 1 }] },
  glass_block: { id: 'glass_block', name: 'Стекло', description: 'Прозрачное', color: 0xADD8E6, hardness: 1, transparent: true, layer: 'surface', drops: [] },
  portal_frame: { id: 'portal_frame', name: 'Рамка портала', description: 'Часть портала в новый мир', color: 0x9C27B0, hardness: 10, layer: 'ore', drops: [] },
};

// ============ ITEM TYPES ============
export const ITEM_TYPES: Record<string, ItemType> = {
  cobblestone: { id: 'cobblestone', name: 'Булыжник', description: 'Обычный камень', category: 'material', stackSize: 64 },
  coal: { id: 'coal', name: 'Уголь', description: 'Топливо для плавки', category: 'material', stackSize: 64 },
  iron_ingot: { id: 'iron_ingot', name: 'Железный слиток', description: 'Для железных инструментов', category: 'material', stackSize: 64 },
  gold_ingot: { id: 'gold_ingot', name: 'Золотой слиток', description: 'Редкий материал', category: 'material', stackSize: 64 },
  diamond: { id: 'diamond', name: 'Алмаз', description: 'Самый ценный ресурс!', category: 'material', stackSize: 64 },
  emerald: { id: 'emerald', name: 'Изумруд', description: 'Очень редкий', category: 'material', stackSize: 64 },
  stick: { id: 'stick', name: 'Палка', description: 'Основа инструментов', category: 'material', stackSize: 64 },
  seeds: { id: 'seeds', name: 'Семена', description: 'Посади в землю', category: 'material', stackSize: 64, plantable: true },
  sapling: { id: 'sapling', name: 'Саженец', description: 'Вырастет в дерево!', category: 'material', stackSize: 64, plantable: true, growsTo: 'oak_log' },
  apple: { id: 'apple', name: 'Яблоко', description: 'Восстанавливает здоровье', category: 'food', stackSize: 64 },
  iron_ore_item: { id: 'iron_ore_item', name: 'Железная руда', description: 'Нужно переплавить', category: 'material', stackSize: 64 },
  gold_ore_item: { id: 'gold_ore_item', name: 'Золотая руда', description: 'Нужно переплавить', category: 'material', stackSize: 64 },
  crystal: { id: 'crystal', name: 'Кристалл', description: 'Магический кристалл!', category: 'special', stackSize: 64 },
  oak_log_item: { id: 'oak_log_item', name: 'Древесина', description: 'Бревно', category: 'material', stackSize: 64 },
  portal_key: { id: 'portal_key', name: 'Ключ портала', description: 'Активирует портал! Собери 20 кристаллов', category: 'special', stackSize: 1 },
  wood_pickaxe: { id: 'wood_pickaxe', name: 'Деревянная кирка', description: 'Прочность: 60', category: 'tool', stackSize: 1, toolTier: 1, durability: TOOL_DURABILITY.wood },
  stone_pickaxe: { id: 'stone_pickaxe', name: 'Каменная кирка', description: 'Прочность: 132', category: 'tool', stackSize: 1, toolTier: 2, durability: TOOL_DURABILITY.stone },
  iron_pickaxe: { id: 'iron_pickaxe', name: 'Железная кирка', description: 'Прочность: 251', category: 'tool', stackSize: 1, toolTier: 3, durability: TOOL_DURABILITY.iron },
  diamond_pickaxe: { id: 'diamond_pickaxe', name: 'Алмазная кирка', description: 'Прочность: 1562', category: 'tool', stackSize: 1, toolTier: 4, durability: TOOL_DURABILITY.diamond },
  dirt_block: { id: 'dirt_block', name: 'Земля', description: 'Поставь землю', category: 'block', stackSize: 64, placeable: true, blockId: 'dirt', color: 0x8B6914 },
  sand_block: { id: 'sand_block', name: 'Песок', description: 'Поставь песок', category: 'block', stackSize: 64, placeable: true, blockId: 'sand', color: 0xd4c475 },
  planks_block: { id: 'planks_block', name: 'Доски', description: 'Строй из досок', category: 'block', stackSize: 64, placeable: true, blockId: 'planks', color: 0xBC8E4B },
  cobblestone_block_item: { id: 'cobblestone_block_item', name: 'Булыжник', description: 'Крепкие стены', category: 'block', stackSize: 64, placeable: true, blockId: 'cobblestone_block', color: 0x6a6a6a },
  brick_block_item: { id: 'brick_block_item', name: 'Кирпичи', description: 'Красивый кирпич', category: 'block', stackSize: 64, placeable: true, blockId: 'brick_block', color: 0x9B4A3A },
  glass_block_item: { id: 'glass_block_item', name: 'Стекло', description: 'Прозрачные окна', category: 'block', stackSize: 64, placeable: true, blockId: 'glass_block', color: 0xADD8E6 },
  cactus_block: { id: 'cactus_block', name: 'Кактус', description: 'Колючий блок', category: 'block', stackSize: 64, placeable: true, blockId: 'cactus', color: 0x2d7a2d },
};

// ============ CRAFTING RECIPES ============
export const CRAFT_RECIPES: CraftRecipe[] = [
  { id: 'planks', name: 'Доски', description: '1 бревно = 4 доски', ingredients: [{ item: 'oak_log_item', count: 1 }], result: { item: 'planks_block', count: 4 }, category: 'materials' },
  { id: 'sticks', name: 'Палки', description: '2 доски = 4 палки', ingredients: [{ item: 'planks_block', count: 2 }], result: { item: 'stick', count: 4 }, category: 'materials' },
  { id: 'glass', name: 'Стекло', description: 'Песок + уголь', ingredients: [{ item: 'sand_block', count: 1 }, { item: 'coal', count: 1 }], result: { item: 'glass_block_item', count: 1 }, category: 'materials' },
  { id: 'bricks', name: 'Кирпичи', description: '4 камня + уголь', ingredients: [{ item: 'cobblestone', count: 4 }, { item: 'coal', count: 1 }], result: { item: 'brick_block_item', count: 4 }, category: 'materials' },
  { id: 'iron_smelt', name: 'Железный слиток', description: 'Руда + уголь', ingredients: [{ item: 'iron_ore_item', count: 1 }, { item: 'coal', count: 1 }], result: { item: 'iron_ingot', count: 1 }, category: 'materials' },
  { id: 'gold_smelt', name: 'Золотой слиток', description: 'Руда + 2 угля', ingredients: [{ item: 'gold_ore_item', count: 1 }, { item: 'coal', count: 2 }], result: { item: 'gold_ingot', count: 1 }, category: 'materials' },
  { id: 'wood_pickaxe', name: 'Деревянная кирка', description: 'Скорость x2', ingredients: [{ item: 'planks_block', count: 3 }, { item: 'stick', count: 2 }], result: { item: 'wood_pickaxe', count: 1 }, category: 'tools' },
  { id: 'stone_pickaxe', name: 'Каменная кирка', description: 'Скорость x4', ingredients: [{ item: 'cobblestone', count: 3 }, { item: 'stick', count: 2 }], result: { item: 'stone_pickaxe', count: 1 }, category: 'tools', requiresQuestion: true },
  { id: 'iron_pickaxe', name: 'Железная кирка', description: 'Скорость x6', ingredients: [{ item: 'iron_ingot', count: 3 }, { item: 'stick', count: 2 }], result: { item: 'iron_pickaxe', count: 1 }, category: 'tools', requiresQuestion: true },
  { id: 'diamond_pickaxe', name: 'Алмазная кирка', description: 'Скорость x8', ingredients: [{ item: 'diamond', count: 3 }, { item: 'stick', count: 2 }], result: { item: 'diamond_pickaxe', count: 1 }, category: 'tools', requiresQuestion: true },
  { id: 'portal_key', name: 'Ключ портала', description: 'Активирует портал! Нужно 20 кристаллов', ingredients: [{ item: 'crystal', count: 20 }, { item: 'diamond', count: 5 }], result: { item: 'portal_key', count: 1 }, category: 'special', requiresQuestion: true },
];

// ============ WORLD GENERATION ============
export const WORLD_SIZE = 80;
export const WORLD_HEIGHT = 12;

export interface WorldBlock {
  type: string;
  health: number;
  maxHealth: number;
}

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
  const a = hash(ix, iz, seed);
  const b = hash(ix + 1, iz, seed);
  const c = hash(ix, iz + 1, seed);
  const d = hash(ix + 1, iz + 1, seed);
  const ux = fx * fx * (3 - 2 * fx);
  const uz = fz * fz * (3 - 2 * fz);
  return a * (1 - ux) * (1 - uz) + b * ux * (1 - uz) + c * (1 - ux) * uz + d * ux * uz;
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

export function getBiome(x: number, z: number, seed: number): BiomeType {
  const temperature = fbm(x * 0.01, z * 0.01, seed + 500, 3);
  const moisture = fbm(x * 0.01, z * 0.01, seed + 1000, 3);
  const elevation = fbm(x * 0.005, z * 0.005, seed + 1500, 2);

  if (elevation < 0.35) return 'ocean';
  if (temperature < 0.35) return 'snow';
  if (temperature > 0.65 && moisture < 0.4) return 'desert';
  if (moisture > 0.6) return 'forest';
  return 'plains';
}

export interface WorldData {
  blocks: WorldBlock[][][];
  biomes: BiomeType[][];
  seed: number;
  portalLocation: { x: number; z: number } | null;
}

export function generateWorld(seed?: number): WorldData {
  const worldSeed = seed ?? Math.floor(Math.random() * 100000);
  const blocks: WorldBlock[][][] = [];
  const biomes: BiomeType[][] = [];

  for (let x = 0; x < WORLD_SIZE; x++) {
    blocks[x] = [];
    biomes[x] = [];
    for (let z = 0; z < WORLD_SIZE; z++) {
      blocks[x][z] = [];
      const biome = getBiome(x, z, worldSeed);
      biomes[x][z] = biome;
      const biomeConfig = BIOMES[biome];

      const n1 = fbm(x * 0.04, z * 0.04, worldSeed, 4);
      const n2 = fbm(x * 0.08, z * 0.08, worldSeed + 100, 3);
      let height = Math.floor(3 + n1 * 4 + n2 * 2);
      
      if (biome === 'ocean') height = Math.min(height, 3);

      for (let y = 0; y < WORLD_HEIGHT; y++) {
        let type = '';
        
        if (y === 0) {
          type = 'bedrock';
        } else if (y < height - 3) {
          const oreChance = hash(x * 3 + y, z * 4 + y, worldSeed + y * 10);
          if (oreChance > 0.94) type = 'diamond_ore';
          else if (oreChance > 0.88) type = 'gold_ore';
          else if (oreChance > 0.78) type = 'iron_ore';
          else if (oreChance > 0.68) type = 'coal_ore';
          else type = 'deepslate';
        } else if (y < height - 1) {
          const oreChance = hash(x * 2 + y, z * 3 + y, worldSeed + y * 5);
          if (oreChance > 0.9) type = 'iron_ore';
          else if (oreChance > 0.82) type = 'coal_ore';
          else type = 'stone';
        } else if (y < height) {
          type = biomeConfig.subSurfaceBlock;
        } else if (y === height) {
          type = biomeConfig.surfaceBlock;
        } else if (y <= biomeConfig.waterLevel && (biome === 'ocean' || height < biomeConfig.waterLevel)) {
          type = 'water';
        }

        if (type) {
          const blockType = BLOCK_TYPES[type];
          blocks[x][z][y] = {
            type,
            health: blockType.hardness,
            maxHealth: blockType.hardness,
          };
        }
      }
    }
  }

  // Add trees based on biome
  for (let x = 2; x < WORLD_SIZE - 2; x++) {
    for (let z = 2; z < WORLD_SIZE - 2; z++) {
      const biome = biomes[x][z];
      const biomeConfig = BIOMES[biome];
      if (biomeConfig.treeType === 'none') continue;

      const treeChance = hash(x * 7, z * 11, worldSeed + 2000);
      if (treeChance < biomeConfig.treeDensity) {
        let surfaceY = -1;
        for (let y = WORLD_HEIGHT - 1; y >= 0; y--) {
          if (blocks[x][z][y] && !BLOCK_TYPES[blocks[x][z][y].type]?.liquid) {
            surfaceY = y;
            break;
          }
        }

        if (surfaceY >= 0 && surfaceY + 7 < WORLD_HEIGHT) {
          if (biomeConfig.treeType === 'oak') {
            for (let h = 1; h <= 4; h++) {
              blocks[x][z][surfaceY + h] = { type: 'oak_log', health: 3, maxHealth: 3 };
            }
            for (let lx = -2; lx <= 2; lx++) {
              for (let lz = -2; lz <= 2; lz++) {
                for (let ly = 3; ly <= 5; ly++) {
                  const nx = x + lx, nz = z + lz;
                  if (nx >= 0 && nx < WORLD_SIZE && nz >= 0 && nz < WORLD_SIZE) {
                    if (Math.abs(lx) + Math.abs(lz) < 4 && !blocks[nx][nz][surfaceY + ly]) {
                      if (!(lx === 0 && lz === 0 && ly <= 4)) {
                        blocks[nx][nz][surfaceY + ly] = { type: 'oak_leaves', health: 1, maxHealth: 1 };
                      }
                    }
                  }
                }
              }
            }
          } else if (biomeConfig.treeType === 'spruce') {
            for (let h = 1; h <= 6; h++) {
              blocks[x][z][surfaceY + h] = { type: 'spruce_log', health: 3, maxHealth: 3 };
            }
            for (let ly = 3; ly <= 7; ly++) {
              const radius = ly < 6 ? 2 : 1;
              for (let lx = -radius; lx <= radius; lx++) {
                for (let lz = -radius; lz <= radius; lz++) {
                  const nx = x + lx, nz = z + lz;
                  if (nx >= 0 && nx < WORLD_SIZE && nz >= 0 && nz < WORLD_SIZE) {
                    if (Math.abs(lx) + Math.abs(lz) <= radius && !blocks[nx][nz][surfaceY + ly]) {
                      if (!(lx === 0 && lz === 0 && ly <= 6)) {
                        blocks[nx][nz][surfaceY + ly] = { type: 'spruce_leaves', health: 1, maxHealth: 1 };
                      }
                    }
                  }
                }
              }
            }
          } else if (biomeConfig.treeType === 'cactus') {
            const cactusHeight = 2 + Math.floor(hash(x, z, worldSeed + 3000) * 2);
            for (let h = 1; h <= cactusHeight; h++) {
              blocks[x][z][surfaceY + h] = { type: 'cactus', health: 2, maxHealth: 2 };
            }
          }
        }
      }
    }
  }

  // Place portal location (far from spawn)
  const portalX = WORLD_SIZE - 10;
  const portalZ = WORLD_SIZE - 10;
  let portalSurfaceY = -1;
  for (let y = WORLD_HEIGHT - 1; y >= 0; y--) {
    if (blocks[portalX]?.[portalZ]?.[y] && !BLOCK_TYPES[blocks[portalX][portalZ][y].type]?.liquid) {
      portalSurfaceY = y;
      break;
    }
  }

  // Build portal structure
  if (portalSurfaceY > 0) {
    for (let px = -2; px <= 2; px++) {
      for (let pz = -2; pz <= 2; pz++) {
        const nx = portalX + px;
        const nz = portalZ + pz;
        if (nx >= 0 && nx < WORLD_SIZE && nz >= 0 && nz < WORLD_SIZE) {
          // Frame
          if (Math.abs(px) === 2 || Math.abs(pz) === 2) {
            blocks[nx][nz][portalSurfaceY + 1] = { type: 'portal_frame', health: 10, maxHealth: 10 };
            blocks[nx][nz][portalSurfaceY + 2] = { type: 'portal_frame', health: 10, maxHealth: 10 };
            blocks[nx][nz][portalSurfaceY + 3] = { type: 'portal_frame', health: 10, maxHealth: 10 };
          }
        }
      }
    }
  }

  return { blocks, biomes, seed: worldSeed, portalLocation: { x: portalX, z: portalZ } };
}

export function getSurfaceHeight(blocks: WorldBlock[][][], x: number, z: number): number {
  for (let y = WORLD_HEIGHT - 1; y >= 0; y--) {
    if (blocks[x]?.[z]?.[y] && !BLOCK_TYPES[blocks[x][z][y].type]?.liquid) return y;
  }
  return 0;
}
