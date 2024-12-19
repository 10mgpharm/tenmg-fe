import React from 'react'
import { temp_order } from '../orders/temporders'
import WishListCardComponent from '../../_components/(wishlist-component)/WishListCardComponent'

export default function MyWishListPage() {
  return (
    <div>
      <div>
        {temp_order.slice(5).map((item) => (
          <WishListCardComponent key={item?.order_id} product={item} />
        ))}
      </div>
    </div>
  )
}
