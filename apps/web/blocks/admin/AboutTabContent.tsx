"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@workspace/ui/components/shadcn/form";
import { Input } from "@workspace/ui/components/shadcn/input";
import { Textarea } from "@workspace/ui/components/shadcn/textarea";
import { Separator } from "@workspace/ui/components/shadcn/separator";
import { Button } from "@workspace/ui/components/shadcn/button";
import { Info, BarChart3, Save, Loader2 } from "lucide-react";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { aboutFormSchema, type AboutFormValues, type SectionTabProps } from "@/lib/zod/cms";

export function AboutTabContent({ initialData, onSave, isSaving }: SectionTabProps) {
    const form = useForm<AboutFormValues>({
        resolver: zodResolver(aboutFormSchema),
        defaultValues: { about: "", users: "", subscribers: "", downloads: "", totalProducts: "" },
    });

    useEffect(() => {
        if (initialData?.aboutSection) {
            const s = initialData.aboutSection;
            form.reset({
                about: s.companyDetails || "",
                users: s.users != null ? String(s.users) : "",
                subscribers: s.subscribers != null ? String(s.subscribers) : "",
                downloads: s.downloads != null ? String(s.downloads) : "",
                totalProducts: s.products != null ? String(s.products) : "",
            }, { keepDefaultValues: false });
        }
    }, [initialData, form]);

    const onSubmit = (values: AboutFormValues) => onSave({
        about: values.about,
        users: values.users ? Number(values.users) : undefined,
        subscribers: values.subscribers ? Number(values.subscribers) : undefined,
        downloads: values.downloads ? Number(values.downloads) : undefined,
        productsCount: values.totalProducts ? Number(values.totalProducts) : undefined,
    } as any);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <SectionHeader icon={Info} title="About Section" description="Company details and statistics shown on the landing page." />
                <FormField control={form.control} name="about" render={({ field }) => (
                    <FormItem><FormLabel>Company Details</FormLabel><FormControl><Textarea placeholder="Tell visitors about your company..." rows={5} {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                <Separator className="my-2" />

                <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-medium text-sm">Statistics</h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    <FormField control={form.control} name="users" render={({ field }) => (
                        <FormItem><FormLabel>Users</FormLabel><FormControl><Input placeholder="10K+" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="subscribers" render={({ field }) => (
                        <FormItem><FormLabel>Subscribers</FormLabel><FormControl><Input placeholder="5K+" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="downloads" render={({ field }) => (
                        <FormItem><FormLabel>Downloads</FormLabel><FormControl><Input placeholder="100K+" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="totalProducts" render={({ field }) => (
                        <FormItem><FormLabel>Products</FormLabel><FormControl><Input placeholder="20+" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>

                <div className="flex items-center justify-between pt-4">
                    <p className="text-xs text-muted-foreground">
                        {form.formState.isDirty ? "You have unsaved changes." : "All changes are saved."}
                    </p>
                    <Button type="submit" disabled={isSaving || !form.formState.isDirty} size="sm">
                        {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : <><Save className="mr-2 h-4 w-4" />Save About</>}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
