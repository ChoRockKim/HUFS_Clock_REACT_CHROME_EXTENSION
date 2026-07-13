import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import useData from '../../api/request'
import MealTable from './MealTable'

vi.mock('../../api/request', () => ({
  default: vi.fn(),
}))

// 실행 요일과 무관하게 "오늘의 메뉴" 텍스트를 확정할 수 있도록 7일치 메뉴를 채워둠
const todayDay = new Date().getDay()
const todayMenuName = '테스트 메뉴'
const menus = Array.from({ length: 7 }, (_, i) => ({ name: `메뉴${i}`, price: '5000원' }))
if (todayDay - 1 >= 0) menus[todayDay - 1] = { name: todayMenuName, price: '5000원' }

const cachedMealData = {
  meals: [{ time: '중식', menus }],
}

describe('MealTable 오프라인 폴백', () => {
  it('로딩 중이고 캐시가 없으면 아무것도 렌더링하지 않는다', () => {
    useData.mockReturnValue({ data: undefined, isLoading: true, isError: false })
    const { container } = render(<MealTable />)
    expect(container.firstChild).toBeNull()
  })

  it('에러가 나고 캐시도 없으면 아무것도 렌더링하지 않는다', () => {
    useData.mockReturnValue({ data: undefined, isLoading: false, isError: true })
    const { container } = render(<MealTable />)
    expect(container.firstChild).toBeNull()
  })

  it('에러가 나도 캐시된 데이터가 있으면 학식 정보를 그대로 보여준다', () => {
    useData.mockReturnValue({ data: cachedMealData, isLoading: false, isError: true })
    const { container } = render(<MealTable />)
    expect(container.querySelector('.mealtable-container')).toBeInTheDocument()
    if (todayDay === 0) {
      expect(screen.getByText('운영 정보 없음')).toBeInTheDocument()
    } else {
      expect(screen.getByText(todayMenuName)).toBeInTheDocument()
    }
  })
})
