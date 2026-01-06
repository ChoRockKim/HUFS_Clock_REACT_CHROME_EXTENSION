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
import SubPage1 from './pages/SubPage1';

function App() {

  const {selectedCampus, isDarkMode, changeBg, resetCampus} = useSettingStore()

  // 로컬 스토리지에 저장된 레거시 데이터(객체)일 경우를 대비하여 campusKey를 안전하게 추출합니다.
  const campusKey = typeof selectedCampus === 'string' ? selectedCampus : (selectedCampus?.id || null);
  const currentConfig = campusKey ? CAMPUS_DATA[campusKey] : null;

  useEffect(() => {
    // 스토리지에서 불러온 캠퍼스 정보가 유효하지 않을 경우, 선택 화면으로 리셋합니다.
    if (selectedCampus && !currentConfig) {
      console.warn('저장된 캠퍼스 정보가 유효하지 않아 초기화합니다.');
      resetCampus();
    }
  }, [selectedCampus, currentConfig, resetCampus]);
  
  if (!currentConfig) {
    // 유효한 캠퍼스 정보가 없을 경우, 초기 선택 화면을 보여줍니다.
    return <IntroSelect />;
  }

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
        observer={true} 
        observeParents={true}
        watchSlidesProgress={true} // 슬라이드 진행 상태 감시
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
        <SubPage1/>
      </section>
    </SwiperSlide>
    </Swiper>

    </div>
  )
}

export default App
