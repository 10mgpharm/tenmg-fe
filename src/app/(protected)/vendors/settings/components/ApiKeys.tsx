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
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { set, SubmitHandler, useForm } from "react-hook-form";
import { LuCopy } from "react-icons/lu";
import { IoKey, IoTrashOutline } from "react-icons/io5";
import { FaEye, FaEyeSlash, FaKey } from "react-icons/fa6";
import { useState } from "react";
import { toast } from "react-toastify";
import DeleteModal from "../../components/DeleteModal";

interface IFormInput {
  clientId: string;
  clientSecret: string;
  webhookUrl?: string;
  callbackUrl?: string;
}

interface IKeyWrapperProps {
  onSubmit: any;
  keyType: string;
  copyToClipboard: (value: string) => void;
  register: any;
  getValues: any;
  onOpen: () => void;
}

const apiData: IFormInput = {
  clientId: "sk_live_Y2xlcmsub2VyZFkYS5jYSQ",
  clientSecret: "sk_live_Y2xlcmsub2VyZFkYS5jYSQ",
};

const ApiKeys = () => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const {
    onOpen: onOpenRemove,
    onClose: onCloseRemove,
    isOpen: isOpenRemove,
  } = useDisclosure();

  const {
    formState: { errors },
    handleSubmit,
    register,
    getValues,
  } = useForm<IFormInput>({
    mode: "onChange",
    defaultValues: {
      clientId: apiData.clientId,
      clientSecret: apiData.clientSecret,
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data);
  };

  const copyToClipboard = (value: string) => {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        toast.success("Copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  return (
    <div className="max-w-5xl md:p-5 space-y-8">
      <KeyWrapper
        onSubmit={handleSubmit(onSubmit)}
        keyType={"Test Key"}
        copyToClipboard={copyToClipboard}
        register={register}
        getValues={getValues}
        onOpen={onOpen}
      />
      <KeyWrapper
        onSubmit={handleSubmit(onSubmit)}
        keyType={"Live Key"}
        copyToClipboard={copyToClipboard}
        register={register}
        getValues={getValues}
        onOpen={onOpen}
      />

      <DeleteModal isOpen={isOpen} onClose={onClose} title={"Key"} />
    </div>
  );
};

export default ApiKeys;

function KeyWrapper({
  onSubmit,
  keyType,
  copyToClipboard,
  register,
  getValues,
  onOpen,
}: IKeyWrapperProps) {
  const [showClientId, setShowClientId] = useState(false);
  const [showClientSecret, setShowClientSecret] = useState(false);
  const [showWebhookUrl, setShowWebhookUrl] = useState(false);
  const [showCallbackUrl, setShowCallbackUrl] = useState(false);

  return (
    <Box bg={"gray.200"} rounded={"2xl"} shadow={"md"}>
      <Box p={5}>
        <Text as={"h4"} fontSize={"2xl"} fontWeight={"semibold"} pb={2}>
          {keyType}
        </Text>
        <Text as={"p"} fontSize={"sm"} color={"gray.500"}>
          Securely manage these sensitive keys. Do not share them with anyone.
          If you suspect that one of your secret keys has been compromised, you
          should create a new key, update your code, then delete the compromised
          key.
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
                  <InputGroup size={"lg"}>
                    <Input
                      type={showClientId ? "text" : "password"}
                      id="password"
                      size={"lg"}
                      color={"gray.500"}
                      readOnly
                      {...register("clientId")}
                      maxW="3xl"
                      _focus={{
                        color: "gray.800",
                      }}
                    />
                    <InputRightElement>
                      {showClientId ? (
                        <FaEye
                          onClick={() => setShowClientId(!showClientId)}
                          className="text-gray-500 w-5 h-5"
                        />
                      ) : (
                        <FaEyeSlash
                          onClick={() => setShowClientId(!showClientId)}
                          className="text-gray-500 w-5 h-5"
                        />
                      )}
                    </InputRightElement>
                  </InputGroup>
                </Box>
                <Flex gap={2}>
                  <Button
                    leftIcon={<LuCopy />}
                    variant="outline"
                    color={"gray.500"}
                    px={3}
                    onClick={() => copyToClipboard(getValues("clientId"))}
                  >
                    Copy
                  </Button>
                  <Button
                    leftIcon={<FaKey />}
                    variant="solid"
                    bg={"green.500"}
                    _hover={{ bg: "green.300" }}
                    px={3}
                  >
                    Generate
                  </Button>
                </Flex>
              </Flex>
            </FormControl>

            {/* Client Secret */}

            <FormControl display={"flex"}>
              <FormLabel w={"30%"}>Client Secret</FormLabel>
              <Flex w={"70%"} gap={6}>
                <Box flex={1}>
                  <InputGroup size={"lg"}>
                    <Input
                      type={showClientSecret ? "text" : "password"}
                      id="password"
                      size={"lg"}
                      color={"gray.500"}
                      readOnly
                      {...register("clientSecret")}
                      maxW="3xl"
                      _focus={{
                        color: "gray.800",
                      }}
                    />
                    <InputRightElement>
                      {showClientSecret ? (
                        <FaEye
                          onClick={() => setShowClientSecret(!showClientSecret)}
                          className="text-gray-500 w-5 h-5"
                        />
                      ) : (
                        <FaEyeSlash
                          onClick={() => setShowClientSecret(!showClientSecret)}
                          className="text-gray-500 w-5 h-5"
                        />
                      )}
                    </InputRightElement>
                  </InputGroup>
                </Box>
                <Flex gap={2}>
                  <Button
                    leftIcon={<LuCopy />}
                    variant="outline"
                    color={"gray.500"}
                    px={3}
                    onClick={() => copyToClipboard(getValues("clientSecret"))}
                  >
                    Copy
                  </Button>
                  <Button
                    leftIcon={<FaKey />}
                    variant="solid"
                    bg={"green.500"}
                    _hover={{ bg: "green.300" }}
                    px={3}
                  >
                    Generate
                  </Button>
                </Flex>
              </Flex>
            </FormControl>

            {/* Webhook URL */}
            <FormControl display={"flex"}>
              <FormLabel w={"25%"}>Webhook URL</FormLabel>
              <Flex w={"75%"} gap={6} alignItems={"center"}>
                <Box flex={1}>
                  <InputGroup size={"lg"}>
                    <Input
                      type={showWebhookUrl ? "text" : "password"}
                      id="password"
                      size={"lg"}
                      color={"gray.500"}
                      {...register("webhookUrl")}
                      placeholder="https://10mg.com/api/webhooks/event"
                      maxW="3xl"
                      _focus={{
                        color: "gray.800",
                      }}
                    />
                    <InputRightElement>
                      {showWebhookUrl ? (
                        <FaEye
                          onClick={() => setShowWebhookUrl(!showWebhookUrl)}
                          className="text-gray-500 w-5 h-5"
                        />
                      ) : (
                        <FaEyeSlash
                          onClick={() => setShowWebhookUrl(!showWebhookUrl)}
                          className="text-gray-500 w-5 h-5"
                        />
                      )}
                    </InputRightElement>
                  </InputGroup>
                </Box>
                <Box>
                  <Button
                    leftIcon={<LuCopy />}
                    variant="outline"
                    color={"gray.500"}
                    px={3}
                    onClick={() => copyToClipboard(getValues("webhookUrl"))}
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
                    onClick={() => onOpen()}
                  />
                </Box>
              </Flex>
            </FormControl>

            {/* Callback URL */}
            <FormControl display={"flex"}>
              <FormLabel w={"25%"}>Callback URL</FormLabel>
              <Flex w={"75%"} gap={6} alignItems={"center"}>
                <Box flex={1}>
                  <InputGroup size={"lg"}>
                    <Input
                      type={showCallbackUrl ? "text" : "password"}
                      id="password"
                      size={"lg"}
                      color={"gray.500"}
                      {...register("callbackUrl")}
                      placeholder="https://10mg.com/api/callbacks/complete"
                      maxW="3xl"
                      _focus={{
                        color: "gray.800",
                      }}
                    />
                    <InputRightElement>
                      {showCallbackUrl ? (
                        <FaEye
                          onClick={() => setShowCallbackUrl(!showCallbackUrl)}
                          className="text-gray-500 w-5 h-5"
                        />
                      ) : (
                        <FaEyeSlash
                          onClick={() => setShowCallbackUrl(!showCallbackUrl)}
                          className="text-gray-500 w-5 h-5"
                        />
                      )}
                    </InputRightElement>
                  </InputGroup>
                </Box>
                <Box>
                  <Button
                    leftIcon={<LuCopy />}
                    variant="outline"
                    color={"gray.500"}
                    px={3}
                    onClick={() => copyToClipboard(getValues("callbackUrl"))}
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
                    onClick={() => onOpen()}
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
