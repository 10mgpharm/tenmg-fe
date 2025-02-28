import React from "react";
import LoanHeader from "./LoanHeader";
import LoanFooter from "./LoanFooter";
import { Badge, Flex, Text } from "@chakra-ui/react";

interface LoanLayoutProps {
    children: React.ReactNode;
    name: string;
    logo: string;
    title?: string;
    navigateBackAction?: () => void;
}

const LoanLayout = ({ children, title, name, logo, navigateBackAction }: LoanLayoutProps) => {
    return (
        <>
        <Badge
        bgColor="error.50"
        px={8}
        py={4}
        rounded="2xl"
        textTransform="none"
        fontWeight="medium"
        my={2}
      >
        <Flex gap={2} alignItems="center" borderRadius="lg">
          <Text color="error.600" fontSize="md">Test Mode</Text>
        </Flex>
      </Badge>
            <div className="w-full sm:max-w-[500px] bg-gray-25 rounded-xl">
                <LoanHeader title={title} name={name} logo={logo} navigateBackAction={navigateBackAction} />
                <div className="w-full p-8">{children}</div>
            </div>
            <LoanFooter />
        </>
    );
};

export default LoanLayout;
