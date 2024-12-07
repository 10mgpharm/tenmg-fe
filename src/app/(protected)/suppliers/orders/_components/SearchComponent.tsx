import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import { FiSearch } from 'react-icons/fi'

const SearchComponent = ({placeholder}: {placeholder: string}) => {
  return (
    <InputGroup bg={"white"} w={"300px"}>
        <InputLeftElement pointerEvents='none'>
        <FiSearch className='text-gray-400' />
        </InputLeftElement>
        <Input type='text' borderColor={"#D0D5DD"} placeholder={placeholder} px={10} focusBorderColor='#EAECF0' />
    </InputGroup>
  )
}

export default SearchComponent