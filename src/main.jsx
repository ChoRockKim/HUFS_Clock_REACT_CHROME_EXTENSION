import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.scss'
import App from './App.jsx'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'

// 1-1. 쿼리 클라이언트 설정
const queryClient = new QueryClient({
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
const persister = createAsyncStoragePersister({
  storage: localStoragePersister, 
})

createRoot(document.getElementById('root')).render(
<PersistQueryClientProvider 
    client={queryClient} 
    persistOptions={{ persister }}
  >
  <StrictMode>
    <HashRouter>
    <App />
    </HashRouter>
  </StrictMode>
</PersistQueryClientProvider>
)
