import React from 'react'
import Navbar from '../../../organisms/custom/landing/v1/Navbar'
import ContactUs from '../../../organisms/custom/landing/v1/ContactUs'
import { NavbarSectionProps } from '@repo/ts-types/landing-page/navbar'
import { ContactUsProps } from '@repo/ts-types/landing-page/legal'

const ContactUsPage = ({contactUs,navbarSection}:{contactUs:ContactUsProps,navbarSection:NavbarSectionProps}) => {
  return (
    <div className='flex flex-col items-center justify-center'>
      <Navbar navbarSection={navbarSection}/>
      <ContactUs contactUs={contactUs}/>
    </div>
  )
}

export default ContactUsPage