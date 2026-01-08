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

  // 모든 시간대 찾음
  const slots = [];
  // "목 4 5 6 (1406)" 또는 "목 5 6 ( )" 형식 처리
  const regex = /(\S+)\s+([\d\s]+)\s*\(([^)]*)\)/g;
  let match;

  while ((match = regex.exec(timeString)) !== null) {
    const day = match[1];
    const dayIndex = dayMap[day];
    const room = match[3]?.trim() || null;

    if (dayIndex !== undefined) {
      // "4 5 6"에서 모든 숫자 추출
      const classNumbers = match[2].trim().split(/\s+/).map(Number);
      
      if (classNumbers.length > 0) {
        const startClass = classNumbers[0];
        const endClass = classNumbers[classNumbers.length - 1];
        
        slots.push({
          day,
          dayIndex,
          startClass,
          endClass,
          startHour: classToHour(startClass),
          endHour: classToHour(endClass) + 1, // endClass까지 포함되므로 +1
          room: room ? room : null
        });
      }
    }
  }

  if (slots.length === 0) {
    console.warn(`시간 파싱 실패: ${timeString}`);
    return null;
  }

  // 단일: 객체 반환, 복수: 배열 반환
  return slots.length === 1 ? slots[0] : slots;
};
