import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import useLibraryData from '../../api/library'
import LibrarySeats from './LibrarySeats'

vi.mock('../../api/library', () => ({
  default: vi.fn(),
}))

const cachedLibraryData = {
  data: {
    list: [
      { id: 1, name: '제1열람실', seats: { available: 12, total: 100 } },
    ],
  },
}

describe('LibrarySeats 오프라인 폴백', () => {
  it('로딩 중이고 캐시가 없으면 스켈레톤을 보여준다', () => {
    useLibraryData.mockReturnValue({ data: undefined, isLoading: true, isError: false })
    const { container } = render(<LibrarySeats />)
    expect(container.querySelector('.seats-left-skeleton')).toBeInTheDocument()
  })

  it('에러가 나고 캐시도 없으면 에러 문구를 보여준다', () => {
    useLibraryData.mockReturnValue({ data: undefined, isLoading: false, isError: true })
    render(<LibrarySeats />)
    expect(screen.getByText('열람실 여석을 불러오지 못했습니다.')).toBeInTheDocument()
  })

  it('에러가 나도 캐시된 데이터가 있으면 실제 좌석 목록을 보여준다', () => {
    useLibraryData.mockReturnValue({ data: cachedLibraryData, isLoading: false, isError: true })
    const { container } = render(<LibrarySeats />)
    expect(screen.queryByText('열람실 여석을 불러오지 못했습니다.')).not.toBeInTheDocument()
    expect(container.querySelector('.seats-left-skeleton')).not.toBeInTheDocument()
    expect(screen.getByText('제1열람실')).toBeInTheDocument()
  })
})
