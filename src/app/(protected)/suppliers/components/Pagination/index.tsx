import { Button, HStack, Text } from "@chakra-ui/react"
import { ArrowLeft, ArrowRight } from "lucide-react"

const Pagination = () => {
  return (
    <HStack mt={5} justify={"space-between"}>
      <Button h={"30px"} variant={"outline"} shadow={"sm"} borderColor={"gray.300"} px={3} display={"flex"} alignItems={"center"} gap={2}>
        <ArrowLeft className='text-gray-500 w-4 h-auto' />
        <Text className='text-gray-500 text-sm font-medium'>Previous</Text>
      </Button>
      <ul className="flex items-center gap-5">
        <li className="bg-primary-50 py-2 px-4 rounded-md text-primary-600 cursor-pointer">1</li>
        <li className="text-gray-500 cursor-pointer">2</li>
        <li className="text-gray-500 cursor-pointer">3</li>
        <li className="text-gray-500 cursor-pointer">4</li>
        <li className="text-gray-500 cursor-pointer">5</li>
      </ul>
      <Button h={"30px"} variant={"outline"} borderColor={"gray.300"} shadow={"sm"} px={3} display={"flex"} alignItems={"center"} gap={1.5}>
          <Text className='text-gray-500 text-sm font-medium'>Next</Text>
          <ArrowRight className='text-gray-500 w-4 h-auto' />
      </Button>
  </HStack>
  )
}

export default Pagination