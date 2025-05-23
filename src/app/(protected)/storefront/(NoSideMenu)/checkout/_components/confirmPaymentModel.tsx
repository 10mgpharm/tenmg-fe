"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";

export const ConfirmPaymentModal = ({
  isOpen,
  onConfirm,
  isLoading,
}: {
  isOpen: boolean;
  isLoading: boolean;
  onConfirm: () => void;
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}}
      isCentered
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <ModalOverlay />
      <ModalContent className="rounded-xl p-4 shadow-lg">
        <ModalBody className="text-base">
          <h2 className="text-xl font-bold text-center">Confirm Payment</h2>
          <p className="text-[15px] text-center text-gray-600 pt-1 ">
            After completing the payment in the new tab, click the button below
            to confirm.
          </p>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="green"
            onClick={onConfirm}
            className="w-full mt-2"
            disabled={isLoading}
          >
            {isLoading ? "Confriming..." : "I Have Paid"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
