import { useEffect, useState } from 'react'
import './App.scss'
import MainPage from './pages/MainPage';
import { Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Mousewheel, Pagination } from 'swiper/modules';
import useSettingStore from './store/useSettingStore';
import IntroSelect from './pages/IntroSelect';
import { CAMPUS_DATA } from './constants/campusConfig';


function App() {

  const {selectedCampus, isDarkMode, changeBg} = useSettingStore()
  
  if (!selectedCampus) {
    return <IntroSelect />;
  }
  const currentConfig = CAMPUS_DATA[selectedCampus];

  
  let bgImage = null;

  if (currentConfig.name == '글로벌캠퍼스'){
    if (isDarkMode) {
      bgImage = 'hufs-global-dark'
    } else {
      bgImage = 'hufs-global-bright'
    }
  } else {
    if (isDarkMode) {
      bgImage = 'hufs-dark-img'
    } else {
      bgImage = 'hufs-bright-img'
    }
  }

  return (
    // 메인 배경 사진 설정
    <div className="app-container">
      <div className={`main-background-image-container ${bgImage}`}>
      </div>

      {/* Swiper.js 설정 */}
        <Swiper
        direction={'vertical'}      // 세로 방향
        slidesPerView={1}           // 한 번에 하나만 보여줌
        spaceBetween={0}            // 간격 없음
        mousewheel={true}           // 마우스 휠로 넘기기 가능
        speed={500}                // 넘어가는 속도 (1초 동안 천천히)
        modules={[Mousewheel, Pagination]}
        className="mySwiper"
        style={{ height: '100%' }}  // 높이 꽉 채우기
        allowTouchMove={false} // 드래그 넘기기 비활성화
      >



    {/* 메인 페이지 섹션 */}
    <SwiperSlide>

      <section className="main-page-section">      
        <button className="bg-change-btn" onClick={()=>{changeBg()}}>다크모드</button>
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
