import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

function calculateGrade(marks) {
  if (marks >= 90) return "O";
  if (marks >= 80) return "A+";
  if (marks >= 70) return "A";
  if (marks >= 60) return "B+";
  if (marks >= 50) return "B";
  return "F";
}

export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const results = await prisma.examResult.findMany({
    where: { examId: params.id },
    include: {
      student: {
        include: {
          user: { select: { name: true } },
        },
      },
    },
  });

  return NextResponse.json(results);
}

export async function POST(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role === "STUDENT") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { results, publish } = await request.json();
    // results = [{ studentId, marks }]

    const upserts = results.map((r) =>
      prisma.examResult.upsert({
        where: {
          examId_studentId: {
            examId: params.id,
            studentId: r.studentId,
          },
        },
        update: {
          marks: parseFloat(r.marks),
          grade: calculateGrade(r.marks),
          published: publish || false,
        },
        create: {
          examId: params.id,
          studentId: r.studentId,
          marks: parseFloat(r.marks),
          grade: calculateGrade(r.marks),
          published: publish || false,
        },
      })
    );

    await prisma.$transaction(upserts);

    if (publish) {
      await prisma.exam.update({
        where: { id: params.id },
        data: { status: "Completed" },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Exam results recording error:", error);
    return NextResponse.json({ error: "Failed to record results" }, { status: 500 });
  }
}
