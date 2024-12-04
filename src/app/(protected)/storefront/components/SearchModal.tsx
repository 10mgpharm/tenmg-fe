import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

const SearchModal = ({
  isSearchOpen,
  handleCloseSearch,
}: {
  isSearchOpen: boolean;
  handleCloseSearch: () => void;
}) => {
  return (
    <Modal isOpen={isSearchOpen} onClose={handleCloseSearch}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Search</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Search functionality goes here.</Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SearchModal;
