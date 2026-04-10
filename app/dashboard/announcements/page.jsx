"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { 
    Megaphone, 
    Plus, 
    Bell, 
    Calendar, 
    User, 
    Loader2, 
    Send, 
    Filter,
    AlertCircle,
    Info,
    ShieldAlert
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnnouncementsPage() {
    const { data: session } = useSession();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [filter, setFilter] = useState("ALL");

    // Form state
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [audience, setAudience] = useState("ALL");
    const [priority, setPriority] = useState("MEDIUM");

    const userRole = session?.user?.role;

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/announcements${userRole === 'STUDENT' ? '?audience=STUDENT' : (userRole === 'FACULTY' ? '?audience=FACULTY' : '')}`);
            if (res.ok) {
                const data = await res.json();
                setAnnouncements(data);
            }
        } catch (error) {
            toast.error("Failed to fetch notices");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session) {
            fetchAnnouncements();
        }
    }, [session]);

    const handleCreate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/announcements", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    content,
                    targetAudience: audience,
                    priority
                })
            });
            if (res.ok) {
                toast.success("Announcement published successfully");
                setIsCreateOpen(false);
                setTitle("");
                setContent("");
                fetchAnnouncements();
            }
        } catch (error) {
            toast.error("Failed to publish announcement");
        } finally {
            setIsSubmitting(false);
        }
    };

    const sortedAnnouncements = [...announcements].filter(a => 
        filter === "ALL" || a.priority === filter
    );

    const getPriorityColor = (p) => {
        switch (p) {
            case "HIGH": return "bg-destructive/10 text-destructive border-destructive/20";
            case "MEDIUM": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
            case "LOW": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
            default: return "";
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-64" />
                <div className="grid gap-6">
                    {[1,2,3].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black tracking-tight flex items-center gap-3">
                        <Megaphone className="h-10 w-10 text-primary" />
                        Notice Board
                    </h2>
                    <p className="text-muted-foreground text-lg">Important institutional updates and broadcasts</p>
                </div>

                <div className="flex items-center gap-3">
                    <Select value={filter} onValueChange={setFilter}>
                        <SelectTrigger className="w-[180px] h-11 bg-background border-none shadow-md">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Priority Filter" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Priorities</SelectItem>
                            <SelectItem value="HIGH">High Priority</SelectItem>
                            <SelectItem value="MEDIUM">Medium Priority</SelectItem>
                            <SelectItem value="LOW">Low Priority</SelectItem>
                        </SelectContent>
                    </Select>

                    {userRole === "ADMIN" && (
                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button size="lg" className="shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                    <Plus className="mr-2 h-5 w-5" /> Broadcast Notice
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px] border-none shadow-2xl">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                                        <Bell className="h-6 w-6 text-primary" />
                                        New Announcement
                                    </DialogTitle>
                                    <DialogDescription>
                                        Draft an official communication for the institution.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleCreate} className="space-y-6 mt-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Main Title</label>
                                        <Input 
                                            value={title} 
                                            onChange={(e) => setTitle(e.target.value)} 
                                            placeholder="Enter descriptive title" 
                                            className="h-12 text-lg font-semibold"
                                            required 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Message Content</label>
                                        <Textarea 
                                            value={content} 
                                            onChange={(e) => setContent(e.target.value)} 
                                            placeholder="Details of the announcement..." 
                                            className="min-h-[120px] resize-none"
                                            required 
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Audience</label>
                                            <Select value={audience} onValueChange={setAudience}>
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
                                            <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Urgency</label>
                                            <Select value={priority} onValueChange={setPriority}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="HIGH">High Priority</SelectItem>
                                                    <SelectItem value="MEDIUM">Medium Priority</SelectItem>
                                                    <SelectItem value="LOW">Low Priority</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full h-12 text-lg font-bold shadow-xl shadow-primary/20" disabled={isSubmitting}>
                                        {isSubmitting ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : <Send className="mr-2 h-5 w-5" />}
                                        Publish To Board
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </div>

            <div className="grid gap-6">
                {sortedAnnouncements.length > 0 ? (
                    sortedAnnouncements.map((ann) => (
                        <Card key={ann.id} className="border-none shadow-lg bg-card/50 backdrop-blur-sm group hover:scale-[1.005] transition-all overflow-hidden">
                            <div className={`h-1.5 w-full ${
                                ann.priority === 'HIGH' ? 'bg-destructive' : 
                                (ann.priority === 'MEDIUM' ? 'bg-amber-500' : 'bg-blue-500')
                            }`} />
                            <CardHeader className="pb-3">
                                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                                    <Badge variant="outline" className={`${getPriorityColor(ann.priority)} px-3 py-1 font-black text-[10px] tracking-tighter uppercase`}>
                                        {ann.priority} Priority
                                    </Badge>
                                    <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground">
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {format(new Date(ann.createdAt), "MMM dd, yyyy • hh:mm a")}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <User className="h-3.5 w-3.5" />
                                            By {ann.author}
                                        </span>
                                    </div>
                                </div>
                                <CardTitle className="text-2xl font-black group-hover:text-primary transition-colors">{ann.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                    {ann.content}
                                </p>
                                <div className="mt-6 flex items-center justify-between border-t pt-4">
                                    <div className="flex items-center gap-2">
                                        {ann.targetAudience === 'ALL' && <Badge variant="secondary" className="px-2 py-0.5 text-[10px]">Global Public</Badge>}
                                        {ann.targetAudience === 'STUDENT' && <Badge variant="secondary" className="px-2 py-0.5 text-[10px] bg-indigo-500/10 text-indigo-600">Students Only</Badge>}
                                        {ann.targetAudience === 'FACULTY' && <Badge variant="secondary" className="px-2 py-0.5 text-[10px] bg-amber-500/10 text-amber-600">Faculty Only</Badge>}
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                                        Pin to Dashboard
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="py-24 text-center border-2 border-dashed rounded-3xl space-y-4 bg-muted/20">
                        <div className="p-4 bg-background w-fit mx-auto rounded-full shadow-lg">
                            <Info className="h-10 w-10 text-muted" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-2xl font-bold">No active announcements</h3>
                            <p className="text-muted-foreground">New updates from the administration will appear here.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
