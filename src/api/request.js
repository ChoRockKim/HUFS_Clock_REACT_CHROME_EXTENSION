import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import useSettingStore from '../store/useSettingStore';

// 데이터를 가져오는 함수
export const fetchSchoolData = async (campus) => {
    if (campus === 'SEOUL') {
        // console.log('캠퍼스 확인: 서울');
        const API_ENDPOINT = 'https://hufs-clock-api.vercel.app/api/data';
        const res = await axios.get(API_ENDPOINT);
        return res.data;
        
    } else if (campus === 'GLOBAL') {
        // console.log('캠퍼스 확인: 글로벌');
        const API_ENDPOINT = 'https://hufs-clock-api.vercel.app/api/global/data';
        const res = await axios.get(API_ENDPOINT);
        return res.data;
    }
    // 선택된 캠퍼스가 없을 경우 기본값 또는 에러 처리
    // 여기서는 기본적으로 서울 캠퍼스 데이터를 요청하도록 설정합니다.
    // console.log('캠퍼스 정보가 없어 기본값(서울)으로 요청합니다.');
    const API_ENDPOINT = 'https://hufs-clock-api.vercel.app/api/data';
    const res = await axios.get(API_ENDPOINT);
    return res.data;
};

// 리액트 쿼리 반환 커스텀 훅
export default function useData() {
    const { selectedCampus } = useSettingStore();

    return useQuery({
        // selectedCampus가 바뀔 때마다 쿼리를 새로 실행하기 위해 queryKey에 포함
        queryKey: ['schoolData', selectedCampus], 
        // queryFn에 화살표 함수를 사용해 selectedCampus를 fetchSchoolData에 전달
        queryFn: () => fetchSchoolData(selectedCampus),
        staleTime: 1000 * 60 * 30, // 30분간 캐시 유지
        enabled: !!selectedCampus, // selectedCampus 값이 있을 때만 쿼리 실행
    });
}
