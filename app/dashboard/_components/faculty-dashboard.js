"use client";

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
    Briefcase
} from "lucide-react";
import Link from "next/link";

const PENDING_TASKS = [
    { id: 1, title: "Mark Attendance for CSE-A", urgent: true, action: "Mark Now", href: "/dashboard/attendance" },
    { id: 2, title: "Upload Marks for Networking Quiz", urgent: false, action: "Upload", href: "/dashboard/exams" },
    { id: 3, title: "Approve Leave Request: Amit Singh", urgent: false, action: "Review", href: "/dashboard/leaves" },
];

const TODAY_CLASSES = [
    { time: "09:00 - 10:00", subject: "Data Structures", class: "CSE - Sem 3", room: "LH-101", status: "Done" },
    { time: "11:00 - 12:00", subject: "Algorithms", class: "CSE - Sem 4", room: "LH-102", status: "Upcoming" },
    { time: "02:00 - 04:00", subject: "DS Lab", class: "CSE - Sem 3", room: "LAB-1", status: "Upcoming" },
];

export function FacultyDashboard() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-pink-600 to-rose-600 text-transparent bg-clip-text">
                        Welcome Back, Dr. Wilson
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Department of Computer Science
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
                        <div className="text-3xl font-bold">3</div>
                        <p className="text-xs text-pink-100 mt-1">4 Hours of Teaching</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                            <Users className="w-4 h-4 mr-2 text-blue-500" /> Students
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">120</div>
                        <p className="text-xs text-muted-foreground mt-1">Across 3 courses</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                            <Briefcase className="w-4 h-4 mr-2 text-emerald-500" /> Leave Balance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600">8 CL</div>
                        <p className="text-xs text-muted-foreground mt-1">5 SL remaining</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                            <ClipboardList className="w-4 h-4 mr-2 text-amber-500" /> Pending Tasks
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-600">3</div>
                        <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Schedule Feed */}
                <Card className="col-span-4 border-none shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <CalendarCheck className="w-5 h-5 mr-2 text-indigo-500" />
                            Today's Schedule
                        </CardTitle>
                        <CardDescription>Your teaching timeline for today</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 dark:before:via-slate-700 before:to-transparent">
                            {TODAY_CLASSES.map((cls, index) => (
                                <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-emerald-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                        {index === 0 ? <CheckCircle2 className="w-5 h-5 text-white" /> : <Clock className="w-5 h-5 text-white" />}
                                    </div>
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-200 shadow bg-white dark:bg-slate-900 dark:border-slate-800">
                                        <div className="flex items-center justify-between space-x-2 mb-1">
                                            <div className="font-bold text-slate-900 dark:text-slate-100">{cls.subject}</div>
                                            <time className="font-caveat font-medium text-indigo-500 text-xs">{cls.time}</time>
                                        </div>
                                        <div className="text-slate-500 dark:text-slate-400 text-xs">
                                            {cls.class} • {cls.room}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Tasks List */}
                <Card className="col-span-3 border-none shadow-md">
                    <CardHeader>
                        <CardTitle>Action Items</CardTitle>
                        <CardDescription>Tasks requiring your input</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {PENDING_TASKS.map((task) => (
                                <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium leading-none">{task.title}</p>
                                            {task.urgent && <span className="flex h-2 w-2 rounded-full bg-rose-500" />}
                                        </div>
                                    </div>
                                    <Button size="sm" variant="secondary" className="text-xs h-8" asChild>
                                        <Link href={task.href}>{task.action}</Link>
                                    </Button>
                                </div>
                            ))}
                            <div className="pt-4 border-t">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Megaphone className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">Department Meeting at 3 PM</p>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-xs">Details</Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

import { CheckCircle2 } from "lucide-react";
