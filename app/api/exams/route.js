import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const exams = await prisma.exam.findMany({
    include: {
      course: true,
      results: true,
    },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(exams);
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  
  // Only Admin or Faculty can schedule exams
  if (!session || session.user.role === "STUDENT") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const exam = await prisma.exam.create({
      data: {
        name: body.name,
        courseId: body.courseId,
        date: new Date(body.date),
        totalMarks: body.totalMarks ? parseInt(body.totalMarks) : 100,
        status: "Scheduled",
      },
    });

    return NextResponse.json(exam, { status: 201 });
  } catch (error) {
    console.error("Exam creation error:", error);
    return NextResponse.json({ error: "Failed to create exam" }, { status: 500 });
  }
}
