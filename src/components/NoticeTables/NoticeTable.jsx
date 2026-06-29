import './NoticeTable.scss';
import useData from '../../api/request';
import useStopSwiper from '../../hooks/useStopSwiper';
import { useState, useRef, useEffect } from 'react';
import SkeletonUI from '../../pages/SkeletonUI/SkeletonUI';

function NoticeTable() {


    const { data, isError, isLoading } = useData();
    const notices = data?.notices || [];
    const stopSwiperHandlers = useStopSwiper();
    let [isScroll, setIsScroll] = useState(false);

    if (isLoading && !data) return <div><SkeletonUI/></div>;
    if (isError && !data) {
        return (
            <div className="Notice-table-container" {...stopSwiperHandlers}>
                <div className='notice-header'>⦁ 공지사항</div>
                <div>공지사항을 불러오지 못했습니다.</div>
            </div>
        );
    }
    
    if (notices){
        // console.log('서울캠퍼스 공지사항 크롤링 성공!')
    }
    // console.log(data);

    const timestamp = data?.timestamp
        ? new Date(data.timestamp + 'Z').toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })
        : null;

    return (
        <div className="Notice-table-container" {...stopSwiperHandlers}>
            <div className='notice-header'>
                ⦁ 공지사항
                {timestamp && <span className='notice-updated-at'>{timestamp} 기준</span>}
            </div>
            <table className="notice-table">
                <tbody>
                    {notices.map((notice, idx)=>{
                        return (
                            <NoticeList notices={notices} idx={idx} key={idx}/>
                        )
                    })
                    }
                </tbody>
            </table>
        </div>
    )
}

export default NoticeTable


function NoticeList({ notices, idx }){
    const [isScrolling, setIsScrolling] = useState(false);
    const [scrollAmount, setScrollAmount] = useState(0);
    const timerRef = useRef(null);
    const titleRef = useRef(null);
    const tdRef = useRef(null);
    const date = notices[idx].date.slice(5);

    useEffect(() => () => clearTimeout(timerRef.current), []);

    function handleMouseEnter() {
        timerRef.current = setTimeout(() => {
            if (titleRef.current && tdRef.current) {
                const overflow = titleRef.current.scrollWidth - tdRef.current.clientWidth;
                if (overflow > 0) {
                    setScrollAmount(overflow);
                    setIsScrolling(true);
                }
            }
        }, 500);
    }

    function handleMouseLeave() {
        clearTimeout(timerRef.current);
        setIsScrolling(false);
        setScrollAmount(0);
    }

    return (
        <tr
            className={`notice-table-row ${isScrolling ? 'is-scrolling' : ''}`}
            onClick={() => window.open(notices[idx].link)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <td className="notice-table-date">{date}</td>
            <td className="notice-table-title">
                <div className="notice-title-clip" ref={tdRef}>
                    <span
                        ref={titleRef}
                        className={`notice-title-text ${isScrolling ? 'scrolling' : ''}`}
                        style={{
                            '--scroll-amount': `-${scrollAmount}px`,
                            '--scroll-duration': `${(scrollAmount / 120).toFixed(1)}s`
                        }}
                    >
                        {notices[idx].title}
                    </span>
                </div>
            </td>
        </tr>
    );
}
