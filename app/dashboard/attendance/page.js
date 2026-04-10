"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Calendar as CalendarIcon,
    CheckCircle2,
    XCircle,
    Users,
    Search,
    Download
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn, MOCK_STUDENTS } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function AttendancePage() {
    const [date, setDate] = useState(new Date());
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedSemester, setSelectedSemester] = useState("");

    // Mock State for Attendance Marking
    const [students, setStudents] = useState(
        MOCK_STUDENTS.slice(0, 10).map(s => ({ ...s, isPresent: true }))
    );

    const toggleAttendance = (id) => {
        setStudents(prev => prev.map(s =>
            s.id === id ? { ...s, isPresent: !s.isPresent } : s
        ));
    };

    const markAll = (present) => {
        setStudents(prev => prev.map(s => ({ ...s, isPresent: present })));
    };

    const submitAttendance = () => {
        const presentCount = students.filter(s => s.isPresent).length;
        const absentCount = students.length - presentCount;

        toast.success("Attendance Submitted Successfully", {
            description: `Date: ${format(date, "PPP")} • Present: ${presentCount} • Absent: ${absentCount}`
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Attendance</h2>
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Export Report
                </Button>
            </div>

            <Tabs defaultValue="mark" className="w-full">
                <TabsList>
                    <TabsTrigger value="mark">Mark Attendance</TabsTrigger>
                    <TabsTrigger value="history">View History</TabsTrigger>
                    <TabsTrigger value="report">Reports</TabsTrigger>
                </TabsList>

                <TabsContent value="mark" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Select Class Details</CardTitle>
                            <CardDescription>Choose course, semester and date to mark attendance.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Date</label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !date && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={setDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Course</label>
                                    <Select onValueChange={setSelectedCourse}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Course" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="cse">B.Tech CSE</SelectItem>
                                            <SelectItem value="ece">B.Tech ECE</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Semester</label>
                                    <Select onValueChange={setSelectedSemester}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Semester" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Semester 1</SelectItem>
                                            <SelectItem value="2">Semester 2</SelectItem>
                                            <SelectItem value="3">Semester 3</SelectItem>
                                            <SelectItem value="4">Semester 4</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-end">
                                    <Button className="w-full">Fetch Students</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Student List</CardTitle>
                                <CardDescription>Mark attendance for the selected class.</CardDescription>
                            </div>
                            <div className="flex space-x-2">
                                <Button variant="outline" size="sm" onClick={() => markAll(true)}>Mark All Present</Button>
                                <Button variant="outline" size="sm" onClick={() => markAll(false)}>Mark All Absent</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 font-medium text-sm">
                                    <div className="col-span-1 text-center">No.</div>
                                    <div className="col-span-2">Roll Number</div>
                                    <div className="col-span-4">Student Name</div>
                                    <div className="col-span-3">Status</div>
                                    <div className="col-span-2 text-right">Action</div>
                                </div>
                                <div className="divide-y">
                                    {students.map((student, index) => (
                                        <div key={student.id} className={cn("grid grid-cols-12 gap-4 p-4 items-center text-sm hover:bg-muted/10 transition-colors",
                                            !student.isPresent && "bg-rose-50 dark:bg-rose-950/20"
                                        )}>
                                            <div className="col-span-1 text-center text-muted-foreground">{index + 1}</div>
                                            <div className="col-span-2 font-mono">{student.rollNumber}</div>
                                            <div className="col-span-4 font-medium">{student.name}</div>
                                            <div className="col-span-3">
                                                <Badge variant={student.isPresent ? "default" : "destructive"} className={cn("w-20 justify-center", student.isPresent ? "bg-emerald-600 hover:bg-emerald-700" : "")}>
                                                    {student.isPresent ? "PRESENT" : "ABSENT"}
                                                </Badge>
                                            </div>
                                            <div className="col-span-2 flex justify-end">
                                                <Checkbox
                                                    checked={student.isPresent}
                                                    onCheckedChange={() => toggleAttendance(student.id)}
                                                    className="h-5 w-5"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t p-6 bg-muted/10">
                            <div className="flex gap-4 text-sm font-medium">
                                <div className="flex items-center text-emerald-600">
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Present: {students.filter(s => s.isPresent).length}
                                </div>
                                <div className="flex items-center text-rose-600">
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Absent: {students.filter(s => !s.isPresent).length}
                                </div>
                            </div>
                            <Button size="lg" onClick={submitAttendance}>
                                Submit Attendance
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="history">
                    <Card>
                        <CardHeader>
                            <CardTitle>Attendance History</CardTitle>
                            <CardDescription>View past attendance records.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center p-8 text-muted-foreground">
                                Select a date range to view history.
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
