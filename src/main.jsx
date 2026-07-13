import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.scss'
import App from './App.jsx'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { queryClient, persistOptions } from './queryClient.js'

createRoot(document.getElementById('root')).render(
<PersistQueryClientProvider
    client={queryClient}
    persistOptions={persistOptions}
    onError={() => {
      console.warn('[cache] 오프라인 캐시 복원 실패 — 캐시가 초기화되었습니다.')
    }}
  >
  <StrictMode>
    <HashRouter>
    <App />
    </HashRouter>
  </StrictMode>
</PersistQueryClientProvider>
)
