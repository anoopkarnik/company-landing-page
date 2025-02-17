import React from 'react';
import ContactUsPage from '@repo/ui/templates/landing/v1/ContactUsPage';
import { contactUs } from '../../../lib/constants/legal/contactUs';
import { navbarSection } from '../../../lib/constants/landing-page/navbar';

const page = () => {

  return (
    <ContactUsPage contactUs={contactUs} navbarSection={navbarSection} />
  );
}

export default page;
