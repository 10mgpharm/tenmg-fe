"use client"

import Image from "next/image"
import { FormEvent, useEffect, useState } from "react"

import avatar from '@public/assets/images/Avatar.svg';
import messageIcon from "@public/assets/images/message.svg"
import { classNames } from "@/utils";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { FaPaperclip } from "react-icons/fa6";
import { VscSend } from "react-icons/vsc";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import requestClient from "@/lib/requestClient";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import { Flex, Spinner } from "@chakra-ui/react";

interface MessageProps {
    id: number;
    sender: {
        id: number;
        name: string;
    },
    receiver: {
        id: number;
        name: string;
    },
    latest: {
        id: number;
        conversationId: number;
        message: string;
        readStatus: string;
        sender: {
            id: number;
            name: string;
        },
        receiver: {
            id: number;
            name: string;
        },
        sentAt: string;
    }
}

interface ConversationProps {
    conversationId: number;
    id: number;
    message: string;
    readStatus: string;
    sender: {
        id: number;
        name: string;
    },
    receiver: {
        id: number;
        name: string;
    },
    sentAt: string;
}

const Message = () => {

    const session = useSession();
    const sessionData = session?.data as NextAuthUserSession;
    const token = sessionData?.user?.token;

    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [messageLoading, setMessageLoading] = useState(false);
    const [newMessage, setNewMessage] = useState<string>("");
    const [messages, setMessages] = useState<MessageProps[]>([]);
    const [conversation, setConversation] = useState<ConversationProps[]>([]);
    const [currentMessage, setCurrentMessage] = useState<MessageProps>();

    const fetchingData = async () => {
        setLoading(true);
        try {
            const response = await requestClient({ token: token }).get(
            `/account/messages`
            );

            if (response.status === 200) {
                setMessages(response.data.data.data || []);
                setCurrentMessage(response?.data?.data?.data[0]);
            }
        } catch (err: any) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchingData();
        }
    }, [token]);

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
        } finally {
            setIsLoading(false);
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if(!newMessage && currentMessage?.receiver?.id) return;
        setMessageLoading(true);
        const formdata = {
            "receiver_id": currentMessage?.receiver?.id,
            "message": newMessage
        }
        try {
            const response = await requestClient({ token: token }).post(
            `/account/messages`,
            formdata
            );
            if (response.status === 200) {
                toast.success(response?.data?.message);
                fetchConversations(currentMessage?.id);
            }
        } catch (err: any) {
            console.error(err);
        } finally {
            setMessageLoading(false);
        }
    }

    console.log(currentMessage)

    if(loading){
        return(
          <Flex justify="center" align="center" height="200px">
            <Spinner size="xl" />
          </Flex>
        )
    }

  return (
    <div className="px-8 h-[calc(100vh-150px)]">
        {
            messages?.length === 0 ? 
            <div className="flex flex-col justify-center max-w-md mx-auto text-center">
                <Image src={messageIcon} alt="" className="mx-auto"/>
                <h3 className="font-semibold text-xl mt-5">No Messages Yet</h3>
                <p className="leading-6 mt-3">This section is empty at the moment. Once you start messaging others messages will appear here.
                </p>
                <button 
                // onClick={() => setShow(true)} 
                className="bg-primary-600 text-white w-36 mx-auto p-2 rounded-md mt-5">
                    Start Message
                </button>
            </div>: 
            <div className="">
                <div className="grid grid-cols-5">
                    <div className="col-span-2 pr-5">
                        <h3 className="font-semibold text-2xl text-gray-800 my-4">Message</h3>
                        <ul className="space-y-3">
                            {
                                messages?.map((message) => (
                                    <li 
                                        onClick={() => {
                                            fetchConversations(message?.latest?.conversationId);
                                            setCurrentMessage(message)
                                        }}
                                        key={message?.id}
                                        className={cn(currentMessage?.id === message?.id ? "border-r-4 border-primary-500 bg-gray-100" : "", "flex items-center gap-3 py-4 px-4 cursor-pointer")}>
                                        <Image src={avatar} alt="" className=""/>
                                        <div className="space-y-2">
                                            <p className="font-medium text-lg text-gray-700">
                                                {message?.receiver?.name}
                                                <span className="text-gray-500 text-[14px] ml-2">
                                                    {message?.latest?.sentAt}
                                                </span>
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                You have a new message, click to view
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
                                    <Image src={avatar} alt="" className=""/>
                                    <p className="font-semibold text-lg text-gray-700">
                                        {currentMessage?.receiver?.name}
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
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <div className="fixed bottom-12 w-[620px] bg-[#F9FAFB] py-6">
                                        <div className="border rounded-full w-full flex items-center bg-white justify-between p-2">
                                            <div className="flex flex-1 items-center gap-2">
                                                <FaPaperclip className="h-5 w-6 text-gray-600"/>
                                                <input onChange={(e) => setNewMessage(e.target.value)} className="outline-none flex-1 bg-transparent" placeholder="Write messsage here ..."/>
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
    </div>
  )
}

export default Message