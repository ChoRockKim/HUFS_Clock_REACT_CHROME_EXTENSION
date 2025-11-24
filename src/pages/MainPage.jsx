import Noticetable from '../components/NoticeTables/NoticeTable';
import CurrentTime from '../components/CurrentTime/CurrentTime';
import LeftTime from '../components/LeftTime/LeftTime';
import MealTable from '../components/MealTable/MealTable';
import './MainPage.scss'
import { useState } from 'react';

function MainPage() {
    let [mealOn, setMealOn] = useState(false)

    return (
    <>
        <Noticetable/>
        <CurrentTime/>
        <LeftTime/>
        <button onClick={()=>{
            setMealOn(!mealOn)
        }}
        className="show-meal-btn">🍽️ 학식 보기</button>
        <MealTable mealOn={mealOn}/>
        <span className='scroll-down'>▼ 아래로 스크롤하면 위젯을 사용할 수 있어요 ▼</span>
    </>
    )
}

export default MainPage