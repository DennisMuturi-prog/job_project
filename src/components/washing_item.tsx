import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface WashingItemProps {
  id: string;
  type: 'detergent' | 'softener' | 'clothes';
}

const itemConfig = {
  detergent: {
    emoji: '🧴',
    label: 'Detergent',
    color: 'bg-blue-100 border-blue-300',
    hoverColor: 'hover:bg-blue-200',
  },
  softener: {
    emoji: '🌸',
    label: 'Fabric Softener',
    color: 'bg-pink-100 border-pink-300',
    hoverColor: 'hover:bg-pink-200',
  },
  clothes: {
    emoji: '👕',
    label: 'Clothes',
    color: 'bg-green-100 border-green-300',
    hoverColor: 'hover:bg-green-200',
  },
};

export default function WashingItem({ id, type }: WashingItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1, // Add z-index
  };

  const config = itemConfig[type];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        ${config.color} ${config.hoverColor}
        border-2 rounded-xl p-4 cursor-grab active:cursor-grabbing
        transition-all duration-200 shadow-md hover:shadow-lg
        ${isDragging ? 'scale-105 rotate-3' : ''}
      `}
    >
      <div className="flex items-center gap-3">
        <span className="text-4xl">{config.emoji}</span>
        <div>
          <p className="font-semibold text-gray-800">{config.label}</p>
          <p className="text-xs text-gray-600">Drag to machine</p>
        </div>
      </div>
    </div>
  );
}