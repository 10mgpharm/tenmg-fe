import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Text,
} from "@chakra-ui/react";

export default function ConfirmActionModal({
  open,
  close,
  continueAction,
  isLoading,
}: {
  open: boolean;
  close: () => void;
  continueAction: () => void;
  isLoading: boolean;
}) {
  return (
    <>
      <Modal isOpen={open} onClose={close} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <ModalHeader className="text-center">Revoke API Access</ModalHeader>
            <Text className="text-center">
              Are you sure you want to revoke this API? This action cannot be
              undone.
            </Text>
          </ModalBody>
          <ModalFooter className="flex !justify-center w-full  ">
            <Button onClick={close} mr={3}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={continueAction}
              isLoading={isLoading}
            >
              Continue
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
