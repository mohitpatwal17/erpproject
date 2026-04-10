import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

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
