"use client";
import { 
  Button, 
  Flex, 
  Icon, 
  Input, 
  InputGroup, 
  InputLeftElement, 
  Stack, 
  Table, 
  TableContainer, 
  Tbody, 
  Td, 
  Th, 
  Thead, 
  Tr, 
  useDisclosure
} from "@chakra-ui/react";
import { Search } from "lucide-react";
import { useState } from "react";
import AddNewBrands from "./AddNewBrands";
import EditBrands from "./EditBrands";
import { MedicationData } from "@/types";
import DeleteMedication from "./DeleteMedication";
import Loader from "../../_components/Loader";
import EmptyOrder from "@/app/(protected)/suppliers/orders/_components/EmptyOrder";

const BrandSetup = (
  {data, type, refetchingTypes, loading}: 
  {data: MedicationData[], type: "Brand" | "Category", refetchingTypes: () => void, loading: boolean}
) => {

  const { isOpen, onClose, onOpen } = useDisclosure();
  const { 
    isOpen: isEditOpen, 
    onClose: onEditClose, 
    onOpen: onEditOpen 
  } = useDisclosure();
  const { 
    isOpen: isDeleteOpen, 
    onClose: onDeleteClose, 
    onOpen: onDeleteOpen 
  } = useDisclosure();

  const [inputValue, setInputValue] = useState<string>("");
  const [selectedId, setSelectedId] = useState<number>();
  const [selectedItem, setSelectedItem] = useState<MedicationData>();

  return (
    <Stack flex={1} minH={"500px"} p={5} bg={"white"} rounded={"md"} shadow={"sm"}>
      <Flex justify={"space-between"}>
        <InputGroup size='md' width={"20rem"}>
          <InputLeftElement pl={1}>
            <Icon as={Search} className="w-5 h-5"/>
          </InputLeftElement>
          <Input
            type="text"
            pl={10}
            placeholder='Search for a user'
          />
        </InputGroup>
        <Button h="38px" onClick={onOpen} bg={"primary.500"}>Add New {type}</Button>
      </Flex>
      {
        loading ? <Loader /> :
        data?.length === 0 
        ? <EmptyOrder 
          heading={`No ${type} Yet`} 
          content={`You currently have no ${type}. All ${type} will appear here.`}
        /> : 
        <TableContainer mt={5}>
          <Table variant='simple' border={"1px solid #EAECF0"} rounded={"md"}>
            <Thead bg={"#E8F1F8"}>
              <Tr color={"primary.500"} roundedTop={"md"}>
                <Th>Date Created</Th>
                <Th>Name</Th>
                <Th>Active</Th>
                <Th>Status</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {
                data?.map((item: MedicationData) => (
                  <Tr key={item.id}>
                    <Td fontSize={"14px"}>14-10-2024</Td>
                    <Td fontSize={"14px"}>{item.name}</Td>
                    <Td fontSize={"14px"}>{item.active ? "Yes" : "No"}</Td>
                    <Td fontSize={"14px"}>{item.status}</Td>
                    <Td fontSize={"14px"}>
                      <Flex gap={2}>
                        <Button 
                          onClick={() => {
                          setSelectedItem(item);
                          onEditOpen();
                        }} 
                        fontSize={"14px"} 
                        variant={"unstyled"} 
                        color={"gray.500"}>
                          Edit
                        </Button>
                        <Button 
                        variant="unstyled" 
                        fontSize={"14px"} 
                        color={"red.600"}
                        onClick={() => {
                          setSelectedId(item.id)
                          onDeleteOpen();
                        }}
                        >
                          Delete
                        </Button>
                      </Flex>
                    </Td>
                  </Tr>
                ))
              }
            </Tbody>
          </Table>
        </TableContainer>
      }
      <AddNewBrands 
      isOpen={isOpen}
      onClose={onClose} 
      type={type}
      refetchingTypes={refetchingTypes}
      />
      <EditBrands 
      isOpen={isEditOpen} 
      onClose={onEditClose} 
      brand={selectedItem}
      type={type} 
      refetchingTypes={refetchingTypes}
      />
      <DeleteMedication 
      isOpen={isDeleteOpen}
      onClose={onDeleteClose}
      id={selectedId}
      title="Brand"
      refetch={refetchingTypes}
      />
    </Stack>
  )
}

export default BrandSetup;