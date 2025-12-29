import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import useSettingStore from '../store/useSettingStore';

export const fetchWeatherData = async (campus) => {
    if (campus == 'SEOUL') {
        const API_ENDPOINT = 'https://hufs-clock-api.vercel.app/api/weather?campus=SEOUL'
        const res = await axios.get(API_ENDPOINT);
        return res.data;
    } else if (campus === 'GLOBAL') {
        const API_ENDPOINT = 'https://hufs-clock-api.vercel.app/api/weather?campus=GLOBAL'
        const res = await axios.get(API_ENDPOINT);
        return res.data;
    }

    const API_ENDPOINT = 'https://hufs-clock-api.vercel.app/api/weather?campus=SEOUL'
    const res = await axios.get(API_ENDPOINT);
    return res.data;
}

export default function useWeatherData() {
    const { selectedCampus } = useSettingStore();

    return useQuery({
        queryKey: ['schoolNameForWeather', selectedCampus],
        queryFn: () => fetchWeatherData(selectedCampus),
        staleTime: 0,
        enabled: !!selectedCampus
    });
}