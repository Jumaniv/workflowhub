import axios from "axios";

export interface AITaskSuggestion {
  title: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
}

export class AIService {
  static async generateTaskSuggestions(
    projectName: string,
    prompt: string
  ): Promise<AITaskSuggestion[]> {
    const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL;
    const OLLAMA_MODEL = process.env.OLLAMA_MODEL;

    if (!OLLAMA_BASE_URL || !OLLAMA_MODEL) {
      throw new Error("Ollama environment variables are missing");
    }

    const fullPrompt = `
You are a project management assistant.

Project: ${projectName}
User request: ${prompt}

Return ONLY valid JSON array with:
- title
- priority (LOW | MEDIUM | HIGH)
`;

    const response = await axios.post(
      `${OLLAMA_BASE_URL}/api/generate`,
      {
        model: OLLAMA_MODEL,
        prompt: fullPrompt,
        stream: false
      }
    );

    const raw = response.data.response;

    // Safe JSON extraction
    const start = raw.indexOf("[");
    const end = raw.lastIndexOf("]") + 1;

    if (start === -1 || end === -1) return [];

    return JSON.parse(raw.slice(start, end));
  }
}
