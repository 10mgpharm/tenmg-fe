import {
  VStack,
  Heading,
  Text,
  Icon,
  Circle,
  Box,
  Button,
} from "@chakra-ui/react";
import LoanLayout from "../../_components/LoanLayout";
import LoanProfile from "../../_components/LoanProfile";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { ApplicationDto, BusinessDto, CustomerDto } from "@/types";

interface Props {
  token: string;
  business: BusinessDto;
  customer: CustomerDto;
  application: ApplicationDto;
  navigateBackAction?: () => void;
}

const FailureScreen = ({
  token,
  business,
  application,
  customer,
  navigateBackAction,
}: Props) => {
  return (
    <LoanLayout
      name={business?.name}
      logo={business?.logo}
      navigateBackAction={navigateBackAction}
    >
      <>
        <section className="flex justify-between items-center w-full pb-8">
          <LoanProfile name={customer?.name} email={customer?.email} />
          <IoMdInformationCircleOutline className="w-6 h-6" />
        </section>

        <VStack spacing={10} textAlign="center" paddingY="50px">
          <Circle size="90px" bg="error.100" color="green.500">
            <Circle size="60px" bg="error.200">
              {/* <Icon as={LuCheckCircle} w={10} h={10} /> */}
            </Circle>
          </Circle>
          <VStack spacing={4}>
            <Heading fontSize="xl" fontWeight="medium">
              Mandate Authentication Failed
            </Heading>
            <Text fontSize="sm" w="full">
              Congratulations! Your Credit Application was submitted. Please
              keep an eye on your email, where you’ll soon receive more
              information, including important details about the next steps.
            </Text>
          </VStack>

          <Button mt={8} colorScheme="purple" size="lg" w="full" type="submit">
            Retry
          </Button>
        </VStack>
      </>
    </LoanLayout>
  );
};

export default FailureScreen;
