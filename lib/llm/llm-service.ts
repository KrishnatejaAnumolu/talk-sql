// lib/llm/llm-service.ts
export interface LLMService {
  generateSql(schema: string, naturalLanguageQuery: string): Promise<string>;
}