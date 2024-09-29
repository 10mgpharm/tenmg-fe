import { options } from "@/app/(protected)/suppliers/page"
import VisitChart from "./VisitChart"
import ProductSoldChart from "./ProductSoldChart"
import RevenueChart from "./RevenueChart"

const Statistics = () => {
  return (
    <div className="grid grid-cols-1 2xl:grid-cols-2 gap-8 mt-6">
        <div className="flex-1 border p-5 rounded-md">
            <div className="flex items-center justify-between mb-4">
                <div className="">
                    <h3 className="text-gray-600 font-semibold text-lg">Visits</h3>
                    <p className='font-semibold'>10</p>
                </div>
                <select className="border p-2 rounded-lg text-gray-500 outline-none">
                    {
                        options.map((option) => (
                            <option key={option.label} value={option.value} className="text-gray-500">{option.label}</option>
                        ))
                    }
                </select>
            </div>
            <VisitChart />
        </div>
        <div className="flex-1 border p-5 rounded-md">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600 font-semibold text-lg">Products Sold</h3>
                <select className="border p-2 rounded-lg text-gray-500 outline-none">
                    {
                        options.map((option) => (
                            <option key={option.label} value={option.value} className="text-gray-500">{option.label}</option>
                        ))
                    }
                </select>
            </div>
            <ProductSoldChart />
        </div>
        <div className="flex-1 border p-5 rounded-md">
            <div className="flex items-center justify-between mb-4">
                <div className="">
                    <h3 className="text-gray-600 font-semibold text-lg">Revenue</h3>
                    <p className='font-semibold'>#500,000.08</p>
                </div>
                <select className="border p-2 rounded-lg text-gray-500 outline-none">
                    {
                        options.map((option) => (
                            <option key={option.label} value={option.value} className="text-gray-500">{option.label}</option>
                        ))
                    }
                </select>
            </div>
            <RevenueChart />
        </div>
    </div>
  )
}

export default Statistics