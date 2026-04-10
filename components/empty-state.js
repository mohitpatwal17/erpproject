"use client";

import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/10 border-dashed animate-in fade-in-50">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <Icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm mb-6">
                {description}
            </p>
            {action && <div>{action}</div>}
        </div>
    );
}
