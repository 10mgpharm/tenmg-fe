"use client"

import Image from "next/image"
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import messageIcon from "@public/assets/images/message.svg"
import { 
    classNames, 
    convertLetterCase, 
    handleServerErrorMessage, 
    truncateString
} from "@/utils";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { FaPaperclip } from "react-icons/fa6";
import { VscSend } from "react-icons/vsc";
import { useSession } from "next-auth/react";
import { 
    ConversationProps,
     MessageProps, 
     NextAuthUserSession, 
     UserListProps 
    } from "@/types";
import requestClient from "@/lib/requestClient";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import { 
    Avatar, 
    Button, 
    Flex, 
    Icon, 
    Input, 
    InputGroup, 
    InputRightElement, 
    Spinner, 
    Tag, 
    TagLabel, 
    useDisclosure 
} from "@chakra-ui/react";
import { SearchIcon } from "lucide-react";
import { useDebouncedValue } from "@/utils/debounce";
import ModalWrapper from "../../suppliers/_components/ModalWrapper";

const Message = () => {

    const session = useSession();
    const chatEndRef = useRef(null);
    const sessionData = session?.data as NextAuthUserSession;
    const token = sessionData?.user?.token;
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [messageLoading, setMessageLoading] = useState(false);
    const [newMessage, setNewMessage] = useState<string>("");
    const [searchWord, setSearchWord] = useState<string>("");
    const [messages, setMessages] = useState<MessageProps[]>();
    const [userList, setUserList] = useState<UserListProps[]>([]);
    const [conversation, setConversation] = useState<ConversationProps[]>([]);
    const [currentMessage, setCurrentMessage] = useState<MessageProps>();
    const { isOpen, onClose, onOpen } = useDisclosure();
    const debouncedSearch = useDebouncedValue(searchWord, 500);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [conversation]); 

    const fetchingData = async () => {
        setLoading(true);
        try {
            const response = await requestClient({ token: token }).get(
            `/account/messages`
            );

            if (response.status === 200) {
                setMessages(response.data.data.data || []);
            }
        } catch (err: any) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchChatUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await requestClient({ token: token }).get(
            `/account/messages/start-conversation?search=${debouncedSearch}`
            );
            if (response.status === 200) {
                setUserList(response.data.data.data || []);
            }
        } catch (err: any) {
            console.error(err);
            toast.error(handleServerErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    }, [token, debouncedSearch])

    useEffect(() => {
        if (token) {
            fetchingData();
            fetchChatUsers();
        }
    }, [token, fetchChatUsers]);

    const refetchingData = async () => {
        try {
            const response = await requestClient({ token: token }).get(
            `/account/messages`
            );

            if (response.status === 200) {
                setMessages(response.data.data.data || []);
            }
        } catch (err: any) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchConversations = async (id: number) => {
        setIsLoading(true);
        try {
            const response = await requestClient({ token: token }).get(
            `/account/messages/${id}`
            );
            if (response.status === 200) {
                setConversation(response.data.data.data || []);
            }
        } catch (err: any) {
            console.error(err);
            toast.error(handleServerErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if(!newMessage && !currentMessage?.receiver?.id) return;
        const receipientId = currentMessage?.receiver?.id !== Number(sessionData?.user?.id) 
                            ? currentMessage?.receiver?.id 
                            : currentMessage?.sender?.id;
        setMessageLoading(true);
        const formdata = {
            "receiver_id": receipientId,
            "message": newMessage
        }
        try {
            const response = await requestClient({ token: token }).post(
            `/account/messages`,
            formdata
            );
            if (response.status === 200) {
                toast.success(response?.data?.message);
                fetchConversations(response?.data?.data?.conversationId);
                refetchingData();
            }
        } catch (err: any) {
            console.error(err);
        } finally {
            setMessageLoading(false);
            setNewMessage("");
        }
    }

    console.log(currentMessage)

    return (
    <div className="px-8 h-[calc(100vh-150px)]">
        {
            loading ?
            (
                <Flex justify="center" align="center" height="200px">
                    <Spinner size="xl" />
                </Flex>
            )
            :
            messages?.length === 0 ? 
            <div className="flex flex-col justify-center max-w-md mx-auto text-center">
                <Image src={messageIcon} alt="" className="mx-auto"/>
                <h3 className="font-semibold text-xl mt-5">No Messages Yet</h3>
                <p className="leading-6 mt-3">This section is empty at the moment. Once you start messaging others messages will appear here.
                </p>
                <button 
                onClick={onOpen}
                className="bg-primary-600 text-white w-36 mx-auto p-2 rounded-md mt-5">
                    Start Message
                </button>
            </div>: 
            <div className="">
                <div className="grid grid-cols-5">
                    <div className="col-span-2 pr-5 h-[calc(100vh-150px)] no-scrollbar overflow-y-scroll">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-2xl text-gray-800 my-4">Message</h3>
                            <Button onClick={onOpen} h={"35px"} px={4} fontSize={"14px"} variant={"outline"}>
                                New Message
                            </Button>
                        </div>
                        <ul className="">
                            {
                                messages?.map((message) => (
                                    <li 
                                        onClick={() => {
                                            fetchConversations(message?.id);
                                            setCurrentMessage(message)
                                        }}
                                        key={message?.id}
                                        className={cn(
                                            currentMessage?.id === message?.id 
                                            ? "border-r-4 border-primary-500 bg-gray-100" 
                                            : "", 
                                            "flex items-center gap-3 py-4 px-4 cursor-pointer"
                                        )}>
                                        <Avatar
                                            size="md"
                                            name={message?.receiver?.id !== Number(sessionData?.user?.id) ? message?.receiver?.name : message?.sender?.name}
                                            src={message?.receiver?.id !== Number(sessionData?.user?.id) ? message?.receiver?.name : message?.sender?.name}
                                        />
                                        <div className="">
                                            <p className="font-medium text-lg text-gray-700">
                                                <span className="capitalize">
                                                    {
                                                    message?.receiver?.id !== Number(sessionData?.user?.id) ? message?.receiver?.name : message?.sender?.name
                                                    }
                                                </span>
                                                <span className="text-gray-500 text-[14px] ml-2">
                                                    {message?.latest?.sentAt}
                                                </span>
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {message?.latest && truncateString(message?.latest?.message, 76)}
                                            </p>
                                        </div>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <div className="col-span-3 border-l h-[calc(100vh-150px)] no-scrollbar overflow-y-scroll">
                        {
                            conversation?.length === 0 ?
                            <>
                            </>:
                            <>
                                <div className="flex items-center gap-3 border-b p-4">
                                    <Avatar
                                        size="md"
                                        name={currentMessage?.receiver?.id !== Number(sessionData?.user?.id) ? currentMessage?.receiver?.name : currentMessage?.sender?.name}
                                        src={currentMessage?.receiver?.id !== Number(sessionData?.user?.id) ? currentMessage?.receiver?.name : currentMessage?.sender?.name}
                                    />
                                    <p className="font-semibold text-lg text-gray-700">
                                        {currentMessage?.receiver?.id !== Number(sessionData?.user?.id) ? currentMessage?.receiver?.name : currentMessage?.sender?.name}
                                    </p>
                                </div>
                                <div className="my-4 px-4 relative">
                                    <p className="text-gray-600 text-center">{currentMessage?.latest?.sentAt}</p>
                                    <div className="mt-5 mb-28">
                                        {
                                            conversation?.map((item) => (
                                                <div 
                                                key={item?.id} 
                                                className={classNames(item.sender?.id === Number(sessionData?.user?.id) ? "justify-start" : "justify-end", " flex mt-5")}>
                                                    {
                                                        item?.message &&
                                                        <div className="w-3/4">
                                                            <div className={classNames(
                                                                item.sender?.id === Number(sessionData?.user?.id) ? 
                                                                "bg-[#293056] text-white rounded-bl-2xl rounded-r-2xl" 
                                                                : "bg-white text-gray-800 rounded-b-2xl rounded-tl-2xl",
                                                                "shadow-md p-5"
                                                            )} 
                                                            >
                                                                <p className="">{item.message}</p>
                                                            </div>
                                                            <p className={classNames(item.sender?.id === Number(sessionData?.user?.id) ? "justify-start" : "justify-end", " flex mt-1 text-gray-400 text-sm")}>{item.sentAt}
                                                            {
                                                                item.sender?.id === Number(sessionData?.user?.id) && <IoCheckmarkDoneSharp className="text-gray-400 w-5 h-5 ml-2" />
                                                            }
                                                            </p>
                                                            {/* Invisible element to scroll into */}
                                                            <div ref={chatEndRef} />
                                                        </div>
                                                    }
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <div className="fixed bottom-12 w-[620px] bg-[#F9FAFB] py-6">
                                        <div className="border rounded-full w-full flex items-center bg-white justify-between p-2">
                                            <div className="flex flex-1 items-center gap-2">
                                                <FaPaperclip className="h-5 w-6 text-gray-600"/>
                                                <input 
                                                onChange={(e) => setNewMessage(e.target.value)} 
                                                className="outline-none flex-1 bg-transparent" 
                                                placeholder="Write messsage here ..."
                                                value={newMessage}
                                                />
                                            </div>
                                            {
                                                messageLoading ? 
                                                <div className="rounded-full">
                                                    <Spinner className="w-4 h-4 text-primary-500"/>
                                                </div> :
                                                <div onClick={(e) => handleSubmit(e)} className="bg-primary-600 p-3 rounded-full">
                                                    <VscSend className="w-5 h-5 text-white" />
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
        }
        <ModalWrapper
        isOpen={isOpen} 
        onClose={onClose}
        title="Chat With New User"
        size={"lg"}
        >
            <div className="mb-8">
                <InputGroup mb={5}>
                    <Input 
                    placeholder='Search user' 
                    onChange={(e) => setSearchWord(e.target.value)} 
                    />
                    <InputRightElement>
                        <Icon as={SearchIcon} color='gray.500' />
                    </InputRightElement>
                </InputGroup>
                <div className="space-y-4">
                    {
                        userList?.map((user: UserListProps) => (
                            <div 
                            key={user?.id}
                            onClick={() => {
                                const existChat = messages?.find((message) => (message.receiver.id === user.id || message.sender.id === user.id));
                                if(existChat){
                                    fetchConversations(existChat?.id);
                                    setCurrentMessage(existChat)
                                }else {
                                    const newMessageObj = {
                                        id: 0,
                                        conversationId: 0,
                                        message: "",
                                        receiver: {
                                            id: user?.id,
                                            name: user?.name,
                                        },
                                        sender: {
                                            id: Number(sessionData?.user?.id),
                                            name: sessionData?.user?.name,
                                        },
                                        sentAt: "",
                                        readStatus: ""
                                    }
                                    setCurrentMessage(newMessageObj as any);
                                    setConversation([newMessageObj]);
                                    setMessages((prev) => [...prev, newMessageObj]);
                                }
                                onClose();
                            }} 
                            className="flex items-center gap-2 cursor-pointer hover:bg-slate-50">
                                <Avatar
                                    size="sm"
                                    name={user?.name}
                                    src={user?.avatar}
                                />
                                <div className="">
                                    <div className="flex gap-1">
                                        <p className="font-medium">{user?.name}</p>
                                        <Tag size="sm" px={1} variant="solid" bg="blue.50" color={"blue.500"}>
                                            <TagLabel>{convertLetterCase(user?.role)}</TagLabel>
                                        </Tag>
                                    </div>
                                    <p className="text-sm text-gray-400">{user?.email}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="flex mt-5">
                    <Button 
                    variant={"outline"}
                    className='cursor-pointer'
                    onClick={onClose}
                    flex={1}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </ModalWrapper>
    </div>
  )
}

export default Message