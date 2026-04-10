"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    CalendarCheck,
    ClipboardList,
    Clock,
    Megaphone,
    ArrowRight,
    Briefcase,
    Loader2,
    CheckCircle2
} from "lucide-react";
import Link from "next/link";

export function FacultyDashboard({ session }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const userName = session?.user?.name || "Professor";

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch("/api/dashboard/stats");
                const json = await res.json();
                if (res.ok) {
                    setData(json);
                }
            } catch (err) {
                console.error("Failed to fetch faculty stats", err);
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

    const { stats, announcements } = data || {
        stats: { classesToday: 0, totalStudents: 0, leaveBalance: 0, pendingTasks: 0 },
        announcements: []
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-pink-600 to-rose-600 text-transparent bg-clip-text">
                        Welcome Back, {userName}
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Professional Faculty Dashboard
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button asChild>
                        <Link href="/dashboard/attendance">
                            <CalendarCheck className="mr-2 h-4 w-4" /> Mark Attendance
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-pink-500 to-rose-600 text-white border-none shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-pink-100 flex items-center">
                            <Clock className="w-4 h-4 mr-2" /> Classes Today
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.classesToday}</div>
                        <p className="text-xs text-pink-100 mt-1">Schedule for today</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                            <Users className="w-4 h-4 mr-2 text-blue-500" /> Dept. Students
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            {stats.totalStudentsDepartment || 0}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">In your department</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                            <Briefcase className="w-4 h-4 mr-2 text-emerald-500" /> Leave Balance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600">{stats.leaveBalance} Days</div>
                        <p className="text-xs text-muted-foreground mt-1">Available for this year</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                            <ClipboardList className="w-4 h-4 mr-2 text-amber-500" /> Pending Tasks
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-600">{stats.pendingTasks}</div>
                        <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Announcements Card */}
                <Card className="col-span-4 border-none shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Megaphone className="w-5 h-5 mr-2 text-indigo-500" />
                            Recent Announcements
                        </CardTitle>
                        <CardDescription>Latest news from the administration</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {announcements.length > 0 ? announcements.map((ann) => (
                                <div key={ann.id} className="p-4 border rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-bold text-sm">{ann.title}</h4>
                                        <Badge variant={ann.priority === "HIGH" ? "destructive" : "outline"}>
                                            {ann.priority}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-2">{ann.content}</p>
                                    <p className="text-[10px] text-muted-foreground italic">Posted: {new Date(ann.createdAt).toLocaleDateString()}</p>
                                </div>
                            )) : (
                                <p className="text-sm text-neutral-500 italic">No announcements found.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Info / Tips Card */}
                <Card className="col-span-3 border-none shadow-md">
                    <CardHeader>
                        <CardTitle>Faculty Resources</CardTitle>
                        <CardDescription>Shortcuts and guides</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                                <p className="text-sm font-medium">Mark Attendance</p>
                                <Button size="sm" variant="ghost" asChild>
                                    <Link href="/dashboard/attendance"><ArrowRight className="h-4 w-4" /></Link>
                                </Button>
                            </div>
                            <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                                <p className="text-sm font-medium">Exam Upload</p>
                                <Button size="sm" variant="ghost" asChild>
                                    <Link href="/dashboard/exams"><ArrowRight className="h-4 w-4" /></Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
