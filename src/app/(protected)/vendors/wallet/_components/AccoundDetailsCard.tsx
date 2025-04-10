import AddAccount from '@/app/(protected)/suppliers/wallet/_components/AddAccount';
import { useDisclosure } from '@chakra-ui/react';
import React from 'react'

export default function AccoundDetailsCard() {

  const hasAccountNumber = true;
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {hasAccountNumber ? (
        <div className="flex-1 bg-[#20232D] p-5 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="p-1 rounded-full bg-white">
              <p className="text-gray-600 text-sm font-semibold">
                Chidi Victor
              </p>
            </div>
            <div className="p-1 rounded-full bg-white">
              <p className="text-gray-600 text-sm font-semibold">GT Bank</p>
            </div>
          </div>
          <div className="text-gray-100 mt-8">
            <p className="text-sm mb-2">Payout Account</p>
            <h2 className="text-xl font-semibold">12345***7890</h2>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center bg-primary-50 p-5 rounded-lg">
          <div className="max-w-xs mx-auto text-center">
            <h2 className="text-xl font-medium">Add a bank account</h2>
            <p className="mt-2">
              Add a bank account to enable easy withdrawal of your funds
            </p>
            <button
              onClick={onOpen}
              className="mt-5 bg-primary-500 px-5 py-2 text-white rounded-md"
            >
              Add Account
            </button>
          </div>
        </div>
      )}

      <AddAccount
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  )
}
