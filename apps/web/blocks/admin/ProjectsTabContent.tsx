"use client";

import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@workspace/ui/components/shadcn/form";
import { Input } from "@workspace/ui/components/shadcn/input";
import { Textarea } from "@workspace/ui/components/shadcn/textarea";
import { Separator } from "@workspace/ui/components/shadcn/separator";
import { Button } from "@workspace/ui/components/shadcn/button";
import { Package, Save, Loader2, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { projectsFormSchema, type ProjectsFormValues, type SectionTabProps } from "@/lib/zod/cms";

export function ProjectsTabContent({ initialData, onSave, isSaving }: SectionTabProps) {
    const [expandedItems, setExpandedItems] = React.useState<Set<number>>(new Set());

    const form = useForm<ProjectsFormValues>({
        resolver: zodResolver(projectsFormSchema),
        defaultValues: { productHeading: "", productDescription: "", products: [] },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "products",
        keyName: "_formId",
    });

    useEffect(() => {
        if (initialData?.projectSection) {
            const s = initialData.projectSection;
            form.reset({
                productHeading: s.heading || "",
                productDescription: s.description || "",
                products: s.projects?.map((p: any) => ({
                    id: p.id || "",
                    title: p.title || "",
                    description: p.description || "",
                    imageUrl: p.demoImage || "",
                    type: p.type || "",
                    githubLink: p.openSourceDetails?.link || "",
                    npmPackageLink: p.openSourceDetails?.npmPackageLink || "",
                    websiteLink: p.websiteDetails?.websiteLink || "",
                    youtubeVideoLink: p.contentDetails?.videoLink || "",
                    notionTemplateLink: p.notionDetails?.templateLink || "",
                })) || [],
            });
        }
    }, [initialData, form]);

    const toggleExpand = (index: number) => {
        setExpandedItems(prev => {
            const next = new Set(prev);
            if (next.has(index)) next.delete(index); else next.add(index);
            return next;
        });
    };

    const onSubmit = (values: ProjectsFormValues) => onSave(values);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <SectionHeader icon={Package} title="Projects Section" description="Manage the heading, description, and individual project items." />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField control={form.control} name="productHeading" render={({ field }) => (
                        <FormItem><FormLabel>Heading</FormLabel><FormControl><Input placeholder="Our Products" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="productDescription" render={({ field }) => (
                        <FormItem><FormLabel>Description</FormLabel><FormControl><Input placeholder="What we've built..." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>

                <Separator className="my-2" />

                <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">Project Items ({fields.length})</h4>
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ title: "", description: "", imageUrl: "", type: "", githubLink: "", npmPackageLink: "", websiteLink: "", youtubeVideoLink: "", notionTemplateLink: "" })}>
                        <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Project
                    </Button>
                </div>

                <div className="space-y-4">
                    {fields.map((field, index) => (
                        <div key={field._formId} className="relative border rounded-lg bg-muted/30">
                            <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => toggleExpand(index)}>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-muted-foreground">
                                        {form.watch(`products.${index}.id`) ? "Existing" : "New"} Project #{index + 1}
                                    </span>
                                    <span className="text-sm font-medium truncate max-w-[200px]">{form.watch(`products.${index}.title`) || "Untitled"}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); remove(index); }}>
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                    {expandedItems.has(index) ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                                </div>
                            </div>
                            {expandedItems.has(index) && (
                                <div className="px-4 pb-4 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField control={form.control} name={`products.${index}.title`} render={({ field }) => (
                                            <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="Project name" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={form.control} name={`products.${index}.type`} render={({ field }) => (
                                            <FormItem><FormLabel>Type</FormLabel><FormControl><Input placeholder="e.g. Open Source, SaaS" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                    </div>
                                    <FormField control={form.control} name={`products.${index}.description`} render={({ field }) => (
                                        <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Describe the project..." rows={2} {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name={`products.${index}.imageUrl`} render={({ field }) => (
                                        <FormItem><FormLabel>Image URL</FormLabel><ImageUploadField value={field.value || ""} onChange={field.onChange} /><FormMessage /></FormItem>
                                    )} />
                                    <Separator />
                                    <p className="text-xs font-medium text-muted-foreground">Links</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField control={form.control} name={`products.${index}.githubLink`} render={({ field }) => (
                                            <FormItem><FormLabel>GitHub Link</FormLabel><FormControl><Input placeholder="https://github.com/..." {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={form.control} name={`products.${index}.npmPackageLink`} render={({ field }) => (
                                            <FormItem><FormLabel>NPM Package Link</FormLabel><FormControl><Input placeholder="https://npmjs.com/..." {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={form.control} name={`products.${index}.websiteLink`} render={({ field }) => (
                                            <FormItem><FormLabel>Website Link</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={form.control} name={`products.${index}.youtubeVideoLink`} render={({ field }) => (
                                            <FormItem><FormLabel>YouTube Video Link</FormLabel><FormControl><Input placeholder="https://youtube.com/..." {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={form.control} name={`products.${index}.notionTemplateLink`} render={({ field }) => (
                                            <FormItem><FormLabel>Notion Template Link</FormLabel><FormControl><Input placeholder="https://notion.so/..." {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    {fields.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-6 border border-dashed rounded-lg">No projects yet. Click "Add Project" to get started.</p>
                    )}
                </div>

                <div className="flex items-center justify-between pt-4">
                    <p className="text-xs text-muted-foreground">
                        {form.formState.isDirty ? "You have unsaved changes." : "All changes are saved."}
                    </p>
                    <Button type="submit" disabled={isSaving || !form.formState.isDirty} size="sm">
                        {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : <><Save className="mr-2 h-4 w-4" />Save Projects</>}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
