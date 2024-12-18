import React from 'react'
import { temp_order } from '../temporders'
import OrderCardComponent from '../../../_components/(my-orders-component)/OrderCardComponent'

export default function MyOrdersPages() {
  return (
    <div>

      {temp_order.map((item) => (
        <OrderCardComponent key={item?.order_id} product={item} />

      ))}
    </div>
  )
}


