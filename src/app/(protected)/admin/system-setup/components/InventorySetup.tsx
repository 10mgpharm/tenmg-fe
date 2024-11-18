"use client";
import { 
  Button, 
  Flex, 
  HStack, 
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

const InventorySetup = () => {

    const { isOpen, onClose, onOpen } = useDisclosure();
    const { isOpen: isEditOpen, onClose: onEditClose, onOpen: onEditOpen } = useDisclosure();
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
            <Tr>
              <Td>14-10-2024</Td>
              <Td>Emzor</Td>
              <Td>
                <Tag colorScheme={"yellow"} size={"sm"}>View Variation</Tag>
              </Td>
              <Td>Published</Td>
              <Td>
                <Flex gap={2}>
                  <Button onClick={onEditOpen} variant={"unstyled"} color={"gray.500"}>Edit</Button>
                  <Button variant="unstyled" color={"red.600"}>Delete</Button>
                </Flex>
              </Td>
            </Tr>
            <Tr>
              <Td>14-10-2024</Td>
              <Td>Codeine</Td>
              <Td>
                <Tag colorScheme={"yellow"} size={"sm"}>View Variation</Tag>
              </Td>
              <Td>Draft</Td>
              <Td>
                <Flex gap={2}>
                  <Button onClick={onEditOpen} variant={"unstyled"} color={"gray.500"}>Edit</Button>
                  <Button variant="unstyled" color={"red.600"}>Delete</Button>
                </Flex>
              </Td>
            </Tr>
            <Tr>
              <Td>14-10-2024</Td>
              <Td>Tramadol</Td>
              <Td>
              <Tag colorScheme={"yellow"} size={"sm"}>View Variation</Tag>
              </Td>
              <Td>Published</Td>
              <Td>
                <Flex gap={2}>
                  <Button onClick={onEditOpen} variant={"unstyled"} color={"gray.500"}>Edit</Button>
                  <Button variant="unstyled" color={"red.600"}>Delete</Button>
                </Flex>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
      <Flex mt={10} mb={8} justify={"flex-end"}>
        <HStack>
          <Button h={"40px"} variant={"outline"}>Cancel</Button>
          <Button h={"40px"}>Save</Button>
        </HStack>
      </Flex>
      <AddMedicationType isOpen={isOpen} onClose={onClose}/>
    </Stack>
  )
}

export default InventorySetup