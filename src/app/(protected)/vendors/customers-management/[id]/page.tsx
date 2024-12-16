"use client";
import requestClient from "@/lib/requestClient";
import {
  CustomerData,
  NextAuthUserSession,
  TransactionHistoryData,
} from "@/types";
import { convertDate } from "@/utils/formatDate";
import {
  Flex,
  GridItem,
  SimpleGrid,
  Stack,
  Tag,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Input,
  useDisclosure,
  Spinner,
} from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import UploadHistoryModal from "../_components/UploadHistoryModal";
import Link from "next/link";
import UploadModal from "../../_components/UploadModal";

const Page = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [customersData, setCustomersData] = useState<CustomerData | null>(null);
  const [tnxHistoryData, setTnxHistorysData] = useState<
    TransactionHistoryData[] | null
  >(null);
  const { isOpen, onClose, onOpen } = useDisclosure();

  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await requestClient({ token: token }).get(
        `/vendor/customers/${params.id}`
      );
      if (response.status === 200) {
        setCustomersData(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [token, params.id]);

  const fetchCustomerTnx = useCallback(async () => {
    setLoading(true);
    try {
      const response = await requestClient({ token: token }).get(
        `/vendor/txn_history/${params.id}`
      );
      if (response.status === 200) {
        setTnxHistorysData(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [token, params.id]);

  useEffect(() => {
    if (!token) return;
    fetchCustomers();
    fetchCustomerTnx();
  }, [fetchCustomers, token]);

  return (
    <div className="p-5">
      {loading ? (
        <Flex justify="center" align="center" height="200px">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <div className="border rounded-lg shadow-sm bg-white p-4">
          <Flex
            cursor={"pointer"}
            onClick={() => router.back()}
            align={"center"}
            gap={2}
          >
            <ArrowLeft className="w-5 h-auto text-gray-500" />
            <Text fontSize={"14px"} color={"gray.600"}>
              Back
            </Text>
          </Flex>
          <div className="mt-4">
            <h3 className="font-semibold text-xl">
              Customer Reference ID. {customersData?.identifier}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              This provides a detailed breakdown of the customer’s evaluation
              reference, credit score, purchase and credit patterns.
            </p>
          </div>
          <div className="border rounded-md mt-4">
            <div className="bg-gray-100 p-3 rounded-t-md">
              <p className="font-medium text-gray-700">Customer Information</p>
            </div>

            <SimpleGrid
              columns={[5]}
              px={4}
              py={3}
              minChildWidth="156px"
              overflowX="auto"
              spacing="20px"
            >
              <GridItem>
                <Stack gap={0.5}>
                  <Text fontSize={"14px"} color={"gray.600"}>
                    Name
                  </Text>
                  <Text fontWeight={"medium"}>{customersData?.name}</Text>
                </Stack>
              </GridItem>
              <GridItem flex={1}>
                <Stack gap={0.5}>
                  <Text fontSize={"14px"} color={"gray.600"}>
                    Email
                  </Text>
                  <Text fontWeight={"medium"}>{customersData?.email}</Text>
                </Stack>
              </GridItem>
              <GridItem>
                <Stack gap={0.5}>
                  <Text fontSize={"14px"} color={"gray.600"}>
                    External Reference ID
                  </Text>
                  <Text fontWeight={"medium"}>
                    {customersData?.reference || "N/A"}
                  </Text>
                </Stack>
              </GridItem>
              <GridItem>
                <Stack gap={0.5}>
                  <Text fontSize={"14px"} color={"gray.600"}>
                    Customer ID
                  </Text>
                  <Text fontWeight={"medium"}>{customersData?.id}</Text>
                </Stack>
              </GridItem>
              <GridItem>
                <Stack gap={0.5}>
                  <Text fontSize={"14px"} color={"gray.600"}>
                    Status
                  </Text>
                  {customersData?.active === 1 ? (
                    <Tag size={"sm"} colorScheme={"green"} maxW={"max-content"}>
                      Active
                    </Tag>
                  ) : (
                    <Tag size={"sm"} colorScheme={"red"} maxW={"max-content"}>
                      Disabled
                    </Tag>
                  )}
                </Stack>
              </GridItem>
            </SimpleGrid>
          </div>
          {tnxHistoryData?.length > 0 ? (
            <div className="border shadow-sm rounded-md mt-5 px-4">
              <p className="font-medium text-gray-700 mt-3">
                Transaction History Evaluations
              </p>
              <div className="flex items-center justify-between my-3">
                <Input placeholder="Search..." width={"320px"} />
                <button
                  onClick={onOpen}
                  className="py-2 px-3 rounded-md text-white bg-primary-600"
                >
                  Upload Document
                </button>
              </div>
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Evaluation Ref</Th>
                      <Th>Document Source</Th>
                      <Th>Document Format</Th>
                      <Th>Status</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {tnxHistoryData?.map((item: TransactionHistoryData) => {
                      const evaluation = JSON.parse(item?.evaluationResult);
                      return (
                        <Tr key={item.id}>
                          <Td>
                            <Stack gap={0.5}>
                              <Text fontSize={"12px"} fontWeight={600}>
                                {customersData?.identifier}
                              </Text>
                              <Text fontSize={"14px"}>
                                {convertDate(item?.createdAt)}
                              </Text>
                            </Stack>
                          </Td>
                          <Td fontSize={"14px"}>{item?.source}</Td>
                          <Td fontSize={"14px"}>{item?.fileFormat}</Td>
                          <Td fontSize={"14px"}>
                            {item?.status === "PENDING" ? (
                              <Tag size={"sm"} colorScheme={"orange"}>
                                {item?.status}
                              </Tag>
                            ) : (
                              <Tag size={"sm"} colorScheme={"green"}>
                                {item?.status}
                              </Tag>
                            )}
                          </Td>
                          <Td fontSize={"14px"}>
                            <Link
                              href={`/vendors/transactions-history/${params.id}?evaluationId=${item?.id}`}
                              className="text-primary-600 font-medium"
                            >
                              View Details
                            </Link>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
              <div className="text-center mb-5">
                <button className="border py-1 text-sm px-4 rounded-md mt-5 text-center border-primary-600 text-primary-600">
                  View More
                </button>
              </div>
            </div>
          ) : (
            <div className="my-[8rem]">
              <div className="max-w-md mx-auto space-y-5">
                <div className="w-full text-center mx-auto">
                  <button
                    onClick={onOpen}
                    className="py-2 px-3 rounded-md text-white bg-primary-600 max-w-max"
                  >
                    Upload Transaction History
                  </button>
                </div>
                <p className="text-[15px] text-center">
                  There is no current transaction history evaluated for this
                  customer. Kindly click the button to Evaluate transaction
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <UploadModal
        uploadEndpoint="/vendor/txn_history/upload_and_evaluate"
        isOpen={isOpen}
        onClose={onClose}
        reloadData={fetchCustomerTnx}
        id={params.id}
      />
    </div>
  );
};

export default Page;
