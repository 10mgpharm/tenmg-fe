import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Button,
    Input,
    Text,
    Stack,
    Checkbox,
    Tag,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    FormLabel,
    FormControl,
  } from '@chakra-ui/react'
import { FaSearch } from 'react-icons/fa'
import { FaCalendar } from 'react-icons/fa6'

const FilterDrawer = ({isOpen, onClose}: {isOpen: boolean, onClose: () => void}) => {
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
          <DrawerHeader>
            <Text fontWeight={"medium"} fontSize={"large"}>Filters</Text>
            <Text fontWeight={"normal"} fontSize={"13px"} color={"gray.500"}>Apply filters to table data.</Text>
          </DrawerHeader>
          <DrawerBody>
            <Stack spacing={5} direction='column'>
                <Checkbox>
                    <Tag colorScheme={"green"}>In stock</Tag>
                </Checkbox>
                <Checkbox>
                    <Tag colorScheme={"orange"}>Low stock</Tag>
                </Checkbox>
                <Checkbox>
                    <Tag colorScheme={"red"}>Out of stock</Tag>
                </Checkbox>
            </Stack>
            <Stack mt={5}>
                <Text mb={4}>Brand</Text>
                <InputGroup>
                    <InputLeftElement pointerEvents='none'>
                    <FaSearch className='text-gray-400' />
                    </InputLeftElement>
                    <Input type='text' placeholder='Search' />
                </InputGroup>
                <Stack mt={5}>
                    <Checkbox>
                        Brand One
                    </Checkbox>
                    <Checkbox>
                        Brand Two
                    </Checkbox>
                    <Checkbox>
                        Brand Three
                    </Checkbox>
                    <Checkbox>
                        Brand Four
                    </Checkbox>
                    <Checkbox>
                        Brand Five
                    </Checkbox>
                    <Checkbox>
                        Brand Six
                    </Checkbox>
                </Stack>
            </Stack>
            <Stack mt={5}>
                <Text mb={4}>Date</Text>
                <FormControl>
                    <FormLabel>
                        From
                    </FormLabel>
                    <InputGroup>
                        <Input type='text' placeholder='Search' />
                        <InputRightElement pointerEvents='none'>
                            <FaCalendar className='text-gray-500' />
                        </InputRightElement>
                    </InputGroup>
                </FormControl>
                <FormControl mt={4}>
                    <FormLabel>
                        To
                    </FormLabel>
                    <InputGroup>
                        <Input type='text' placeholder='Search' />
                        <InputRightElement pointerEvents='none'>
                            <FaCalendar className='text-gray-500' />
                        </InputRightElement>
                    </InputGroup>
                </FormControl>
            </Stack>
          </DrawerBody>

          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='blue'>Apply</Button>
          </DrawerFooter>
        </DrawerContent>
    </Drawer>
  )
}

export default FilterDrawer