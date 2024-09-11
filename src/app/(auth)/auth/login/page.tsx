import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React from 'react'
import LoginForm from '../../components/LoginForm';
import Link from 'next/link';

export default async function LoginPage() {
    const session = await getServerSession(authOptions);
    if (session) {
        redirect(`/`);
    }
  return (
      <section className="md:w-1/2 px-6 md:px-12 lg:px-32 flex items-center">
          <article className="w-full">
              <Image
                  src="/assets/images/tenmg_logo.png"
                  className="md:mb-8"
                  alt="tenmg"
                  width={75}
                  height={75}
              />

              <div className="mb-8">
                  <h3 className="font-normal text-gray-900 text-4xl leading-[44px] tracking-tight mb-3">
                      Welcome back
                  </h3>

                  <p className="text-gray-500 text-base font-normal leading-6 text-left">
                      Please enter your details.
                  </p>
              </div>
              <LoginForm />
              <div className="text-center">
                  <p className="text-gray-500 text-base font-normal leading-6 flex justify-center gap-1">
                      Don&apos;t have an account?
                      <Link href="/signup" className="text-primary-500">
                          Sign up
                      </Link>
                  </p>
              </div>
          </article>
      </section>
  )
}
