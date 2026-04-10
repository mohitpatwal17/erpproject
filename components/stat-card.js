"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";


export function StatCard({
    title,
    value,
    icon: Icon,
    description,
    trend,
    trendUp,
    href,
    className,
}) {
    const router = useRouter();

    const handleClick = () => {
        if (href) {
            router.push(href);
        }
    };

    return (
        <Card
            onClick={handleClick}
            className={cn(
                "hover:shadow-lg transition-all cursor-pointer border-l-4",
                className
            )}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {(description || trend) && (
                    <p className="text-xs text-muted-foreground mt-1">
                        {trend && (
                            <span className={cn("font-medium", trendUp ? "text-emerald-500" : "text-rose-500")}>
                                {trend}
                            </span>
                        )}
                        {" "}
                        {description}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
