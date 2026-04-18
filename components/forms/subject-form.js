"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function SubjectForm({ onSuccess, initialCourseId }) {
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        courseId: initialCourseId || "",
        semester: "1",
        credits: "4"
    });

    useEffect(() => {
        async function fetchCourses() {
            try {
                const res = await fetch("/api/courses");
                if (res.ok) {
                    const data = await res.json();
                    setCourses(data);
                }
            } catch (error) {
                console.error("Failed to load courses");
            }
        }
        fetchCourses();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/subjects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success("Subject added to curriculum");
                onSuccess?.();
            } else {
                const err = await res.json();
                toast.error(err.message || "Failed to add subject");
            }
        } catch (error) {
            toast.error("Network error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
                <label className="text-sm font-semibold">Subject Name</label>
                <Input 
                    placeholder="e.g. Advanced Calculus" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required 
                />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold">Subject Code</label>
                    <Input 
                        placeholder="e.g. MATH101" 
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        required 
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold">Credits</label>
                    <Input 
                        type="number"
                        placeholder="4" 
                        value={formData.credits}
                        onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                        required 
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold">Course</label>
                    <Select 
                        value={formData.courseId} 
                        onValueChange={(val) => setFormData({ ...formData, courseId: val })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Course" />
                        </SelectTrigger>
                        <SelectContent>
                            {courses.map(c => (
                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold">Semester</label>
                    <Select 
                        value={formData.semester} 
                        onValueChange={(val) => setFormData({ ...formData, semester: val })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Sem" />
                        </SelectTrigger>
                        <SelectContent>
                            {[1,2,3,4,5,6,7,8].map(s => (
                                <SelectItem key={s} value={String(s)}>Semester {s}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Add Subject"}
            </Button>
        </form>
    );
}
