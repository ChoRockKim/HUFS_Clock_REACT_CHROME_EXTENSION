import './TimeTable.scss'
import { parseTimeData } from '../../utils/timeParser'
import useSettingStore from '../../store/useSettingStore'

export default function TimeTable() {
    const { inCartCourse } = useSettingStore();
    
    const hours = [9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7];
    const days = ['월', '화', '수', '목', '금'];
    
    // 강의 색상 생성 (강의 ID 기반으로 일관된 색상) - 어두운 색 (흰 글씨 잘 보임)
    const getColorByHash = (c_id) => {
        const colors = [
            '#6B4C4C', '#3D6B63', '#3D5F7A', '#7A5C3D', '#4C6B5C',
            '#7A7A3D', '#634C7A', '#3D7A99', '#7A6B4C', '#5C7A4C'
        ];
        let hash = 0;
        for (let i = 0; i < c_id.length; i++) {
            hash = ((hash << 5) - hash) + c_id.charCodeAt(i);
            hash = hash & hash;
        }
        return colors[Math.abs(hash) % colors.length];
    };
    
    // 특정 시간/요일에 해당하는 강의 찾기
    const getCourseAtTimeSlot = (hour, dayIndex) => {
        return inCartCourse.find(course => {
            const parsed = parseTimeData(course.time);
            if (!parsed) return false;
            
            const slots = Array.isArray(parsed) ? parsed : [parsed];
            return slots.some(slot => 
                slot.dayIndex === dayIndex && 
                hour >= slot.startHour && 
                hour < slot.endHour
            );
        });
    };

    return (
        <>
            <div className='timetable-grid-container'>
                <div className='cell-head-left'></div>
                <div className='cell-head'>월</div>
                <div className='cell-head'>화</div>
                <div className='cell-head'>수</div>
                <div className='cell-head'>목</div>
                <div className='cell-head'>금</div>
                <div className='cell-body-left'>9</div>
                <div className='cell-body'>{getCourse(9, 0) && renderCourse(getCourse(9, 0))}</div>
                <div className='cell-body'>{getCourse(9, 1) && renderCourse(getCourse(9, 1))}</div>
                <div className='cell-body'>{getCourse(9, 2) && renderCourse(getCourse(9, 2))}</div>
                <div className='cell-body'>{getCourse(9, 3) && renderCourse(getCourse(9, 3))}</div>
                <div className='cell-body-right'>{getCourse(9, 4) && renderCourse(getCourse(9, 4))}</div>
                <div className='cell-body-left'>10</div>
                <div className='cell-body'>{getCourse(10, 0) && renderCourse(getCourse(10, 0))}</div>
                <div className='cell-body'>{getCourse(10, 1) && renderCourse(getCourse(10, 1))}</div>
                <div className='cell-body'>{getCourse(10, 2) && renderCourse(getCourse(10, 2))}</div>
                <div className='cell-body'>{getCourse(10, 3) && renderCourse(getCourse(10, 3))}</div>
                <div className='cell-body-right'>{getCourse(10, 4) && renderCourse(getCourse(10, 4))}</div>
                <div className='cell-body-left'>11</div>
                <div className='cell-body'>{getCourse(11, 0) && renderCourse(getCourse(11, 0))}</div>
                <div className='cell-body'>{getCourse(11, 1) && renderCourse(getCourse(11, 1))}</div>
                <div className='cell-body'>{getCourse(11, 2) && renderCourse(getCourse(11, 2))}</div>
                <div className='cell-body'>{getCourse(11, 3) && renderCourse(getCourse(11, 3))}</div>
                <div className='cell-body-right'>{getCourse(11, 4) && renderCourse(getCourse(11, 4))}</div>
                <div className='cell-body-left'>12</div>
                <div className='cell-body'>{getCourse(12, 0) && renderCourse(getCourse(12, 0))}</div>
                <div className='cell-body'>{getCourse(12, 1) && renderCourse(getCourse(12, 1))}</div>
                <div className='cell-body'>{getCourse(12, 2) && renderCourse(getCourse(12, 2))}</div>
                <div className='cell-body'>{getCourse(12, 3) && renderCourse(getCourse(12, 3))}</div>
                <div className='cell-body-right'>{getCourse(12, 4) && renderCourse(getCourse(12, 4))}</div>
                <div className='cell-body-left'>1</div>
                <div className='cell-body'>{getCourse(1, 0) && renderCourse(getCourse(1, 0))}</div>
                <div className='cell-body'>{getCourse(1, 1) && renderCourse(getCourse(1, 1))}</div>
                <div className='cell-body'>{getCourse(1, 2) && renderCourse(getCourse(1, 2))}</div>
                <div className='cell-body'>{getCourse(1, 3) && renderCourse(getCourse(1, 3))}</div>
                <div className='cell-body-right'>{getCourse(1, 4) && renderCourse(getCourse(1, 4))}</div>
                <div className='cell-body-left'>2</div>
                <div className='cell-body'>{getCourse(2, 0) && renderCourse(getCourse(2, 0))}</div>
                <div className='cell-body'>{getCourse(2, 1) && renderCourse(getCourse(2, 1))}</div>
                <div className='cell-body'>{getCourse(2, 2) && renderCourse(getCourse(2, 2))}</div>
                <div className='cell-body'>{getCourse(2, 3) && renderCourse(getCourse(2, 3))}</div>
                <div className='cell-body-right'>{getCourse(2, 4) && renderCourse(getCourse(2, 4))}</div>
                <div className='cell-body-left'>3</div>
                <div className='cell-body'>{getCourse(3, 0) && renderCourse(getCourse(3, 0))}</div>
                <div className='cell-body'>{getCourse(3, 1) && renderCourse(getCourse(3, 1))}</div>
                <div className='cell-body'>{getCourse(3, 2) && renderCourse(getCourse(3, 2))}</div>
                <div className='cell-body'>{getCourse(3, 3) && renderCourse(getCourse(3, 3))}</div>
                <div className='cell-body-right'>{getCourse(3, 4) && renderCourse(getCourse(3, 4))}</div>
                <div className='cell-body-left'>4</div>
                <div className='cell-body'>{getCourse(4, 0) && renderCourse(getCourse(4, 0))}</div>
                <div className='cell-body'>{getCourse(4, 1) && renderCourse(getCourse(4, 1))}</div>
                <div className='cell-body'>{getCourse(4, 2) && renderCourse(getCourse(4, 2))}</div>
                <div className='cell-body'>{getCourse(4, 3) && renderCourse(getCourse(4, 3))}</div>
                <div className='cell-body-right'>{getCourse(4, 4) && renderCourse(getCourse(4, 4))}</div>
                <div className='cell-body-left'>5</div>
                <div className='cell-body'>{getCourse(5, 0) && renderCourse(getCourse(5, 0))}</div>
                <div className='cell-body'>{getCourse(5, 1) && renderCourse(getCourse(5, 1))}</div>
                <div className='cell-body'>{getCourse(5, 2) && renderCourse(getCourse(5, 2))}</div>
                <div className='cell-body'>{getCourse(5, 3) && renderCourse(getCourse(5, 3))}</div>
                <div className='cell-body-right'>{getCourse(5, 4) && renderCourse(getCourse(5, 4))}</div>
                <div className='cell-body-left'>6</div>
                <div className='cell-body'>{getCourse(6, 0) && renderCourse(getCourse(6, 0))}</div>
                <div className='cell-body'>{getCourse(6, 1) && renderCourse(getCourse(6, 1))}</div>
                <div className='cell-body'>{getCourse(6, 2) && renderCourse(getCourse(6, 2))}</div>
                <div className='cell-body'>{getCourse(6, 3) && renderCourse(getCourse(6, 3))}</div>
                <div className='cell-body-right'>{getCourse(6, 4) && renderCourse(getCourse(6, 4))}</div>
                <div className='cell-body-left'>7</div>
                <div className='cell-body'>{getCourse(7, 0) && renderCourse(getCourse(7, 0))}</div>
                <div className='cell-body'>{getCourse(7, 1) && renderCourse(getCourse(7, 1))}</div>
                <div className='cell-body'>{getCourse(7, 2) && renderCourse(getCourse(7, 2))}</div>
                <div className='cell-body'>{getCourse(7, 3) && renderCourse(getCourse(7, 3))}</div>
                <div className='cell-body-right'>{getCourse(7, 4) && renderCourse(getCourse(7, 4))}</div>

            </div>
        </>
    )

    function getCourse(hour, dayIndex) {
        // hour를 교시 번호로 변환
        // 9-12 → 1-4교시 (오전), 1-7 → 5-11교시 (오후)
        const classNum = hour >= 9 ? hour - 8 : hour + 12 - 8;
        
        return inCartCourse.find(course => {
            const parsed = parseTimeData(course.time);
            if (!parsed) return false;
            
            const slots = Array.isArray(parsed) ? parsed : [parsed];
            return slots.some(slot => 
                slot.dayIndex === dayIndex && 
                classNum >= slot.startClass && 
                classNum <= slot.endClass
            );
        });
    }

    function renderCourse(course) {
        const bgColor = getColorByHash(course.c_id);
        return (
            <div 
                className='course-card'
                style={{ backgroundColor: bgColor }}
            >
                <span className='course-name'>
                    {course.c_name}
                </span>
            </div>
        );
    }
}

