"use server"

import { queryAllNotionDatabase } from "@workspace/cms/notion/database/queryDatabase"
import { HeroSectionProps } from "@repo/ts-types/landing-page/hero"
import { NavbarSectionProps, RouteProps } from "@repo/ts-types/landing-page/navbar"
import { AboutSectionProps } from "@repo/ts-types/landing-page/about"
import { ServiceSectionProps, ServiceProps } from "@repo/ts-types/landing-page/services"
import { ProjectSectionProps, ProjectProps } from "@repo/ts-types/landing-page/projects"
import { TeamSectionProps, TeamProps, SociaNetworksProps } from "@repo/ts-types/landing-page/team"
import { TestimonialSectionProps, TestimonialProps } from "@repo/ts-types/landing-page/testimonials"
import { FooterSectionProps, FooterProps } from "@repo/ts-types/landing-page/footer"
import { faqSectionProps, faqProps } from "@repo/ts-types/landing-page/faq"
import { PricingSectionProps, PricingProps, PopularPlanType } from "@repo/ts-types/landing-page/pricing"
import { FeatureSectionProps, FeatureWithDescriptionProps, FeatureListProps } from "@repo/ts-types/landing-page/features"
import { NewsletterSectionProps } from "@repo/ts-types/landing-page/newsletter"

// --- Config ---
const API_TOKEN = process.env.NOTION_API_TOKEN || ""
const SAAS_NAME = process.env.NEXT_PUBLIC_SAAS_NAME || ""

// --- Normalize key: lowercase and strip whitespace/underscores/hyphens ---
function normalizeKey(key: string): string {
    return key.toLowerCase().replace(/[\s_\-]/g, "")
}

// --- Normalize all keys of a flat result object ---
function normalizeProps(result: Record<string, any>): Record<string, any> {
    const normalized: Record<string, any> = {}
    for (const [key, value] of Object.entries(result)) {
        normalized[normalizeKey(key)] = value
    }
    return normalized
}

// --- Helper to get a value from props using normalized field name ---
function get(props: Record<string, any>, field: string, fallback: any = ""): any {
    return props[normalizeKey(field)] ?? fallback
}

// --- Helper to get first element if value is array, or the value itself ---
function getFirst(value: any): string {
    if (Array.isArray(value) && value.length > 0) return value[0]
    return value || ""
}

// --- Query a Notion database with optional Name filter ---
async function queryDatabase(databaseId: string, filterByName: boolean = true): Promise<any[]> {
    if (!databaseId) return []

    try {
        const filters = filterByName && SAAS_NAME
            ? [{ name: "Name", type: "title", condition: "equals", value: SAAS_NAME }]
            : []

        const response = await queryAllNotionDatabase({
            apiToken: API_TOKEN,
            database_id: databaseId,
            filters,
        })

        return response.results || []
    } catch (error) {
        console.error(`Error querying Notion database ${databaseId}:`, error)
        return []
    }
}

// --- Section Transformers ---

function transformHeroSection(pages: any[]): HeroSectionProps {
    if (pages.length === 0) {
        return { tagline: "", description: "" }
    }
    const p = normalizeProps(pages[0])
    return {
        tagline: get(p, "tagline") || get(p, "title") || get(p, "name"),
        description: get(p, "description"),
        appointmentLink: get(p, "appointmentLink") || get(p, "appointment") || undefined,
        blogLink: get(p, "blogLink") || get(p, "blog") || undefined,
        documentationLink: get(p, "documentationLink") || get(p, "documentation") || undefined,
    }
}

function transformNavbarSection(landingProps: Record<string, any>, navbarPages: any[]): NavbarSectionProps {
    const routeList: RouteProps[] = navbarPages.map(page => {
        const p = normalizeProps(page)
        return {
            href: get(p, "href") || get(p, "link") || get(p, "url") || "#",
            label: get(p, "label") || get(p, "title") || get(p, "name"),
        }
    })

    return {
        routeList,
        githubLink: get(landingProps, "githubLink") || get(landingProps, "github"),
        githubUsername: get(landingProps, "githubUsername"),
        githubRepositoryName: get(landingProps, "githubRepositoryName") || get(landingProps, "githubRepo"),
        title: get(landingProps, "title") || get(landingProps, "name") || SAAS_NAME,
        logo: getFirst(get(landingProps, "logo")),
        darkLogo: getFirst(get(landingProps, "darkLogo") || get(landingProps, "darklogo") || get(landingProps, "logo")),
        donateNowLink: get(landingProps, "donateNowLink") || get(landingProps, "donate") || undefined,
    }
}

function transformAboutSection(landingProps: Record<string, any>): AboutSectionProps {
    return {
        heading: get(landingProps, "aboutHeading") || get(landingProps, "aboutheading") || "About",
        companyDetails: get(landingProps, "companyDetails") || get(landingProps, "aboutDescription") || get(landingProps, "about"),
        users: get(landingProps, "users") || "0",
        subscribers: get(landingProps, "subscribers") || "0",
        products: get(landingProps, "products") || "0",
        downloads: get(landingProps, "downloads") || "0",
    }
}

function transformServiceSection(landingProps: Record<string, any>, servicePages: any[]): ServiceSectionProps {
    const services: ServiceProps[] = servicePages.map(page => {
        const p = normalizeProps(page)
        return {
            title: get(p, "title") || get(p, "name"),
            description: get(p, "description"),
        }
    })

    return {
        heading: get(landingProps, "serviceHeading") || get(landingProps, "serviceheading") || "Services",
        description: get(landingProps, "serviceDescription") || get(landingProps, "servicedescription") || "",
        services,
    }
}

function transformProjectSection(landingProps: Record<string, any>, productPages: any[]): ProjectSectionProps {
    const projects: ProjectProps[] = productPages.map(page => {
        const p = normalizeProps(page)

        const openSourceDetails = (get(p, "githublink") || get(p, "opensourcelink")) ? {
            link: get(p, "githublink") || get(p, "opensourcelink"),
            npmPackageLink: get(p, "npmpackagelink") || get(p, "npm"),
            stars: String(get(p, "stars") || "0"),
            weeklyDownloads: String(get(p, "weeklydownloads") || "0"),
            weeklyClones: String(get(p, "weeklyclones") || "0"),
        } : undefined

        const websiteDetails = get(p, "websitelink") ? {
            websiteLink: get(p, "websitelink"),
            websiteViews: String(get(p, "websiteviews") || "0"),
            websiteUsers: String(get(p, "websiteusers") || "0"),
        } : undefined

        const contentDetails = (get(p, "bloglink") || get(p, "videolink")) ? {
            blogLink: get(p, "bloglink"),
            videoLink: get(p, "videolink"),
        } : undefined

        const notionDetails = get(p, "templatelink") ? {
            templateLink: get(p, "templatelink"),
            views: String(get(p, "notionviews") || get(p, "templateviews") || "0"),
            downloads: String(get(p, "notiondownloads") || get(p, "templatedownloads") || "0"),
            rating: String(get(p, "notionrating") || get(p, "templaterating") || "0"),
        } : undefined

        const techStackMulti = get(p, "techstack", [])
        const techStack = Array.isArray(techStackMulti)
            ? techStackMulti.map((t: string) => ({ title: t }))
            : []

        return {
            title: get(p, "title") || get(p, "name"),
            type: get(p, "type") || undefined,
            description: get(p, "description") || undefined,
            demoImage: getFirst(get(p, "demoimage") || get(p, "image") || get(p, "cover")) || undefined,
            contribution: get(p, "contribution") || undefined,
            featured: get(p, "featured", false),
            techStack: techStack.length > 0 ? techStack : undefined,
            openSourceDetails,
            websiteDetails,
            contentDetails,
            notionDetails,
        }
    })

    return {
        heading: get(landingProps, "projectHeading") || get(landingProps, "productheading") || "Projects",
        description: get(landingProps, "projectDescription") || get(landingProps, "productdescription") || "",
        projects,
    }
}

function transformTeamSection(landingProps: Record<string, any>, teamPages: any[]): TeamSectionProps {
    const socialNetworkKeys = ["linkedin", "twitter", "github", "youtube", "facebook", "instagram", "discord", "website"]

    const teamList: TeamProps[] = teamPages.map(page => {
        const p = normalizeProps(page)

        const socialNetworks: SociaNetworksProps[] = []
        for (const key of socialNetworkKeys) {
            const url = get(p, key)
            if (url) {
                socialNetworks.push({ name: key.charAt(0).toUpperCase() + key.slice(1), url })
            }
        }

        return {
            imageUrl: getFirst(get(p, "imageurl") || get(p, "image") || get(p, "photo") || get(p, "avatar")),
            name: get(p, "name") || get(p, "title"),
            position: get(p, "position") || get(p, "role") || get(p, "jobtitle"),
            description: get(p, "description") || get(p, "bio"),
            socialNetworks,
        }
    })

    return {
        heading: get(landingProps, "teamHeading") || get(landingProps, "teamheading") || "Team",
        description: get(landingProps, "teamDescription") || get(landingProps, "teamdescription") || "",
        teamList,
    }
}

function transformTestimonialSection(landingProps: Record<string, any>, testimonialPages: any[]): TestimonialSectionProps {
    const testimonials: TestimonialProps[] = testimonialPages.map(page => {
        const p = normalizeProps(page)
        return {
            image: getFirst(get(p, "image") || get(p, "photo") || get(p, "avatar")),
            name: get(p, "name") || get(p, "title"),
            userName: get(p, "username") || get(p, "handle"),
            comment: get(p, "comment") || get(p, "description") || get(p, "testimonial") || get(p, "review"),
        }
    })

    return {
        heading: get(landingProps, "testimonialHeading") || get(landingProps, "testimonialheading") || "Testimonials",
        description: get(landingProps, "testimonialDescription") || get(landingProps, "testimonialdescription") || "",
        testimonials,
    }
}

function transformFooterSection(landingProps: Record<string, any>, footerPages: any[]): FooterSectionProps {
    const footerList: FooterProps[] = footerPages.map(page => {
        const p = normalizeProps(page)
        return {
            label: get(p, "label") || get(p, "title") || get(p, "name"),
            href: get(p, "href") || get(p, "link") || get(p, "url"),
            type: get(p, "type") || get(p, "category") || "Follow Us",
        }
    })

    return {
        footerList,
        creator: get(landingProps, "creator"),
        creatorLink: get(landingProps, "creatorLink") || get(landingProps, "creatorlink"),
        title: get(landingProps, "title") || get(landingProps, "name") || SAAS_NAME,
        logo: getFirst(get(landingProps, "logo")),
        darkLogo: getFirst(get(landingProps, "darkLogo") || get(landingProps, "darklogo") || get(landingProps, "logo")),
    }
}

function transformFaqSection(landingProps: Record<string, any>, faqPages: any[]): faqSectionProps {
    const faqList: faqProps[] = faqPages.map((page, index) => {
        const p = normalizeProps(page)
        return {
            question: get(p, "question") || get(p, "title") || get(p, "name"),
            answer: get(p, "answer") || get(p, "description") || get(p, "response"),
            value: get(p, "value") || `item-${index + 1}`,
        }
    })

    return {
        heading: get(landingProps, "faqHeading") || get(landingProps, "faqheading") || "FAQ",
        description: get(landingProps, "faqDescription") || get(landingProps, "faqdescription") || "",
        supportEmailAddress: get(landingProps, "supportEmailAddress") || get(landingProps, "supportemail") || get(landingProps, "email"),
        faqList,
    }
}

function transformPricingSection(landingProps: Record<string, any>, pricingPages: any[]): PricingSectionProps {
    const pricingList: PricingProps[] = pricingPages.map(page => {
        const p = normalizeProps(page)

        const benefitListRaw = get(p, "benefitlist") || get(p, "benefits") || get(p, "features")
        let benefitList: { title: string }[] = []
        if (typeof benefitListRaw === "string" && benefitListRaw) {
            try {
                benefitList = JSON.parse(benefitListRaw)
            } catch {
                benefitList = benefitListRaw.split(",").map((b: string) => ({ title: b.trim() }))
            }
        } else if (Array.isArray(benefitListRaw)) {
            benefitList = benefitListRaw.map((b: string) => ({ title: b }))
        }

        const popularRaw = get(p, "popular", false)
        const popular = popularRaw === true || popularRaw === "Yes" || popularRaw === "yes" || popularRaw === 1
            ? PopularPlanType.YES
            : PopularPlanType.NO

        return {
            title: get(p, "title") || get(p, "name"),
            popular,
            price: String(get(p, "price") || "0"),
            priceType: get(p, "pricetype") || get(p, "billingperiod") || "/month",
            href: get(p, "href") || get(p, "link") || get(p, "url") || "#",
            description: get(p, "description"),
            buttonText: get(p, "buttontext") || get(p, "cta") || "Get Started",
            benefitList,
        }
    })

    return {
        heading: get(landingProps, "pricingHeading") || get(landingProps, "pricingheading") || "Pricing",
        description: get(landingProps, "pricingDescription") || get(landingProps, "pricingdescription") || "",
        supportEmailAddress: get(landingProps, "supportEmailAddress") || get(landingProps, "supportemail") || get(landingProps, "email"),
        pricingList,
    }
}

function transformFeatureSection(landingProps: Record<string, any>, featurePages: any[]): FeatureSectionProps {
    const featuresWithDescription: FeatureWithDescriptionProps[] = []
    const featureList: FeatureListProps[] = []

    featurePages.forEach(page => {
        const p = normalizeProps(page)
        const title = get(p, "title") || get(p, "name")
        const description = get(p, "description")
        const href = get(p, "href") || get(p, "link") || get(p, "url") || undefined

        if (description) {
            featuresWithDescription.push({ title, description, href })
        } else {
            featureList.push({ title })
        }
    })

    return {
        heading: get(landingProps, "featureHeading") || get(landingProps, "featureheading") || "Features",
        description: get(landingProps, "featureDescription") || get(landingProps, "featuredescription") || "",
        featuresWithDescription,
        featureList,
    }
}

function transformNewsletterSection(landingProps: Record<string, any>): NewsletterSectionProps {
    return {
        heading: get(landingProps, "newsletterHeading") || get(landingProps, "newsletterheading") || "Newsletter",
        description: get(landingProps, "newsletterDescription") || get(landingProps, "newsletterdescription") || "",
        supportEmailAddress: get(landingProps, "supportEmailAddress") || get(landingProps, "supportemail") || get(landingProps, "email"),
    }
}

// --- Main Export ---
export async function getNotionCompanyDetails() {
    try {
        const [
            landingPages,
            heroPages,
            servicePages,
            productPages,
            testimonialPages,
            teamPages,
            footerPages,
            faqPages,
            pricingPages,
            featurePages,
            navbarPages,
        ] = await Promise.all([
            queryDatabase(process.env.LANDING_DATABASE_ID || ""),
            queryDatabase(process.env.HERO_DATABASE_ID || ""),
            queryDatabase(process.env.SERVICE_DATABASE_ID || ""),
            queryDatabase(process.env.PRODUCT_DATABASE_ID || ""),
            queryDatabase(process.env.TESTIMONIAL_DATABASE_ID || ""),
            queryDatabase(process.env.TEAM_DATABASE_ID || ""),
            queryDatabase(process.env.FOOTER_DATABASE_ID || ""),
            queryDatabase(process.env.FAQ_DATABASE_ID || ""),
            queryDatabase(process.env.PRICING_DATABASE_ID || ""),
            queryDatabase(process.env.FEATURE_DATABASE_ID || ""),
            queryDatabase(process.env.NAVBAR_DATABASE_ID || ""),
        ])

        const landingProps = landingPages.length > 0 ? normalizeProps(landingPages[0]) : {}

        return {
            navbarSection: transformNavbarSection(landingProps, navbarPages),
            heroSection: transformHeroSection(heroPages),
            aboutSection: transformAboutSection(landingProps),
            featureSection: transformFeatureSection(landingProps, featurePages),
            serviceSection: transformServiceSection(landingProps, servicePages),
            projectSection: transformProjectSection(landingProps, productPages),
            testimonialSection: transformTestimonialSection(landingProps, testimonialPages),
            teamSection: transformTeamSection(landingProps, teamPages),
            faqSection: transformFaqSection(landingProps, faqPages),
            pricingSection: transformPricingSection(landingProps, pricingPages),
            newsletterSection: transformNewsletterSection(landingProps),
            footerSection: transformFooterSection(landingProps, footerPages),
        }
    } catch (error) {
        console.error("Error fetching Notion company details:", error)
        return null
    }
}
