import './NoticeTable.scss';
import useData from '../../api/request';
import useStopSwiper from '../../api/hooks/useStopSwiper';
import { useState } from 'react';

function NoticeTable() {

    const { data, isError, isLoading } = useData();
    const notices = data?.notices || [];
    const stopSwiperHandlers = useStopSwiper();
    let [isScroll, setIsScroll] = useState(false);

    if (isLoading) return <div>로딩 중...🐢</div>;
    if (isError) return <div>데이터를 못 가져왔어요ㅜㅜ</div>;
    
    if (notices){
        console.log('공지사항 크롤링 성공!')
    }
    console.log(data);

    return (
        <div className="Notice-table-container" {...stopSwiperHandlers}>
            <div className='notice-header'>HUFS 공지사항</div>
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
    let date = notices[idx].date.slice(5)
    return (
        <>
        <tr className='notice-table-row' onClick={()=>{
            window.open(notices[idx].link)
        }}>
            <td className="notice-table-date">{date}</td>
            <td className="notice-table-title">{notices[idx].title}</td>
        </tr>
        </>
    )
}