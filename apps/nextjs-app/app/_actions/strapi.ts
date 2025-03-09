"use server"


import axios from 'axios';

export const getCompanyDetails = async () => {
    try{
        let baseUrl = process.env.STRAPI_API_URL || "http://localhost:1337/api/";
        let database = "company-landing-page";
        let populateNavbarSection = "populate[navbarSection][populate]p[0]=routeList"
        let populateHeroSection = "populate[heroSection]=true"
        let populateAboutSection = "populate[aboutSection]=true"
        let populateProjectsSection = "populate[projectSection][populate][projects][populate][0]=websiteDetails&populate[projectSection][populate][projects][populate][1]=notionDetails&populate[projectSection][populate][projects][populate][2]=openSourceDetails&populate[projectSection][populate][projects][populate][3]=techStack"
        let populateServicesSection = "populate[serviceSection][populate][0]=services"
        let populateTeamSection = "populate[teamSection][populate][0]=teamList"
        let populateTestimonialSection = "populate[testimonialSection][populate][0]=testimonials"
        let populateFooterSection = "populate[footerSection][populate][0]=footerList"
        const url = `${baseUrl}${database}?${populateNavbarSection}&${populateHeroSection}&${populateAboutSection}&${populateServicesSection}&${populateTeamSection}&${populateTestimonialSection}&${populateProjectsSection}&${populateFooterSection}`;
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url,
            headers: { 
              'Authorization': "Bearer " +process.env.STRAPI_TOKEN || ""
            }
          };
          const response  = await axios.request(config);
          const result = await response.data;
          return result.data;
    }
    catch(e){
        console.log(e);
        return null;
    }

}     


