
import type { SavedSummary, ProvenanceResult } from '../types';

const SUMMARIES_KEY = 'provenance_summaries';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getSummaries = async (): Promise<SavedSummary[]> => {
  await delay(200);
  try {
    const summariesJson = localStorage.getItem(SUMMARIES_KEY);
    if (!summariesJson) return [];
    const summaries = JSON.parse(summariesJson) as SavedSummary[];
    return summaries.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error("Failed to get summaries from localStorage:", error);
    return [];
  }
};

export const saveSummary = async (data: { ehrData: string; result: ProvenanceResult }): Promise<SavedSummary> => {
  await delay(200);
  const newSummary: SavedSummary = {
    ...data,
    id: `summary_${Date.now()}`,
    timestamp: Date.now(),
  };

  try {
    const summaries = await getSummaries();
    const updatedSummaries = [newSummary, ...summaries];
    localStorage.setItem(SUMMARIES_KEY, JSON.stringify(updatedSummaries));
  } catch (error) {
    console.error("Failed to save summary to localStorage:", error);
  }
  return newSummary;
};

export const deleteSummary = async (id: string): Promise<void> => {
    await delay(200);
    try {
        let summaries = await getSummaries();
        summaries = summaries.filter(s => s.id !== id);
        localStorage.setItem(SUMMARIES_KEY, JSON.stringify(summaries));
    } catch (error) {
        console.error("Failed to delete summary from localStorage:", error);
    }
};
