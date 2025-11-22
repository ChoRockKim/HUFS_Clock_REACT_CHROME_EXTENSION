import { useQuery } from'@tanstack/react-query';
import axios from 'axios';
import useSettingStore from '../store/useSettingStore';
import { CAMPUS_DATA } from '../constants/campusConfig';

// 1. 종합 데이터 (공지+학식+시간) 가져오는 훅
export function useBundleData() {
    const { selectedCampus } = useSettingStore();
    const config = selectedCampus ? CAMPUS_DATA[selectedCampus] : null;


    return useQuery({
        // 키가 같으면 리액트 쿼리는 중복 요청을 안 하고 캐시된 걸 줌
        queryKey: ['bundle', selectedCampus], 
        queryFn: async () => {
        const res = await axios.get(`https://hufs-clock-api.vercel.app${config.api.bundle}`);
        return res.data; // { notice: ..., meal: ..., time: ... }
        },
        staleTime: 1000 * 60 * 5, // 5분간 신선함 유지
    });
}

// 2. 도서관 데이터 가져오는 훅 (따로 돎)
export function useLibraryData() {
    const { selectedCampus } = useSettingStore();
    const config = selectedCampus ? CAMPUS_DATA[selectedCampus] : null;
  
    return useQuery({
        queryKey: ['library', selectedCampus],
        queryFn: async () => {
        const res = await axios.get(`https://hufs-clock-api.vercel.app${config.api.library}`);
        return res.data;
        },
        staleTime: 1000 * 60, // 1분마다 갱신
    });
}