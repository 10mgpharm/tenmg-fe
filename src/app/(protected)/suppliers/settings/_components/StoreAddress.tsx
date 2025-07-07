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
import DeleteAddressModal from "./deleteStoreAddressModal";

export default function StoreAddressPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [storeAddressList, setStoreAddressList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<any | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [actionType, setActionType] = useState<"EDIT" | "ADD">("ADD");
  const {
    isOpen: isDeleteModal,
    onOpen: openDeleteModal,
    onClose: closeDeleteModal,
  } = useDisclosure();

  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;

  const openEdit = (item: any) => {
    setEditItem(item);
    setActionType("EDIT");
    onOpen();
  };

  const closeModal = () => {
    setEditItem(null);
    onClose();
  };

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

  useEffect(() => {
    fetchAddresses();
  }, [token]);

  const handleAddAddress = async (data) => {
    setIsPosting(true);
    try {
      await requestClient({ token }).post("/supplier/store-addresses", data);

      toast.success("Store address added");
      fetchAddresses();
      closeModal();
    } catch (err) {
      console.error("Error fetching store addresses:", err);
    } finally {
      setIsPosting(false);
    }
  };

  const handleUpdateAddress = async (data, id) => {
    setIsPosting(true);
    try {
      await requestClient({ token }).patch(
        `/supplier/store-addresses/${id}`,
        data
      );

      toast.success("Store address edited successfully");
      fetchAddresses();
      closeModal();
    } catch (err) {
      console.error("Error fetching store addresses:", err);
    } finally {
      setIsPosting(false);
    }
  };

  const handleDelete = async (id: number) => {
    setIsPosting(true);
    try {
      await requestClient({ token }).delete(`/supplier/store-addresses/${id}`);
      toast.success("Deleted successfully");
      fetchAddresses();
      closeDeleteModal();
    } catch (error) {
      console.error("Delete failed", error);
      toast.success("error");
    }
    setIsPosting(false);
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
                    onClick={() => {
                      openEdit(item);
                    }}
                  >
                    Edit Address
                  </Button>
                  <Button
                    colorScheme="red"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditItem(item);
                      openDeleteModal();
                    }}
                  >
                    Delete Address
                  </Button>
                </Stack>
              </Box>
            ))}
          </SimpleGrid>
          <Center mt={6}>
            <Button
              colorScheme="blue"
              onClick={() => {
                setEditItem(null);
                setActionType("ADD");
                onOpen();
              }}
            >
              {"Add Store Address"}
            </Button>
          </Center>
        </>
      )}

      <Modal isOpen={isOpen} onClose={closeModal} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {actionType === "EDIT" ? "Edit Store Address" : "Add Store Address"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AddStoreAddressForm
              handleprocess={
                actionType === "EDIT" ? handleUpdateAddress : handleAddAddress
              }
              initialData={editItem}
              isLoading={isPosting}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      {isDeleteModal && (
        <DeleteAddressModal
          isOpen={isDeleteModal}
          onClose={closeDeleteModal}
          handleDelete={() => handleDelete(editItem?.id)}
          isDeleting={isPosting}
        />
      )}
    </Box>
  );
}
