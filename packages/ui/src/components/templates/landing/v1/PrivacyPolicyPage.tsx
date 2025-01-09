import React from 'react'
import Navbar from '../../../organisms/custom/landing/v1/Navbar'
import PrivacyPolicy from '../../../organisms/custom/landing/v1/PrivacyPolicy'
import { PrivacyPolicyPageProps } from '@repo/ts-types/landing-page/v1'

const PrivacyPolicyPage = ({routeList,githubLink,githubUsername,githubRepositoryName,title,logo,darkLogo,
    companyName,country,lastUpdated,websiteUrl,email,donateNowLink}:PrivacyPolicyPageProps) => {
  return (
    <div className='flex flex-col items-center justify-center'>
      <Navbar routeList={routeList} githubLink={githubLink} githubUsername={githubUsername} 
      githubRepositoryName={githubRepositoryName} title={title} logo={logo} darkLogo={darkLogo} donateNowLink={donateNowLink} />
        <PrivacyPolicy lastUpdated={lastUpdated} companyName={companyName} siteName={title} 
    websiteUrl={websiteUrl} country={country} email={email}  />
    </div>
  )
}

export default PrivacyPolicyPage