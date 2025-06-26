import requestClient from "@/lib/requestClient";
import { FaqDataProps, NextAuthUserSession, faqProps } from "@/types";
import { 
    Button, 
    Flex, 
    HStack, 
    Table, 
    TableContainer, 
    Tbody, 
    Td, 
    Text, 
    Th, 
    Thead, 
    Tr, 
    useDisclosure 
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import AskQuestions from "./AskQuestions";
import DeleteMedication from "./DeleteMedication";
import Loader from "../../_components/Loader";
import EmptyOrder from "@/app/(protected)/suppliers/orders/_components/EmptyOrder";
import { handleServerErrorMessage } from "@/utils";
import { toast } from "react-toastify";

const FAQList = () => {
    const session = useSession();
    const sessionToken = session?.data as NextAuthUserSession;
    const token = sessionToken?.user?.token;

    const [faqs, setFaqs] = useState<FaqDataProps>();
    const [loading, setLoading] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const { isOpen, onClose, onOpen } = useDisclosure();
    const { 
        isOpen: isDeleteOpen, 
        onClose: onDeleteClose, 
        onOpen: onDeleteOpen 
    } = useDisclosure();

    const [selectedId, setSelectedId] = useState<number>();
    const [selectedItem, setSelectedItem] = useState<faqProps>();

    const fetchingFAQS = useCallback(async () => {
    setLoading(true)
    try {
      const response = await requestClient({ token: token }).get(
        `/admin/settings/faqs`
      );
      if (response.status === 200) {
        setFaqs(response.data.data);
        setLoading(false)
      }
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
    }, [token]);

    useEffect(() => {
        if (!token) return;
        fetchingFAQS();
    }, [token, fetchingFAQS]);

    const handleDelete = async () => {
        try {
            const response = await requestClient({token: token}).delete(
                `/admin/settings/faqs/${selectedId}`
            )
            if (response.status === 200) {
                fetchingFAQS();
                onDeleteClose();
            }
        } catch (error) {
            console.error(error)
            toast.error(handleServerErrorMessage(error));
        }
    }

  return (
    <div className="bg-white p-5 rounded-md shadow-sm">
        <Flex flexDir={["column", "row"]} gap={2} justify={"space-between"}>
            <Text fontWeight={700} fontSize={"1rem"} color={"gray.700"}>Set FAQs</Text>
            <Button onClick={onOpen} h={"34px"} variant={"outline"} px={2} fontSize={"14px"} color={"gray.600"}>
            Add Questions & Answers
            </Button>
        </Flex>
        {
            loading ? 
            <Loader /> :
            faqs?.data?.length === 0 
            ? <EmptyOrder 
              heading={`No FAQ Yet`} 
              content={`You currently have no FAQ. All FAQs will appear here.`}
            /> : 
            <TableContainer mt={5}>
                <Table variant='simple' border={"1px solid #EAECF0"} rounded={"md"} className="no-scrollbar">
                    <Thead bg={"#E8F1F8"}>
                    <Tr color={"primary.500"} roundedTop={"md"}>
                        <Th width="300px">Question</Th>
                        <Th width="300px">Response</Th>
                        <Th textAlign={"center"}>Action</Th>
                    </Tr>
                    </Thead>
                    <Tbody>
                    {
                        faqs?.data?.map((item: faqProps) => (
                        <Tr key={item.id}>
                            <Td width={["100%", "300px"]} fontSize={"14px"} className="sm:break-words sm:text-wrap">
                                {item.question}
                            </Td>
                            <Td width={["100%", "300px"]} fontSize={"14px"} className="sm:break-words sm:text-wrap">
                               {item.answer}
                            </Td>
                            <Td fontSize={"14px"}>
                                <Flex justifyContent={"center"} gap={2}>
                                    <Button 
                                    onClick={() => {
                                        setIsEditing(true);
                                        setSelectedItem(item);
                                        onOpen();
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
        <AskQuestions 
        isOpen={isOpen} 
        onClose={onClose}
        refetch={fetchingFAQS}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        questions={selectedItem}
        setSelectedItem={setSelectedItem}
        />
        <DeleteMedication
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        isLoading={loading}
        title="FAQ"
        handleDelete={handleDelete}
        />
    </div>
  )
}

export default FAQList