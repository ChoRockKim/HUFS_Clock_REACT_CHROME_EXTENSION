import { useState } from 'react'
import './App.scss'
import backgroundImage from "./assets/background_picture.jpg";
import MainPage from './pages/MainPage';
import { Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Mousewheel, Pagination } from 'swiper/modules';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

function App() {

    const API_ENDPOINT = 'https://hufs-clock-api.vercel.app/api/data';


    const { data } = useQuery({
    queryKey: ['testData'], // 👈 이 이름으로 저장됩니다.
    queryFn: () => axios.get(API_ENDPOINT).then(res => res.data),
    staleTime: 1000 * 60 * 5, // 5분간 캐싱
  });

  console.log('Fetched data:', data);



  return (
    // 메인 배경 사진 설정
    <div className="app-container">
      <div className='main-background-image-container'
      style={{backgroundImage : `url(${backgroundImage})`}}>
      </div>

      {/* Swiper.js 설정 */}
        <Swiper
        direction={'vertical'}      // 세로 방향
        slidesPerView={1}           // 한 번에 하나만 보여줌
        spaceBetween={0}            // 간격 없음
        mousewheel={true}           // 마우스 휠로 넘기기 가능
        speed={1000}                // 넘어가는 속도 (1초 동안 천천히)
        modules={[Mousewheel, Pagination]}
        className="mySwiper"
        style={{ height: '100%' }}  // 높이 꽉 채우기
        allowTouchMove={true} // 드래그 넘기기 비활성화
      >



    {/* 메인 페이지 섹션 */}
    <SwiperSlide>
      <section className="main-page-section">
        <MainPage/>
      </section>
    </SwiperSlide>

    {/* 서브 페이지 섹션 */}
    <SwiperSlide>
      <section className='sub-page-section'>
        <div>하이하이하이</div>
      </section>
    </SwiperSlide>
    </Swiper>



    </div>
  )
}

export default App
