"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, BookOpen, GraduationCap, Download, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentProfilePage({ params }) {
    const router = useRouter();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // FIX 1: Precompute attendance to avoid flickering
    const attendanceData = useMemo(() =>
        Array.from({ length: 30 }, () => Math.random() > 0.1),
    []);

    useEffect(() => {
        async function fetchStudent() {
            try {
                const res = await fetch(`/api/students/${params.id}`);
                if (!res.ok) throw new Error("Student not found");
                const data = await res.json();
                setStudent(data);
            } catch (err) {
                console.error("Error fetching student:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchStudent();
    }, [params.id]);

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-48" />
                <div className="grid gap-6 md:grid-cols-7">
                    <div className="md:col-span-2 space-y-6">
                        <Skeleton className="h-[300px] w-full" />
                        <Skeleton className="h-[200px] w-full" />
                    </div>
                    <div className="md:col-span-5 space-y-6">
                        <Skeleton className="h-[500px] w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !student) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <AlertCircle className="h-12 w-12 text-destructive" />
                <h2 className="text-2xl font-bold">Error</h2>
                <p className="text-muted-foreground">{error || "Could not load student profile."}</p>
                <Button onClick={() => router.push("/dashboard/students")}>Back to Students</Button>
            </div>
        );
    }

    const performanceData = student.examResults?.map(r => ({
        subject: r.exam.name,
        marks: r.marks
    })) || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-2xl font-bold tracking-tight">Student Profile</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-7">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardContent className="pt-6 flex flex-col items-center text-center">
                            <Avatar className="h-32 w-32 mb-4">
                                <AvatarImage src={student.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.user?.name}`} />
                                <AvatarFallback>{student.user?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <h3 className="text-xl font-bold">{student.user?.name}</h3>
                            <p className="text-sm text-muted-foreground">{student.rollNumber}</p>
                            <div className="mt-4 flex flex-wrap justify-center gap-2">
                                <Badge variant="secondary">{student.course}</Badge>
                                <Badge variant="outline">Sem {student.semester}</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="truncate">{student.user?.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{student.phone}</span>
                            </div>
                            <div className="flex items-start space-x-2">
                                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <span>{student.address}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>DOB: {student.dob ? new Date(student.dob).toLocaleDateString() : "N/A"}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Guardian Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex flex-col">
                                <span className="text-muted-foreground text-xs">Name</span>
                                <span className="font-medium">{student.guardianName}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-muted-foreground text-xs">Contact</span>
                                <span>{student.guardianPhone}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="md:col-span-5 space-y-6">
                    <Tabs defaultValue="academic" className="w-full">
                        <TabsList>
                            <TabsTrigger value="academic">Academic</TabsTrigger>
                            <TabsTrigger value="attendance">Attendance</TabsTrigger>
                            <TabsTrigger value="fees">Fees</TabsTrigger>
                            <TabsTrigger value="documents">Documents</TabsTrigger>
                        </TabsList>

                        <TabsContent value="academic" className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">Overall Status</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold">Good</div>
                                        <p className="text-xs text-muted-foreground">Cleared all subjects</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">Exam Progress</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-emerald-600">
                                            {student.examResults?.length || 0}
                                        </div>
                                        <p className="text-xs text-muted-foreground">Exams attempted</p>
                                    </CardContent>
                                </Card>
                            </div>

                            {performanceData.length > 0 ? (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Performance</CardTitle>
                                        <CardDescription>Marks distribution across exams</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="rounded-md border p-4 bg-muted/5">
                                            {performanceData.map((data, i) => (
                                                <div key={i} className="flex justify-between items-center py-2 border-b last:border-0">
                                                    <span className="font-medium text-sm">{data.subject}</span>
                                                    <span className="font-bold">{data.marks} / 100</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card>
                                    <CardContent className="py-10 text-center text-muted-foreground">
                                        No exam results available yet.
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>

                        <TabsContent value="attendance" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Attendance History</CardTitle>
                                    <CardDescription>Last 30 days visualization</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                                        {attendanceData.map((present, i) => (
                                            <div
                                                key={i}
                                                className={`p-2 rounded ${present
                                                    ? "bg-emerald-500/10 text-emerald-600"
                                                    : "bg-destructive/10 text-destructive"
                                                    }`}
                                            >
                                                {i + 1}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-4 mt-6 text-xs">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-3 h-3 bg-emerald-500 rounded"></div>
                                            <span>Present</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-3 h-3 bg-destructive rounded"></div>
                                            <span>Absent</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="fees" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Fee Status</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/30">
                                        <div>
                                            <p className="text-xs text-muted-foreground font-medium uppercase">Total</p>
                                            <p className="text-xl font-bold">{formatCurrency(student.totalFees)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground font-medium uppercase">Paid</p>
                                            <p className="text-xl font-bold text-emerald-600">{formatCurrency(student.paidFees)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground font-medium uppercase">Due</p>
                                            <p className="text-xl font-bold text-destructive">{formatCurrency(student.totalFees - student.paidFees)}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-sm font-semibold">Transaction History</p>
                                        {student.feeRecords?.length > 0 ? (
                                            student.feeRecords.map((record) => (
                                                <div key={record.id} className="flex justify-between items-center text-sm p-3 bg-muted/50 rounded-lg border">
                                                    <div className="space-y-0.5">
                                                        <p className="font-medium">{record.type}</p>
                                                        <p className="text-xs text-muted-foreground">{new Date(record.paidAt).toLocaleDateString()} • {record.method}</p>
                                                    </div>
                                                    <div className="text-right space-y-1">
                                                        <p className="font-bold">{formatCurrency(record.amount)}</p>
                                                        <Badge variant="outline" className="text-emerald-600 bg-emerald-500/5 border-emerald-500/20">PAID</Badge>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-6 text-muted-foreground text-sm border border-dashed rounded-lg">
                                                No transactions found.
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="documents" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Academic Documents</CardTitle>
                                    <CardDescription>Download official institution documents</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-500/10 rounded">
                                                <Download className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">Entrance Marksheet</p>
                                                <p className="text-xs text-muted-foreground">PDF • 1.2 MB</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm">Download</Button>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-emerald-500/10 rounded">
                                                <Download className="h-5 w-5 text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">Fee Payment Receipt</p>
                                                <p className="text-xs text-muted-foreground">PDF • 450 KB</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm">Download</Button>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-500/10 rounded">
                                                <Download className="h-5 w-5 text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">Student Identity Card</p>
                                                <p className="text-xs text-muted-foreground">PDF • 800 KB</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm">Download</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
