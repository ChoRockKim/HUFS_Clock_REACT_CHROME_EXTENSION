
// 사용할 배경 이미지들을 import
import seoulDay from './../assets/background_picture.jpg';
import seoulNight from './../assets/night_background.jpg';
import globalDay from './../assets/글캠 낮사진.jpg';
import globalNight from './../assets/글캠 밤사진예쁜거.jpg';

export const CAMPUS_DATA = {
  SEOUL: {
    id: 'SEOUL',
    name: '서울캠퍼스',
    // 파이썬 백엔드에서 만든 경로와 일치시켜야 합니다.
    api: {
      bundle: '/api/data',
      library: '/api/library',
    },
    background: {
      day: seoulDay,
      night: seoulNight
    }
  },
  GLOBAL: {
    id: 'GLOBAL',
    name: '글로벌캠퍼스',
    // 일단 임시로 서울캠퍼스거랑 똑같은 api 사용
    api: {
      bundle: '/api/data',
      library: '/api/library',
    },
    background: {
      day: globalDay,
      night: globalNight
    }
  }
};