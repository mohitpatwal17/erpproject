"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Pencil, Trash2, Eye, ShieldAlert, Loader2, Search, UserPlus } from "lucide-react";
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
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function StudentsPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [error, setError] = useState(null);

    const userRole = session?.user?.role;

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/students?_t=${Date.now()}`, { cache: 'no-store' });
            const json = await res.json();
            
            if (res.ok) {
                setData(json);
            } else {
                setError(json.error || "Failed to load students");
            }
        } catch (err) {
            console.error("Error fetching students:", err);
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session) {
            fetchStudents();
        }
    }, [session]);

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this student record? This will permanently remove their user account as well.")) {
            try {
                const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
                if (res.ok) {
                    toast.success("Student deleted successfully");
                    fetchStudents();
                } else {
                    toast.error("Failed to delete student");
                }
            } catch (error) {
                toast.error("An error occurred during deletion");
            }
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <Skeleton className="h-[500px] w-full rounded-xl" />
            </div>
        );
    }

    if (error || userRole === "STUDENT") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] text-center space-y-6 bg-card/50 backdrop-blur-sm border rounded-2xl p-10">
                <div className="p-4 bg-destructive/10 rounded-full">
                    <ShieldAlert className="h-12 w-12 text-destructive" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-black tracking-tighter">Access Denied</h2>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                        Your account does not have the administrative privileges required to access the global student database.
                    </p>
                </div>
                <Button variant="outline" onClick={() => router.push("/dashboard")}>
                    Return to Dashboard
                </Button>
            </div>
        );
    }

    const columns = [
        {
            accessorKey: "rollNumber",
            header: "Roll No",
            cell: ({ row }) => <span className="font-mono font-bold text-primary">{row.getValue("rollNumber")}</span>
        },
        {
            accessorKey: "user.name",
            id: "name",
            header: "Student Name",
            cell: ({ row }) => {
                const name = row.original.user?.name || "N/A";
                return <span className="font-medium">{name}</span>
            }
        },
        {
            accessorKey: "course",
            header: "Academic Program",
            cell: ({ row }) => <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10">{row.getValue("course")}</Badge>
        },
        {
            accessorKey: "semester",
            header: "Sem",
            cell: ({ row }) => <span className="font-semibold text-muted-foreground">S{row.getValue("semester")}</span>
        },
        {
            accessorKey: "feeStatus",
            header: "Fee Status",
            cell: ({ row }) => {
                const status = row.getValue("feeStatus");
                return (
                    <Badge 
                        variant="outline" 
                        className={
                            status === "PAID" 
                                ? "text-emerald-600 border-emerald-500/30 bg-emerald-500/5" 
                                : status === "PARTIAL" 
                                ? "text-amber-600 border-amber-500/30 bg-amber-500/5"
                                : "text-destructive border-destructive/30 bg-destructive/5"
                        }
                    >
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
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-primary/5">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Student Options</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/students/${student.id}`)} className="cursor-pointer">
                                <Eye className="mr-2 h-4 w-4 text-blue-500" /> View Detailed Profile
                            </DropdownMenuItem>
                            
                            {userRole === "ADMIN" && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => {
                                        setEditingStudent(student);
                                        setIsOpen(true);
                                    }} className="cursor-pointer">
                                        <Pencil className="mr-2 h-4 w-4 text-amber-500" /> Modify Records
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDelete(student.id)} className="cursor-pointer text-destructive focus:bg-destructive focus:text-destructive-foreground">
                                        <Trash2 className="mr-2 h-4 w-4" /> Permanent Delete
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const handleSuccess = () => {
        setIsOpen(false);
        setEditingStudent(null);
        fetchStudents();
        toast.success(editingStudent ? "Student updated" : "Student added successfully");
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-4xl font-extrabold tracking-tight">
                        {userRole === "FACULTY" ? "My Department Students" : "Student Information System"}
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        {userRole === "FACULTY" 
                            ? "Manage and monitor academic progress of students in your care" 
                            : "Centralized database for all institutional student records"}
                    </p>
                </div>
                
                {userRole === "ADMIN" && (
                    <Dialog open={isOpen} onOpenChange={(open) => {
                        setIsOpen(open);
                        if (!open) setEditingStudent(null);
                    }}>
                        <DialogTrigger asChild>
                            <Button size="lg" className="shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                <UserPlus className="mr-2 h-5 w-5" /> Add Student
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl border-none shadow-2xl">
                            <DialogHeader className="mb-4">
                                <div className="p-3 bg-primary/10 w-fit rounded-xl mb-2">
                                    <Plus className="h-6 w-6 text-primary" />
                                </div>
                                <DialogTitle className="text-2xl font-bold">
                                    {editingStudent ? "Update Student Profile" : "Onboard New Student"}
                                </DialogTitle>
                                <DialogDescription className="text-base">
                                    {editingStudent 
                                        ? "Apply changes to the student's institutional records." 
                                        : "Register a new student within the ERP database system."}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="mt-2">
                                <StudentForm 
                                    initialData={editingStudent} 
                                    onSuccess={handleSuccess} 
                                    onCancel={() => setIsOpen(false)}
                                />
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            <div className="bg-card/50 backdrop-blur-sm border rounded-2xl shadow-xl overflow-hidden p-1">
                <DataTable 
                    columns={columns} 
                    data={data} 
                    searchKey="name" 
                    placeholder="Search students by name or enrollment ID..." 
                />
            </div>
        </div>
    );
}
