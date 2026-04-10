"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { 
    CalendarIcon, 
    GraduationCap, 
    Plus, 
    FileText, 
    Trophy, 
    ClipboardCheck, 
    Clock, 
    Loader2, 
    BarChart3, 
    Save, 
    CheckCircle2, 
    Search 
} from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ExamsPage() {
    const { data: session } = useSession();
    const [exams, setExams] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isResultOpen, setIsResultOpen] = useState(false);
    const [selectedExam, setSelectedExam] = useState(null);
    const [students, setStudents] = useState([]);
    const [marks, setMarks] = useState({}); // { studentId: marks }
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Create Exam form state
    const [newName, setNewName] = useState("");
    const [newCourseId, setNewCourseId] = useState("");
    const [newDate, setNewDate] = useState(new Date());

    const userRole = session?.user?.role;

    const fetchExams = async () => {
        try {
            setLoading(true);
            const [resExams, resCourses] = await Promise.all([
                fetch("/api/exams"),
                fetch("/api/courses")
            ]);
            if (resExams.ok) setExams(await resExams.json());
            if (resCourses.ok) setCourses(await resCourses.json());
        } catch (error) {
            toast.error("Failed to load exams data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session) {
            fetchExams();
        }
    }, [session]);

    const handleCreateExam = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/exams", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: newName,
                    courseId: newCourseId,
                    date: newDate.toISOString(),
                    totalMarks: 100
                })
            });
            if (res.ok) {
                toast.success("Exam scheduled successfully");
                setIsCreateOpen(false);
                fetchExams();
            }
        } catch (error) {
            toast.error("Failed to schedule exam");
        } finally {
            setIsSubmitting(false);
        }
    };

    const fetchStudentsForGrading = async (exam) => {
        setSelectedExam(exam);
        setIsResultOpen(true);
        setLoading(true);
        try {
            // Fetch students enrolled in the course of this exam
            const res = await fetch(`/api/students?course=${exam.course.name}`);
            if (res.ok) {
                const data = await res.json();
                setStudents(data);
                
                // Fetch existing results for this exam
                const resResults = await fetch(`/api/exams/${exam.id}/results`);
                if (resResults.ok) {
                    const existingResults = await resResults.json();
                    const initialMarks = {};
                    existingResults.forEach(r => initialMarks[r.studentId] = r.marks);
                    setMarks(initialMarks);
                }
            }
        } catch (error) {
            toast.error("Failed to load student list");
        } finally {
            setLoading(false);
        }
    };

    const submitResults = async (publish = false) => {
        setIsSubmitting(true);
        try {
            const resultData = Object.entries(marks).map(([studentId, m]) => ({
                studentId,
                marks: parseFloat(m)
            }));

            const res = await fetch(`/api/exams/${selectedExam.id}/results`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    results: resultData,
                    publish
                })
            });

            if (res.ok) {
                toast.success(publish ? "Results published!" : "Results saved as draft");
                setIsResultOpen(false);
                fetchExams();
            }
        } catch (error) {
            toast.error("Failed to submit marks");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading && exams.length === 0) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-64" />
                <div className="grid gap-4 md:grid-cols-2">
                    <Skeleton className="h-[400px] w-full rounded-xl" />
                    <Skeleton className="h-[400px] w-full rounded-xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter">Academic Examinations</h2>
                    <p className="text-muted-foreground">Schedule tests, record grades and track student performance</p>
                </div>
                {userRole !== "STUDENT" && (
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button size="lg" className="shadow-lg shadow-primary/20">
                                <Plus className="mr-2 h-5 w-5" /> Schedule Exam
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Schedule New Assessment</DialogTitle>
                                <DialogDescription>Configure institutional examination details.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateExam} className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Exam Name</label>
                                    <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Mid-Semester 2025" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Course / Department</label>
                                    <Select value={newCourseId} onValueChange={setNewCourseId} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Course" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {courses.map(c => <SelectItem key={c.id} value={c.id}>{c.name} ({c.code})</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Date</label>
                                    <Calendar mode="single" selected={newDate} onSelect={(d) => d && setNewDate(d)} className="rounded-md border mx-auto" />
                                </div>
                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Confirm Schedule"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px] bg-muted/50 p-1">
                    <TabsTrigger value="upcoming">Upcoming Exams</TabsTrigger>
                    <TabsTrigger value="completed">Past Assessments</TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="mt-6 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {exams.filter(e => e.status !== "Completed").length > 0 ? (
                            exams.filter(e => e.status !== "Completed").map((exam) => (
                                <Card key={exam.id} className="border-none shadow-lg bg-card/50 backdrop-blur-sm group hover:scale-[1.02] transition-all">
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 mb-2">
                                                {exam.course.code}
                                            </Badge>
                                            <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/10 uppercase text-[10px] font-bold">
                                                {exam.status}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-xl font-black">{exam.name}</CardTitle>
                                        <CardDescription className="flex items-center gap-1">
                                            <CalendarIcon className="h-3 w-3" />
                                            {format(new Date(exam.date), 'PPP')}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex -space-x-2">
                                                {[1,2,3].map(i => (
                                                    <div key={i} className="h-6 w-6 rounded-full bg-muted border border-background flex items-center justify-center text-[10px] font-bold">U</div>
                                                ))}
                                                <div className="h-6 w-6 rounded-full bg-primary/10 border border-background flex items-center justify-center text-[10px] font-bold text-primary">+</div>
                                            </div>
                                            {userRole !== "STUDENT" && (
                                                <Button size="sm" onClick={() => fetchStudentsForGrading(exam)} variant="secondary" className="font-bold">
                                                    Manage Results
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center space-y-3 bg-muted/20 rounded-3xl border-2 border-dashed">
                                <FileText className="h-10 w-10 text-muted mx-auto" />
                                <p className="text-muted-foreground font-medium">No upcoming examinations scheduled.</p>
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="completed" className="mt-6">
                    <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>Historical Result Registry</CardTitle>
                            <CardDescription>Final grades and performance distributions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead>Assessment</TableHead>
                                        <TableHead>Course</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {exams.filter(e => e.status === "Completed").map(exam => (
                                        <TableRow key={exam.id}>
                                            <TableCell className="font-bold">{exam.name}</TableCell>
                                            <TableCell><Badge variant="outline">{exam.course.name}</Badge></TableCell>
                                            <TableCell>{format(new Date(exam.date), 'PP')}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" onClick={() => fetchStudentsForGrading(exam)}>
                                                    <BarChart3 className="h-4 w-4 mr-2" /> View Report
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Grading Dialog */}
            <Dialog open={isResultOpen} onOpenChange={setIsResultOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-2xl">
                            <ClipboardCheck className="h-6 w-6 text-primary" />
                            {selectedExam?.status === "Completed" ? "Result Registry" : "Grade Management"}
                        </DialogTitle>
                        <DialogDescription>
                            Recording marks for <span className="font-bold text-foreground">{selectedExam?.name}</span> - Overall: 100 Marks
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="mt-6 space-y-6">
                        <div className="rounded-2xl border bg-muted/30 p-1">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Roll Number</TableHead>
                                        <TableHead>Student Name</TableHead>
                                        <TableHead className="w-[150px]">Marks / 100</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {students.map(student => (
                                        <TableRow key={student.id}>
                                            <TableCell className="font-mono font-bold text-primary">{student.rollNumber}</TableCell>
                                            <TableCell className="font-medium">{student.user.name}</TableCell>
                                            <TableCell>
                                                <Input 
                                                    type="number" 
                                                    value={marks[student.id] || ""} 
                                                    onChange={(e) => setMarks(prev => ({ ...prev, [student.id]: e.target.value }))}
                                                    className="font-black h-10"
                                                    disabled={selectedExam?.status === "Completed"}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {selectedExam?.status !== "Completed" && (
                            <div className="flex justify-end gap-3">
                                <Button variant="outline" onClick={() => submitResults(false)} disabled={isSubmitting}>
                                   {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />} Save Draft
                                </Button>
                                <Button onClick={() => submitResults(true)} disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 font-bold px-8">
                                   {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <CheckCircle2 className="mr-2 h-4 w-4" />} Publish Final Results
                                </Button>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
