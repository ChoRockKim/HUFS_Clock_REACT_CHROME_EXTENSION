import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// (환경에 따라 자동 전환)
const smartStorageAdapter = {

  getItem: async (name) => {
    try {
      // 1. 크롬 익스텐션 환경인지 확인
      if (typeof chrome !== 'undefined' && chrome.storage) {
        const result = await chrome.storage.local.get(name);
        return result[name] || null;
      }

      // 2. 아니면(로컬 개발 환경) localStorage 사용
      return localStorage.getItem(name);
    } catch (e) {
      console.error(`[storage] '${name}' 불러오기 실패 — 기본값으로 대체합니다.`, e);
      return null;
    }
  },

  setItem: async (name, value) => {
    try {
      // 1. 크롬 익스텐션 환경
      if (typeof chrome !== 'undefined' && chrome.storage) {
        await chrome.storage.local.set({ [name]: value });
      }
      // 2. 로컬 개발 환경
      else {
        localStorage.setItem(name, value);
      }
    } catch (e) {
      console.error(`[storage] '${name}' 저장 실패 — 이번 변경사항은 다음 새 탭에서 사라질 수 있습니다.`, e);
    }
  },

  removeItem: async (name) => {
    try {
      // 1. 크롬 익스텐션 환경
      if (typeof chrome !== 'undefined' && chrome.storage) {
        await chrome.storage.local.remove(name);
      }
      // 2. 로컬 개발 환경
      else {
        localStorage.removeItem(name);
      }
    } catch (e) {
      console.error(`[storage] '${name}' 삭제 실패`, e);
    }
  },
};

// --- 초기 상태 정의 ---
const initialState = {
  isDarkMode: false,
  selectedCampus: null,
  userName: null,
  enterYear : null,
  inCartCourse : [],
  lastSeenNoticeId: null,
  customBookmarkCount: 4,
  isBookmarkPinned: false,
  userLink : [{ id : 0,
                hotLinkName : '🏛️ 홈페이지',
                hotLink :'https://www.hufs.ac.kr',
                custom : false},
              { id : 1,
                hotLinkName : '✏️ E-class',
                hotLink :'https://eclass.hufs.ac.kr',
                custom : false},
              { id : 2,
                hotLinkName : '📖 종정시',
                hotLink : 'https://wis.hufs.ac.kr',
                custom : false},
              { id : 3,
                hotLinkName : '🏢 Ability',
                hotLink :'https://hufsability.hufs.ac.kr',
                custom : false},
              { id : 4,  hotLinkName: '북마크 추가', hotLink : '', custom: true },
              { id : 5,  hotLinkName: '북마크 추가', hotLink : '', custom: true },
              { id : 6,  hotLinkName: '북마크 추가', hotLink : '', custom: true },
              { id : 7,  hotLinkName: '북마크 추가', hotLink : '', custom: true },
              { id : 8,  hotLinkName: '북마크 추가', hotLink : '', custom: true },
              { id : 9,  hotLinkName: '북마크 추가', hotLink : '', custom: true },
              { id : 10, hotLinkName: '북마크 추가', hotLink : '', custom: true },
              { id : 11, hotLinkName: '북마크 추가', hotLink : '', custom: true },],
};

// Store 생성
const useSettingStore = create(
  persist(
    (set) => ({
      ...initialState,

      // --- Actions ---
      updateUserLink: (updatedLink) =>
        set((state) => {
          const exists = state.userLink.some(link => link.id === updatedLink.id);
          if (exists) {
            return { userLink: state.userLink.map(link =>
              link.id === updatedLink.id ? { ...link, ...updatedLink } : link
            )};
          }
          return { userLink: [...state.userLink, updatedLink] };
        }),

      removeUserLink: (linkIdToRemove) =>
        set((state) => ({
          userLink: state.userLink.map((link) =>
            link.id === linkIdToRemove
              ? { ...link, hotLinkName: '북마크 추가', hotLink: '', custom: true }
              : link
          ),
        })),

        setInCartCourse : (course) => set((state) => {
          const isDuplicated = state.inCartCourse.some(c => c.c_id === String(course.c_id));
          if (isDuplicated) {
            alert('이미 추가한 강의입니다.')
            return state;
          }
          return {inCartCourse : [...state.inCartCourse, course]};
        }),

        removeInCartCourse : (courseId) => set((state) =>{
          return {inCartCourse : state.inCartCourse.filter(c => c.c_id !== String(courseId))}
        }),

      setCampus : (campusKey) => set({ selectedCampus: campusKey }),
      
      // 저장된 캠퍼스 값이 유효하지 않을 때 캠퍼스만 초기화 (북마크 등 나머지 설정은 보존)
      resetCampus: () => {
        set({ selectedCampus: null });
      },

      toggleBookmarkPin: () => set((state) => ({ isBookmarkPinned: !state.isBookmarkPinned })),
      setNameCash : (nameKey) => set({ userName : nameKey}),
      setYearCash : (yearKey) => set({ enterYear : yearKey}),
      changeBg: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setLastSeenNoticeId: (id) => set({ lastSeenNoticeId: id }),
      increaseBookmark: () => set((state) => ({
        customBookmarkCount: Math.min(state.customBookmarkCount + 2, 8)
      })),
      decreaseBookmark: () => set((state) => ({
        customBookmarkCount: Math.max(state.customBookmarkCount - 2, 4)
      })),
    }),
    {
      name: 'hufs-clock-settings', // 저장될 키 이름
      storage: createJSONStorage(() => smartStorageAdapter), // 어댑터 연결
      version: 1, // 이후 저장 구조를 바꿀 때 migrate 함수를 추가하기 위한 버전 기준점
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('[storage] 설정 복원 실패 — 기본값으로 시작합니다.', error);
        }
      },
    }
  )
);

export default useSettingStore;