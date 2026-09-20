interface ItemIconProps {
  itemId: string;
  size?: number;
}

const itemIcons: Record<string, string> = {
  cobblestone: '🪨',
  coal: '⚫',
  iron_ingot: '⬜',
  gold_ingot: '🟡',
  diamond: '💎',
  stick: '🥢',
  sapling: '🌱',
  iron_ore_item: '🔶',
  gold_ore_item: '🟠',
  crystal: '💠',
  oak_log_item: '🪵',
  portal_key: '🔑',
  wood_pickaxe: '⛏️',
  stone_pickaxe: '⛏️',
  iron_pickaxe: '⛏️',
  diamond_pickaxe: '⛏️',
  dirt_block: '🟫',
  sand_block: '🟨',
  planks_block: '🟧',
  cobblestone_block_item: '⬜',
  brick_block_item: '🟥',
};

export default function ItemIcon({ itemId, size = 24 }: ItemIconProps) {
  const icon = itemIcons[itemId] || '❓';
  
  return (
    <div 
      className="inline-flex items-center justify-center"
      style={{ width: size, height: size, fontSize: size * 0.7 }}
    >
      {icon}
    </div>
  );
}
