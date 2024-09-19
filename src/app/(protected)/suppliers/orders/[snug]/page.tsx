"use client";

import Image from 'next/image';
import { useState } from 'react';
import { Box, Flex, HStack, SimpleGrid, Stack, Text, useToast } from '@chakra-ui/react'
import { ArrowLeftIcon } from '@heroicons/react/20/solid'
import { FaRegCopy } from "react-icons/fa";
import {CopyToClipboard} from 'react-copy-to-clipboard';

import pills from '@public/assets/images/pillImage.png';
import { useRouter } from 'next/navigation';

const items = [
    {name: "Synthetic opioids", subtitle: "Pentazocine (NEML 23.1)", qty: "₦100,000 x 13", total: "₦1,300,000", image: pills},
    {name: "Synthetic opioids", subtitle: "Pentazocine (NEML 23.1)", qty: "₦100,000 x 13", total: "₦1,300,000", image: pills},
    {name: "Synthetic opioids", subtitle: "Pentazocine (NEML 23.1)", qty: "₦100,000 x 13", total: "₦1,300,000", image: pills},
    {name: "Synthetic opioids", subtitle: "Pentazocine (NEML 23.1)", qty: "₦100,000 x 13", total: "₦1,300,000", image: pills},
    {name: "Synthetic opioids", subtitle: "Pentazocine (NEML 23.1)", qty: "₦100,000 x 13", total: "₦1,300,000", image: pills},
]

const SingleOrder = () => {

    const toast = useToast();
    const router = useRouter();
    const [copied, setCopied] = useState(false);

  return (
    <Stack p={8}>
        <HStack cursor={"pointer"} onClick={() => router.back()}>
            <ArrowLeftIcon className='w-5- h-5'/>
            <Text>Back</Text>
        </HStack>
        <Stack gap={1}>
            <Text fontSize={"x-large"} fontWeight={"semibold"}>#3066</Text>
            <Text color={"gray.500"}>August 17,  2024 at 9:48 PM</Text>
        </Stack>
        <Flex gap={6}>
            <Stack flex={1}>
                <Stack bg={"white"} p={5} borderRadius={"10px"}>
                    <Box bg={"#FFFAEB"} color={"#F79009"} px={2} maxW={"fit-content"}>
                        <Text fontSize={"13px"}>Pending</Text>
                    </Box>
                    <Stack>
                        {
                            items?.map((item, index) => (
                                <Flex justify={"space-between"} align={"center"} key={index} flex={1} borderBottom={"1px solid #EAECF0"} py={3}>
                                    <Flex gap={3}>
                                        <Image src={item.image} alt={item.name}/>
                                        <Stack gap={1}>
                                            <Text fontWeight={"semibold"}>{item.name}</Text>
                                            <Text color={"gray.500"} fontSize={"small"}>{item.subtitle}</Text>
                                        </Stack>
                                    </Flex>
                                    <Text>{item.qty}</Text>
                                    <Text fontWeight={"semibold"}>{item.total}</Text>
                                </Flex>
                            ))
                        }
                    </Stack>
                </Stack>
                <Stack gap={6} bg={"white"} p={5} borderRadius={"10px"}>
                    <SimpleGrid columns={3}>
                        <Text>Subtotal</Text>
                        <Text justifySelf={"center"}>39 items</Text>
                        <Text justifySelf={"flex-end"} fontWeight={"semibold"}>₦1,300,000</Text>
                    </SimpleGrid>
                    <SimpleGrid columns={3}>
                        <Text>Discount</Text>
                        <Text justifySelf={"center"}>-</Text>
                        <Text justifySelf={"flex-end"}>NIL</Text>
                    </SimpleGrid>
                    <SimpleGrid columns={3}>
                        <Text>Shipping Fee</Text>
                        <Text justifySelf={"center"}>-</Text>
                        <Text justifySelf={"flex-end"}>NIL</Text>
                    </SimpleGrid>
                    <Flex justify={"space-between"} alignItems={"center"}>
                        <Text fontWeight={"semibold"} fontSize={"large"}>Shipping Fee</Text>
                        <Text fontWeight={"semibold"} fontSize={"large"}>₦1,300,000</Text>
                    </Flex>
                </Stack>
                <Stack gap={6} bg={"white"} p={5} borderRadius={"10px"}>
                    <Flex justify={"space-between"} alignItems={"center"}>
                        <Text fontWeight={"semibold"} fontSize={"large"}>Payment Status</Text>
                        <Box bg={"#ECFDF3"} px={2} color={"#027A48"} borderRadius={"20px"} maxW={"fit-content"}>
                            <Text fontSize={"13px"} borderRadius={"3xl"}>Paid</Text>
                        </Box>
                    </Flex> 
                    <Flex justify={"space-between"} alignItems={"center"}>
                        <Text fontWeight={"semibold"} fontSize={"large"}>Payment Method</Text>
                        <Text fontWeight={"semibold"} fontSize={"small"}>Debit Card</Text>
                    </Flex> 
                </Stack>
            </Stack>
            <Stack flex={1}>
                <Stack bg={"white"} p={5} borderRadius={"10px"}>
                    <Stack mb={8}>
                        <Text fontSize={"medium"} fontWeight={"semibold"}>Pharmacist&apos;s Information</Text>
                        <Text fontSize={"medium"}>Chudi Victor</Text>
                        <Flex justify={"space-between"} align={"center"}>
                            <Text fontSize={"medium"}>chudivictor9@gmail.com</Text>
                            <CopyToClipboard 
                            text={'chudivictor9@gmail.com'}
                            onCopy={() => {
                                setCopied(true)
                                toast({
                                    description: "Copied",
                                    status: 'success',
                                    duration: 3000,
                                    position: "top-right",
                                })
                            }}>
                                <div className="bg-primary-50 p-2 rounded-md cursor-pointer">
                                    <FaRegCopy className='w-4 h-4 text-primary-500' />
                                </div>
                            </CopyToClipboard>
                        </Flex>
                        <Flex justify={"space-between"} align={"center"}>
                            <Text fontSize={"medium"}>+234 8132581551</Text>
                            <CopyToClipboard 
                            text={'+234 8132581551'}
                            onCopy={() => {
                                setCopied(true)
                                toast({
                                    description: "Copied",
                                    status: 'success',
                                    duration: 3000,
                                    position: "top-right",
                                })
                            }}>
                                <div className="bg-primary-50 p-2 rounded-md cursor-pointer">
                                    <FaRegCopy className='w-4 h-4 text-primary-500' />
                                </div>
                            </CopyToClipboard>
                        </Flex>
                    </Stack>
                    <Stack mb={8}>
                        <Text fontSize={"medium"} fontWeight={"semibold"}>Shipping Address</Text>
                        <Text fontSize={"medium"}>Chudi Victor</Text>
                        <Text fontSize={"medium"}>1226 University Drive Menlo Park CA 94025 United States</Text>
                    </Stack>
                    <Stack>
                        <a href="#" className='text-primary-500 text-sm'>View on Map</a>
                    </Stack>
                </Stack> 
            </Stack>
        </Flex>
    </Stack>
  )
}

export default SingleOrder