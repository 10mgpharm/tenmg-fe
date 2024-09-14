import {
  VStack,
  Heading,
  Text,
  Icon,
  Circle,
  Box,
  Button,
} from "@chakra-ui/react";
import { LuCheckCircle } from "react-icons/lu";

const SuccessScreen = () => {
  return (
    <VStack spacing={10} textAlign="center" paddingY="50px">
      <Circle size="90px" bg="success.100" color="green.500">
        <Circle size="60px" bg="success.200">
          <Icon as={LuCheckCircle} w={10} h={10} />
        </Circle>
      </Circle>
      <VStack spacing={4}>
        <Heading fontSize="xl" fontWeight="medium">
          Credit Application Submitted!
        </Heading>
        <Text fontSize="sm" w="full">
          Congratulations! Your Credit Application was submitted. Please keep an
          eye on your email, where you’ll soon receive more information,
          including important details about the next steps.
        </Text>
      </VStack>

      <Button mt={8} colorScheme="purple" size="lg" w="full" type="submit">
        Check your email
      </Button>
    </VStack>
  );
};

export default SuccessScreen;
