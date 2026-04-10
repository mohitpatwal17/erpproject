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
import { Faculty } from "@/lib/types";
import { toast } from "sonner";

interface FacultyFormProps {
    initialData?: Faculty | null;
    onSuccess: () => void;
}

export function FacultyForm({ initialData, onSuccess }: FacultyFormProps) {
    const [formData, setFormData] = useState<Partial<Faculty>>(
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API Call
        setTimeout(() => {
            console.log("Submitting Faculty Data:", formData);
            toast.success(initialData ? "Faculty updated successfully" : "Faculty added successfully");
            setIsLoading(false);
            onSuccess();
        }, 1000);
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
