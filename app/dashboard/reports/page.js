"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Download,
    FileText,
    TrendingUp,
    CreditCard,
    Users
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    Legend
} from "recharts";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";

const ATTENDANCE_TREND = [
    { month: 'Jan', avg: 85 },
    { month: 'Feb', avg: 82 },
    { month: 'Mar', avg: 88 },
    { month: 'Apr', avg: 80 },
    { month: 'May', avg: 84 },
];

const PERFORMANCE_DATA = [
    { course: 'CSE', avgMarks: 82 },
    { course: 'ECE', avgMarks: 78 },
    { course: 'MECH', avgMarks: 75 },
    { course: 'CIVIL', avgMarks: 79 },
];

const FEE_COLLECTION_DATA = [
    { month: 'Jan', collected: 4000000 },
    { month: 'Feb', collected: 2500000 },
    { month: 'Mar', collected: 1500000 },
    { month: 'Apr', collected: 3000000 },
];

export default function ReportsPage() {
    const handleExport = (format, report) => {
        toast.success(`Exporting ${report} as ${format}`, {
            description: "Download will start shortly..."
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>
                <Select defaultValue="2024-25">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Academic Year" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="2024-25">Academic Year 2024-25</SelectItem>
                        <SelectItem value="2023-24">Academic Year 2023-24</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Tabs defaultValue="attendance" className="w-full">
                <TabsList>
                    <TabsTrigger value="attendance">Attendance</TabsTrigger>
                    <TabsTrigger value="performance">Academic Performance</TabsTrigger>
                    <TabsTrigger value="finance">Fee Collection</TabsTrigger>
                </TabsList>

                <TabsContent value="attendance" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Attendance Trend</CardTitle>
                            <CardDescription>Average student attendance percentage by month.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={350}>
                                <LineChart data={ATTENDANCE_TREND}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--background)', borderRadius: '8px' }}
                                        itemStyle={{ color: 'var(--foreground)' }}
                                    />
                                    <Line type="monotone" dataKey="avg" stroke="var(--color-primary)" strokeWidth={2} activeDot={{ r: 8 }} name="Avg Attendance %" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2 bg-muted/10 pt-4">
                            <Button variant="outline" size="sm" onClick={() => handleExport("PDF", "Attendance Report")}>
                                <FileText className="mr-2 h-4 w-4" /> Export PDF
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleExport("CSV", "Attendance Report")}>
                                <Download className="mr-2 h-4 w-4" /> Export CSV
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="performance" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Department-wise Performance</CardTitle>
                            <CardDescription>Average aggregate marks across departments.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={PERFORMANCE_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis dataKey="course" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--background)', borderRadius: '8px' }}
                                        cursor={{ fill: 'transparent' }}
                                    />
                                    <Bar dataKey="avgMarks" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} name="Average Marks" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2 bg-muted/10 pt-4">
                            <Button variant="outline" size="sm" onClick={() => handleExport("PDF", "Performance Report")}>
                                <FileText className="mr-2 h-4 w-4" /> Export PDF
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="finance" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Fee Collection Analysis</CardTitle>
                            <CardDescription>Monthly revenue collection trend.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={FEE_COLLECTION_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val / 100000}L`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--background)', borderRadius: '8px' }}
                                        formatter={(value) => [`₹${(value).toLocaleString()}`, "Collected"]}
                                        cursor={{ fill: 'transparent' }}
                                    />
                                    <Bar dataKey="collected" fill="var(--color-chart-3)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2 bg-muted/10 pt-4">
                            <Button variant="outline" size="sm" onClick={() => handleExport("CSV", "Financial Report")}>
                                <Download className="mr-2 h-4 w-4" /> Export Ledger
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
