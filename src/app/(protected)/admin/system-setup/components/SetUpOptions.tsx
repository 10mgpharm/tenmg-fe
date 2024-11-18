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
  Tbody, 
  Td, 
  Th, 
  Thead, 
  Tr, 
  useDisclosure
} from "@chakra-ui/react";
import { Search } from "lucide-react";
import { ChangeEvent, useState } from "react";
import AddNewBrands from "./AddNewBrands";
import EditBrands from "./EditBrands";

const SetUpOptions = ({data, type}: {data: any, type: "Brand" | "Category"}) => {

  const { isOpen, onClose, onOpen } = useDisclosure();
  const { isOpen: isEditOpen, onClose: onEditClose, onOpen: onEditOpen } = useDisclosure();
  const [inputValue, setInputValue] = useState<string>("");
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

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
        <Button h="38px" onClick={onOpen} bg={"primary.500"}>Add New {type}</Button>
      </Flex>
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
            <Tr>
              <Td>14-10-2024</Td>
              <Td>Emzor</Td>
              <Td>Yes</Td>
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
              <Td>C & S</Td>
              <Td>Yes</Td>
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
              <Td>Emzor</Td>
              <Td>Yes</Td>
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
      <AddNewBrands isOpen={isOpen} onClose={onClose} type={type}/>
      <EditBrands isOpen={isEditOpen} onClose={onEditClose} type={type} />
    </Stack>
  )
}

export default SetUpOptions;