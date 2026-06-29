import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function useAppNotices() {
    return useQuery({
        queryKey: ['appNotices'],
        queryFn: async () => {
            const res = await axios.get('https://hufs-clock-api.vercel.app/api/app-notices');
            return res.data;
        },
        staleTime: 0,
    });
}
