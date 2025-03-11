import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import { FiSearch } from 'react-icons/fi'

const SearchComponent = ({ placeholder, onChange }: { placeholder: string, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
  return (
    <InputGroup bg={"white"} w={"300px"}>
      <InputLeftElement pointerEvents='none'>
        <FiSearch className='text-gray-400' />
      </InputLeftElement>
      <Input type='text' borderColor={"#D0D5DD"} placeholder={placeholder} px={10} focusBorderColor='#EAECF0' onChange={onChange} />
    </InputGroup>
  )
}

export default SearchComponent