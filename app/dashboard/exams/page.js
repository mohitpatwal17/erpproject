"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Calendar,
    Plus,
    FileText,
    Send,
    MoreHorizontal,
    Trash2,
    Pencil
} from "lucide-react";
import { MOCK_STUDENTS } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const MOCK_EXAMS = [
    { id: 1, name: "Mid Semester Exam", course: "B.Tech CSE", date: "2024-03-15", status: "Completed" },
    { id: 2, name: "End Semester Exam", course: "B.Tech CSE", date: "2024-05-20", status: "Scheduled" },
    { id: 3, name: "Practical Lab Exam", course: "B.Tech ECE", date: "2024-04-10", status: "Scheduled" },
];

export default function ExamsPage() {
    const [marksGiven, setMarksGiven] = useState({});

    const handleMarkChange = (studentId, mark) => {
        setMarksGiven(prev => ({ ...prev, [studentId]: mark }));
    };

    const calculateGrade = (mark) => {
        if (mark >= 90) return "O";
        if (mark >= 80) return "A+";
        if (mark >= 70) return "A";
        if (mark >= 60) return "B+";
        if (mark >= 50) return "B";
        return "F";
    };

    const publishResults = () => {
        toast.success("Results Published Successfully", {
            description: "Students can now view their results in the portal."
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Examinations</h2>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Schedule Exam
                </Button>
            </div>

            <Tabs defaultValue="schedule" className="w-full">
                <TabsList>
                    <TabsTrigger value="schedule">Exam Schedule</TabsTrigger>
                    <TabsTrigger value="results">Results & Marks</TabsTrigger>
                </TabsList>

                <TabsContent value="schedule">
                    <Card>
                        <CardHeader>
                            <CardTitle>Upcoming & Past Exams</CardTitle>
                            <CardDescription>Manage examination schedules.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Exam Name</TableHead>
                                        <TableHead>Course</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {MOCK_EXAMS.map((exam) => (
                                        <TableRow key={exam.id}>
                                            <TableCell className="font-medium">{exam.name}</TableCell>
                                            <TableCell>{exam.course}</TableCell>
                                            <TableCell>{exam.date}</TableCell>
                                            <TableCell>
                                                <Badge variant={exam.status === "Completed" ? "secondary" : "default"}>
                                                    {exam.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="results" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>Enter Marks</CardTitle>
                                    <CardDescription>Enter marks for Mid Semester Exam - B.Tech CSE</CardDescription>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch id="publish-mode" />
                                    <Label htmlFor="publish-mode">Publish Immediately</Label>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">Roll No</TableHead>
                                            <TableHead>Student Name</TableHead>
                                            <TableHead>Marks (Out of 100)</TableHead>
                                            <TableHead>Grade</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {MOCK_STUDENTS.slice(0, 8).map((student) => (
                                            <TableRow key={student.id}>
                                                <TableCell className="font-mono">{student.rollNumber}</TableCell>
                                                <TableCell>{student.name}</TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        max={100}
                                                        min={0}
                                                        className="w-24"
                                                        placeholder="0"
                                                        onChange={(e) => handleMarkChange(student.id, Number(e.target.value))}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {marksGiven[student.id] ? (
                                                        <Badge variant="outline" className="font-bold">
                                                            {calculateGrade(marksGiven[student.id])}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                        <CardContent className="border-t pt-6 bg-muted/10 flex justify-end">
                            <Button onClick={publishResults}>
                                <Send className="mr-2 h-4 w-4" /> Publish Results
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
