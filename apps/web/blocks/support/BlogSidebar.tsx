"use client"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@workspace/ui/components/shadcn/sidebar';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Separator } from '@workspace/ui/components/shadcn/separator';
import { useTheme } from 'next-themes';
import { ReactElement, useMemo } from 'react';
import { cn } from '@workspace/ui/lib/utils';
import { useSuspenseQuery } from '@tanstack/react-query'
import { useTRPC } from '@/trpc/client'

const BlogSidebar = (): ReactElement => {
    const router = useRouter()
    const pathname = usePathname();
    const { theme } = useTheme();
    const trpc = useTRPC();
    const { data: blog } = useSuspenseQuery(trpc.blog.getBlogInfoFromNotion.queryOptions())
    const blogCategories = useMemo(() => Array.from(new Set(blog.blogs.map(blog => blog.Type))), [blog])
    return (
        <Sidebar>
            <SidebarHeader className='p-4 border-b border-border/50'>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <a
                            rel="noreferrer noopener"
                            href="/"
                            className="flex items-center gap-3 font-cyberdyne px-2 py-2 hover:bg-sidebar-accent rounded-lg transition-colors group"
                        >
                            <div className="relative w-8 h-8 flex-shrink-0 transition-transform group-hover:scale-110 duration-300">
                                {theme === "dark" ?
                                    <Image src={blog?.darkLogo} alt={blog?.title} fill className="object-contain" unoptimized /> :
                                    <Image src={blog?.logo} alt={blog?.title} fill className="object-contain" unoptimized />}
                            </div>
                            <div className="hidden lg:flex flex-col items-start leading-none gap-0.5">
                                <span className="font-bold text-foreground text-sm tracking-wide">{blog?.title}</span>
                                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-sans">Blog</span>
                            </div>
                        </a>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <Separator />
            <SidebarContent className='px-2 scrollbar scrollbar-track-secondary scrollbar-thumb-sidebar '>
                {blogCategories
                    .map((category) => {
                        // Filter docs belonging to this category
                        const categoryDocs = blog.blogs.filter(blog => blog.Type === category);
                        return categoryDocs.length > 0 ? (
                            <SidebarGroup key={category}>
                                <SidebarGroupLabel>{category}</SidebarGroupLabel>
                                <SidebarMenu>

                                    {categoryDocs.map((doc) => (
                                        <SidebarMenuButton asChild tooltip={doc.Name} key={doc.id}
                                            className={cn("cursor-pointer text-xs", pathname === "/blog/" + doc.slug && "bg-sidebar-accent")}
                                            onClick={() => router.push("/blog/" + doc.slug as string)}>

                                            <span>{doc.Name}</span>

                                        </SidebarMenuButton>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroup>
                        ) : null; // Don't render category if it has no docs
                    })
                }
            </SidebarContent>
        </Sidebar>
    );
};

export default BlogSidebar;
