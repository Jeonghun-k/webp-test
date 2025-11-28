
import { GoogleGenAI, Type } from "@google/genai";
import { Recipe } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateRecipesFromIngredients = async (ingredients: string[]): Promise<Recipe[]> => {
  const modelId = "gemini-2.5-flash";
  
  const prompt = `
    당신은 퓨전 요리 전문가 "냉장고 구조대"입니다.
    사용자가 가진 재료: ${ingredients.join(", ")}.
    
    1. 이 재료들을 활용하여 서로 다른 스타일의 창의적이고 맛있는 1인분 요리 3가지를 추천해주세요.
       (예: 하나는 볶음요리, 하나는 국물요리, 하나는 덮밥 등)
    2. 각 요리에 대해 3~5단계의 간단한 조리 순서를 제공해주세요.
    3. 일반적인 음식 데이터를 기반으로 1인분 기준 영양 성분을 추정해주세요.
    4. 유용한 요리 팁을 하나 제공해주세요.
    
    결과는 반드시 유효한 JSON 배열 형식이어야 하며, 모든 텍스트는 한국어로 작성해주세요.
  `;

  const response = await ai.models.generateContent({
    model: modelId,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Name of the dish" },
            description: { type: Type.STRING, description: "Short appetizing description" },
            ingredients: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of ingredients with quantities"
            },
            steps: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Cooking steps"
            },
            tips: { type: Type.STRING, description: "A pro chef tip" },
            nutrition: {
              type: Type.OBJECT,
              properties: {
                calories: { type: Type.NUMBER },
                carbs: { type: Type.NUMBER },
                protein: { type: Type.NUMBER },
                fat: { type: Type.NUMBER },
              },
              required: ["calories", "carbs", "protein", "fat"]
            }
          },
          required: ["name", "description", "ingredients", "steps", "tips", "nutrition"]
        }
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("AI 응답이 없습니다.");

  const data = JSON.parse(text) as Omit<Recipe, 'id'>[];
  
  // Assign IDs locally
  return data.map((recipe, index) => ({
    ...recipe,
    id: `${Date.now()}-${index}`,
  }));
};

export const generateRecipeImage = async (recipe: Recipe): Promise<string | undefined> => {
  try {
    const imageModelId = "gemini-2.5-flash-image";
    const imagePrompt = `A high quality, delicious professional food photography of ${recipe.name}. ${recipe.description}. Soft lighting, 4k resolution, appetizing, korean food style.`;
    
    const imageResponse = await ai.models.generateContent({
      model: imageModelId,
      contents: {
        parts: [{ text: imagePrompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "4:3",
        }
      }
    });

    for (const part of imageResponse.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.warn("Image generation failed:", error);
    return undefined;
  }
  return undefined;
};
