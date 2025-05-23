// lib/llm/gemini-service.ts
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { LLMService } from "./llm-service";

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY || "";
const MODEL_NAME = "gemini-2.0-flash"; // Or your preferred model

export class GeminiService implements LLMService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    if (!API_KEY) {
      throw new Error("GOOGLE_GEMINI_API_KEY is not set.");
    }
    this.genAI = new GoogleGenerativeAI(API_KEY);
  }

  async generateSql(
    schema: string,
    naturalLanguageQuery: string
  ): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `
      Given the following MySQL database schema:
      --- SCHEMA START ---
      ${schema}
      --- SCHEMA END ---

      Based on this schema, convert the following natural language question into a MySQL SELECT query.
      IMPORTANT RULES:
      1. ONLY generate SELECT queries. DO NOT generate INSERT, UPDATE, DELETE, DROP, or any other DDL/DML statements.
      2. If the user asks to see all data or doesn't specify a limit, try to infer a reasonable limit, but if they explicitly ask for a specific limit (e.g., "top 10", "5 oldest"), use that.
      3. If no limit is implied or specified, default to LIMIT 100. If the user says "show all" or similar, you can omit the LIMIT clause or use a very large one (e.g., LIMIT 1000) if you think it's appropriate but still prioritize performance. For this application, it's better to default to LIMIT 100 if "all" is mentioned unless overridden by a number.
      4. Ensure the query is valid MySQL syntax.
      5. Do not add any explanatory text before or after the SQL query. Just the query itself.
      6. If the question cannot be answered with a SELECT query based on the schema, or if it's ambiguous, respond with "ERROR: Cannot answer question with a SELECT query based on the provided schema."
      7. Return only the SQL SELECT query as plain text, with no code block formatting, no Markdown, and no explanation. Output only the SQL statement.

      Natural Language Question: "${naturalLanguageQuery}"

      MySQL SELECT Query:
    `;

    try {
      const generationConfig = {
        temperature: 0.1, // Lower temperature for more deterministic SQL
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      };
      const safetySettings = [
        // Be quite strict
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ];

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig,
        safetySettings,
      });

      const responseText = result.response.text().trim();
      // Clean up any code block formatting
      const cleanedResponse = responseText
        .replace(/```sql\n?/g, "") // Remove ```sql
        .replace(/```\n?/g, "") // Remove closing ```
        .trim(); // Remove any extra whitespace

      console.log("Original response:", responseText);
      console.log("Cleaned response:", cleanedResponse);

      if (cleanedResponse.toUpperCase().startsWith("ERROR:")) {
        throw new Error(cleanedResponse.substring("ERROR:".length).trim());
      }
      if (!cleanedResponse.toUpperCase().trim().startsWith("SELECT")) {
        const err = new Error(
          "LLM did not generate a SELECT query. It might be attempting a restricted operation or failed to understand."
        );
        // Attach the raw output for debugging
        (err as any).llmOutput = responseText;
        throw err;
      }
      return cleanedResponse;
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      let userFriendlyError =
        "The AI model encountered an issue generating the SQL query.";
      if (error.message.includes("API key not valid")) {
        userFriendlyError =
          "The Gemini API key is invalid or missing. Please check your configuration.";
      } else if (error.message.includes("quota")) {
        userFriendlyError =
          "You have exceeded your Gemini API quota. Please check your usage limits.";
      } else if (error.message.includes("Cannot answer question")) {
        userFriendlyError = error.message;
      } else if (
        error.message.includes("LLM did not generate a SELECT query")
      ) {
        userFriendlyError = error.message;
      }
      throw new Error(userFriendlyError);
    }
  }
}
