'use client'
import { Badge, Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";
import React from "react";
import { CiMenuKebab } from "react-icons/ci";


export default function LoanApplicationPage() {

  const router = useRouter();

  const card_info = [
    {
      title: "Total Loan Application",
      value: "N50,000",
      bgColor: "#53389E",
      bgImg: "/assets/images/disb_bg.png",
    },
    {
      title: "Pending Loan Application",
      value: "N23,100",
      bgColor: "#DC6803",
      bgImg: "/assets/images/app_bg.png",
    },
    {
      title: "Approved Loan Application",
      value: "N12,423",
      bgColor: "#3E4784",
      bgImg: "/assets/images/pend_bg.png",
    },
    {
      title: "Disbursed Loan Application",
      value: "N40,321",
      bgColor: "#E31B54",
      bgImg: "/assets/images/tot_bg.png",
    },
  ];

  return (
    <div className="m-5">
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

      <div className="flex items-center gap-3 justify-between mt-8 w-full lg:w-2/4">
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

      <div className="rounded-t-lg overflow-hidden">
        <table className="w-full mt-5 text-center">
          <thead className="bg-[#E8F1F8] text-[#1A70B8]">
            <tr className="">
              <th className="px-4 py-3">Reference ID</th>
              <th className="px-4 py-3">{`Borrower's Name`}</th>
              <th className="px-4 py-3">Vendor</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Credit Score</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {table_data.map((item, index) => (
              <tr key={index} className="border-b border-b-slate-400 text-xs">
                <td className="py-2">
                  <p>{item?.id}</p>
                  <p>{item?.date}</p>
                </td>
                <td className="py-2">
                  {item?.borrower_name}
                </td>
                <td className="py-2">
                  {item?.vendor}
                </td>
                <td className="py-2">                {item?.amount}              </td>
                <td className="py-2">                {item?.creditScore}              </td>
                <td>
                  {index % 3 === 0 ? (
                    <Badge colorScheme="green" fontSize="10px" px="2" py="1" borderRadius="md">
                      Assigned
                    </Badge>
                  ) : index % 4 === 0 ? (
                    <Badge colorScheme="red" fontSize="10px" px="2" py="1" borderRadius="md">
                      Declined
                    </Badge>
                  ) : (
                    <Badge colorScheme="yellow" fontSize="10px" px="2" py="1" borderRadius="md">
                      Pending
                    </Badge>
                  )}
                </td>
                <td className="py-2">
                  <Menu>
                    <MenuButton as={Button} variant={'unstyled'} size={'sm'} className="w-1/4 flex items-center justify-center py-2 px-3" >
                      <CiMenuKebab />
                    </MenuButton>
                    <MenuList>
                      <MenuItem onClick={() => router.push('/lenders/loan-application/details')}>View Details</MenuItem>
                      <MenuItem>Accept Loan Offer</MenuItem>
                      <MenuItem>Decline Loan Offer</MenuItem>
                    </MenuList>
                  </Menu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

{/* <Badge colorScheme='green'>Success</Badge>
  <Badge colorScheme='red'>Removed</Badge>
  <Badge colorScheme='purple'>New</Badge> */}

export const table_data = [
  {
    id: "10MG-001 - 2024",
    date: "Aug 21, 2024",
    borrower_name: "Medlife Hospital",
    vendor: "HealPro Inc.",
    amount: "₦ 1, 250,000",
    creditScore: "720(Good)",
    status: "Pending",
  },
  {
    id: "10MG-001 - 2024",
    date: "Aug 21, 2024",
    borrower_name: "Medlife Hospital",
    vendor: "HealPro Inc.",
    amount: "₦ 1, 250,000",
    creditScore: "720(Good)",
    status: "Pending",
  },
  {
    id: "10MG-001 - 2024",
    date: "Aug 21, 2024",
    borrower_name: "Medlife Hospital",
    vendor: "HealPro Inc.",
    amount: "₦ 1, 250,000",
    creditScore: "720(Good)",
    status: "Pending",
  },
  {
    id: "10MG-001 - 2024",
    date: "Aug 21, 2024",
    borrower_name: "Medlife Hospital",
    vendor: "HealPro Inc.",
    amount: "₦ 1, 250,000",
    creditScore: "720(Good)",
    status: "Pending",
  },
  {
    id: "10MG-001 - 2024",
    date: "Aug 21, 2024",
    borrower_name: "Medlife Hospital",
    vendor: "HealPro Inc.",
    amount: "₦ 1, 250,000",
    creditScore: "720(Good)",
    status: "Pending",
  },
  {
    id: "10MG-001 - 2024",
    date: "Aug 21, 2024",
    borrower_name: "Medlife Hospital",
    vendor: "HealPro Inc.",
    amount: "₦ 1, 250,000",
    creditScore: "720(Good)",
    status: "Pending",
  },
]