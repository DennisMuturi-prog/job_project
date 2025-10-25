import type {  LoadItem } from '@/types'
import Draggable from './Draggable'

interface UnsortedProps {
    items:LoadItem[]
}

function Unsorted_laundry_items({items}:UnsortedProps) {
  return (
    <div>
        {items.map((item) => (
        <div className='mb-2'>
          <Draggable key={item.id} id={`${item.id}-${item.correct_destination}`} >
              <img src={item.asset_src} alt="" width={80} height={80}/>
              <p>Add {item.id}</p>
          </Draggable>
        </div>
      ))}

    </div>
  )
}

export default Unsorted_laundry_items