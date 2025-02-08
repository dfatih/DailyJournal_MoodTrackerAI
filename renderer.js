// renderer.js
require('dotenv').config(); // Load environment variables from .env
const fs = require('fs');
const path = require('path');
const { Configuration, OpenAIApi } = require("openai");

// Import the prompt builder function from prompt.js
const buildPrompt = require('./prompt');

// Logging function for renderer events
function log(message) {
  const logMessage = `[${new Date().toISOString()}] ${message}\n`;
  const logPath = path.join(__dirname, 'app.log');
  fs.appendFile(logPath, logMessage, err => {
    if (err) console.error("Error writing to log file:", err);
  });
}

// Get the OpenAI model from environment variables (with a fallback if needed)
const openai_model = process.env.OPENAI_MODEL;

// Initialize OpenAI configuration for Chat Completions
const openaiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(openaiConfig);

// File path for persistent journal entries
const entriesFilePath = path.join(__dirname, 'journalEntries.json');

// Data arrays for Chart.js and journal entries
let moodData = [];
let entryDates = [];
let journalEntries = [];

// Function to load entries from disk at startup
function loadEntries() {
  if (fs.existsSync(entriesFilePath)) {
    try {
      const data = fs.readFileSync(entriesFilePath, 'utf8');
      const entries = JSON.parse(data);
      if (Array.isArray(entries)) {
        journalEntries = entries;
        moodData = entries.map(entry => entry.moodScore);
        entryDates = entries.map(entry => entry.date);
        moodChart.data.labels = entryDates;
        moodChart.data.datasets[0].data = moodData;
        moodChart.update();
        log(`Loaded ${entries.length} journal entries from disk.`);
      }
    } catch (err) {
      log(`Error parsing journalEntries.json: ${err}`);
    }
  }
}

// Function to save entries to disk
function saveEntries() {
  try {
    fs.writeFileSync(entriesFilePath, JSON.stringify(journalEntries, null, 2), 'utf8');
    log(`Saved ${journalEntries.length} journal entries to disk.`);
  } catch (err) {
    log(`Error saving journalEntries.json: ${err}`);
  }
}

// Warm-up function to initialize OpenAI connection via chat completions
async function warmUpOpenAI() {
  try {
    // Use a trivial conversation to warm up the connection.
    await openai.createChatCompletion({
      model: process.env.OPENAI_MODEL,
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Hello" }
      ],
      max_tokens: 1,
      temperature: 0.5,
    });
    log(`OpenAI connection warmed up using model: ${process.env.OPENAI_MODEL}`);
  } catch (error) {
    log(`Warm-up error: ${error.message}`);
  }
}

// Initialize Chart.js with disabled tooltips and onClick for data points
const ctx = document.getElementById('moodChart').getContext('2d');
const moodChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: entryDates,
    datasets: [{
      label: 'Mood Score',
      data: moodData,
      borderColor: 'rgba(75, 192, 192, 1)', // will update based on dark mode
      fill: false,
    }]
  },
  options: {
    plugins: {
      tooltip: { enabled: false }
    },
    onClick: (evt, activeElements) => {
      if (activeElements.length > 0) {
        const index = activeElements[0].index;
        const entry = journalEntries[index];
        if (entry) {
          openJournalModal(entry);
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Mood Score' }
      },
      x: {
        title: { display: true, text: 'Date & Time' }
      }
    }
  }
});

// Update slider value displays live
const sliderIds = ['stressQuality', 'sleepQuality', 'productive', 'moodLevel', 'hoursSlept'];
sliderIds.forEach(id => {
  const slider = document.getElementById(id);
  const display = document.getElementById(id + 'Value');
  slider.addEventListener('input', () => {
    display.textContent = slider.value;
  });
});

// Dark Mode Toggle Icon functions
function getMoonIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24">
            <path d="M21 12.79A9 9 0 0112.21 3 7 7 0 0012 21a9 9 0 009-8.21z"/>
          </svg>`;
}

function getSunIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24">
            <path d="M6.76 4.84l-1.8-1.79-1.42 1.42 1.79 1.8 1.43-1.43zm10.48 0l1.79-1.8-1.42-1.42-1.8 1.79 1.43 1.43zM12 4V1h-2v3h2zm0 16v3h2v-3h-2zm8.95-9h3v2h-3v-2zm-16 0H1v2h3v-2zm2.66 6.36l-1.43 1.43 1.8 1.79 1.42-1.42-1.79-1.8zm9.9 0l1.79 1.8 1.42-1.42-1.8-1.79-1.41 1.41zM12 8a4 4 0 100 8 4 4 0 000-8z"/>
          </svg>`;
}

function updateToggleIcon() {
  const toggleIcon = document.getElementById('toggleIcon');
  if (document.body.getAttribute('data-theme') === 'dark') {
    toggleIcon.innerHTML = getSunIcon();
    moodChart.data.datasets[0].borderColor = '#ffcc00'; // Bright yellow for dark mode
  } else {
    toggleIcon.innerHTML = getMoonIcon();
    moodChart.data.datasets[0].borderColor = 'rgba(75, 192, 192, 1)'; // Default color for light mode
  }
  moodChart.update();
}

document.addEventListener('DOMContentLoaded', () => {
  updateToggleIcon();
  loadEntries();
  warmUpOpenAI(); // Warm up the connection on startup
});
document.getElementById('toggleDarkMode').addEventListener('click', () => {
  const currentTheme = document.body.getAttribute('data-theme');
  if (currentTheme === 'dark') {
    document.body.removeAttribute('data-theme');
    log("Switched to light mode.");
  } else {
    document.body.setAttribute('data-theme', 'dark');
    log("Switched to dark mode.");
  }
  updateToggleIcon();
});

// Function to open a modal displaying a saved journal entry
function openJournalModal(entry) {
  document.getElementById('modalDate').textContent = entry.date;
  document.getElementById('modalJournalText').textContent = entry.text;
  document.getElementById('modalStressQuality').textContent = entry.stressQuality;
  document.getElementById('modalSleepQuality').textContent = entry.sleepQuality;
  document.getElementById('modalProductivity').textContent = entry.productive;
  document.getElementById('modalMoodLevel').textContent = entry.moodLevel;
  document.getElementById('modalHoursSlept').textContent = entry.hoursSlept;
  document.getElementById('journalModal').style.display = "block";
  log(`Opened journal modal for entry on ${entry.date}`);
}

document.querySelector('.close').addEventListener('click', () => {
  document.getElementById('journalModal').style.display = "none";
});

// Analyze journal entry: send text and metrics to OpenAI using chat completions, and save the AI mood score
document.getElementById('analyzeMood').addEventListener('click', async () => {
  const journalText = document.getElementById('journalEntry').value;
  if (!journalText) {
    alert("Please write a journal entry first.");
    log("Attempted to analyze mood with empty journal entry.");
    return;
  }
  
  // Get slider values
  const stressQuality = document.getElementById('stressQuality').value;
  const sleepQuality = document.getElementById('sleepQuality').value;
  const productive = document.getElementById('productive').value;
  const moodLevel = document.getElementById('moodLevel').value;
  const hoursSlept = document.getElementById('hoursSlept').value;
  
  // Use the outsourced prompt builder to create the prompt string.
  const prompt = buildPrompt(journalText, stressQuality, sleepQuality, productive, moodLevel, hoursSlept);
  
  try {
    // Log that an OpenAI connection is being established
    log(`Establishing OpenAI connection with model: ${process.env.OPENAI_MODEL}`);
    
    // Use the chat completions endpoint
    const response = await openai.createChatCompletion({
        model: process.env.OPENAI_MODEL,
        messages: [
          {
            role: "system",
            content: "You are an AI that extracts a single numeric mood score between -10 and 10 from the provided data. Return ONLY the numeric value with no additional text, punctuation, or formatting."
          },
          { role: "user", content: prompt }
        ],
        max_tokens: 50,
        temperature: 0.7
    });
    
    // Check if the response contains data and choices
    if (!response.data || !response.data.choices || response.data.choices.length === 0) {
        throw new Error("No choices returned from the chat completion API.");
    }
  
    // Extract the output from the chat completion response.
    const aiOutput = response.data.choices[0].message.content.trim();
    // Post-process: extract the first valid number from the response.
    const numberMatch = aiOutput.match(/(-?\d+(\.\d+)?)/);
    if (!numberMatch) {
      throw new Error(`Unable to parse mood score from AI output: "${aiOutput}"`);
    }
    const aiMoodScore = parseFloat(numberMatch[0]);
    
    // Determine sentiment interpretation based on the numeric score.
    let sentimentInterpretation = (aiMoodScore < 0) ? "Negative sentiment." :
                                  (aiMoodScore === 0) ? "Neutral sentiment." : "Positive sentiment.";
    
    // Record the current date and time.
    const now = new Date();
    const dateString = now.toLocaleDateString() + " " + now.toLocaleTimeString();
    
    // Save data: use the AI mood score for the current mood.
    moodData.push(aiMoodScore);
    entryDates.push(dateString);
    journalEntries.push({
      date: dateString,
      text: journalText,
      moodScore: aiMoodScore,
      stressQuality: stressQuality,
      sleepQuality: sleepQuality,
      productive: productive,
      moodLevel: moodLevel,
      hoursSlept: hoursSlept
    });
    
    // Update Chart.js.
    moodChart.data.labels = entryDates;
    moodChart.data.datasets[0].data = moodData;
    moodChart.update();
    
    // Display the mood result with interpretation.
    document.getElementById('sentimentResult').innerHTML = `<p>Mood Score: <strong>${aiMoodScore}</strong> (${sentimentInterpretation})</p>`;
    
    // Retrieve usage metrics from the API response and calculate an approximate cost.
    const usage = response.data.usage;
    const promptCost = (usage.prompt_tokens / 1000) * 0.03;
    const completionCost = (usage.completion_tokens / 1000) * 0.06;
    const totalCost = promptCost + completionCost;
    
    log(`OpenAI API call succeeded. Model: ${process.env.OPENAI_MODEL}. Prompt tokens: ${usage.prompt_tokens}, Completion tokens: ${usage.completion_tokens}, Total tokens: ${usage.total_tokens}. Approximate price: $${totalCost.toFixed(4)}.`);
    
    // Save entries to disk.
    saveEntries();
  } catch (error) {
    let errorDetails = `Error fetching AI mood analysis: ${error.message}`;
    if (error.response) {
      errorDetails += `\nStatus: ${error.response.status}`;
      errorDetails += `\nStatus Text: ${error.response.statusText}`;
      errorDetails += `\nResponse Data: ${JSON.stringify(error.response.data)}`;
    }
    console.error(errorDetails);
    log(errorDetails);
    document.getElementById('sentimentResult').innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
    return;
  }
  
  // Clear the journal entry field and reset sliders to default values.
  document.getElementById('journalEntry').value = "";
  sliderIds.forEach(id => {
    const slider = document.getElementById(id);
    slider.value = (id === 'hoursSlept') ? 7 : 5;
    document.getElementById(id + 'Value').textContent = slider.value;
  });
});
