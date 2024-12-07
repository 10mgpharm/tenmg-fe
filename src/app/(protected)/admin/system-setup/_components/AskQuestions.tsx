import { 
    Button, 
    Flex, 
    FormControl, 
    FormLabel, 
    HStack, 
    Input, 
    Stack, 
    Text, 
    Textarea 
} from "@chakra-ui/react";
import ModalComponent from "./ModalComponent"
import { X } from "lucide-react";

const AskQuestions = ({isOpen, onClose}: {isOpen: boolean, onClose: () => void;}) => {
  return (
    <ModalComponent
        onClose={onClose}
        isOpen={isOpen}
        modalBodyStyle={{
            height: "100vh",
        }}
    >
        <Stack>
            <Flex justify={"space-between"} align={"center"}>
                <Text
                    fontSize={"20px"}
                    fontWeight={"bold"}
                    alignSelf={"center"}
                    mb="5px"
                >
                Add FAQs
                </Text>
                <X onClick={onClose} className="w-5 h-auto text-gray-600 cursor-pointer"/>
            </Flex>
            <form className="space-y-5">
                <FormControl>
                    <FormLabel fontSize={"1rem"} color={"gray.600"}>Add Question</FormLabel>
                    <Input type="text" />
                </FormControl>
                <FormControl>
                    <FormLabel fontSize={"1rem"} color={"gray.600"}>Enter Answer</FormLabel>
                    <Textarea />
                </FormControl>
                <Flex pt={10} pb={5} justify={"flex-end"}>
                    <HStack>
                    <Button onClick={onClose} h={"40px"} variant={"outline"}>Cancel</Button>
                    <Button h={"40px"}>Save Changes</Button>
                    </HStack>
                </Flex>
            </form>
        </Stack>
    </ModalComponent>
  )
}

export default AskQuestions