"use client";

import React, { useState } from "react";
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Flex,
  Heading,
  HStack,
  Icon,
  Link,
  NumberInput,
  Stack,
  Image as ChakraImage,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import { MdCheckCircle } from "react-icons/md";
import LoanProfile from "../../components/LoanProfile";
import { TbCurrencyNaira } from "react-icons/tb";
import { CiBank } from "react-icons/ci";
import { FiEyeOff } from "react-icons/fi";
import { IoLockClosedOutline } from "react-icons/io5";
import LoanInnerWrapper from "../../components/LoanInnerWrapper";
import { IoIosArrowForward } from "react-icons/io";

const options = [
  {
    description: "The Loan amount is too small",
  },
  {
    description: "I would need more time to pay back",
  },
  {
    description: "The Loan fees are high",
  },
  {
    description: "Others",
  },
];

interface ILoanOffer {
  name: string;
  logo: string;
  period: number;
  loanAmount: string;
  interestRate: string;
  interestPerMonth: string;
  capital: string;
  repayment: string;
}

const data: ILoanOffer = {
  name: "",
  logo: "/assets/images/tuyii_icon.png",
  loanAmount: "1,250,000.00",
  period: 3,
  interestRate: "25",
  interestPerMonth: "15,000.00",
  capital: "50,000.00",
  repayment: "15,000.00",
};

export default function ExternalCreditOffer() {
  const [status, setStatus] = useState<
    | "idle"
    | "accept"
    | "confirm"
    | "reject"
    | "accepted"
    | "declined"
    | "confirmBank"
    | ""
  >("idle");

  return (
    <div>
      {status === "idle" && (
        <VStack spacing={10}>
          <Flex justifyContent="center">
            <Badge
              colorScheme="green"
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={1}
            >
              <MdCheckCircle />
              Loan Approved
            </Badge>
          </Flex>

          <LoanProfile />

          <Flex alignItems="flex-end" justifyContent="center">
            <TbCurrencyNaira size="24px" />

            <Text fontSize={64} lineHeight={6}>
              50,000
            </Text>
          </Flex>

          <Box
            bgColor="warning.100"
            border="1px solid var(--tenmg-colors-warning-400)"
            p={4}
            borderRadius="md"
            my={6}
            w="full"
          >
            <VStack direction="column" spacing={4} alignItems="flex-start">
              <Text fontSize="md" fontWeight="bold">
                Loan Period: {data.period} months
              </Text>
              <Text fontSize="md" fontWeight="bold">
                Interest Rate: {data.interestRate}%
              </Text>
              <Text fontSize="md" fontWeight="bold">
                Capital: ₦{data.capital}
              </Text>

              <Text fontSize="md" fontWeight="bold">
                Interest Per Month: ₦{data.interestPerMonth}
              </Text>
              <Text fontSize="md" fontWeight="bold">
                Total Monthly Repayment: ₦{data.repayment}
              </Text>
            </VStack>
          </Box>

          <HStack justifyContent="space-between" w="full">
            <Button size="lg" w="full" type="submit">
              Accept Offer
            </Button>
            <Button
              size="lg"
              w="full"
              type="submit"
              bg="transparent"
              border="1px solid"
              borderColor="primary.500"
              color="primary.500"
            >
              Decline Offer
            </Button>
          </HStack>
        </VStack>
      )}

      {status === "accept" && (
        <div>
          <VStack spacing={10}>
            <div className="flex justify-center">
              <Box bg="primary.500" p={4} borderRadius="md" w="" m="auto">
                <CiBank color="white" size={56} />
              </Box>
            </div>

            <Heading as="h3" size="lg" fontWeight="normal">
              Link your account with 10MG
            </Heading>

            <Card mb={10}>
              <CardBody p={0}>
                <Stack divider={<StackDivider />}>
                  <Flex
                    p={5}
                    gap={5}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <FiEyeOff size={20} />
                    <Text fontWeight="normal" flex={1}>
                      <Text as="b">Private.</Text> Your credentials are safe and
                      will never be made accessible to 10MG
                    </Text>
                  </Flex>
                  <Flex
                    p={5}
                    gap={5}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <IoLockClosedOutline size={20} />
                    <Text fontWeight="normal" flex={1}>
                      <Text as="b">Secure.</Text> Your data is encrypted using
                      AES-256 encryption.
                    </Text>
                  </Flex>
                  <Center p={5}>
                    <Text fontWeight="normal">
                      10MG is authorised and regulated by{" "}
                      <Link href="/" color="primary.500">
                        NDPB
                      </Link>
                    </Text>
                  </Center>
                </Stack>
              </CardBody>
            </Card>
          </VStack>

          <Button
            size="lg"
            w="full"
            type="submit"
            mb={4}
            onClick={() => setStatus("accept")}
          >
            Continue
          </Button>
          <Box textAlign="center">
            <Text fontSize="sm" fontWeight="medium" color="gray.500">
              By clicking on continue you agree with{" "}
              <Link href="/" color="primary.500">
                10MG User End Policy
              </Link>
            </Text>
          </Box>
        </div>
      )}

      {status === "" && (
        <Box w="full">
          <Box my={20}>
            <LoanInnerWrapper
              headerIcon={
                <ChakraImage src="/assets/images/gtBankLogo.svg" alt="" />
              }
              heading="AHMED OLANREWAJU"
            />
            <Center>
              <Heading
                as="h3"
                fontSize="xl"
                fontWeight="medium"
                textAlign="center"
                color="gray.900"
                mb={2}
              >
                021***0067
              </Heading>
            </Center>
          </Box>
          <Flex justifyContent="space-between" gap={4} w="full">
            <Button w="full" bg="primary.50" color="primary.500">
              Edit
            </Button>
            <Button w="full">Confirm Offer</Button>
          </Flex>
        </Box>
      )}

      {/* Decline Offer */}
      {status === "reject" && (
        <div>
          <VStack spacing={10} my={20}>
            <LoanInnerWrapper
              headerIcon={
                <ChakraImage src="/assets/images/declineIcon.svg" alt="" />
              }
              heading="Are You Sure You Want to Decline?"
              text="We noticed that you're about to decline this offer. Before you
              make your final decision, Would you like to reconsider, or do you
              still wish to decline?"
            />

            <Flex justifyContent="space-between" gap={4} w="full">
              <Button
                w="full"
                bg="transparent"
                border="1px solid var(--tenmg-colors-warning-400)"
                borderColor="gray.300"
                color="gray.700"
              >
                Cancel
              </Button>
              <Button w="full" size="lg" bg="red.500">
                Decline
              </Button>
            </Flex>
          </VStack>
        </div>
      )}

      {/* Accepted Offer */}
      {status === "accepted" && (
        <div>
          <LoanInnerWrapper
            headerIcon={<Text fontSize="8xl">🎉</Text>}
            heading="Offer Accepted!"
            text="Congratulations! Your loan application has been successfully
            approved."
          />

          <Box
            bgColor="warning.100"
            border="1px solid var(--tenmg-colors-warning-400)"
            p={4}
            borderRadius="md"
            my={8}
          >
            <VStack direction="column" spacing={4} alignItems="flex-start">
              <Text fontSize="md" fontWeight="bold">
                Loan Amount: ₦{data.loanAmount}
              </Text>
              <Text fontSize="md" fontWeight="bold">
                Interest Rate: {data.interestRate}%
              </Text>
              <Text fontSize="md" fontWeight="bold">
                Repayment Period: {data.repayment} months
              </Text>
            </VStack>
          </Box>

          <Button w="full" size="lg">
            Exit Application
          </Button>
        </div>
      )}

      {/* Feedback */}
      {status === "declined" && (
        <div>
          <LoanInnerWrapper
            headerIcon={
              <ChakraImage
                src="/assets/images/feedbackIcon.svg"
                alt="feedback"
              />
            }
            heading="We would love your feedback"
            text="Please tell us why you declined our loan offer. This would help us improve our services"
          />

          <VStack spacing={4} w="full" mt={8}>
            {options.map((option, id) => (
              <Flex
                justifyContent="space-between"
                gap={4}
                w="full"
                key={id}
                py={2}
                cursor="pointer"
              >
                <Text>{option.description}</Text>
                <IoIosArrowForward size={20} />
              </Flex>
            ))}
          </VStack>
        </div>
      )}

      {/* Exit Application */}
      {status === "" && (
        <div className="my-24">
          <LoanInnerWrapper
            headerIcon={<ChakraImage src="" alt="Declined Emoji" />}
            heading="We're Sorry We Couldn't Meet Your Needs"
            text="We regret that we weren’t able to fulfil your request this time. Rest assured, will do our best to always find a solution that works for you"
          />

          <Button w="full" mt={14}>
            Exit Application
          </Button>
        </div>
      )}
    </div>
  );
}
