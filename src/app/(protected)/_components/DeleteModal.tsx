import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
  } from "@chakra-ui/react";
  
  interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    handleRequest: () => void;
    isLoading: boolean;
  }
  
  const DeleteModal = ({
    isOpen,
    onClose,
    title,
    handleRequest,
    isLoading,
  }: DeleteModalProps) => {
    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete {title}</ModalHeader>
          <ModalBody>Are you sure you want to delete this {title}?</ModalBody>
          <ModalFooter>
            <Button onClick={onClose} mr={3}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={handleRequest}
              isLoading={isLoading}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };
  
  export default DeleteModal;