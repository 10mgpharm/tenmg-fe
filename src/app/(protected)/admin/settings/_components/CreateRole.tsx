import { 
    Box,
    Button, 
    Checkbox, 
    Drawer, 
    DrawerBody, 
    DrawerCloseButton, 
    DrawerContent, 
    DrawerFooter,
    DrawerHeader, 
    DrawerOverlay, 
    Flex, 
    FormControl, 
    FormLabel, 
    HStack, 
    Input, 
    Menu, 
    MenuButton, 
    MenuItem, 
    MenuList, 
    Select,
    Stack,
    Text,
    Textarea,
    chakra,
} from "@chakra-ui/react";
import Image from "next/image";
import shape from '@public/assets/images/Rectangle.svg';
import { ChevronDownIcon } from "lucide-react";

const CreateRole = ({isOpen, onClose}: {isOpen: boolean, onClose: () => void}) => {
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
          <DrawerHeader className='capitalize'>Create Role</DrawerHeader>
          <DrawerBody>
            <form>
                <FormControl mb={5}>
                    <FormLabel>Role Name</FormLabel>
                    <Input placeholder='' />
                </FormControl>
                <FormControl mb={10}>
                    <FormLabel>Description</FormLabel>
                    <Textarea />
                </FormControl>
                <FormControl mb={10}>
                    <FormLabel>Permissions</FormLabel>
                    <Stack gap={2}>
                        <Flex align={"center"} justify={"space-between"}>
                            <Checkbox size='md' fontSize={"15px"} >
                                Placeholder
                            </Checkbox>
                           <Menu closeOnSelect={false}>
                            <MenuButton as={Box}>
                                <Flex gap={1}>
                                    <chakra.span className="text-[15px] font-medium">Select</chakra.span>
                                    <ChevronDownIcon className="w-5 h-auto text-gray-600" />
                                </Flex>
                            </MenuButton>
                            <MenuList>
                                <MenuItem>
                                    <Checkbox size='md' fontSize={"15px"} >
                                        Create
                                    </Checkbox>
                                </MenuItem>
                                <MenuItem>
                                    <Checkbox size='md' fontSize={"15px"} >
                                        Edit
                                    </Checkbox>
                                </MenuItem>
                                <MenuItem>
                                    <Checkbox size='md' fontSize={"15px"} >
                                        Delete
                                    </Checkbox>
                                </MenuItem>
                                <MenuItem>
                                    <Checkbox size='md' fontSize={"15px"} >
                                        Update
                                    </Checkbox>
                                </MenuItem>
                            </MenuList>
                            </Menu>
                        </Flex>
                        <Flex align={"center"} justify={"space-between"}>
                            <Checkbox size='md' fontSize={"15px"} >
                                Placeholder
                            </Checkbox>
                           <Menu closeOnSelect={false}>
                            <MenuButton as={Box}>
                                <Flex gap={1}>
                                    <chakra.span className="text-[15px] font-medium">Select</chakra.span>
                                    <ChevronDownIcon className="w-5 h-auto text-gray-600" />
                                </Flex>
                            </MenuButton>
                            <MenuList>
                                <MenuItem>
                                    <Checkbox size='md' fontSize={"15px"} >
                                        Create
                                    </Checkbox>
                                </MenuItem>
                                <MenuItem>
                                    <Checkbox size='md' fontSize={"15px"} >
                                        Edit
                                    </Checkbox>
                                </MenuItem>
                                <MenuItem>
                                    <Checkbox size='md' fontSize={"15px"} >
                                        Delete
                                    </Checkbox>
                                </MenuItem>
                                <MenuItem>
                                    <Checkbox size='md' fontSize={"15px"} >
                                        Update
                                    </Checkbox>
                                </MenuItem>
                            </MenuList>
                            </Menu>
                        </Flex>
                        <Flex align={"center"} justify={"space-between"}>
                            <Checkbox size='md' fontSize={"15px"} >
                                Placeholder
                            </Checkbox>
                           <Menu closeOnSelect={false}>
                            <MenuButton as={Box}>
                                <Flex gap={1}>
                                    <chakra.span className="text-[15px] font-medium">Select</chakra.span>
                                    <ChevronDownIcon className="w-5 h-auto text-gray-600" />
                                </Flex>
                            </MenuButton>
                            <MenuList>
                                <MenuItem>
                                    <Checkbox size='md' fontSize={"15px"} >
                                        Create
                                    </Checkbox>
                                </MenuItem>
                                <MenuItem>
                                    <Checkbox size='md' fontSize={"15px"} >
                                        Edit
                                    </Checkbox>
                                </MenuItem>
                                <MenuItem>
                                    <Checkbox size='md' fontSize={"15px"} >
                                        Delete
                                    </Checkbox>
                                </MenuItem>
                                <MenuItem>
                                    <Checkbox size='md' fontSize={"15px"} >
                                        Update
                                    </Checkbox>
                                </MenuItem>
                            </MenuList>
                            </Menu>
                        </Flex>
                        <Flex align={"center"} justify={"space-between"}>
                            <Checkbox size='md' fontSize={"15px"} >
                                Placeholder
                            </Checkbox>
                           <Menu closeOnSelect={false}>
                            <MenuButton as={Box}>
                                <Flex gap={1}>
                                    <chakra.span className="text-[15px] font-medium">Select</chakra.span>
                                    <ChevronDownIcon className="w-5 h-auto text-gray-600" />
                                </Flex>
                            </MenuButton>
                            <MenuList>
                                <MenuItem>
                                    <Checkbox size='md' fontSize={"15px"} >
                                        Create
                                    </Checkbox>
                                </MenuItem>
                                <MenuItem>
                                    <Checkbox size='md' fontSize={"15px"} >
                                        Edit
                                    </Checkbox>
                                </MenuItem>
                                <MenuItem>
                                    <Checkbox size='md' fontSize={"15px"} >
                                        Delete
                                    </Checkbox>
                                </MenuItem>
                                <MenuItem>
                                    <Checkbox size='md' fontSize={"15px"} >
                                        Update
                                    </Checkbox>
                                </MenuItem>
                            </MenuList>
                            </Menu>
                        </Flex>
                        <Flex align={"center"} justify={"space-between"}>
                            <Checkbox size='md' fontSize={"15px"} >
                                Placeholder
                            </Checkbox>
                           <Menu closeOnSelect={false}>
                            <MenuButton as={Box}>
                                <Flex gap={1}>
                                    <chakra.span className="text-[15px]">Select</chakra.span>
                                    <ChevronDownIcon className="w-5 h-auto text-gray-600" />
                                </Flex>
                            </MenuButton>
                            <MenuList>
                                <MenuItem>
                                    <Checkbox size='md' fontSize={"15px"} >
                                        Create
                                    </Checkbox>
                                </MenuItem>
                                <MenuItem>
                                    <Checkbox size='md' fontSize={"15px"} >
                                        Edit
                                    </Checkbox>
                                </MenuItem>
                                <MenuItem>
                                    <Checkbox size='md' fontSize={"15px"} >
                                        Delete
                                    </Checkbox>
                                </MenuItem>
                                <MenuItem>
                                    <Checkbox size='md' fontSize={"15px"} >
                                        Update
                                    </Checkbox>
                                </MenuItem>
                            </MenuList>
                            </Menu>
                        </Flex>
                    </Stack>
                </FormControl>
                <HStack maxW={"300px"} ml={"auto"} gap={3} mt={6}>
                    <Button onClick={onClose} variant={"outline"}>Cancel</Button>
                    <Button className='bg-primary-600 text-white w-[65%]'>Create Role</Button>
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

export default CreateRole;