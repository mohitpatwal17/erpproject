import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const course = searchParams.get("course");
  const date = searchParams.get("date");
  const studentId = searchParams.get("studentId");

  const records = await prisma.attendance.findMany({
    where: {
      ...(course && { course }),
      ...(date && {
        date: {
          gte: new Date(date),
          lt: new Date(new Date(date).getTime() + 86400000),
        },
      }),
      ...(studentId && { studentId }),
    },
    include: {
      student: {
        include: {
          user: { select: { name: true } },
        },
      },
    },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(records);
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { date, course, semester, records } = await request.json();
    // records = [{ studentId, status: "PRESENT" | "ABSENT" }]

    const upserts = records.map((r) =>
      prisma.attendance.upsert({
        where: {
          studentId_date_course: {
            studentId: r.studentId,
            date: new Date(date),
            course,
          },
        },
        update: { status: r.status },
        create: {
          studentId: r.studentId,
          date: new Date(date),
          course,
          semester,
          status: r.status,
          markedBy: session.user.id,
        },
      })
    );

    await prisma.$transaction(upserts);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Attendance submission error:", error);
    return NextResponse.json({ error: "Failed to submit attendance" }, { status: 500 });
  }
}
