import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';

interface DraggableProps {
    children?: React.ReactNode;
    id:string
}

function Draggable(props: DraggableProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: props.id,
    });
    
    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        zIndex: isDragging ? 1000 : 'auto',
        cursor: isDragging ? 'grabbing' : 'grab',
        opacity: isDragging ? 0.8 : 1,
    };
    return (
        <button ref={setNodeRef}  {...listeners} {...attributes} style={style}>
            {props.children}
        </button>
    );
}
export default Draggable;