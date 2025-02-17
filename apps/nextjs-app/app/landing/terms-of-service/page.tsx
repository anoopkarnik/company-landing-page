import TermsOfServicePage from '@repo/ui/templates/landing/v1/TermsOfServicePage';
import React from 'react';
import { termsOfService } from '../../../lib/constants/legal/termsOfService';
import { navbarSection } from '../../../lib/constants/landing-page/navbar';

const page = () => {

  return (
    <TermsOfServicePage termsOfService={termsOfService} navbarSection={navbarSection} />
  );
}

export default page;
