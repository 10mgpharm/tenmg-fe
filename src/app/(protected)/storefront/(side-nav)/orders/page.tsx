import React from 'react'

import { redirect } from "next/navigation"
export default function OrderPages() {

  // redirect to initial tab page
  redirect('orders/my-orders');
}
