import React from 'react';
import { companyLegalName, country, darkLogo, githubLink, githubRepositoryName, githubUsername, lastUpdatedPrivacyPolicy, logo, supportEmailAddress, title, websiteUrl } from '../../../lib/constants/appDetails';
import PrivacyPolicyPage from '@repo/ui/templates/landing/v1/PrivacyPolicyPage';

const page = () => {
    const routeList:any = [];

  return (
    <PrivacyPolicyPage githubLink={githubLink} githubUsername={githubUsername} 
    githubRepositoryName={githubRepositoryName} title={title} logo={logo} darkLogo={darkLogo} routeList={routeList}
    lastUpdated={lastUpdatedPrivacyPolicy} companyName={companyLegalName} 
    siteName={title} websiteUrl={websiteUrl} country={country} email={supportEmailAddress}  />
  );
}

export default page;
