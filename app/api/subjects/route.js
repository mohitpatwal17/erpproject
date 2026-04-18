import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    const semester = searchParams.get("semester");

    const where = {};
    if (courseId) where.courseId = courseId;
    if (semester) where.semester = parseInt(semester);

    const subjects = await prisma.subject.findMany({
      where,
      include: { course: true },
      orderBy: [{ semester: 'asc' }, { name: 'asc' }]
    });

    return NextResponse.json(subjects);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { name, code, courseId, semester, credits } = body;

    if (!name || !code || !courseId || !semester) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    const subject = await prisma.subject.create({
      data: {
        name,
        code,
        courseId,
        semester: parseInt(semester),
        credits: parseInt(credits || 4)
      }
    });

    return NextResponse.json(subject, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
