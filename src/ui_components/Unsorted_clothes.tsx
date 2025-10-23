import type { Item } from '@/types'
import React from 'react'
import Draggable from './Draggable'

interface UnsortedProps {
    items:Item[]
}

function Unsorted_clothes({items}:UnsortedProps) {
  return (
    <div>
        {items.map((item) => (
        <Draggable key={item.id} id={item.id} >
            <h1>{item.asset_src}</h1>
        </Draggable>
      ))}

    </div>
  )
}

export default Unsorted_clothes