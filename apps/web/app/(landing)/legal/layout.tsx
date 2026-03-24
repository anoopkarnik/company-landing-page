"use client"

import NavbarSection from '@/components/landing/NavbarSection';
import React from 'react'


const Layout = ({ children }: { children: React.ReactNode }) => {

  return (
    <div className='relative'>
      <NavbarSection showLandingRoutes={false} />
      {children}
    </div>
  );
};

export default Layout;