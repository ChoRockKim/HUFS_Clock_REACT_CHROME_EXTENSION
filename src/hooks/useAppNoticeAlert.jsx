import { useEffect } from 'react';
import Swal from 'sweetalert2';
import useAppNotices from '../api/appNotices';
import useSettingStore from '../store/useSettingStore';

export default function useAppNoticeAlert() {
    const { data: notices } = useAppNotices();
    const { lastSeenNoticeId, setLastSeenNoticeId } = useSettingStore();

    useEffect(() => {
        if (!notices || notices.length === 0) return;

        const latest = notices[0];

        if (latest.id > (lastSeenNoticeId ?? 0)) {
            Swal.fire({
                toast: true,
                position: 'top',
                title: `📢 ${latest.message}`,
                showConfirmButton: false,
                timer: 5000,
                timerProgressBar: true,
                customClass: {
                    popup: 'glass-toast',
                    title: 'glass-toast-title',
                },
                showClass: { popup: 'glass-toast-show' },
                hideClass: { popup: 'glass-toast-hide' },
            });
            setLastSeenNoticeId(latest.id);
        }
    }, [notices]);
}
