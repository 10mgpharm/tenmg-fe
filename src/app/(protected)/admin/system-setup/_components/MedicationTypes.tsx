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
import { MedicationData, NextAuthUserSession } from "@/types";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import DeleteMedication from "./DeleteMedication";
import Loader from "@/app/(protected)/admin/_components/Loader";
import EmptyOrder from "@/app/(protected)/suppliers/orders/_components/EmptyOrder";
import Pagination from "@/app/(protected)/suppliers/_components/Pagination";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";

const MedicationTypes = (
  {data, fetchingMedicationTypes, loading, searchWord, setSearchWord, setPageCount, meta}: 
  { data: MedicationData[], 
    fetchingMedicationTypes: () => void, 
    loading: boolean, 
    searchWord: string, 
    setSearchWord: Dispatch<SetStateAction<string>>,
    setPageCount: Dispatch<SetStateAction<number>>,
    meta: any
  }
) => {

  const session = useSession();
  const sessionToken = session?.data as NextAuthUserSession;
  const token = sessionToken?.user?.token;

  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { 
    isOpen: isDeleteOpen, 
    onClose: onDeleteClose, 
    onOpen: onDeleteOpen 
  } = useDisclosure();

  const [selectedId, setSelectedId] = useState<number>();
  const [selectedItem, setSelectedItem] = useState<MedicationData>(null);

  const resetSelectedItem = useCallback(() => {
    setSelectedItem(null)
  },[])

  const metadata = {
    "links": meta
  }

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await requestClient({token: token}).delete(
        `/admin/settings/medication-types/${selectedId}`
      )
      if(response.status === 200){
        toast.success(response?.data?.message);
        fetchingMedicationTypes();
        onDeleteClose();
      }
    } catch (error) {
      console.error(error);
      toast.error(handleServerErrorMessage(error));
    }
  }

  return (
    <Stack flex={1}>
      <Flex justify={"space-between"}>
        <InputGroup size='md' width={"20rem"} shadow={"sm"}>
          <InputLeftElement pl={1}>
            <Icon as={Search} className="w-5 h-5"/>
          </InputLeftElement>
          <Input
            type="text"
            pl={10}
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            placeholder='Search for a medication'
          />
        </InputGroup>
        <Button h="38px" onClick={onOpen} bg={"primary.500"}>Add Medication Type</Button>
      </Flex>
      {
        loading ? <Loader /> :
        data?.length === 0 
        ? <EmptyOrder 
          heading={`No Medication Type Yet`} 
          content={`You currently have no medication type. All medication types will appear here.`}
        /> : 
        <TableContainer mt={5} minH={"500px"} rounded={"md"} maxWidth={"830px"} overflowX={"scroll"}>
          <Table variant='simple' border={"1px solid #EAECF0"} rounded={"md"} shadow={"sm"}>
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
                data?.map((item: MedicationData) => (
                  <Tr key={item.id}>
                    <Td py={1} lineHeight={3} fontSize={"14px"}>{item.createdAt}</Td>
                    <Td py={1} lineHeight={3} fontSize={"14px"}>{item.name}</Td>
                    <Td py={1} lineHeight={3} fontSize={"14px"}>
                      <Tag colorScheme={"yellow"} size={"sm"}>View Variation</Tag>
                    </Td>
                    <Td py={1} lineHeight={3} fontSize={"14px"} className="text-sm">{item.status}</Td>
                    <Td py={1} lineHeight={3} fontSize={"14px"}>
                      <Flex gap={2}>
                        <Button 
                        onClick={() => {
                          setSelectedItem(item)
                          onOpen()
                        }} 
                        fontSize={"14px"}
                        variant={"unstyled"}
                        color={"gray.500"}>
                          Edit
                        </Button>
                        <Button 
                        fontSize={"14px"}
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
          <Pagination meta={metadata} setPageCount={setPageCount}/>
        </TableContainer>
      }
      <AddMedicationType 
        isOpen={isOpen} 
        medication={selectedItem}
        onClose={onClose}
        fetchingMedicationTypes={fetchingMedicationTypes}
        resetSelectedItem={resetSelectedItem}
      />
      <DeleteMedication 
      isOpen={isDeleteOpen}
      onClose={onDeleteClose}
      title="Medication"
      isLoading={isLoading}
      handleDelete={handleDelete}
      />
    </Stack>
  )
}

export default MedicationTypes;