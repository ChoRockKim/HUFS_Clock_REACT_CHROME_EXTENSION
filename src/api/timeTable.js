import axios from 'axios';

export const fetchTimeTable = async (params) => {
    // 1. 실제 서버가 기다리는 데이터 형식으로 수정
    const requestData = {
        year: '2025',
        semester: '3',
        campus: 'H1',
        dept_code: 'A1CG1',
        keyword: "",
        gubun: "1",
        professor : '', 
        days: {},            // 빈 객체로 전달
        times: {}            // 빈 객체로 전달
    };

    try {
        // 2. 주소 확인 (Vercel 배포 주소 사용)
        const response = await axios.post('https://hufs-clock-api.vercel.app/api/timetable', requestData);
        
        console.log('시간표 데이터 수신 성공! 🚀', response.data);
        return response.data;

    } catch (error) {
        // 3. 에러 상세 로깅
        if (error.response) {
            // 서버가 응답을 보냈지만 에러인 경우 (404, 500 등)
            console.error('서버 에러:', error.response.status, error.response.data);
        } else {
            // 요청 자체가 실패한 경우 (네트워크 에러 등)
            console.error('요청 에러:', error.message);
        }
    }
}
