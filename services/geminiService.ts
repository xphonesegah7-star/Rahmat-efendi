
import { GoogleGenAI, Type } from "@google/genai";

export async function getAIEnhancementTips(imageData: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const base64Data = imageData.split(',')[1];
  
  const prompt = "Analyze this photo and provide 3 short, professional tips to optimize it for high-definition physical printing. Focus on brightness, contrast, and color balance. Keep it under 50 words total.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            { inlineData: { mimeType: "image/png", data: base64Data } },
            { text: prompt }
          ]
        }
      ],
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });

    return response.text || "Ensure high resolution and balanced lighting before printing.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Optimize lighting and contrast for best print results.";
  }
}
