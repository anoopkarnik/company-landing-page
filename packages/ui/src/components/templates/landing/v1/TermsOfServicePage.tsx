import React from 'react'
import Navbar from '../../../organisms/custom/landing/v1/Navbar'
import { NavbarSectionProps } from '@repo/ts-types/landing-page/navbar'
import { TermsOfServiceProps } from '@repo/ts-types/landing-page/legal'
import TermsOfService from '../../../organisms/custom/landing/v1/TermsOfService'

const TermsOfServicePage = ({navbarSection,termsOfService}:{navbarSection:NavbarSectionProps,termsOfService:TermsOfServiceProps}) => {
  return (
    <div className='flex flex-col items-center justify-center'>
      <Navbar navbarSection={navbarSection}/>
      <TermsOfService termsOfService={termsOfService}/>
    </div>
  )
}

export default TermsOfServicePage