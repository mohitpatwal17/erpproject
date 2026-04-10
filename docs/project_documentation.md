# ERP Nisha: Comprehensive Project Documentation

This document provides a deep dive into the architecture, technology stack, and file-by-file breakdown of the **erpnisha** project.

---

## 1. Project Overview
**erpnisha** is a modern Education Resource Planning (ERP) system built for educational institutions to manage students, faculty, attendance, fees, and announcements. It features a role-based dashboard system (Admin, Faculty, Student) with a premium, responsive UI.

## 2. Technology Stack
- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router, Server Components)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Shadcn UI](https://ui.shadcn.com/) patterns
- **State/Data**: React Hooks & TanStack Table
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)

---

## 3. Directory Structure Breakdown

### 📂 Root Directory
*   **`package.json`**: The project manifest. Defines metadata, scripts (`dev`, `build`, `start`, `lint`), and all dependencies.
*   **`tsconfig.json`**: Configuration for TypeScript (paths, compiler options).
*   **`next.config.ts`**: Settings for the Next.js framework (e.g., image domains, experimental features).
*   **`components.json`**: Radix/Shadcn UI configuration for component generation.
*   **`postcss.config.mjs` & `eslint.config.mjs`**: Tools for CSS transformation and code quality (linting).
*   **`.gitignore`**: Tells Git which files/folders to ignore (like `node_modules`).

### 📂 `app/` (The Routing Layer)
This directory uses the Next.js **App Router** where folders define URL paths.
*   **`layout.tsx`**: The Root Layout. Sets up the HTML, Body, and provides global providers (like ThemeProvider).
*   **`page.tsx`**: The main entry point (Landing/Login page).
*   **`globals.css`**: Global CSS variables and Tailwind directives.
*   **`dashboard/`**:
    *   **`layout.tsx`**: Shared layout for all dashboard pages. Includes the `Sidebar` and `Navbar`.
    *   **`page.tsx`**: The main dashboard landing which redirects users to their specific role-based view.
    *   **`_components/`**: Private components used only within the dashboard (e.g., `admin-dashboard.tsx`, `faculty-dashboard.tsx`, `student-dashboard.tsx`).
    *   **`students/`, `faculty/`, `attendance/`, `fees/`, etc.**: Each folder contains a `page.tsx` that renders the respective module UI.

### 📂 `components/` (The UI Layer)
*   **`ui/`**: Low-level, reusable atoms (Buttons, Inputs, Dialogs, Cards).
*   **`forms/`**: Complex form logic for adding/editing data.
    *   `student-form.tsx`: Handles student registration.
    *   `faculty-form.tsx`: Handles faculty details.
    *   `course-form.tsx`: Form for adding new courses.
*   **`sidebar.tsx`**: The vertical navigation menu with role-based filtering.
*   **`navbar.tsx`**: The top bar containing the user profile, search, and notifications.
*   **`stat-card.tsx`**: A reusable card for displaying dashboard KPIs (e.g., "Total Students").
*   **`empty-state.tsx`**: Displayed when there is no data to show in a table or list.

### 📂 `lib/` (The Logic Layer)
*   **`types.ts`**: Defines the "Shape" of your data. Interfaces for `Student`, `Faculty`, `Course`, `Role`, etc.
*   **`utils.ts`**: Helper functions.
    *   `cn()`: Merges Tailwind classes safely.
    *   `formatCurrency()` & `formatDate()`: Formatting helpers.
    *   **Mock Data**: Contains arrays like `MOCK_STUDENTS` and `MOCK_FACULTY` used to simulate a database.

### 📂 `public/`
*   Contains static images, fonts, and the `favicon.ico`.

---

## 4. How the System Functions

### 🔐 Role-Based Access
The system checks the user's `Role` ('ADMIN', 'FACULTY', 'STUDENT') and renders the corresponding dashboard component from `app/dashboard/_components/`. It also filters the sidebar links based on what the user is allowed to see.

### 📊 Data Management
Currently, the app uses **Mock Data** from `lib/utils.ts`. 
- **Read**: Components import the mock arrays and display them in tables (TanStack Table).
- **Write**: Forms are set up to handle data, which can later be connected to an API (like Axios) to save to a database.

### 🎨 Design System
The app uses a **Dark/Light mode** system via `next-themes`. The styling is handled by Tailwind CSS with custom colors defined in the CSS variables of `globals.css`.

---

## 5. How to convert this to PDF
1.  **Open** this file in your code editor (VS Code, etc.).
2.  Use a **Markdown Preview** extension.
3.  Right-click and select **"Export to PDF"** or **Print to PDF** from your browser/editor.
