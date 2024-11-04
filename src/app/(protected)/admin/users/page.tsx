"use client"
import { 
    Checkbox,
    Menu,
    MenuButton, 
    MenuItem, 
    MenuList,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    useDisclosure, 
} from '@chakra-ui/react'
import { CiSearch } from 'react-icons/ci'
import { FaChevronDown } from 'react-icons/fa6'
import { MdFilterList } from 'react-icons/md'
import AddNewDrawer from './components/AddNewDrawer'
import SupplierTab from './components/SupplierTab'
import { useSession } from 'next-auth/react';
import { MemberDataProp, NextAuthUserSession } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import requestClient from '@/lib/requestClient';
import { usePaginate } from '@/lib/paginate';

const Users = () => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [type, setType]= useState<'supplier' | 'vendor' | 'pharmacy'>("supplier")
    const {isOpen: isOpenPharm, onClose: onClosePharm, onOpen: onOpenPharm } = useDisclosure();
    const {isOpen: isOpenVendor, onClose: onCloseVendor, onOpen: onOpenVendor } = useDisclosure();

    const session = useSession();
    const sessionToken = session?.data as NextAuthUserSession;
    const token = sessionToken?.user?.token;
    const [data, setData] = useState<MemberDataProp>();
    const [supplierData, setSupplierData] = useState<MemberDataProp>();
    const [vendorData, setVendorData] = useState<MemberDataProp>();
    const [pharmData, setPharmData] = useState<MemberDataProp>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [pageCount, setPageCount] = useState<number>(1);
    const [pageLimit, setPageLimit] = useState<number>(10);
    const [total, setTotal] = useState<any>('');

    const fetchTeamUser = useCallback(async (type: string, pageCount: number) => {
        try {
        setIsLoading(true);    
        const response = await requestClient({ token: token }).get(
            `/admin/users?page=${pageCount}&type=${type}&email=`
        );
        if (response.status === 200) {
            setIsLoading(false);
            if(type === "Supplier"){
                setSupplierData(response.data.data);
                setData(response.data.data);
                setTotal(response.data?.meta)
            }else if(type === "Vendor"){
                setVendorData(response.data.data)
                setTotal(response.data?.meta)
            }else if(type === "Pharmacies"){
                setPharmData(response.data.data)
                setTotal(response.data?.meta)
            }
        }
        } catch (error) {
            setIsLoading(false);
            console.error(error);
        }
    }, [token, pageCount]);

    useEffect(() => {
        if(!token) return;
        fetchTeamUser('Supplier', pageCount);
        fetchTeamUser('Pharmacies', pageCount);
        fetchTeamUser('Vendor', pageCount);
    }, [fetchTeamUser, token, pageCount]);

    const handleTabsChange = (index: number) => {
       if(index === 1){
            fetchTeamUser('Pharmacies', 1);
        }else if(index === 2){
            fetchTeamUser('Vendor', 1);
       }else{
            fetchTeamUser('Supplier', 1);
       }
    }
    // const { getPaginationInfo } = usePaginate({
    //     page: pageCount,
    //     total: total?.total,
    //     limit: pageLimit,
    // });
    
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
                        <MenuItem 
                        onClick={() => {
                            setType("supplier")
                            onOpen()
                        }}>
                            Supplier
                        </MenuItem>
                        <MenuItem 
                        onClick={() => {
                            setType("pharmacy")
                            onOpenPharm()
                        }}>
                            Pharmacy
                        </MenuItem>
                        <MenuItem 
                        onClick={() => {
                            setType("vendor")
                            onOpenVendor()
                        }}>
                            Vendor
                        </MenuItem>
                    </MenuList>
                </Menu>
            </div>
        </div>
        <Tabs onChange={handleTabsChange} variant={"unstyled"}>
            <TabList>
                <Tab _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                    <div className='flex items-center gap-3'>
                        <Text>Suppliers</Text>
                        <p className='bg-purple-50 text-purple-500 py-0.5 px-1.5 rounded-full text-sm'>
                            {supplierData?.meta.total || 0}
                        </p>
                    </div>
                </Tab>
                <Tab _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                    <div className='flex items-center gap-3'>
                        <Text>Pharmacies</Text>
                        <p className='bg-green-50 text-green-500 py-0.5 px-1.5 rounded-full text-sm'>
                            {pharmData?.meta.total || 0}
                        </p>
                    </div>
                </Tab>
                <Tab _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                    <div className='flex items-center gap-3'>
                        <Text>Vendors</Text>
                        <p className='bg-orange-50 text-orange-500 py-0.5 px-1.5 rounded-full text-sm'>
                            {vendorData?.meta.total || 0}
                        </p>
                    </div>
                </Tab>
            </TabList>
            <TabPanels>
                <TabPanel px={0}>
                    <SupplierTab 
                    isLoading={isLoading} 
                    data={data} 
                    type="Suppliers" 
                    setPageCount={setPageCount}
                    />
                </TabPanel>
                <TabPanel>
                    <SupplierTab 
                    isLoading={isLoading} 
                    data={data} 
                    type="Pharmacies" 
                    setPageCount={setPageCount}
                    />
                </TabPanel>
                <TabPanel>
                    <SupplierTab 
                    isLoading={isLoading}  
                    data={data} 
                    type="Vendors" 
                    setPageCount={setPageCount}
                    />
                </TabPanel>
            </TabPanels>
        </Tabs>
        <AddNewDrawer 
        isOpen={isOpen} 
        onClose={onClose} 
        type={type}
        fetchTeamUser={fetchTeamUser}
        />
        <AddNewDrawer 
        isOpen={isOpenPharm} 
        onClose={onClosePharm} 
        type={type}
        fetchTeamUser={fetchTeamUser}
        />
        <AddNewDrawer 
        isOpen={isOpenVendor} 
        onClose={onCloseVendor} 
        type={type}
        fetchTeamUser={fetchTeamUser}
        />
    </div>
  )
}

export default Users