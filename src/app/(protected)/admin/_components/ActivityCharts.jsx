"use client";

import GroupedBarChart from './GroupedBarChart'
import { Select } from '@headlessui/react'
import DonutChart from './DonutChart'

const user = [
    {id: 1, name: "Fubura Dickson", pharmacyName:"Vendor's pharmacy name", amount: "₦300,0000", creditScore: "75%"},
    {id: 1, name: "Fubura Dickson", pharmacyName:"Vendor's pharmacy name", amount: "₦300,0000", creditScore: "15%"},
    {id: 1, name: "Fubura Dickson", pharmacyName:"Vendor's pharmacy name", amount: "₦300,0000", creditScore: "45%"},
    {id: 1, name: "Fubura Dickson", pharmacyName:"Vendor's pharmacy name", amount: "₦300,0000", creditScore: "45%"},
    {id: 1, name: "Fubura Dickson", pharmacyName:"Vendor's pharmacy name", amount: "₦300,0000", creditScore: "45%"},
]

const ActivityCharts = () => {
  return (
    <div className=''>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
            <div className="col-span-6 md:col-span-4">
                <GroupedBarChart />
            </div>
            <div className="col-span-6 md:col-span-2">
                <div className="bg-primary-500 flex items-center flex-col justify-center h-full w-full rounded-lg text-white py-20 md:py-0">
                    <h3 className="text-2xl font-semibold">
                        Store Visitors
                    </h3>
                    <Select className="bg-primary-300 rounded-full px-3 outline-none ring-0 py-1 mt-4" name="status" aria-label="Project status">
                        <option value="active">All Time</option>
                        <option value="paused">Paused</option>
                        <option value="delayed">Delayed</option>
                        <option value="canceled">Canceled</option>
                    </Select>
                    <h1 className="text-6xl font-bold mt-6">
                        102.5k  
                    </h1>
                </div>
            </div>
            <div className="col-span-6 md:col-span-3">
                <DonutChart />
            </div>
            <div className="col-span-6 md:col-span-3 rounded-lg bg-white border w-full h-[420px] overflow-y-auto">
                <div className="flex items-center justify-between p-5 border-b">
                    <p className="font-semibold text-base text-gray-600 md:text-lg">Loan Requests</p>
                    <p className='text-primary-500 text-sm md:text-base font-medium'>See all</p>
                </div>
                <>
                    {user.map((items) => (
                        <div key={items.id} className="border mx-3 sm:mx-5 my-3 p-3 sm:p-4 rounded-sm">
                            <div className="flex items-center h-full">
                                <p className='font-semibold text-sm'>{items.name}</p>
                                <span className="h-[30px] sm:h-[20px] w-[0.5px] border-[0.5px] bg-[#F9F9F9] mx-2" />
                                <p className='font-semibold text-sm'>{items.pharmacyName}</p>
                            </div>
                            <div className="flex items-center justify-between pt-3">
                                <p className='text-sm'>Loan amount: <span className='font-semibold'>{items.amount}</span></p>
                                <p className='text-sm'>Credit Score: <span className={`${
                                    items.creditScore === "75%" ? "text-green-600":
                                    items.creditScore === "45%" ? "text-orange-500": "text-red-600"
                                } font-semibold`}>{items.creditScore}</span></p>
                            </div>
                        </div>
                    ))}
                </>
            </div>
        </div>
    </div>
  )
}

export default ActivityCharts;