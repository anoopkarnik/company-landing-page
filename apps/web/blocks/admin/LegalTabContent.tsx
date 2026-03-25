"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@workspace/ui/components/shadcn/form";
import { Input } from "@workspace/ui/components/shadcn/input";
import { Separator } from "@workspace/ui/components/shadcn/separator";
import { Button } from "@workspace/ui/components/shadcn/button";
import { ShieldCheck, MapPin, Save, Loader2 } from "lucide-react";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { legalFormSchema, type LegalFormValues, type SectionTabProps } from "@/lib/zod/cms";

export function LegalTabContent({ initialData, onSave, isSaving }: SectionTabProps) {
    const form = useForm<LegalFormValues>({
        resolver: zodResolver(legalFormSchema),
        defaultValues: {
            supportEmailAddress: "", companyLegalName: "", websiteUrl: "",
            country: "", contactNumber: "", address: "", version: "", lastUpdated: "",
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                supportEmailAddress: initialData.contactUs?.supportEmailAddress || "",
                companyLegalName: initialData.contactUs?.companyLegalName || "",
                websiteUrl: initialData.termsOfService?.websiteUrl || "",
                country: initialData.privacyPolicy?.country || "",
                contactNumber: initialData.contactUs?.contactNumber || "",
                address: initialData.contactUs?.address || "",
                version: initialData.termsOfService?.version || "",
                lastUpdated: initialData.contactUs?.lastUpdated || "",
            });
        }
    }, [initialData, form]);

    const onSubmit = (values: LegalFormValues) => onSave(values);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <SectionHeader icon={ShieldCheck} title="Legal & Contact Info" description="Company legal details used in policies, terms, and contact pages." />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField control={form.control} name="companyLegalName" render={({ field }) => (
                        <FormItem><FormLabel>Legal Company Name</FormLabel><FormControl><Input placeholder="My Company Inc." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="supportEmailAddress" render={({ field }) => (
                        <FormItem><FormLabel>Support Email</FormLabel><FormControl><Input type="email" placeholder="support@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="websiteUrl" render={({ field }) => (
                        <FormItem><FormLabel>Website URL</FormLabel><FormControl><Input placeholder="https://mysite.com" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="contactNumber" render={({ field }) => (
                        <FormItem><FormLabel>Contact Number</FormLabel><FormControl><Input placeholder="+1 234 567 890" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>

                <Separator className="my-2" />

                <div className="flex items-center gap-2 mb-4">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-medium text-sm">Location & Versioning</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField control={form.control} name="country" render={({ field }) => (
                        <FormItem><FormLabel>Country</FormLabel><FormControl><Input placeholder="United States" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="address" render={({ field }) => (
                        <FormItem><FormLabel>Address</FormLabel><FormControl><Input placeholder="123 Main St, City" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="version" render={({ field }) => (
                        <FormItem><FormLabel>Policy Version</FormLabel><FormControl><Input placeholder="1.0" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="lastUpdated" render={({ field }) => (
                        <FormItem><FormLabel>Last Updated</FormLabel><FormControl><Input placeholder="2024-01-01" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>

                <div className="flex items-center justify-between pt-4">
                    <p className="text-xs text-muted-foreground">
                        {form.formState.isDirty ? "You have unsaved changes." : "All changes are saved."}
                    </p>
                    <Button type="submit" disabled={isSaving || !form.formState.isDirty} size="sm">
                        {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : <><Save className="mr-2 h-4 w-4" />Save Legal</>}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
