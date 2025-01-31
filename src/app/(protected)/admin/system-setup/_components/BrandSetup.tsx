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
import { Dispatch, SetStateAction, useState } from "react";
import AddNewBrands from "./AddNewBrands";
import EditBrands from "./EditBrands";
import { MedicationData, NextAuthUserSession } from "@/types";
import DeleteMedication from "./DeleteMedication";
import Loader from "../../_components/Loader";
import EmptyOrder from "@/app/(protected)/suppliers/orders/_components/EmptyOrder";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";
import Pagination from "@/app/(protected)/suppliers/_components/Pagination";

const BrandSetup = (
  {data, type, refetchingTypes, loading, searchWord, setSearchWord, meta, setPageCount}: 
  {
    data: MedicationData[];
    type: "Brand" | "Category" | "Presentation" | "Measurement";
    refetchingTypes: () => void, loading: boolean;
    searchWord?: string;
    setSearchWord: Dispatch<SetStateAction<string>>;
    meta: any;
    setPageCount: Dispatch<SetStateAction<number>>
  }
) => {

  const session = useSession();
  const sessionToken = session?.data as NextAuthUserSession;
  const token = sessionToken?.user?.token;
  const [isLoading, setIsLoading] = useState(false);
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

  // const [inputValue, setInputValue] = useState<string>("");
  const [selectedId, setSelectedId] = useState<number>();
  const [selectedItem, setSelectedItem] = useState<MedicationData>();

  const handleDelete = async () => {
    try {
      let response: any;
      if(type === "Brand"){
        response = await requestClient({token: token}).delete(
          `/admin/settings/brands/${selectedId}`,
        )
      }else if(type === "Category"){
        response = await requestClient({token: token}).delete(
          `/admin/settings/categories/${selectedId}`,
        )
      }else if (type === "Measurement") {
        response = await requestClient({ token: token }).delete(
          `/admin/settings/measurements/${selectedId}`,
        )
      }else if (type === "Presentation") {
        response = await requestClient({ token: token }).delete(
          `/admin/settings/presentations/${selectedId}`,
        )
      }
      
      if(response.status === 200){
        setIsLoading(false);
        toast.success(response.data?.message);
        refetchingTypes();
        setSelectedId(0);
        onDeleteClose();
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      toast.error(handleServerErrorMessage(error));
    }
  }

  const metadata = {
    "links": meta
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
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            pl={10}
            placeholder={`Search for a ${type?.toLocaleLowerCase()}`}
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
        <Stack minH={"500px"} mt={5}>
          <TableContainer rounded={"md"}>
            <Table variant='simple' border={"1px solid #EAECF0"} shadow={"sm"} rounded={"md"}>
              <Thead bg={"#E8F1F8"}>
                <Tr color={"primary.500"} roundedTop={"md"}>
                  <Th>Date Created</Th>
                  <Th>Name</Th>
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
                      <Td py={1} lineHeight={3} fontSize={"13px"}>{item.status}</Td>
                      <Td py={1} lineHeight={3} fontSize={"14px"}>
                        <Flex gap={2}>
                          <Button 
                            onClick={() => {
                            setSelectedItem(item);
                            onEditOpen();
                          }} 
                          fontSize={"14px"} 
                          cursor={"pointer"}
                          variant={"unstyled"} 
                          color={"gray.500"}>
                            Edit
                          </Button>
                          <Button 
                          variant="unstyled" 
                          fontSize={"14px"} 
                          color={"red.600"}
                          cursor={"pointer"}
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
            <Pagination meta={metadata} setPageCount={setPageCount}/>
          </TableContainer>
        </Stack>
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
      title={type}
      isLoading={isLoading}
      handleDelete={handleDelete}
      />
    </Stack>
  )
}

export default BrandSetup;