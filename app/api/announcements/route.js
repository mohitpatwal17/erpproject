import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const audience = searchParams.get("audience");

  // Filtering by audience or fetching all for admins
  const announcements = await prisma.announcement.findMany({
    where: audience
      ? {
          OR: [
            { targetAudience: audience },
            { targetAudience: "ALL" },
          ],
        }
      : {},
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(announcements);
}

export async function POST(request) {
  const session = await getServerSession(authOptions);

  // Only Admin can create announcements
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const announcement = await prisma.announcement.create({
      data: {
        title: body.title,
        content: body.content,
        targetAudience: body.targetAudience || "ALL",
        priority: body.priority || "MEDIUM",
        author: session.user.name,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(announcement, { status: 201 });
  } catch (error) {
    console.error("Announcement creation error:", error);
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 });
  }
}
