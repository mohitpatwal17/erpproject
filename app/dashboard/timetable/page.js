"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const TIMES = ['09:00', '10:00', '11:00', '12:00', '01:00', '02:00', '03:00', '04:00'];

const MOCK_TIMETABLE = {
    'Mon': {
        '09:00': { subject: 'Data Structures', type: 'Lecture', room: 'LH-101', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
        '11:00': { subject: 'DBMS', type: 'Lecture', room: 'LH-101', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
        '02:00': { subject: 'OS Lab', type: 'Lab', room: 'LAB-2', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300', span: 2 },
    },
    'Tue': {
        '10:00': { subject: 'Algorithms', type: 'Lecture', room: 'LH-102', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
        '12:00': { subject: 'Computer Networks', type: 'Lecture', room: 'LH-102', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300' },
    },
    // ... more mock data
};

export default function TimetablePage() {
    const [selectedCourse, setSelectedCourse] = useState("cse");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleAddSlot = (e) => {
        e.preventDefault();
        setIsDialogOpen(false);
        toast.success("Time Slot Added", {
            description: "Timetable updated successfully."
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-3xl font-bold tracking-tight">Timetable</h2>

                <div className="flex items-center space-x-2">
                    <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Course" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="cse">B.Tech CSE - Sem 4</SelectItem>
                            <SelectItem value="ece">B.Tech ECE - Sem 4</SelectItem>
                        </SelectContent>
                    </Select>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Add Slot
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Timetable Slot</DialogTitle>
                                <DialogDescription>Create a new theory or lab session.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAddSlot} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Day</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Day" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {DAYS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Time</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Time" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {TIMES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Subject</Label>
                                    <Input placeholder="e.g. Data Structures" required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Room No</Label>
                                    <Input placeholder="e.g. LH-101" required />
                                </div>
                                <Button type="submit" className="w-full">Create Slot</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Weekly Schedule</CardTitle>
                    <CardDescription>Academic timetable for {selectedCourse === 'cse' ? 'Computer Science' : 'Electronics'}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative overflow-x-auto rounded-lg border">
                        {/* Header */}
                        <div className="grid grid-cols-6 border-b bg-muted/50 min-w-[800px]">
                            <div className="p-4 font-medium text-muted-foreground flex items-center justify-center border-r">
                                <Clock className="h-4 w-4" />
                            </div>
                            {DAYS.map(day => (
                                <div key={day} className="p-4 text-center font-bold text-sm border-r last:border-0">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Grid */}
                        <div className="min-w-[800px]">
                            {TIMES.map((time) => (
                                <div key={time} className="grid grid-cols-6 border-b last:border-0 hover:bg-muted/5 transition-colors">
                                    <div className="p-4 text-xs font-mono text-muted-foreground border-r flex items-center justify-center bg-muted/10">
                                        {time}
                                    </div>
                                    {DAYS.map(day => {
                                        const slot = MOCK_TIMETABLE[day]?.[time];
                                        return (
                                            <div key={`${day}-${time}`} className="p-1 min-h-[80px] border-r last:border-0 relative">
                                                {slot && (
                                                    <div className={cn(
                                                        "absolute inset-1 rounded-md p-2 text-xs flex flex-col justify-between cursor-pointer hover:opacity-90 transition-opacity shadow-sm border border-black/5",
                                                        slot.color
                                                    )}>
                                                        <div className="font-bold truncate">{slot.subject}</div>
                                                        <div className="flex justify-between items-center opacity-80">
                                                            <span>{slot.room}</span>
                                                            <span className="uppercase text-[10px] border border-current rounded px-1">{slot.type}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
