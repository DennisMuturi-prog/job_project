import type { Item } from '@/types'
import React from 'react'
import Draggable from './Draggable'


interface UnsortedProps {
  items: Item[]
}

function Unsorted_clothes({ items }: UnsortedProps) {
  return (
    <div className='flex gap-8 justify-center'>
      {items.map((item) => (
        <Draggable key={item.id} id={item.id} >
          <img src={item.asset_src} alt="" width={80} height={80}/>
          
        </Draggable>
      ))}

    </div>
  )
}

export default Unsorted_clothes