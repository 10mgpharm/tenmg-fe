import AddAccount from '@/app/(protected)/suppliers/wallet/_components/AddAccount';
import { BankInfo } from '@/app/(protected)/suppliers/wallet/page';
import requestClient from '@/lib/requestClient';
import { NextAuthUserSession } from '@/types';
import { Button, useDisclosure } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react'


interface WalletProps {
  currentBalance: string;
  previousBalance: string;
  bankAccount: BankInfo;
}

export default function AccoundDetailsCard({ showBalance, setAccountInfo }: { showBalance?: boolean, setAccountInfo?: (accountInfo: BankInfo) => void }) {

  // const hasAccountNumber = false;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;
  const [accountDetails, setAccountDetails] = useState<any>();
  const [hasAccountNumber, sethasAccountNumber] = useState(false);
  const [loading, setLoading] = useState(false);

  // console.log("accountDetails", accountDetails);

  const fetchingWallet = useCallback(async () => {
    setLoading(true);
    try {
      const response = await requestClient({ token }).get(`/vendor/wallet/bank-account`);
      if (response.status === 200) {
        setAccountDetails(response?.data?.data);
        setAccountInfo && setAccountInfo(response?.data?.data);
        sethasAccountNumber(response?.data?.data?.accountNumber ? true : false);
        // console.log(response?.data?.data);
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
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-full bg-white">
              <p className="text-gray-600 text-sm font-semibold">
                {/* truncates the text if it is longer than 10 letters */}
                {accountDetails?.accountName}
              </p>
            </div>
            <div className="p-2 rounded-full bg-white">
              <p className="text-gray-600 text-sm font-semibold">{accountDetails?.bankName?.length > 6 ? `${accountDetails?.bankName.slice(0, 10)}...` : accountDetails?.bankName}</p>
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
            {/* <div className="flex justify-between mt-5"> */}
            <Button size={"xs"} className="px-2 py-1" style={{ backgroundColor: "#000000cf" }}
              onClick={onOpen}
            >Edit Account</Button>
            {/* </div> */}
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
        // banks={[]}   
        info={accountDetails}
        endpoint={"vendor/wallet/add-bank-account"}
      />
    </>
  )
}
