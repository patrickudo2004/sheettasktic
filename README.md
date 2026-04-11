# 📊 SheetTasktic: The AI-Powered Sync Engine

![SheetTasktic Hero Logo](./sheettasktic_hero_logo_1775871099723.png)

**SheetTasktic** is a powerful, AI-driven utility that intelligently transforms spreadsheet data into actionable tasks. Designed for professionals and power users, it bridges the gap between static data and active productivity platforms like **Notion**, **Jira**, **Google Tasks**, and **Microsoft To-Do**.

---

## 🚀 Key Features

*   **🧠 AI Header Mapping**: Uses Google Gemini to intelligently analyze your spreadsheet headers and map them to task fields automatically.
*   **🌐 Universal Sync Adapter**: A unified engine that syncs your tasks across:
    *   **Notion Databases**
    *   **Jira Cloud Projects**
    *   **Microsoft To-Do & Outlook Calendar**
    *   **Google Tasks & Calendar**
    *   **HubSpot CRM (Tasks)**
*   **⚡ Professional Scale**: Concurrent batch processing engine built to handle 10,000+ rows with smart rate-limit throttling.
*   **📱 Mobile-First Design**: A stunning, glassmorphic dashboard optimized for both desktop and on-the-go productivity.
*   **💬 Integrated Feedback**: Built-in community loop to shape the future of the product.
*   **🔒 Safe & Secure**: 100% Client-side processing for your data, ensuring your secrets stay yours.

---

## 🛠️ How It Works

1.  **Direct Upload**: Drop any `.csv` or `.xlsx` file into the dashboard.
2.  **AI Mapping**: Let our AI suggest the best columns for your "Task Title," "Due Date," and "Notes."
3.  **Universal Sync**: Connect your preferred workspace and watch as your spreadsheet turns into a live task board.

---

## 💻 Tech Stack

*   **Frontend**: [Next.js 15](https://nextjs.org/) (App Router), [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
*   **AI Engine**: [Google Gemini Pro](https://deepmind.google/technologies/gemini/)
*   **Backend & Auth**: [Firebase](https://firebase.google.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)

---

## ⚙️ Development Setup

### 1. Prerequisites
*   Node.js 18+
*   A Firebase Project
*   Google AI SDK Key (Gemini)

### 2. Environment Variables
Create a `.env.local` file and add the following:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
GOOGLE_AI_API_KEY=your_gemini_key
```

### 3. Installation
```bash
npm install
npm run dev
```

---

## 📄 License

Licensed under the **Apache License, Version 2.0**. See the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

**Built with ❤️ for the productivity community.**
