import useData from "../../api/request"
import './MealTable.scss'
import useStopSwiper from "../../hooks/useStopSwiper";
import useSettingStore from "../../store/useSettingStore";

export default function MealTable({ mealOn }) {
    const { selectedCampus } = useSettingStore();
    const { data, isError, isLoading } = useData();
    const stopSwiperHandlers = useStopSwiper();
    
    const mealTableStyle = selectedCampus === "GLOBAL" ? { height: 'auto' } : {};

    if (isLoading && !data) return null;
    if (isError && !data) return null;
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
    // 옵셔널 체이닝(?.)을 사용하여 안전하게 오늘의 메뉴 정보에 접근합니다.
    const menuForToday = meals[idx]?.menus?.[todayDay - 1];

    // 메뉴가 없으면 "운영 정보 없음"을, 가격이 없으면 빈 문자열을 할당합니다.
    const todayMenu = menuForToday?.name || "운영 정보 없음";
    const todayPrice = menuForToday?.price || "";

    return(
    <>
        <div className="meal-datas">
            <div className="meal-time">⦁ {meals[idx].time}</div>
            <div className="meal-menu">
                {todayMenu}
                {/* 가격 정보가 있을 때만 괄호와 함께 표시합니다. */}
                {todayPrice && <span> ({todayPrice})</span>}
            </div>
        </div>
        
    </>
    )
}