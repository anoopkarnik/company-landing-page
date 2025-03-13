"use server"
import React from 'react'
import { getBlogs } from '../../_actions/strapi'
import { Alert, AlertDescription, AlertTitle } from '@repo/ui/atoms/shadcn/alert';
import { AlertCircleIcon, InboxIcon } from 'lucide-react';
import BlogListPage from '@repo/ui/templates/landing/v1/BlogListPage';

export default async function Blogs() {
    const blogs = await getBlogs();
    if (!blogs){
        return (
            <Alert variant={"destructive"}>
                <AlertCircleIcon className='w-4 h-4'/>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Something went wrong, Please try again later</AlertDescription>
            </Alert>
        )
    }
    if (blogs.length === 0){
        return (
            <div className='flex flex-col gap-4 h-full items-center'>
                <div className='rounded-full w-20 h-20 flex items-center justify-center'>
                    <InboxIcon size={40} className='stroke-primary'/>
                </div>
                <div className='flex flex-col gap-1 text-center'>
                    <p className='text-emphasized'>No Blogs Created Youtube</p>

                </div>
            </div> 
        )
    }
    return (
        <BlogListPage blogs={blogs}/>
    )
}