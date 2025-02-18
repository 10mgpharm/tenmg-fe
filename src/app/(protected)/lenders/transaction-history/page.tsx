import { Badge, Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { SearchIcon } from 'lucide-react';
import Image from 'next/image';
import React from 'react'
import TransactionHistoryDrawer from '../_components/TransactionHistoryDrawer';

export default function TransactionHistoryPage() {

  const card_info = [
    {
      title: "Total Balance",
      value: "N150,000,000",
      bgColor: "#53389E",
      bgImg: "/assets/images/disb_bg.png",
    },
    {
      title: "Available Balance",
      value: "N50,000,000",
      bgColor: "#DC6803",
      bgImg: "/assets/images/app_bg.png",
    },
    {
      title: "Estimated Interest",
      value: "N2,500,000",
      bgColor: "#3E4784",
      bgImg: "/assets/images/pend_bg.png",
    },
    {
      title: "Out on Loans",
      value: "N10,000,000",
      bgColor: "#E31B54",
      bgImg: "/assets/images/tot_bg.png",
    },
  ];

  return (
    <div className='px-4'>
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
            <div className="absolute inset-0  bg-opacity-10 rounded-md" style={{ backgroundColor: item.bgColor, opacity: 0.7 }}></div>

            {/* Card Content */}
            <div className="relative z-10 text-white">
              <h4 className="text-sm font-medium">{item.title}</h4>
              <p className="text-base font-semibold">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* <div className="w-full h-full flex items-center justify-center">
        <div className='flex flex-col items-center justify-center h-fit  py-16 gap-2 lg:py-32 w-64 text-center'>
          <Image
            alt="Empty Screen"
            src="/assets/images/empty_TH.png"
            width={100}
            height={100}
          />
          <h4 className='text-lg font-semibold'>Nothing to show here yet</h4>
          <p className='text-gray-500 text-sm'>You don’t have any transactions yet. When you do, they’ll appear here.</p>
        </div>
      </div> */}

      <div>
        <div className='flex items-center justify-between flex-col lg:flex-row mt-8'>

          <div className='grid grid-cols-3 text-center'>
            <div className='border border-slate-300 px-2 py-2 text-sm font-semibold rounded-l-md'>All</div>
            <div className='border border-slate-300 px-2 py-2 text-sm font-semibold rounded-none'>Incoming</div>
            <div className='border border-slate-300 px-2 py-2 text-sm font-semibold rounded-r-md'>Outgoing</div>
          </div>

          <div className="flex items-center gap-3 justify-between  w-full lg:w-2/4">
            <div className="relative w-3/4">
              <SearchIcon className="absolute left-2 w-4 top-1/2 -translate-y-1/2" />
              <input className="w-full ps-6 pe-4 py-2 rounded-md" placeholder="Search by application ID or customer name" />
            </div>
            <Menu>
              <MenuButton as={Button} variant={'outline'} size={'sm'} className="w-1/4 flex items-center justify-center py-2 px-3" >
                filters
              </MenuButton>
              <MenuList>
                <MenuItem>Date</MenuItem>
                <MenuItem>Credit Score</MenuItem>
                <MenuItem>Vendor Name</MenuItem>
              </MenuList>
            </Menu>
          </div>
        </div>

        <div className="rounded-t-lg overflow-hidden">
          <table className="w-full mt-5 text-center">
            <thead className="bg-[#E8F1F8] text-[#1A70B8]">
              <tr className="">
                <th className="px-4 py-3">Transaction ID</th>
                <th className="px-4 py-3">{`Date`}</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Amount Paid</th>
                <th className="px-4 py-3">Payment Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {TH_table_data.map((item, index) => (
                <tr key={index} className="border-b border-b-slate-400 text-xs">
                  <td className="py-4">
                    <p>{item?.id}</p>
                  </td>
                  <td className="py-4">
                    {item?.date}
                  </td>
                  <td className="py-4">
                    {item?.desc}
                  </td>
                  <td className="py-4">                {item?.type}              </td>
                  <td className="py-4">                {item?.amount}              </td>
                  <td>
                    {index % 2 === 0 ? (
                      <Badge colorScheme="green" fontSize="10px" px="2" py="1" borderRadius="md">
                        • Successful
                      </Badge>
                    ) : (
                      <Badge colorScheme="red" fontSize="10px" px="2" py="1" borderRadius="md">
                        • Failed
                      </Badge>
                    )}
                  </td>
                  <td className="py-4">
                    <TransactionHistoryDrawer />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
