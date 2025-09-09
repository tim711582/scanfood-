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
            description: "產品的整體健康評分，從 0 到 100。根據詳細的計分規則計算得出。"
        },
        summary: {
            type: Type.STRING,
            description: "簡短的一兩句話總結分析結果，說明產品含有的主要添加劑及其整體風險。"
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
                        description: "添加劑的風險分類：'Low' (低風險), 'Medium' (中風險), 或 'High' (高風險)。"
                    },
                    description: {
                        type: Type.STRING,
                        description: "簡要說明該添加劑是什麼及其功能。"
                    },
                    potentialHarm: {
                        type: Type.STRING,
                        description: "與該添加劑相關的潛在健康危害摘要。"
                    }
                },
                required: ["name", "riskLevel", "description", "potentialHarm"]
            }
        },
        beneficials: {
            type: Type.ARRAY,
            description: "已識別的有益成分列表。",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: {
                        type: Type.STRING,
                        description: "有益成分的名稱，例如'維生素 C'。"
                    },
                    description: {
                        type: Type.STRING,
                        description: "簡要說明該成分是什麼及其功能。"
                    },
                    benefits: {
                        type: Type.STRING,
                        description: "與該成分相關的健康益處摘要。"
                    }
                },
                required: ["name", "description", "benefits"]
            }
        }
    },
    required: ["healthScore", "summary", "additives", "beneficials"]
};


const prompt = `您是一位專門研究食品科學和營養學的 AI 專家。請分析附加的食品營養標籤圖片中的成分列表。

您的任務是：

1.  **識別添加劑**：仔細閱讀成分列表，識別所有食品添加劑，如防腐劑、人工色素、甜味劑、乳化劑等。根據其潛在風險，將其分類為 'Low'、'Medium' 或 'High' 風險。請忽略天然、無害或有益的成分（如維生素、礦物質）。對於每一個識別出的添加劑，請提供：
    *   \`name\`: 添加劑的中文名稱。
    *   \`riskLevel\`: 'Low'、'Medium' 或 'High'。
    *   \`description\`: 該添加劑的簡要描述。
    *   \`potentialHarm\`: 該添加劑的**潛在危害**。

2.  **識別有益成分**：從成分列表中找出對健康有益的成分，例如維生素（維生素C、維生素D）、礦物質（鈣、鐵）、膳食纖維、蛋白質、健康的脂肪（如 Omega-3）等。對於每一個識別出的有益成分，請提供：
    *   \`name\`: 有益成分的中文名稱。
    *   \`description\`: 該成分的簡要描述。
    *   \`benefits\`: 該成分對健康的**具體益處**。

3.  **計算健康分數 (healthScore)**：請嚴格遵守以下計分規則：
    *   **起始分數為 100 分。**
    *   每發現一個 **'Low'** 風險添加劑，**減 5 分**。
    *   每發現一個 **'Medium'** 風險添加劑，**減 15 分**。
    *   每發現一個 **'High'** 風險添加劑，**減 30 分**。
    *   每發現一個 **有益** 成分，**加 5 分**。
    *   **最終分數範圍必須在 0 到 100 之間**。如果計算結果低於 0，則設為 0；如果高於 100，則設為 100。
    *   如果沒有發現任何添加劑或有益成分，**健康分數必須是 100 分**。

4.  **生成總結 (summary)**：提供一個簡潔的（一至兩句話）中文總結，概括您發現的主要添加劑（如果有的話）以及任何顯著的有益成分，並給出產品的整體評價。

請僅以嚴格遵守所提供 schema 的有效 JSON 物件回應。您的回應必須包含 \`healthScore\`、\`summary\`、\`additives\` (即使為空陣列) 和 \`beneficials\` (即使為空陣列) 這些鍵。請勿在 JSON 物件之外包含任何文字、反引號或解釋。請務必以繁體中文回答所有文字內容。`;

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
        if (result.healthScore === undefined || !result.summary || !Array.isArray(result.additives) || !Array.isArray(result.beneficials)) {
            throw new Error("來自 API 的回應格式無效。");
        }
        
        return result as AnalysisResult;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("分析營養標籤失敗。AI 模型可能暫時不可用或無法處理該圖片。請使用清晰、光線充足的照片再試一次。");
    }
};