import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const faculty = await prisma.faculty.findMany({
    include: {
      user: { select: { name: true, email: true, avatar: true } },
      department: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(faculty);
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { 
      name, email, password, employeeId, departmentId,
      designation, qualification, joiningDate, subjects 
    } = body;

    const hashedPassword = await bcrypt.hash(password || "faculty123", 10);

    const faculty = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "FACULTY",
        faculty: {
          create: {
            employeeId,
            departmentId,
            designation,
            qualification,
            joiningDate: joiningDate ? new Date(joiningDate) : null,
            subjects: subjects || [],
          },
        },
      },
      include: { faculty: true },
    });

    return NextResponse.json(faculty, { status: 201 });
  } catch (error) {
    console.error("Faculty creation error:", error);
    return NextResponse.json({ error: "Failed to create faculty member" }, { status: 500 });
  }
}
