import {
  Button,
  Text,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
} from "@chakra-ui/react";

const CheckPaymentStatusModal = ({
  isOpen,
  onClose,
  verifyPayment,
}: {
  isOpen: boolean;
  onClose: () => void;
  verifyPayment: () => void;
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      closeOnEsc={false}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader className="text-center">
          Pay with 10mg Credit In Progress
        </ModalHeader>
        <ModalBody textAlign="center" py={6}>
          <Spinner size="xl" thickness="4px" color="blue.500" mb={4} />
          <Text fontSize="md" mb={4} color={"gray.600"}>
            Click the button below to check your application and payment status
            to complete your order.
          </Text>
        </ModalBody>
        <ModalFooter display="flex" justifyContent="space-between" gap={6}>
          <Button variant="ghost" onClick={onClose} className="flex-1">
            Close
          </Button>

          <Button onClick={verifyPayment} className="flex-1">
            Check Payment Status
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CheckPaymentStatusModal;
