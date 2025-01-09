import React, { useEffect, useState } from 'react'
import { getSessionsAction } from '@repo/server-utils/settings'
import { useSession } from 'next-auth/react'
import SettingsHeading from '../../../molecules/custom/v1/SettingsHeading'
import dayjs from 'dayjs';
import { Button } from '../../../atoms/shadcn/button';

const SessionSettings = () => {
    const [sessions, setSessions] = useState<any[]>([])
    const { data:session } = useSession();
    const title = 'Sessions'
    const description = 'Manage your active sessions'
    useEffect(()=>{
        const getSessions = async () =>{
            const sessions = await getSessionsAction(session?.user?.id as string);
            const modifiedSessions = sessions?.map((session:any) => {  
                const formattedCreatedDate = dayjs(session.createdAt).format('DD MMM YYYY, hh:mm A');
                const formattedUpdatedDate = dayjs(session.updatedAt).format('DD MMM YYYY, hh:mm A'); 
                return {
                    ...session,
                    createdAt: formattedCreatedDate,
                    updatedAt: formattedUpdatedDate
                }
            })
            setSessions(modifiedSessions);
        }
        getSessions();
    },[session])
  return (
    <SettingsHeading title={title} description={description}>
        <div className='flex items-center justify-between border-b-2 pb-2'>
            <div className='text-description'>Device</div>
            <div className='text-description'>Last Login Time</div>
            <div className='text-description'>Location</div>
            <div className='text-description'>Access</div>
        </div>
        {sessions?.map((session:any) => (
            <div key={session.id} className='flex items-center justify-between border-b-2 py-2'>
                <div className='text-description text-white'>{session.device ? session.device : 'Unknown'}</div>
                <div className='text-description text-white'>{session.createdAt}</div>
                <div className='text-description text-white'>{session.location ? session.location: 'Unknown'}</div>
                <Button size='xs' variant='destructive' className='hover:opacity-50'>Revoke</Button>
            </div>
        ))}
    </SettingsHeading>
  )
}

export default SessionSettings