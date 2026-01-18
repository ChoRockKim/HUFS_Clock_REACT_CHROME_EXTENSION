# 🕐 HUFS Clock Upgraded

한국외대 학생을 위한 **통합 시간표 및 정보 관리 웹앱**입니다. 캠퍼스별 시간표 조회, 실시간 날씨, 식단 정보, 도서관 좌석 현황 등을 한눈에 확인할 수 있습니다.

---

## ✨ 주요 기능

### 📚 강의 시간표 관리
- **강의 검색**: 학과/과목명으로 강의 검색 및 조회
- **시간표 구성**: 선택한 강의를 장바구니에 담아 시간표 구성
- **시간 충돌 감지**: 중복되는 시간의 강의 등록 방지
- **시각화**: 월~금 요일별, 9시~7시까지 시간대별 그리드 표시
- **캠퍼스별 지원**: 서울/글로벌 캠퍼스 강의 정보 제공

### 🌤️ 실시간 날씨
- 캠퍼스 위치 기반 날씨 정보
- 기온, 습도, 하늘 상태, 강수 정보 표시
- 낮/밤 아이콘 구분

### 🍽️ 식단 정보
- 캠퍼스별 학식당 메뉴 조회
- 오늘/내일 식단 확인

### 📖 도서관 좌석 현황
- 실시간 열람실 좌석 현황
- 캠퍼스별 도서관 정보

### 🔗 커스텀 바로가기
- 자주 가는 사이트 링크 저장
- 북마크 추가/삭제 기능
- 사용자 정의 링크 관리

### 🌙 다크 모드
- 다크/라이트 모드 토글
- 사용자 선호도 저장

---

## 🛠️ 기술 스택

### Frontend
- **React 19** - UI 라이브러리
- **Vite** - 번들러
- **SCSS** - 스타일링
- **Zustand** - 상태 관리 (localStorage/Chrome Storage 지원)
- **React Query** - 비동기 데이터 관리
- **Axios** - HTTP 클라이언트
- **Swiper** - 모바일 스크롤 (터치 제어)
- **SweetAlert2** - 사용자 알림

### 스토리지
- **localStorage** - 로컬 개발 환경
- **Chrome Storage API** - 크롬 익스텐션 환경

---

## 📁 프로젝트 구조

```
src/
├── components/              # 재사용 가능한 UI 컴포넌트
│   ├── CurrentTime/         # 현재 시간 표시
│   ├── LeftTime/            # 남은 수업 시간 계산 (Countdown)
│   ├── TimeTable/           # 시간표 그리드 & 강의 검색
│   │   ├── TimeTable.jsx    # 시간표 시각화 (월~금, 9~7시)
│   │   ├── TimeSearch.jsx   # 강의 검색 & 상세 정보
│   │   └── timeParser.js    # "요일 교시" 형식 파싱
│   ├── Weather/             # 실시간 날씨
│   ├── MealTable/           # 학식 메뉴
│   ├── Library/             # 도서관 좌석 현황
│   ├── LinkButtons/         # 커스텀 바로가기
│   ├── TodaySentence/       # 명언/일일 인사말
│   ├── RandomMenu/          # 오늘의 추천 메뉴
│   ├── NoticeTable/         # 공지사항
│   ├── SettingPopUp/        # 설정 팝업
│   └── UserFeedBack/        # 피드백 제출
├── pages/
│   ├── IntroSelect.jsx      # 캠퍼스 선택 화면
│   ├── MainPage.jsx         # 메인 대시보드
│   ├── SubPage1.jsx         # 추가 페이지
│   └── SkeletonUI/          # 로딩 스켈레톤
├── api/
│   ├── weather.js           # 날씨 API (useQuery)
│   ├── timeTable.js         # 시간표 API
│   ├── library.js           # 도서관 API
│   └── request.js           # 식단/공지사항 API
├── store/
│   └── useSettingStore.js   # Zustand 상태 관리
│       ├── selectedCampus   # 선택 캠퍼스
│       ├── isDarkMode       # 다크 모드 여부
│       ├── inCartCourse     # 장바구니 강의 목록
│       ├── userLink         # 커스텀 바로가기
│       └── userName         # 사용자 이름
├── hooks/
│   ├── useSchoolData.jsx    # 학교 데이터 조회
│   └── useStopSwiper.jsx    # Swiper 터치 제어
├── constants/
│   └── campusConfig.js      # 캠퍼스 설정 (좌표, 이름 등)
├── App.jsx                  # 라우트 & 배경 이미지 관리
└── main.jsx                 # 진입점
```

---

## 🚀 시작하기

### 설치
```bash
npm install
```

### 개발 서버 실행
```bash
npm run dev
```

### 프로덕션 빌드
```bash
npm run build
```

---

## 🔑 핵심 로직

### 1. 시간표 시각화
**파일**: `src/components/TimeTable/TimeTable.jsx`
- **Grid 구조**: 12행 × 7열 (시간 × 요일)
  - 행: 9시, 10시, ..., 7시 (11개 + 헤더 1개)
  - 열: 좌측 레이블, 월~금, 우측 레이블
- **시간 변환**: 교시(1-11) ↔ 시간(9-7) 변환
  ```javascript
  // 1-4교시 = 9-12시, 5-11교시 = 1-7시
  const classNum = hour >= 9 ? (hour - 8) : (hour + 4);
  ```
- **강의 매칭**: dayIndex(0-4)와 classNum 범위로 해당 셀에 강의 표시

### 2. 강의 검색 & 추가
**파일**: `src/components/TimeTable/TimeSearch.jsx`
- 검색 결과 목록 표시
- 추가된 강의는 체크마크 표시
- **시간 충돌 감지**: 같은 시간대에 여러 강의 방지

### 3. 시간대 파싱
**파일**: `src/utils/timeParser.js`
- 데이터 형식: `"목 4 5 6 (1406)"` → 목요일, 4-5-6교시, 1406호
- 정규식으로 요일/교시/교실 분리
- 다중 교시 지원 (예: "4 5 6" → startClass=4, endClass=6)

### 4. 상태 관리
**파일**: `src/store/useSettingStore.js`
- **Zustand** 기반 전역 상태 관리
- **자동 지속성**: 로컬스토리지 또는 Chrome Storage에 자동 저장
- `smartStorageAdapter`: 환경 자동 감지 (개발/익스텐션)

### 5. 날씨 캐싱
**파일**: `src/api/weather.js`
- React Query로 API 응답 캐싱
- `staleTime: 0` → 항상 최신 데이터 요청
- 캠퍼스 변경 시 자동 재조회

---

## 🎨 스타일링

### 색상 시스템
- **강의 카드**: 강의 ID 기반 10가지 색상 팔레트
  ```scss
  $colors: [#6B4C4C, #3D6B63, #3D5F7A, ...]
  ```
- **글래스모피즘**: 반투명 배경 + blur 효과

### 반응형 디자인
- Swiper로 모바일 스크롤 최적화
- 터치 제어 (useStopSwiper 훅)

---

## ⚠️ 주의사항

### 1. Hook 규칙
- Hook은 **component 최상단**에서만 호출
- `renderCourse()` 같은 일반 함수 내에서 호출 불가
- 필요한 값은 **클로저**로 접근

### 2. 리스트 Key
- Index 사용 금지 (배열 순서 변경 시 버그)
- 고유한 `id` 값 사용 필수

### 3. Grid 레이아웃
- Header row도 데이터 row와 **동일한 열 개수** 필요
- 추가/삭제 시 좌우 padding 셀도 함께 조정

### 4. 상태 로딩
- 로딩 중에도 기본값 표시 (예: '서울 동대문구')
- `isLoading` 상태 확인 후 표시 여부 결정

---

## 🔌 API 연동

### 날씨 API
```
GET https://hufs-clock-api.vercel.app/api/weather?campus=SEOUL
```
응답: `{ temp, sky, rainType, tmx, tmn, humidity, campus, ... }`

### 시간표 API
학과/과목 검색 후 강의 목록 반환

### 도서관/식단 API
캠퍼스별 실시간 데이터 제공

---

## 🐛 알려진 이슈 및 해결

| 이슈 | 원인 | 해결 |
|------|------|------|
| 로딩 중 캠퍼스명 오류 | `undefined == 'SEOUL'` → false | `isLoading` 상태 확인 |
| Grid 레이아웃 깨짐 | Header row 열 개수 불일치 | Header에 우측 padding 셀 추가 |
| Hook 호출 오류 | 함수 내부에서 hook 호출 | Hook을 component 최상단으로 이동 |
| 강의 중복 삭제 불가 | c_id 타입 불일치 | `String()` 변환 처리 |

---

## 📱 지원 환경

- **웹브라우저**: Chrome, Firefox, Safari, Edge (최신 버전)
- **크롬 익스텐션**: Chrome Storage API 자동 감지
- **모바일**: 지원 불가

---

## 📝 라이선스

프라이빗 프로젝트

---

## 👨‍💻 개발자

김초록

---

## 🤝 기여 가이드

1. 새 기능은 별도 브랜치에서 개발
2. 커밋 메시지: 한글로 작성 (예: "시간표 그리드 구현")
3. PR 전 `npm run lint` 실행
4. 빌드 확인 후 병합

---

## 📞 문의

이슈 발생 시 GitHub Issues에 보고해주세요.
