import { AnalyticsGraphPointType } from "@attenex/api-contracts/src/common/analytics";
import axios from "axios";
import { createInterface } from "readline";
import { AIStreamChunk } from "../types/ai";

export const getStreamingAiAnalysisText = async (points: AnalyticsGraphPointType[]) => {
  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      messages: [
        {
          content: `You are an AI assistant that analyzes teacher analytics data. The data is provided in JSON format. Please provide a concise analysis of the data, highlighting any trends, patterns, or insights that can help the teacher improve their teaching methods and student engagement. Here is the data: ${JSON.stringify(points)} The key includes that which day there are mostly not having good attendance give a three line bullet point so teacher can directly understand what they need to improve`,
          role: "system",
        },
        {
          content: `Please provide the analysis in a clear and structured format, using bullet points or numbered lists where appropriate. Avoid repeating the data provided
        just give 3 lines of text and max words are 100`,
          role: "user",
        },
      ],
      model: "groq/compound",
      stream: true,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      responseType: "stream",
    },
  );
  return response.data;
};

export const consumeStreamingAnalysis = async (
  stream: NodeJS.ReadableStream,
  onContent: (content: string) => void,
): Promise<void> => {
  const rl = createInterface({ input: stream, crlfDelay: Infinity });

  for await (const line of rl) {
    const payload = line.replace(/^data:\s*/, "").trim();
    if (!payload || payload === "[DONE]") continue;

    try {
      const chunk: AIStreamChunk = JSON.parse(payload);
      const content = chunk.choices?.[0]?.delta?.content;
      if (content) onContent(content);
    } catch {
      return;
    }
  }
};
