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
  Tag, 
  Tbody, 
  Td, 
  Th, 
  Thead, 
  Tr, 
  useDisclosure
} from "@chakra-ui/react";
import { Search } from "lucide-react";
import AddMedicationType from "./AddMedicationType";
import { MedicationData } from "@/types";
import EditMedicationType from "./EditMedicationType";
import { useState } from "react";
import DeleteMedication from "./DeleteMedication";
import Loader from "../../_components/Loader";

const MedicationTypes = (
  {data, fetchingMedicationTypes, loading}: 
  {data: MedicationData[], fetchingMedicationTypes: () => void, loading: boolean}
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

  const [selectedId, setSelectedId] = useState<number>();
  const [selectedItem, setSelectedItem] = useState<MedicationData>();

  return (
    <Stack flex={1} p={5} bg={"white"} rounded={"md"} shadow={"sm"}>
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
        <Button h="38px" onClick={onOpen} bg={"primary.500"}>Add Medication Type</Button>
      </Flex>
      <TableContainer mt={5}>
        <Table variant='simple' border={"1px solid #EAECF0"} rounded={"md"}>
          <Thead bg={"#E8F1F8"}>
            <Tr color={"primary.500"} roundedTop={"md"}>
              <Th>Date Created</Th>
              <Th>Name</Th>
              <Th>Variations</Th>
              <Th>Status</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {
              loading ? <Loader /> :
              data?.map((item: MedicationData) => (
                <Tr key={item.id}>
                  <Td>14-10-2024</Td>
                  <Td>{item.name}</Td>
                  <Td>
                    <Tag colorScheme={"yellow"} size={"sm"}>View Variation</Tag>
                  </Td>
                  <Td className="text-sm">{item.status}</Td>
                  <Td>
                    <Flex gap={2}>
                      <Button 
                      onClick={() => {
                        setSelectedItem(item)
                        onEditOpen()
                      }} 
                      variant={"unstyled"}
                      color={"gray.500"}>
                        Edit
                      </Button>
                      <Button 
                      variant="unstyled" 
                      color={"red.600"}
                      onClick={() => {
                        setSelectedId(item.id)
                        onDeleteOpen()
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
      <AddMedicationType 
      isOpen={isOpen} 
      onClose={onClose}
      fetchingMedicationTypes={fetchingMedicationTypes}
      />
      <EditMedicationType 
      isOpen={isEditOpen} 
      onClose={onEditClose} 
      medication={selectedItem}
      fetchingMedicationTypes={fetchingMedicationTypes}
      />
      <DeleteMedication 
      isOpen={isDeleteOpen}
      onClose={onDeleteClose}
      id={selectedId}
      title="Medication"
      refetch={fetchingMedicationTypes}
      />
    </Stack>
  )
}

export default MedicationTypes;