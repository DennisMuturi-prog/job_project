import type {  LoadItem } from '@/types'
import Draggable from './Draggable'

interface UnsortedProps {
    items:LoadItem[]
}

function Unsorted_laundry_items({items}:UnsortedProps) {
  return (
    <div>
        {items.map((item) => (
        <Draggable key={item.id} id={`${item.id}-${item.correct_destination}`} >
            <h1>{item.asset_src}</h1>
        </Draggable>
      ))}

    </div>
  )
}

export default Unsorted_laundry_items