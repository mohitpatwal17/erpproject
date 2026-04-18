"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { Plus, Search, Receipt, CreditCard, Wallet, Banknote, Loader2, Download, AlertCircle, CheckCircle2, FileDown } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

// Dynamic import for PDF bridge component to avoid SSR/Turbopack issues
const FeeReceiptButton = dynamic(
    () => import("@/components/pdf/fee-receipt-button"),
    { ssr: false, loading: () => <Button variant="outline" size="sm" disabled><Loader2 className="h-4 w-4 animate-spin mr-1" />Loading...</Button> }
);

export default function FeesPage() {
    const { data: session } = useSession();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPayOpen, setIsPayOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Form state
    const [amount, setAmount] = useState("");
    const [type, setType] = useState("Tuition Fee");
    const [method, setMethod] = useState("Cash");

    const userRole = session?.user?.role;

    const fetchFeesData = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/fees");
            if (res.ok) {
                const data = await res.json();
                setStudents(data);
            }
        } catch (error) {
            toast.error("Failed to load financial records");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session) {
            fetchFeesData();
        }
    }, [session]);

    const handlePayment = async (e) => {
        e.preventDefault();
        if (!amount || parseFloat(amount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/fees", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    studentId: selectedStudent.id,
                    amount: parseFloat(amount),
                    type,
                    method
                })
            });

            if (res.ok) {
                toast.success("Payment recorded successfully");
                setIsPayOpen(false);
                setSelectedStudent(null);
                setAmount("");
                fetchFeesData();
            } else {
                toast.error("Failed to process payment");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredStudents = students.filter(s => 
        s.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-64" />
                <div className="grid gap-4 md:grid-cols-3">
                    <Skeleton className="h-32 w-full rounded-xl" />
                    <Skeleton className="h-32 w-full rounded-xl" />
                    <Skeleton className="h-32 w-full rounded-xl" />
                </div>
                <Skeleton className="h-96 w-full rounded-xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter">Finance & Fee Ledger</h2>
                    <p className="text-muted-foreground">Manage student payments and institutional revenue</p>
                </div>
            </div>

            {/* Quick Stats (Only for non-students) */}
            {userRole !== "STUDENT" && (
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="border-none shadow-lg bg-emerald-500/5">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-emerald-600">Total Collection</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black">
                                {formatCurrency(students.reduce((acc, s) => acc + s.paidFees, 0))}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-lg bg-amber-500/5">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-amber-600">Outstanding Dues</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-amber-600">
                                {formatCurrency(students.reduce((acc, s) => acc + (s.totalFees - s.paidFees), 0))}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-lg bg-blue-500/5">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-blue-600">Fee Compliance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-blue-600">
                                {Math.round((students.filter(s => s.feeStatus === "PAID").length / (students.length || 1)) * 100)}%
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            <Card className="border-none shadow-xl transition-all hover:shadow-2xl">
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle className="flex items-center gap-2">
                            <Banknote className="h-5 w-5 text-primary" />
                            {userRole === "STUDENT" ? "My Financial Statements" : "Student Payment Registry"}
                        </CardTitle>
                        {userRole !== "STUDENT" && (
                            <div className="relative w-full md:w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search by name or roll no..." 
                                    className="pl-9 bg-muted/30 border-none h-10 rounded-full"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-2xl border bg-background/50 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>Student Details</TableHead>
                                    <TableHead>Total Fee</TableHead>
                                    <TableHead>Paid Amount</TableHead>
                                    <TableHead>Balance</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map((student) => (
                                        <TableRow key={student.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-bold">{student.user.name}</span>
                                                    <span className="text-xs text-muted-foreground font-mono">{student.rollNumber}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium">{formatCurrency(student.totalFees)}</TableCell>
                                            <TableCell className="font-medium text-emerald-600">{formatCurrency(student.paidFees)}</TableCell>
                                            <TableCell className="font-bold text-destructive">
                                                {formatCurrency(student.totalFees - student.paidFees)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge 
                                                    className={
                                                        student.feeStatus === "PAID" 
                                                            ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20" 
                                                            : student.feeStatus === "PARTIAL" 
                                                            ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                                                            : "bg-destructive/10 text-destructive hover:bg-destructive/20"
                                                    }
                                                >
                                                    {student.feeStatus}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right flex items-center justify-end gap-2">
                                                {student.feeRecords?.length > 0 && (
                                                    <FeeReceiptButton student={student} transaction={student.feeRecords[0]} />
                                                )}
                                                {userRole !== "STUDENT" ? (
                                                    <Button 
                                                        size="sm" 
                                                        onClick={() => {
                                                            setSelectedStudent(student);
                                                            setIsPayOpen(true);
                                                        }}
                                                        disabled={student.feeStatus === "PAID"}
                                                        className="shadow-sm active:scale-95 transition-transform"
                                                    >
                                                        <Wallet className="h-4 w-4 mr-1.5" /> Record Payment
                                                    </Button>
                                                ) : (
                                                    <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/students/${student.id}`)}>
                                                        <Receipt className="h-4 w-4 mr-1.5" /> View Receipts
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground italic">
                                            No financial records found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Payment Dialog */}
            <Dialog open={isPayOpen} onOpenChange={setIsPayOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-primary" />
                            Record Fee Payment
                        </DialogTitle>
                        <DialogDescription>
                            Accepting payment for <span className="font-bold text-foreground">{selectedStudent?.user.name}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handlePayment} className="space-y-6 mt-4">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Due Balance</p>
                                    <p className="text-lg font-black text-destructive">
                                        {selectedStudent ? formatCurrency(selectedStudent.totalFees - selectedStudent.paidFees) : "₹0"}
                                    </p>
                                </div>
                                <div className="p-3 bg-primary/5 rounded-lg">
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Enrollment</p>
                                    <p className="text-sm font-bold font-mono">{selectedStudent?.rollNumber}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Amount to Pay (INR)</label>
                                <Input 
                                    type="number" 
                                    placeholder="Enter amount" 
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="h-12 text-lg font-bold"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Fee Category</label>
                                    <Select value={type} onValueChange={setType}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Tuition Fee">Tuition Fee</SelectItem>
                                            <SelectItem value="Exam Fee">Exam Fee</SelectItem>
                                            <SelectItem value="Library Fee">Library Fee</SelectItem>
                                            <SelectItem value="Hostel Fee">Hostel Fee</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Payment Method</label>
                                    <Select value={method} onValueChange={setMethod}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select method" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Cash">Cash</SelectItem>
                                            <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                            <SelectItem value="Cheque">Cheque</SelectItem>
                                            <SelectItem value="Online Payment">Online Payment</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-12 shadow-xl shadow-primary/20 font-bold text-lg" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CheckCircle2 className="mr-2 h-5 w-5" />}
                            Confirm Transaction
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
