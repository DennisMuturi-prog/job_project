import type { Item } from '@/types'
import Droppable from './Droppable';

interface CategoryProps {
  items: Item[],
  type: string,
  asset_src: string
}

function Category_clothes({ items, type, asset_src }: CategoryProps) {
  return (
    <div>

      <Droppable id={`droppable-${type}`}>
        <img src={asset_src} alt="" width={80} height={80} />
        <h2>{`${type}S`}</h2>

      </Droppable>
      
        {items.map((item) => (
          <div key={item.id}>
            <img src={item.asset_src} alt="" width={80} height={80} />
          </div>
        ))}
    </div>
  )
}

export default Category_clothes