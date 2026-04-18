"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Download, Eye, DollarSign, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

// Mock Data
const SALARY_HISTORY = [
    { id: 'SAL-001', month: 'January 2025', date: '2025-01-31', amount: 85000, status: 'PAID', transactionId: 'TXN123456' },
    { id: 'SAL-002', month: 'December 2024', date: '2024-12-31', amount: 85000, status: 'PAID', transactionId: 'TXN987654' },
    { id: 'SAL-003', month: 'November 2024', date: '2024-11-30', amount: 85000, status: 'PAID', transactionId: 'TXN456123' },
];

const SALARY_STRUCTURE = [
    { name: 'Basic Pay', value: 45000 },
    { name: 'HRA', value: 20000 },
    { name: 'Allowances', value: 15000 },
    { name: 'Bonus', value: 5000 },
];

const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b'];

export default function PayrollPage() {
    const [selectedSlip, setSelectedSlip] = useState(null);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Payroll & Salary</h2>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-none">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-emerald-100">Net Salary (Jan)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">₹85,000</div>
                        <p className="text-xs text-emerald-100 mt-1 flex items-center">
                            <ArrowUpRight className="w-3 h-3 mr-1" /> Credited on 31st Jan
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Annual Package (CTC)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">₹12.5 LPA</div>
                        <p className="text-xs text-muted-foreground mt-1">Inclusive of all bonuses</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Tax Deducted (TDS)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">₹8,500</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center text-rose-600">
                            Deducted this month
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Salary Slip List */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Payslip History</CardTitle>
                        <CardDescription>View and download your monthly salary slips.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {SALARY_HISTORY.map((slip) => (
                                <div key={slip.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-primary/10 p-2 rounded-full">
                                            <DollarSign className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{slip.month}</p>
                                            <p className="text-xs text-muted-foreground">Paid on {slip.date} • {slip.transactionId}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="font-bold">{formatCurrency(slip.amount)}</div>
                                        <Badge className="bg-emerald-600">PAID</Badge>

                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" size="icon" onClick={() => setSelectedSlip(slip)}>
                                                    <Eye className="w-4 h-4 text-muted-foreground" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-md">
                                                <DialogHeader>
                                                    <DialogTitle>Payslip - {slip.month}</DialogTitle>
                                                    <DialogDescription>Transaction ID: {slip.transactionId}</DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    <div className="border rounded-lg p-4 space-y-3 bg-muted/20">
                                                        <div className="flex justify-between">
                                                            <span className="text-muted-foreground">Basic Pay</span>
                                                            <span className="font-medium">₹45,000</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-muted-foreground">HRA</span>
                                                            <span className="font-medium">₹20,000</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-muted-foreground">Special Allowance</span>
                                                            <span className="font-medium">₹15,000</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-muted-foreground">Performance Bonus</span>
                                                            <span className="font-medium">₹5,000</span>
                                                        </div>
                                                        <div className="border-t pt-2 mt-2"></div>
                                                        <div className="flex justify-between text-lg font-bold">
                                                            <span>Gross Salary</span>
                                                            <span>₹85,000</span>
                                                        </div>
                                                    </div>
                                                    <Button className="w-full">
                                                        <Download className="w-4 h-4 mr-2" /> Download PDF
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>


            </div>
        </div>
    );
}
