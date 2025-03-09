"use client"
import React from 'react';
import ContactUsPage from '@repo/ui/templates/landing/v1/ContactUsPage';
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
    <ContactUsPage contactUs={data.contactUsState} navbarSection={data.navbarSectionState} />
  );
}

export default page;
