import { AppData, SaveData } from '@/app/lib/types';

const SAVE_KEY = 'hauntographer_save';
const SAVE_VERSION = '1.0.0';

export function saveGame(appData: AppData): boolean {
  try {
    const saveData: SaveData = {
      version: SAVE_VERSION,
      savedAt: new Date(),
      appData,
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    console.log('[SaveSystem] Game saved successfully');
    return true;
  } catch (error) {
    console.error('[SaveSystem] Failed to save game:', error);
    return false;
  }
}

export function loadGame(): AppData | null {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (!saved) return null;

    const saveData: SaveData = JSON.parse(saved);
    
    // Version check
    if (saveData.version !== SAVE_VERSION) {
      console.warn('[SaveSystem] Save version mismatch, ignoring save');
      return null;
    }

    console.log('[SaveSystem] Game loaded successfully');
    return saveData.appData;
  } catch (error) {
    console.error('[SaveSystem] Failed to load game:', error);
    return null;
  }
}

export function hasSavedGame(): boolean {
  try {
    return localStorage.getItem(SAVE_KEY) !== null;
  } catch {
    return false;
  }
}

export function deleteSave(): boolean {
  try {
    localStorage.removeItem(SAVE_KEY);
    console.log('[SaveSystem] Save deleted');
    return true;
  } catch (error) {
    console.error('[SaveSystem] Failed to delete save:', error);
    return false;
  }
}
