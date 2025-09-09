import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY 環境變數未設定。");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        productName: {
            type: Type.STRING,
            description: "從圖片中識別出的產品完整中文名稱，例如'純濃燕麥'。"
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
                    category: {
                        type: Type.STRING,
                        description: "添加劑的分類，例如：'人工甜味劑', '人工色素', '防腐劑', '人工香料', '乳化劑', '濃稠劑', '安定劑'。"
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
                required: ["name", "category", "description", "potentialHarm"]
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
    required: ["productName", "summary", "additives", "beneficials"]
};


const prompt = `您是一位專業的食品添加劑健康風險分析師。請分析附加的食品營養標籤圖片。

您的任務是：

1.  **識別產品名稱 (productName)**：從圖片中找出產品的完整中文名稱。

2.  **識別與分類添加劑 (additives)**：仔細閱讀成分列表，識別所有食品添加劑。請根據以下分類標準嚴格對每個添加劑進行分類 (category)：
    *   '人工甜味劑' (例如：阿斯巴甜、糖精、蔗糖素)
    *   '人工色素' (例如：紅色6號、黃色4號、藍色1號)
    *   '防腐劑' (例如：苯甲酸、山梨酸、亞硝酸鹽)
    *   '人工香料' (例如：香草香精、香精油)
    *   '乳化劑'
    *   '濃稠劑' (例如：羧甲基纖維素)
    *   '安定劑' (例如：阿拉伯膠)
    如果一個添加劑不屬於以上任何一類，請不要將其包含在添加劑列表中。
    對於每一個識別出的添加劑，請提供：
    *   \`name\`: 添加劑的中文名稱。
    *   \`category\`: 上述分類中的一個。
    *   \`description\`: 該添加劑的簡要描述。
    *   \`potentialHarm\`: 該添加劑的潛在危害。

3.  **識別有益成分 (beneficials)**：找出對健康有益的成分，例如維生素、礦物質、膳食纖維等。

4.  **生成總結 (summary)**：提供一個簡潔的中文總結，概括您發現的主要添加劑類別。

請僅以嚴格遵守所提供 schema 的有效 JSON 物件回應。您的回應必須包含 \`productName\`、\`summary\`、\`additives\` (即使為空陣列) 和 \`beneficials\` (即使為空陣列) 這些鍵。請勿在 JSON 物件之外包含任何文字、反引號或解釋。請務必以繁體中文回答所有文字內容。`;

export const getDeductionForCategory = (category: string): number => {
    switch (category) {
        case '人工甜味劑':
            return 20;
        case '人工色素':
        case '防腐劑':
            return 15;
        case '人工香料':
            return 10;
        case '乳化劑':
        case '濃稠劑':
        case '安定劑':
            return 5;
        default:
            return 0;
    }
};

const calculateHealthScore = (additives: AnalysisResult['additives'], beneficials: AnalysisResult['beneficials']): number => {
    let score = 100;

    additives.forEach(additive => {
        score -= getDeductionForCategory(additive.category);
    });

    beneficials.forEach(() => {
        score += 5;
    });

    return Math.max(0, Math.min(100, score));
};


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
        const apiResult = JSON.parse(jsonText);

        if (!apiResult.productName || !apiResult.summary || !Array.isArray(apiResult.additives) || !Array.isArray(apiResult.beneficials)) {
            throw new Error("來自 API 的回應格式無效。");
        }
        
        const healthScore = calculateHealthScore(apiResult.additives, apiResult.beneficials);
        
        return { ...apiResult, healthScore } as AnalysisResult;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("分析營養標籤失敗。AI 模型可能暫時不可用或無法處理該圖片。請使用清晰、光線充足的照片再試一次。");
    }
};