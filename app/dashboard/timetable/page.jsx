"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { 
    Calendar, 
    Clock, 
    MapPin, 
    Plus, 
    Loader2, 
    BookOpen, 
    User, 
    Trash2, 
    Filter,
    Table as TableIcon
} from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const TIME_SLOTS = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];

export default function TimetablePage() {
    const { data: session } = useSession();
    const [timetable, setTimetable] = useState([]);
    const [courses, setCourses] = useState([]);
    const [faculty, setFaculty] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Filters
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedSemester, setSelectedSemester] = useState("1");

    // Form state
    const [day, setDay] = useState("Monday");
    const [time, setTime] = useState("09:00 AM");
    const [subject, setSubject] = useState("");
    const [room, setRoom] = useState("");
    const [facultyId, setFacultyId] = useState("");

    const userRole = session?.user?.role;

    const fetchData = async () => {
        try {
            setLoading(true);
            const [resCourses, resFaculty] = await Promise.all([
                fetch("/api/courses"),
                fetch("/api/faculty")
            ]);
            if (resCourses.ok) {
                const courseData = await resCourses.json();
                setCourses(courseData);
                if (courseData.length > 0) setSelectedCourse(courseData[0].id);
            }
            if (resFaculty.ok) setFaculty(await resFaculty.json());
        } catch (error) {
            toast.error("Failed to load initial data");
        } finally {
            setLoading(false);
        }
    };

    const fetchTimetable = async () => {
        if (!selectedCourse) return;
        try {
            const res = await fetch(`/api/timetable?courseId=${selectedCourse}&semester=${selectedSemester}`);
            if (res.ok) setTimetable(await res.json());
        } catch (error) {
            toast.error("Failed to load timetable");
        }
    };

    useEffect(() => {
        if (session) {
            fetchData();
        }
    }, [session]);

    useEffect(() => {
        if (selectedCourse) {
            fetchTimetable();
        }
    }, [selectedCourse, selectedSemester]);

    const handleCreate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/timetable", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    courseId: selectedCourse,
                    semester: selectedSemester,
                    day,
                    time,
                    subject,
                    room,
                    facultyId
                })
            });
            if (res.ok) {
                toast.success("Schedule slot added");
                setIsCreateOpen(false);
                setSubject("");
                setRoom("");
                fetchTimetable();
            }
        } catch (error) {
            toast.error("Failed to add slot");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading && courses.length === 0) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-64" />
                <div className="grid grid-cols-6 gap-4">
                    {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-20 w-full" />)}
                </div>
                <Skeleton className="h-[500px] w-full" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter">Academic Timetable</h2>
                    <p className="text-muted-foreground">Class schedules, lecture halls and faculty assignments</p>
                </div>
                
                {userRole === "ADMIN" && (
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button size="lg" className="shadow-lg shadow-primary/20">
                                <Plus className="mr-2 h-5 w-5" /> Add Schedule Slot
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md border-none shadow-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold">Schedule Class</DialogTitle>
                                <DialogDescription>Populate a new lecture slot in the master timetable.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-4 mt-2">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Day</label>
                                        <Select value={day} onValueChange={setDay}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>{DAYS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Time</label>
                                        <Select value={time} onValueChange={setTime}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>{TIME_SLOTS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Subject Title</label>
                                    <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Data Structures" required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Lecture Room</label>
                                        <Input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="e.g. Room 402" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Faculty</label>
                                        <Select value={facultyId} onValueChange={setFacultyId}>
                                            <SelectTrigger><SelectValue placeholder="Assign Faculty" /></SelectTrigger>
                                            <SelectContent>
                                                {faculty.map(f => <SelectItem key={f.id} value={f.id}>{f.user.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
                                    {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                                    Create Schedule Entry
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            {/* Filter Section */}
            <div className="flex flex-wrap items-center gap-4 bg-card/50 backdrop-blur-sm p-4 rounded-2xl border shadow-sm">
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground mr-2">Filters:</span>
                </div>
                
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger className="w-[200px] border-none bg-background shadow-sm">
                        <SelectValue placeholder="Select Course" />
                    </SelectTrigger>
                    <SelectContent>
                        {courses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                </Select>

                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                    <SelectTrigger className="w-[150px] border-none bg-background shadow-sm">
                        <SelectValue placeholder="Semester" />
                    </SelectTrigger>
                    <SelectContent>
                        {[1,2,3,4,5,6,7,8].map(s => <SelectItem key={s} value={String(s)}>Semester {s}</SelectItem>)}
                    </SelectContent>
                </Select>

                <Button variant="ghost" onClick={fetchTimetable} className="ml-auto">
                    <Calendar className="h-4 w-4 mr-2" /> Refresh View
                </Button>
            </div>

            {/* Timetable Grid View */}
            <div className="grid gap-6">
                <Card className="border-none shadow-xl overflow-hidden bg-card/50 backdrop-blur-sm">
                    <CardHeader className="bg-muted/30 border-b">
                        <div className="flex items-center gap-2">
                            <TableIcon className="h-5 w-5 text-primary" />
                            <CardTitle>Master Schedule</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="p-4 border-b border-r bg-muted/20 w-32 font-black uppercase text-[10px] tracking-widest">Time / Day</th>
                                        {DAYS.map(day => (
                                            <th key={day} className="p-4 border-b bg-muted/10 font-black uppercase text-[10px] tracking-widest text-center min-w-[150px]">
                                                {day}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {TIME_SLOTS.map(timeSlot => (
                                        <tr key={timeSlot} className="group">
                                            <td className="p-4 border-b border-r bg-muted/20 font-bold text-xs text-center text-muted-foreground group-hover:bg-primary/5 transition-colors">
                                                {timeSlot}
                                            </td>
                                            {DAYS.map(dayName => {
                                                const slot = timetable.find(t => t.day === dayName && t.time === timeSlot);
                                                return (
                                                    <td key={`${dayName}-${timeSlot}`} className="p-2 border-b group-hover:bg-primary/5 transition-colors">
                                                        {slot ? (
                                                            <div className="bg-background shadow-md border-l-4 border-l-primary rounded-lg p-3 space-y-2 animate-in zoom-in-95 duration-300">
                                                                <div className="flex flex-col">
                                                                    <span className="font-black text-sm leading-tight text-primary uppercase">{slot.subject}</span>
                                                                    <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 mt-1">
                                                                        <MapPin className="h-2.5 w-2.5" />
                                                                        {slot.room}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2 pt-2 border-t border-dashed">
                                                                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                                                        {slot.faculty?.user?.name.charAt(0) || "F"}
                                                                    </div>
                                                                    <span className="text-[10px] font-medium truncate max-w-[80px]">
                                                                        {slot.faculty?.user?.name || "Unassigned"}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="h-20 w-full rounded-lg border border-dashed border-muted/50 flex items-center justify-center group-hover:border-primary/20 transition-all">
                                                                <span className="text-[10px] font-medium text-muted/30">Free Slot</span>
                                                            </div>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
