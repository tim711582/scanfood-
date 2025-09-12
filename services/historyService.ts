
import type { AnalysisResult, HistoryItem } from '../types';

const HISTORY_KEY = 'nutrition-analysis-history';

export const getHistory = (): HistoryItem[] => {
    try {
        const historyJson = localStorage.getItem(HISTORY_KEY);
        if (historyJson) {
            return JSON.parse(historyJson);
        }
    } catch (error) {
        console.error("Failed to parse history from localStorage:", error);
        localStorage.removeItem(HISTORY_KEY);
    }
    return [];
};

export const saveAnalysisToHistory = (result: AnalysisResult): HistoryItem[] => {
    const history = getHistory();
    const newHistoryItem: HistoryItem = {
        ...result,
        id: `${Date.now()}-${result.productName}`,
        timestamp: Date.now(),
    };
    
    // Prepend new item to show the most recent first
    const updatedHistory = [newHistoryItem, ...history];
    
    try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
        console.error("Failed to save history to localStorage:", error);
    }

    return updatedHistory;
};

export const clearHistory = (): void => {
    try {
        localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
        console.error("Failed to clear history from localStorage:", error);
    }
};
