import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create departments
  const cseDept = await prisma.department.upsert({
    where: { code: "CSE" },
    update: {},
    create: { name: "Computer Science & Engineering", code: "CSE" },
  });
  
  const eceDept = await prisma.department.upsert({
    where: { code: "ECE" },
    update: {},
    create: { name: "Electronics & Communication", code: "ECE" },
  });

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@erp.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@erp.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // Create faculty user
  const facultyPassword = await bcrypt.hash("faculty123", 10);
  await prisma.user.upsert({
    where: { email: "faculty@erp.com" },
    update: {},
    create: {
      name: "Dr. Rajesh Kumar",
      email: "faculty@erp.com",
      password: facultyPassword,
      role: "FACULTY",
      faculty: {
        create: {
          employeeId: "FAC001",
          departmentId: cseDept.id,
          designation: "Senior Professor",
          qualification: "Ph.D in Computer Science",
          joiningDate: new Date("2018-06-15"),
          subjects: "Data Structures, Algorithms, DBMS",
        },
      },
    },
  });

  // Create 5 students
  const studentPassword = await bcrypt.hash("student123", 10);
  const studentNames = [
    "Rahul Sharma", "Priya Patel", "Amit Singh",
    "Neha Gupta", "Vikram Yadav",
  ];
  
  for (let i = 0; i < studentNames.length; i++) {
    const email = `student${i + 1}@erp.com`;
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        name: studentNames[i],
        email,
        password: studentPassword,
        role: "STUDENT",
        student: {
          create: {
            rollNumber: `CS24${String(i + 1).padStart(3, "0")}`,
            course: "B.Tech CSE",
            semester: Math.floor(Math.random() * 4) + 1,
            phone: `9876500${String(i).padStart(3, "0")}`,
            address: "Mumbai, Maharashtra",
            dob: new Date("2004-01-15"),
            guardianName: `Parent of ${studentNames[i]}`,
            guardianPhone: `9876600${String(i).padStart(3, "0")}`,
            totalFees: 150000,
            paidFees: i % 2 === 0 ? 150000 : 75000,
            feeStatus: i % 2 === 0 ? "PAID" : "PARTIAL",
          },
        },
      },
    });
  }

  // Create courses
  await prisma.course.upsert({
    where: { code: "CSE" },
    update: {},
    create: {
      name: "Computer Science & Engineering",
      code: "CSE",
      description: "B.Tech in Computer Science",
      credits: 160,
      departmentId: cseDept.id,
    },
  });

  // Create announcements
  await prisma.announcement.createMany({
    data: [
      {
        title: "Final Semester Exams Schedule",
        content: "Exams commence from 15th May 2025.",
        targetAudience: "ALL",
        priority: "HIGH",
        author: "Admin",
      },
      {
        title: "Hackathon Registration Open",
        content: "Register before 20th April for the Annual Tech Hackathon.",
        targetAudience: "STUDENT",
        priority: "MEDIUM",
        author: "Student Council",
      },
    ],
  });

  console.log("Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
