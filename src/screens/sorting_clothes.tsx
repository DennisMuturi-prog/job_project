import ClickSpark, { type SparkRef } from "@/components/ClickSpark";
import { Button } from "@/components/ui/button";
import type { Item } from "@/types";
import Category_clothes from "@/ui_components/Category_clothes";
import Unsorted_clothes from "@/ui_components/Unsorted_clothes";
import { useSensor, MouseSensor, TouchSensor, KeyboardSensor, useSensors, type DragEndEvent, DndContext } from "@dnd-kit/core";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import useSound from "use-sound";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Stepper } from '@/App';

import shirtImg from '@/assets/shirt.webp';
import tshirtImg from '@/assets/tshirt.webp';
import towelImg from '@/assets/towel.webp';
import hoodieImg from '@/assets/hoodie.webp';
import jeanImg from '@/assets/039_jean.webp';
import basket1Img from '@/assets/laundry_basket1.webp';
import basket2Img from '@/assets/laundry_basket_2.webp';
import basket3Img from '@/assets/laundry_basket_3.webp';

// Import sounds as URLs so use-sound receives a proper path
import successSoundUrl from '@/assets/success_sound.mp3?url';
import winningSoundUrl from '@/assets/winning-82808.mp3?url';


const INITIAL_ITEMS: Item[] = [
  {
    id: 'draggable-white-1',
    asset_src: shirtImg,
    status: 'UNSORTED',
  },
  {
    id: 'draggable-white-2',
    asset_src: tshirtImg,
    status: 'UNSORTED',
  },
  {
    id: 'draggable-coloured-1',
    asset_src: towelImg,
    status: 'UNSORTED',
  },
  {
    id: 'draggable-coloured-2',
    asset_src: hoodieImg,
    status: 'UNSORTED',
  },
  {
    id: 'draggable-delicate',
    asset_src: jeanImg,
    status: 'UNSORTED',
  },
];

export default function SortingClothes({ title }: { title: string }) {
  const { next } = Stepper.useStepper();
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(
    mouseSensor,
    touchSensor,
    keyboardSensor,
  );
  const [playSound] = useSound(successSoundUrl);
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);
  const divWhiteRef = useRef<SparkRef>(null);
  const divColouredRef = useRef<SparkRef>(null);
  const divDelicateRef = useRef<SparkRef>(null);
  const [shakingBucket, setShakingBucket] = useState<string | null>(null);
  const [playSuccessChime] = useSound(winningSoundUrl); // Add this
  const unsortedItems = items.filter((item) => item.status === "UNSORTED");
  const isComplete = unsortedItems.length === 0;

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const itemId = active.id as string;
    const extracted_active_status = itemId.split("-")[1].toUpperCase();
    const newStatus = over.id as Item['status'];
    const extracted_over_status = newStatus.split("-")[1].toUpperCase();
    if (extracted_active_status != extracted_over_status) {
      navigator.vibrate([10, 30]);
      toast.warning(`put ${extracted_active_status} clothes in the ${extracted_active_status} bucket`)
      setShakingBucket(extracted_over_status);
      setTimeout(() => setShakingBucket(null), 500);
      return;
    }

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

  useEffect(() => {
    if (isComplete) {
      playSuccessChime();
      toast.success("🎉 Congratulations! All clothes sorted!", {
        duration: 5000,
      });
    }
    console.log("happened")
  }, [isComplete, playSuccessChime]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <Unsorted_clothes
            items={unsortedItems}
          />
          {isComplete || <p>Drag and drop clothes in the right basket</p>}
          <div className="flex gap-2">
            <ClickSpark sparkSize={50} sparkColor="#7CFC00" ref={divWhiteRef} className={shakingBucket === "WHITE" ? "shake" : ""}>
              <Category_clothes asset_src={basket1Img} type="WHITE" items={items.filter((item) => item.status === "WHITE")} />
            </ClickSpark >

            <ClickSpark sparkSize={50} sparkColor="#7CFC00" ref={divColouredRef} className={shakingBucket === "COLOURED" ? "shake" : ""}>
              <Category_clothes asset_src={basket2Img} type="COLOURED" items={items.filter((item) => item.status === "COLOURED")} />
            </ClickSpark>
            <ClickSpark sparkSize={50} sparkColor="#7CFC00" ref={divDelicateRef} className={shakingBucket === "DELICATE" ? "shake" : ""}>
              <Category_clothes asset_src={basket3Img} type="DELICATE" items={items.filter((item) => item.status === "DELICATE")} />
            </ClickSpark>
          </div>
        </DndContext>
      </CardContent>
      <CardFooter>
        {isComplete && <Button className="bounce_button" onClick={next}>next</Button>}
      </CardFooter>
    </Card>

  );
}