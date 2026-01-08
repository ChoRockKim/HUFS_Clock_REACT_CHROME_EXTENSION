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

// --- 초기 상태 정의 ---
const initialState = {
  isDarkMode: false,
  selectedCampus: null,
  userName: null,
  enterYear : null,
  inCartCourse : [],
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
              { id : 4,
                hotLinkName: '북마크 추가',
                hotLink : '',
                custom: true
              },
              { id : 5,
                hotLinkName: '북마크 추가',
                hotLink : '',
                custom : true
              },
              { id : 6,
                hotLinkName: '북마크 추가',
                hotLink : '',
                custom: true
              },
              { id : 7,
                hotLinkName: '북마크 추가',
                hotLink : '',
                custom : true
              }],
};

// Store 생성
const useSettingStore = create(
  persist(
    (set) => ({
      ...initialState,

      // --- Actions ---
      updateUserLink: (updatedLink) =>
        set((state) => ({
          userLink: state.userLink.map((link) =>
            link.id === updatedLink.id ? { ...link, ...updatedLink } : link
          ),
        })),

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
      
      // [수정] 데이터 꼬임 문제를 해결하기 위해 상태 전체를 초기화하는 강력한 리셋 기능
      resetCampus: () => {
        console.warn("데이터 무결성 문제로 모든 설정을 초기화합니다.");
        set(initialState, true); // true는 상태를 덮어쓰라는 의미
      },

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