import { DndContext, useSensor, MouseSensor, TouchSensor, KeyboardSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { useState, useRef } from "react";
import { toast } from "sonner";
import useSound from "use-sound";
import EmptyWashingMachine from "@/components/empty_washing_machine";
import ClickSpark, { type SparkRef } from "@/components/ClickSpark";
import WashingItem from "@/components/washing_item";

type ItemType = 'detergent' | 'softener' | 'clothes';
type ItemStatus = 'PENDING' | 'IN_DRUM' | 'IN_TRAY';

interface WashingMachineItem {
  id: string;
  type: ItemType;
  status: ItemStatus;
  correctLocation: 'washing-drum' | 'detergent-tray';
}

const INITIAL_ITEMS: WashingMachineItem[] = [
  {
    id: 'item-detergent',
    type: 'detergent',
    status: 'PENDING',
    correctLocation: 'detergent-tray',
  },
  {
    id: 'item-softener',
    type: 'softener',
    status: 'PENDING',
    correctLocation: 'detergent-tray',
  },
  {
    id: 'item-clothes',
    type: 'clothes',
    status: 'PENDING',
    correctLocation: 'washing-drum',
  },
];

export default function LoadAndSetupWasher() {
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  const [playSound] = useSound('/success_sound.mp3');
  const [items, setItems] = useState<WashingMachineItem[]>(INITIAL_ITEMS);
  const [shakingZone, setShakingZone] = useState<string | null>(null);
  
  const drumSparkRef = useRef<SparkRef>(null);
  const traySparkRef = useRef<SparkRef>(null);

  // Check if all items are placed correctly
  const allItemsPlaced = items.every(item => item.status !== 'PENDING');
  const allItemsCorrect = items.every(item => {
    if (item.correctLocation === 'washing-drum') return item.status === 'IN_DRUM';
    if (item.correctLocation === 'detergent-tray') return item.status === 'IN_TRAY';
    return false;
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const itemId = active.id as string;
    const dropZone = over.id as string;
    const item = items.find(i => i.id === itemId);

    if (!item) return;

    // Check if dropped in correct location
    const isCorrectLocation = item.correctLocation === dropZone;

    if (!isCorrectLocation) {
      // Wrong location - show warning
      navigator.vibrate([100, 50, 100]);
      
      const correctLocationName = item.correctLocation === 'washing-drum' ? 'drum' : 'detergent tray';
      toast.warning(`Put ${item.type} in the ${correctLocationName}!`);
      
      // Shake the wrong zone
      setShakingZone(dropZone);
      setTimeout(() => setShakingZone(null), 500);
      
      return;
    }

    // Correct location - celebrate!
    playSound();
    navigator.vibrate(200);
    
    if (dropZone === 'washing-drum') {
      drumSparkRef.current?.handleDivClick();
    } else {
      traySparkRef.current?.handleDivClick();
    }

    toast.success(`${item.type.charAt(0).toUpperCase() + item.type.slice(1)} added correctly!`);

    // Update item status
    setItems(prevItems =>
      prevItems.map(i =>
        i.id === itemId
          ? {
              ...i,
              status: dropZone === 'washing-drum' ? 'IN_DRUM' : 'IN_TRAY',
            }
          : i
      )
    );
  }

  return (
    <div className="p-4 min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
          Load & Setup Washer
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Drag items to the correct location: detergent & softener in tray, clothes in drum
        </p>

        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="flex gap-8 items-start justify-center flex-wrap">
            {/* Pending Items Section */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                Items to Load ({items.filter(i => i.status === 'PENDING').length})
              </h2>
              <div className="flex flex-col gap-4">
                {items
                  .filter(item => item.status === 'PENDING')
                  .map(item => (
                    <WashingItem key={item.id} id={item.id} type={item.type} />
                  ))}
                {items.filter(i => i.status === 'PENDING').length === 0 && (
                  <p className="text-gray-400 text-center py-8">
                    All items loaded! 🎉
                  </p>
                )}
              </div>
            </div>

            {/* Washing Machine */}
            <div className="relative">
              <ClickSpark
                ref={drumSparkRef}
                sparkSize={60}
                sparkColor="#10B981"
                className={shakingZone === 'washing-drum' ? 'shake' : ''}
              >
                <ClickSpark
                  ref={traySparkRef}
                  sparkSize={40}
                  sparkColor="#3B82F6"
                  className={shakingZone === 'detergent-tray' ? 'shake' : ''}
                >
                  <EmptyWashingMachine width={400} height={500} />
                </ClickSpark>
              </ClickSpark>

              {/* Progress Indicator */}
              <div className="mt-4 text-center">
                <div className="bg-white p-4 rounded-lg shadow">
                  <p className="text-sm text-gray-600 mb-2">Progress</p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${(items.filter(i => i.status !== 'PENDING').length / items.length) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {items.filter(i => i.status !== 'PENDING').length} / {items.length} items loaded
                  </p>
                </div>
              </div>
            </div>

            {/* Completed Items Section */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                Loaded Items ✓
              </h2>
              <div className="space-y-3">
                {/* In Tray */}
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">In Tray:</h3>
                  {items
                    .filter(item => item.status === 'IN_TRAY')
                    .map(item => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 bg-blue-50 p-2 rounded mb-2"
                      >
                        <span className="text-2xl">
                          {item.type === 'detergent' ? '🧴' : '🌸'}
                        </span>
                        <span className="text-sm capitalize">{item.type}</span>
                      </div>
                    ))}
                  {items.filter(i => i.status === 'IN_TRAY').length === 0 && (
                    <p className="text-xs text-gray-400">Empty</p>
                  )}
                </div>

                {/* In Drum */}
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">In Drum:</h3>
                  {items
                    .filter(item => item.status === 'IN_DRUM')
                    .map(item => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 bg-green-50 p-2 rounded mb-2"
                      >
                        <span className="text-2xl">👕</span>
                        <span className="text-sm capitalize">{item.type}</span>
                      </div>
                    ))}
                  {items.filter(i => i.status === 'IN_DRUM').length === 0 && (
                    <p className="text-xs text-gray-400">Empty</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {allItemsPlaced && allItemsCorrect && (
            <div className="mt-8 text-center">
              <div className="bg-green-100 border-2 border-green-500 rounded-xl p-6 inline-block">
                <p className="text-3xl mb-2">🎉</p>
                <h3 className="text-2xl font-bold text-green-800 mb-2">
                  Great Job!
                </h3>
                <p className="text-green-700">
                  All items loaded correctly. Ready to start the wash cycle!
                </p>
              </div>
            </div>
          )}
        </DndContext>
      </div>
    </div>
  );
}




