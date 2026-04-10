"use client";

import { useState } from "react";
import { DataTable } from "@/components/tables/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Faculty } from "@/lib/types";
import { MOCK_FACULTY } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Pencil, Trash2, CalendarCheck, BookOpen } from "lucide-react";
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
import { FacultyForm } from "@/components/forms/faculty-form";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function FacultyPage() {
    const router = useRouter();
    const [data, setData] = useState(MOCK_FACULTY);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingFaculty, setEditingFaculty] = useState(null);

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this faculty member?")) {
            setData(data.filter((f) => f.id !== id));
        }
    };

    const columns = [
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "department",
            header: "Department",
            cell: ({ row }) => <Badge variant="secondary">{row.getValue("department")}</Badge>,
        },
        {
            accessorKey: "designation",
            header: "Designation",
        },
        {
            accessorKey: "subjects",
            header: "Workload",
            cell: ({ row }) => {
                const subjects = row.getValue("subjects");
                return <span className="font-medium">{subjects.length} Subjects</span>;
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const faculty = row.original;

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
                            <DropdownMenuItem onClick={() => {
                                setEditingFaculty(faculty);
                                setIsFormOpen(true);
                            }}>
                                <Pencil className="mr-2 h-4 w-4" /> Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push('/dashboard/courses')}>
                                <BookOpen className="mr-2 h-4 w-4" /> Assign Subjects
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push('/dashboard/attendance')}>
                                <CalendarCheck className="mr-2 h-4 w-4" /> Mark Attendance
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDelete(faculty.id)} className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const handleSuccess = () => {
        setIsFormOpen(false);
        setEditingFaculty(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Faculty</h2>
                <Dialog open={isFormOpen} onOpenChange={(open) => {
                    setIsFormOpen(open);
                    if (!open) setEditingFaculty(null);
                }}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Faculty
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-xl">
                        <DialogHeader>
                            <DialogTitle>{editingFaculty ? "Edit Faculty" : "Add New Faculty"}</DialogTitle>
                            <DialogDescription>
                                {editingFaculty ? "Update faculty details below." : "Enter the faculty's details below to create a new record."}
                            </DialogDescription>
                        </DialogHeader>
                        <FacultyForm initialData={editingFaculty} onSuccess={handleSuccess} />
                    </DialogContent>
                </Dialog>
            </div>

            <DataTable columns={columns} data={data} searchKey="name" />
        </div>
    );
}
