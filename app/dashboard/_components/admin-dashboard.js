"use client";

import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Users,
    GraduationCap,
    CalendarCheck,
    CreditCard,
    Activity
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";

const ATTENDANCE_DATA = [
    { name: 'Mon', present: 850, absent: 50 },
    { name: 'Tue', present: 870, absent: 30 },
    { name: 'Wed', present: 840, absent: 60 },
    { name: 'Thu', present: 880, absent: 20 },
    { name: 'Fri', present: 860, absent: 40 },
    { name: 'Sat', present: 820, absent: 80 },
];

const FEE_DATA = [
    { name: 'Paid', value: 7500000 },
    { name: 'Due', value: 2500000 },
];

const COLORS = ['#10b981', '#f43f5e'];

const RECENT_ACTIVITY = [
    { id: 1, text: "New student registration: Rahul Kumar", time: "2 mins ago" },
    { id: 2, text: "Attendance marked for CSE-A", time: "15 mins ago" },
    { id: 3, text: "Fee payment received: ₹50,000", time: "1 hour ago" },
    { id: 4, text: "Exam schedule published for B.Tech", time: "3 hours ago" },
    { id: 5, text: "New announcement: Holiday Notice", time: "5 hours ago" },
];

export function AdminDashboard() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                    Admin Overview
                </h2>
                <p className="text-sm text-muted-foreground">
                    Overall School Performance
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Students"
                    value="1,250"
                    icon={Users}
                    description="Active students"
                    trend="+5.2%"
                    trendUp={true}
                    href="/dashboard/students"
                    className="border-l-violet-500 shadow-sm hover:shadow-md transition-all"
                />
                <StatCard
                    title="Total Faculty"
                    value="85"
                    icon={GraduationCap}
                    description="Professors & Staff"
                    trend="+2.1%"
                    trendUp={true}
                    href="/dashboard/faculty"
                    className="border-l-pink-500 shadow-sm hover:shadow-md transition-all"
                />
                <StatCard
                    title="Attendance Today"
                    value="92%"
                    icon={CalendarCheck}
                    description="Average attendance"
                    trend="-1.5%"
                    trendUp={false}
                    href="/dashboard/attendance"
                    className="border-l-emerald-500 shadow-sm hover:shadow-md transition-all"
                />
                <StatCard
                    title="Fees Collection"
                    value="₹75L"
                    icon={CreditCard}
                    description="Total collected"
                    trend="+12%"
                    trendUp={true}
                    href="/dashboard/fees"
                    className="border-l-yellow-500 shadow-sm hover:shadow-md transition-all"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Attendance Trend Chart */}
                <Card className="col-span-4 border-none shadow-md">
                    <CardHeader>
                        <CardTitle>Attendance Overview</CardTitle>
                        <CardDescription>Weekly student attendance trends</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={ATTENDANCE_DATA}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis
                                    dataKey="name"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--background)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ color: 'var(--foreground)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="present"
                                    stroke="#8b5cf6"
                                    strokeWidth={3}
                                    activeDot={{ r: 8 }}
                                    name="Present"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="absent"
                                    stroke="#ef4444"
                                    strokeWidth={3}
                                    name="Absent"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Fees Pie Chart */}
                <Card className="col-span-3 border-none shadow-md">
                    <CardHeader>
                        <CardTitle>Financial Overview</CardTitle>
                        <CardDescription>Fees Paid vs Pending</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={FEE_DATA}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {FEE_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `₹${(Number(value) / 100000).toFixed(1)}L`}
                                    contentStyle={{ backgroundColor: 'var(--background)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity Feed */}
            <Card className="border-none shadow-md">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Activity className="mr-2 h-5 w-5 text-blue-500" />
                        Recent Activity
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {RECENT_ACTIVITY.map((activity) => (
                            <div key={activity.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0 hover:bg-muted/50 p-2 rounded-lg transition-colors">
                                <div className="flex items-center space-x-3">
                                    <div className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
                                    <p className="text-sm font-medium">{activity.text}</p>
                                </div>
                                <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
