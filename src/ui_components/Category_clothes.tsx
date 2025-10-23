import type { Item } from '@/types'
import React from 'react'
import Draggable from './Draggable'
import Droppable from './Droppable';

interface CategoryProps {
    items:Item[],
    type:string
}

function Category_clothes({items,type}:CategoryProps) {
  return (
    <div>
      <h1>Category {type}</h1>
        {items.map((item) => (
        <Draggable key={item.id} id={item.id} >
            <h2>{item.asset_src}</h2>
        </Draggable>
      ))}
      <Droppable id={`droppable-${type}`}>
        <h2>{`${type} bucket`}</h2>
    
      </Droppable>
    </div>
  )
}

export default Category_clothes