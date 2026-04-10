"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Clock,
    CalendarDays,
    BookOpen,
    AlertCircle,
    CheckCircle2,
    Calendar,
    GraduationCap,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { cn, formatCurrency } from "@/lib/utils";

export function StudentDashboard({ session }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const userName = session?.user?.name || "Student";

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch("/api/dashboard/stats");
                const json = await res.json();
                if (res.ok) {
                    setData(json);
                }
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const { stats, announcements, exams, profile } = data || { 
        stats: { attendancePercentage: 0, totalFeesDue: 0, examCount: 0 },
        announcements: [],
        exams: [],
        profile: { rollNumber: "N/A", course: "N/A", semester: 0 }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 text-transparent bg-clip-text">
                        Welcome back, {userName}!
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        {profile.course} • Semester {profile.semester} • Roll No: {profile.rollNumber}
                    </p>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-sm font-medium text-muted-foreground">Current Attendance</p>
                    <p className={cn(
                        "text-2xl font-bold",
                        stats.attendancePercentage > 75 ? "text-emerald-600" : "text-amber-600"
                    )}>{stats.attendancePercentage}%</p>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-violet-500 to-purple-600 text-white border-none shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-violet-100 flex items-center">
                            <Clock className="w-4 h-4 mr-2" /> Academic Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Good Standing</div>
                        <p className="text-xs text-violet-100 mt-1">Semester {profile.semester} in progress</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                            <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" /> Attendance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600">{stats.attendancePercentage}%</div>
                        <p className="text-xs text-muted-foreground mt-1">Goal: 75% min required</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                            <AlertCircle className="w-4 h-4 mr-2 text-amber-500" /> My Pending Fees
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-600">
                            {formatCurrency(stats.totalFeesDue)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Your Outstanding Balance</p>
                        {stats.totalFeesDue > 0 && (
                            <Button variant="link" className="px-0 h-auto text-xs text-amber-600" asChild>
                                <Link href="/dashboard/fees">Pay Now</Link>
                            </Button>
                        )}
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-blue-500" /> Exams
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.examCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">Upcoming scheduled</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Announcements Card */}
                <Card className="lg:col-span-2 border-none shadow-md">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center">
                                <CalendarDays className="w-5 h-5 mr-2 text-indigo-500" />
                                Notifications
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {announcements.length > 0 ? announcements.map((ann, index) => (
                                <div key={ann.id} className="flex flex-col p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold text-sm">{ann.title}</h4>
                                        <Badge variant={ann.priority === "HIGH" ? "destructive" : "secondary"}>
                                            {ann.priority}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                        {ann.content}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground mt-2">
                                        {new Date(ann.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            )) : (
                                <p className="text-sm text-muted-foreground italic">No new announcements.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Upcoming Exams Card */}
                <Card className="border-none shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <GraduationCap className="w-5 h-5 mr-2 text-rose-500" />
                            Upcoming Exams
                        </CardTitle>
                        <CardDescription>Academic Calendar</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {exams.length > 0 ? exams.map((exam) => (
                                <div key={exam.id} className="border-l-4 border-l-rose-500 bg-rose-50 dark:bg-rose-950/20 p-3 rounded-r-md">
                                    <p className="font-semibold text-rose-900 dark:text-rose-100">{exam.name}</p>
                                    <p className="text-[10px] uppercase font-bold text-rose-600 mb-1">{exam.course.name}</p>
                                    <div className="flex justify-between mt-2 text-xs text-rose-700 dark:text-rose-300">
                                        <span>{new Date(exam.date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-sm text-muted-foreground italic">No upcoming exams.</p>
                            )}
                            <Button variant="secondary" className="w-full text-xs" asChild>
                                <Link href="/dashboard/exams">View Full Schedule</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
