import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const student = await prisma.student.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { name: true, email: true, avatar: true } },
      attendanceRecords: { orderBy: { date: "desc" }, take: 30 },
      feeRecords: { orderBy: { paidAt: "desc" } },
      examResults: { include: { exam: true } },
    },
  });

  if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(student);
}

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const student = await prisma.student.update({
    where: { id: params.id },
    data: {
      course: body.course,
      semester: body.semester ? parseInt(body.semester) : undefined,
      phone: body.phone,
      address: body.address,
      guardianName: body.guardianName,
      guardianPhone: body.guardianPhone,
      user: {
        update: {
          name: body.name,
        },
      },
    },
  });
  return NextResponse.json(student);
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const student = await prisma.student.findUnique({
    where: { id: params.id },
    select: { userId: true },
  });

  if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.user.delete({
    where: { id: student.userId },
  });
  
  return NextResponse.json({ success: true });
}
