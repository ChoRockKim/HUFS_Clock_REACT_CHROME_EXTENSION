import { QueryClient } from '@tanstack/react-query'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'

// 1-1. 쿼리 클라이언트 설정
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24,
      staleTime: 1000 * 60 * 5,
    },
  },
})

// 1-2. AsyncStorage 래퍼 생성
const localStoragePersister = {
  getItem: (key) => Promise.resolve(window.localStorage.getItem(key)),
  setItem: (key, value) => Promise.resolve(window.localStorage.setItem(key, value)),
  removeItem: (key) => Promise.resolve(window.localStorage.removeItem(key)),
}

// 1-3. 퍼시스터 생성
export const persister = createAsyncStoragePersister({
  storage: localStoragePersister,
})

// 1-4. 캐시 스키마 버전 (queryKey 구조나 응답 형태를 바꿀 때만 수동으로 올림)
export const CACHE_SCHEMA_VERSION = 'v1'

export const persistOptions = {
  persister,
  buster: CACHE_SCHEMA_VERSION,
  maxAge: 1000 * 60 * 60 * 24 * 3, // 3일간 오프라인 캐시 유지
}
