"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  CalendarCheck, 
  ClipboardList, 
  CreditCard, 
  CalendarDays, 
  Megaphone, 
  BarChart3, 
  ChevronLeft, 
  ChevronRight,
  UserPlus
} from "lucide-react";
import { useState } from "react";

export function Sidebar({ className, session }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const userRole = session?.user?.role;

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      color: "text-sky-500",
      roles: ["ADMIN", "FACULTY", "STUDENT"]
    },
    {
      label: "Create User",
      icon: UserPlus,
      href: "/dashboard/admin/create-user",
      color: "text-emerald-500",
      roles: ["ADMIN"]
    },
    {
      label: "Students",
      icon: Users,
      href: "/dashboard/students",
      color: "text-violet-500",
      roles: ["ADMIN", "FACULTY"]
    },
    {
      label: "Faculty",
      icon: GraduationCap,
      href: "/dashboard/faculty",
      color: "text-pink-700",
      roles: ["ADMIN"]
    },
    {
      label: "Courses",
      icon: BookOpen,
      href: "/dashboard/courses",
      color: "text-orange-700",
      roles: ["ADMIN", "FACULTY"]
    },
    {
      label: "Attendance",
      icon: CalendarCheck,
      href: "/dashboard/attendance",
      color: "text-emerald-500",
      roles: ["ADMIN", "FACULTY", "STUDENT"]
    },
    {
      label: "Exams",
      icon: ClipboardList,
      href: "/dashboard/exams",
      color: "text-green-700",
      roles: ["ADMIN", "FACULTY", "STUDENT"]
    },
    {
      label: "Fees",
      icon: CreditCard,
      href: "/dashboard/fees",
      color: "text-yellow-600",
      roles: ["ADMIN", "STUDENT"]
    },
    {
      label: "Timetable",
      icon: CalendarDays,
      href: "/dashboard/timetable",
      color: "text-blue-700",
      roles: ["ADMIN", "FACULTY", "STUDENT"]
    },
    {
      label: "Announcements",
      icon: Megaphone,
      href: "/dashboard/announcements",
      color: "text-rose-500",
      roles: ["ADMIN", "FACULTY", "STUDENT"]
    },
    {
      label: "My Schedule",
      icon: CalendarDays,
      href: "/dashboard/faculty/schedule",
      color: "text-indigo-600",
      roles: ["FACULTY"]
    },
    {
      label: "Leaves",
      icon: CalendarCheck,
      href: "/dashboard/leaves",
      color: "text-teal-600",
      roles: ["FACULTY", "ADMIN"]
    },
    {
      label: "Payroll",
      icon: CreditCard,
      href: "/dashboard/payroll",
      color: "text-emerald-700",
      roles: ["FACULTY", "ADMIN"]
    },
    {
      label: "Reports",
      icon: BarChart3,
      href: "/dashboard/reports",
      color: "text-cyan-600",
      roles: ["ADMIN"]
    }
  ];

  const filteredRoutes = routes.filter(route => userRole && route.roles.includes(userRole));

  return (
    <div className={cn(
      "space-y-4 py-4 flex flex-col h-full bg-slate-900 text-white transition-all duration-300",
      collapsed ? "w-[80px]" : "w-72",
      className
    )}>
      <div className="px-3 py-2 flex-1">
        <div className="flex items-center justify-between mb-14 pl-2">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center">
              <div className="relative h-8 w-8 mr-4">
                <GraduationCap className="h-8 w-8 text-blue-500" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent bg-clip-text">
                CollegeERP
              </h1>
            </Link>
          )}
          <Button
            onClick={() => setCollapsed(!collapsed)}
            variant="ghost"
            size="icon"
            className={cn("text-white hover:bg-slate-800", collapsed && "mx-auto")}
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>
        <div className="space-y-1">
          {filteredRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400",
                collapsed && "justify-center"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color, collapsed && "mr-0")} />
                {!collapsed && route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}