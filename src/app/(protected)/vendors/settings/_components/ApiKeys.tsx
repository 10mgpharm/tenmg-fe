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
}

interface IKeyWrapperProps {
  pKey: string;
  sKey: string;
  callbcUrl: string;
  webhkUrl: string;
  keyType: string;
  token: string;
  copyToClipboard: (value: string) => void;
  onOpen: () => void;
}

const ApiKeys = () => {
  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;
  const [token, setToken] = useState<string>(sessionData?.user?.token);

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

  const handleGetApiKeyInfo = async () => {
    startTransition(async () => {
      try {
        const { data, message, status } = await getApiKeyInfo(token);
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
    if (sessionData?.user && !apiKeyInfo) {
      setToken(sessionData.user.token)
      handleGetApiKeyInfo();
    }
  }, [sessionData]);

  return (
    <div className="max-w-5xl md:p-5 space-y-8">
      {isPending ? <>Loading...</> : <>
      <KeyWrapper
        keyType={"Test Key"}
        copyToClipboard={copyToClipboard}
        onOpen={onOpen}
        token={token}
        pKey={apiKeyInfo?.testKey}
        sKey={apiKeyInfo?.testSecret}
        callbcUrl={apiKeyInfo?.testCallbackUrl}
        webhkUrl={apiKeyInfo?.testWebhookUrl}
      />
      <KeyWrapper
        keyType={"Live Key"}
        copyToClipboard={copyToClipboard}
        onOpen={onOpen}
        token={token}
        pKey={apiKeyInfo?.key}
        sKey={apiKeyInfo?.secret}
        callbcUrl={apiKeyInfo?.callbackUrl}
        webhkUrl={apiKeyInfo?.webhookUrl}
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
  webhkUrl
}: IKeyWrapperProps) {
  const [showPublicKey, setShowPublicKey] = useState<boolean>(false);
  const [showSecretKey, setShowSecretKey] = useState<boolean>(false);

  const [showWebhookUrl, setShowWebhookUrl] = useState<boolean>(false);
  const [showCallbackUrl, setShowCallbackUrl] = useState<boolean>(false);

  const [publicKey, setPublicKey] = useState<string>(pKey);
  const [secretKey, setSecretKey] = useState<string>(sKey);

  const [isPending, startTransition] = useTransition();
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
    },
  });

  const handleKeyGeneration = (type: 'public' | 'secret', environment: 'test' | 'live') => {
    startTransition(async () => {
      try {
        const { data, message, status } = await reGenerateApiKey({ token, type, environment });
        if (status === 'success') {
          toast.success(message);
          // update local state
          type === 'public' ? setPublicKey(data.value) : setSecretKey(data.value);
        } else {
          toast.error(`Error: ${message}`);
        }
      } catch (error) {
        const errorMessage = handleServerErrorMessage(error);
        toast.error(errorMessage);
      }
    })
  }

  const onSubmit: SubmitHandler<IFormInput> = async (formData) => {
    startTransition(async () => {
      try {
        const { data, message, status } = await updateApiKeyUrls({
          token,
          environment: formData.environment as ApiKeyEnv,
          webhookUrl: formData.webhookUrl,
          callbackUrl: formData.callbackUrl,
        });
        if (status === 'success') {
          toast.success(message);
          // update local state
          if (environment === 'live') {
            setValue('webhookUrl', data.value.webhookUrl);
            setValue('callbackUrl', data.value.callbackUrl);
          } else {
            setValue('webhookUrl', data.value.testWebhookUrl);
            setValue('callbackUrl', data.value.testCallbackUrl);
          }
        } else {
          toast.error(`Error: ${message}`);
        }
      } catch (error) {
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
                    isLoading={isPending}
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
                    isLoading={isPending}
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
