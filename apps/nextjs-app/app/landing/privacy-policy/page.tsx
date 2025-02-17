import React from 'react';
import PrivacyPolicyPage from '@repo/ui/templates/landing/v1/PrivacyPolicyPage';
import { privacyPolicy } from '../../../lib/constants/legal/privacyPolicy';
import { navbarSection } from '../../../lib/constants/landing-page/navbar';

const page = () => {
  
  return (
    <PrivacyPolicyPage privacyPolicy={privacyPolicy} navbarSection={navbarSection} />
  );
}

export default page;
