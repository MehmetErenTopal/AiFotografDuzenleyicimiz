import { GoogleGenAI } from "@google/genai";
import { ImageSize } from "../types";

// Yeni bir istemci örneği almak için yardımcı fonksiyon.
const getAiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const editImageWithGemini = async (
  base64Image: string,
  mimeType: string,
  prompt: string
): Promise<string | null> => {
  const ai = getAiClient();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Resim düzenlenirken hata oluştu:", error);
    throw error;
  }
};

export const generateImageWithGemini = async (
  prompt: string,
  size: ImageSize
): Promise<string | null> => {
  const ai = getAiClient();

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          imageSize: size,
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Resim oluşturulurken hata oluştu:", error);
    throw error;
  }
};