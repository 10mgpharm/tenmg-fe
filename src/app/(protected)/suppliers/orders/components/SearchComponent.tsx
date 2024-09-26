import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import { FaSearch } from 'react-icons/fa'

const SearchComponent = ({placeholder}: {placeholder: string}) => {
  return (
    <InputGroup bg={"white"} w={"300px"}>
        <InputLeftElement pointerEvents='none'>
        <FaSearch className='text-gray-400' />
        </InputLeftElement>
        <Input type='text' placeholder={placeholder} px={10} focusBorderColor='#EAECF0' />
    </InputGroup>
  )
}

export default SearchComponent