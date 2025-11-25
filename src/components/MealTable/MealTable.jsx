import useData from "../../api/request"
import './MealTable.scss'
import useStopSwiper from "../../hooks/useStopSwiper";
import useSettingStore from "../../store/useSettingStore";

export default function MealTable({ mealOn }) {
    const { selectedCampus } = useSettingStore();
    const { data, isError, isLoading } = useData();
    const stopSwiperHandlers = useStopSwiper();
    
    const mealTableStyle = selectedCampus === "GLOBAL" ? { height: 'auto' } : {};

    if (isLoading) return <div></div>;
    if (isError) return <div></div>;
    if (!data) return null;

    const meals = data?.meals;
    const today = new Date()
    const todayDay = Number(today.getDay())
    const mealClass = mealOn ? "appear" : ""

    return(
        
        <div className={`mealtable-container ${mealClass}`} {...stopSwiperHandlers} style={mealTableStyle}>
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