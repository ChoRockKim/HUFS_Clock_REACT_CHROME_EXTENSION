import { useState, useEffect } from "react";
import './Countdown.scss'

function CountDown({ targetDate, curSemester }) {
  // 1. 남은 시간을 담을 State (초기값: 계산 함수 실행)
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    // 2. 1초마다 실행될 타이머 설정
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    // 3. 컴포넌트 사라질 때 타이머 청소 (메모리 누수 방지)
    return () => clearInterval(timer);
  }, [targetDate]);

  // 4. 예쁘게 00:00:00 형식으로 보여주기
  return (
    <div className="countdown-box">
      <h2>{curSemester}까지... {`(${targetDate.getMonth()+1}.${targetDate.getDate()})`}</h2>
    
    <div className="time-container">
      <span className="days">{timeLeft.days}
        <span className="time-emphasize">일</span></span>
      <span className="time">
        {String(timeLeft.hours).padStart(2, "0")}<span className="time-emphasize">시 </span>
        {String(timeLeft.minutes).padStart(2, "0")}<span className="time-emphasize">분</span>
        {String(timeLeft.seconds).padStart(2, "0")}<span className="time-emphasize">초</span>
      </span>
    </div>
    </div>
  );
}

// 시간 계산 헬퍼 함수
function calculateTimeLeft(targetDate) {
  const now = new Date().getTime();
  const target = targetDate.getTime();
  const difference = target - now;

  // 시간이 이미 지났으면 0으로 표시
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export default CountDown;