import React from 'react'
import WishListCardComponent from '../../_components/wishlist-component)/WishListCardComponent'
import { temp_order } from '../orders/temporders'

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
