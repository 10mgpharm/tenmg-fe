"use client";
import React from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

import requestClient from "@/lib/requestClient";
import { handleServerErrorMessage } from "@/utils";
import { NextAuthUserSession } from "@/types";

type Props = {
  id: string;
  onSuccess: () => void;
};

export default function DeleteAddressModal({ id, onSuccess }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;
  const userToken = sessionData?.user?.token;

  const handleDelete = async () => {
    if (!userToken) return;

    try {
      const response = await requestClient({ token: userToken }).delete(
        `/storefront/shipping-addresses/${id}`
      );
      if (response.status === 200 || response.status === 204) {
        toast.success("Address deleted successfully");
        onSuccess(); // refresh address list
      } else {
        toast.error(`Error: ${response.data.message}`);
      }
    } catch (error) {
      const errorMessage = handleServerErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      onClose();
    }
  };

  return (
    <>
      <Button
        onClick={onOpen}
        variant="outline"
        colorScheme="red"
        size="sm"
        width="100%"
      >
        Delete Address
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Address</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this address from your shipping
            addresses?
          </ModalBody>
          <ModalFooter>
            <div className="w-full flex items-center justify-between gap-4">
              <Button
                variant="outline"
                colorScheme="gray"
                size="sm"
                width="100%"
                onClick={onClose}
              >
                Discard
              </Button>
              <Button
                variant="outline"
                colorScheme="red"
                size="sm"
                width="100%"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
