"use client";

import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { LuCopy } from "react-icons/lu";
import { IoTrashOutline } from "react-icons/io5";

interface IFormInput {
  clientId: string;
  clientSecret: string;
  webhookUrl: string;
  callbackUrl: string;
}

interface IKeyWrapperProps {
  onSubmit: any;
  keyType: string;
}

const ApiKeys = () => {

  const {
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data);
  };

  return (
    <div className="max-w-5xl md:p-5 space-y-8">
      <KeyWrapper
        onSubmit={handleSubmit(onSubmit)}
        keyType={"Test Key"}
       
      />
      <KeyWrapper
        onSubmit={handleSubmit(onSubmit)}
        keyType={"Live Key"}
      />
    </div>
  );
};

export default ApiKeys;

function KeyWrapper({ onSubmit, keyType }: IKeyWrapperProps) {
  return (
    <Box bg={"gray.200"} rounded={"2xl"} shadow={"md"}>
      <Box p={5}>
        <Text as={"h4"} fontSize={"2xl"} fontWeight={"semibold"} pb={2}>
          {keyType}
        </Text>
        <Text as={"p"} fontSize={"sm"} color={"gray.500"}>
          Securely manage these sensitive keys. Do not share them with anyone.
          If you suspect that one of your secret keys has been compromised, you
          should create a new key, update your code, then the delete the
          compromised key.
        </Text>
      </Box>

      <Box p={5} bg={"white"} rounded={"2xl"} borderWidth={2} px={6} py={8}>
        <form onSubmit={onSubmit}>
          <Stack direction={"column"} gap={5} divider={<Divider />}>
            <FormControl display={{ md: "flex" }}>
              <FormLabel w={{ md: "30%" }}>Client ID</FormLabel>
              <Flex
                w={{ md: "70%" }}
                direction={{ base: "column", md: "row" }}
                gap={6}
              >
                <Box flex={1}>
                  <Input
                    size={"lg"}
                    color={"gray.500"}
                    type="text"
                    readOnly
                    value="sk_live_Y2xlcmsub2VyZFkYS5jYSQ"
                    maxW="3xl"
                    _focus={{
                      color: "gray.800",
                    }}
                  />
                </Box>
                <Box>
                  <Button
                    leftIcon={<LuCopy />}
                    variant="outline"
                    color={"gray.500"}
                    px={3}
                  >
                    Copy
                  </Button>
                </Box>
              </Flex>
            </FormControl>

            {/* Client Secret */}

            <FormControl display={"flex"}>
              <FormLabel w={"30%"}>Client Secret</FormLabel>
              <Flex w={"70%"} gap={6}>
                <Box flex={1}>
                  <Input
                    size={"lg"}
                    color={"gray.500"}
                    type="text"
                    readOnly
                    value="sk_live_Y2xlcmsub2VyZFkYS5jYSQ"
                    maxW="3xl"
                    _focus={{
                      color: "gray.800",
                    }}
                  />
                </Box>
                <Box>
                  <Button
                    leftIcon={<LuCopy />}
                    variant="outline"
                    color={"gray.500"}
                    px={3}
                  >
                    Copy
                  </Button>
                </Box>
              </Flex>
            </FormControl>

            <FormControl display={"flex"}>
              <FormLabel w={"25%"}>Webhook URL</FormLabel>
              <Flex w={"75%"} gap={6} alignItems={"center"}>
                <Box flex={1}>
                  <Input
                    size={"lg"}
                    type="text"
                    readOnly
                    color={"gray.500"}
                    value="sk_live_Y2xlcmsub2VyZFkYS5jYSQ"
                    maxW="3xl"
                    _focus={{
                      color: "gray.800",
                    }}
                  />
                </Box>
                <Box>
                  <Button
                    leftIcon={<LuCopy />}
                    variant="outline"
                    color={"gray.500"}
                    px={3}
                  >
                    Copy
                  </Button>
                </Box>
                <Box>
                  <Icon
                    as={IoTrashOutline}
                    w={6}
                    h={6}
                    color="red.500"
                    cursor={"pointer"}
                  />
                </Box>
              </Flex>
            </FormControl>

            <FormControl display={"flex"}>
              <FormLabel w={"25%"}>Callback URL</FormLabel>
              <Flex w={"75%"} gap={6} alignItems={"center"}>
                <Box flex={1}>
                  <Input
                    size={"lg"}
                    type="text"
                    color={"gray.500"}
                    readOnly
                    value="sk_live_Y2xlcmsub2VyZFkYS5jYSQ"
                    maxW="3xl"
                    _focus={{
                      color: "gray.800",
                    }}
                  />

                </Box>
                <Box>
                  <Button
                    leftIcon={<LuCopy />}
                    variant="outline"
                    color={"gray.500"}
                    px={3}
                  >
                    Copy
                  </Button>
                </Box>
                <Box>
                  <Icon
                    as={IoTrashOutline}
                    w={6}
                    h={6}
                    color="red.500"
                    cursor={"pointer"}
                  />
                </Box>
              </Flex>
            </FormControl>
          </Stack>
          <HStack justify={"right"} mt={8}>
            <Flex>
              <Button type="submit" colorScheme="blue">
                Save Changes
              </Button>
            </Flex>
          </HStack>
        </form>
      </Box>
    </Box>
  );
}
