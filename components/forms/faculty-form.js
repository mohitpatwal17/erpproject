"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export function FacultyForm({ initialData, onSuccess }) {
    const [formData, setFormData] = useState(
        initialData || {
            name: "",
            email: "",
            phone: "",
            department: "",
            designation: "",
            qualification: "",
            joiningDate: "",
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
            const url = initialData ? `/api/faculty/${initialData.id}` : "/api/faculty";
            const method = initialData ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to save faculty record");
            }

            toast.success(initialData ? "Faculty updated successfully" : "Faculty added successfully");
            onSuccess();
        } catch (error) {
            console.error("Error saving faculty:", error);
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
                        placeholder="Dr. Jane Smith"
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
                        placeholder="jane@college.edu"
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
                    <Label htmlFor="department">Department</Label>
                    <Select
                        value={formData.department}
                        onValueChange={(val) => handleSelectChange("department", val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Dept" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="CSE">Computer Science (CSE)</SelectItem>
                            <SelectItem value="ECE">Electronics (ECE)</SelectItem>
                            <SelectItem value="MECH">Mechanical (MECH)</SelectItem>
                            <SelectItem value="CIVIL">Civil Engineering</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="designation">Designation</Label>
                    <Select
                        value={formData.designation}
                        onValueChange={(val) => handleSelectChange("designation", val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Designation" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                            <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                            <SelectItem value="Senior Professor">Senior Professor</SelectItem>
                            <SelectItem value="HOD">Head of Department</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="qualification">Qualification</Label>
                    <Input
                        id="qualification"
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleChange}
                        required
                        placeholder="Ph.D, M.Tech"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="joiningDate">Joining Date</Label>
                    <Input
                        id="joiningDate"
                        name="joiningDate"
                        type="date"
                        value={formData.joiningDate}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : (initialData ? "Update Faculty" : "Add Faculty")}
                </Button>
            </div>
        </form>
    );
}
