"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle2, XCircle, Clock, Search, Download, Loader2, Save, Filter } from "lucide-react";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AttendancePage() {
    const { data: session } = useSession();
    const [date, setDate] = useState(new Date());
    const [course, setCourse] = useState("");
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [attendance, setAttendance] = useState({}); // { studentId: "PRESENT" | "ABSENT" }
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    const userRole = session?.user?.role;

    // Fetch students for marking
    const fetchStudents = async () => {
        if (!course) {
            toast.error("Please select a course first");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`/api/students?course=${course}`);
            if (res.ok) {
                const data = await res.json();
                setStudents(data);
                // Initialize all as present
                const initialAttendance = {};
                data.forEach(s => initialAttendance[s.id] = "PRESENT");
                setAttendance(initialAttendance);
            }
        } catch (error) {
            toast.error("Failed to fetch students");
        } finally {
            setLoading(false);
        }
    };

    // Fetch attendance history
    const fetchHistory = async () => {
        setHistoryLoading(true);
        try {
            const res = await fetch(`/api/attendance${course ? `?course=${course}` : ""}`);
            if (res.ok) {
                const data = await res.json();
                setHistory(data);
            }
        } catch (error) {
            toast.error("Failed to load history");
        } finally {
            setHistoryLoading(false);
        }
    };

    useEffect(() => {
        if (session) {
            fetchHistory();
        }
    }, [session, course]);

    const handleStatusChange = (studentId, status) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }));
    };

    const submitAttendance = async () => {
        if (!course || students.length === 0) return;
        setSaving(true);
        try {
            const records = Object.entries(attendance).map(([studentId, status]) => ({
                studentId,
                status
            }));
            const res = await fetch("/api/attendance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    date: date.toISOString(),
                    course,
                    semester: students[0]?.semester || 1,
                    records
                })
            });
            if (res.ok) {
                toast.success("Attendance recorded successfully");
                fetchHistory();
            } else {
                toast.error("Failed to save records");
            }
        } catch (error) {
            toast.error("Network error");
        } finally {
            setSaving(false);
        }
    };

    const exportCSV = () => {
        if (history.length === 0) return;
        const headers = "Date,Student,Roll Number,Course,Status\n";
        const rows = history.map(h => 
            `${format(new Date(h.date), 'yyyy-MM-dd')},${h.student.user.name},${h.student.rollNumber},${h.course},${h.status}`
        ).join("\n");
        const blob = new Blob([headers + rows], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `attendance-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
        a.click();
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black tracking-tight">Attendance Management</h2>
                    <p className="text-muted-foreground">Track and monitor student presence across courses</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={exportCSV} disabled={history.length === 0}>
                        <Download className="mr-2 h-4 w-4" /> Export Report
                    </Button>
                </div>
            </div>

            <Tabs defaultValue={userRole === "STUDENT" ? "history" : "mark"} className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                    {userRole !== "STUDENT" && <TabsTrigger value="mark">Mark Attendance</TabsTrigger>}
                    <TabsTrigger value="history">History Log</TabsTrigger>
                </TabsList>

                <TabsContent value="mark" className="space-y-6 mt-6">
                    <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>Daily Register</CardTitle>
                            <CardDescription>Select course and date to begin marking</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap items-end gap-4 mb-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Course / Department</label>
                                    <Select value={course} onValueChange={setCourse}>
                                        <SelectTrigger className="w-[250px] h-11 bg-background/50">
                                            <SelectValue placeholder="Select Course" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="B.Tech CSE">B.Tech CSE</SelectItem>
                                            <SelectItem value="B.Tech ECE">B.Tech ECE</SelectItem>
                                            <SelectItem value="B.Tech ME">B.Tech ME</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Attendance Date</label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className={`w-[200px] h-11 justify-start text-left font-normal bg-background/50 ${!date && "text-muted-foreground"}`}>
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <Button onClick={fetchStudents} disabled={!course || loading} className="h-11 px-8 shadow-lg shadow-primary/20">
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                                    Fetch Registry
                                </Button>
                            </div>

                            {students.length > 0 ? (
                                <div className="space-y-6">
                                    <div className="rounded-2xl border bg-background/30 overflow-hidden">
                                        <Table>
                                            <TableHeader className="bg-muted/50">
                                                <TableRow>
                                                    <TableHead className="w-[150px]">Roll No</TableHead>
                                                    <TableHead>Student Name</TableHead>
                                                    <TableHead className="text-right">Attendance Status</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {students.map((student) => (
                                                    <TableRow key={student.id} className="hover:bg-muted/30 transition-colors">
                                                        <TableCell className="font-mono font-bold text-primary">{student.rollNumber}</TableCell>
                                                        <TableCell className="font-medium">{student.user.name}</TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    variant={attendance[student.id] === "PRESENT" ? "default" : "outline"}
                                                                    className={attendance[student.id] === "PRESENT" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                                                                    onClick={() => handleStatusChange(student.id, "PRESENT")}
                                                                >
                                                                    <CheckCircle2 className="h-4 w-4 mr-1.5" /> Present
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant={attendance[student.id] === "ABSENT" ? "destructive" : "outline"}
                                                                    onClick={() => handleStatusChange(student.id, "ABSENT")}
                                                                >
                                                                    <XCircle className="h-4 w-4 mr-1.5" /> Absent
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <Button size="lg" onClick={submitAttendance} disabled={saving} className="px-12 font-bold shadow-xl shadow-primary/20">
                                            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                            Save Attendance Registry
                                        </Button>
                                    </div>
                                </div>
                            ) : !loading && (
                                <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 opacity-60">
                                    <Clock className="h-10 w-10 text-muted" />
                                    <p className="text-muted-foreground font-medium">Please select a course and click 'Fetch Registry' to begin.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="history" className="mt-6">
                    <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Institutional Logs</CardTitle>
                                <CardDescription>Review historic presence records</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="h-8 px-3">{history.length} Records</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-2xl border bg-background/30 overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-muted/50">
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Student</TableHead>
                                            <TableHead>Course</TableHead>
                                            <TableHead className="text-right">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {historyLoading ? (
                                            [1,2,3,4].map(i => (
                                                <TableRow key={i}>
                                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                                    <TableCell className="text-right"><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                                                </TableRow>
                                            ))
                                        ) : history.length > 0 ? (
                                            history.map((record) => (
                                                <TableRow key={record.id}>
                                                    <TableCell className="font-medium">{format(new Date(record.date), 'PPP')}</TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="font-bold">{record.student.user.name}</span>
                                                            <span className="text-xs text-muted-foreground">{record.student.rollNumber}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell><Badge variant="outline">{record.course}</Badge></TableCell>
                                                    <TableCell className="text-right">
                                                        <Badge 
                                                            className={record.status === "PRESENT" ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20" : "bg-destructive/10 text-destructive hover:bg-destructive/20"}
                                                        >
                                                            {record.status}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground italic">
                                                    No attendance logs found for current filters.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
