import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';

interface DraggableProps {
    children?: React.ReactNode;
    id:string
}

function Draggable(props: DraggableProps) {
    const { attributes, listeners, setNodeRef,transform} = useDraggable({
        id: props.id,
    });
    const style = {
        transform: CSS.Translate.toString(transform),
    }


    return (
        <button ref={setNodeRef}  {...listeners} {...attributes} style={style}>
            {props.children}
        </button>
    );
}
export default Draggable;