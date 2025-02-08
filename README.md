# Daily Journal & Mood Tracker with AI Insights

## Overview

The **Daily Journal & Mood Tracker with AI Insights** is a cross​-platform desktop application built with Electron. It enables users to record daily journal entries and track their mood over time by leveraging AI-driven mood analysis. With an intuitive interface, interactive charts, and persistent storage, the app provides a comprehensive solution for personal wellness tracking.

## Features

- **Daily Journaling:** Write and save journal entries with ease.
- **Mood Analysis:** Leverage OpenAI's API to analyze journal text and additional metrics for a numerical mood score.
- **Additional Metrics:** Input extra details via sliders (Stress Quality, Sleep Quality, Productivity, Mood Level, and Hours Slept).
- **Data Visualization:** Interactive mood trend chart powered by Chart.js.
- **Persistent Storage:** All journal entries are saved locally, ensuring data is retained between sessions.
- **Dark Mode:** Modern, responsive design with a dark mode toggle (icon-based).
- **Detailed Logging:** Comprehensive logs are maintained (in `app.log`) for debugging and monitoring API usage and errors.
- **Outsourced Prompt Builder:** The prompt used to query OpenAI is modularized in its own file (`prompt.js`) for maintainability.

## Tech Stack

- **Electron:** Desktop application framework.
- **Node.js & npm:** JavaScript runtime and package management.
- **OpenAI API:** Provides AI insights and mood analysis.
- **Chart.js:** For data visualization.
- **dotenv:** Environment variable management.
- **File System (fs):** Local persistence of journal entries and logs.

## Installation

1. **Clone the Repository:**

   ```bash
   git clone
   cd daily-journal-mood-tracker
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**

   Create a `.env` file in the root directory with your API credentials and model. For example:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_MODEL=gpt-4o
   ```

   

## Usage

1. **Start the Application:**

   ```bash
   npm start
   ```

2. **Using the App:**

   - **Journal Entry:** Enter your thoughts in the provided text area.
   - **Metrics Input:** Adjust the sliders for Stress Quality, Sleep Quality, Productivity, Mood Level, and Hours Slept.
   - **Analyze Mood:** Click **"Analyze Mood & Save Journal"** to send your entry and metrics to OpenAI. The app will return a numeric mood score (between -10 and 10) and display it along with a sentiment interpretation.
   - **View History:** Review your mood trends over time on the interactive chart. Click on any data point to view the corresponding journal entry.
   - **Dark Mode:** Use the icon in the header to toggle between light and dark themes.

3. **Data Persistence:**

   Journal entries are saved to a local JSON file (`journalEntries.json`). When you reopen the app, your previous entries are loaded and displayed automatically.

## Directory Structure

```
daily-journal-mood-tracker/
├── .env                  # Environment variables (not tracked in Git)
├── .gitignore            # Specifies intentionally untracked files
├── package.json          # Project metadata and dependencies
├── main.js               # Electron main process
├── renderer.js           # Application UI logic and integration
├── prompt.js             # Outsourced prompt builder for OpenAI API
├── journalEntries.json   # (Auto-generated) Saved journal entries
├── app.log               # (Auto-generated) Log file for debugging
└── index.html            # Application UI markup
```

## Logging & Debugging

- **Log File:** All application events, errors, and API usage details are logged in `app.log` for troubleshooting.
- **Error Reporting:** Errors are displayed in the UI with red text for immediate visibility, and detailed error information (HTTP status, response data) is logged.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`.
3. Commit your changes: `git commit -am 'Add new feature'`.
4. Push to your branch: `git push origin feature/your-feature-name`.
5. Open a Pull Request.

---

### Final Notes

- **Environment Variables:**  
  Ensure your `.env` file is properly configured with your OpenAI API key and a supported completions model.

- **Prompt Customization:**  
  The prompt used to query OpenAI is outsourced to `prompt.js` for modularity. Adjust the wording if necessary to fine-tune the AI's output.

- **Persistence & Logging:**  
  Journal entries are stored locally, and all critical events and errors are logged in `app.log` to facilitate debugging and continuous improvement.
