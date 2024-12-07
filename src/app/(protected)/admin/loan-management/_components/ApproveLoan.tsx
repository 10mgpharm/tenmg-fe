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
    Avatar,
    Stack,
    Text,
    Box
  } from '@chakra-ui/react'

import shape from '@public/assets/images/Rectangle.svg';
import Image from 'next/image';

const ApproveLoan = (
    {isOpen, onClose}: 
    {isOpen: boolean, onClose: () => void}
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
            <Stack>
                <Flex gap={2} mb={3}>
                    <Avatar name='Ahmed Olarewaju'/>
                    <Stack gap={0.5}>
                        <Text fontSize={"15px"} fontWeight={600} color={"gray.600"}>Ahmed Olanrewaju</Text>
                        <Text fontSize={"13px"} color={"gray.500"}>ahmed@bubblespharm.com</Text>
                    </Stack>
                </Flex>
                <FormControl>
                    <FormLabel>Offer Amount</FormLabel>
                    <Input type='text' value={'₦15,161,060'}/>
                </FormControl>
                <Box className='rounded border border-orange-200 bg-orange-100 p-3 space-y-2 mt-3'>
                    <Text>Interest rate: 25%</Text>
                    <Text>Repayment Amount: N1,250,000.00</Text>
                    <Text>Monthly Interest: N15,0000</Text>
                    <Text>Monthly Repayment: N100,000</Text>
                </Box>
            </Stack>
            <HStack mt={5} justify={"end"}>
                <Flex gap={3}>
                    <Button w={"120px"} onClick={onClose} variant={"outline"}>Cancel</Button>
                    <Button 
                    w={"120px"}
                    onClick={() => onClose()} 
                    className='bg-primary-500 text-white'>
                        Proceed
                    </Button>
                </Flex>
            </HStack>
          </DrawerBody>
          <DrawerFooter p={0}>
            <Image src={shape} alt=''/>
          </DrawerFooter>
        </DrawerContent>
    </Drawer>
  )
}

export default ApproveLoan;