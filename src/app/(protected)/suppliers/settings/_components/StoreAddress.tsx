"use client";

import {
  Box,
  Button,
  Center,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import AddStoreAddressForm from "./AddStoreAddress";
import { useState } from "react";

export default function StoreAddressPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [storeAddressList, setStoreAddressList] = useState<any[]>([]);

  return (
    <Box p={4}>
      <Stack direction="row" justifyContent="space-between" mb={4}>
        <Box>
          <Heading size="md">Store Address List</Heading>
        </Box>
        <Button colorScheme="blue" onClick={onOpen}>
          Add Item
        </Button>
      </Stack>

      {storeAddressList.length === 0 ? (
        <Center
          p={10}
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
          flexDirection="column"
        >
          <Image
            src="/empty.png" 
            alt="No items"
            boxSize="200px"
            mb={4}
          />
          <Text color="gray.500">Nothing to display yet..!</Text>
        </Center>
      ) : (
        <Text>Display store address list here...</Text>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Store Address</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AddStoreAddressForm
              onClose={onClose}
              onAdd={(newItem) =>
                setStoreAddressList([...storeAddressList, newItem])
              }
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
