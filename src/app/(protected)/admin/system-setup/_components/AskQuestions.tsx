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
import { SubmitHandler, useForm } from "react-hook-form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { NextAuthUserSession, faqProps } from "@/types";
import requestClient from "@/lib/requestClient";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";

interface IFormInput {
    question: string;
    answer: string;
}

interface QuestionsProps {
    id: number;
    question: string;
    answer: string;
}

const AskQuestions = (
    {isOpen, onClose, refetch, questions, isEditing, setIsEditing, setSelectedItem}: 
    {isOpen: boolean, onClose: () => void; refetch: () => void, questions?: QuestionsProps, isEditing: boolean, setIsEditing: Dispatch<SetStateAction<boolean>>, setSelectedItem: Dispatch<SetStateAction<faqProps>>}
) => {

    const session = useSession();
    const sessionToken = session?.data as NextAuthUserSession;
    const token = sessionToken?.user?.token;
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {
        register,
        formState: { errors },
        handleSubmit,
        setValue,
        reset
      } = useForm<IFormInput>({
        mode: "onChange",
        defaultValues: {
        question: questions?.answer ?? "",
        answer: questions?.answer ?? "",
    },
    });

    const onSubmit: SubmitHandler<IFormInput>  = async (data) => {
        setIsLoading(true)
        try {
            let response: any;
            if(isEditing){
                response = await requestClient({token: token}).patch(
                    `/admin/settings/faqs/${questions?.id}`,
                    data
                )
            }else{
                response = await requestClient({token: token}).post(
                    "/admin/settings/faqs",
                    data
                )
            }
            if(response.status === 200){
                setIsLoading(false);
                refetch();
                setIsEditing(false);
                reset();
                onClose();
            }
        } catch (error) {
          setIsLoading(false);
          console.error(error);
          toast.error(handleServerErrorMessage(error));
        }
    };

    useEffect(() => {
        if (questions) {
          setValue("question", questions?.question);
          setValue("answer", questions?.answer);
        }
    }, [questions, setValue]);

    const handleClose = () => {
        reset();
        onClose();
        setSelectedItem(null);
        setIsEditing(false);
    }

    return (
    <ModalComponent
        onClose={handleClose}
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
                    { isEditing ? "Edit FAQs" : "Add FAQs"}
                </Text>
                <X onClick={handleClose} className="w-5 h-auto text-gray-600 cursor-pointer"/>
            </Flex>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <FormControl isInvalid={!!errors.question}>
                    <FormLabel fontSize={"1rem"} color={"gray.600"}>{isEditing ? "Question" : "Add Question"}</FormLabel>
                    <Input 
                        type={"text"}
                        id="question"
                        placeholder=""
                        {...register("question", {
                        required: "Question is required",
                        })}
                    />
                    {errors.question && (
                        <Text as={"span"} className="text-red-500 text-sm">
                        {errors?.question?.message}
                        </Text>
                    )}
                </FormControl>
                <FormControl isInvalid={!!errors.answer}>
                    <FormLabel fontSize={"1rem"} color={"gray.600"}>Enter Answer</FormLabel>
                    <Textarea 
                        id="answer"
                        placeholder=""
                        {...register("answer", {
                        required: "Answer is required",
                        })}
                    />
                    {errors.answer && (
                        <Text as={"span"} className="text-red-500 text-sm">
                        {errors.answer?.message}
                        </Text>
                    )}
                </FormControl>
                <Flex pt={10} pb={5} justify={"flex-end"}>
                    <HStack>
                    <Button 
                    onClick={handleClose} 
                    h={"40px"} 
                    variant={"outline"}>
                        Cancel
                    </Button>
                    <Button 
                    h={"40px"} 
                    type="submit" 
                    isLoading={isLoading} 
                    disabled={isLoading}
                    loadingText={"Submitting..."}
                    >
                        Save Changes
                    </Button>
                    </HStack>
                </Flex>
            </form>
        </Stack>
    </ModalComponent>
  )
}

export default AskQuestions;