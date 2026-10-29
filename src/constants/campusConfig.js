
// 사용할 배경 이미지들을 import
import seoulDay from './../assets/background_picture.jpg';
import seoulNight from './../assets/night_background.jpg';
import globalDay from './../assets/글캠 낮사진.jpg';
import globalNight from './../assets/글캠 밤사진예쁜거.jpg';
import seoulSnow from './../assets/seoul_snow.jpg';
import globalSnow from './../assets/global_snow.jpg';

export const CAMPUS_DATA = {
  SEOUL: {
    id: 'SEOUL',
    name: '서울캠퍼스',
    // 파이썬 백엔드에서 만든 경로와 일치시켜야 합니다.
    api: {
      bundle: '/api/data',
      library: '/api/library',
    },
    // 배경변경 버튼을 누를 때마다 이 순서대로 순환한다. 사진을 추가하려면 배열에 넣기만 하면 된다.
    background: [seoulDay, seoulNight, seoulSnow]
  },
  GLOBAL: {
    id: 'GLOBAL',
    name: '글로벌캠퍼스',
    // 일단 임시로 서울캠퍼스거랑 똑같은 api 사용
    api: {
      bundle: '/api/data',
      library: '/api/library',
    },
    background: [globalDay, globalNight, globalSnow]
  }
};

// 캠퍼스의 배경 사진 목록 (캠퍼스가 없거나 유효하지 않으면 빈 배열)
export const getBackgrounds = (campusKey) => CAMPUS_DATA[campusKey]?.background ?? [];

// 저장된 bgIndex를 사용 가능한 범위로 보정한다. 숫자가 아니면 0.
export const resolveBgIndex = (bgIndex, length) => {
  if (!Number.isInteger(bgIndex) || length < 1) return 0;
  return ((bgIndex % length) + length) % length;
};
