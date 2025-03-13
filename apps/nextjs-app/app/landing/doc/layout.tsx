import React from 'react';
import { getCompanyDetails, getDocCategories, getDocs } from '../../_actions/strapi';
import { Alert, AlertDescription, AlertTitle } from '@repo/ui/atoms/shadcn/alert';
import { AlertCircleIcon, InboxIcon } from 'lucide-react';
import DocSidebar from '@repo/ui/organisms/custom/landing/v1/DocSidebar';
import { SidebarProvider, SidebarTrigger } from '@repo/ui/organisms/shadcn/sidebar';

export default async function DocsLayout({ children }: { children: React.ReactNode }) {
    const docs = await getDocs();
    const docCategories = await getDocCategories();
    const companyDetails = await getCompanyDetails();

    // Handle API errors
    if (!docs || !docCategories) {
        return (
            <Alert variant={"destructive"}>
                <AlertCircleIcon className='w-4 h-4'/>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Something went wrong, Please try again later</AlertDescription>
            </Alert>
        );
    }

    // Handle empty docs
    if (docs.length === 0) {
        return (
            <div className='flex flex-col gap-4 h-full items-center'>
                <div className='rounded-full w-20 h-20 flex items-center justify-center'>
                    <InboxIcon size={40} className='stroke-primary'/>
                </div>
                <div className='flex flex-col gap-1 text-center'>
                    <p className='text-emphasized'>No Docs Created Yet</p>
                </div>
            </div> 
        );
    }

    return (
        <div className="flex">
          <SidebarProvider>
            {/* Sidebar */}
            <DocSidebar docs={docs} docCategories={docCategories} navbarSection={companyDetails.navbarSection}/>
            <SidebarTrigger />
            {/* Main Content */}
            <main className="flex-grow p-6">
                {children} {/* This will render the current doc page */}
            </main>
            </SidebarProvider>
        </div>
    );
}
