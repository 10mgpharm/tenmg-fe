import React from 'react'

import { redirect } from "next/navigation"
export default function OrderDetailsPages() {

  // redirect to initial tab page
  redirect('orders/my-orders');
}