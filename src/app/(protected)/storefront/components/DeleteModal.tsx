import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

const DeleteModal = ({
  isOpen,
  onClose,
  title,
  description,
  handleDelete,
}: {
  isOpen: boolean;
  title: string;
  description: string;
  onClose: () => void;
  handleDelete: () => void;
}) => {
  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody p={8}>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className=" text-gray-500 mt-2">
              Are you sure you want to {description}
            </p>
            <div className="flex gap-4 mt-8">
              <button
                className="cursor-pointer p-3 rounded-lg border flex-1"
                onClick={() => onClose()}
              >
                Discard
              </button>
              <button
                className="bg-red-600 text-white p-3 rounded-lg flex-1"
                onClick={() => {
                  handleDelete()
                  onClose();
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DeleteModal;
