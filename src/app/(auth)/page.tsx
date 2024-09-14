import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { NextAuthUserSession } from '@/types';

export const metadata: Metadata = {
  title: 'Account Selection',
};

export default async function Page() {
  const session: NextAuthUserSession | null = await getServerSession(authOptions);
  if (!session?.user?.email) redirect('/auth/signin');

  switch (session.user?.entityType) {
    case 'SUPPLIER':
      redirect('/suppliers');
    case 'VENDOR':
      redirect('/vendors');
    case 'ADMIN':
      redirect('/admin');
    case 'CUSTOMER_PHARMACY':
      redirect('/storefront');
    default:
      break;
  }

  return (
    <></>
  );
}
