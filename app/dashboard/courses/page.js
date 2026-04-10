"use client";

import { useState } from "react";
import { Course } from "@/lib/types";
import { MOCK_COURSES } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, Layers, GraduationCap } from "lucide-react";
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

export default function CoursesPage() {
    const [courses, setCourses] = useState(MOCK_COURSES);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleSuccess = () => {
        setIsFormOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Courses & Curriculum</h2>
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
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {courses.map((course) => (
                    <Card key={course.id} className="flex flex-col">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-xl">{course.name}</CardTitle>
                                    <CardDescription className="mt-1">{course.code}</CardDescription>
                                </div>
                                <Badge variant="outline" className="text-lg py-1 px-3">
                                    {course.credits} Credits
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-sm text-muted-foreground mb-4">
                                {course.description}
                            </p>

                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="semesters">
                                    <AccordionTrigger>
                                        <div className="flex items-center">
                                            <Layers className="mr-2 h-4 w-4" />
                                            Semester Structure
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-4 pt-2">
                                            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                                                <div key={sem} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                                    <span className="font-medium text-sm">Semester {sem}</span>
                                                    <span className="text-xs text-muted-foreground">5 Subjects • 20 Credits</span>
                                                </div>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="subjects">
                                    <AccordionTrigger>
                                        <div className="flex items-center">
                                            <BookOpen className="mr-2 h-4 w-4" />
                                            Core Subjects
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            <Badge variant="secondary">Data Structures</Badge>
                                            <Badge variant="secondary">Algorithms</Badge>
                                            <Badge variant="secondary">Operating Systems</Badge>
                                            <Badge variant="secondary">DBMS</Badge>
                                            <Badge variant="secondary">Computer Networks</Badge>
                                            <Badge variant="secondary">AI & ML</Badge>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                        <CardFooter className="bg-muted/10 pt-4">
                            <div className="flex items-center text-sm text-muted-foreground w-full justify-between">
                                <div className="flex items-center">
                                    <GraduationCap className="mr-2 h-4 w-4" />
                                    {course.department} Department
                                </div>
                                <Button variant="ghost" size="sm">Edit Structure</Button>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
