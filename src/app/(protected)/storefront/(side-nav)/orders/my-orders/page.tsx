import React from 'react'
import OrderCardComponent from '../../../_components/(my-orders-component)/OrderCardComponent'
import { temp_order } from '../temporders'

export default function MyOrdersPages() {
  return (
    <div>

      {temp_order.map((item) => (
        <OrderCardComponent key={item?.order_id} product={item} />

      ))}
    </div>
  )
}


