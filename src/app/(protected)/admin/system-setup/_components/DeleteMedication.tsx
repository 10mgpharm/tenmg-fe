import React from 'react'
import ModalComponent from './ModalComponent'
import success from '@public/assets/images/cancel-Icon.svg';
import { Button, Text } from '@chakra-ui/react';
import Image from 'next/image';

const DeleteMedication = (
  { isOpen, onClose, handleDelete, title, isLoading }:
    { isOpen: boolean; onClose: () => void; handleDelete: () => void, title: string, isLoading: boolean }
) => {
  return (
    <ModalComponent isOpen={isOpen} onClose={onClose}>
      <Image src={success} alt='' className='mx-auto mb-2' />
      <Text fontWeight={"semibold"} textAlign={"center"} fontSize={"x-large"}>Remove {title}</Text>
      <Text color={"gray.500"} textAlign={"center"} mt={2}>Are you sure you want to remove this {title}?</Text>
      <div className="my-6 flex flex-col gap-2">
        <Button
          isLoading={isLoading}
          disabled={isLoading}
          loadingText={"Deleting..."}
          onClick={handleDelete}
          bg={"red.500"}
          color={"white"}
          _hover={{
            background: "red"
          }}
          rounded={"md"}
        >
          Yes, Remove
        </Button>
        <Button onClick={onClose} variant={"outline"} rounded={"md"}>
          Cancel
        </Button>
      </div>
    </ModalComponent>
  )
}

export default DeleteMedication;