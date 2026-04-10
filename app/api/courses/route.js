import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const courses = await prisma.course.findMany({
      include: {
        _count: {
          select: { exams: true }
        }
      }
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Fetch Courses Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { name, code, credits, department } = body;

    const course = await prisma.course.create({
      data: {
        name,
        code,
        credits: parseInt(credits),
        department,
      }
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("Create Course Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
