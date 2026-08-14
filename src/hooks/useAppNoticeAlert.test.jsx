import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import useAppNotices from '../api/appNotices'
import useSettingStore from '../store/useSettingStore'
import useAppNoticeAlert from './useAppNoticeAlert'

vi.mock('../api/appNotices', () => ({
  default: vi.fn(),
}))

// 토스트는 이 테스트의 관심사가 아니므로 막아둔다
vi.mock('sweetalert2', () => ({
  default: { fire: vi.fn() },
}))

const notices = [{ id: 7, message: '새 공지입니다' }]

beforeEach(() => {
  // 각 테스트가 깨끗한 상태에서 시작하도록 되돌린다
  useSettingStore.setState({ lastSeenNoticeId: null, hasHydrated: false })
})

describe('useAppNoticeAlert 복원 가드', () => {
  it('복원이 끝나기 전에는 공지 읽음 기록을 저장하지 않는다', async () => {
    useAppNotices.mockReturnValue({ data: notices })

    renderHook(() => useAppNoticeAlert())

    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(useSettingStore.getState().lastSeenNoticeId).toBeNull()
  })

  it('복원이 끝난 뒤에는 공지 읽음 기록을 저장한다', async () => {
    useAppNotices.mockReturnValue({ data: notices })

    const { rerender } = renderHook(() => useAppNoticeAlert())

    // 복원 완료를 흉내낸다
    useSettingStore.setState({ hasHydrated: true })
    rerender()

    await waitFor(() => {
      expect(useSettingStore.getState().lastSeenNoticeId).toBe(7)
    })
  })
})
