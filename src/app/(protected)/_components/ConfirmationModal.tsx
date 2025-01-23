import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { ActionType } from "@/constants";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  actionType: ActionType | null;
  onConfirm: (actionType: ActionType) => void;
}

export const ConfirmationModal = ({
  isOpen,
  onClose,
  title,
  actionType,
  onConfirm,
}: ConfirmationModalProps) => {
  if (!actionType) return null;

  const actionConfig: {
    [key in ActionType]: { display: string; colorScheme: string };
  } = {
    ACTIVE: { display: "Activate", colorScheme: "green" },
    SUSPENDED: { display: "Suspend", colorScheme: "red" },
    INACTIVE: { display: "Inactivate", colorScheme: "red" },
    REJECT: { display: "Reject", colorScheme: "red" },
    APPROVE: { display: "Approve", colorScheme: "green" },
  };

  const { display, colorScheme } = actionConfig[actionType] || {
    display:
      actionType.charAt(0).toUpperCase() + actionType.slice(1).toLowerCase(),
    colorScheme: "blue",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {display} {title}
        </ModalHeader>
        <ModalBody>
          Are you sure you want to {display.toLowerCase()} this {title}?
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={onClose} mr={3}>
            Cancel
          </Button>
          <Button
            colorScheme={colorScheme}
            onClick={() => onConfirm(actionType)}
          >
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
