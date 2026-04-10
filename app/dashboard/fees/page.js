"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    CreditCard,
    Download,
    Search,
    Plus,
    ArrowUpRight,
    Wallet
} from "lucide-react";
import { MOCK_STUDENTS, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function FeesPage() {
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState("");
    const [amount, setAmount] = useState("");

    const handlePayment = (e) => {
        e.preventDefault();
        setIsPaymentOpen(false);
        toast.success("Payment Recorded Successfully", {
            description: `Amount: ${formatCurrency(Number(amount))} • Transaction ID: TXN${Date.now()}`
        });
        setAmount("");
        setSelectedStudent("");
    };

    const totalCollected = MOCK_STUDENTS.reduce((acc, curr) => acc + curr.paidFees, 0);
    const totalPending = MOCK_STUDENTS.reduce((acc, curr) => acc + (curr.totalFees - curr.paidFees), 0);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Fees & Finance</h2>
                <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Record Payment
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Record Fee Payment</DialogTitle>
                            <DialogDescription>
                                Manually record a fee payment for a student.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handlePayment} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="student-id">Student Roll No</Label>
                                <Input
                                    id="student-id"
                                    placeholder="Enter Roll No"
                                    value={selectedStudent}
                                    onChange={(e) => setSelectedStudent(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="amount">Amount</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    placeholder="Enter Amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Payment Type</Label>
                                <Input value="Tuition Fee" disabled />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="method">Payment Method</Label>
                                <Input value="Cash / Cheque" disabled />
                            </div>
                            <div className="flex justify-end mt-4">
                                <Button type="submit">Confirm Payment</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
                        <Wallet className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600">{formatCurrency(totalCollected)}</div>
                        <p className="text-xs text-muted-foreground">+12% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Dues</CardTitle>
                        <Wallet className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-600">{formatCurrency(totalPending)}</div>
                        <p className="text-xs text-muted-foreground">45 Students pending</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Student Fees Status</CardTitle>
                        <div className="flex w-full max-w-sm items-center space-x-2">
                            <Input placeholder="Search Student..." className="max-w-[300px]" />
                            <Button size="icon" variant="ghost">
                                <Search className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Roll No</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Total Fees</TableHead>
                                <TableHead>Paid</TableHead>
                                <TableHead>Pending</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {MOCK_STUDENTS.slice(0, 10).map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell className="font-mono">{student.rollNumber}</TableCell>
                                    <TableCell className="font-medium">{student.name}</TableCell>
                                    <TableCell>{formatCurrency(student.totalFees)}</TableCell>
                                    <TableCell className="text-emerald-600">{formatCurrency(student.paidFees)}</TableCell>
                                    <TableCell className="text-rose-600 font-medium">
                                        {formatCurrency(student.totalFees - student.paidFees)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={student.feeStatus === "PAID" ? "outline" : "secondary"}
                                            className={student.feeStatus === "PAID" ? "text-emerald-600 border-emerald-600" : "text-amber-600 bg-amber-100 dark:bg-amber-900/20"}>
                                            {student.feeStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">
                                            <Download className="mr-2 h-4 w-4" /> Receipt
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
