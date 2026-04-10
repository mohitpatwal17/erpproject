import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // If student is logged in, they should only see their own records
  if (session.user.role === "STUDENT") {
    const student = await prisma.student.findUnique({
      where: { userId: session.user.id },
      include: { 
        user: { select: { name: true } },
        feeRecords: { orderBy: { paidAt: "desc" } }
      },
    });
    return NextResponse.json([student]);
  }

  // Admin/Faculty see all students for fee management
  const students = await prisma.student.findMany({
    include: { 
      user: { select: { name: true } },
      feeRecords: { orderBy: { paidAt: "desc" } }
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(students);
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  
  // Only Admin or Faculty can record fee payments
  if (!session || session.user.role === "STUDENT") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { studentId, amount, type, method } = await request.json();

    const feeRecord = await prisma.feeRecord.create({
      data: {
        studentId,
        amount: parseFloat(amount),
        type,
        method,
        createdBy: session.user.id,
      },
    });

    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    const newPaid = student.paidFees + parseFloat(amount);
    const newStatus =
      newPaid >= student.totalFees
        ? "PAID"
        : newPaid > 0
        ? "PARTIAL"
        : "DUE";

    await prisma.student.update({
      where: { id: studentId },
      data: {
        paidFees: newPaid,
        feeStatus: newStatus,
      },
    });

    return NextResponse.json(feeRecord, { status: 201 });
  } catch (error) {
    console.error("Fee recording error:", error);
    return NextResponse.json({ error: "Failed to record payment" }, { status: 500 });
  }
}
