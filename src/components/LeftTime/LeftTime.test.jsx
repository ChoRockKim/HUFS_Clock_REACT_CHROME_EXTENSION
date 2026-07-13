import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import useData from '../../api/request'
import LeftTime from './LeftTime'

vi.mock('../../api/request', () => ({
  default: vi.fn(),
}))

// 실행 시점과 무관하게 "학기 중"으로 판정되도록 넉넉한 범위의 학사일정
const cachedSchoolData = {
  schedule: {
    first_start: '01.15',
    first_end: '12.15',
  },
}

describe('LeftTime 오프라인 폴백', () => {
  it('로딩 중이고 캐시가 없으면 로딩 문구를 보여준다', () => {
    useData.mockReturnValue({ data: undefined, isLoading: true, isError: false })
    render(<LeftTime />)
    expect(screen.getByText('불러오는 중....')).toBeInTheDocument()
  })

  it('에러가 나고 캐시도 없으면 네트워크 안내 문구를 보여준다', () => {
    useData.mockReturnValue({ data: undefined, isLoading: false, isError: true })
    render(<LeftTime />)
    expect(screen.getByText('네트워크 연결을 확인해주세요.')).toBeInTheDocument()
  })

  it('에러가 나도 캐시된 데이터가 있으면 에러 문구 대신 카운트다운을 보여준다', () => {
    useData.mockReturnValue({ data: cachedSchoolData, isLoading: false, isError: true })
    const { container } = render(<LeftTime />)
    expect(screen.queryByText('네트워크 연결을 확인해주세요.')).not.toBeInTheDocument()
    expect(container.querySelector('.timer-wrapper')).toBeInTheDocument()
  })
})
