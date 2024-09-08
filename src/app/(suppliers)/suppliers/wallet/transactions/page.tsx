import { ArrowLeftIcon } from "@heroicons/react/20/solid"
import { CiFilter, CiSearch } from "react-icons/ci"
import Transaction from "../components/Transaction"

const TransactionUI = () => {
  return (
    <div className="p-8">
        <div className="flex items-center gap-3">
            <ArrowLeftIcon className="w-5 h-5"/>
            <p className="text-lg font-normal">Back</p>
        </div>
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">All Transactions</h2>
            <div className="flex items-center gap-3 mt-5">
                <div className="border border-gray-300 rounded-md flex items-center gap-3 p-3 w-[350px]">
                    <CiSearch className="w-5 h-5" />
                    <input 
                    type="text" 
                    placeholder="Search for transactions" 
                    className="outline-none flex-1 placeholder:text-gray-400 bg-transparent" 
                    />
                </div>
                <div className="border border-gray-300 p-3 rounded-md flex items-center gap-2">
                    <CiFilter className="w-5 h-5" />
                    <p className="text-gray-500 font-medium">Filter</p>
                </div>
            </div>
        </div>
        <div className="mt-4">
            <Transaction />
        </div>
    </div>
  )
}

export default TransactionUI