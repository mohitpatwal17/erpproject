"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, Layers, GraduationCap, Loader2 } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { CourseForm } from "@/components/forms/course-form";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useSession } from "next-auth/react";

export default function CoursesPage() {
    const { data: session } = useSession();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const userRole = session?.user?.role;

    useEffect(() => {
        async function fetchCourses() {
            try {
                const res = await fetch("/api/courses");
                const json = await res.json();
                if (res.ok) {
                    setCourses(json);
                }
            } catch (err) {
                console.error("Failed to fetch courses", err);
            } finally {
                setLoading(false);
            }
        }
        if (session) {
            fetchCourses();
        }
    }, [session]);

    const handleSuccess = () => {
        setIsFormOpen(false);
        // Re-fetch courses ideally
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Courses & Curriculum</h2>
                    <p className="text-muted-foreground">Browse academic departments and course structures.</p>
                </div>
                
                {userRole === "ADMIN" && (
                    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Add Course
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-xl">
                            <DialogHeader>
                                <DialogTitle>Add New Course</DialogTitle>
                                <DialogDescription>
                                    Define a new course structure and curriculum.
                                </DialogDescription>
                            </DialogHeader>
                            <CourseForm onSuccess={handleSuccess} />
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            {courses.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                    {courses.map((course) => (
                        <Card key={course.id} className="flex flex-col border-none shadow-md bg-slate-900/50">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-xl text-white">{course.name}</CardTitle>
                                        <CardDescription className="mt-1 font-mono text-blue-400">{course.code}</CardDescription>
                                    </div>
                                    <Badge variant="secondary" className="text-sm py-1 px-3">
                                        {course.credits} Credits
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 text-slate-300">
                                <p className="text-sm text-slate-400 mb-4">
                                    Comprehensive engineering curriculum focused on {course.name.toLowerCase()}.
                                </p>

                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="semesters" className="border-slate-800">
                                        <AccordionTrigger className="hover:no-underline">
                                            <div className="flex items-center text-slate-200">
                                                <Layers className="mr-2 h-4 w-4 text-blue-500" />
                                                Semester Structure
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="space-y-4 pt-2">
                                                {[1, 2, 3, 4].map((sem) => (
                                                    <div key={sem} className="flex items-center justify-between border-b border-slate-800 pb-2 last:border-0 last:pb-0">
                                                        <span className="font-medium text-sm text-slate-300">Semester {sem}</span>
                                                        <span className="text-xs text-slate-500">5 Subjects • 20 Credits</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </CardContent>
                            <CardFooter className="bg-slate-950/20 pt-4 border-t border-slate-800">
                                <div className="flex items-center text-sm text-slate-400 w-full justify-between">
                                    <div className="flex items-center">
                                        <GraduationCap className="mr-2 h-4 w-4 text-emerald-500" />
                                        {course.department} Department
                                    </div>
                                    {userRole === "ADMIN" && (
                                        <Button variant="ghost" size="sm" className="hover:bg-slate-800 text-xs">Edit Structure</Button>
                                    )}
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-xl">
                    <BookOpen className="h-12 w-12 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500 italic">No courses available in the curriculum yet.</p>
                </div>
            )}
        </div>
    );
}
