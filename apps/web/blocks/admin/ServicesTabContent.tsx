"use client";

import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@workspace/ui/components/shadcn/form";
import { Input } from "@workspace/ui/components/shadcn/input";
import { Textarea } from "@workspace/ui/components/shadcn/textarea";
import { Separator } from "@workspace/ui/components/shadcn/separator";
import { Button } from "@workspace/ui/components/shadcn/button";
import { Sparkles, Save, Loader2, Plus, Trash2 } from "lucide-react";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { servicesFormSchema, type ServicesFormValues, type SectionTabProps } from "@/lib/zod/cms";

export function ServicesTabContent({ initialData, onSave, isSaving }: SectionTabProps) {
    const form = useForm<ServicesFormValues>({
        resolver: zodResolver(servicesFormSchema),
        defaultValues: { serviceHeading: "", serviceDescription: "", services: [] },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "services",
    });

    useEffect(() => {
        if (initialData?.serviceSection) {
            const s = initialData.serviceSection;
            form.reset({
                serviceHeading: s.heading || "",
                serviceDescription: s.description || "",
                services: s.services?.map((svc: any) => ({
                    id: svc.id || "",
                    title: svc.title || "",
                    description: svc.description || "",
                    imageUrl: svc.imageUrl || "",
                })) || [],
            });
        }
    }, [initialData, form]);

    const onSubmit = (values: ServicesFormValues) => onSave(values);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <SectionHeader icon={Sparkles} title="Services Section" description="Manage the heading, description, and individual service items." />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField control={form.control} name="serviceHeading" render={({ field }) => (
                        <FormItem><FormLabel>Heading</FormLabel><FormControl><Input placeholder="Our Services" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="serviceDescription" render={({ field }) => (
                        <FormItem><FormLabel>Description</FormLabel><FormControl><Input placeholder="What we offer..." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>

                <Separator className="my-2" />

                <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">Service Items ({fields.length})</h4>
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ title: "", description: "", imageUrl: "" })}>
                        <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Service
                    </Button>
                </div>

                <div className="space-y-4">
                    {fields.map((field, index) => (
                        <div key={field.id} className="relative border rounded-lg p-4 bg-muted/30">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-medium text-muted-foreground">
                                    {form.watch(`services.${index}.id`) ? "Existing" : "New"} Service #{index + 1}
                                </span>
                                <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => remove(index)}>
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name={`services.${index}.title`} render={({ field }) => (
                                    <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="Service name" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name={`services.${index}.imageUrl`} render={({ field }) => (
                                    <FormItem><FormLabel>Image URL</FormLabel><ImageUploadField value={field.value || ""} onChange={field.onChange} /><FormMessage /></FormItem>
                                )} />
                            </div>
                            <div className="mt-4">
                                <FormField control={form.control} name={`services.${index}.description`} render={({ field }) => (
                                    <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Describe this service..." rows={2} {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                        </div>
                    ))}
                    {fields.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-6 border border-dashed rounded-lg">No services yet. Click "Add Service" to get started.</p>
                    )}
                </div>

                <div className="flex items-center justify-between pt-4">
                    <p className="text-xs text-muted-foreground">
                        {form.formState.isDirty ? "You have unsaved changes." : "All changes are saved."}
                    </p>
                    <Button type="submit" disabled={isSaving || !form.formState.isDirty} size="sm">
                        {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : <><Save className="mr-2 h-4 w-4" />Save Services</>}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
