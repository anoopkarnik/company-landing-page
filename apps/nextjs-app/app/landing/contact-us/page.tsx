import React from 'react';
import { address, companyName, darkLogo, githubLink, githubRepositoryName, githubUsername,
   lastUpdatedPrivacyPolicy, logo, supportEmailAddress, title,
   contactNumber} from '../../../lib/constants/appDetails';
import ContactUsPage from '@repo/ui/templates/landing/v1/ContactUsPage';

const page = () => {
    const routeList:any = [];

  return (
    <ContactUsPage githubLink={githubLink} githubUsername={githubUsername} 
    githubRepositoryName={githubRepositoryName} title={title} logo={logo} darkLogo={darkLogo} routeList={routeList}
    lastUpdated={lastUpdatedPrivacyPolicy} companyName={companyName} email={supportEmailAddress} 
    address={address} contactNumber={contactNumber} />
  );
}

export default page;
