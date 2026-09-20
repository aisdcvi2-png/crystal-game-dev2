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
}

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

export interface CraftRecipe {
  id: string;
  name: string;
  description: string;
  ingredients: { item: string; count: number }[];
  result: { item: string; count: number };
  category: 'tools' | 'materials' | 'building';
  requiresQuestion?: boolean;
}

export const TOOL_DURABILITY = { wood: 60, stone: 132, iron: 251, diamond: 1562 };

export const BLOCK_TYPES: Record<string, BlockType> = {
  bedrock: { id: 'bedrock', name: 'Бедрок', description: 'Неразрушимый', color: 0x1a1a1a, hardness: 999, unbreakable: true },
  stone: { id: 'stone', name: 'Камень', description: 'Обычный камень', color: 0x7f7f7f, hardness: 4, drops: [{ item: 'cobblestone', count: 1, chance: 1 }] },
  coal_ore: { id: 'coal_ore', name: 'Угольная руда', description: 'Содержит уголь', color: 0x4a4a4a, hardness: 4, drops: [{ item: 'coal', count: 1, chance: 1 }], rareDrops: [{ item: 'crystal', count: 1, chance: 0.1 }] },
  iron_ore: { id: 'iron_ore', name: 'Железная руда', description: 'Содержит железо', color: 0x8a7060, hardness: 5, drops: [{ item: 'iron_ore_item', count: 1, chance: 1 }], rareDrops: [{ item: 'crystal', count: 1, chance: 0.15 }] },
  gold_ore: { id: 'gold_ore', name: 'Золотая руда', description: 'Редкая руда', color: 0x9a8a50, hardness: 5, drops: [{ item: 'gold_ore_item', count: 1, chance: 1 }], rareDrops: [{ item: 'crystal', count: 1, chance: 0.2 }] },
  diamond_ore: { id: 'diamond_ore', name: 'Алмазная руда', description: 'Самая ценная!', color: 0x5a8a8a, hardness: 6, drops: [{ item: 'diamond', count: 1, chance: 1 }], rareDrops: [{ item: 'crystal', count: 1, chance: 0.3 }] },
  dirt: { id: 'dirt', name: 'Земля', description: 'Мягкая земля', color: 0x8B6914, hardness: 2, drops: [{ item: 'dirt_block', count: 1, chance: 1 }] },
  grass: { id: 'grass', name: 'Трава', description: 'Зелёная трава', color: 0x5a9e3a, topColor: 0x5a9e3a, sideColor: 0x8B6914, hardness: 2, drops: [{ item: 'dirt_block', count: 1, chance: 1 }], rareDrops: [{ item: 'sapling', count: 1, chance: 0.1 }] },
  sand: { id: 'sand', name: 'Песок', description: 'Рыхлый песок', color: 0xd4c475, hardness: 1, drops: [{ item: 'sand_block', count: 1, chance: 1 }] },
  water: { id: 'water', name: 'Вода', description: 'Прозрачная вода', color: 0x3498db, hardness: 999, unbreakable: true, transparent: true, liquid: true },
  oak_log: { id: 'oak_log', name: 'Дуб', description: 'Ствол дуба', color: 0x6B4226, hardness: 3, drops: [{ item: 'oak_log_item', count: 1, chance: 1 }] },
  oak_leaves: { id: 'oak_leaves', name: 'Листва', description: 'Листья дуба', color: 0x2d7a2d, hardness: 1, transparent: true, rareDrops: [{ item: 'sapling', count: 1, chance: 0.2 }] },
  planks: { id: 'planks', name: 'Доски', description: 'Деревянные доски', color: 0xBC8E4B, hardness: 3, drops: [{ item: 'planks_block', count: 1, chance: 1 }] },
  cobblestone_block: { id: 'cobblestone_block', name: 'Булыжник', description: 'Крепкий камень', color: 0x6a6a6a, hardness: 4, drops: [{ item: 'cobblestone_block_item', count: 1, chance: 1 }] },
  brick_block: { id: 'brick_block', name: 'Кирпич', description: 'Красивый кирпич', color: 0x9B4A3A, hardness: 4, drops: [{ item: 'brick_block_item', count: 1, chance: 1 }] },
  portal_frame: { id: 'portal_frame', name: 'Рамка портала', description: 'Часть портала', color: 0x9C27B0, hardness: 10 },
};

export const ITEM_TYPES: Record<string, ItemType> = {
  cobblestone: { id: 'cobblestone', name: 'Булыжник', description: 'Обычный камень', category: 'material', stackSize: 64 },
  coal: { id: 'coal', name: 'Уголь', description: 'Топливо для плавки', category: 'material', stackSize: 64 },
  iron_ingot: { id: 'iron_ingot', name: 'Железный слиток', description: 'Для железных инструментов', category: 'material', stackSize: 64 },
  gold_ingot: { id: 'gold_ingot', name: 'Золотой слиток', description: 'Редкий материал', category: 'material', stackSize: 64 },
  diamond: { id: 'diamond', name: 'Алмаз', description: 'Самый ценный ресурс!', category: 'material', stackSize: 64 },
  stick: { id: 'stick', name: 'Палка', description: 'Основа инструментов', category: 'material', stackSize: 64 },
  sapling: { id: 'sapling', name: 'Саженец', description: 'Вырастет в дерево!', category: 'material', stackSize: 64 },
  iron_ore_item: { id: 'iron_ore_item', name: 'Железная руда', description: 'Нужно переплавить', category: 'material', stackSize: 64 },
  gold_ore_item: { id: 'gold_ore_item', name: 'Золотая руда', description: 'Нужно переплавить', category: 'material', stackSize: 64 },
  crystal: { id: 'crystal', name: 'Кристалл', description: 'Магический кристалл!', category: 'special', stackSize: 64 },
  oak_log_item: { id: 'oak_log_item', name: 'Древесина', description: 'Бревно', category: 'material', stackSize: 64 },
  portal_key: { id: 'portal_key', name: 'Ключ портала', description: 'Активирует портал!', category: 'special', stackSize: 1 },
  wood_pickaxe: { id: 'wood_pickaxe', name: 'Деревянная кирка', description: 'Прочность: 60', category: 'tool', stackSize: 1, durability: TOOL_DURABILITY.wood },
  stone_pickaxe: { id: 'stone_pickaxe', name: 'Каменная кирка', description: 'Прочность: 132', category: 'tool', stackSize: 1, durability: TOOL_DURABILITY.stone },
  iron_pickaxe: { id: 'iron_pickaxe', name: 'Железная кирка', description: 'Прочность: 251', category: 'tool', stackSize: 1, durability: TOOL_DURABILITY.iron },
  diamond_pickaxe: { id: 'diamond_pickaxe', name: 'Алмазная кирка', description: 'Прочность: 1562', category: 'tool', stackSize: 1, durability: TOOL_DURABILITY.diamond },
  dirt_block: { id: 'dirt_block', name: 'Земля', description: 'Поставь землю', category: 'block', stackSize: 64, placeable: true, blockId: 'dirt' },
  sand_block: { id: 'sand_block', name: 'Песок', description: 'Поставь песок', category: 'block', stackSize: 64, placeable: true, blockId: 'sand' },
  planks_block: { id: 'planks_block', name: 'Доски', description: 'Строй из досок', category: 'block', stackSize: 64, placeable: true, blockId: 'planks' },
  cobblestone_block_item: { id: 'cobblestone_block_item', name: 'Булыжник', description: 'Крепкие стены', category: 'block', stackSize: 64, placeable: true, blockId: 'cobblestone_block' },
  brick_block_item: { id: 'brick_block_item', name: 'Кирпичи', description: 'Красивый кирпич', category: 'block', stackSize: 64, placeable: true, blockId: 'brick_block' },
};

export const CRAFT_RECIPES: CraftRecipe[] = [
  { id: 'planks', name: 'Доски', description: '1 бревно = 4 доски', ingredients: [{ item: 'oak_log_item', count: 1 }], result: { item: 'planks_block', count: 4 }, category: 'materials' },
  { id: 'sticks', name: 'Палки', description: '2 доски = 4 палки', ingredients: [{ item: 'planks_block', count: 2 }], result: { item: 'stick', count: 4 }, category: 'materials' },
  { id: 'bricks', name: 'Кирпичи', description: '4 камня + уголь', ingredients: [{ item: 'cobblestone', count: 4 }, { item: 'coal', count: 1 }], result: { item: 'brick_block_item', count: 4 }, category: 'materials' },
  { id: 'iron_smelt', name: 'Железный слиток', description: 'Руда + уголь', ingredients: [{ item: 'iron_ore_item', count: 1 }, { item: 'coal', count: 1 }], result: { item: 'iron_ingot', count: 1 }, category: 'materials' },
  { id: 'gold_smelt', name: 'Золотой слиток', description: 'Руда + 2 угля', ingredients: [{ item: 'gold_ore_item', count: 1 }, { item: 'coal', count: 2 }], result: { item: 'gold_ingot', count: 1 }, category: 'materials' },
  { id: 'wood_pickaxe', name: 'Деревянная кирка', description: 'Базовая кирка', ingredients: [{ item: 'planks_block', count: 3 }, { item: 'stick', count: 2 }], result: { item: 'wood_pickaxe', count: 1 }, category: 'tools' },
  { id: 'stone_pickaxe', name: 'Каменная кирка', description: 'Крепкая кирка', ingredients: [{ item: 'cobblestone', count: 3 }, { item: 'stick', count: 2 }], result: { item: 'stone_pickaxe', count: 1 }, category: 'tools', requiresQuestion: true },
  { id: 'iron_pickaxe', name: 'Железная кирка', description: 'Продвинутая кирка', ingredients: [{ item: 'iron_ingot', count: 3 }, { item: 'stick', count: 2 }], result: { item: 'iron_pickaxe', count: 1 }, category: 'tools', requiresQuestion: true },
  { id: 'diamond_pickaxe', name: 'Алмазная кирка', description: 'Лучшая кирка!', ingredients: [{ item: 'diamond', count: 3 }, { item: 'stick', count: 2 }], result: { item: 'diamond_pickaxe', count: 1 }, category: 'tools', requiresQuestion: true },
  { id: 'portal_key', name: 'Ключ портала', description: 'Нужно 20 кристаллов + 5 алмазов', ingredients: [{ item: 'crystal', count: 20 }, { item: 'diamond', count: 5 }], result: { item: 'portal_key', count: 1 }, category: 'tools', requiresQuestion: true },
];

export const WORLD_SIZE = 48;
export const WORLD_HEIGHT = 10;

export interface WorldBlock {
  type: string;
  health: number;
  maxHealth: number;
}

export interface WorldData {
  blocks: WorldBlock[][][];
  seed: number;
  portalLocation: { x: number; z: number } | null;
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

function fbm(x: number, z: number, seed: number): number {
  let value = 0, amplitude = 1, frequency = 1, maxValue = 0;
  for (let i = 0; i < 3; i++) {
    value += smoothNoise(x * frequency, z * frequency, seed + i * 100) * amplitude;
    maxValue += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }
  return value / maxValue;
}

export function generateWorld(seed?: number): WorldData {
  const worldSeed = seed ?? Math.floor(Math.random() * 100000);
  const blocks: WorldBlock[][][] = [];

  for (let x = 0; x < WORLD_SIZE; x++) {
    blocks[x] = [];
    for (let z = 0; z < WORLD_SIZE; z++) {
      blocks[x][z] = [];
      const n1 = fbm(x * 0.05, z * 0.05, worldSeed);
      const n2 = fbm(x * 0.1, z * 0.1, worldSeed + 100);
      const height = Math.floor(3 + n1 * 3 + n2 * 1.5);

      for (let y = 0; y < WORLD_HEIGHT; y++) {
        let type = '';
        if (y === 0) type = 'bedrock';
        else if (y < height - 2) {
          const oreChance = hash(x * 3 + y, z * 4 + y, worldSeed + y * 10);
          if (oreChance > 0.95) type = 'diamond_ore';
          else if (oreChance > 0.88) type = 'gold_ore';
          else if (oreChance > 0.78) type = 'iron_ore';
          else if (oreChance > 0.68) type = 'coal_ore';
          else type = 'stone';
        } else if (y < height) type = 'dirt';
        else if (y === height) type = 'grass';

        if (type) {
          const blockType = BLOCK_TYPES[type];
          blocks[x][z][y] = { type, health: blockType.hardness, maxHealth: blockType.hardness };
        }
      }
    }
  }

  // Trees
  for (let i = 0; i < 20; i++) {
    const tx = Math.floor(Math.random() * (WORLD_SIZE - 4)) + 2;
    const tz = Math.floor(Math.random() * (WORLD_SIZE - 4)) + 2;
    let surfaceY = -1;
    for (let y = WORLD_HEIGHT - 1; y >= 0; y--) {
      if (blocks[tx][tz][y] && blocks[tx][tz][y].type === 'grass') { surfaceY = y; break; }
    }
    if (surfaceY >= 0 && surfaceY + 6 < WORLD_HEIGHT) {
      for (let h = 1; h <= 4; h++) blocks[tx][tz][surfaceY + h] = { type: 'oak_log', health: 3, maxHealth: 3 };
      for (let lx = -2; lx <= 2; lx++) {
        for (let lz = -2; lz <= 2; lz++) {
          for (let ly = 3; ly <= 5; ly++) {
            const nx = tx + lx, nz = tz + lz;
            if (nx >= 0 && nx < WORLD_SIZE && nz >= 0 && nz < WORLD_SIZE && Math.abs(lx) + Math.abs(lz) < 4 && !blocks[nx][nz][surfaceY + ly]) {
              if (!(lx === 0 && lz === 0 && ly <= 4)) {
                blocks[nx][nz][surfaceY + ly] = { type: 'oak_leaves', health: 1, maxHealth: 1 };
              }
            }
          }
        }
      }
    }
  }

  // Portal
  const portalX = WORLD_SIZE - 8;
  const portalZ = WORLD_SIZE - 8;
  let portalSurfaceY = -1;
  for (let y = WORLD_HEIGHT - 1; y >= 0; y--) {
    if (blocks[portalX]?.[portalZ]?.[y] && !BLOCK_TYPES[blocks[portalX][portalZ][y].type]?.liquid) { portalSurfaceY = y; break; }
  }
  if (portalSurfaceY > 0) {
    for (let px = -1; px <= 1; px++) {
      for (let pz = -1; pz <= 1; pz++) {
        const nx = portalX + px, nz = portalZ + pz;
        if (nx >= 0 && nx < WORLD_SIZE && nz >= 0 && nz < WORLD_SIZE) {
          if (Math.abs(px) === 1 || Math.abs(pz) === 1) {
            blocks[nx][nz][portalSurfaceY + 1] = { type: 'portal_frame', health: 10, maxHealth: 10 };
            blocks[nx][nz][portalSurfaceY + 2] = { type: 'portal_frame', health: 10, maxHealth: 10 };
          }
        }
      }
    }
  }

  return { blocks, seed: worldSeed, portalLocation: { x: portalX, z: portalZ } };
}

export function getSurfaceHeight(blocks: WorldBlock[][][], x: number, z: number): number {
  for (let y = WORLD_HEIGHT - 1; y >= 0; y--) {
    if (blocks[x]?.[z]?.[y] && !BLOCK_TYPES[blocks[x][z][y].type]?.liquid) return y;
  }
  return 0;
}
