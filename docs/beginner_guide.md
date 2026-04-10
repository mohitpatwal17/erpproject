# Beginner's Guide to ERP Nisha

Welcome! This guide is designed to help you understand how to set up, run, and deeply understand the **erpnisha** project, even if you are just starting out.

---

## 1. The Language & Tech (What are we using?)

### **Languages used:**
*   **TypeScript (.ts / .tsx)**: This is modern JavaScript with "types". It helps prevent errors by making sure you use the right kind of data (like numbers where numbers are expected).
*   **TSX**: This is "TypeScript XML". It allows us to write HTML-like code inside our TypeScript files. This is how React components are built.
*   **CSS (globals.css)**: We use standard CSS for global styles, but most styling is done using **Tailwind CSS**.

### **Core Tools:**
*   **React**: The library for building the user interface (UI) using "Components".
*   **Next.js**: The framework that manages pages, routing, and performance.
*   **Tailwind CSS**: A "Utility-first" CSS framework. Instead of writing separate CSS files, we add classes directly to HTML (e.g., `flex`, `p-4`, `text-blue-500`).

---

## 2. Next.js vs. Traditional HTML (How does it "Run"?)

If you are used to a simple website, you usually open a file called `index.html` in your browser. This project is different because it uses a **Framework (Next.js)**.

### **Where is the "Main" file?**
In this project, there isn't just one file. Instead, the framework "stitches" multiple files together:

1.  **`app/layout.tsx` (The Container)**: Think of this as the outer shell. It contains the `<html>` and `<body>` tags that every web page needs.
2.  **`app/page.tsx` (The Content)**: This is the actual "Home Page" content that sits inside the layout.
3.  **The Sidebar/Navbar**: These are separate files (`components/sidebar.tsx`) that are imported into the layout so they show up on every page.

### **The "Magic" of `npm run dev`**
When you run the command `npm run dev`, a small "server" starts on your computer. It reads all your TypeScript files, converts them into standard HTML/JavaScript that the browser understands, and then serves them to you at `http://localhost:3000`.

---

## 3. How to Run the Project in VS Code

Follow these exact steps to get the project running on your computer:

### **Step 1: Install Prerequisites**
Make sure you have [Node.js](https://nodejs.org/) installed on your computer.

### **Step 2: Open VS Code**
1.  Open Visual Studio Code.
2.  Go to `File > Open Folder...` and select the `erpnisha` folder.

### **Step 3: Open the Terminal**
1.  In VS Code, go to the top menu and select `Terminal > New Terminal` (or press `` Ctrl + ` ``).
2.  A window will open at the bottom.

### **Step 4: Install Dependencies**
Type the following command and hit Enter:
```bash
npm install
```
*Wait for it to finish. This downloads all the libraries the project needs (like React).*

### **Step 5: Start the Development Server**
Type this command and hit Enter:
```bash
npm run dev
```

### **Step 6: Open in Browser**
Look for a link like `http://localhost:3000` in the terminal. **Ctrl + Click** it or type it into your browser. The project is now running!

---

## 3. Component Deep-Dive (How things work)

In React, everything is a "Component" (a reusable block of code).

### 📂 `components/ui/` (The Atoms)
These are small building blocks like **Buttons**, **Inputs**, and **Cards**. You don't usually change these; you just *use* them in other components.

### 🏠 `components/sidebar.tsx` (Deep Knowledge)
*   **Purpose**: The main navigation menu on the left.
*   **How it works**:
    1.  It checks the `userRole` (Admin, Faculty, or Student) from the browser's storage.
    2.  It filters the list of links. For example: A **Student** cannot see the "Reports" link, but an **Admin** can.
    3.  It uses **Lucide Icons** to make the menu look premium.

### 📊 `components/stat-card.tsx`
*   **Purpose**: Displays a single metric (like "Total Students: 1,250").
*   **Logic**: It accepts "Props" (properties) like `title`, `value`, and `icon` and displays them in a beautiful card. It even shows a "Trend" (up or down arrow).

### 🖼️ `app/dashboard/_components/admin-dashboard.tsx`
*   **Purpose**: The "Manager's View".
*   **Logic**: It combines multiple `StatCards` and **Charts** (from the Recharts library) to show a high-level overview. It's built to look like a professional data center.

### 📝 `components/forms/student-form.tsx`
*   **Purpose**: A complicated form to collect student data.
*   **Logic**: It uses standard HTML inputs but wraps them in Radix UI components for better accessibility and style.

---

## 4. File-by-File Summary for Beginners

| File / Folder | Role | Language |
| :--- | :--- | :--- |
| `app/layout.tsx` | The "Skeleton" of every page. Sets fonts/colors. | TSX |
| `app/page.tsx` | The first page you see (Landing/Login). | TSX |
| `lib/utils.ts` | Handy "Math" or "Formatting" helpers. | TypeScript |
| `lib/types.ts` | The "Rulebook" for what data should look like. | TypeScript |
| `public/` | Where you put your images and logos. | - |
| `next.config.ts` | Settings for how Next.js should behave. | TypeScript |

---

### **Pro Tip for Beginners:**
If you want to change something, look for the `page.tsx` file in the folder that matches the URL you see in your browser. For example, if you are at `/dashboard/students`, the file to edit is `app/dashboard/students/page.tsx`.
