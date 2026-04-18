import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const data = await req.json();
    const { name, email, password, role, department, course, rollNumber } = data;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: 'Missing core fields' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    if (existingUser) {
      return NextResponse.json({ message: 'Email already in use' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Create User and Profile in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
        }
      });

      if (role === 'STUDENT') {
        if (!rollNumber || !course) {
          throw new Error('Missing student fields (rollNumber, course)');
        }
        await tx.student.create({
          data: {
            userId: user.id,
            rollNumber,
            course,
            semester: 1,
            totalFees: 150000,
            feeStatus: 'DUE'
          }
        });
      } else if (role === 'FACULTY') {
        if (!department) {
          throw new Error('Missing faculty fields (department)');
        }

        // Auto-resolve department (Find or Create)
        let dept = await tx.department.findFirst({
          where: {
            OR: [
              { name: department },
              { code: department.replace(/\s+/g, '').toUpperCase() }
            ]
          }
        });

        if (!dept) {
          dept = await tx.department.create({
            data: {
              name: department,
              code: department.replace(/\s+/g, '').toUpperCase()
            }
          });
        }

        await tx.faculty.create({
          data: {
            userId: user.id,
            employeeId: `FAC-${Date.now()}`,
            departmentId: dept.id,
            designation: 'Lecturer'
          }
        });
      }

      return user;
    });

    const { password: _, ...userWithoutPassword } = result;

    return NextResponse.json({ message: 'User created successfully', user: userWithoutPassword }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
