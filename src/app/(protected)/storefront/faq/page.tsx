'use client'

import { Loader2, SearchIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { BsDashCircle } from 'react-icons/bs'
import { CiSearch } from 'react-icons/ci'
import { FiPlusCircle } from 'react-icons/fi'
import requestClient from '@/lib/requestClient'
import { useSession } from 'next-auth/react'
import { NextAuthUserSession } from '@/types'
import Image from 'next/image'

export default function FaqPage() {
  const [faqList, setFaqList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;
  const userToken = sessionData?.user?.token;

  useEffect(() => {
    const fetchFaq = async () => {
      setLoading(true)
      try {
        const response = await requestClient({ token: userToken }).get(
          `/storefront/faqs`
        );
        setFaqList(response?.data?.data)
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    }

    fetchFaq();
  }, [userToken])

  // Filter the FAQ list based on the search term
  const filteredFaqList = faqList.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className='flex flex-col gap-4 w-full lg:w-2/3 mx-auto'>
        <div className='flex flex-col gap-4 w-full text-center mt-10'>
          <h3 className='font-semibold text-4xl'>FAQs</h3>
          <p>Need something cleared up? Here are our most frequently asked questions.</p>

          <div className='relative w-fit mx-auto'>
            <CiSearch className='absolute top-1/2 -translate-y-1/2 left-2 text-xl font-semibold' />
            <input
              className='w-96 p-2 ps-8 rounded-md  border '
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {loading ? <div className='w-full h-[50vh] flex items-center justify-center'> <Loader2 /></div> : <div className='mt-10 '>
          {filteredFaqList?.length > 0 ?
            <>
              {filteredFaqList?.map((faq, i) =>
                <FaqCard key={i} faq={faq} />
              )}</>
            : <div className='mx-auto flex flex-col items-center justify-center gap-4'>

              <Image
                src='/assets/images/no-product.jpg'
                alt=''
                width={300}
                height={300}
              />

              <div>
                <p className='text-base my-2 text-center'>Nothing to see yet, checkback later</p>
              </div>
            </div>}
        </div>}

      </div>

    </div>
  )
}

const FaqCard = ({ faq }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      onClick={() => setOpen(!open)}
      className={`my-5 w-full mx-auto flex gap-6 duration-300 rounded-md p-4 cursor-pointer ${open ? 'bg-primary-50 max-h-fit' : 'max-h-fit'
        }`}
    >
      <div>
        {open ? (
          <BsDashCircle className='text-xl duration-300' />
        ) : (
          <FiPlusCircle className='text-xl duration-300' />
        )}
      </div>
      <div className='w-full overflow-y-hidden'>
        <h3 className='font-semibold'>{faq?.question?.charAt(0).toUpperCase() + faq?.question?.slice(1)}</h3>
        <div
          className={`transition-all duration-700 ease-in-out overflow-hidden ${open ? 'max-h-fit translate-y-0' : 'max-h-0 -translate-y-full'
            }`}
        >
          <p className={`pt-2 ease-in-out duration-500 ${open ? 'translate-y-0' : '-translate-y-full text-xs'}`}>
            {faq?.answer}
          </p>
        </div>
      </div>
    </div>
  );
};