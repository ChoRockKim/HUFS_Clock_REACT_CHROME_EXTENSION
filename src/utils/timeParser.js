// 시간 데이터 파싱 함수 (단일/복수 자동 구분)
// 입력: "월 5 6 ( )" → 월요일 5교시, 6교시
// 출력: 단일 → 객체, 복수 → 배열
// 교시 → 시간 변환: 교시 n = 9시 + (n-1) = hour n+8

const dayMap = {
  '월': 0,
  '화': 1,
  '수': 2,
  '목': 3,
  '금': 4
};

// 교시를 시간으로 변환 (1교시=9시, 2교시=10시, ..., 5교시=13시)
const classToHour = (classNum) => {
  return classNum + 8;
};

export const parseTimeData = (timeString) => {
  if (!timeString || typeof timeString !== 'string') {
    return null;
  }

  const slots = [];
  // 정규식을 사용하여 "요일"과 "그 외 나머지"로 분리
  const parts = timeString.split(/([월화수목금])/).filter(Boolean);

  for (let i = 0; i < parts.length; i += 2) {
    const day = parts[i];
    let timeInfo = parts[i + 1];

    if (!day || !timeInfo) continue;

    const dayIndex = dayMap[day];
    if (dayIndex === undefined) continue;

    // 다음 요일이 나오기 전까지의 문자열만 선택
    if (i + 2 < parts.length) {
        timeInfo = timeInfo.split(/[월화수목금]/)[0];
    }
    
    const classMatch = timeInfo.match(/[\d\s]+/);
    const roomMatch = timeInfo.match(/\(([^)]*)\)/);
    
    const room = roomMatch ? roomMatch[1].trim() : null;
    const classNumbers = classMatch ? classMatch[0].trim().split(/\s+/).map(Number).filter(n => !isNaN(n) && n > 0) : [];

    if (classNumbers.length > 0) {
      const startClass = classNumbers[0];
      const endClass = classNumbers[classNumbers.length - 1];
      
      slots.push({
        day,
        dayIndex,
        startClass,
        endClass,
        startHour: classToHour(startClass),
        endHour: classToHour(endClass) + 1,
        room: room || null
      });
    }
  }

  if (slots.length === 0) {
    // console.warn(`시간 파싱에 실패했습니다: "${timeString}"`);
    return null;
  }

  return slots.length === 1 ? slots[0] : slots;
};
