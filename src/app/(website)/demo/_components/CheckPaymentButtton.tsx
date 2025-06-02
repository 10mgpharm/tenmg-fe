import { Button, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

const CheckPaymentButton = ({ txnReference }: { txnReference: string }) => {
    const router = useRouter();
    const toast = useToast();

    const handleClick = useCallback(() => {
        toast({
            title: "Redirecting...",
            description: "Checking your payment status.",
            status: "info",
            duration: 2000,
            isClosable: true,
        });

        setTimeout(() => {
            router.push(`/demo/order?reference=${txnReference}`);
        }, 2000);
    }, [router, toast, txnReference]);

    return (
        <Button colorScheme="blue" onClick={handleClick}>
            Check Payment Status
        </Button>
    );
};

export default CheckPaymentButton;
