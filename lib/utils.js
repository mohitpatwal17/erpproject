import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/* --- Mock Data Generators --- */

export const MOCK_STUDENTS = Array.from({ length: 50 }, (_, i) => ({
  id: `STU${2024001 + i}`,
  name: `Student ${i + 1}`,
  email: `student${i + 1}@college.edu`,
  rollNumber: `CS24${String(i + 1).padStart(3, '0')}`,
  course: 'B.Tech CSE',
  semester: Math.floor(Math.random() * 8) + 1,
  phone: `98765${String(i).padStart(5, '0')}`,
  address: 'Mumbai, India',
  dob: '2004-01-01',
  guardianName: `Parent ${i + 1}`,
  guardianPhone: `98765${String(i + 50).padStart(5, '0')}`,
  attendancePercentage: Math.floor(Math.random() * 30) + 70, // 70-100%
  feeStatus: Math.random() > 0.8 ? 'DUE' : 'PAID',
  totalFees: 150000,
  paidFees: Math.random() > 0.8 ? 75000 : 150000,
}));

export const MOCK_FACULTY = Array.from({ length: 20 }, (_, i) => ({
  id: `FAC${101 + i}`,
  name: `Professor ${i + 1}`,
  email: `prof${i + 1}@college.edu`,
  phone: `99887${String(i).padStart(5, '0')}`,
  department: ['CSE', 'ECE', 'MECH'][Math.floor(Math.random() * 3)],
  designation: Math.random() > 0.7 ? 'Senior Professor' : 'Assistant Professor',
  qualification: 'Ph.D in Computer Science',
  joiningDate: '2018-06-15',
  subjects: ['Data Structures', 'Algorithms', 'Database Management', 'OS'],
}));

export const MOCK_ANNOUNCEMENTS = [
  {
    id: '1',
    title: 'Final Semester Exams Schedule',
    content: 'The final semester examinations will commence from 15th May 2024.',
    date: '2024-04-10',
    author: 'Admin',
    targetAudience: 'ALL',
    priority: 'HIGH',
  },
  {
    id: '2',
    title: 'Hackathon Registration Open',
    content: 'Register for the Annual Tech Hackathon before 20th April.',
    date: '2024-04-12',
    author: 'Student Council',
    targetAudience: 'STUDENT',
    priority: 'MEDIUM',
  },
  {
    id: '3',
    title: 'Faculty Meeting',
    content: 'All faculty members are requested to attend the monthly review meeting.',
    date: '2024-04-14',
    author: 'Principal',
    targetAudience: 'FACULTY',
    priority: 'HIGH',
  },
];

export const MOCK_COURSES = [
  {
    id: 'C1',
    name: 'Computer Science & Engineering',
    code: 'CSE',
    description: 'B.Tech in Computer Science',
    credits: 160,
    department: 'CSE',
    semester: 8,
  },
  {
    id: 'C2',
    name: 'Electronics & Communication',
    code: 'ECE',
    description: 'B.Tech in Electronics',
    credits: 160,
    department: 'ECE',
    semester: 8,
  },
];
