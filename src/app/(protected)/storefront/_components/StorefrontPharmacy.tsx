"use client";

import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import Carousel from "./Carousel";
import ProductField from "./ProductField";
import { useEffect, useState } from "react";
import requestClient from "@/lib/requestClient";
import EmptyStoreFront from "./EmptyStoreFront";
import { useRouter } from "next/navigation";

import {
  Box,
  Button,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Spinner,
  Stack,
  Text,
  Image,
  useDisclosure,
} from "@chakra-ui/react";
import { FiX } from "react-icons/fi";
import { BusinessStatus } from "@/constants";

const StoreFrontPharmacy = ({
  businessStatus,
}: {
  businessStatus: BusinessStatus;
}) => {
  const session = useSession();
  const userData = session.data as NextAuthUserSession;

  // const productTitle = [
  //   "FREQUENTLY BOUGHT ITEMS",
  //   "CHRONIC CONDITIONS",
  //   "VACCINE & SPECIAL MEDICATIONS",
  //   "REPRODUCTIVE HEALTH & FERTILITY SOLUTIONS",
  //   "ASTHMA & ALLERGIES",
  //   "HOSPITALS AND CLINICS",
  // ];

  const [storeFrontData, setStoreFrontData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const [isEmpty, setIsEmpty] = useState(false);

  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const router = useRouter();

  useEffect(() => {
    const fetchStoreFront = async () => {
      setIsLoading(true);
      try {
        const data = await requestClient({ token: userData?.user?.token }).get(
          "/storefront"
        );

        setStoreFrontData(data?.data?.data);
        console.log("data?.data?.data", data?.data?.data)
        const storeCount = data?.data?.data?.data?.flatMap(
          (item) => item.products
        ).length;
        setIsEmpty(storeCount === 0);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStoreFront();
  }, [userData?.user?.token]);

  console.log("isEmpty", isEmpty);

  return (
    <div className="">
      {[
        BusinessStatus.PENDING_VERIFICATION,
        BusinessStatus.PENDING_APPROVAL,
        BusinessStatus.REJECTED,
      ].includes(businessStatus) &&
        isBannerVisible && (
          <Box
            bg="red.500"
            color="white"
            py={4}
            px={6}
            position="relative"
            textAlign="center"
          >
            <Text
              fontSize={{ base: "sm", md: "md" }}
              maxW="700px"
              mx="auto"
              fontWeight={500}
            >
              Complete Your Verification to Unlock Full Access.{" "}
              <Button
                variant="link"
                color="white"
                onClick={onOpen}
                textDecoration="underline"
                fontWeight={500}
              >
                Click here to Proceed.
              </Button>
            </Text>

            <IconButton
              size="sm"
              aria-label="Close banner"
              icon={<FiX />}
              onClick={() => setIsBannerVisible(false)}
              variant="ghost"
              color="white"
              _hover={{ bg: "red.700" }}
              position="absolute"
              right="4"
              top="50%"
              transform="translateY(-50%)"
            />
          </Box>
        )}
      <div className="p-8 px-6 md:px-20 max-w-screen-2xl">
        <Carousel />
      </div>
      {isLoading && <div className="w-full h-1/2 flex items-center justify-center">
        <Spinner />
      </div>}
      <Skeleton isLoaded={!isLoading} fadeDuration={0.4}>
        {isEmpty ? (
          <EmptyStoreFront />
        ) : (
          <>
            {storeFrontData?.data?.map((category, i) => (
              category?.products?.length > 0 && <ProductField key={i} category={category} />
            ))}
          </>
        )}
      </Skeleton>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Flex direction="column" align="center" textAlign="center">
              <Image src="/assets/images/verification.png" alt="Verification"  />
              <Text fontWeight="bold" fontSize="lg" mb={2} mt={5}>
                Verify your account
              </Text>
              <Text fontSize="sm" color="gray.600">
                Before you can place an order, we need you to upload the
                required documents to verify your account. While you can browse
                and explore our offerings, purchasing is restricted until your
                verification is complete.
              </Text>
            </Flex>
          </ModalBody>

          <ModalFooter w="full">
            <Button variant="outline" mr={3} onClick={onClose} w="full">
              Close
            </Button>
            <Button
              colorScheme="blue"
              w="full"
              onClick={() => {
                router.push("/storefront/settings/license-upload");
              }}
            >
              Start Verification
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default StoreFrontPharmacy;
