import React from 'react'
import OrderCardComponent from '../../../_components/wishlist-component)/OrderCardComponent'
import { temp_order } from '../temporders'

export default function CompletedOrdersPages() {
  return (
    <div>

      {temp_order.filter((o) => o.status.toLowerCase() === "completed").map((item) => (
        <OrderCardComponent key={item?.order_id} product={item} />

      ))}
    </div>
  )
}


