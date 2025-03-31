"use client";
import {
  Divider,
  Flex,
  Stack,
  Text,
  extendTheme,
  SimpleGrid,
  useDisclosure,
} from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
// import ApproveLoan from "@/app/(protected)/admin/loan-management/_components/ApproveLoan";

const theme = extendTheme({
  components: {
    Progress: {
      baseStyle: {
        track: {
          borderRadius: "10px",
        },
        filledTrack: {
          bg: "#F89422",
          track: {
            borderRadius: "0px",
            borderTopRightRadius: "0px",
            borderBottomRightRadius: "0px",
          },
        },
      },
    },
  },
});

const Page = ({ params }: { params: { snug: string } }) => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState(null);

  // const memoizedData = useMemo(() => data, [data]);
  const fetchLoanApplicationById = useCallback(
    async (id: string) => {
      try {
        setIsLoading(true);
        const response = await requestClient({ token: token }).get(
          `/vendor/loan-applications/customer/${id}`
        );
        setData(response.data.data);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    if (!token) return;
    fetchLoanApplicationById(params.snug);
  }, [fetchLoanApplicationById, params.snug, token]);

  return (
    <div className="p-8">
      <Flex cursor={"pointer"} gap={2} onClick={() => router.back()}>
        <ArrowLeft className="w-5 h-auto text-gray-600" />
        <Text>Back</Text>
      </Flex>
      <Flex justify={"space-between"}>
        <Stack mt={4} gap={0.5}>
          <Text fontSize={"1.2rem"} fontWeight={600}>
            {data?.customer?.name}&apos;s Loan Information
          </Text>
          <Text fontSize={"15px"} color={"gray.600"}>
            At a glance summary of customer Loan.
          </Text>
        </Stack>
        {/* <Flex gap={2}>
                <Button onClick={onOpen} h={"38px"} bg={"green.600"} className="text-white text-sm">Approve</Button>
                <Button h={"38px"} bg={"red.500"} className=" text-white text-sm">Reject</Button>
            </Flex> */}
      </Flex>
      <Stack mt={4} className="p-5 rounded-md border bg-white">
        <SimpleGrid columns={5} gap={4} mb={3}>
          <Stack>
            <Text fontSize={"15px"} color={"gray.500"}>
              Loan Application
            </Text>
            <Text fontWeight={500} fontSize={"1.2rem"}>
              ₦123,849,900
            </Text>
          </Stack>
          <Stack>
            <Text fontSize={"15px"} color={"gray.500"}>
              Loan Interest
            </Text>
            <Text fontWeight={500} fontSize={"1.2rem"}>
              5%
            </Text>
          </Stack>
          <Stack>
            <Text fontSize={"15px"} color={"gray.500"}>
              Repayment Period
            </Text>
            <Text fontWeight={500} fontSize={"1.2rem"}>
              1 year
            </Text>
          </Stack>
        </SimpleGrid>
        <Divider />
        <Stack my={3} maxW={"60%"}>
          <Text fontSize={"15px"} color={"gray.500"}>
            Customers Affordability based on credit information
          </Text>
          <Text fontWeight={700} fontSize={"1rem"}>
            ₦10,849,000 - ₦20,849,000
          </Text>
        </Stack>
        <Divider />
      </Stack>
      {/* <ApproveLoan isOpen={isOpen} onClose={onClose}/> */}
    </div>
  );
};

export default Page;
