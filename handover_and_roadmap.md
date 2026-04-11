# SheetTasktic: Handover & Future Roadmap

This document serves as your "Owner's Manual" for SheetTasktic. It details exactly how to configure your connections and what is left to build when you are ready to resume.

---

## 🔑 Part 1: Platform Setup & API Keys

To use the **Connect** buttons on your dashboard, you need to set up the following "Keys" for each platform.

### **1. Notion**
*   **What you need**: Internal Integration Token & Database ID.
*   **How to get them**:
    1.  Create an integration at [notion.so/my-integrations](https://www.notion.so/my-integrations).
    2.  Grant it "Insert/Read" capabilities.
    3.  **Share** your Notion Database with this integration (via the "..." menu in Notion).
    4.  Copy the Database ID from the URL (the string after the last `/`).

### **2. Jira Cloud**
*   **What you need**: API Token, Site ID, and Project Key.
*   **How to get them**:
    1.  Get an API Token at [id.atlassian.com/manage-profile/security/api-tokens](https://id.atlassian.com/manage-profile/security/api-tokens).
    2.  Find your **Site ID** (Cloud ID) in your Jira URL or via their API explorer.
    3.  Your **Project Key** is the short prefix (e.g., `PROJ` or `KAN`) on your Jira issues.

### **3. HubSpot**
*   **What you need**: Private App Access Token.
*   **How to get them**:
    1.  Go to HubSpot **Settings > Integrations > Private Apps**.
    2.  Create a "New Private App."
    3.  Grant "Scopes" for **CRM Objects (Tasks)** read/write.
    4.  Copy the Access Token.

### **4. Slack**
*   **What you need**: Incoming Webhook URL.
*   **How to get them**:
    1.  Create an app at [api.slack.com/apps](https://api.slack.com/apps).
    2.  Enable **"Incoming Webhooks."**
    3.  Click "Add New Webhook to Workspace" and select a channel.
    4.  Copy the URL (begins with `https://hooks.slack.com/...`).

### **5. Google & Microsoft (Tasks/Calendar)**
*   **What you need**: No manual keys! These use "Sign-in with Google/Microsoft."
*   **Action**: Ensure `sheettasktic.vercel.app` is added to your **Authorized Domains** in the [Firebase Console](https://console.firebase.google.com/).

---

## 🚀 Part 2: Remaining Roadmap Phases

We have successfully completed Phases 1, 2, 3, 5, and 6. Here is what is paused or still ahead:

### **Phase 4: Monetization (PAUSED ⏸️)**
*   *Purpose*: Generate revenue.
*   *Status*: On hold to protect your UK legal status.
*   *Tasks*: Integration with **Lemon Squeezy**, implementing usage limits (e.g., "50 tasks per day for free users"), and adding Ad networks.

### **Phase 7: "Omni-Task" Distribution (UP NEXT)**
*   **Chrome Extension**: Create a browser extension so users can "grab" any table on the web (e.g., from a news article or flight list) and send it directly to SheetTasktic.
*   **Offline Support (PWA)**: Turn the website into a "Progressive Web App" so it can be installed on your phone or Mac as a stand-alone app.

### **Phase 8: Open Source Launch**
*   **GitHub Reputation**: Clean up the core sync engine and make it "Open Source." 
*   **Documentation**: Write a world-class `README.md` to showcase your skills to UK engineering recruiters.

---

## 🛠️ Part 3: Maintenance Notes
*   **Vercel Keys**: Ensure all Firebase environment variables are in your Vercel Dashboard Settings.
*   **Rate Limits**: If you sync 10,000+ rows, the app will automatically "throttle" to avoid being blocked by Jira/Notion. Just let the progress bar finish!

**Great work today! SheetTasktic is officially in a professional, stable state.**
