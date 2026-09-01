"use client";

import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@workspace/ui/components/shadcn/form";
import { Input } from "@workspace/ui/components/shadcn/input";
import { Textarea } from "@workspace/ui/components/shadcn/textarea";
import { Separator } from "@workspace/ui/components/shadcn/separator";
import { Button } from "@workspace/ui/components/shadcn/button";
import { MessageSquareQuote, Save, Loader2, Plus, Trash2 } from "lucide-react";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { testimonialsFormSchema, type TestimonialsFormValues, type SectionTabProps } from "@/lib/zod/cms";

export function TestimonialsTabContent({ initialData, onSave, isSaving }: SectionTabProps) {
    const form = useForm<TestimonialsFormValues>({
        resolver: zodResolver(testimonialsFormSchema),
        defaultValues: { testimonialHeading: "", testimonialDescription: "", testimonials: [] },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "testimonials",
        keyName: "_formId",
    });

    useEffect(() => {
        if (initialData?.testimonialSection) {
            const s = initialData.testimonialSection;
            form.reset({
                testimonialHeading: s.heading || "",
                testimonialDescription: s.description || "",
                testimonials: s.testimonials?.map((t: any) => ({
                    id: t.id || "",
                    name: t.name || "",
                    position: t.position || "",
                    comment: t.comment || "",
                    imageUrl: t.image || "",
                })) || [],
            });
        }
    }, [initialData, form]);

    const onSubmit = (values: TestimonialsFormValues) => onSave(values);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <SectionHeader icon={MessageSquareQuote} title="Testimonials Section" description="Manage the heading, description, and individual testimonials." />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField control={form.control} name="testimonialHeading" render={({ field }) => (
                        <FormItem><FormLabel>Heading</FormLabel><FormControl><Input placeholder="Testimonials" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="testimonialDescription" render={({ field }) => (
                        <FormItem><FormLabel>Description</FormLabel><FormControl><Input placeholder="What people say..." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>

                <Separator className="my-2" />

                <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">Testimonials ({fields.length})</h4>
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ name: "", position: "", comment: "", imageUrl: "" })}>
                        <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Testimonial
                    </Button>
                </div>

                <div className="space-y-4">
                    {fields.map((field, index) => (
                        <div key={field._formId} className="relative border rounded-lg p-4 bg-muted/30">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-medium text-muted-foreground">
                                    {form.watch(`testimonials.${index}.id`) ? "Existing" : "New"} Testimonial #{index + 1}
                                </span>
                                <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => remove(index)}>
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField control={form.control} name={`testimonials.${index}.name`} render={({ field }) => (
                                    <FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name={`testimonials.${index}.position`} render={({ field }) => (
                                    <FormItem><FormLabel>Position</FormLabel><FormControl><Input placeholder="CEO at Company" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name={`testimonials.${index}.imageUrl`} render={({ field }) => (
                                    <FormItem><FormLabel>Image URL</FormLabel><ImageUploadField value={field.value || ""} onChange={field.onChange} /><FormMessage /></FormItem>
                                )} />
                            </div>
                            <div className="mt-4">
                                <FormField control={form.control} name={`testimonials.${index}.comment`} render={({ field }) => (
                                    <FormItem><FormLabel>Comment</FormLabel><FormControl><Textarea placeholder="Their testimonial..." rows={2} {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                        </div>
                    ))}
                    {fields.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-6 border border-dashed rounded-lg">No testimonials yet. Click "Add Testimonial" to get started.</p>
                    )}
                </div>

                <div className="flex items-center justify-between pt-4">
                    <p className="text-xs text-muted-foreground">
                        {form.formState.isDirty ? "You have unsaved changes." : "All changes are saved."}
                    </p>
                    <Button type="submit" disabled={isSaving || !form.formState.isDirty} size="sm">
                        {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : <><Save className="mr-2 h-4 w-4" />Save Testimonials</>}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
