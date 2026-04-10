"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, CalendarDays, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const TIMES = ['09:00', '10:00', '11:00', '12:00', '01:00', '02:00', '03:00', '04:00'];

// Mock schedule for Dr. Sarah Wilson
const FACULTY_SCHEDULE = {
    'Mon': {
        '09:00': { subject: 'Data Structures', course: 'CSE - Sem 3', room: 'LH-101', type: 'Lecture', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
        '11:00': { subject: 'Algorithms', course: 'CSE - Sem 4', room: 'LH-102', type: 'Lecture', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
    },
    'Tue': {
        '10:00': { subject: 'Data Structures', course: 'CSE - Sem 3', room: 'LH-101', type: 'Lecture', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
        '02:00': { subject: 'DS Lab', course: 'CSE - Sem 3', room: 'LAB-1', type: 'Lab', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' },
    },
    'Wed': {
        '09:00': { subject: 'Algorithms', course: 'CSE - Sem 4', room: 'LH-102', type: 'Lecture', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
        '01:00': { subject: 'Mentoring', course: 'CSE - Group A', room: 'Cabin', type: 'Lecture', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
    },
    'Thu': {
        '11:00': { subject: 'Data Structures', course: 'CSE - Sem 3', room: 'LH-101', type: 'Lecture', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
    },
    'Fri': {
        '10:00': { subject: 'Algorithms', course: 'CSE - Sem 4', room: 'LH-102', type: 'Lecture', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
        '03:00': { subject: 'Department Meeting', course: 'Staff', room: 'Conf Room', type: 'Lecture', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
    }
};

export default function FacultySchedulePage() {
    // Logic to determine "Next Class" (Mocked for demo)
    const nextClass = FACULTY_SCHEDULE['Mon']['09:00'];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">My Schedule</h2>
                    <p className="text-muted-foreground mt-1">
                        Welcome back, Dr. Sarah Wilson
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-medium text-muted-foreground">Today is</p>
                    <p className="text-xl font-bold">Monday, 24 Jan 2025</p>
                </div>
            </div>

            {/* Next Class Widget */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none shadow-lg col-span-1 md:col-span-2 lg:col-span-1">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-indigo-100 flex items-center">
                            <Clock className="w-4 h-4 mr-2" /> Up Next
                        </CardDescription>
                        <CardTitle className="text-2xl">09:00 AM</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xl font-bold">{nextClass.subject}</h3>
                                <p className="text-indigo-100">{nextClass.course}</p>
                            </div>
                            <div className="flex items-center gap-4 text-sm font-medium text-indigo-50">
                                <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {nextClass.room}
                                </div>
                                <div className="flex items-center">
                                    <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none">
                                        {nextClass.type}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Cards */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Classes Today</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">2</div>
                        <p className="text-xs text-muted-foreground mt-1">4 hours of teaching</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Weekly Load</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">16</div>
                        <p className="text-xs text-muted-foreground mt-1">Hours / Week</p>
                    </CardContent>
                </Card>
            </div>

            {/* Timetable Grid */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center">
                            <CalendarDays className="w-5 h-5 mr-2" />
                            Weekly Timetable
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="relative overflow-x-auto rounded-lg border">
                        {/* Header */}
                        <div className="grid grid-cols-6 border-b bg-muted/50 min-w-[800px]">
                            <div className="p-4 font-medium text-muted-foreground flex items-center justify-center border-r">
                                <Clock className="h-4 w-4" />
                            </div>
                            {DAYS.map(day => (
                                <div key={day} className="p-4 text-center font-bold text-sm border-r last:border-0">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Grid */}
                        <div className="min-w-[800px]">
                            {TIMES.map((time) => (
                                <div key={time} className="grid grid-cols-6 border-b last:border-0 hover:bg-muted/5 transition-colors">
                                    <div className="p-4 text-xs font-mono text-muted-foreground border-r flex items-center justify-center bg-muted/10">
                                        {time}
                                    </div>
                                    {DAYS.map(day => {
                                        const slot = FACULTY_SCHEDULE[day]?.[time];
                                        return (
                                            <div key={`${day}-${time}`} className="p-1 min-h-[100px] border-r last:border-0 relative">
                                                {slot && (
                                                    <div className={cn(
                                                        "h-full rounded-md p-3 text-xs flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow",
                                                        slot.color
                                                    )}>
                                                        <div className="space-y-1">
                                                            <div className="font-bold text-sm truncate" title={slot.subject}>
                                                                {slot.subject}
                                                            </div>
                                                            <div className="text-xs opacity-80 truncate">
                                                                {slot.course}
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-between items-center mt-2 opacity-80 font-medium">
                                                            <div className="flex items-center">
                                                                <MapPin className="w-3 h-3 mr-1" />
                                                                {slot.room}
                                                            </div>
                                                            <div className="uppercase text-[10px] tracking-wider border border-current rounded px-1.5 py-0.5">
                                                                {slot.type}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
