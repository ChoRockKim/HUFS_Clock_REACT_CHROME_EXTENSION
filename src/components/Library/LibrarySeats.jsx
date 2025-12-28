import './LibrarySeats.scss'
import useLibraryData from '../../api/library'
import useSettingStore from '../../store/useSettingStore';

export default function LibrarySeats() {
    const { data, isError, isLoading} = useLibraryData();
    const seats = data?.data.list;
    const { selectedCampus } = useSettingStore()

    if (isLoading) return <div>로딩 중...</div>
    if (isError) return <div>에러 남...</div>

    if (seats) {
        console.log('도서관 여석 불러오기 성공')
        console.log(seats)
    }

    return (
        <>
        <div className='seats-main-container'>
            <div className='seats-title'>
                <span>⦁ 실시간 열람실 여석</span>
            </div>
            <div className='seats-list-box'>
            {seats?.map((data, idx)=>{
                return(
                <SeatLeft data = {data} key={idx}
                selectedCampus = {selectedCampus}/>)
            })}
            </div>
        </div>
        </>
    )
}

function SeatLeft({ data, idx, selectedCampus }) {
    
    const seatsAvail = data.seats.available;
    const seatsTotal = data.seats.total;
    let seatsName;

    if (selectedCampus == 'GLOBAL') {
        seatsName = data.name.split(' ')[1]
    }
    else {
        seatsName = data.name;
    }


    return(
        <>
        <div className='seats-left'>
            <span className='seat-name'>{seatsName}</span>
            <span className='seats-num'>
                <span className='seats-left-num'>
                    {seatsAvail} 
                </span> 
                /{seatsTotal}
            </span>
            <progress
                className="progress"
                id="progress"
                value={seatsAvail}
                min="0"
                max={data.seats.total}/>
        </div>
        </>
    )
}