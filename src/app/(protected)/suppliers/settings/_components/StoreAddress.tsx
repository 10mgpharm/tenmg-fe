"use client";

import {
  Box,
  Button,
  Center,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  Tag,
  Flex,
  Spinner,
  useToast,
  SimpleGrid,
} from "@chakra-ui/react";
import AddStoreAddressForm from "./AddStoreAddress";
import { useEffect, useState } from "react";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import { toast } from "react-toastify";

export default function StoreAddressPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [storeAddressList, setStoreAddressList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<any | null>(null);

  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await requestClient({ token }).get(
          "/supplier/store-addresses"
        );
        setStoreAddressList(response.data?.data?.data || []);
      } catch (err) {
        console.error("Error fetching store addresses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [token]);

  const handleAddAddress = (newItem: any) => {
    setStoreAddressList((prev) => [...prev, newItem]);
    toast.success("Added successfully");
  };

  const handleUpdateAddress = (updatedItem: any) => {
    setStoreAddressList((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    setEditItem(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await requestClient({ token }).delete(`/supplier/store-addresses/${id}`);
      setStoreAddressList((prev) => prev.filter((item) => item.id !== id));
      toast.success("Deleted successfully");
       
    } catch (error) {
      console.error("Delete failed", error);
      toast.success("error");
    }
  };

  const openEdit = (item: any) => {
    setEditItem(item);
    onOpen();
  };

  const closeModal = () => {
    setEditItem(null);
    onClose();
  };

  return (
    <Box p={4}>
      <Heading size="md" mb={6}>
        Store Address List
      </Heading>

      {loading ? (
        <Center>
          <Spinner />
        </Center>
      ) : storeAddressList.length === 0 ? (
        <Center
          p={10}
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
          flexDirection="column"
        >
          <Text color="gray.500" mb={4}>
            Nothing to display yet..!
          </Text>
          <Button colorScheme="blue" onClick={onOpen}>
            Add Store Address
          </Button>
        </Center>
      ) : (
        <>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {storeAddressList.map((item) => (
              <Box
                key={item.id}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                p={4}
              >
                <Flex justify="space-between" mb={2}>
                  {item.isDefault && <Tag colorScheme="green">Default</Tag>}
                </Flex>
                <Text fontWeight="bold">{item.name || "Store Address"}</Text>
                <Text>{item.phoneNumber || "09098009911"}</Text>
                <Text>
                  {item.streetAddress}, {item.city}, {item.state},{" "}
                  {item.country}
                </Text>
                <Stack direction="row" spacing={4} mt={4} flexWrap="wrap">
                  <Button
                    colorScheme="blue"
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(item)}
                  >
                    Edit Address
                  </Button>
                  <Button
                    colorScheme="red"
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete Address
                  </Button>
                  {/* {!item.isDefault && (
                    <Button
                      colorScheme="green"
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetPreferred(item.id)}
                    >
                      Set as Preferred
                    </Button>
                  )} */}
                </Stack>
              </Box>
            ))}
          </SimpleGrid>
          <Center mt={6}>
            <Button
              colorScheme="blue"
              onClick={() => {
                setEditItem(null);
                onOpen();
              }}
            >
              {storeAddressList.length > 0
                ? "Add Shipping Address"
                : "Add Store Address"}
            </Button>
          </Center>
        </>
      )}

      <Modal isOpen={isOpen} onClose={closeModal} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editItem ? "Edit Store Address" : "Add Store Address"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AddStoreAddressForm
              onClose={closeModal}
              onAdd={handleAddAddress}
              onUpdate={handleUpdateAddress}
              initialData={editItem}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
