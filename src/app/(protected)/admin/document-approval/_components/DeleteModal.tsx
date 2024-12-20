import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
} from "@chakra-ui/react";
import icon from "@public/assets/images/image 20.svg";
import Image from "next/image";

const DeleteModal = ({
  isOpen,
  onClose,
  handleCommentDeleteRequest,
}: {
  isOpen: boolean;
  onClose: () => void;
  handleCommentDeleteRequest: () => void;
}) => {
  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader mt={4}>Decline Request</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form className="space-y-5 mt-6">
            <FormControl>
              <FormLabel>Enter reason for decline</FormLabel>
              <Textarea />
            </FormControl>
          </form>
        </ModalBody>

        <ModalFooter>
          <div className="w-fit flex items-center justify-end gap-4">
            <Button variant={"solid"} size={"md"} px={4} py={2} rounded="lg">
              Cancel
            </Button>
            <Button variant={"solid"} size={"md"} px={4} py={2} rounded="lg">
              Decline Request
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteModal;
