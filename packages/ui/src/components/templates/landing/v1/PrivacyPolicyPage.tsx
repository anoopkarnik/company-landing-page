import React from 'react'
import Navbar from '../../../organisms/custom/landing/v1/Navbar'
import PrivacyPolicy from '../../../organisms/custom/landing/v1/PrivacyPolicy'
import { NavbarSectionProps } from '@repo/ts-types/landing-page/navbar'
import { PrivacyPolicyProps } from '@repo/ts-types/landing-page/legal'

const PrivacyPolicyPage = ({navbarSection,privacyPolicy}:{navbarSection:NavbarSectionProps,privacyPolicy:PrivacyPolicyProps}) => {
  return (
    <div className='flex flex-col items-center justify-center'>
      <Navbar navbarSection={navbarSection}/>
      <PrivacyPolicy privacyPolicy={privacyPolicy}  />
    </div>
  )
}

export default PrivacyPolicyPage