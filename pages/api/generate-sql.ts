// pages/api/generate-sql.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { GeminiService } from "../../lib/llm/gemini-service"; // Or your LLM service factory

interface GenerateSqlResponse {
  sqlQuery?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GenerateSqlResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { schema, naturalLanguageQuery } = req.body;

  if (!schema || !naturalLanguageQuery) {
    return res
      .status(400)
      .json({ error: "Schema and natural language query are required." });
  }

  try {
    const llmService = new GeminiService();
    const sqlQuery = await llmService.generateSql(schema, naturalLanguageQuery);
    res.status(200).json({ sqlQuery });
  } catch (error: any) {
    console.error("Generate SQL API Error:", error);
    // Add this to include the raw LLM output if available
    res.status(500).json({
      error: error.message || "Failed to generate SQL query."
    });
  }
}
