import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    FormControl,
    FormLabel,
    Input,
    chakra,
    HStack,
    Button
  } from '@chakra-ui/react'

import shape from '@public/assets/images/shapes.svg';
import Image from 'next/image';

const AddNewDrawer = ({isOpen, onClose, type}: {isOpen: boolean, onClose: () => void, type: string}) => {
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
          <DrawerHeader className='capitalize'>Add New {type}</DrawerHeader>
          <DrawerBody>
            <form>
                <FormControl mb={5}>
                    <FormLabel>
                        Business Name 
                        <chakra.span className='text-red-600'>*</chakra.span>
                    </FormLabel>
                    <Input placeholder='Enter you business name...' />
                </FormControl>
                <FormControl mb={10}>
                    <FormLabel>
                        Business Email
                        <chakra.span className='text-red-600'>*</chakra.span>
                    </FormLabel>
                    <Input placeholder='Enter you business email...' />
                </FormControl>
                <HStack gap={4} mt={6}>
                    <Button variant={"outline"}>Cancel</Button>
                    <Button className='bg-primary-600 text-white w-[65%]'>Add {type}</Button>
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

export default AddNewDrawer