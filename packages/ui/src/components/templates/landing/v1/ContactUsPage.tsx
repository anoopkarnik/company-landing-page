import React from 'react'
import Navbar from '../../../organisms/custom/landing/v1/Navbar'
import { ContactUsPageProps } from '@repo/ts-types/landing-page/v1'
import ContactUs from '../../../organisms/custom/landing/v1/ContactUs'

const ContactUsPage = ({routeList,githubLink,githubUsername,githubRepositoryName,title,logo,darkLogo,
    companyName,lastUpdated,email,address, contactNumber,donateNowLink}:ContactUsPageProps) => {
  return (
    <div className='flex flex-col items-center justify-center'>
      <Navbar routeList={routeList} githubLink={githubLink} githubUsername={githubUsername} 
      githubRepositoryName={githubRepositoryName} title={title} logo={logo} darkLogo={darkLogo} donateNowLink={donateNowLink} />
      <ContactUs lastUpdated={lastUpdated} companyName={companyName} address={address} email={email} contactNumber={contactNumber} />
    </div>
  )
}

export default ContactUsPage