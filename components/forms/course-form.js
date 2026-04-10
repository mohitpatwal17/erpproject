"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Course } from "@/lib/types";
import { toast } from "sonner";

interface CourseFormProps {
    initialData?: Course | null;
    onSuccess: () => void;
}

export function CourseForm({ initialData, onSuccess }: CourseFormProps) {
    const [formData, setFormData] = useState<Partial<Course>>(
        initialData || {
            name: "",
            code: "",
            description: "",
            credits: 0,
            department: "",
            semester: 1,
        }
    );
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "credits" || name === "semester" ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API Call
        setTimeout(() => {
            console.log("Submitting Course Data:", formData);
            toast.success(initialData ? "Course updated successfully" : "Course created successfully");
            setIsLoading(false);
            onSuccess();
        }, 1000);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                    <Label htmlFor="name">Course Name</Label>
                    <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Computer Science & Engineering"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="code">Course Code</Label>
                    <Input
                        id="code"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        required
                        placeholder="CSE"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                        placeholder="CSE"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="credits">Total Credits</Label>
                    <Input
                        id="credits"
                        name="credits"
                        type="number"
                        value={formData.credits}
                        onChange={handleChange}
                        required
                        placeholder="160"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="semester">Total Semesters</Label>
                    <Input
                        id="semester"
                        name="semester"
                        type="number"
                        value={formData.semester}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="col-span-2 space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        placeholder="Brief description of the course..."
                    />
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : (initialData ? "Update Course" : "Create Course")}
                </Button>
            </div>
        </form>
    );
}
