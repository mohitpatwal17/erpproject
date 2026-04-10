"use client";

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
    GraduationCap
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const UPCOMING_EXAMS = [
    { subject: "Data Structures", date: "2025-05-15", time: "10:00 AM", room: "Exam Hall A" },
    { subject: "Operating Systems", date: "2025-05-18", time: "10:00 AM", room: "Exam Hall B" },
];

const TOMORROW_CLASSES = [
    { subject: "Data Structures", time: "09:00 AM", room: "LH-101", type: "Lecture" },
    { subject: "DBMS Lab", time: "11:00 AM", room: "LAB-2", type: "Lab" },
    { subject: "Mathematics IV", time: "02:00 PM", room: "LH-103", type: "Lecture" },
];

export function StudentDashboard() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 text-transparent bg-clip-text">
                        Welcome back, Rahul!
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        B.Tech CSE • Semester 4 • Roll No: 2024001
                    </p>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-sm font-medium text-muted-foreground">Current Attendance</p>
                    <p className="text-2xl font-bold text-emerald-600">85%</p>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-violet-500 to-purple-600 text-white border-none shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-violet-100 flex items-center">
                            <Clock className="w-4 h-4 mr-2" /> Next Class
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Data Structures</div>
                        <p className="text-xs text-violet-100 mt-1">09:00 AM • Room LH-101</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                            <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" /> Attendance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600">85%</div>
                        <p className="text-xs text-muted-foreground mt-1">Goal: 75% reached</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                            <AlertCircle className="w-4 h-4 mr-2 text-amber-500" /> Fees Due
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-600">₹25,000</div>
                        <p className="text-xs text-muted-foreground mt-1">Due by 30th Jan</p>
                        <Button variant="link" className="px-0 h-auto text-xs text-amber-600" asChild>
                            <Link href="/dashboard/fees">Pay Now</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-blue-500" /> Exams
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2</div>
                        <p className="text-xs text-muted-foreground mt-1">Upcoming next week</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Schedule Card */}
                <Card className="lg:col-span-2 border-none shadow-md">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center">
                                <CalendarDays className="w-5 h-5 mr-2 text-indigo-500" />
                                Tomorrow's Schedule
                            </CardTitle>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/dashboard/timetable">Full Timetable</Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {TOMORROW_CLASSES.map((cls, index) => (
                                <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-primary/10 p-2 rounded-md text-primary font-bold text-xs w-16 text-center">
                                            {cls.time}
                                        </div>
                                        <div>
                                            <p className="font-semibold">{cls.subject}</p>
                                            <p className="text-xs text-muted-foreground flex items-center">
                                                <span className="bg-secondary px-1.5 py-0.5 rounded text-[10px] mr-2 uppercase tracking-wide">{cls.type}</span>
                                                {cls.room}
                                            </p>
                                        </div>
                                    </div>
                                    <Button size="icon" variant="ghost" className="h-8 w-8">
                                        <BookOpen className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
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
                        <CardDescription>Mid-Semester Evaluations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {UPCOMING_EXAMS.map((exam, index) => (
                                <div key={index} className="border-l-4 border-l-rose-500 bg-rose-50 dark:bg-rose-950/20 p-3 rounded-r-md">
                                    <p className="font-semibold text-rose-900 dark:text-rose-100">{exam.subject}</p>
                                    <div className="flex justify-between mt-2 text-xs text-rose-700 dark:text-rose-300">
                                        <span>{exam.date}</span>
                                        <span>•</span>
                                        <span>{exam.time}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1 text-right">{exam.room}</p>
                                </div>
                            ))}
                            <Button variant="secondary" className="w-full text-xs" asChild>
                                <Link href="/dashboard/exams">View Datesheet</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
