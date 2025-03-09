"use client"

import TermsOfServicePage from '@repo/ui/templates/landing/v1/TermsOfServicePage';
import React from 'react';
import { useGlobalData } from '../../../context/DataContext';
import LoadingPage from '@repo/ui/templates/landing/v1/LoadingPage';

const page = () => {
      const data = useGlobalData();
      if (data.isLoading) {
        return (
          <LoadingPage />
        );
      }
  return (
    <TermsOfServicePage termsOfService={data.termsOfServiceState} navbarSection={data.navbarSectionState} />
  );
}

export default page;
