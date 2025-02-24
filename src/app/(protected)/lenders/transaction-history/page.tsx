import { Badge, Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { SearchIcon } from 'lucide-react';
import Image from 'next/image';
import React from 'react'
import TransactionHistoryDrawer from '../_components/TransactionHistoryDrawer';
import SearchInput from '../../vendors/_components/SearchInput';
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react'
import Pagination from '../_components/Pagination';

export default function TransactionHistoryPage() {

  const card_info = [
    {
      title: "Total Deposits",
      value: "₦150,000,000",
      bgColor: "#53389E",
      bgImg: "/assets/images/disb_bg.png",
    },
    {
      title: "Total Withdrawals",
      value: "₦50,000,000",
      bgColor: "#DC6803",
      bgImg: "/assets/images/app_bg.png",
    },
    {
      title: "Net Wallet Balance",
      value: "₦2,500,000",
      bgColor: "#3E4784",
      bgImg: "/assets/images/pend_bg.png",
    },
    {
      title: "Last Transaction Date",
      value: "2024-12-7",
      bgColor: "#E31B54",
      bgImg: "/assets/images/tot_bg.png",
    },
  ];

  return (
    <div className='px-4'>

      <h3 className="font-semibold text-xl my-4">Transaction History</h3>
      <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
        {card_info.map((item, index) => (
          <div
            key={index}
            className="relative h-32 bg-cover bg-center bg-no-repeat rounded-lg p-4 flex items-center"
            style={{
              // backgroundColor: item.bgColor, // Apply solid color  
              backgroundImage: `url(${item.bgImg})`, // Apply background image
              // backgroundBlendMode: "overlay", // Ensures color and image blend well
            }}
          >
            {/* Dark Overlay to Fade Background */}
            <div className="absolute inset-0  bg-opacity-10 rounded-md" style={{ backgroundColor: item.bgColor, }}></div>

            {/* Card Content */}
            <div className="relative z-10 text-white">
              <h4 className="text-sm font-medium">{item.title}</h4>
              <p className="text-base font-semibold">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className='flex items-center justify-between flex-col lg:flex-row mt-8'>

          <div className='grid grid-cols-3 text-center'>
            <div className='border border-slate-300 px-2 py-2 text-sm font-semibold rounded-l-md'>All</div>
            <div className='border border-slate-300 px-2 py-2 text-sm font-semibold rounded-none'>Incoming</div>
            <div className='border border-slate-300 px-2 py-2 text-sm font-semibold rounded-r-md'>Outgoing</div>
          </div>

          <div className="flex items-center gap-3 my-5">
            <SearchInput
              placeholder="Search for Transaction Id"
            // value={globalFilter}
            // onChange={(e) => setGlobalFilter(e.target.value)}
            />
            <Menu>
              <MenuButton as={Button} variant={'unstyled'} size={'md'} px="8px" className=" cursor-pointer  " >
                <p className="text-gray-500 border border-gray-300 rounded-md flex items-center" style={{ padding: '8px 20px' }}>Filters</p>
              </MenuButton>
              <MenuList>
                {/* <MenuItem>By Date</MenuItem>
                <MenuItem>Credit Score</MenuItem>
                <MenuItem>Vendor Name</MenuItem> */}
              </MenuList>
            </Menu>
          </div>
        </div>

        <TableContainer border="1px solid #F9FAFB" borderRadius="10px">
          <Table variant='simple'>
            {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
            <Thead bg="blue.50">
              <Tr>
                <Th textTransform="initial"
                  color="primary.500"
                  fontWeight="500">Transaction ID</Th>
                <Th textTransform="initial"
                  color="primary.500"
                  fontWeight="500">{`Date`}</Th>
                <Th textTransform="initial"
                  color="primary.500"
                  fontWeight="500">Description</Th>
                <Th textTransform="initial"
                  color="primary.500"
                  fontWeight="500">Type</Th>
                <Th textTransform="initial"
                  color="primary.500"
                  fontWeight="500">Amount Paid</Th>
                <Th textTransform="initial"
                  color="primary.500"
                  fontWeight="500">Payment Status</Th>
                <Th textTransform="initial"
                  color="primary.500"
                  fontWeight="500">Action</Th>
              </Tr>
            </Thead>
            <Tbody bg={"white"}>
              {TH_table_data.map((item, index) => (
                <Tr key={index} className="border-b border-b-slate-400 text-xs">
                  <Td className="py-4">
                    <p>{item?.id}</p>
                  </Td>
                  <Td className="py-4">
                    {item?.date}
                  </Td>
                  <Td className="py-4">
                    {item?.desc}
                  </Td>
                  <Td className="py-4">{item?.type}</Td>
                  <Td className="py-4">{item?.amount}</Td>
                  <Td>
                    {index % 2 === 0 ? (
                      <Badge colorScheme="green" fontSize="10px" px="2" py="1" borderRadius="xl" className="">
                        • <span style={{ textTransform: 'capitalize' }}> successful</span>
                      </Badge>
                    ) : (
                      <Badge colorScheme="red" fontSize="10px" px="2" py="1" borderRadius="xl">
                        • <span style={{ textTransform: 'capitalize' }}>failed</span>
                      </Badge>
                    )}
                  </Td>
                  <Td className="py-4">
                    <TransactionHistoryDrawer />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Pagination />
        </TableContainer>
      </div>
    </div>
  )
}

export const TH_table_data = [
  {
    id: "MG-TXN-001",
    date: "Aug 21, 2024",
    desc: " Wallet Deposit",
    type: "Deposit",
    amount: "₦1,300,000",
    status: "Failed",
  },
  {
    id: "MG-TXN-001",
    date: "Aug 21, 2024",
    desc: " Wallet Deposit",
    type: "Deposit",
    amount: "₦1,300,000",
    status: "Failed",
  },
  {
    id: "MG-TXN-001",
    date: "Aug 21, 2024",
    desc: " Wallet Deposit",
    type: "Deposit",
    amount: "₦1,300,000",
    status: "Failed",
  },
  {
    id: "MG-TXN-001",
    date: "Aug 21, 2024",
    desc: " Wallet Deposit",
    type: "Deposit",
    amount: "₦1,300,000",
    status: "Failed",
  },
]
