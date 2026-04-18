"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Users,
    GraduationCap,
    CalendarCheck,
    CreditCard,
    Loader2,
    TrendingUp,
    TrendingDown,
    AlertCircle,
    Activity
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export function AdminDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        async function fetchStats(isPolling = false) {
            try {
                // Ensure zero caching by appending a timestamp
                const res = await fetch(`/api/dashboard/stats?_t=${Date.now()}`, { cache: 'no-store' });
                if (!res.ok) throw new Error("Failed to load dashboard metrics");
                const json = await res.json();
                if (isMounted) setData(json);
            } catch (err) {
                if (!isPolling) {
                    console.error("Admin Stats Fetch Error:", err);
                    if (isMounted) setError(err.message);
                }
            } finally {
                if (isMounted && !isPolling) setLoading(false);
            }
        }
        fetchStats();
        
        // Polling every 5 seconds for real-time updates
        const intervalId = setInterval(() => {
            fetchStats(true);
        }, 5000);
        
        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-32 w-full rounded-xl" />
                    ))}
                </div>

            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed rounded-xl p-10 text-center">
                <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                <h3 className="text-xl font-bold">Dashboard Error</h3>
                <p className="text-muted-foreground mb-6">{error}</p>
                <Button onClick={() => window.location.reload()}>Retry Connection</Button>
            </div>
        );
    }

    const stats = data || {
        totalStudents: 0,
        totalFaculty: 0,
        attendancePercent: 0,
        totalFeesCollected: 0,
        totalFeesPending: 0
    };



    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text">
                        Administrative Overview
                    </h2>
                    <p className="text-muted-foreground">
                        Real-time institutional performance insights
                    </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 border border-primary/10 rounded-full text-xs font-semibold text-primary">
                    <Activity className="h-3.5 w-3.5 animate-pulse" />
                    Live System Status
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Students"
                    value={stats.totalStudents.toString()}
                    icon={Users}
                    description="Verified enrollments"
                    trend="+4%"
                    trendUp={true}
                    href="/dashboard/students"
                    className="border-l-4 border-l-blue-500 shadow-sm"
                />
                <StatCard
                    title="Faculty Count"
                    value={stats.totalFaculty.toString()}
                    icon={GraduationCap}
                    description="Active educator staff"
                    trend="Stable"
                    trendUp={true}
                    href="/dashboard/faculty"
                    className="border-l-4 border-l-indigo-500 shadow-sm"
                />
                <StatCard
                    title="Daily Attendance"
                    value={`${stats.attendancePercent}%`}
                    icon={CalendarCheck}
                    description="Institution average today"
                    trend="-2.1%"
                    trendUp={false}
                    href="/dashboard/attendance"
                    className="border-l-4 border-l-emerald-500 shadow-sm"
                />
                <StatCard
                    title="Fee Collection"
                    value={`₹${(stats.totalFeesCollected / 100000).toFixed(1)}L`}
                    icon={CreditCard}
                    description="Net revenue received"
                    trend="+12%"
                    trendUp={true}
                    href="/dashboard/fees"
                    className="border-l-4 border-l-amber-500 shadow-sm"
                />
            </div>


        </div>
    );
}
