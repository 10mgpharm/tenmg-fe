import { authOptions } from '@/lib/auth';
import { getServerSession, Session } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react'

export default async function Page() {
    const session: Session | null = await getServerSession(authOptions);
    if (!session?.user?.email) redirect('/auth/login');
    return (
        <></>
    )
}
