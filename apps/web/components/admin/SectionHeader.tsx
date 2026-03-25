import React from "react";
import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
    icon: LucideIcon;
    title: string;
    description: string;
}

export function SectionHeader({ icon: Icon, title, description }: SectionHeaderProps) {
    return (
        <div className="flex items-start gap-3 mb-2">
            <div className="rounded-lg bg-primary/10 p-2">
                <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}
