import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'; // 👈 필수 import

// 1. 크롬 스토리지용 '통역사(Adapter)' 만들기
const chromeStorageAdapter = {
  getItem: async (name) => {
    // 개발 환경(localhost) 등에서 chrome API가 없을 때 에러 방지
    if (typeof chrome === 'undefined' || !chrome.storage) return null;
    
    // 비동기로 데이터 가져오기
    const result = await chrome.storage.local.get(name);
    return result[name] || null;
  },
  setItem: async (name, value) => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      await chrome.storage.local.set({ [name]: value });
    }
  },
  removeItem: async (name) => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      await chrome.storage.local.remove(name);
    }
  },
};

// 2. Store 생성 (persist로 감싸기)
const useSettingStore = create(
  persist(
    (set) => ({
      // --- State ---
      isDarkMode: false,

      // --- Actions ---
      changeBg: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: 'hufs-clock-settings',
      storage: createJSONStorage(() => chromeStorageAdapter),
    }
  )
);

export default useSettingStore;