import './LibrarySeats.scss'
import useLibraryData from '../../api/library'
import useSettingStore from '../../store/useSettingStore';

export default function LibrarySeats() {
    const { data, isError, isLoading} = useLibraryData();
    const seats = data?.data.list;
    const { selectedCampus } = useSettingStore()

    if (isLoading && !data) return <LibrarySeatsSkeleton />
    if (isError && !data) {
        return (
            <div className='seats-main-container'>
                <div className='seats-header'>
                    <div className='seats-title'>
                        <span>⦁ 실시간 열람실 여석</span>
                    </div>
                </div>
                <div className='seats-list-box'>
                    <div className='seats-error'>열람실 여석을 불러오지 못했습니다.</div>
                </div>
            </div>
        )
    }

    // console.log(seats)

    return (
        <>
        <div className='seats-main-container'>
            <div className='seats-header'>
                <div className='seats-title'>
                    <span>⦁ 실시간 열람실 여석</span> 
                </div>
                <div className='seats-book' onClick={()=>{window.open('https://lib.hufs.ac.kr/service/facility/seat/reading-rooms-for-assignment')}}>
                    <span>열람실 예약</span>
                </div>
            </div>
            <div className='seats-list-box'>
            {seats?.map((data, idx)=>{
                return(
                <SeatLeft data = {data} key={data.id || data.name || idx}
                selectedCampus = {selectedCampus}/>)
            })}
            </div>
        </div>
        </>
    )
}

function LibrarySeatsSkeleton() {
    return (
        <div className='seats-main-container'>
            <div className='seats-header'>
                <div className='seats-title'>
                    <span>⦁ 실시간 열람실 여석</span>
                </div>
                <div className='seats-book seats-book-skeleton'></div>
            </div>
            <div className='seats-list-box'>
                {[1, 2, 3, 4].map((row) => (
                    <div className='seats-left seats-left-skeleton' key={row}>
                        <span className='seat-name-skeleton'></span>
                        <span className='seats-num-skeleton'></span>
                        <span className='progress-skeleton'></span>
                    </div>
                ))}
            </div>
        </div>
    )
}

function SeatLeft({ data, selectedCampus }) {
    
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
                value={seatsAvail}
                min="0"
                max={seatsTotal}/>
        </div>
        </>
    )
}
