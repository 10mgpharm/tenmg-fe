import { Badge, Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { SearchIcon } from 'lucide-react';
import Image from 'next/image';
import React from 'react'
import TransactionHistoryDrawer from '../_components/TransactionHistoryDrawer';
import WalletDrawer from '../_components/WalletDrawer';
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
export default function TransactionWalletPage() {

  const card_info = [
    {
      title: "Total Active Loans",
      value: "N150,000,000",
      bgColor: "#53389E",
      bgImg: "/assets/images/disb_bg.png",
    },
    {
      title: "Total Loaned Amount",
      value: "N50,000,000",
      bgColor: "#DC6803",
      bgImg: "/assets/images/app_bg.png",
    },
    {
      title: "Total Outstanding Amount",
      value: "N2,500,000",
      bgColor: "#3E4784",
      bgImg: "/assets/images/pend_bg.png",
    },
    {
      title: "Loan With Issues",
      value: "1",
      bgColor: "#E31B54",
      bgImg: "/assets/images/tot_bg.png",
    },
  ];

  return (
    <div className='px-4'>

      <h4 className="text-xl font-bold my-4">Loan Portfolio</h4>

      <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
        {card_info.map((item, index) => (
          <div
            key={index}
            className="relative h-32 bg-cover bg-center bg-no-repeat rounded-lg p-4 flex items-center"
            style={{
              backgroundImage: `url(${item.bgImg})`,
            }}
          >
            <div className="absolute inset-0  bg-opacity-10 rounded-md" style={{ backgroundColor: item.bgColor, opacity: 0.7 }}></div>

            {/* Card Content */}
            <div className="relative z-10 text-white">
              <h4 className="text-sm font-medium">{item.title}</h4>
              <p className="text-base font-semibold">{item.value}</p>
            </div>
          </div>
        ))}
      </div>


      <div className='my-8'>
        <div className="flex items-center gap-3 justify-between  w-full lg:w-2/4 my-5">
          <div className="relative w-3/4">
            <SearchIcon className="absolute left-2 w-4 top-1/2 -translate-y-1/2" />
            <input className="w-full ps-8 pe-4 py-2 rounded-md" placeholder="Search for a user" />
          </div>
          <Menu>
            <MenuButton as={Button} variant={'unstyled'} size={'sm'} px="8px" className=" cursor-pointer  " >
              <p className="text-gray-500 border border-gray-300 rounded-md flex items-center" style={{ padding: '8px 20px' }}>Filters </p>
            </MenuButton>
            <MenuList>
              <MenuItem>By Date</MenuItem>
              <MenuItem>Credit Score</MenuItem>
              <MenuItem>Vendor Name</MenuItem>
            </MenuList>
          </Menu>
        </div>

        <TableContainer border="1px solid #F9FAFB" borderRadius="10px">
          <Table variant='simple'>
            {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
            <Thead bg="blue.50">
              <Tr>
                <Th textTransform="initial"
                  color="primary.500"
                  fontWeight="500">Loan ID</Th>
                <Th textTransform="initial"
                  color="primary.500"
                  fontWeight="500">{`Borrower's Name`}</Th>
                <Th textTransform="initial"
                  color="primary.500"
                  fontWeight="500">Disbursment Date</Th>
                <Th textTransform="initial"
                  color="primary.500"
                  fontWeight="500">Loan Amount</Th>
                <Th textTransform="initial"
                  color="primary.500"
                  fontWeight="500">Due Date</Th>
                <Th textTransform="initial"
                  color="primary.500"
                  fontWeight="500">Payment Status</Th>
                <Th textTransform="initial"
                  color="primary.500"
                  fontWeight="500">Outstanding Balance</Th>
                <Th textTransform="initial"
                  color="primary.500"
                  fontWeight="500">Action</Th>
              </Tr>
            </Thead>
            <Tbody bg={"white"}>
              {TH_table_data.map((item, index) => (
                <Tr key={index} className="border-b border-b-slate-400 text-xs">
                  <Td className="py-4">{item?.id}</Td>
                  <Td className="py-4">{item?.name}</Td>
                  <Td className="py-4">{item?.date}</Td>
                  <Td className="py-4">{item?.amount}</Td>
                  <Td className="py-4">{item?.end_date}</Td>
                  <Td>
                    {index % 2 === 0 ? (
                      <Badge colorScheme="green" fontSize="10px" px="2" py="1" borderRadius="md">
                        • <span style={{ textTransform: 'capitalize' }}>Completed</span>
                      </Badge>
                    ) : (
                      <Badge colorScheme="red" fontSize="10px" px="2" py="1" borderRadius="md">
                        • <span style={{ textTransform: 'capitalize' }}>Payment Overdue</span>
                      </Badge>
                    )}
                  </Td>
                  <Td className="py-4">{item?.outstanding_amount}</Td>
                  <Td className="py-4">
                    <WalletDrawer />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>

      </div>
    </div>
  )
}

export const TH_table_data = [
  {
    id: "10MG-LN001",
    name: "Olivia Rhye",
    date: "Aug 21, 2024",
    amount: "₦1,300,000",
    end_date: "Aug 21, 2024",
    outstanding_amount: "₦1,300,000",
    // type: "Deposit",
    status: "Completed",
  },
  {
    id: "10MG-LN001",
    name: "Olivia Rhye",
    date: "Aug 21, 2024",
    amount: "₦1,300,000",
    end_date: "Aug 21, 2024",
    outstanding_amount: "₦1,300,000",
    // type: "Deposit",
    status: "Completed",
  },
  {
    id: "10MG-LN001",
    name: "Olivia Rhye",
    date: "Aug 21, 2024",
    amount: "₦1,300,000",
    end_date: "Aug 21, 2024",
    outstanding_amount: "₦1,300,000",
    // type: "Deposit",
    status: "Completed",
  },
  {
    id: "10MG-LN001",
    name: "Olivia Rhye",
    date: "Aug 21, 2024",
    amount: "₦1,300,000",
    end_date: "Aug 21, 2024",
    outstanding_amount: "₦1,300,000",
    // type: "Deposit",
    status: "Completed",
  },

]
