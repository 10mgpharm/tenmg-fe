import { Checkbox } from '@chakra-ui/react'
import { CalendarIcon } from 'lucide-react'
import React from 'react'
import EmptyCard from '../components/EmptyCard'

const Insight = () => {
  return (
    <div className='p-8 min-h-[calc(100vh-108px)]'>
        <h2 className='text-2xl font-semibold text-gray-700'>Insight</h2>
        <div className="flex items-center justify-between mt-4">
              <div className="">
                  {/* TODO: Check Date Input component */}
                {/* <DateInput
                    className="bg-white border rounded-md placeholder:bg-white"
                    startContent={
                        <>
                        <CalendarIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                        </>
                    }
                /> */}
            </div>
            <div className="flex items-center gap-2">
                <Checkbox>
                    <span className='text-primary-500 underline'>Auto refresh</span>
                </Checkbox>
            </div>
        </div>
        <div className="flex gap-5 mt-6">
            <div className="flex-1 bg-white p-5 rounded-md">
                <h3 className="text-gray-600 font-semibold text-lg">Total Product Sold</h3>
                <EmptyCard/>
            </div>
            <div className="flex-1 bg-white p-5 rounded-md">
                <h3 className="text-gray-600 font-semibold text-lg">Total Revenue</h3>
                <EmptyCard/>
            </div>
            <div className="flex-1 bg-white p-5 rounded-md">
                <h3 className="text-gray-600 font-semibold text-lg">Best selling products</h3>
                <EmptyCard/>
            </div>
        </div>
    </div>
  )
}

export default Insight