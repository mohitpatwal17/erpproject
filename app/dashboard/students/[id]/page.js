"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_STUDENTS, formatCurrency } from "@/lib/utils";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, BookOpen, GraduationCap, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

const PERFORMANCE_DATA = [
    { subject: 'Data Structures', marks: 85 },
    { subject: 'Algorithms', marks: 78 },
    { subject: 'DBMS', marks: 92 },
    { subject: 'OS', marks: 74 },
    { subject: 'Networks', marks: 88 },
];

export default function StudentProfilePage({ params }) {
    const router = useRouter();
    // In a real app, fetch student by ID. Here we just take the first one or find by ID
    const student = MOCK_STUDENTS.find(s => s.id === params.id) || MOCK_STUDENTS[0];

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-2xl font-bold tracking-tight">Student Profile</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-7">
                {/* Sidebar Info */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardContent className="pt-6 flex flex-col items-center text-center">
                            <Avatar className="h-32 w-32 mb-4">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} />
                                <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <h3 className="text-xl font-bold">{student.name}</h3>
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
                                <span className="truncate">{student.email}</span>
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
                                <span>DOB: {new Date(student.dob).toLocaleDateString()}</span>
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

                {/* Main Content Info */}
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
                                        <CardTitle className="text-sm font-medium">CGPA</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold">8.4</div>
                                        <p className="text-xs text-muted-foreground">Top 10% of class</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">Backlogs</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-emerald-600">0</div>
                                        <p className="text-xs text-muted-foreground">All cleared</p>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Semester Performance</CardTitle>
                                    <CardDescription>Subject-wise marks distribution</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={PERFORMANCE_DATA}>
                                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                            <XAxis dataKey="subject" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'var(--background)', borderRadius: '8px' }}
                                                cursor={{ fill: 'transparent' }}
                                            />
                                            <Bar dataKey="marks" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="attendance" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Attendance History</CardTitle>
                                    <CardDescription>Overall attendance: {student.attendancePercentage}%</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                                        {Array.from({ length: 30 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className={`p-2 rounded ${i % 2 === 0
                                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                                    : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                                                    }`}
                                            >
                                                {i + 1}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-4 mt-4 text-xs">
                                        <div className="flex items-center gap-1">
                                            <div className="w-3 h-3 bg-emerald-100 rounded"></div> Present
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="w-3 h-3 bg-rose-100 rounded"></div> Absent
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
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between items-center p-4 border rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium">Total Fees</p>
                                            <p className="text-2xl font-bold">{formatCurrency(student.totalFees)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Paid Amount</p>
                                            <p className="text-2xl font-bold text-emerald-600">{formatCurrency(student.paidFees)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Due Amount</p>
                                            <p className="text-2xl font-bold text-rose-600">{formatCurrency(student.totalFees - student.paidFees)}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-sm font-medium">Transaction History</p>
                                        <div className="flex justify-between text-sm p-3 bg-muted/50 rounded">
                                            <span>Tuition Fee - Sem 1</span>
                                            <span className="font-mono">15 Jan 2024</span>
                                            <span>{formatCurrency(75000)}</span>
                                            <Badge variant="outline" className="text-emerald-600 border-emerald-600">PAID</Badge>
                                        </div>
                                        <div className="flex justify-between text-sm p-3 bg-muted/50 rounded">
                                            <span>Exam Fee</span>
                                            <span className="font-mono">10 Mar 2024</span>
                                            <span>{formatCurrency(2500)}</span>
                                            <Badge variant="outline" className="text-emerald-600 border-emerald-600">PAID</Badge>
                                        </div>
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
