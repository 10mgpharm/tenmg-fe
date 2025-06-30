import { classNames } from "@/utils"
import { FaArrowDown, FaArrowUp } from "react-icons/fa6"
import { MdInsights } from "react-icons/md"

const DashboardCard = (
    {title, amount, percentage, timeStamp, changeType}: 
    {title: string, amount: string, percentage: string, timeStamp: string, changeType: string}
) => {
  return (
    <div className="border rounded-md px-5 py-8 bg-white space-y-2 relative">
        <div className="flex items-center justify-between">
            <p className="text-gray-600 font-medium">{title}</p>
            <div className="md:hidden p-2 rounded-full shadow-md">
                <MdInsights className="w-6 h-6 text-primary-500" />
            </div>
        </div>
        <div className="flex items-center justify-between">
            <h2 className="font-semibold text-3xl">{amount}</h2>
        </div>
        <div className="flex items-center">
            <div className="flex items-center">
                {
                    changeType === "INCREASE" ? 
                    <FaArrowUp className="w-3.5 h-3.5 text-green-600"/>
                    : changeType === "DECREASE" ?
                     <FaArrowDown className="w-3.5 h-3.5 text-red-400"/>
                    : null
                }
                <p className={classNames(changeType === "INCREASE" ? "text-green-600" : "text-red-400", " text-sm ml-1")}>{percentage}</p>
            </div>
            <p className="text-gray-500 text-sm ml-1.5">{timeStamp}</p>
        </div>
    </div>
  )
}

export default DashboardCard