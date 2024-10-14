"use client"
import { 
    Checkbox,
    Flex,
    HStack,
    Menu,
    MenuButton, 
    MenuItem, 
    MenuList,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Table,
    TableContainer,
    Tabs,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useDisclosure, 
} from '@chakra-ui/react'
import { CiSearch } from 'react-icons/ci'
import { FaChevronDown } from 'react-icons/fa6'
import { MdFilterList } from 'react-icons/md'
import AddNewDrawer from './components/AddNewDrawer'
import { UserData } from '@/data/mockdata'
import SupplierTab from './components/SupplierTab'

const Users = () => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const {isOpen: isOpenPharm, onClose: onClosePharm, onOpen: onOpenPharm } = useDisclosure();
    const {isOpen: isOpenVendor, onClose: onCloseVendor, onOpen: onOpenVendor } = useDisclosure();

    const suppiers = UserData.slice(0, 10);
    const pharmacies = UserData.slice(0, 5);
    const vendors = UserData.slice(0, 4);
    
    return (
    <div className='p-8'>
        <div className="flex justify-between">
            <h3 className="font-semibold text-2xl">Users</h3>
            <div className="mb-4 flex items-center gap-3">
                <div className="border border-gray-300 rounded-md flex items-center gap-3 px-3 py-2 w-[350px]">
                    <CiSearch className="w-5 h-5 text-gray-700" />
                    <input 
                    type="text" 
                    placeholder="Search for a user" 
                    className="outline-none flex-1 placeholder:text-gray-400 bg-transparent" 
                    />
                    <Menu>
                        <MenuButton>
                        <MdFilterList className="w-5 h-5 text-primary-600" />
                        </MenuButton>
                        <MenuList>
                            <MenuItem>
                                <Checkbox>Suspended</Checkbox>
                            </MenuItem>
                            <MenuItem>
                                <Checkbox>Active</Checkbox>
                            </MenuItem>
                            <MenuItem>
                                <Checkbox>Pending</Checkbox>
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </div>  
                <Menu>
                    <MenuButton className="bg-primary-500 font-medium text-white p-2 px-5 rounded-md">
                        <div className="flex items-center gap-2">
                        Add New
                        <FaChevronDown className="w-4 h-4 text-white"/>
                        </div>
                    </MenuButton>
                    <MenuList>
                        <MenuItem onClick={onOpen}>Supplier</MenuItem>
                        <MenuItem onClick={onOpenPharm}>Pharmacy</MenuItem>
                        <MenuItem onClick={onOpenVendor}>Vendor</MenuItem>
                    </MenuList>
                </Menu>
            </div>
        </div>
        <Tabs variant={"unstyled"}>
            <TabList>
                <Tab _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                    <div className='flex items-center gap-3'>
                        <Text>Suppliers</Text>
                        <p className='bg-purple-50 text-purple-500 py-0.5 px-1.5 rounded-full text-sm'>{suppiers?.length}</p>
                    </div>
                </Tab>
                <Tab _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                    <div className='flex items-center gap-3'>
                        <Text>Pharmacies</Text>
                        <p className='bg-green-50 text-green-500 py-0.5 px-1.5 rounded-full text-sm'>{pharmacies?.length}</p>
                    </div>
                </Tab>
                <Tab _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                    <div className='flex items-center gap-3'>
                        <Text>Vendors</Text>
                        <p className='bg-orange-50 text-orange-500 py-0.5 px-1.5 rounded-full text-sm'>{vendors?.length}</p>
                    </div>
                </Tab>
            </TabList>
            <TabPanels>
                <TabPanel px={0}>
                    <SupplierTab data={suppiers} type="suppliers" />
                </TabPanel>
                <TabPanel>
                    <SupplierTab data={pharmacies} type="pharmacies" />
                </TabPanel>
                <TabPanel>
                    <SupplierTab data={vendors} type="vendors" />
                </TabPanel>
            </TabPanels>
        </Tabs>
        <AddNewDrawer isOpen={isOpen} onClose={onClose} type='supplier'/>
        <AddNewDrawer isOpen={isOpenPharm} onClose={onClosePharm} type='pharmacy'/>
        <AddNewDrawer isOpen={isOpenVendor} onClose={onCloseVendor} type='vendor'/>
    </div>
  )
}

export default Users