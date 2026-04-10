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
    AlertCircle
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ['#10b981', '#f43f5e'];

export function AdminDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch("/api/dashboard/stats");
                if (!res.ok) throw new Error("Failed to load dashboard metrics");
                const json = await res.json();
                setData(json);
            } catch (err) {
                console.error("Admin Stats Fetch Error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-32 w-full rounded-xl" />
                    ))}
                </div>
                <div className="grid gap-4 md:grid-cols-7">
                    <Skeleton className="col-span-4 h-[400px] rounded-xl" />
                    <Skeleton className="col-span-3 h-[400px] rounded-xl" />
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

    const feeData = [
        { name: 'Collected', value: stats.totalFeesCollected },
        { name: 'Pending', value: stats.totalFeesPending },
    ];

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

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Visualizations */}
                <Card className="lg:col-span-4 border-none shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                             <TrendingUp className="h-5 w-5 text-primary" />
                             Attendance Trend
                        </CardTitle>
                        <CardDescription>Visual distribution of hourly student check-ins</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px] flex items-center justify-center p-6">
                        <div className="flex flex-col items-center text-center space-y-3 p-10 border-2 border-dashed border-muted rounded-2xl w-full">
                            <CalendarCheck className="h-10 w-10 text-muted/30" />
                            <p className="text-sm text-muted-foreground font-medium">
                                Growth tracking will appear here as historic<br/>attendance logs accumulate in the database.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Fees Pie Chart */}
                <Card className="lg:col-span-3 border-none shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-primary" />
                            Revenue Health
                        </CardTitle>
                        <CardDescription>Collection vs Outstanding Dues</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={feeData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        paddingAngle={8}
                                        dataKey="value"
                                    >
                                        {feeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        formatter={(value) => `₹${(Number(value)).toLocaleString()}`}
                                        contentStyle={{ backgroundColor: 'hsl(var(--background))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 p-4 rounded-xl bg-primary/5 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Efficiency</p>
                                <p className="text-xl font-black text-primary">
                                    {Math.round((stats.totalFeesCollected / (stats.totalFeesCollected + stats.totalFeesPending || 1)) * 100)}%
                                </p>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <Activity className="h-4 w-4 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
