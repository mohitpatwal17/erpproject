import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get("courseId");
  const semester = searchParams.get("semester");

  const timetable = await prisma.timetable.findMany({
    where: {
      ...(courseId && { courseId }),
      ...(semester && { semester: parseInt(semester) }),
    },
    include: {
      faculty: {
        include: {
          user: { select: { name: true } },
        },
      },
    },
    orderBy: [
      { day: "asc" },
      { time: "asc" }
    ],
  });

  return NextResponse.json(timetable);
}

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role === "STUDENT") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const slot = await prisma.timetable.create({
      data: {
        courseId: body.courseId,
        day: body.day,
        time: body.time,
        subject: body.subject,
        room: body.room,
        type: body.type || "Lecture",
        semester: parseInt(body.semester),
        facultyId: body.facultyId || null,
      },
    });

    return NextResponse.json(slot, { status: 201 });
  } catch (error) {
    console.error("Timetable entry error:", error);
    return NextResponse.json({ error: "Failed to create timetable slot" }, { status: 500 });
  }
}
