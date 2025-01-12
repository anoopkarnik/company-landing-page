"use client"
import Navbar from '../../../organisms/custom/landing/v1/Navbar';
import Hero from '../../../organisms/custom/landing/v1/Hero';
import Testimonials from '../../../organisms/custom/landing/v2/Testimonials';
import Footer from '../../../organisms/custom/landing/v1/Footer';
import { LandingPageProps} from '@repo/ts-types/landing-page/v1';
import { Team } from '../../../organisms/custom/landing/v1/Team';
import Projects from '../../../organisms/custom/landing/v1/Projects';
import { Services } from '../../../organisms/custom/landing/v1/Services';
import { Newsletter } from '../../../organisms/custom/landing/v1/Newsletter';
import { About } from '../../../organisms/custom/landing/v1/About';

const LandingPage = ({routeList,githubLink,githubUsername,githubRepositoryName,loginFunction,documentationLink,
  title,logo, darkLogo,tagline,description,testimonials,projectsList, footerList, creator, creatorLink, teamList,
   supportEmailAddress, donateNowLink,downloads,products, 
   users,subscribers, companyDetails, services, createContactAction }: LandingPageProps) => {
    

  return (
    <div className='flex flex-col items-center justify-center'>
      <Navbar routeList={routeList} githubLink={githubLink} githubUsername={githubUsername} 
      githubRepositoryName={githubRepositoryName} title={title} logo={logo} darkLogo={darkLogo} donateNowLink={donateNowLink} />
      <Hero loginFunction={loginFunction} documentationLink={documentationLink} tagline={tagline} description={description} 
      testimonials={testimonials} teamList={teamList} services={services} projects={projectsList}/>
       <About companyDetails={companyDetails} downloads={downloads} products={products} users={users} subscribers={subscribers} />
       <Services services={services || []} />
      <Projects projectsList={projectsList || []} />
      <Testimonials testimonials={testimonials} />
      <Team teamList={teamList} />
      <Newsletter createContactAction={createContactAction} />
      <Footer footerList={footerList} creator={creator} creatorLink={creatorLink} title={title} logo={logo}
       darkLogo={darkLogo} />


    </div>
  );
};

export default LandingPage