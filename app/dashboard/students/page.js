"use client";

import { useState } from "react";
import { DataTable } from "@/components/tables/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Student } from "@/lib/types";
import { MOCK_STUDENTS } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { StudentForm } from "@/components/forms/student-form";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function StudentsPage() {
    const router = useRouter();
    const [data, setData] = useState(MOCK_STUDENTS);
    const [isDataLoaded, setIsDataLoaded] = useState(true); // Simulate loaded state
    const [isOpen, setIsOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this student?")) {
            setData(data.filter((student) => student.id !== id));
        }
    };

    const columns = [
        {
            accessorKey: "rollNumber",
            header: "Roll No",
        },
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "course",
            header: "Course",
        },
        {
            accessorKey: "semester",
            header: "Sem",
        },
        {
            accessorKey: "attendancePercentage",
            header: "Attendance",
            cell: ({ row }) => {
                const attendance = parseFloat(row.getValue("attendancePercentage"));
                return (
                    <Badge variant={attendance >= 75 ? "default" : "destructive"}>
                        {attendance}%
                    </Badge>
                );
            },
        },
        {
            accessorKey: "feeStatus",
            header: "Fees",
            cell: ({ row }) => {
                const status = row.getValue("feeStatus");
                return (
                    <Badge variant={status === "PAID" ? "outline" : "secondary"} className={status === "PAID" ? "text-emerald-600 border-emerald-600" : "text-amber-600"}>
                        {status}
                    </Badge>
                );
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const student = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/students/${student.id}`)}>
                                <Eye className="mr-2 h-4 w-4" /> View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                                setEditingStudent(student);
                                setIsOpen(true);
                            }}>
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDelete(student.id)} className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const handleSuccess = () => {
        setIsOpen(false);
        setEditingStudent(null);
        // Refresh data would go here
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Students</h2>
                <Dialog open={isOpen} onOpenChange={(open) => {
                    setIsOpen(open);
                    if (!open) setEditingStudent(null);
                }}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Student
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>{editingStudent ? "Edit Student" : "Add New Student"}</DialogTitle>
                            <DialogDescription>
                                {editingStudent ? "Update student details below." : "Enter the student's details below to create a new record."}
                            </DialogDescription>
                        </DialogHeader>
                        <StudentForm initialData={editingStudent} onSuccess={handleSuccess} />
                    </DialogContent>
                </Dialog>
            </div>

            <DataTable columns={columns} data={data} searchKey="name" />
        </div>
    );
}
