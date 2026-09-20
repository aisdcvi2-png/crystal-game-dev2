import { ITEM_TYPES } from '../data/gameData';

const icons: Record<string, string> = {
  cobblestone: '🪨', coal: '⚫', iron_ingot: '⬜', gold_ingot: '🟡', diamond: '💎',
  stick: '🥢', seeds: '🌱', iron_ore_item: '🔶', gold_ore_item: '🟠', crystal: '💠',
  oak_log_item: '🪵', wood_pickaxe: '⛏️', stone_pickaxe: '⛏️', iron_pickaxe: '⛏️',
  diamond_pickaxe: '⛏️', dirt_block: '🟫', sand_block: '🟨',
};

export default function ItemIcon({ itemId, size = 24 }: { itemId: string; size?: number }) {
  const icon = icons[itemId] || '❓';
  const item = ITEM_TYPES[itemId];
  const color = item?.category === 'tool' ? '#fbbf24' : item?.category === 'special' ? '#a78bfa' : '#9ca3af';
  
  return (
    <div 
      className="flex items-center justify-center rounded"
      style={{ width: size, height: size, fontSize: size * 0.7, background: `${color}20` }}
    >
      {icon}
    </div>
  );
}
