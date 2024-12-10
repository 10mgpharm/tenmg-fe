import {
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FiSearch } from "react-icons/fi";

interface IFormInput {
  search: string;
}

const SearchModal = ({
  isSearchOpen,
  handleCloseSearch,
}: {
  isSearchOpen: boolean;
  handleCloseSearch: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSearched, isSetSearched] = useState<boolean>(false);

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    watch,
  } = useForm<IFormInput>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);
    setIsLoading(false);
  };

  return (
    <Modal isOpen={isSearchOpen} onClose={handleCloseSearch}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.search?.message}>
              <InputGroup size="md">
                <InputLeftElement>
                  <IconButton
                    size="sm"
                    bgColor={"transparent"}
                    _hover={{
                      bg: "transparent",
                    }}
                    aria-label="search"
                  >
                    <FiSearch className="text-gray-400" />
                  </IconButton>
                </InputLeftElement>
                <Input
                  id="search"
                  errorBorderColor="red.300"
                  isInvalid={!!errors.search?.message}
                  className="p-[10px_14px] w-full gap-2 rounded-lg border-1 border-gray-300"
                  type={"text"}
                  placeholder="Search for a product or manufacturer"
                  isDisabled={isLoading}
                  {...register("search", {
                    required: true,
                  })}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    variant={"solid"}
                    size="sm"
                    type="submit"
                    isLoading={isLoading}
                    loadingText="Submitting"
                    isDisabled={isLoading || !watch("search")}
                    mr={1}
                  >
                    Search
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </form>

          {/* Add condition to show */}
          {isSearched && (
            <>
              <Text align="center">No results found for your search.</Text>
              <Text align="center">Try using different keywords.</Text>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SearchModal;
