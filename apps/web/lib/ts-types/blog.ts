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
}
