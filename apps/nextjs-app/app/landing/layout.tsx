"use client"

import React from 'react'
import {  useGlobalData } from '../../context/DataContext';
import Settings from '@repo/ui/organisms/custom/landing/v1/Settings';


const Layout= ({ children }: { children: React.ReactNode }) => {
  const data = useGlobalData(); // Use global data

  return (
    <div>
      {children}
      <Settings data={data} />
    </div>
  );
};

export default Layout;