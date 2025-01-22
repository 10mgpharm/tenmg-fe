"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import {
  Box,
  Flex,
  Text,
  Avatar,
  Heading,
  Button,
  Grid,
  GridItem,
  HStack,
  Divider,
  Link,
  Icon,
  useDisclosure,
} from "@chakra-ui/react";
import { ApexOptions } from "apexcharts";
import ChartComponent from "@/app/(protected)/vendors/_components/ChartComponent";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import Loader from "../../_components/Loader";
import { IoTrashOutline } from "react-icons/io5";

interface PageProps {
  params: { id: string };
}

interface UserProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  referenceId?: string;
  customerId?: string;
  mobileNumber?: string;
}

export default function Page({ params }: PageProps) {
  // Chart configurations
  const gaugeOptions: ApexOptions = {
    chart: { type: "radialBar", sparkline: { enabled: true } },
    plotOptions: {
      radialBar: {
        hollow: { size: "60%" },
        track: { background: "#f2f2f2" },
        dataLabels: {
          name: { show: false },
          value: { fontSize: "16px", color: "#333", offsetY: 6 },
        },
      },
    },
    labels: ["Credit Score"],
  };
  const gaugeSeries = [67];

  const pieOptions: ApexOptions = {
    chart: { type: "donut" },
    labels: ["Total Credits", "Total Debits", "Net Balance"],
    colors: ["#FFB020", "#4788FF", "#38B2AC"],
    legend: { position: "bottom" },
    dataLabels: { enabled: true },
  };
  const pieSeries = [25, 65, 15];

  const cardborderColor = "#DBDFEA";
  const labelColor = "#8094AE";
  const valueColor = "#364A63";

  const router = useRouter();
  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;

  const { onOpen, onClose, isOpen } = useDisclosure();

  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<UserProps>({
    id: "12345",
    firstName: "Ahmed",
    lastName: "Olanrewaju",
    email: "ahmed@bubblespharm.com",
    referenceId: "01713040400",
    customerId: "10MG-10239-0001",
    mobileNumber: "08133333333",
  });

  /*
  // Uncomment the following when the endpoint is available

  const fetchUser = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await requestClient({ token }).get(
        `/admin/users/${params.id}`
      );
      if (response.status === 200) {
        setUser(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [token, params.id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  */

  return (
    <Box p={6} minH="100vh">
      <HStack onClick={() => router.back()} cursor="pointer">
        <ArrowLeftIcon className="w-5 h-5" />
        <Text>Back</Text>
      </HStack>
      {loading ? (
        <Loader />
      ) : (
        <Grid
          templateColumns={{ base: "1fr", md: "300px 1fr" }}
          mt={5}
          bg="#ffffff"
          borderRadius="md"
          boxShadow="sm"
          border={`1px solid ${cardborderColor}`}
        >
          {/* LEFT COLUMN - User Details */}
          <GridItem
            borderRight={{ base: "none", md: `1px solid ${cardborderColor}` }}
          >
            <Flex alignItems="center" gap={4} p={6}>
              <Avatar
                size="md"
                name={`${user.firstName} ${user.lastName}`}
                src=""
              />
              <Box>
                <Heading as="h3" color={valueColor} mb={2} fontSize="sm">
                  {`${user.firstName} ${user.lastName}`}
                </Heading>
                <Text color={labelColor} fontSize="xs">
                  {user.email}
                </Text>
              </Box>
            </Flex>
            <Box
              p={6}
              w="full"
              borderTop={`1px solid ${cardborderColor}`}
              borderBottom={`1px solid ${cardborderColor}`}
            >
              <Text
                fontSize="xs"
                color={labelColor}
                letterSpacing="1.65px"
                mb={3}
              >
                TOTAL LOAN
              </Text>
              <Text fontWeight="medium" color="primary.500" fontSize="3xl">
                ₦1,161,060
              </Text>
            </Box>
          </GridItem>

          {/* RIGHT COLUMN - Personal Information */}
          <GridItem>
            <Box p={8}>
              <Flex justify="space-between" align="start" mb={6}>
                <Box>
                  <Heading as="h3" fontSize="2xl" mb={2} color="#364A63">
                    Personal Information
                  </Heading>
                  <Text fontSize="sm" color={labelColor}>
                    Basic info, name and address, that you use on 10MG.
                  </Text>
                </Box>

                <Box>
                  <Button
                    variant="solid"
                    colorScheme="red"
                    size="md"
                    width="100%"
                    borderRadius="xl"
                  >
                    Suspend Account
                  </Button>
                </Box>
              </Flex>

              <Grid
                templateColumns="repeat(2, 1fr)"
                columnGap={20}
                rowGap={6}
                fontSize="sm"
              >
                {/* FIRST NAME */}
                <GridItem>
                  <Flex justify="space-between">
                    <Text fontSize="xs" color={labelColor}>
                      First Name
                    </Text>
                    <Text
                      fontSize="sm"
                      color={valueColor}
                      fontWeight="medium"
                      textAlign="right"
                    >
                      {user.firstName}
                    </Text>
                  </Flex>
                </GridItem>

                {/* REFERENCE ID */}
                <GridItem>
                  <Flex justify="space-between">
                    <Text fontSize="xs" color={labelColor}>
                      Reference ID
                    </Text>
                    <Text
                      fontSize="sm"
                      color={valueColor}
                      fontWeight="medium"
                      textAlign="right"
                    >
                      {user.referenceId}
                    </Text>
                  </Flex>
                </GridItem>

                {/* LAST NAME */}
                <GridItem>
                  <Flex justify="space-between">
                    <Text color={labelColor}>Last Name</Text>
                    <Text
                      color={valueColor}
                      fontWeight="medium"
                      textAlign="right"
                    >
                      {user.lastName}
                    </Text>
                  </Flex>
                </GridItem>

                {/* CUSTOMER ID */}
                <GridItem>
                  <Flex justify="space-between">
                    <Text color={labelColor}>Customer ID</Text>
                    <Text
                      color={valueColor}
                      fontWeight="medium"
                      textAlign="right"
                    >
                      {user.customerId}
                    </Text>
                  </Flex>
                </GridItem>

                {/* EMAIL */}
                <GridItem>
                  <Flex justify="space-between">
                    <Text color={labelColor}>Email</Text>
                    <Text
                      color={valueColor}
                      fontWeight="medium"
                      textAlign="right"
                    >
                      {user.email}
                    </Text>
                  </Flex>
                </GridItem>

                {/* MOBILE NUMBER */}
                <GridItem>
                  <Flex justify="space-between">
                    <Text color={labelColor}>Mobile Number</Text>
                    <Text
                      color={valueColor}
                      fontWeight="medium"
                      textAlign="right"
                    >
                      {user.mobileNumber}
                    </Text>
                  </Flex>
                </GridItem>
              </Grid>
            </Box>

            {/* UPLOADED DOCUMENT */}
            <Box
              p={8}
              borderTop={`1px solid ${cardborderColor}`}
              borderBottom={`1px solid ${cardborderColor}`}
            >
              <Text fontWeight="semibold" mb={4} color="#526484">
                Uploaded Document
              </Text>
              <Flex
                align="center"
                p={4}
                border="1px"
                borderColor="gray.200"
                borderRadius="md"
                justify="space-between"
              >
                <Link color="blue.500" isExternal href="#">
                  {user.id}.pdf
                </Link>
                <Button
                  size="sm"
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => onOpen()}
                >
                  <Icon
                    as={IoTrashOutline}
                    w={6}
                    h={6}
                    color="red.500"
                    cursor={"pointer"}
                  />
                </Button>
              </Flex>
            </Box>

            {/* CUSTOMERS FINANCIAL ANALYSIS */}
            <Box p={8}>
              <Text fontWeight="semibold" mb={4} color="#526484">
                Customers Financial Analysis
              </Text>
              <Flex
                direction={{ base: "column", md: "row" }}
                align="center"
                justify="space-between"
              >
                <Box textAlign="center" mb={{ base: 4, md: 0 }}>
                  <Box w="150px" mx="auto">
                    <ChartComponent
                      type="radialBar"
                      series={gaugeSeries}
                      options={gaugeOptions}
                      width={150}
                      height={150}
                    />
                  </Box>
                  <Text fontSize="sm" color="gray.500" mt={2}>
                    Last Updated on 8th Jan 2024
                  </Text>
                  <Button size="sm" mt={3} colorScheme="blue">
                    Run Credit Score
                  </Button>
                </Box>

                <Box
                  p={4}
                  border={`1px solid ${cardborderColor}`}
                  borderRadius="md"
                  w="300px"
                >
                  <Text
                    fontWeight="semibold"
                    color="#364A63"
                    fontSize="md"
                    mb={2}
                  >
                    Transactions
                  </Text>
                  <ChartComponent
                    type="pie"
                    series={pieSeries}
                    options={pieOptions}
                    width={250}
                    height={250}
                  />
                </Box>
              </Flex>
            </Box>
          </GridItem>
        </Grid>
      )}
    </Box>
  );
}
