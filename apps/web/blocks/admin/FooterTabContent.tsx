"use client";

import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@workspace/ui/components/shadcn/form";
import { Input } from "@workspace/ui/components/shadcn/input";
import { Separator } from "@workspace/ui/components/shadcn/separator";
import { Button } from "@workspace/ui/components/shadcn/button";
import { PanelBottom, Save, Loader2, Plus, Trash2 } from "lucide-react";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { footerFormSchema, type FooterFormValues, type SectionTabProps } from "@/lib/zod/cms";

export function FooterTabContent({ initialData, onSave, isSaving }: SectionTabProps) {
    const form = useForm<FooterFormValues>({
        resolver: zodResolver(footerFormSchema),
        defaultValues: { creator: "", creatorLink: "", footer: [] },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "footer",
    });

    useEffect(() => {
        if (initialData?.footerSection) {
            const s = initialData.footerSection;
            form.reset({
                creator: s.creator || "",
                creatorLink: s.creatorLink || "",
                footer: s.footerList?.map((f: any) => ({
                    id: f.id || "",
                    title: f.label || "",
                    href: f.href || "",
                    type: f.type || "",
                })) || [],
            });
        }
    }, [initialData, form]);

    const onSubmit = (values: FooterFormValues) => onSave(values);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <SectionHeader icon={PanelBottom} title="Footer Section" description="Manage the creator info and footer link items." />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField control={form.control} name="creator" render={({ field }) => (
                        <FormItem><FormLabel>Creator Name</FormLabel><FormControl><Input placeholder="Your name" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="creatorLink" render={({ field }) => (
                        <FormItem><FormLabel>Creator Link</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>

                <Separator className="my-2" />

                <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">Footer Links ({fields.length})</h4>
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ title: "", href: "", type: "" })}>
                        <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Link
                    </Button>
                </div>

                <div className="space-y-4">
                    {fields.map((field, index) => (
                        <div key={field.id} className="relative border rounded-lg p-4 bg-muted/30">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-medium text-muted-foreground">
                                    {form.watch(`footer.${index}.id`) ? "Existing" : "New"} Link #{index + 1}
                                </span>
                                <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => remove(index)}>
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField control={form.control} name={`footer.${index}.title`} render={({ field }) => (
                                    <FormItem><FormLabel>Label</FormLabel><FormControl><Input placeholder="Link label" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name={`footer.${index}.href`} render={({ field }) => (
                                    <FormItem><FormLabel>URL</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name={`footer.${index}.type`} render={({ field }) => (
                                    <FormItem><FormLabel>Type</FormLabel><FormControl><Input placeholder="e.g. social, legal" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                        </div>
                    ))}
                    {fields.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-6 border border-dashed rounded-lg">No footer links yet. Click "Add Link" to get started.</p>
                    )}
                </div>

                <div className="flex items-center justify-between pt-4">
                    <p className="text-xs text-muted-foreground">
                        {form.formState.isDirty ? "You have unsaved changes." : "All changes are saved."}
                    </p>
                    <Button type="submit" disabled={isSaving || !form.formState.isDirty} size="sm">
                        {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : <><Save className="mr-2 h-4 w-4" />Save Footer</>}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
