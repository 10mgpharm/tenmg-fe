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
import { SubmitHandler, useForm } from "react-hook-form";

interface IFormInput {
  comment: string;
}
const DeleteModal = ({
  isOpen,
  onClose,
  handleCommentDeleteRequest,
  isLoadingDecline,
}: {
  isOpen: boolean;
  onClose: () => void;
  handleCommentDeleteRequest: (comment: string) => void;
  isLoadingDecline: boolean;
}) => {
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<IFormInput>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    handleCommentDeleteRequest(data.comment);
    reset();
  };

  return (
    <Modal isCentered isOpen={isOpen} size="lg" onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader mt={4}>Decline Request</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form className="space-y-5 mt-6" onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.comment} mb={4}>
              <FormLabel>Enter reason for decline</FormLabel>
              <Textarea
                {...register("comment", { required: "Reason is required" })}
              />
              {errors.comment && (
                <span className="text-red-500 text-sm">
                  {errors.comment.message}
                </span>
              )}
            </FormControl>
            <div className="flex items-center justify-end gap-4 py-6">
              <Button
                variant={"outline"}
                size={"md"}
                px={4}
                py={2}
                rounded="lg"
                colorScheme={"gray.500"}
                onClick={() => onClose()}
              >
                Cancel
              </Button>
              <Button
                variant={"solid"}
                size={"md"}
                px={4}
                py={2}
                rounded="lg"
                backgroundColor="error.600"
                _hover="error.700"
                type="submit"
                isLoading={isLoadingDecline}
                isDisabled={isLoadingDecline}
                loadingText="Declining....."
              >
                Decline Request
              </Button>
            </div>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DeleteModal;
