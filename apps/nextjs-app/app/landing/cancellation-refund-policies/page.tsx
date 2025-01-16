import React from 'react';
import { companyLegalName, darkLogo, githubLink, githubRepositoryName, githubUsername, lastUpdatedPrivacyPolicy, logo, supportEmailAddress, title, websiteUrl } from '../../../lib/constants/appDetails';
import CancellationRefundPoliciesPage from '@repo/ui/templates/landing/v1/CancellationRefundPoliciesPage';

const page = () => {
    const routeList:any = [];

  return (
    <>
        <CancellationRefundPoliciesPage githubLink={githubLink} githubUsername={githubUsername} 
        githubRepositoryName={githubRepositoryName} title={title} logo={logo} darkLogo={darkLogo} routeList={routeList}
        lastUpdated={lastUpdatedPrivacyPolicy} companyName={companyLegalName} 
        siteName={title} websiteUrl={websiteUrl} email={supportEmailAddress}  />
    </>
  );
}

export default page;
