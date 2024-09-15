"use client"

import Image from "next/image"
import { useState } from "react"

import avatar from '@/assets/Images/Avatar.svg';
import messageIcon from "@/assets/Images/message.svg"
import { classNames } from "@/utils";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { FaPaperclip } from "react-icons/fa6";
import { VscSend } from "react-icons/vsc";

const threads = [
    {id: 1, messgae: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, qui", sender: true, time: "09:10"},
    {id: 2, messgae: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt", sender: false, time: "09:10"},
    {id: 3, messgae: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, qui", sender: true, time: "09:10"},
    {id: 3, messgae: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, qui", sender: true, time: "09:10"},
]

const Message = () => {
    const [show, setShow] = useState(false);
  return (
    <div className="px-8 h-[calc(100vh-150px)]">
        {
            !setShow ? 
            <div className="flex flex-col justify-center max-w-md mx-auto text-center">
                <Image src={messageIcon} alt="" className="mx-auto"/>
                <h3 className="font-semibold text-xl mt-5">No Messages Yet</h3>
                <p className="leading-6 mt-3">This section is empty at the moment. Once you start messaging others messages will appear here.</p>
                <button onClick={() => setShow(true)} className="bg-primary-600 text-white w-36 mx-auto p-2 rounded-md mt-5">Start Message</button>
            </div>: 
            <div className="">
                <div className="grid grid-cols-5">
                    <div className="col-span-2 pr-5">
                        <h3 className="font-semibold text-2xl text-gray-800 my-4">Message</h3>
                        <ul>
                            <li className="flex items-center gap-3 bg-gray-100 py-4 px-4 border-r-4 border-primary-500">
                                <Image src={avatar} alt="" className=""/>
                                <div className="space-y-2">
                                    <p className="font-medium text-lg text-gray-700">
                                        Chudi Victor
                                        <span className="text-gray-500 text-[14px] ml-2">19 hours ago</span>
                                    </p>
                                    <p className="text-sm text-gray-600">You have a new message, click to view</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="col-span-3 border-l h-[calc(100vh-150px)] no-scrollbar overflow-y-scroll">
                        <div className="flex items-center gap-3 border-b p-4">
                            <Image src={avatar} alt="" className=""/>
                            <p className="font-semibold text-lg text-gray-700">
                                Chudi Victor
                            </p>
                        </div>
                        <div className="my-4 px-4 relative">
                            <p className="text-gray-600 text-center">Yesterday at 9:29 PM</p>
                            <div className="mt-5 mb-28">
                                {
                                    threads?.map((thread) => (
                                        <div key={thread.id} className={classNames(thread.sender ? "justify-end" : "justify-start", " flex mt-5")}>
                                            <div className="w-3/4" key={thread.id}>
                                                <div className={classNames(
                                                    thread.sender ? 
                                                    "bg-white text-gray-800 rounded-lg" 
                                                    : "bg-[#293056] text-white rounded-bl-2xl rounded-r-2xl",
                                                    "  p-5"
                                                )} 
                                                >
                                                    <p className="">{thread.messgae}</p>
                                                </div>
                                                <p className={classNames(thread.sender ? "justify-end" : "justify-start", " flex mt-1 text-gray-400")}>{thread.time}
                                                {
                                                    thread.sender && <IoCheckmarkDoneSharp className="text-gray-400 w-5 h-5 ml-2" />
                                                }
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                            <div className="fixed bottom-12 w-[620px] bg-[#F9FAFB] py-6">
                                <div className="border rounded-full w-full flex items-center bg-white justify-between p-2">
                                    <div className="flex items-center gap-2">
                                        <FaPaperclip className="h-5 w-6 text-gray-600"/>
                                        <input className="outline-none flex-1 bg-transparent" placeholder="write messsage here ..."/>
                                    </div>
                                    <div className="bg-primary-600 p-3 rounded-full">
                                        <VscSend className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }
    </div>
  )
}

export default Message