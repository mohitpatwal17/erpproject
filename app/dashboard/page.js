"use client";

import { useSession } from "next-auth/react";
import { AdminDashboard } from "./_components/admin-dashboard";
import { StudentDashboard } from "./_components/student-dashboard";
import { FacultyDashboard } from "./_components/faculty-dashboard";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-100px)]">
                <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
        );
    }

    if (!session) {
        return null; // DashboardLayout handles redirect
    }

    const role = session.user.role;

    if (role === 'STUDENT') {
        return <StudentDashboard session={session} />;
    }

    if (role === 'FACULTY') {
        return <FacultyDashboard session={session} />;
    }

    // Default to Admin Dashboard (or if role is ADMIN)
    return <AdminDashboard session={session} />;
}
