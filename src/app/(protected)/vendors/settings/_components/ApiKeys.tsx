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
import { SubmitHandler, useForm } from "react-hook-form";
import { LuCopy } from "react-icons/lu";
import { IoTrashOutline } from "react-icons/io5";
import { FaEye, FaEyeSlash, FaKey } from "react-icons/fa6";
import { useEffect, useState, useTransition } from "react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { NextAuthUserSession, ApiKeyEnv, ApiKey } from "@/types";
import { handleServerErrorMessage } from "@/utils";
import { getApiKeyInfo, reGenerateApiKey, updateApiKeyUrls } from "../actions";

interface IFormInput {
  environment: string;
  webhookUrl?: string;
  callbackUrl?: string;
  transactionUrl?: string;
}

interface IKeyWrapperProps {
  pKey: string;
  sKey: string;
  callbcUrl: string;
  webhkUrl: string;
  keyType: string;
  token: string;
  transactionUrl?: string;
  copyToClipboard: (value: string) => void;
  onOpen: () => void;
}

const ApiKeys = () => {
  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;

  const { onOpen, onClose, isOpen } = useDisclosure();
  const [isPending, startTransition] = useTransition();
  const [apiKeyInfo, setApiKeyInfo] = useState<ApiKey>(null);

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

  const handleGetApiKeyInfo = async (token: string) => {
    startTransition(async () => {
      try {
        const { data, message, status } = await getApiKeyInfo(token || "");
        if (status === 'success') {
          console.log(data);
          setApiKeyInfo(data);
        } else {
          toast.error(`Error: ${message}`);

        }
      } catch (error) {
        const errorMessage = handleServerErrorMessage(error);
        toast.error(errorMessage);
      }
    })
  }

  useEffect(() => {
    if (sessionData?.user?.token && !apiKeyInfo) {
      handleGetApiKeyInfo(sessionData?.user?.token);
    }
  }, [sessionData?.user?.token]);

  return (
    <div className="max-w-5xl md:p-5 space-y-8">
      {isPending ? <>Loading...</> : <>
      {/* <KeyWrapper
        keyType={"Test Key"}
        copyToClipboard={copyToClipboard}
        onOpen={onOpen}
        token={sessionData?.user?.token}
        pKey={apiKeyInfo?.testKey}
        sKey={apiKeyInfo?.testSecret}
        callbcUrl={apiKeyInfo?.testCallbackUrl}
        webhkUrl={apiKeyInfo?.testWebhookUrl}
        transactionUrl={apiKeyInfo?.transactionUrl}
      /> */}
      <KeyWrapper
        keyType={"API Credentials"}
        copyToClipboard={copyToClipboard}
        onOpen={onOpen}
        token={sessionData?.user?.token}
        pKey={apiKeyInfo?.key}
        sKey={apiKeyInfo?.secret}
        callbcUrl={apiKeyInfo?.callbackUrl}
        webhkUrl={apiKeyInfo?.webhookUrl}
        transactionUrl={apiKeyInfo?.transactionUrl}
      />
      </>}
    </div>
  );
};

export default ApiKeys;

function KeyWrapper({
  keyType,
  copyToClipboard,
  onOpen,
  token,
  pKey,
  sKey,
  callbcUrl,
  webhkUrl,
  transactionUrl,
}: IKeyWrapperProps) {
  const [showPublicKey, setShowPublicKey] = useState<boolean>(false);
  const [showSecretKey, setShowSecretKey] = useState<boolean>(false);

  const [showWebhookUrl, setShowWebhookUrl] = useState<boolean>(false);
  const [showCallbackUrl, setShowCallbackUrl] = useState<boolean>(false);
  const [showTransactionUrl, setShowTransactionUrl] = useState<boolean>(false);

  const [publicKey, setPublicKey] = useState<string>(pKey);
  const [secretKey, setSecretKey] = useState<string>(sKey);

  const [isPublicKeyLoading, setIsPublicKeyLoading] = useState<boolean>(false);
  const [isSecretKeyLoading, setIsSecretKeyLoading] = useState<boolean>(false);

  const environment: ApiKeyEnv = keyType === "Test Key" ? "test" : "live";

  const {
    formState: { errors },
    handleSubmit,
    register,
    getValues,
    setValue,
  } = useForm<IFormInput>({
    mode: "onChange",
    defaultValues: {
      environment,
      webhookUrl: webhkUrl,
      callbackUrl: callbcUrl,
      transactionUrl: transactionUrl,
    },
  });

  const handleKeyGeneration = async (type: 'public' | 'secret', environment: 'test' | 'live') => {
    if (type === 'public') {
      setIsPublicKeyLoading(true);
      setIsSecretKeyLoading(false);
    } else {
      setIsSecretKeyLoading(true);
      setIsPublicKeyLoading(false);
    }

    try {
      const { data, message, status } = await reGenerateApiKey({ token, type, environment });
      if (status === 'success') {
        toast.success(message);
        type === 'public' ? setPublicKey(data.value) : setSecretKey(data.value);
      } else {
        toast.error(`Error: ${message}`);
      }
    } catch (error) {
      const errorMessage = handleServerErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setIsPublicKeyLoading(false);
      setIsSecretKeyLoading(false);
    }
  }

  const onSubmit: SubmitHandler<IFormInput> = async (formData) => {
    startTransition(async () => {
      try {
        const { data, message, status } = await updateApiKeyUrls({
          token,
          environment: formData.environment as ApiKeyEnv,
          webhookUrl: formData.webhookUrl,
          callbackUrl: formData.callbackUrl,
          transactionUrl: formData.transactionUrl,
        });
        if (status === 'success') {
          toast.success(message);
          // update local state
          if (environment === 'live') {
            setValue('webhookUrl', data.value.webhookUrl);
            setValue('callbackUrl', data.value.callbackUrl);
            setValue('callbackUrl', data.value.transactionUrl);
          } else {
            setValue('webhookUrl', data.value.testWebhookUrl);
            setValue('callbackUrl', data.value.testCallbackUrl);
            setValue('callbackUrl', data.value.transactionUrl);
          }
        } else {
          toast.error(`Error: ${message}`);
        }
      } catch (error) {
        console.error(error);
        const errorMessage = handleServerErrorMessage(error);
        toast.error(errorMessage);
      }
    })
  };

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
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack direction={"column"} gap={5} divider={<Divider />}>
            <FormControl display={{ md: "flex" }}>
              <FormLabel w={{ md: "30%" }}>Public Key</FormLabel>
              <Flex
                w={{ md: "70%" }}
                direction={{ base: "column", md: "row" }}
                gap={6}
              >
                <Box flex={1}>
                  <InputGroup size={"lg"}>
                    <Input
                      type={showPublicKey ? "text" : "password"}
                      id="password"
                      size={"lg"}
                      color={"gray.500"}
                      readOnly
                      value={publicKey}
                      maxW="3xl"
                      _focus={{
                        color: "gray.800",
                      }}
                    />
                    <InputRightElement>
                      {showPublicKey ? (
                        <FaEye
                          onClick={() => setShowPublicKey(!showPublicKey)}
                          className="text-gray-500 w-5 h-5"
                        />
                      ) : (
                        <FaEyeSlash
                          onClick={() => setShowPublicKey(!showPublicKey)}
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
                    onClick={() => copyToClipboard(publicKey)}
                  >
                    Copy
                  </Button>
                  <Button
                    leftIcon={<FaKey />}
                    variant="solid"
                    bg={"green.500"}
                    _hover={{ bg: "green.300" }}
                    px={3}
                    isLoading={isPublicKeyLoading}
                    onClick={() => {
                      handleKeyGeneration('public', environment);
                    }}
                  >
                    Generate
                  </Button>
                </Flex>
              </Flex>
            </FormControl>

            {/* Secret Key */}

            <FormControl display={"flex"}>
              <FormLabel w={"30%"}>Secret Key</FormLabel>
              <Flex w={"70%"} gap={6}>
                <Box flex={1}>
                  <InputGroup size={"lg"}>
                    <Input
                      type={showSecretKey ? "text" : "password"}
                      id="password"
                      size={"lg"}
                      color={"gray.500"}
                      readOnly
                      value={secretKey}
                      maxW="3xl"
                      _focus={{
                        color: "gray.800",
                      }}
                    />
                    <InputRightElement>
                      {showSecretKey ? (
                        <FaEye
                          onClick={() => setShowSecretKey(!showSecretKey)}
                          className="text-gray-500 w-5 h-5"
                        />
                      ) : (
                        <FaEyeSlash
                          onClick={() => setShowSecretKey(!showSecretKey)}
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
                    onClick={() => copyToClipboard(secretKey)}
                  >
                    Copy
                  </Button>
                  <Button
                    leftIcon={<FaKey />}
                    variant="solid"
                    bg={"green.500"}
                    _hover={{ bg: "green.300" }}
                    px={3}
                    isLoading={isSecretKeyLoading}
                    onClick={() => {
                      handleKeyGeneration('secret', environment);
                    }}
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
                </Box>
              </Flex>
            </FormControl>

            {/* Transaction URL */}
            <FormControl display={"flex"}>
              <FormLabel w={"25%"}>Transaction URL</FormLabel>
              <Flex w={"75%"} gap={6} alignItems={"center"}>
                <Box flex={1}>
                  <InputGroup size={"lg"}>
                    <Input
                      type={showTransactionUrl ? "text" : "password"}
                      id="password"
                      size={"lg"}
                      color={"gray.500"}
                      {...register("transactionUrl")}
                      placeholder="e.g. https://10mg.com/api/transaction/fetch"
                      maxW="3xl"
                      _focus={{
                        color: "gray.800",
                      }}
                    />
                    <InputRightElement>
                      {showTransactionUrl ? (
                        <FaEye
                          onClick={() => setShowTransactionUrl(!showTransactionUrl)}
                          className="text-gray-500 w-5 h-5"
                        />
                      ) : (
                        <FaEyeSlash
                          onClick={() => setShowTransactionUrl(!showTransactionUrl)}
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
                    onClick={() => copyToClipboard(getValues("transactionUrl"))}
                  >
                    Copy
                  </Button>
                </Box>
                <Box>
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
