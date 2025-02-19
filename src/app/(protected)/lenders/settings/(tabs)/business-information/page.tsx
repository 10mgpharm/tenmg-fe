import { Button, Divider, Switch } from '@chakra-ui/react'
import React, { useCallback } from 'react'
import BusinessInfoFormComp from './businessInfoFormComp'
import BankInfoFormComp from './BankInfoFormComp'

export default function Page() {
  return (
    <div>
      <BusinessInfoFormComp />
      <BankInfoFormComp />
    </div>
  )
}
