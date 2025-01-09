import { CancellationRefundPoliciesPageProps, PrivacyPolicyPageProps } from '@repo/ts-types/landing-page/v1'
import Navbar from '../../../organisms/custom/landing/v1/Navbar'
import CancellationRefundPolicies from '../../../organisms/custom/landing/v1/CancellationRefundPolicies'

const CancellationRefundPoliciesPage = ({routeList,githubLink,githubUsername,githubRepositoryName,title,logo,darkLogo,
    companyName,lastUpdated,websiteUrl,email,donateNowLink}:CancellationRefundPoliciesPageProps) => {
  return (
    <div className='flex flex-col items-center justify-center'>
      <Navbar routeList={routeList} githubLink={githubLink} githubUsername={githubUsername} 
      githubRepositoryName={githubRepositoryName} title={title} logo={logo} darkLogo={darkLogo} donateNowLink={donateNowLink} />
        <CancellationRefundPolicies lastUpdated={lastUpdated} companyName={companyName} siteName={title} 
    websiteUrl={websiteUrl} email={email} />
    </div>
  )
}

export default CancellationRefundPoliciesPage