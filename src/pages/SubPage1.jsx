import './SubPage1.scss'
import LibrarySeats from '../components/Library/LibrarySeats'
import Weather from '../components/Weather/Weather'
import CurrentTime from '../components/CurrentTime/CurrentTime'
import RandomMenu from '../components/RandomMenu/RandomMenu'
import FeedBackBox from '../components/UserFeedBack/FeedBackBox'
import { useState } from 'react'
import TimeSearch from '../components/TimeTable/TimeSearch'

export default function SubPage1() {
    const [introOn, setIntroOn] = useState(false)

    return(
        <>
        <CurrentTime/>
        <div className='widget-main-container'>
            <div className='left-side'>
                <LibrarySeats/>
                <Weather/>
                <RandomMenu/>
            </div>
            <div className='right-side'>
                <TimeSearch/>
            </div>
        </div>
        <button className='dev-intro-btn' onClick={()=> {setIntroOn(!introOn)}}>개발자 소개</button>
        <div className={introOn ? 'visible-feedback' : 'invisible-feedback'}>
        <FeedBackBox/>
        </div>
        </>
    )
}