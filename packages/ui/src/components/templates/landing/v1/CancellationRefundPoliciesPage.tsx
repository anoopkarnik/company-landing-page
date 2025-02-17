
import Navbar from '../../../organisms/custom/landing/v1/Navbar'
import CancellationRefundPolicies from '../../../organisms/custom/landing/v1/CancellationRefundPolicies'
import { NavbarSectionProps } from '@repo/ts-types/landing-page/navbar'
import { CancellationRefundPoliciesProps } from '@repo/ts-types/landing-page/legal'

const CancellationRefundPoliciesPage = ({cancellationRefundPolicies,navbarSection}:{
  cancellationRefundPolicies:CancellationRefundPoliciesProps,navbarSection:NavbarSectionProps
}) => {
  return (
    <div className='flex flex-col items-center justify-center'>
      <Navbar navbarSection={navbarSection} />
      <CancellationRefundPolicies cancellationRefundPolicies={cancellationRefundPolicies} />
    </div>
  )
}

export default CancellationRefundPoliciesPage