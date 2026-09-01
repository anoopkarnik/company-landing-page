export interface BlogsProps {
  title: string;
  logo: string;
  darkLogo: string;
  blogs: BlogProps[];
}

export interface BlogProps {
  id: string;
  Name: string;
  Type: string;
  order: number;
  "Last edited time": string;
  "Created time": string;
  slug: string;
  excerpt: string;
  coverImage: string;
  coverImageAlt: string;
  coverImageCaption: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  ogImageUrl: string;
  tags: string[];
  status: string;
  publishedAt: string | null;
  author: string;
  includeInSitemap: boolean;
  relatedServiceSlugs: string[];
  relatedCaseStudySlugs: string[];
}
