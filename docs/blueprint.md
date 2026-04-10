# **App Name**: SheetToTasks AI

## Core Features:

- AI-Powered Mapping: Leverage Gemini AI to analyze spreadsheet headers and data, suggesting intelligent mappings for task titles, notes, due dates, priority, status, and parent tasks. This AI acts as a tool for determining appropriate mappings, adapting to various data layouts.
- Multi-Format Upload & Parsing: Enable users to upload spreadsheets in .xlsx, .xls, and .csv formats, parsing them using SheetJS for data extraction.
- Manual Mapping Override: Provide an advanced UI for users to manually override AI-suggested mappings, allowing for precise column selection and customization.
- Task Preview & Reordering: Display a preview of the tasks extracted from the spreadsheet, allowing users to drag-and-drop to reorder, delete, or bulk-edit priority and due dates before synchronization.
- Integration with Task Management Platforms: Integrate with Google Tasks (via Firebase Google Login), Notion, and Todoist (both token-based) to synchronize tasks seamlessly.
- Local File Exports: Generate clean CSV, JSON, and Markdown files with automatic browser downloads for local task management.
- Date Normalization: Automatically convert various date formats (including Excel serial dates) into standard ISO dates for accurate task scheduling.

## Style Guidelines:

- Primary color: Vibrant Blue (#2563eb) for primary actions, reflecting a modern and trustworthy SaaS aesthetic.
- Background color: Light gray (#F5F7FA), providing a clean and unobtrusive backdrop.
- Accent color: Teal (#2dd4bf) to highlight interactive elements.
- Body and headline font: 'Inter', a sans-serif font with a modern, neutral aesthetic suitable for both headlines and body text.
- Use Lucide React icons for a consistent and clean visual language throughout the application.
- Implement a modern SaaS aesthetic using Tailwind CSS, with a clear, intuitive layout that guides users through each step of the task conversion process.
- Employ micro-animations for transitions between steps and "Pulse" effects during AI analysis to provide engaging user feedback.