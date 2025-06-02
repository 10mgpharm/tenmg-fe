"use client";

import {
    Box,
    Heading,
    Text,
    VStack,
    Badge,
    Button,
    Icon,
    Link,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from "@chakra-ui/react";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { ApplicationDto } from "@/types"; // Your type

interface Props {
    status: string;
    application: ApplicationDto;
    repaymentUrl?: string;
    message: string;
    orderStatus: string;
}

const OrderPaymentStatusPage = ({ message, orderStatus, status, application, repaymentUrl }: Props) => {
    const isSuccess = status === "APPROVED";

    let colorScheme = "green";
    let bgStatusState: "error" | "success" | "info" | "warning" | "loading" = "error";

    switch (orderStatus) {
        case "CANCELLED":
            colorScheme = "gray";
            bgStatusState = "info";
            break;
        case "PENDING PAYMENT":
            colorScheme = "yellow"
            bgStatusState = "loading";
            break;
        case "CLOSED":
            colorScheme = "red"
            bgStatusState = "error";
            break;
        case "PAID":
            colorScheme = "green"
            bgStatusState = "success";
            break;
        default:
            break;
    }

    return (
        <Box
            minH="100vh"
            display="flex"
            justifyContent="center"
            alignItems="center"
            bg="gray.50"
            px={4}
        >
            <Box
                bg="white"
                p={10}
                rounded="xl"
                shadow="lg"
                maxW="lg"
                w="full"
                textAlign="center"
            >
                <VStack spacing={6}>
                    {isSuccess ? (
                        <>
                            <Icon as={CheckCircleIcon} boxSize={16} color="green.400" />
                            <Heading size="lg">Payment Successful</Heading>
                            <Text fontSize="md" color="gray.600">
                                Your order has been paid using <strong>10mg Credit</strong>.
                            </Text>

                            <Badge colorScheme="green" fontSize="md" px={4} py={1} rounded="md">
                                Order Status: Paid
                            </Badge>

                            <Button
                                colorScheme="blue"
                                as={Link}
                                href={repaymentUrl}
                                target="_blank"
                            >
                                View Repayment Details
                            </Button>
                        </>
                    ) : (
                        <>
                            <Icon as={WarningIcon} boxSize={16} color="red.400" />
                            <Heading size="lg">Payment Confirmation</Heading>
                            <Text fontSize="md" color="gray.600">
                                {message}
                            </Text>

                            <Badge colorScheme={colorScheme} fontSize="md" px={4} py={1} rounded="md">
                                Order Status: {orderStatus}
                            </Badge>

                            <Alert status={bgStatusState} mt={4} borderRadius="md">
                                <AlertIcon />
                                <Box>
                                    <AlertTitle>Application Status: {status}</AlertTitle>
                                    <AlertDescription>
                                        You can try a different payment method or contact support.
                                    </AlertDescription>
                                </Box>
                            </Alert>
                        </>
                    )}
                </VStack>
            </Box>
        </Box>
    );
};

export default OrderPaymentStatusPage;
