import { GoogleGenAI } from "@google/genai";

// This is a placeholder structure for Gemini integration.
// In a real app, this would handle AI chef recommendations.

let aiClient: GoogleGenAI | null = null;

export const initializeGemini = () => {
  const apiKey = process.env.API_KEY;
  if (apiKey) {
    aiClient = new GoogleGenAI({ apiKey });
  }
};

export const getMealRecommendation = async (preferences: string): Promise<string> => {
  if (!aiClient) return "Xin lỗi, trợ lý AI chưa được cấu hình.";
  
  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Suggest 3 vietnamese dishes for someone who likes: ${preferences}. Return valid JSON array of strings.`,
    });
    return response.text || "Không tìm thấy gợi ý.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Đã có lỗi xảy ra khi kết nối với AI.";
  }
};