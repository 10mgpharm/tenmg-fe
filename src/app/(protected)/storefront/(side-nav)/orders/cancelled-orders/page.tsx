import React from 'react'
import { temp_order } from '../temporders'
import OrderCardComponent from '../../../_components/(my-orders-component)/OrderCardComponent'

export default function CompletedOrdersPages() {
  return (
    <div>

      {temp_order.filter((o) => o.status.toLowerCase() !== "completed" && o.status.toLowerCase() !== 'pending').map((item) => (
        <OrderCardComponent key={item?.order_id} product={item} />

      ))}
    </div>
  )
}


