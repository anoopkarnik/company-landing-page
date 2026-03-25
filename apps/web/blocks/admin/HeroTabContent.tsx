"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@workspace/ui/components/shadcn/form";
import { Input } from "@workspace/ui/components/shadcn/input";
import { Textarea } from "@workspace/ui/components/shadcn/textarea";
import { Button } from "@workspace/ui/components/shadcn/button";
import { Home, Save, Loader2 } from "lucide-react";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { heroFormSchema, type HeroFormValues, type SectionTabProps } from "@/lib/zod/cms";

export function HeroTabContent({ initialData, onSave, isSaving }: SectionTabProps) {
    const form = useForm<HeroFormValues>({
        resolver: zodResolver(heroFormSchema),
        defaultValues: { tagline: "", description: "", appointmentLink: "" },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                tagline: initialData.heroSection?.tagline || "",
                description: initialData.heroSection?.description || "",
                appointmentLink: initialData.heroSection?.appointmentLink || "",
            });
        }
    }, [initialData, form]);

    const onSubmit = (values: HeroFormValues) => onSave(values);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <SectionHeader icon={Home} title="Hero Section" description="Set your main tagline, description, and call-to-action link." />
                <div className="grid grid-cols-1 gap-5">
                    <FormField control={form.control} name="tagline" render={({ field }) => (
                        <FormItem><FormLabel>Tagline</FormLabel><FormControl><Input placeholder="Your catchy tagline..." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="A brief description of your product..." rows={4} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="appointmentLink" render={({ field }) => (
                        <FormItem><FormLabel>Appointment / CTA Link</FormLabel><FormControl><Input placeholder="https://cal.com/..." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>

                <div className="flex items-center justify-between pt-4">
                    <p className="text-xs text-muted-foreground">
                        {form.formState.isDirty ? "You have unsaved changes." : "All changes are saved."}
                    </p>
                    <Button type="submit" disabled={isSaving || !form.formState.isDirty} size="sm">
                        {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : <><Save className="mr-2 h-4 w-4" />Save Hero</>}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
