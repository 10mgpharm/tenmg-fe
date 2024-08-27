import { Button } from '@nextui-org/react'
import React from 'react'

export const ButtonList = () => {
  return (

      <main className="flex min-h-screen flex-col items-center justify-between p-24 w-full">
          <div className="grid grid-cols-3 gap-10">
              <Button color="primary" size="sm">Apply for 10MG Credit</Button>
              <Button color="primary" size="md">Apply for 10MG Credit</Button>
              <Button color="primary" size="lg">Apply for 10MG Credit</Button>
          </div>
          <div className="grid grid-cols-3 gap-10">
              <Button color="secondary" size="sm">Apply for 10MG Credit</Button>
              <Button color="secondary" size="md">Apply for 10MG Credit</Button>
              <Button color="secondary" size="lg">Apply for 10MG Credit</Button>
          </div>
          <div className="grid grid-cols-3 gap-10">
              <Button color="success" size="sm">Apply for 10MG Credit</Button>
              <Button color="success" size="md">Apply for 10MG Credit</Button>
              <Button color="success" size="lg">Apply for 10MG Credit</Button>
          </div>
          <div className="grid grid-cols-3 gap-10">
              <Button color="warning" size="sm">Apply for 10MG Credit</Button>
              <Button color="warning" size="md">Apply for 10MG Credit</Button>
              <Button color="warning" size="lg">Apply for 10MG Credit</Button>
          </div>
          <div className="grid grid-cols-3 gap-10">
              <Button color="danger" size="sm">Apply for 10MG Credit</Button>
              <Button color="danger" size="md">Apply for 10MG Credit</Button>
              <Button color="danger" size="lg">Apply for 10MG Credit</Button>
          </div>
          <div className="grid grid-cols-3 gap-10">
              <Button color="default" size="sm">Apply for 10MG Credit</Button>
              <Button color="default" size="md">Apply for 10MG Credit</Button>
              <Button color="default" size="lg">Apply for 10MG Credit</Button>
          </div>
      </main>
  )
}
