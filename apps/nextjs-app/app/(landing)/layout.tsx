"use client"

import React, { lazy, Suspense } from 'react'
import {  useGlobalData } from '../../context/DataContext';

const Support = lazy(() => import('@repo/ui/organisms/custom/landing/v1/Support'));

const Layout= ({ children }: { children: React.ReactNode }) => {
  const data = useGlobalData(); // Use global data

  return (
    <div className='relative'>
      {children}
      <Suspense>
        <Support heroSection={data.heroSectionState} footerSection={data.footerSectionState}
        navbarSection={data.navbarSectionState}/>
      </Suspense>
    </div>
  );
};

export default Layout;