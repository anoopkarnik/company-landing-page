"use client"

import React from 'react'
import { useNotificationPolling } from "../hooks/useNotificationPolling";
import { useSession } from 'next-auth/react';

const Home = () => {
  const { data:session} = useSession();
  useNotificationPolling(session?.user?.id || "", 30000);
  return (
    <div>

    </div>
  )
}

export default Home