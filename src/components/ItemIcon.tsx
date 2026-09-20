import { ITEM_TYPES } from '../data/gameData';
import { getItemIcon } from '../data/itemIcons';

export default function ItemIcon({ itemId, size = 32 }: { itemId: string; size?: number }) {
  const item = ITEM_TYPES[itemId];
  const iconSvg = getItemIcon(itemId);
  
  return (
    <div 
      className="flex items-center justify-center"
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: iconSvg }}
    />
  );
}
