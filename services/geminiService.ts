import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY 環境變數未設定。");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        healthScore: {
            type: Type.INTEGER,
            description: "產品的整體健康評分，從 0（非常不健康）到 100（非常健康），基於所發現添加劑的數量和嚴重程度。"
        },
        summary: {
            type: Type.STRING,
            description: "簡短的一兩句話總結分析結果。"
        },
        additives: {
            type: Type.ARRAY,
            description: "已識別的食品添加劑列表。",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: {
                        type: Type.STRING,
                        description: "添加劑的名稱，例如'阿斯巴甜'。"
                    },
                    riskLevel: {
                        type: Type.STRING,
                        description: "潛在健康風險的分類：'Low'、'Medium'或'High'。"
                    },
                    description: {
                        type: Type.STRING,
                        description: "簡要說明該添加劑是什麼及其用途。"
                    },
                    potentialHarm: {
                        type: Type.STRING,
                        description: "與該添加劑相關的潛在健康問題或副作用的摘要。"
                    }
                },
                required: ["name", "riskLevel", "description", "potentialHarm"]
            }
        }
    },
    required: ["healthScore", "summary", "additives"]
};

const prompt = `您是一位專門研究食品添加劑的專業營養師和食品科學家。請分析附加的食品營養標籤圖片中的成分列表。

您的任務是：
1. 仔細閱讀並從圖片中提取成分列表。
2. 識別所有食品添加劑，包括但不限於防腐劑、人工色素、人工香料、甜味劑、乳化劑和增稠劑。
3. 對於每種已識別的添加劑，請提供其名稱、風險等級（'Low'、'Medium'或'High'）、其功能的簡要描述，以及基於科學研究的潛在健康危害摘要。
4. 為產品計算一個從 0（非常不健康）到 100（非常健康）的整體'健康分數'。該分數應主要基於所發現添加劑的數量和嚴重程度。如果產品是純天然且不含任何添加劑，請務必給予 100 分的滿分。
5. 提供您整體發現的簡短摘要。

僅以嚴格遵守所提供 schema 的有效 JSON 物件回應。請勿在 JSON 物件之外包含任何文字、反引號或解釋。請以繁體中文回答。`;

export const analyzeNutritionLabel = async (imageBase64: string, mimeType: string): Promise<AnalysisResult> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: imageBase64,
                            mimeType: mimeType,
                        },
                    },
                    { text: prompt },
                ],
            },
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
            }
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);

        // Basic validation
        if (!result.healthScore || !result.summary || !Array.isArray(result.additives)) {
            throw new Error("來自 API 的回應格式無效。");
        }
        
        return result as AnalysisResult;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("分析營養標籤失敗。AI 模型可能暫時不可用或無法處理該圖片。請使用清晰、光線充足的照片再試一次。");
    }
};