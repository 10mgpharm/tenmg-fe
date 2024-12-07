import { Stack } from '@chakra-ui/react'
import { FaSpinner } from 'react-icons/fa6'

const Loader = () => {
  return (
    <Stack my={"10rem"} mx={"auto"}>
        <FaSpinner className='animate-spin w-6 h-6 mx-auto'/>
    </Stack> 
  )
}

export default Loader