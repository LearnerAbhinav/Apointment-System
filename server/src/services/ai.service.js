const Groq = require("groq-sdk");
const dotenv = require("dotenv");

dotenv.config();

/**
 * AI Service for intent extraction and data normalization.
 * Uses Groq (Llama 3) for high-speed inference.
 * Includes a MOCK_AI mode for testing without a live API key.
 */
class AIService {
  constructor() {
    this.groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;
    this.model = "llama-3.3-70b-versatile";
    
    this.systemPrompt = `
      You are an AI assistant for a production-grade appointment booking system.
      Your goal is to extract structured information from user messages.

      STRICT RULES:
      1. Return ONLY a valid JSON object.
      2. No explanations, no markdown blocks, just raw JSON.
      3. Intent can be one of: "book", "cancel", "reschedule", "view", "unknown".
      4. Extract: name, email, date (YYYY-MM-DD), time (HH:mm), reason.
      5. Use "null" for missing fields.
      6. Message field should be a concise, friendly response.

      JSON STRUCTURE:
      {
        "intent": "string",
        "data": {
          "name": "string | null",
          "email": "string | null",
          "date": "string | null",
          "time": "string | null",
          "reason": "string | null"
        },
        "message": "string"
      }
    `;
  }

  async extractIntentAndData(userMessage, chatHistory = []) {
    // Check if Mock Mode is enabled
    if (process.env.MOCK_AI === 'true' || !this.groq) {
      return this.getMockResponse(userMessage);
    }

    try {
      const completion = await this.groq.chat.completions.create({
        messages: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: userMessage }
        ],
        model: this.model,
        response_format: { type: "json_object" }
      });

      const text = completion.choices[0]?.message?.content;
      return JSON.parse(text);
    } catch (error) {
      console.error("Groq AI Service Error:", error);
      // Fallback to mock for stability during testing if requested, or throw
      if (process.env.NODE_ENV === 'test') return this.getMockResponse(userMessage);
      throw new Error("Failed to process message with AI.");
    }
  }

  getMockResponse(message) {
      const msg = message.toLowerCase();
      let intent = "unknown";
      let data = { name: "Mock User", email: "mock@example.com", date: "2026-04-17", time: "14:00", reason: "Testing" };
      let responseMsg = "I'm in test mode, but I understood you want to interact with the system.";

      if (msg.includes("book") || msg.includes("appointment")) {
          intent = "book";
          responseMsg = "I'll help you book that appointment.";
      } else if (msg.includes("cancel")) {
          intent = "cancel";
          responseMsg = "I can help you cancel your appointment.";
      } else if (msg.includes("view") || msg.includes("my")) {
          intent = "view";
          responseMsg = "Here are your appointments.";
      }

      return {
          intent,
          data,
          message: responseMsg + " (MOCK AI)"
      };
  }
}

module.exports = new AIService();
