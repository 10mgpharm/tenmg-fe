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
import { toast } from "react-toastify";
import NoticeCard from "./NoticeCard";
import { useWishlistStore } from "../storeFrontState/useWIshlist";

const StoreFrontPharmacy = () => {
  const session = useSession();
  const userData = session.data as NextAuthUserSession;

  const [storeFrontData, setStoreFrontData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const [isEmpty, setIsEmpty] = useState(false);

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

        const storeCount = data?.data?.data?.data?.flatMap(
          (item) => item.products
        ).length;
        setIsEmpty(storeCount === 0);
      } catch (e) {
        // !Todo: handle error
        // toast.error("Could not fetch store, please try again")
      } finally {
        setIsLoading(false);
      }
    };
    fetchStoreFront();
  }, [userData?.user?.token]);

  const { fetchWishlist, } = useWishlistStore()

  useEffect(() => {
    fetchWishlist(userData?.user?.token);
  }, [fetchWishlist, userData?.user?.token])

  return (
    <div className="">
      {[
        BusinessStatus.PENDING_VERIFICATION,
        BusinessStatus.PENDING_APPROVAL,
        BusinessStatus.REJECTED,
        BusinessStatus.LICENSE_EXPIRED,
        BusinessStatus.SUSPENDED,
        BusinessStatus.BANNED,
      ].includes(userData?.user?.businessStatus) && (
        <NoticeCard
          setOpen={onOpen}
          url="/storefront/settings/license-upload"
          status={userData?.user?.businessStatus}
        />
      )}
      <div className="p-8 px-6 md:px-20 max-w-screen-2xl">
        <Carousel />
      </div>
      {isLoading && (
        <div className="w-full h-64 flex items-center justify-center">
          <Spinner />
        </div>
      )}
      <Skeleton isLoaded={!isLoading} fadeDuration={0.4}>
        {isEmpty ? (
          <EmptyStoreFront />
        ) : (
          <>
            {storeFrontData?.data?.map(
              (category, i) =>
                category?.products?.length > 0 && (
                  <ProductField key={i} category={category} />
                )
            )}
          </>
        )}
      </Skeleton>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Flex direction="column" align="center" textAlign="center">
              <Image src="/assets/images/verification.png" alt="Verification" />
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
