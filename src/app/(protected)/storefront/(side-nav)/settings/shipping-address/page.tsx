"use client"
import { Button, } from '@chakra-ui/react'
import React from 'react'

export default function ShippingAddress
  () {
  return (
    <section>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 w-11/12 mx-auto py-8'>

        {Array(4)
          .fill(null)
          .map((i) => (
            <div key={i} className='border border-gray-300 p-5 flex flex-col gap-2 rounded-md mx-auto w-full cursor-pointer'>
              <h2 className='text-xl font-bold'>Shipping Address</h2>
              <p className='text-base font-bold'>+234 8123 456 789 </p>
              <p className='text-sm text-gray-500'>Lorem ipsum dolor sit amet consectetur adipisicing.</p>

              <HStack width={'65%'}>
                <EditShippingAddress id={"2"} />
                <DeleteShippingAddress />
              </HStack>
            </div>
          ))}
      </div>

      <div className='mt-10 mb-6 w-1/4 mx-auto'>
        <EditShippingAddress />
      </div>
    </section>
  )
}


import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl, FormLabel, HStack, Input, Flex,
} from '@chakra-ui/react'
function DeleteShippingAddress() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen} variant={"outline"} colorScheme={"red"} size={"sm"} width={"100%"}>Delete Address</Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Address</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this address from your shipping address?
          </ModalBody>

          <ModalFooter>
            <div className='w-full flex items-center justify-between gap-4'>
              <Button variant={"outline"} colorScheme={"grey"} size={"sm"} width='100%'>Discard</Button>
              <Button variant={"outline"} colorScheme={"red"} size={"sm"} width='100%'>Delete</Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

type EditShippingAddressProps = {
  id?: string;
};
function EditShippingAddress({ id }: EditShippingAddressProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen} variant={id ? "outline" : "solid"} colorScheme={"blue"} size={"sm"} width={"100%"}>{id ? "Edit Address" : "Add Address "}</Button>

      <Modal isOpen={isOpen} onClose={onClose} blockScrollOnMount={true} size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{id ? "Edit Shipping Address" : "Add Shipping Address "}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form className="space-y-5 mt-6">
              <HStack gap={5}>
                <FormControl>
                  <FormLabel>Address Label</FormLabel>
                  <Input type="text" defaultValue={'eg: Pharmacy One'} />
                </FormControl>
              </HStack>

              <HStack gap={5}>
                <FormControl>
                  <FormLabel>Full Name</FormLabel>
                  <Input type="text" defaultValue={'Jacquelyn’s Pharmacy'} />
                </FormControl>
                <FormControl>
                  <FormLabel>Phone Number</FormLabel>
                  <Input type="text" defaultValue={'Jacquelyn Bernard'} />
                </FormControl>
              </HStack>

              <HStack gap={5}>
                <FormControl>
                  <FormLabel>Country</FormLabel>
                  <Input type="text" defaultValue={'Select a country'} />
                </FormControl>
                <FormControl>
                  <FormLabel>State</FormLabel>
                  <Input type="number" defaultValue={'Select a state'} />
                </FormControl>
              </HStack>

              <HStack gap={5}>
                <FormControl>
                  <FormLabel>City</FormLabel>
                  <Input type="text" defaultValue={'Select a city'} />
                </FormControl>
                <FormControl>
                  <FormLabel>Zip Code</FormLabel>
                  <Input type="text" defaultValue={'eg: 1006390'} />
                </FormControl>
              </HStack>
            </form>
          </ModalBody>

          <ModalFooter>
            <div className='w-fit flex items-center justify-end gap-4'>
              <Button variant={"solid"} size={"sm"} width='125px'>Save</Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}