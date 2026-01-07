import axios from "axios";

export default async function getLssnList(params) {
    try {
        const response = await axios.post('https://hufs-clock-api.vercel.app/api/timetable', params);
        console.log(response.data)
        return response.data
    } catch(error) {
        console.error('검색 실패 ㅜㅜ', error)
        alert('데이터 불러오기 실패ㅜㅜ')
    }
}