import AddAccount from '@/app/(protected)/suppliers/wallet/_components/AddAccount';
import { BankInfo } from '@/app/(protected)/suppliers/wallet/page';
import requestClient from '@/lib/requestClient';
import { NextAuthUserSession } from '@/types';
import { Button, Tooltip, useDisclosure } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react'
import { FaPenAlt } from 'react-icons/fa';
import { FaPencil } from 'react-icons/fa6';


interface WalletProps {
  currentBalance: string;
  previousBalance: string;
  bankAccount: BankInfo;
}

export default function AccoundDetailsCard(
  { showBalance, setAccountInfo }:
    { showBalance?: boolean, setAccountInfo?: (accountInfo: BankInfo) => void }
) {


  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;
  const [loading, setLoading] = useState(false);
  const [accountDetails, setAccountDetails] = useState<any>();
  const [hasAccountNumber, sethasAccountNumber] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchingWallet = useCallback(async () => {
    setLoading(true);
    try {
      const response = await requestClient({ token }).get(`/vendor/wallet/bank-account`);
      if (response.status === 200) {
        setAccountDetails(response?.data?.data);
        setAccountInfo && setAccountInfo(response?.data?.data);
        sethasAccountNumber(response?.data?.data?.accountNumber ? true : false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetchingWallet();
  }, [token, fetchingWallet]);

  return (
    <>
      {hasAccountNumber ? (
        <div className="flex-1 bg-[#20232D] p-5 rounded-lg">
          <div className="flex items-center justify-between gap-2 group">
            {/* Account Name */}
            <div className="p-2 rounded-full bg-white shadow-md transition-all duration-300 
                  w-1/2">
              <Tooltip isDisabled={accountDetails.accountName.length < 18} label={accountDetails.accountName} placement='top' hasArrow >

                <p className="text-gray-600 text-xs font-semibold text-ellipsis overflow-hidden whitespace-nowrap">
                  {accountDetails?.accountName}
                </p>
              </Tooltip>
            </div>

            {/* Bank Name */}
            <div className="p-2 cursor-pointer flex items-center gap-2 rounded-full bg-white transition-all duration-300 
              w-1/2 overflow-hidden">
              <Tooltip isDisabled={accountDetails.bankName.length < 18} label={accountDetails.bankName} placement='top' hasArrow >
                <p className="text-gray-600 text-xs font-semibold text-ellipsis overflow-hidden whitespace-nowrap">
                  {accountDetails?.bankName}
                </p>
              </Tooltip>
            </div>
          </div>

          <div className='flex items-end justify-between'>
            <div className="text-gray-100 mt-8">
              <p className="text-sm mb-2">Payout Account</p>
              <h2 className="text-xl font-semibold">
                {showBalance ?
                  `${'*'.repeat(7)}${accountDetails?.accountNumber.slice(-3)}`
                  : accountDetails?.accountNumber}

              </h2>
            </div>
            <Button size={"xs"} className="px-2 py-1 rounded-full" style={{ backgroundColor: "#000000" }}
              onClick={onOpen}
            >
              Edit Account
            </Button>
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
        fetchingWallet={fetchingWallet}
        bank={accountDetails}
        endpoint={"vendor/wallet/add-bank-account"}
      />
    </>
  )
}
