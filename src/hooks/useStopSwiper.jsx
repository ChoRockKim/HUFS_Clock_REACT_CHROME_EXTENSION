// src/hooks/useStopSwiper.js
import { useSwiper } from 'swiper/react';

export default function useStopSwiper() {
  const swiper = useSwiper();

  // 마우스가 들어왔을 때 (멈춤)
  const onMouseEnter = () => {
    if (swiper) swiper.mousewheel.disable();
  };

  // 마우스가 나갔을 때 (재개)
  const onMouseLeave = () => {
    if (swiper) swiper.mousewheel.enable();
  };

  // 터치 이벤트 전파 막기 (모바일 스크롤 꼬임 방지용 덤)
  const onTouchStart = (e) => e.stopPropagation();
  const onTouchMove = (e) => e.stopPropagation();

  // 이 4가지를 묶어서 반환
  return { 
    onMouseEnter, 
    onMouseLeave,
    onTouchStart, 
    onTouchMove 
  };
}