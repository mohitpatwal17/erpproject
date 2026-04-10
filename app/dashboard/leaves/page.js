"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Plus, CheckCircle2, XCircle, Clock, CalendarDays, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Mock Data
const LEAVE_BALANCES = [
    { type: 'Casual Leave (CL)', balance: 8, total: 12, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/20' },
    { type: 'Sick Leave (SL)', balance: 5, total: 10, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/20' },
    { type: 'Earned Leave (EL)', balance: 15, total: 20, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20' },
];

const LEAVE_HISTORY = [
    { id: 1, type: 'Sick Leave', from: '2025-01-10', to: '2025-01-12', days: 3, reason: 'Viral Fever', status: 'APPROVED' },
    { id: 2, type: 'Casual Leave', from: '2025-02-05', to: '2025-02-05', days: 1, reason: 'Personal Work', status: 'PENDING' },
    { id: 3, type: 'Earned Leave', from: '2024-12-20', to: '2024-12-25', days: 6, reason: 'Family Vacation', status: 'REJECTED' },
];

const HOLIDAYS = [
    { date: '2025-01-26', name: 'Republic Day', day: 'Sunday' },
    { date: '2025-03-14', name: 'Holi', day: 'Friday' },
    { date: '2025-04-10', name: 'Id-ul-Fitr', day: 'Thursday' },
    { date: '2025-08-15', name: 'Independence Day', day: 'Friday' },
    { date: '2025-10-02', name: 'Gandhi Jayanti', day: 'Thursday' },
    { date: '2025-10-20', name: 'Diwali', day: 'Monday' },
    { date: '2025-12-25', name: 'Christmas', day: 'Thursday' },
];

export default function LeavesPage() {
    const [date, setDate] = useState();
    const [isOpen, setIsOpen] = useState(false);

    // Form State
    const [leaveType, setLeaveType] = useState("");
    const [reason, setReason] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsOpen(false);
        toast.success("Leave Application Submitted", {
            description: "Your request has been sent to the admin for approval."
        });
        // Reset form
        setLeaveType("");
        setReason("");
        setDate(undefined);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'APPROVED': return <Badge className="bg-emerald-600 hover:bg-emerald-700"><CheckCircle2 className="w-3 h-3 mr-1" /> Approved</Badge>;
            case 'REJECTED': return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
            default: return <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Leave Management</h2>

            <Tabs defaultValue="myleaves" className="w-full">
                <TabsList>
                    <TabsTrigger value="myleaves">My Leaves</TabsTrigger>
                    <TabsTrigger value="holidays">Holiday Calendar</TabsTrigger>
                </TabsList>

                <TabsContent value="myleaves" className="space-y-6">
                    {/* Balance Cards */}
                    <div className="grid gap-4 md:grid-cols-3">
                        {LEAVE_BALANCES.map((leave) => (
                            <Card key={leave.type} className="border-l-4 border-l-primary">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">{leave.type}</CardTitle>
                                        <CalendarDays className={cn("h-4 w-4", leave.color.split(' ')[0])} />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{leave.balance} <span className="text-sm text-muted-foreground font-normal">/ {leave.total}</span></div>
                                    <p className="text-xs text-muted-foreground mt-1">Days Remaining</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Applications List */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Leave Applications</CardTitle>
                                <CardDescription>Track your recent leave requests.</CardDescription>
                            </div>
                            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" /> Apply for Leave
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>New Leave Request</DialogTitle>
                                        <DialogDescription>Submit a new leave application to the administration.</DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Leave Type</Label>
                                            <Select onValueChange={setLeaveType} required>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="cl">Casual Leave</SelectItem>
                                                    <SelectItem value="sl">Sick Leave</SelectItem>
                                                    <SelectItem value="el">Earned Leave</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Dates</Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Reason</Label>
                                            <Textarea
                                                placeholder="Please briefly explain the reason..."
                                                value={reason}
                                                onChange={(e) => setReason(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <Button type="submit" className="w-full">Submit Application</Button>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {LEAVE_HISTORY.map((leave) => (
                                    <div key={leave.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                        <div className="space-y-1">
                                            <p className="font-medium">{leave.type}</p>
                                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                                                <span>{leave.from}</span>
                                                <ArrowRight className="h-3 w-3" />
                                                <span>{leave.to}</span>
                                                <span className="text-xs bg-muted px-2 py-0.5 rounded-full">({leave.days} days)</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground italic">"{leave.reason}"</p>
                                        </div>
                                        <div>
                                            {getStatusBadge(leave.status)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="holidays">
                    <Card>
                        <CardHeader>
                            <CardTitle>Holiday Calendar 2025</CardTitle>
                            <CardDescription>List of public holidays for the academic year.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {HOLIDAYS.map((holiday, index) => (
                                    <div key={index} className="flex items-center p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                                        <div className="bg-primary/10 text-primary p-3 rounded-lg mr-4 text-center min-w-[60px]">
                                            <div className="text-xl font-bold">{holiday.date.split('-')[2]}</div>
                                            <div className="text-xs uppercase font-semibold">{new Date(holiday.date).toLocaleString('default', { month: 'short' })}</div>
                                        </div>
                                        <div>
                                            <div className="font-medium">{holiday.name}</div>
                                            <div className="text-sm text-muted-foreground">{holiday.day}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
