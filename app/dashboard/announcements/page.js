"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
    Clock,
    Users,
    GraduationCap,
    Globe,
    Plus,
    Trash2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MOCK_ANNOUNCEMENTS } from "@/lib/utils";
import { Announcement } from "@/lib/types";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AnnouncementsPage() {
    const [announcements, setAnnouncements] = useState(MOCK_ANNOUNCEMENTS);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newAnnouncement, setNewAnnouncement] = useState({
        title: "",
        content: "",
        targetAudience: "ALL",
        priority: "MEDIUM"
    });

    const handleCreate = (e) => {
        e.preventDefault();
        const announcement = {
            id: Date.now().toString(),
            title: newAnnouncement.title,
            content: newAnnouncement.content,
            targetAudience: newAnnouncement.targetAudience,
            priority: newAnnouncement.priority,
            date: new Date().toISOString().split('T')[0],
            author: "Admin"
        };

        setAnnouncements([announcement, ...announcements]);
        setIsDialogOpen(false);
        setNewAnnouncement({ title: "", content: "", targetAudience: "ALL", priority: "MEDIUM" });
        toast.success("Announcement Posted Successfully");
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'HIGH': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400';
            case 'MEDIUM': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400';
            case 'LOW': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getAudienceIcon = (audience) => {
        switch (audience) {
            case 'STUDENT': return <Users className="h-4 w-4 mr-1" />;
            case 'FACULTY': return <GraduationCap className="h-4 w-4 mr-1" />;
            default: return <Globe className="h-4 w-4 mr-1" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Announcements</h2>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Create Notice
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Post New Announcement</DialogTitle>
                            <DialogDescription>Create a notice for students or faculty.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input
                                    value={newAnnouncement.title}
                                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                                    required
                                    placeholder="e.g. Exam Schedule Release"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Content</Label>
                                <Textarea
                                    value={newAnnouncement.content}
                                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                                    required
                                    placeholder="Enter detailed information..."
                                    rows={4}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Target Audience</Label>
                                    <Select
                                        value={newAnnouncement.targetAudience}
                                        onValueChange={(val) => setNewAnnouncement({ ...newAnnouncement, targetAudience: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ALL">Everyone</SelectItem>
                                            <SelectItem value="STUDENT">Students Only</SelectItem>
                                            <SelectItem value="FACULTY">Faculty Only</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Priority</Label>
                                    <Select
                                        value={newAnnouncement.priority}
                                        onValueChange={(val) => setNewAnnouncement({ ...newAnnouncement, priority: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="HIGH">High Priority</SelectItem>
                                            <SelectItem value="MEDIUM">Medium</SelectItem>
                                            <SelectItem value="LOW">Low</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button type="submit" className="w-full">Publish Notice</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6">
                {announcements.map((announcement) => (
                    <Card key={announcement.id} className="relative overflow-hidden transition-shadow hover:shadow-md">
                        <div className={cn("absolute left-0 top-0 bottom-0 w-1",
                            announcement.priority === 'HIGH' ? 'bg-rose-500' :
                                announcement.priority === 'MEDIUM' ? 'bg-amber-500' : 'bg-blue-500'
                        )} />
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider", getPriorityColor(announcement.priority))}>
                                            {announcement.priority}
                                        </span>
                                        <span className="text-xs text-muted-foreground flex items-center">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {announcement.date}
                                        </span>
                                    </div>
                                    <CardTitle className="text-xl">{announcement.title}</CardTitle>
                                </div>
                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {announcement.content}
                            </p>
                        </CardContent>
                        <CardFooter className="bg-muted/50 py-2 px-6 flex justify-between items-center">
                            <div className="flex items-center text-xs text-muted-foreground">
                                <span className="font-medium mr-1">To:</span>
                                <span className="flex items-center bg-background border px-2 py-0.5 rounded shadow-sm">
                                    {getAudienceIcon(announcement.targetAudience)}
                                    {announcement.targetAudience}
                                </span>
                            </div>
                            <div className="text-xs text-muted-foreground italic">
                                Posted by {announcement.author}
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
