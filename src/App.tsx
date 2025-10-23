import { useRef, useState } from 'react';
import { DndContext, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import type { Item } from './types';
import Unsorted_clothes from './ui_components/Unsorted_clothes';
import Category_clothes from './ui_components/Category_clothes';
import type { SparkRef } from './components/ClickSpark';
import ClickSpark from './components/ClickSpark';
import useSound from 'use-sound';
import { Toaster } from "@/components/ui/sonner"

import { toast } from "sonner"





const INITIAL_ITEMS: Item[] = [
  {
    id: 'draggable-white-1',
    asset_src: 'white',
    status: 'UNSORTED',
  },
  {
    id: 'draggable-white-2',
    asset_src: 'white',
    status: 'UNSORTED',
  },
  {
    id: 'draggable-coloured-1',
    asset_src: 'coloured',
    status: 'UNSORTED',
  },
  {
    id: 'draggable-coloured-2',
    asset_src: 'coloured',
    status: 'UNSORTED',
  },
  {
    id: 'draggable-delicate',
    asset_src: 'delicate',
    status: 'UNSORTED',
  },
];

export default function App() {
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(
    mouseSensor,
    touchSensor,
    keyboardSensor,
  );
  const [playSound] = useSound('/success_sound.mp3');
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);
  const divWhiteRef = useRef<SparkRef>(null);
  const divColouredRef = useRef<SparkRef>(null);
  const divDelicateRef = useRef<SparkRef>(null);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const itemId = active.id as string;
    const extracted_active_status = itemId.split("-")[1].toUpperCase();
    const newStatus = over.id as Item['status'];
    const extracted_over_status = newStatus.split("-")[1].toUpperCase();
    if (extracted_active_status != extracted_over_status) {
      navigator.vibrate([100, 200, 100]);
      toast.warning(`put ${extracted_active_status} clothes in the ${extracted_active_status} bucket`)
      return;
    }
    console.log("extracted status ", extracted_over_status);

    if (extracted_over_status === "WHITE") {
      divWhiteRef.current?.handleDivClick()

    } else if (extracted_over_status == "COLOURED") {
      divColouredRef.current?.handleDivClick()
    } else {
      divDelicateRef.current?.handleDivClick()
    }
    playSound()
    setItems(() =>
      items.map((item) =>
        item.id === itemId
          ? {
            ...item,
            status: extracted_over_status,
          }
          : item,
      ),
    );
  }

  return (
    <div className="p-4">
      <div className="flex gap-8">
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <Unsorted_clothes
            items={items.filter((item) => item.status === "UNSORTED")}
          />
          <ClickSpark sparkSize={50} sparkColor="#7CFC00" ref={divWhiteRef} >
            <Category_clothes type="white" items={items.filter((item) => item.status === "WHITE")} />
          </ClickSpark >
          <ClickSpark sparkSize={50} sparkColor="#7CFC00" ref={divColouredRef} >
            <Category_clothes type="COLOURED" items={items.filter((item) => item.status === "COLOURED")} />

          </ClickSpark>
          <ClickSpark sparkSize={50} sparkColor="#7CFC00" ref={divDelicateRef}>
            <Category_clothes type="DELICATE" items={items.filter((item) => item.status === "DELICATE")} />
          </ClickSpark>
        </DndContext>
      </div>
      <Toaster/>
    </div>
  );
}