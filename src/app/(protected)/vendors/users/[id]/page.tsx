"use client";
import requestClient from "@/lib/requestClient";
import {
  NextAuthUserSession,
} from "@/types";
import {
  Flex,
  GridItem,
  SimpleGrid,
  Stack,
  Tag,
  Text,
  Table,
  Thead,
  Tr,
  Th,
  TableContainer,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";

const Page = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);

  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;

  const fetchUser = useCallback(async () => {
    if (!params.id || !token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await requestClient({ token }).get(
        `/vendor/settings/users/${params.id}`
      );
      if (response.status === 200) {
        setUserData(response.data.data);
      }
    } catch (error) {
      toast.error(handleServerErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [token, params.id]);

  useEffect(() => {
    if (!token) return;
    fetchUser();
  }, [fetchUser, token]);

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

          <Flex my={6} justifyContent="space-between">
            <Text fontWeight="medium">{userData?.name || "N/A"}</Text>

            {userData?.status === 1 ? (
              <Tag size={"sm"} colorScheme={"green"} maxW={"max-content"}>
                Active
              </Tag>
            ) : (
              <Tag size={"sm"} colorScheme={"red"} maxW={"max-content"}>
                Suspended
              </Tag>
            )}
          </Flex>
          <div className="border rounded-md mt-4">
            <div className="bg-gray-100 p-3 rounded-t-md">
              <p className="font-medium text-gray-700">Details</p>
            </div>

            <SimpleGrid
              columns={[4]}
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
                  <Text fontWeight={"medium"}>{userData?.name}</Text>
                </Stack>
              </GridItem>
              <GridItem flex={1}>
                <Stack gap={0.5}>
                  <Text fontSize={"14px"} color={"gray.600"}>
                    Email
                  </Text>
                  <Text fontWeight={"medium"}>{userData?.email}</Text>
                </Stack>
              </GridItem>
              <GridItem>
                <Stack gap={0.5}>
                  <Text fontSize={"14px"} color={"gray.600"}>
                    Role
                  </Text>
                  <Text fontWeight={"medium"}>{userData?.role || "N/A"}</Text>
                </Stack>
              </GridItem>
              <GridItem>
                <Stack gap={0.5}>
                  <Text fontSize={"14px"} color={"gray.600"}>
                    Status
                  </Text>
                  {userData?.status === 1 ? (
                    <Tag size={"sm"} colorScheme={"green"} maxW={"max-content"}>
                      Active
                    </Tag>
                  ) : (
                    <Tag size={"sm"} colorScheme={"red"} maxW={"max-content"}>
                      Suspended
                    </Tag>
                  )}
                </Stack>
              </GridItem>
            </SimpleGrid>
          </div>
          {recentActivities?.length > 0 ? (
            <div className="border shadow-sm rounded-md mt-5 px-4">
              <p className="font-medium text-gray-700 mt-3">
                Recent Activities
              </p>
              <div className="flex items-center justify-between my-3">
                <Input placeholder="Search..." width={"320px"} />
              </div>
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Event Type</Th>
                      <Th>Description</Th>
                      <Th>Timestamp</Th>
                    </Tr>
                  </Thead>
                </Table>
              </TableContainer>
            </div>
          ) : (
            <div className="my-[8rem]">
              <div className="max-w-md mx-auto space-y-5">
                <p className="text-[15px] text-center">
                  There are no recent activities for this user.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Page;
