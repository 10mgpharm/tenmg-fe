import React from 'react'
import ModalComponent from './ModalComponent'
import success from '@public/assets/images/cancel-Icon.svg';
import { Text } from '@chakra-ui/react';
import Image from 'next/image';

const DeleteMedication = (
    { isOpen, onClose, fetchingMedicationTypes, id}: 
    { isOpen: boolean; onClose: () => void; fetchingMedicationTypes: () => void, id: number}
) => {
  return (
    <ModalComponent isOpen={isOpen} onClose={onClose}>
        <Image src={success} alt='' className='mx-auto mb-2' />
        <Text fontWeight={"semibold"} textAlign={"center"} fontSize={"x-large"}>Remove Medication</Text>
        <Text color={"gray.500"} textAlign={"center"} mt={2}>Are your sure you want to remove this medication type.</Text>
        <div className="my-6 flex flex-col gap-2">
            <button className='bg-red-500 text-white p-3 rounded-md'>Yes, Remove</button>
            <button onClick={onClose} className='border rounded p-3'>Cancel</button>
        </div>
    </ModalComponent>
  )
}

export default DeleteMedication