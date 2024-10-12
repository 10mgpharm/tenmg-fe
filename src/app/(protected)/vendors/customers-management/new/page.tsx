"use client";
import { Button, Divider, Flex, SimpleGrid, Stack, Text, useDisclosure } from "@chakra-ui/react"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

const Page = () => {
    const router = useRouter();
    const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <div className="p-8">
        <Flex cursor={"pointer"} gap={2} onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-auto text-gray-600"/>
            <Text>Back</Text>
        </Flex>
        <Flex justify={"space-between"}>
            <Stack mt={4} gap={0.5}>
                <Text fontSize={"1.2rem"} fontWeight={600}>Jude&apos;s Loan Information</Text>
                <Text fontSize={"15px"} color={"gray.600"}>At a glance summary of Jude&apos;s Loan.</Text>
            </Stack>
            <Flex gap={2}>
                <Button h={"38px"} bg={"red.500"} className=" text-white text-sm">Reject</Button>
                <Button onClick={onOpen} h={"38px"} bg={"green.600"} className="text-white text-sm">Approve</Button>
            </Flex>
        </Flex>
        <Stack mt={4} className="p-5 rounded-md border bg-white">
            <SimpleGrid columns={5} gap={4} mb={3}>
                <Stack>
                    <Text fontSize={"15px"} color={"gray.500"}>Loan Application</Text>
                    <Text fontWeight={500} fontSize={"1.2rem"}>₦123,849,900</Text>
                </Stack>
                <Stack>
                    <Text fontSize={"15px"} color={"gray.500"}>Loan Interest</Text>
                    <Text fontWeight={500} fontSize={"1.2rem"}>5%</Text>
                </Stack>
                <Stack>
                    <Text fontSize={"15px"} color={"gray.500"}>Repayment Period</Text>
                    <Text fontWeight={500} fontSize={"1.2rem"}>1 year</Text>
                </Stack>
            </SimpleGrid>
            <Divider />
            <Stack my={3} maxW={"60%"}>
                <Text fontSize={"15px"} color={"gray.500"}>Customers Affordability based on credit information</Text>
                <Text fontWeight={700} fontSize={"1rem"}>₦10,849,000 - ₦20,849,000</Text>
            </Stack>
            <Divider />
        </Stack>
        {/* <ApproveLoan isOpen={isOpen} onClose={onClose}/> */}
    </div>
  )
}

export default Page