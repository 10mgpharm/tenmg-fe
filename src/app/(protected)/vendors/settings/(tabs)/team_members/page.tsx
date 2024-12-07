'use client';

import requestClient from '@/lib/requestClient';
import { NextAuthUserSession, User } from '@/types';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react'
import TeamMembers from '../../_components/TeamMembers';

export default function TeamMembersPage() {
    const session = useSession();
    const sessionData = session?.data?.user as User;
    const sessionToken = session?.data as NextAuthUserSession;
    const token = sessionToken?.user?.token;

    const [allMembersData, setAllMembersData] = useState<any>([]);

    const fetchTeamMembers = useCallback(async () => {
        try {
            const response = await requestClient({ token: token }).get(
                "/vendor/settings/invite"
            );
            if (response.status === 200) {
                setAllMembersData(response.data.data);
            }
        } catch (error) {
            console.error(error);
        }
    }, [token]);


    useEffect(() => {
        fetchTeamMembers();
    }, [fetchTeamMembers]);

    return (
        <TeamMembers
            allMembersData={allMembersData}
            fetchTeamMembers={fetchTeamMembers}
            token={token}
        />
  )
}
