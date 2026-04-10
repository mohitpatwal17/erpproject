const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Seeding (Fixed) ---');

  // Find Mohit
  const mohit = await prisma.user.findFirst({
    where: { email: 'mohitpatwal17@gmail.com' },
    include: { student: true }
  });

  if (!mohit || !mohit.student) {
    console.log('Mohit student account not found. Please create it first.');
    return;
  }

  const studentId = mohit.student.id;

  // 1. Create Announcements
  console.log('Creating Announcements...');
  const announcements = [
    {
      title: 'Mid-Semester Break',
      content: 'The college will remain closed from April 15th to April 20th.',
      targetAudience: 'ALL',
      priority: 'MEDIUM',
      authorId: mohit.id,
    },
    {
      title: 'Library Extended Hours',
      content: 'Library will be open until 10 PM during exam weeks.',
      targetAudience: 'STUDENT',
      priority: 'LOW',
      authorId: mohit.id,
    }
  ];

  for (const a of announcements) {
    await prisma.announcement.create({ data: a });
  }

  // 2. Create Attendance Records for Mohit
  console.log('Creating Attendance Records...');
  for (let i = 0; i < 20; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    await prisma.attendance.create({
      data: {
        date: date,
        status: Math.random() > 0.1 ? 'PRESENT' : 'ABSENT',
        studentId: studentId,
      }
    });
  }

  // 3. Create Fee Records
  console.log('Creating Fee Records...');
  const fees = [
    {
      amount: 50000,
      status: 'PAID',
      type: 'TUITION',
      dueDate: new Date('2025-01-01'),
      paidDate: new Date('2024-12-28'),
      studentId: studentId,
    },
    {
      amount: 25000,
      status: 'PENDING',
      type: 'HOSTEL',
      dueDate: new Date('2025-05-01'),
      studentId: studentId,
    }
  ];

  for (const f of fees) {
    await prisma.feeRecord.create({ data: f });
  }

  // 4. Create a Course and Exam
  console.log('Creating Courses and Exams...');
  const course = await prisma.course.upsert({
    where: { code: 'CS102' },
    update: {},
    create: {
      name: 'Data Structures',
      code: 'CS102',
      credits: 4,
      department: 'Computer Science',
    }
  });

  await prisma.exam.upsert({
    where: { id: 'sample-exam-1' }, // Upsert to avoid dupes if partially run
    update: {},
    create: {
      id: 'sample-exam-1',
      name: 'Final Examination',
      date: new Date('2025-05-15'),
      courseId: course.id,
    }
  });

  console.log('--- Seeding Completed Successfully ---');
}

main()
  .catch(e => {
    console.error('Seeding failed:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
