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
  UserPlus,
  ShieldCheck,
  Building2,
  FileText
} from "lucide-react";
import { useState } from "react";

export function Sidebar({ className, user }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const userRole = user?.role;

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      color: "text-sky-400",
      roles: ["ADMIN", "FACULTY", "STUDENT"]
    },
    {
      label: "User Management",
      icon: UserPlus,
      href: "/dashboard/admin/create-user",
      color: "text-emerald-400",
      roles: ["ADMIN"]
    },
    {
      label: "Students",
      icon: Users,
      href: "/dashboard/students",
      color: "text-violet-400",
      roles: ["ADMIN", "FACULTY"]
    },
    {
      label: "Faculty",
      icon: GraduationCap,
      href: "/dashboard/faculty",
      color: "text-pink-400",
      roles: ["ADMIN"]
    },
    {
      label: "Department",
      icon: Building2,
      href: "/dashboard/department",
      color: "text-orange-400",
      roles: ["ADMIN"]
    },
    {
      label: "Attendance",
      icon: CalendarCheck,
      href: "/dashboard/attendance",
      color: "text-emerald-400",
      roles: ["ADMIN", "FACULTY", "STUDENT"]
    },
    {
      label: "Exams & Results",
      icon: ClipboardList,
      href: "/dashboard/exams",
      color: "text-green-400",
      roles: ["ADMIN", "FACULTY", "STUDENT"]
    },
    {
      label: "Financial Ledger",
      icon: CreditCard,
      href: "/dashboard/fees",
      color: "text-amber-400",
      roles: ["ADMIN", "STUDENT"]
    },
    {
      label: "Class Schedule",
      icon: CalendarDays,
      href: "/dashboard/timetable",
      color: "text-blue-400",
      roles: ["ADMIN", "FACULTY", "STUDENT"]
    },
    {
      label: "Notice Board",
      icon: Megaphone,
      href: "/dashboard/announcements",
      color: "text-rose-400",
      roles: ["ADMIN", "FACULTY", "STUDENT"]
    },
    {
        label: "Faculty Logs",
        icon: FileText,
        href: "/dashboard/faculty/logs",
        color: "text-indigo-400",
        roles: ["FACULTY"]
    },
    {
      label: "Institutional Reports",
      icon: BarChart3,
      href: "/dashboard/reports",
      color: "text-cyan-400",
      roles: ["ADMIN"]
    }
  ];

  const filteredRoutes = routes.filter(route => userRole && route.roles.includes(userRole));

  return (
    <div className={cn(
      "relative flex flex-col h-full bg-[#0f172a] text-white transition-all duration-500 ease-in-out border-r border-white/5 shadow-2xl overflow-hidden",
      collapsed ? "w-20" : "w-72",
      className
    )}>
      {/* Decorative Blur */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[30%] bg-blue-500/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[30%] bg-emerald-500/10 blur-[100px] rounded-full" />

      <div className="px-4 py-6 flex-1 flex flex-col relative z-10">
        <div className="flex items-center justify-between mb-10 px-2">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center space-x-3 group">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-900/40 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-black tracking-tighter bg-gradient-to-r from-white to-white/70 text-transparent bg-clip-text">
                  ERP
                </h1>
                <span className="text-[10px] font-bold text-blue-400 tracking-[0.2em] uppercase">ERP</span>
              </div>
            </Link>
          )}
          {collapsed && (
             <div className="mx-auto p-2 bg-blue-600 rounded-lg">
                <ShieldCheck className="h-5 w-5 text-white" />
             </div>
          )}
        </div>

        <nav className="space-y-1.5 flex-1 custom-scrollbar overflow-y-auto pr-2">
          {filteredRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-semibold cursor-pointer rounded-xl transition-all duration-300 relative overflow-hidden",
                pathname === route.href 
                    ? "text-white bg-white/10 shadow-sm shadow-black/20" 
                    : "text-slate-400 hover:text-white hover:bg-white/5",
                collapsed && "justify-center px-2"
              )}
            >
              <div className="flex items-center flex-1 relative z-10">
                <route.icon className={cn(
                    "h-5 w-5 mr-3 transition-colors duration-300", 
                    route.color, 
                    pathname === route.href ? "scale-110" : "group-hover:scale-110",
                    collapsed && "mr-0"
                )} />
                {!collapsed && (
                    <span className="truncate">{route.label}</span>
                )}
              </div>
              
              {/* Active Indicator Line */}
              {pathname === route.href && !collapsed && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Bottom Profile Section (Collapsed View) */}
        {!collapsed && (
            <div className="mt-auto p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-md">
                <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-500 flex items-center justify-center font-bold text-white shadow-lg">
                        {user?.name?.charAt(0) || "U"}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-bold truncate">{user?.name}</span>
                        <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">{user?.role}</span>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <div className="p-4 border-t border-white/5">
          <Button
            onClick={() => setCollapsed(!collapsed)}
            variant="ghost"
            size="icon"
            className="w-full h-10 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl"
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : (
                <div className="flex items-center justify-center gap-2">
                    <ChevronLeft className="h-5 w-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">Collapse Sidebar</span>
                </div>
            )}
          </Button>
      </div>
    </div>
  );
}
