import useData from "../../api/request"
import './MealTable.scss'
import useStopSwiper from "../../hooks/useStopSwiper";

export default function MealTable({ mealOn }) {
    const { data, isError, isLoading } = useData();
    const stopSwiperHandlers = useStopSwiper();

    if (isLoading) return <div>로딩 중...🐢</div>;
    if (isError) return <div>데이터를 못 가져왔어요ㅜㅜ</div>;
    if (!data) return null;

    const meals = data?.meals;
    const today = new Date()
    const todayDay = Number(today.getDay())
    let mealClass = ''
    if (mealOn) {
        mealClass="appear"
    } else {
        mealClass=''
    }

    return(
        
        <div className={`mealtable-container ${mealClass}`} {...stopSwiperHandlers}>
            <div className="mealtable-header">🍽️ 오늘의 학식</div>
            {meals.map((data, idx)=>{
                return <MealData meals={meals} idx={idx} key={idx} todayDay={todayDay}/>
            })}
        </div>
    )
}

function MealData({ meals, idx, todayDay }) {
    let todayMenu = meals[idx].menus[todayDay-1].name;
    let todayPrice = meals[idx].menus[todayDay-1].price;
    return(
    <>
        <div className="meal-datas">
            <div className="meal-time">⦁ {meals[idx].time}</div>
            <div className="meal-menu">{todayMenu} <span>({todayPrice})</span></div>
        </div>
        
    </>
    )
}