import { getItemIcon } from '../data/itemIcons';

interface ItemIconProps {
  itemId: string;
  size?: number;
  className?: string;
}

export default function ItemIcon({ itemId, size = 32, className = '' }: ItemIconProps) {
  const iconSvg = getItemIcon(itemId);
  
  return (
    <div 
      className={`inline-block ${className}`}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: iconSvg }}
    />
  );
}
