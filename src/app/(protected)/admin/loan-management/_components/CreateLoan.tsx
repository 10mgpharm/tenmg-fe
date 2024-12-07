import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Flex,
    FormControl,
    FormLabel,
    Input,
    HStack,
    Button,
    Select
  } from '@chakra-ui/react'

import shape from '@public/assets/images/Rectangle 43.svg';
import Image from 'next/image';

const CreateLoan = (
    {isOpen, onClose, onOpenSuccess}: 
    {isOpen: boolean, onClose: () => void, onOpenSuccess: () => void}
) => {
  return (
    <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        size={"md"}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader className='capitalize'>Apply for Loan</DrawerHeader>
          <DrawerBody>
            <form>
                <FormControl>
                    <FormLabel>Customer by Name or ID</FormLabel>
                    <Input type='text' placeholder='Eg. Jude Bellingham or MG-10932023'/>
                </FormControl>
                <FormControl mt={5}>
                    <FormLabel>Loan Amount</FormLabel>
                    <Input type='number' placeholder='N 3,000.000.00'/>
                </FormControl>
                <FormControl mt={5}>
                    <FormLabel>Loan Repayment</FormLabel>
                    <Select placeholder='Choose Repayment Period '>
                        <option value=""></option>
                    </Select>
                </FormControl>
                <HStack mt={5} justify={"end"}>
                  <Flex gap={3}>
                    <Button w={"120px"} onClick={onClose} variant={"outline"}>Cancel</Button>
                    <Button 
                    w={"120px"}
                    onClick={() => {
                        onClose()
                        onOpenSuccess()
                    }} 
                    className='bg-primary-500 text-white'>
                        Apply for Loan
                    </Button>
                  </Flex>
                </HStack>
            </form>
          </DrawerBody>
          <DrawerFooter p={0}>
            <Image src={shape} alt=''/>
          </DrawerFooter>
        </DrawerContent>
    </Drawer>
  )
}

export default CreateLoan;