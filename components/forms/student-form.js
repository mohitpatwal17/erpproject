"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export function StudentForm({ initialData, onSuccess }) {
    const [formData, setFormData] = useState(
        initialData || {
            name: "",
            email: "",
            rollNumber: "",
            course: "",
            semester: 1,
            phone: "",
            address: "",
            dob: "",
            guardianName: "",
            guardianPhone: "",
        }
    );
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const url = initialData ? `/api/students/${initialData.id}` : "/api/students";
            const method = initialData ? "PUT" : "POST";
            
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to save student");
            }

            toast.success(initialData ? "Student updated successfully" : "Student created successfully");
            onSuccess();
        } catch (error) {
            console.error("Error saving student:", error);
            toast.error(error.message || "An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="rollNumber">Roll Number</Label>
                    <Input
                        id="rollNumber"
                        name="rollNumber"
                        value={formData.rollNumber}
                        onChange={handleChange}
                        required
                        placeholder="CS24001"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="9876543210"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="course">Course</Label>
                    <Select
                        value={formData.course}
                        onValueChange={(val) => handleSelectChange("course", val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Course" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="B.Tech CSE">B.Tech CSE</SelectItem>
                            <SelectItem value="B.Tech ECE">B.Tech ECE</SelectItem>
                            <SelectItem value="B.Tech MECH">B.Tech MECH</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="semester">Semester</Label>
                    <Select
                        value={formData.semester?.toString()}
                        onValueChange={(val) => handleSelectChange("semester", val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Semester" />
                        </SelectTrigger>
                        <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                                <SelectItem key={sem} value={sem.toString()}>
                                    Semester {sem}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="guardianName">Guardian Name</Label>
                    <Input
                        id="guardianName"
                        name="guardianName"
                        value={formData.guardianName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="guardianPhone">Guardian Phone</Label>
                    <Input
                        id="guardianPhone"
                        name="guardianPhone"
                        value={formData.guardianPhone}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="col-span-2 space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : (initialData ? "Update Student" : "Add Student")}
                </Button>
            </div>
        </form>
    );
}
