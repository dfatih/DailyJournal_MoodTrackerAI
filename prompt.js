// prompt.js

/**
 * Builds the prompt for AI mood analysis using the provided journal entry and metrics.
 *
 * @param {string} journalText - The journal entry text.
 * @param {string|number} stressQuality - The stress quality metric.
 * @param {string|number} sleepQuality - The sleep quality metric.
 * @param {string|number} productive - The productivity metric.
 * @param {string|number} moodLevel - The mood level metric.
 * @param {string|number} hoursSlept - The hours slept metric.
 * @returns {string} - The complete prompt for the AI.
 */
function buildPrompt(journalText, stressQuality, sleepQuality, productive, moodLevel, hoursSlept) {
    return `Analyze the following journal entry and metrics. Return ONLY a single numeric value (a number between 0.0 and 1.0) that represents the overall mood. Do not include any words, punctuation, or additional data—output ONLY the number.
  
  Journal Entry:
  ${journalText}
  
  Metrics:
  - Stress Quality: ${stressQuality}
  - Sleep Quality: ${sleepQuality}
  - Productivity: ${productive}
  - Mood Level: ${moodLevel}
  - Hours Slept: ${hoursSlept}`;
  }
  
  module.exports = buildPrompt;
  