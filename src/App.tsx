import { useState } from 'react';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import type { Column, Item } from './types';
import Unsorted_clothes from './ui_components/Unsorted_clothes';
import Category_clothes from './ui_components/Category_clothes';

const COLUMNS: Column[] = [
  { id: 'UNSORTED'},
  { id: 'COLORED' },
  { id: 'WHITE' },
];

const INITIAL_ITEMS: Item[] = [
  {
    id: 'draggable-white-1',
    asset_src:'white',
    status: 'UNSORTED',
  },
  {
    id: 'draggable-white-2',
    asset_src:'white',
    status: 'UNSORTED',
  },
  {
    id: 'draggable-coloured-1',
    asset_src:'coloured',
    status: 'UNSORTED',
  },
  {
    id: 'draggable-coloured-2',
    asset_src:'coloured',
    status: 'UNSORTED',
  },
  {
    id: 'draggable-delicate',
    asset_src:'delicate',
    status: 'UNSORTED',
  },
  ];

export default function App() {
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const itemId = active.id as string;
    const extracted_active_status=itemId.split("-")[1].toUpperCase();
    const newStatus = over.id as Item['status'];
    const extracted_over_status=newStatus.split("-")[1].toUpperCase();
    if (extracted_active_status!=extracted_over_status){
      alert("wrong bucket")
      return;
    }
    console.log("extracted status ",extracted_over_status);

    

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
        <DndContext onDragEnd={handleDragEnd}>
          <Unsorted_clothes
                items={items.filter((item) => item.status === "UNSORTED")}
              />
          <Category_clothes type="white" items={items.filter((item) => item.status === "WHITE")}/>
          <Category_clothes type="COLOURED" items={items.filter((item) => item.status === "COLOURED")}/>
          <Category_clothes type="DELICATE" items={items.filter((item) => item.status === "DELICATE")}/>    
        </DndContext>
      </div>
    </div>
  );
}