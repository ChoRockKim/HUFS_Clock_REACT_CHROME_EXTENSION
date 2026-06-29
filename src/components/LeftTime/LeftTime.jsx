import useData from "../../api/request"; 
import CountDown from "./Countdown"; 
import './LeftTime.scss'

export default function LeftTime() {
    const { data, isError, isLoading } = useData();

    if (isLoading && !data) return <div className="loading-text">불러오는 중....</div>;
    if (isError && !data) return <div className="error-text">네트워크 연결을 확인해주세요.</div>;
    if (!data) return null;

    const schedule = data.schedule;
    const today = new Date();

    // 3. 날짜 파싱 함수
    const getScheduleDate = (dateStr) => {
        if (!dateStr) return null;
        const [month, day] = dateStr.split('.').map(Number);
        return new Date(today.getFullYear(), month - 1, day, 0, 0, 0, 0);
    };

    const firstStart = getScheduleDate(schedule.first_start);
    const firstEnd = getScheduleDate(schedule.first_end);
    const secondStart = getScheduleDate(schedule.second_start);
    const secondEnd = getScheduleDate(schedule.second_end);

    // null 체크: 필수 날짜 데이터가 없으면 에러 처리
    if (!firstStart || !firstEnd) {
        return <div className="error-text">오류가 발했습니다. <br/>관리자에게 문의해주세요.</div>;
    }

    // 2학기 일정이 없으면 1학기만 사용
    const hasSecondSemester = !!secondStart && !!secondEnd;

    // ✨ [추가] 날짜가 같은지 비교하는 헬퍼 함수
    const isSameDate = (date1, date2) => {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    };

    // ✨ [추가] 오늘이 종강일인지 체크 (1학기 or 2학기)
    const isHolidayStart = isSameDate(today, firstEnd) || (hasSecondSemester && isSameDate(today, secondEnd));

    // --------------- 기존 로직 (구간 판별) ---------------
    let curSemester = ''; 
    let targetDate = null; 
    const now = today.getTime();

    // [1학기 중] 
    if (now >= firstStart.getTime() && now < firstEnd.getTime()) {
        curSemester = '1학기 종강';
        targetDate = firstEnd;
    } 
    // [여름방학 중] 
    else if (hasSecondSemester && now >= firstEnd.getTime() && now < secondStart.getTime()) {
        curSemester = '2학기 개강';
        targetDate = secondStart;
    } 
    // [2학기 중] 
    else if (hasSecondSemester && now >= secondStart.getTime() && now < secondEnd.getTime()) {
        curSemester = '2학기 종강'; 
        targetDate = secondEnd;
    } 
    // [겨울방학 중 또는 2학기 없음]
    else {
        curSemester = '새 학기 개강';
        targetDate = new Date(firstStart); // 복사본 생성
        if (targetDate.getTime() < now) {
            targetDate.setFullYear(targetDate.getFullYear() + 1);
        }
    }

    // --------------- 렌더링 ---------------

    // ✨ [수정] 종강 당일이면 축하 메시지를 보여줌 (Early Return)
    if (isHolidayStart) {
        return (
            <div className="timer-wrapper">
                <div className="congratulation">
                    <span>종강을 축하합니다! 🥳</span><br></br>
                    <span>한 학기 동안 고생 많으셨습니다! 🎉</span>
                </div>
            </div>
        );
    }

    // 평소에는 카운트다운 보여줌
    return (
        <div className="timer-wrapper">
            {targetDate && <CountDown targetDate={targetDate} curSemester={curSemester} />}
        </div>
    );
}
