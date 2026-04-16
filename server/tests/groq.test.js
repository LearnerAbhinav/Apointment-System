const aiService = require('../src/services/ai.service');
const dotenv = require('dotenv');

dotenv.config();

async function testGroqConnection() {
  console.log("Testing real Groq connection with your API key...");
  try {
    const result = await aiService.extractIntentAndData("Book an appointment for tomorrow at 2pm for a coffee chat.");
    console.log("\n✅ Success! Groq returned:");
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("\n❌ Groq Connection Failed:", err.message);
  }
}

testGroqConnection();
