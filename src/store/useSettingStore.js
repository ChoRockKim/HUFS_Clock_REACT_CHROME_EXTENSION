import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// (환경에 따라 자동 전환)
const smartStorageAdapter = {
  
  getItem: async (name) => {
    // 1. 크롬 익스텐션 환경인지 확인
    if (typeof chrome !== 'undefined' && chrome.storage) {
      const result = await chrome.storage.local.get(name);
      return result[name] || null;
    }
    
    // 2. 아니면(로컬 개발 환경) localStorage 사용
    console.log(`[Dev] 로컬스토리지에서 불러옴: ${name}`);
    return localStorage.getItem(name);
  },

  setItem: async (name, value) => {
    // 1. 크롬 익스텐션 환경
    if (typeof chrome !== 'undefined' && chrome.storage) {
      await chrome.storage.local.set({ [name]: value });
    } 
    // 2. 로컬 개발 환경
    else {
      console.log(`[Dev] 로컬스토리지에 저장함: ${name}`, value);
      localStorage.setItem(name, value);
    }
  },

  removeItem: async (name) => {
    // 1. 크롬 익스텐션 환경
    if (typeof chrome !== 'undefined' && chrome.storage) {
      await chrome.storage.local.remove(name);
    } 
    // 2. 로컬 개발 환경
    else {
      localStorage.removeItem(name);
    }
  },
};

// Store 생성
const useSettingStore = create(
  persist(
    (set) => ({
      // --- State ---
      isDarkMode: false,
      selectedCampus: null,
      userName: null,
      enterYear : null,

      // --- Actions ---
      setCampus: (campusKey) => set({ selectedCampus: campusKey }),
      resetCampus: () => set({ selectedCampus: null }),
      setNameCash : (nameKey) => set({ userName : nameKey}),
      setYearCash : (yearKey) => set({ enterYear : yearKey}),
      changeBg: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: 'hufs-clock-settings', // 저장될 키 이름
      storage: createJSONStorage(() => smartStorageAdapter), // 어댑터 연결
    }
  )
);

export default useSettingStore;