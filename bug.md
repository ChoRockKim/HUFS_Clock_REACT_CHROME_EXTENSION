# 설정 초기화 버그 조사 기록

> 조사일: 2026-08-13 ~ 2026-08-14
> 대상 버전: 2.1.9 (`acd6689`)
> 관련 파일: `src/store/useSettingStore.js`, `src/hooks/useAppNoticeAlert.jsx`

---

## 1. 증상

`chrome.storage.local`에 저장된 사용자 설정(캠퍼스, 북마크, 이름, 입학년도, 다크모드, 시간표 장바구니)이 예고 없이 기본값으로 초기화된다. 여러 버전에 걸쳐 "고쳤다"고 판단했으나 계속 재발했다.

**실제 재현 조건 (실제 크롬에서 확인됨):**
- 새 탭을 여러 개 동시에 여는 것만으로 초기화된다
- 페이지를 반복 새로고침하는 것만으로 초기화된다
- 스토리지 읽기가 한 번이라도 실패하면 초기화된다

즉 특수한 상황이 아니라 **일상적인 사용 패턴에서 발생**하는 버그였다.

---

## 2. 왜 이전 수정들이 실패했는가

### 2-1. 1차 수정 — `resetCampus` 전체 초기화 (실제 버그였고, 고쳐짐)

| 커밋 | 내용 |
|---|---|
| `804f556` (2025-11-29) | `resetCampus`를 `set(initialState, true)`(전체 덮어쓰기)로 변경 — **버그 유입** |
| `8217602` (2026-07-13) | `set({ selectedCampus: null })`로 되돌림 — **수정 완료** |

`selectedCampus`가 유효하지 않을 때마다 북마크·이름 등 모든 설정이 함께 날아갔다. 이 문제는 실재했고 정상적으로 해결됐다. **그러나 이것이 초기화의 유일한 원인이 아니었다.**

### 2-2. 같은 커밋(`8217602`)이 더 큰 버그를 새로 심었다

"로컬스토리지 안정화"라는 이름으로 `smartStorageAdapter`에 try/catch가 추가됐다:

```js
getItem: async (name) => {
  try {
    ...
  } catch (e) {
    console.error(`[storage] '${name}' 불러오기 실패 — 기본값으로 대체합니다.`, e);
    return null;   // ← 여기가 문제
  }
}
```

zustand에게 `null`은 **"에러"가 아니라 "저장된 값이 없음"** 을 뜻한다. 따라서 읽기 실패가 "신규 사용자"로 둔갑한다:

1. `chrome.storage.local.get()` 실패 → `null` 반환
2. zustand는 정상 경로로 진행 → `merge(undefined, 기본값)` = 기본값
3. 이후 아무 setter나 한 번 호출되면 → **기본값 전체가 디스크에 기록되어 실제 데이터가 영구 삭제**

안정화를 의도한 코드가 오히려 데이터 파괴 경로를 만들었다.

### 2-3. 2차 수정 — 하이드레이션 가드 (버그를 못 고쳤고, 오히려 악화시킴)

복원 완료 전 쓰기를 막으려고 `hasHydrated` 플래그를 도입하고, `onRehydrateStorage`에서 켜도록 했다:

```js
onRehydrateStorage: () => (state, error) => {
  if (error) { console.error(...); }
  useSettingStore.setState({ hasHydrated: true });   // ← 치명적
},
```

**왜 악화되었는가** (zustand 5.0.8 소스 기준):

`node_modules/zustand/esm/middleware.mjs:361-364` — `setState`는 호출 즉시 스토리지에 전체 상태를 쓴다:
```js
const savedSetState = api.setState;
api.setState = (state, replace) => {
  savedSetState(state, replace);
  return setItem();          // 무조건 디스크 기록
};
```

같은 파일 `423행` — `onRehydrateStorage` 콜백은 **실패 경로에서도** 호출된다:
```js
.catch((e) => {
  postRehydrationCallback?.(void 0, e);
});
```

실패 경로에서는 실제 데이터를 메모리에 올리는 `set(stateFromStorage, true)`가 실행되지 않으므로 **메모리 = 기본값**이다. 그 상태에서 `setState`가 기본값 전체를 디스크에 기록한다.

> 결과: 수정 전에는 사용자가 클릭이라도 해야 데이터가 날아갔지만, 수정 후에는 **읽기가 실패하는 즉시 자동으로** 날아가게 되었다.

---

## 3. 근본 원인 정리

| # | 원인 | 위치 |
|---|---|---|
| 1 | 읽기 실패를 `null`로 위장 → zustand가 "데이터 없음"으로 오해 | `useSettingStore.js` `getItem` catch |
| 2 | 저장된 JSON 손상 시 동일 결과 (`JSON.parse`에 try/catch 없음) | `zustand/esm/middleware.mjs:289` |
| 3 | 쓰기 가드가 호출 지점마다 흩어짐 (setter 호출 파일 9개) → 두더지잡기 | 앱 전반 |
| 4 | 탭 간 동기화 부재 → 오래된 메모리가 최신 설정을 덮어씀 | `chrome.storage.onChanged` 리스너 없음 |

원인 4가 중요한 이유: 이 확장은 `chrome_url_overrides.newtab` 기반이라 사용자가 탭을 여러 개 여는 것이 정상적인 사용 패턴이다. 백그라운드 서비스 워커도 없어 탭들이 서로를 전혀 모른다.

---

## 4. 수정 내용

가드를 훅마다 붙이는 대신 **모든 쓰기가 반드시 통과하는 길목(스토리지 어댑터)** 한 곳에 배치했다.

### `src/store/useSettingStore.js`

1. **`getItem`이 실패를 그대로 전파** — `return null` 대신 `throw e`. `result[name] || null` → `?? null`로 변경.
2. **`setItem`이 복원 성공 전에는 쓰기를 거부** — `canPersist` 가드. 이 한 곳으로 9개 파일의 모든 setter가 동시에 안전해진다.
3. **`canPersist`는 `persist.onFinishHydration`으로만 켠다** — 소스 `418-421행` 확인 결과 이 리스너는 성공 `.then()` 안에서만 실행되고 `.catch()`에서는 실행되지 않는다. 따라서 읽기 실패와 JSON 손상 **둘 다** 자동으로 디스크가 보호된다.
4. **문제의 `setState` 줄 제거** — `onRehydrateStorage`는 로깅만 담당.
5. **`partialize`로 `hasHydrated` 저장 제외** — 순수 메모리 플래그.
6. **`chrome.storage.onChanged` 탭 간 동기화 추가** — 자기가 쓴 값은 `lastWrittenValue` 비교로 무시해 불필요한 재복원을 막고, `hasHydrated` 재기록을 막아 무한 루프를 차단.

### `src/hooks/useAppNoticeAlert.jsx`
`hasHydrated` 게이트 유지. 다만 이제 이 플래그는 **성공한 복원에서만** 켜진다.

### 부수 정리
- `eslint.config.js` — 크롬 확장인데 `chrome` 전역이 등록돼 있지 않아 기존 오류 6건 발생 중이었다. `chrome: 'readonly'` 추가.
- `vite.config.js` — Playwright 스펙이 vitest에 잡히지 않도록 `e2e` 제외.

---

## 5. 검증 결과

### 통합 테스트 — `src/store/useSettingStore.test.js`
jsdom에는 `chrome`이 없어 아무 조치 없이 테스트하면 `localStorage` 분기만 타므로, `vi.stubGlobal`로 가짜 `chrome.storage.local`(인메모리 디스크 + 지연/실패/손상 시뮬레이션)을 주입한다. 스토어가 import 시점에 복원되는 싱글턴이라 `vi.resetModules()` + 동적 import로 테스트마다 새 인스턴스(=새 탭)를 만든다.

| 시나리오 | 수정 전 | 수정 후 |
|---|:---:|:---:|
| 읽기 실패 시 디스크 보존 | ❌ | ✅ |
| JSON 손상 시 디스크 보존 | ❌ | ✅ |
| 복원 전 setter 호출해도 설정 생존 | ❌ | ✅ |
| 읽기 실패 시 `hasHydrated` false 유지 | ❌ | ✅ |
| 정상 복원 + 이후 저장 | ✅ | ✅ |
| 다중 탭에서 다른 탭 변경 미덮어씀 | ❌ | ✅ |

### E2E — `e2e/settings-persistence.spec.js` (실제 크롬 + 실제 확장 로드)
`chromium.launchPersistentContext`에 `--load-extension=dist`로 빌드 결과물을 그대로 로드한다. 이 확장은 백그라운드 서비스 워커가 없어 `context.serviceWorkers()`로 ID를 얻을 수 없으므로, `chrome://extensions-internals` JSON 파싱 → 실패 시 경로 SHA-256 해시 계산으로 확장 ID를 구한다.

| 시나리오 | 수정 전 | 수정 후 |
|---|:---:|:---:|
| 캠퍼스 선택이 저장됨 | ✅ | ✅ |
| 탭 6개 동시에 열어도 유지 | ❌ | ✅ |
| 새로고침 10회 반복해도 유지 | ❌ | ✅ |
| 읽기 실패 탭이 열려도 데이터 생존 | ❌ | ✅ |

**수정 전 코드(배포 중이던 2.1.9)에서 E2E 4개 중 3개가 실패**했다. 이것이 버그가 실재했다는 결정적 증거다.

### 종합
- 통합/훅 테스트: 21개 통과 (기존 13 + 신규 8)
- E2E: 4개 통과
- Lint: 32 problems → 26 problems (신규 오류 0, 기존 `chrome` 오류 6건 해소)

---

## 6. 남은 한계 (의도적으로 남긴 것)

1. **읽기 실패 세션은 저장이 막힌다.** 기본값 화면으로 뜨고 그 세션의 변경사항은 저장되지 않는다. 불편하지만 **데이터를 파괴하는 것보다 낫다**는 판단이다. 새 탭을 다시 열면 정상 복구된다.
2. **탭 간 동기화에 수 밀리초의 창이 남아있다.** 탭 B에서 설정을 바꾼 직후 수 ms 안에 탭 A를 조작하면 탭 A의 이전 상태가 기록될 수 있다. 완전 제거에는 락이나 백그라운드 코디네이터가 필요해 이번 범위에서 제외했다. 테스트도 이 한계를 숨기지 않고 "동기화가 도달한 뒤"를 검증하도록 작성했다.

---

## 7. 재발 방지 원칙

- **스토리지 읽기 실패를 "값 없음"으로 변환하지 말 것.** 이번 버그의 핵심이다. 실패는 실패로 전파해야 한다.
- **zustand `persist`는 모든 `set()`/`setState()`에서 상태 전체를 디스크에 쓴다.** 복원 전에 호출되는 setter는 곧 데이터 삭제다.
- **가드는 호출 지점이 아니라 길목에 둘 것.** 훅마다 조건을 붙이면 새 코드가 추가될 때마다 다시 뚫린다.
- **"고쳤다"는 재현 테스트로만 증명할 것.** 이번 조사에서 이전 수정 2건이 모두 근거 없이 "고쳤다"고 판단됐고, 그중 하나는 오히려 악화였다. 수정 전 실패(RED) → 수정 후 통과(GREEN)를 반드시 확인한다.
