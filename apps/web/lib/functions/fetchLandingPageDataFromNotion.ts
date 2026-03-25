import { AboutSectionProps, FooterSectionProps, HeroSectionProps, NavbarSectionProps, ProjectSectionProps, ServiceSectionProps, TeamSectionProps, TestimonialSectionProps } from "@/lib/ts-types/landing";
import { queryAllNotionDatabase } from "@workspace/cms/notion/database/queryDatabase";
import { CancellationRefundPoliciesProps, ContactUsProps, PrivacyPolicyProps, TermsOfServiceProps } from "@/lib/ts-types/legal";

export async function fetchLandingPageData(): Promise<any> {
    const landingPageResults = await queryAllNotionDatabase({
        apiToken: process.env.NOTION_API_TOKEN!,
        database_id: process.env.LANDING_DATABASE_ID!,
        filters: [{name: "title", type: "title", condition: "contains", value: process.env.NEXT_PUBLIC_SAAS_NAME!}],
        filter_condition: "and",
        sorts: [],
    })
    const landingPageData = landingPageResults.results[0];
    const navbarSection: NavbarSectionProps = {
        title: landingPageData.title,
        logo: landingPageData.logo?.[0],
        darkLogo: landingPageData.darkLogo?.[0],
        githubLink: landingPageData.githubLink,
        githubUsername: landingPageData.githubUsername?.[0]?.trim(),
        githubRepositoryName: landingPageData.githubRepositoryName?.[0]?.trim(),
        donateNowLink: landingPageData.donateNowLink,
    } 
    
    const [
        serviceSectionResults,
        projectSectionResults,
        testimonialSectionResults,
        teamSectionResults,
        footerSectionResults
    ] = await Promise.all([
        queryAllNotionDatabase({
            apiToken: process.env.NOTION_API_TOKEN!,
            database_id: process.env.SERVICE_DATABASE_ID!,
            filters: [{name: "Landing Page", type: "relation", condition: "contains", value: landingPageData.id}],
            filter_condition: "and",
            sorts: [],
        }),
        queryAllNotionDatabase({
            apiToken: process.env.NOTION_API_TOKEN!,
            database_id: process.env.PRODUCT_DATABASE_ID!,  
            filters: [{name: "Landing Page", type: "relation", condition: "contains", value: landingPageData.id}],
            filter_condition: "and",
            sorts: [],
        }),
        queryAllNotionDatabase({
            apiToken: process.env.NOTION_API_TOKEN!,
            database_id: process.env.TESTIMONIAL_DATABASE_ID!,
            filters: [{name: "Landing Page", type: "relation", condition: "contains", value: landingPageData.id}],
            filter_condition: "and",
            sorts: [],
        }),
        queryAllNotionDatabase({
            apiToken: process.env.NOTION_API_TOKEN!,
            database_id: process.env.TEAM_DATABASE_ID!,
            filters: [{name: "Landing Page", type: "relation", condition: "contains", value: landingPageData.id}],
            filter_condition: "and",
            sorts: [],
        }),
        queryAllNotionDatabase({
            apiToken: process.env.NOTION_API_TOKEN!,
            database_id: process.env.FOOTER_DATABASE_ID!,
            filters: [{name: "Landing Page", type: "relation", condition: "contains", value: landingPageData.id}],
            filter_condition: "and",
            sorts: [],
        })
    ]);

    // Fetch social networks for each team member
    const teamMemberIds = teamSectionResults.results.map((item: any) => item.id);
    const socialNetworkResults = await Promise.all(
        teamMemberIds.map((teamMemberId: string) =>
            queryAllNotionDatabase({
                apiToken: process.env.NOTION_API_TOKEN!,
                database_id: process.env.SOCIAL_NETWORK_DATABASE_ID!,
                filters: [{name: "Team", type: "relation", condition: "contains", value: teamMemberId}],
                filter_condition: "and",
                sorts: [],
            })
        )
    );

    // Build a map of team member ID -> social networks
    const socialNetworksByTeamId: Record<string, {name: string, url: string}[]> = {};
    teamMemberIds.forEach((id: string, index: number) => {
        socialNetworksByTeamId[id] = socialNetworkResults[index].results.map((item: any) => ({
            name: item.Name || item.name,
            url: item.url?.[0]?.trim() || "",
        }));
    });

    const heroSection: HeroSectionProps = {
        tagline: landingPageData.tagline?.[0],
        description: landingPageData.description?.[0],
        appointmentLink: landingPageData.appointmentLink,
        // Optional properties depending on specific implementation
    }

    const aboutSection: AboutSectionProps = {
        heading: "About", // Could be dynamic if added, mapping it static for now as per schema absent
        companyDetails: landingPageData.about?.[0],
        users: landingPageData.users,
        subscribers: landingPageData.subscribers,
        products: landingPageData.products,
        downloads: landingPageData.downloads,
    }

    const serviceSection: ServiceSectionProps = {
        heading: landingPageData.serviceHeading?.[0],
        description: landingPageData.serviceDescription?.[0],
        services: serviceSectionResults.results.map((item:any) => ({
            id: item.id,
            title: item.title,
            description: item.description?.[0],
            imageUrl: item.image?.[0],
        }))
    }

    const projectSection: ProjectSectionProps = {
        heading: landingPageData.productHeading?.[0],
        description: landingPageData.productDescription?.[0],
        projects: projectSectionResults.results.map((item:any) => ({
            id: item.id,
            title: item.Name || "",
            description: item.Description?.[0],
            demoImage: item.Image?.[0],
            type: item.Type,
            openSourceDetails: {
                link: item["Github Link"],
                npmPackageLink: item["Npm Package Link"],
                stars: item["Github Repo Stars"],
                weeklyDownloads: item["Weekly Npm Downloads"],
                weeklyClones: item["Weekly Github Clones"],
            },
            notionDetails: {
                templateLink: item["Notion Template Link"],
                views: item["Notion Views"],
                downloads: item["Notion Downloads"],
                rating: item["Notion Rating"],
            },
            websiteDetails: {
                websiteLink: item["Website Link"],
                websiteViews: item["Website Views"],
                websiteUsers: item["Monthly Active Users"],
            },
            contentDetails: {
                blogLink: "",
                videoLink: item["Youtube Video Link"],
            }
        }))
    }

    const testimonialSection: TestimonialSectionProps = {
        heading: landingPageData.testimonialHeading?.[0],
        description: landingPageData.testimonialDescription?.[0],
        testimonials: testimonialSectionResults.results.map((item:any) => ({
            id: item.id,
            name: item.name,
            userName: item.name, // mapped name as username since original schema lacks it
            position: item.position?.[0],
            comment: item.comment?.[0],
            image: item.image?.[0],
        }))
    }

    const teamSection: TeamSectionProps = {
        heading: landingPageData.teamHeading?.[0],
        description: landingPageData.teamDescription?.[0],
        teamList: teamSectionResults.results.map((item:any) => ({
            id: item.id,
            name: item.Name || item.name,
            position: item.position?.[0],
            description: item.comment?.[0],
            imageUrl: item.image?.[0],
            socialNetworks: socialNetworksByTeamId[item.id] || []
        }))
    }

    const footerSection: FooterSectionProps = {
        title: landingPageData.title,
        logo: landingPageData.logo?.[0],
        darkLogo: landingPageData.darkLogo?.[0],
        creator: landingPageData.creator?.[0],
        creatorLink: landingPageData.creatorLink,
        footerList: footerSectionResults.results.map((item:any) => ({
            id: item.id,
            label: item.title,
            href: item.href?.[0]?.trim(),
            type: item.type,
        }))
    }

    const cancellationRefundPolicies:CancellationRefundPoliciesProps = {
        supportEmailAddress: landingPageData.supportEmailAddress?.[0],
        siteName: landingPageData.title,
        companyLegalName: landingPageData.companyLegalName?.[0],
        websiteUrl: landingPageData.websiteUrl?.[0],
        lastUpdated: landingPageData.lastUpdated?.[0],
    }

    const privacyPolicy:PrivacyPolicyProps = {
        supportEmailAddress: landingPageData.supportEmailAddress?.[0],
        siteName: landingPageData.title,
        companyLegalName: landingPageData.companyLegalName?.[0],
        country: landingPageData.country?.[0],
        websiteUrl: landingPageData.websiteUrl?.[0],
        lastUpdated: landingPageData.lastUpdated?.[0],
    }

    const contactUs: ContactUsProps = {
        supportEmailAddress: landingPageData.supportEmailAddress?.[0],
        companyLegalName: landingPageData.companyLegalName?.[0],
        lastUpdated: landingPageData.lastUpdated?.[0],
        contactNumber: landingPageData.contactNumber?.[0],
        address: landingPageData.address?.[0],
    }

    const termsOfService:TermsOfServiceProps = {
        supportEmailAddress: landingPageData.supportEmailAddress?.[0],
        siteName: landingPageData.title,
        companyLegalName: landingPageData.companyLegalName?.[0],
        country: landingPageData.country?.[0],
        websiteUrl: landingPageData.websiteUrl?.[0],
        lastUpdated: landingPageData.lastUpdated?.[0],
        version: landingPageData.version?.[0],
        address: landingPageData.address?.[0],
    }

    const newsletterSection = {
        heading: landingPageData.newsletterHeading?.[0] || "Subscribe to our Newsletter",
        description: landingPageData.newsletterDescription?.[0] || "Stay updated with our latest features and releases.",
        supportEmailAddress: landingPageData.supportEmailAddress?.[0] || "hello@example.com"
    }

    return {
        navbarSection,
        heroSection,
        aboutSection,
        serviceSection,
        projectSection,
        testimonialSection,
        teamSection,
        footerSection,
        cancellationRefundPolicies,
        privacyPolicy,
        contactUs,
        termsOfService,
        newsletterSection
    }
}