import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import useSettingStore from '../store/useSettingStore';

export const fetchLibraryData = async (campus) => {
    if (campus == 'SEOUL') {
        const API_ENDPOINT = 'https://hufs-clock-api.vercel.app/api/library?campus=SEOUL'
        const res = await axios.get(API_ENDPOINT);
        return res.data;
    } else if (campus === 'GLOBAL') {
        const API_ENDPOINT = 'https://hufs-clock-api.vercel.app/api/library?campus=GLOBAL'
        const res = await axios.get(API_ENDPOINT);
        return res.data;
    }

    // 만약 캠퍼스 정보가 없을 때, 기본값 서울
    const API_ENDPOINT = 'https://lib.hufs.ac.kr/pyxis-api/1/seat-rooms?smufMethodCode=PC&roomTypeId=2&branchGroupId=1'
    const res = await axios.get(API_ENDPOINT);
    return res.data;
}

export default function useLibraryData() {
    const { selectedCampus } = useSettingStore();

    return useQuery({
        queryKey: ['schoolNameForLibrary', selectedCampus],
        queryFn: () => fetchLibraryData(selectedCampus),
        staleTime: 0,
        enabled: !!selectedCampus
    });
}
