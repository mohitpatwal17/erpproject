import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;

  const students = await prisma.student.findMany({
    where: {
      OR: [
        { user: { name: { contains: search } } },
        { rollNumber: { contains: search } },
      ],
    },
    include: { 
      user: { 
        select: { 
          name: true, 
          email: true,
          avatar: true 
        } 
      } 
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(students);
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { 
    name, email, password, rollNumber, course, semester,
    phone, address, dob, guardianName, guardianPhone 
  } = body;

  const hashedPassword = await bcrypt.hash(password || "student123", 10);

  const student = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "STUDENT",
      student: {
        create: {
          rollNumber,
          course,
          semester: parseInt(semester),
          phone,
          address,
          dob: dob ? new Date(dob) : null,
          guardianName,
          guardianPhone,
          totalFees: 150000,
          paidFees: 0,
          feeStatus: "DUE",
        },
      },
    },
    include: { student: true },
  });

  return NextResponse.json(student, { status: 201 });
}
