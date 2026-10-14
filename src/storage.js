const SAVE_KEY = "treasureQuestSaveV1";
export function loadProgress() {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    return saved ? JSON.parse(saved) : { unlocked: 1, bestScores: {}, bestTimes: {}, totalScore: 0, achievements: [] };
  } catch { return { unlocked: 1, bestScores: {}, bestTimes: {}, totalScore: 0, achievements: [] }; }
}
export function saveProgress(progress) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(progress)); return true; }
  catch { return false; }
}
export function clearProgress() { localStorage.removeItem(SAVE_KEY); }