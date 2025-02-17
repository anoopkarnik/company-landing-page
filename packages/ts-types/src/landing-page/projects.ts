export interface ProjectProps {
    title: string;
    description: string;
    demo?: string;
    github?: string;
    image?: string;
    notion?: string;
}

export interface ProjectSectionProps {
    projects: ProjectProps[];
    heading: string;
    description: string;
}