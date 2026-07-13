# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # 로컬 개발 서버 실행 (Vite)
npm run build     # Chrome Extension 빌드 → dist/
npm run lint      # ESLint 검사
npm run deploy    # build + zip 생성 (Chrome Web Store 업로드용 deploy.zip)
```

## Architecture

### Chrome Extension 구조
Manifest V3 기반. `chrome_url_overrides.newtab`으로 새 탭을 `index.html`로 교체한다. 권한은 `storage`와 `https://hufs-clock-api.vercel.app/*`만 사용.

빌드 결과물(`dist/`)을 크롬 확장 프로그램 관리자에 로드하거나, `npm run deploy`로 zip을 만들어 Web Store에 업로드한다.

### 페이지 흐름
```
App.jsx
 ├─ selectedCampus 없음 → IntroSelect (캠퍼스 첫 선택 화면)
 └─ selectedCampus 있음 → Swiper (세로 슬라이드)
      ├─ Slide 1: MainPage  (공지, 시각, 카운트다운, 학식, 북마크)
      └─ Slide 2: SubPage1  (도서관 여석, 날씨, 랜덤메뉴, 시간표)
```

### 전역 상태 — `src/store/useSettingStore.js`
Zustand + persist 미들웨어. 크롬 환경에서는 `chrome.storage.local`, 로컬 개발 환경에서는 `localStorage`를 자동 전환하는 `smartStorageAdapter`를 통해 저장.

저장 키:
| 키 | 타입 | 설명 |
|---|---|---|
| `selectedCampus` | `'SEOUL'` \| `'GLOBAL'` | 캠퍼스 선택 |
| `userName` | string | 사용자 이름 |
| `enterYear` | string | 입학년도 |
| `isDarkMode` | boolean | 다크모드 여부 |
| `inCartCourse` | array | 시간표 장바구니 |
| `userLink` | array | 북마크 링크 (고정 4개 + 커스텀 최대 8개, id 0~11) |
| `customBookmarkCount` | number | 표시할 커스텀 북마크 수 (기본 4, 최소 4, 최대 8, 2개 단위) |
| `lastSeenNoticeId` | number \| null | 마지막으로 본 앱 공지 id |
| `isBookmarkPinned` | boolean | 바로가기 패널 고정 여부 |

캠퍼스 값은 반드시 문자열 `'SEOUL'` 또는 `'GLOBAL'`이어야 한다. 레거시 객체가 들어오면 `App.jsx`가 감지해 `resetCampus()`로 초기화.

### 캠퍼스 설정 — `src/constants/campusConfig.js`
`CAMPUS_DATA['SEOUL']`, `CAMPUS_DATA['GLOBAL']` 객체에 API 경로와 배경 이미지가 묶여 있다. 새 캠퍼스를 추가하거나 API 경로를 바꿀 때 이 파일을 수정한다.

### 데이터 페칭 — `src/api/` + `src/hooks/useSchoolData.jsx`
TanStack React Query 5 + `PersistQueryClientProvider`로 캐시를 IndexedDB(`localStorage` 래퍼)에 영속화.

| 훅 | 파일 | 캐시 | 설명 |
|---|---|---|---|
| `useData()` | `api/request.js` | 30분 | 학교 종합 데이터 (공지·학식·학사일정) |
| `useBundleData()` | `hooks/useSchoolData.jsx` | 5분 | 위와 동일, bundle 엔드포인트 |
| `useLibraryData()` | `api/library.js` / `hooks/useSchoolData.jsx` | 1분 | 도서관 열람실 여석 |
| `useWeatherData()` | `api/weather.js` | 10분 | 날씨 (캠퍼스별) |
| `useAppNotices()` | `api/appNotices.js` | 0 (항상 최신) | 운영자 공지 |
| `fetchTimeTable()` | `api/timeTable.js` | — | 시간표 검색 (POST, React Query 미사용) |

외부 API 서버는 `https://hufs-clock-api.vercel.app` 단일 오리진.

오프라인/에러 처리 패턴: `isLoading && !data` / `isError && !data`로 캐시가 있으면 캐시를 그대로 표시하고, 캐시가 없을 때만 로딩·에러 UI를 노출한다.

### 앱 공지 시스템
- 백엔드: `Hufs_Clock_API/app_notices.json`에 공지 배열 직접 편집 → `GET /api/app-notices`로 제공
- 프론트: `src/hooks/useAppNoticeAlert.jsx` — `latest.id > lastSeenNoticeId`이면 SweetAlert2 글래스모피즘 토스트 표시 후 id 저장
- `App.jsx`에서 `useAppNoticeAlert()` 호출

### 바로가기(북마크) — `src/components/LinkButtons/LinkButtons.jsx`
- 고정 4개(id 0~3) + 커스텀 슬롯(id 4~11). `customBookmarkCount`(4~8)만큼 커스텀 슬롯을 가상으로 생성하고 `storedCustom[i] ?? 빈슬롯` 패턴으로 렌더링.
- 우상단 핀 버튼으로 패널 고정 가능. 고정 시 `z-index: 1`로 낮아져 다른 UI 뒤로 들어감.
- 커스텀 북마크 추가 시 URL에 `https://`가 없으면 자동 prefix. `new URL()` 검사 실패 시 토스트 에러.
- 삭제 시 `removeUserLink`가 해당 슬롯을 `'북마크 추가'` 빈 상태로 리셋 (데이터 손실 없음).

### SweetAlert2 토스트 스타일
`src/App.scss`에 `.glass-toast`, `.glass-toast-title`, `.glass-toast-show`, `.glass-toast-hide` 클래스 정의. 모든 toast는 이 클래스를 공통으로 사용한다.

### 시간표 기능
- `TimeSearch.jsx` — 검색 조건 입력, `deptCode.js`에서 학과코드 목록 참조
- `TimeTable.jsx` — `inCartCourse`(Zustand)를 그리드로 렌더링
- `src/utils/timeParser.js` — API 응답의 시간 문자열을 교시 번호로 파싱

### 종강 카운트다운 로직 — `src/components/LeftTime/LeftTime.jsx`
API 응답 `data.schedule`의 `first_start`, `first_end`, `second_start`, `second_end`(MM.DD 형식)를 읽어 현재 구간을 판별한다:
1학기 중 → 1학기 종강, 여름방학 → 2학기 개강, 2학기 중 → 2학기 종강, 방학 종료 → 새 학기 개강 (연도 자동 +1).
종강 당일은 축하 메시지로 early return.

### 스타일
컴포넌트마다 동명의 `.scss` 파일이 쌍으로 존재. 전역 스타일은 `src/index.scss`, App 레벨 배경·레이아웃은 `src/App.scss`.
글래스모피즘 공통 스타일은 각 `.scss` 파일 상단의 `%glass-card` placeholder로 정의하고 `@extend`로 사용.
