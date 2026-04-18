import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (session.user.role === "STUDENT") {
      const student = await prisma.student.findUnique({
        where: { userId: session.user.id },
      });

      if (!student) {
        return NextResponse.json({
          stats: { attendancePercentage: 0, totalFeesDue: 0, examCount: 0 },
          announcements: [],
          exams: [],
          profile: { rollNumber: "N/A", course: "N/A", semester: 0 }
        });
      }

      return NextResponse.json({
        stats: {
          attendancePercentage: 0, // Mock for now
          totalFeesDue: (student.totalFees || 0) - (student.paidFees || 0),
          examCount: 0
        },
        announcements: [],
        exams: [],
        profile: {
          rollNumber: student.rollNumber || "N/A",
          course: student.course || "N/A",
          semester: student.semester || 0,
        }
      });
    }

    if (session.user.role === "FACULTY") {
      const faculty = await prisma.faculty.findUnique({
        where: { userId: session.user.id },
        include: { department: true }
      });

      const totalStudentsDepartment = faculty ? await prisma.student.count({
        where: { 
          OR: [
            { course: { contains: faculty.department.code } },
            { course: { contains: faculty.department.name } }
          ]
        }
      }) : 0;

      return NextResponse.json({
        stats: {
          classesToday: 0,
          totalStudentsDepartment,
          leaveBalance: 12,
          pendingTasks: 4
        },
        announcements: [],
      });
    }

    const [
      totalStudents,
      totalFaculty,
      todayAttendance,
      feeSummary
    ] = await Promise.all([
      prisma.student.count(),
      prisma.faculty.count(),
      prisma.attendance.groupBy({
        by: ["status"],
        where: {
          date: {
            gte: today,
            lt: tomorrow,
          },
        },
        _count: true,
      }),
      prisma.student.aggregate({
        _sum: {
          paidFees: true,
          totalFees: true,
        },
      }),
    ]);

    const presentCount =
      todayAttendance.find((r) => r.status === "PRESENT")?._count || 0;
    const totalCount = todayAttendance.reduce((a, r) => a + r._count, 0);
    const attendancePercent =
      totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

    return NextResponse.json({
      totalStudents,
      totalFaculty,
      attendancePercent,
      totalFeesCollected: feeSummary._sum.paidFees || 0,
      totalFeesPending:
        (feeSummary._sum.totalFees || 0) - (feeSummary._sum.paidFees || 0),
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
