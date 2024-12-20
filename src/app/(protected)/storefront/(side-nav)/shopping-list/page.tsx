import React from 'react'
import { temp_order } from '../orders/temporders'
import ShoppingListCardComponent from '../../_components/(shoppinglist-component)/ShoppingListCardComponent'

export default function ShoppingListPage() {
  return (
    <div>
      <div>
        {temp_order.slice(5).map((item) => (
          <ShoppingListCardComponent key={item?.order_id} product={item} />
        ))}
      </div>
    </div>
  )
}
