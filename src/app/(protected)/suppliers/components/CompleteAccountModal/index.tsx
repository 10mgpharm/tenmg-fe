'use client'

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Stack,
    Text,
} from '@chakra-ui/react'

import shield from '../../../../assets/Images/sheild.svg';
import products from '../../../../assets/Images/product.svg';
import inventory from '../../../../assets/Images/inventory.svg';
import withdrawal from '../../../../assets/Images/walllet.svg';
import insight from '../../../../assets/Images/insight.svg';
import Image from 'next/image';

const CompleteAccountModal = ({ isOpen, onClose }: {isOpen: boolean, onClose: () => void}) => {
  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Image src={shield} alt=''className='w-20 h-auto'/>
          </ModalHeader>
          <ModalCloseButton className='text-gray-700'/>
          <ModalBody>
            <Stack>
                <Text>Complete your account setup</Text>
                <p className="text-sm text-gray-500">
                    THIS WILL ENABLE YOU:
                </p>
            </Stack>
            <Stack>
                <ul className='mt-6 space-y-5'>
                    <li className='flex items-center gap-3'>
                        <Image src={products} alt='' className='w-5 h-5'/>
                        <p className='text-gray-600'>Add your products</p>
                    </li>
                    <li className='flex items-center gap-3'>
                        <Image src={inventory} alt='' className='w-5 h-5'/>
                        <p className='text-gray-600'>Track product inventory</p>
                    </li>
                    <li className='flex items-center gap-3'>
                        <Image src={withdrawal} alt='' className='w-5 h-5'/>
                        <p className='text-gray-600'>Withdraw funds</p>
                    </li>
                    <li className='flex items-center gap-3'>
                        <Image src={insight} alt='' className='w-5 h-5'/>
                        <p className='text-gray-600'>View products insight</p>
                    </li>
                </ul>
            </Stack>
          </ModalBody>
          <ModalFooter mt={3} mb={5}>
            <button
                type="button"
                onClick={() => onClose()}
                className="inline-flex w-full justify-center rounded-md bg-primary-500 p-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-400"
            >
                Begin Account Setup
           </button>
          </ModalFooter>
        </ModalContent>
    </Modal>
  )
}

export default CompleteAccountModal;
