"use client"
import { Switch } from '@repo/ui/molecules/shadcn/switch';
import React from 'react'
import {  useGlobalData } from '../../context/DataContext';


const Layout= ({ children }: { children: React.ReactNode }) => {
  const data = useGlobalData(); // Use global data

  return (
    <div>
      {children}
      <div className='fixed bottom-0 left-0 flex items-center justify-center gap-2 p-4'>
        <Switch onClick={data.handleConstantsType} />
        <p className='text-xs font-light text-gray-500 ml-2'>{data.constantsType}</p>
      </div>
    </div>
  );
};

export default Layout;