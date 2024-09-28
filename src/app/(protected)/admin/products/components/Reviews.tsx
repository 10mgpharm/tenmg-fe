import Image from "next/image";
import { productReviews } from "@/data/mockdata";
import { IoClose, IoStarOutline, IoStarSharp } from "react-icons/io5";

const Reviews = () => {
  return (
    <div className="p-5 rounded-md border">
        {
            productReviews?.map((item, index) => (
                <div key={index} className="border p-5 rounded-md bg-white flex items-center justify-between mb-3">
                    <div className="">
                        <div className="flex gap-4">
                            <Image src={item.image} alt="" className="h-auto"/>
                            <div className="">
                                <p className="uppercase text-gray-800 text-medium">{item.title}</p>
                                <p className="text-gray-500">{item.subtitle}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <IoStarSharp className="w-5 h-5 text-yellow-500" />
                                    <IoStarSharp className="w-5 h-5 text-yellow-500" />
                                    <IoStarSharp className="w-5 h-5 text-yellow-500" />
                                    <IoStarSharp className="w-5 h-5 text-yellow-500" />
                                    <IoStarOutline className="w-4 h-4 text-gray-600" />
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-900 mt-3">{item.content}</p>
                    </div>
                    <div className="bg-red-50 p-2 rounded-md">
                        <IoClose className="w-5 h-5 text-red-500"/>
                    </div>
                </div>
            ))
        }
    </div>
  )
}

export default Reviews