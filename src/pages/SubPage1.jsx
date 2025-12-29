import './Subpage1.scss'
import LibrarySeats from '../components/Library/LibrarySeats'
import Weather from '../components/Weather/Weather'
import CurrentTime from '../components/CurrentTime/CurrentTime'

export default function SubPage1() {
    return(
        <>
        <CurrentTime/>
        <div className='widget-main-container'>
            <div className='left-side'>
                <LibrarySeats/>
                <Weather/>
            </div>
            <div className='right-side'>

            </div>
        </div>
        </>
    )
}