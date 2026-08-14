import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const STORAGE_NAME = 'hufs-clock-settings';

// 복원이 "성공적으로" 끝나기 전에는 저장을 막는다.
// 복원 전 상태는 기본값이라, 이때 저장하면 디스크의 실제 사용자 데이터가 기본값으로 지워진다.
let canPersist = false;

// 내가 방금 쓴 값이 onChanged로 되돌아오는 것을 무시하기 위한 값
let lastWrittenValue = null;

// (환경에 따라 자동 전환)
const smartStorageAdapter = {

  getItem: async (name) => {
    try {
      // 1. 크롬 익스텐션 환경인지 확인
      if (typeof chrome !== 'undefined' && chrome.storage) {
        const result = await chrome.storage.local.get(name);
        return result[name] ?? null;
      }

      // 2. 아니면(로컬 개발 환경) localStorage 사용
      return localStorage.getItem(name);
    } catch (e) {
      // 여기서 null을 반환하면 zustand가 "저장된 값이 없다"고 오해해서
      // 기본값으로 디스크를 덮어써 버린다. 반드시 실패를 그대로 전파해야 한다.
      console.error(`[storage] '${name}' 불러오기 실패 — 기존 데이터 보호를 위해 이번 세션은 저장하지 않습니다.`, e);
      throw e;
    }
  },

  setItem: async (name, value) => {
    // 복원이 끝나지 않았거나 실패한 상태 = 메모리가 기본값일 수 있는 상태.
    // 이 시점의 저장은 사용자 데이터를 지우는 행위이므로 거부한다.
    if (!canPersist) {
      console.warn(`[storage] '${name}' 복원 완료 전이므로 저장을 건너뜁니다 (기존 데이터 보호).`);
      return;
    }

    try {
      lastWrittenValue = value;
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
  hasHydrated: false, // 스토리지 복원 완료 여부 — 복원 전 set() 발생을 막기 위한 안전장치
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
      name: STORAGE_NAME, // 저장될 키 이름
      storage: createJSONStorage(() => smartStorageAdapter), // 어댑터 연결
      version: 1, // 이후 저장 구조를 바꿀 때 migrate 함수를 추가하기 위한 버전 기준점
      // hasHydrated는 순수 메모리 플래그이므로 디스크에 저장하지 않는다
      partialize: (state) => {
        const persisted = { ...state };
        delete persisted.hasHydrated;
        return persisted;
      },
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('[storage] 설정 복원 실패 — 기본값으로 시작합니다.', error);
        }
      },
    }
  )
);

// onFinishHydration은 복원이 "성공"했을 때만 실행된다.
// (읽기 실패나 JSON 손상은 여기까지 오지 않으므로 canPersist가 false로 남아 디스크가 보호된다)
useSettingStore.persist.onFinishHydration(() => {
  canPersist = true;
  // 이미 true라면 다시 쓰지 않는다 — 아래 onChanged 동기화와 무한 루프가 되는 것을 막는다
  if (!useSettingStore.getState().hasHydrated) {
    useSettingStore.setState({ hasHydrated: true });
  }
});

// 새 탭 확장이라 탭이 여러 개 동시에 열린다.
// 다른 탭의 변경을 받아오지 않으면, 오래된 메모리 상태가 최신 설정을 덮어쓴다.
if (typeof chrome !== 'undefined' && chrome.storage?.onChanged) {
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'local') return;
    const change = changes[STORAGE_NAME];
    if (!change) return;
    if (change.newValue === lastWrittenValue) return; // 내가 쓴 값이면 무시
    useSettingStore.persist.rehydrate();
  });
}

export default useSettingStore;