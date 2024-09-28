import { Tag, chakra } from "@chakra-ui/react"

const Essentials = () => {
  return (
    <div>
        <p className="text-medium text-gray-900 leading-6">Azithromycin works by preventing the growth of bacteria.
        It does this by interfering with the bacteria&apos;s protein synthesis, a process essential for their survival and reproduction. This inhibition ultimately leads to the death of the bacteria, allowing the body to heal.</p>
        <div className="mt-4">
            <p className="font-medium text-lg text-gray-800 mb-2">Stock</p>
            <div className="flex items-center gap-12 mb-8">
                <div className="space-y-2">
                    <p className='text-gray-600 text-sm'>Starting Stock</p>
                    <p className='text-gray-700 font-medium'>1900</p>
                </div>
                <div className="space-y-2">
                    <p className='text-gray-600 text-sm'>Current Stock</p>
                    <p className='text-gray-700 font-medium'>100</p>
                </div>
                <div className="space-y-2">
                    <p className='text-gray-600 text-sm'>Stock Status</p>
                    <Tag colorScheme={"green"} borderRadius={"100px"}>
                        <chakra.span>Available</chakra.span>
                    </Tag>
                </div>
            </div>
            <p className="font-medium text-lg text-gray-800 mb-2">Price</p>
            <div className="flex items-center gap-16">
                <div className="space-y-2">
                    <p className='text-gray-600 text-sm'>Price</p>
                    <p className='text-gray-700 font-medium'>#2,000</p>
                </div>
                <div className="space-y-2">
                    <p className='text-gray-600 text-sm'>Commission</p>
                    <p className='text-gray-700 font-medium'>#500</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Essentials