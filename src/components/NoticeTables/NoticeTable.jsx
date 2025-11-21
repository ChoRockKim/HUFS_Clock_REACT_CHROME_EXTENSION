import './NoticeTable.scss';
import useData from '../../api/request';

function NoticeTable() {

    const { data, isError, isLoading } = useData();
    
    if (isLoading) return <div>로딩 중...🐢</div>;
    if (isError) return <div>데이터를 못 가져왔어요ㅜㅜ</div>;
    
    data.notices.map((data, idx)=>{console.log(idx)})



    return (
        <div className="Notice-table-container">
            <table className="notice-table">
                <tbody>
                    
                </tbody>
            </table>
        </div>
    )
}

export default NoticeTable

// function NoticeList