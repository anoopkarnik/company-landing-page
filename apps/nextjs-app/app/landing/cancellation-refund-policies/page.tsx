import React from 'react';
import CancellationRefundPoliciesPage from '@repo/ui/templates/landing/v1/CancellationRefundPoliciesPage';
import { cancellationRefundPolicies } from '../../../lib/constants/legal/cancellationRefundPolicies';
import { navbarSection } from '../../../lib/constants/landing-page/navbar';

const page = () => {

  return (
    <>
        <CancellationRefundPoliciesPage cancellationRefundPolicies={cancellationRefundPolicies} 
        navbarSection={navbarSection} />
    </>
  );
}

export default page;
