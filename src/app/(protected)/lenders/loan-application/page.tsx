'use client'
import { Badge, Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";
import React from "react";
import { CiFilter, CiMenuKebab } from "react-icons/ci";
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
import { flexRender, useReactTable } from "@tanstack/react-table";
import SearchInput from "../../vendors/_components/SearchInput";

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

      <h3 className="font-semibold text-xl my-4">Loan Application</h3>

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

      <div className="flex items-center gap-3 my-5">
        <SearchInput
          placeholder="Search for a Customer"
        // value={globalFilter}
        // onChange={(e) => setGlobalFilter(e.target.value)}
        />

        <Menu>
          <MenuButton as={Button} variant={'unstyled'} size={'sm'} px="8px" className=" cursor-pointer  " >
            <p className="text-gray-500 border border-gray-300 rounded-md flex items-center" style={{ padding: '8px 20px' }}>            Filters            </p>
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
                fontWeight="500">Reference ID</Th>
              <Th textTransform="initial"
                color="primary.500"
                fontWeight="500">{`Borrower's Name`}</Th>
              <Th textTransform="initial"
                color="primary.500"
                fontWeight="500">Vendor</Th>
              <Th textTransform="initial"
                color="primary.500"
                fontWeight="500">Amount</Th>
              <Th textTransform="initial"
                color="primary.500"
                fontWeight="500">Credit Score</Th>
              <Th textTransform="initial"
                color="primary.500"
                fontWeight="500">Status</Th>
              <Th textTransform="initial"
                color="primary.500"
                fontWeight="500">Action</Th>
            </Tr>
          </Thead>
          <Tbody bg={"white"}>
            {table_data.map((item, index) => (
              <Tr key={index} className="border-b border-b-slate-400 text-xs">
                <Td className="py-2">
                  <p>{item?.id}</p>
                  <p>{item?.date}</p>
                </Td>
                <Td className="py-2">
                  {item?.borrower_name}
                </Td>
                <Td className="py-2">
                  {item?.vendor}
                </Td>
                <Td className="py-2">{item?.amount}</Td>
                <Td className="py-2">{item?.creditScore}</Td>
                <Td>
                  {index % 3 === 0 ? (
                    <Badge colorScheme="green" fontSize="10px" px="2" py="1" borderRadius="xl" variant={'subtle'}>
                      • <span style={{ textTransform: 'capitalize' }}>  Assigned</span>
                    </Badge>
                  ) : index % 4 === 0 ? (
                    <Badge colorScheme="red" fontSize="10px" px="2" py="1" borderRadius="xl" variant={'subtle'}>
                      • <span style={{ textTransform: 'capitalize' }}>Declined</span>
                    </Badge>
                  ) : (
                    <Badge colorScheme={"orange"} fontSize="10px" px="2" py="1" borderRadius="xl" variant={'subtle'}>
                      • <span style={{ textTransform: 'capitalize' }}>Pending</span>
                    </Badge>
                  )}
                </Td>
                <Td className="py-2">
                  <Menu>
                    <MenuButton as={Button} variant={'unstyled'} size={'sm'}  >
                      <CiMenuKebab />
                    </MenuButton>
                    <MenuList>
                      <MenuItem onClick={() => router.push('/lenders/loan-application/details')}>View Details</MenuItem>
                      <MenuItem>Accept Loan Offer</MenuItem>
                      <MenuItem>Decline Loan Offer</MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
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