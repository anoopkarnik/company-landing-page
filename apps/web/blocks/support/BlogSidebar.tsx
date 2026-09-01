"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { ReactElement, useMemo } from "react";

import {
  blogCategorySlug,
  normalizeBlogCategory,
  sortBlogCategories,
} from "@/lib/blog-categories";
import { useTRPC } from "@/trpc/client";
import { Separator } from "@workspace/ui/components/shadcn/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/shadcn/sidebar";
import { cn } from "@workspace/ui/lib/utils";

const BlogSidebar = (): ReactElement => {
  const pathname = usePathname();
  const { theme } = useTheme();
  const trpc = useTRPC();
  const { data: blog } = useSuspenseQuery(trpc.blog.getBlogInfo.queryOptions());
  const blogCategories = useMemo(
    () => sortBlogCategories(blog.blogs.map((post) => post.Type)),
    [blog],
  );

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border/50 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              href="/"
              className="group flex items-center gap-3 rounded-lg px-2 py-2 font-cyberdyne transition-colors hover:bg-sidebar-accent"
            >
              <div className="relative h-8 w-8 flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                <Image
                  src={theme === "dark" ? blog.darkLogo : blog.logo}
                  alt={blog.title}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div className="hidden flex-col items-start gap-0.5 leading-none lg:flex">
                <span className="text-sm font-bold tracking-wide text-foreground">
                  {blog.title}
                </span>
                <span className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground">
                  Field notes
                </span>
              </div>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(pathname === "/blog" && "bg-sidebar-accent")}
            >
              <Link href="/blog">All insights</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator />
      <SidebarContent className="scrollbar scrollbar-track-secondary scrollbar-thumb-sidebar px-2">
        {blogCategories.map((category) => {
          const categoryDocs = blog.blogs.filter(
            (post) => normalizeBlogCategory(post.Type) === category,
          );
          const categoryPath = `/blog/category/${blogCategorySlug(category)}`;
          return categoryDocs.length > 0 ? (
            <SidebarGroup key={category}>
              <SidebarGroupLabel asChild>
                <Link
                  href={categoryPath}
                  className={cn(
                    "hover:text-primary",
                    pathname === categoryPath && "text-primary",
                  )}
                >
                  {category}
                </Link>
              </SidebarGroupLabel>
              <SidebarMenu>
                {categoryDocs.map((post) => (
                  <SidebarMenuItem key={post.id}>
                    <SidebarMenuButton
                      asChild
                      tooltip={post.Name}
                      className={cn(
                        "cursor-pointer text-xs",
                        pathname === `/blog/${post.slug}` &&
                          "bg-sidebar-accent",
                      )}
                    >
                      <Link href={`/blog/${post.slug}`}>
                        <span className="min-w-0 truncate">{post.Name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          ) : null;
        })}
      </SidebarContent>
    </Sidebar>
  );
};

export default BlogSidebar;
