import { useQuery } from '@tanstack/react-query';
import axios from 'axios';


// 데이터를 가져오는 함수
export const fetchSchoolData = async () => {
    const API_ENDPOINT = 'https://hufs-clock-api.vercel.app/api/data';
    const res = await axios.get(API_ENDPOINT);
    return res.data;
};

// 리액트 쿼리 반환 커스텀 훅
export default function useData() {

    return useQuery({
        queryKey: ['schoolData'], // 
        queryFn: fetchSchoolData,
        staleTime: 1000 * 60 * 5, // 5분간 캐싱
        // staleTime: 0,
    });
}
