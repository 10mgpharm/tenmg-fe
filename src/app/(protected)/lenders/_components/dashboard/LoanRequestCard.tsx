import {
  Button,
  Card,
  CardBody,
  Image as ChakraImage,
  CloseButton,
  Divider,
  Tooltip,
  Stack,
  Text,
  Box,
  Flex,
  GridItem,
  Grid,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React from "react";
import NoRequest from "@public/assets/images/no_request.png";
import { LoanRequest } from "@/types";
import { formatAmountString } from "@/utils";

const LoanRequestCard = ({
  lenderData,
  openAcceptModal,
  handleIgnore,
  handleView,
}: {
  lenderData: any;
  openAcceptModal: (id: string) => void;
  handleIgnore: (id: string) => void;
  handleView: (id: string) => void;
}) => {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-md font-medium text-gray-700">Loan Requests</h2>
          <Button
            variant="link"
            size="sm"
            colorScheme="primary"
            onClick={() => router.push("/lenders/loan-application")}
          >
            See All
          </Button>
        </div>

        <Stack spacing={4}>
          {!lenderData?.loanRequest?.length ? (
            <EmptyRequestState />
          ) : (
            lenderData?.loanRequest.map((request) => (
              <LoanDetails
                key={request.id}
                data={request}
                handleAccept={openAcceptModal}
                handleIgnore={handleIgnore}
                handleView={handleView}
              />
            ))
          )}
        </Stack>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg">
        <Box p={4}>
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
            gap={4}
            color="white"
          >
            <GridItem
              colSpan={{ base: 1, md: 1 }}
              rowSpan={{ base: 1, md: 2 }}
              bg="teal.500"
              p={6}
              borderRadius="lg"
              boxShadow="md"
            >
              <Text fontSize="sm">Loans Approved This Month</Text>
              <Flex
                alignItems="center"
                justifyContent={{ base: "left", md: "center" }}
                h={{ base: "100%", md: "100%" }}
              >
                <Text
                  fontSize={{ base: "4xl", md: "8xl" }}
                  lineHeight="short"
                  pb={6}
                >
                  {lenderData?.loanApprovalThisMonth ?? 0}
                </Text>
              </Flex>
            </GridItem>

            <StatCard
              bg="blue.500"
              title="Pending Requests"
              value={lenderData?.pendingRequests ?? 0}
            />

            <StatCard
              bg="green.500"
              title="Interest Earned"
              value={`₦${formatAmountString(lenderData?.interestEarned ?? 0)}`}
            />
          </Grid>
        </Box>
      </div>
    </div>
  );
};

const EmptyRequestState = () => (
  <div className="flex flex-col items-center justify-center">
    <ChakraImage src={NoRequest.src} alt="No Request" />
    <Text fontSize="md" color="gray.500">
      No loan request available
    </Text>
  </div>
);

interface LoanDetailsProps {
  data: LoanRequest;
  handleAccept: (id: string) => void;
  handleView: (id: string) => void;
  handleIgnore: (id: string) => void;
}

const LoanDetails: React.FC<LoanDetailsProps> = ({
  data,
  handleAccept,
  handleView,
  handleIgnore,
}) => {
  return (
    <Card boxShadow="none">
      <CardBody p={0}>
        <Stack
          divider={<Divider />}
          border="1px solid"
          borderColor="gray.200"
          borderRadius="lg"
          fontSize="sm"
        >
          <Box py={1} fontWeight={500} color="gray.600">
            <Box display="flex" justifyContent="flex-end" p={0}>
              <Tooltip label="Ignore" hasArrow>
                <CloseButton
                  color="red.600"
                  size="sm"
                  onClick={() => handleIgnore(data?.identifier)}
                />
              </Tooltip>
            </Box>

            <Box px={4}>
              <Flex gap={1} alignItems="center" mb={2}>
                <Text>Loan Amount:</Text>
                <Text fontWeight={700} color="gray.900">
                  ₦{formatAmountString(data?.requestedAmount)}
                </Text>
              </Flex>

              <Flex justifyContent="space-between" alignItems="center">
                <Text color="gray.900">{data?.customer.name}</Text>
                <Flex gap={1} alignItems="center">
                  <Text color="gray.500">Credit Score:</Text>
                  <Text>{data?.customer.score}%</Text>
                </Flex>
              </Flex>
            </Box>
          </Box>
          <Flex justifyContent="flex-end" pb={2}>
            <Button
              variant="ghost"
              size="sm"
              colorScheme="green"
              onClick={() => handleAccept(data?.identifier)}
            >
              Accept
            </Button>
            <Button
              variant="ghost"
              size="sm"
              colorScheme="gray"
              onClick={() => handleView(data?.identifier)}
            >
              View
            </Button>
          </Flex>
        </Stack>
      </CardBody>
    </Card>
  );
};

interface StatCardProps {
  bg: string;
  title: string;
  value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ bg, title, value }) => (
  <GridItem bg={bg} p={6} borderRadius="lg" boxShadow="md">
    <Text fontSize="sm" mb={2}>
      {title}
    </Text>
    <Text fontSize="3xl">{value}</Text>
  </GridItem>
);

export default LoanRequestCard;
