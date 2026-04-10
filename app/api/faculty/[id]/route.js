import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const faculty = await prisma.faculty.findUnique({
      where: { userId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            avatar: true,
            isActive: true,
            createdAt: true
          }
        }
      }
    });

    if (!faculty) {
      return NextResponse.json({ message: 'Faculty profile not found' }, { status: 404 });
    }

    return NextResponse.json({ faculty });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
