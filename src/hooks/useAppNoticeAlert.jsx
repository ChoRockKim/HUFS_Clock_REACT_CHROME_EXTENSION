import { useEffect } from 'react';
import Swal from 'sweetalert2';
import useAppNotices from '../api/appNotices';
import useSettingStore from '../store/useSettingStore';

function fireNoticeToast(message) {
    Swal.fire({
        toast: true,
        position: 'top',
        title: `📢 ${message}`,
        showConfirmButton: false,
        showCloseButton: true,
        timer: 60000,
        timerProgressBar: true,
        customClass: {
            popup: 'glass-toast',
            title: 'glass-toast-title',
        },
        showClass: { popup: 'glass-toast-show' },
        hideClass: { popup: 'glass-toast-hide' },
    });
}

export default function useAppNoticeAlert() {
    const { data: notices } = useAppNotices();
    const { lastSeenNoticeId, setLastSeenNoticeId, hasHydrated } = useSettingStore();

    useEffect(() => {
        if (!hasHydrated) return;
        if (!notices || notices.length === 0) return;

        const latest = notices[0];

        if (latest.id > (lastSeenNoticeId ?? 0)) {
            fireNoticeToast(latest.message);
            setLastSeenNoticeId(latest.id);
        }
    }, [notices, hasHydrated]);
}

// 버튼 클릭으로 최신 공지를 다시 띄우기 위한 훅 (읽음 여부와 무관하게 항상 표시)
export function useShowLatestNotice() {
    const { data: notices } = useAppNotices();

    return () => {
        if (!notices || notices.length === 0) {
            fireNoticeToast('등록된 공지사항이 없습니다.');
            return;
        }
        fireNoticeToast(notices[0].message);
    };
}
