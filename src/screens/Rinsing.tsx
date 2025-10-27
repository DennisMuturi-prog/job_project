import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"


import React, { useEffect, useRef, useState } from "react";
import {
    DndContext,
    type DragEndEvent,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useDroppable,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import type { LoadItem } from "@/types";
import Unsorted_laundry_items from "@/ui_components/unsorted_laundry_items";
import useSound from "use-sound";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Stepper } from '@/App';


// Import images from assets
import detergentImg from '@/assets/Ariel Original-small.webp';
import downyImg from '@/assets/Sweet elegance1-small.webp';
import loadedWasherImg from '@/assets/loaded_washing_machine-small.webp';

// Import sound as URL
import successSoundUrl from '@/assets/success_sound.mp3?url';


type CircleArea = {
    id: string;
    shape: "circle";
    coords: [number, number, number]; // cx, cy, r
    label: string;
};

type PolyArea = {
    id: string;
    shape: "poly";
    coords: number[]; // [x1, y1, x2, y2, ...]
    label: string;
};

type MapArea = CircleArea | PolyArea;

type Bounds = {
    left: number;
    top: number;
    width: number;
    height: number;
};

// ---- your map areas ----
const areas: MapArea[] = [
    {
        id: "tray",
        shape: "poly",
        coords: [273,78,277,223,199,263,21,244,19,79],
        label: "YouTube link",
    },
];

const INITIAL_ITEMS: LoadItem[] = [
    {
        id: 'detergent',
        asset_src: detergentImg,
        status: 'UNSORTED',
        correct_destination: 'NONE'
    },
    {
        id: 'downy',
        asset_src: downyImg,
        status: 'UNSORTED',
        correct_destination: 'TRAY'
    },

];


// ---- draggable block ----


// ---- droppable zones ----
interface HtmlDropZoneProps {
    id: string;
    bounds: Bounds;
}

const HtmlDropZone: React.FC<HtmlDropZoneProps> = ({ id, bounds }) => {
    const { isOver, setNodeRef } = useDroppable({ id });

    const style: React.CSSProperties = {
        position: "absolute",
        left: bounds.left,
        top: bounds.top,
        width: bounds.width,
        height: bounds.height,
        border: isOver ? "2px solid limegreen" : "2px solid transparent",
        zIndex: 5,
        cursor: "pointer",
    };

    return <div ref={setNodeRef} style={style} />;
};

// ---- main component ----
const Rinsing = ({ title }: { title: string }) => {
    const { next } = Stepper.useStepper();
    const [playSound] = useSound(successSoundUrl);
    const [items, setItems] = useState<LoadItem[]>(INITIAL_ITEMS);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const [bounds, setBounds] = useState<Record<string, Bounds>>({});
    const [applyShaking, setApplyShaking] = useState(false);
    const unsortedItems = items.filter((item) => item.status === "UNSORTED");
    const isComplete = unsortedItems.length === 1;

    useEffect(() => {
        const img = imgRef.current;
        if (!img) return;

        const updateScale = (): void => {
            const rect = img.getBoundingClientRect();
            const { naturalWidth, naturalHeight } = img;

            // Prevent NaN by ensuring image is loaded
            if (naturalWidth === 0 || naturalHeight === 0) return;

            const scaleX = rect.width / naturalWidth;
            const scaleY = rect.height / naturalHeight;

            const newBounds: Record<string, Bounds> = {};
            areas.forEach((a) => {
                if (a.shape === "circle") {
                    const [cx, cy, r] = a.coords;
                    newBounds[a.id] = {
                        left: (cx - r) * scaleX,
                        top: (cy - r) * scaleY,
                        width: 2 * r * scaleX,
                        height: 2 * r * scaleY,
                    };
                } else {
                    const xs = a.coords.filter((_, i) => i % 2 === 0);
                    const ys = a.coords.filter((_, i) => i % 2 === 1);
                    const minX = Math.min(...xs);
                    const maxX = Math.max(...xs);
                    const minY = Math.min(...ys);
                    const maxY = Math.max(...ys);
                    newBounds[a.id] = {
                        left: minX * scaleX,
                        top: minY * scaleY,
                        width: (maxX - minX) * scaleX,
                        height: (maxY - minY) * scaleY,
                    };
                }
            });
            setBounds(newBounds);
        };

        // Only add load listener if image isn't already loaded
        if (img.complete) {
            updateScale();
        } else {
            img.addEventListener("load", updateScale);
        }
        window.addEventListener("resize", updateScale);
        return () => {
            window.removeEventListener("resize", updateScale);
            img.removeEventListener("load", updateScale);
        };
    }, []);

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (!over) return;

        const itemId = active.id as string;
        const current_active_info = itemId.split("-");
        const current_active_name = (current_active_info[0]).toUpperCase();
        const current_active_correct_destination = (current_active_info[1]).toUpperCase();
        const over_status = (over.id as LoadItem['status']).toUpperCase();
        if (over_status != current_active_correct_destination) {
            navigator.vibrate([10, 30]);
            setApplyShaking(true);
            setTimeout(() => setApplyShaking(false), 500);
            if (current_active_name == 'DETERGENT') {
                toast.warning("detergent is not used in the rinse cycle");
            } else {
                toast.warning(`put ${current_active_name} clothes in the ${current_active_correct_destination}`);
            }
            return;
        }
        // if (extracted_over_status === "WHITE") {
        //     divWhiteRef.current?.handleDivClick()

        // } else if (extracted_over_status == "COLOURED") {
        //     divColouredRef.current?.handleDivClick()
        // } else {
        //     divDelicateRef.current?.handleDivClick()
        // }
        const active_name = current_active_name.toLowerCase();
        playSound()
        setItems(() =>
            items.map((item) =>
                item.id === active_name
                    ? {
                        ...item,
                        status: "SORTED",
                    }
                    : item,
            ),
        );
    }
    const mouseSensor = useSensor(MouseSensor);
       const touchSensor = useSensor(TouchSensor);
        const keyboardSensor = useSensor(KeyboardSensor);
        const sensors = useSensors(
          mouseSensor,
          touchSensor,
          keyboardSensor,
        );

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>Downy keeps your clothes soft and fresh</CardDescription>
            </CardHeader>
            <CardContent>
                <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
                    <div className="flex">
                        <div style={{ position: "relative", display: "inline-block" }} className={applyShaking ? "shake" : ""}>
                            <img
                                ref={imgRef}
                                src={loadedWasherImg}
                                alt="Map"
                                className="w-full h-auto max-h-[70vh] object-contain block"
                            />
                            {/* Invisible droppable zones */}
                            {Object.entries(bounds).map(([id, b]) => (
                                <HtmlDropZone key={id} id={id} bounds={b} />
                            ))}
                        </div>
                        <Unsorted_laundry_items
                            items={unsortedItems}
                        />
                    </div>
                </DndContext>
            </CardContent>
            <CardFooter>
                {isComplete && <Button className="bounce_button" onClick={next}>RINSE,SPIN AND DRY</Button>}
            </CardFooter>
        </Card>

    );
};

export default Rinsing;