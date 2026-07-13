import Noticetable from "../components/NoticeTables/NoticeTable";
import CurrentTime from "../components/CurrentTime/CurrentTime";
import LeftTime from "../components/LeftTime/LeftTime";
import MealTable from "../components/MealTable/MealTable";
import "./MainPage.scss";
import { useState } from "react";
import SettingPopUp from "../components/SettingPopUp/SettingPopUp";
import TodaySentence from "../components/TodaySentence/TodaySentence";
import LinkButtons from "../components/LinkButtons/LinkButtons";
import { useShowLatestNotice } from "../hooks/useAppNoticeAlert";

function MainPage() {
  let [mealOn, setMealOn] = useState(false);
  let [settingOn, setSettingOn] = useState(false);
  const showLatestNotice = useShowLatestNotice();

  return (
    <div id="main-page-root">
      <TodaySentence />
      <Noticetable />
      <CurrentTime />
      <LeftTime />
      <LinkButtons />
      <button onClick={showLatestNotice} className="show-notice-btn">
        개발자 공지
      </button>
      <button
        onClick={() => {
          setMealOn(!mealOn);
        }}
        className="show-meal-btn"
      >
        🍽️ 학식 보기
      </button>
      <MealTable mealOn={mealOn} />
      <button
        onClick={() => {
          setSettingOn(!settingOn);
        }}
        className="setting-btn"
      >
        설정
      </button>
      <SettingPopUp settingOn={settingOn} />
      <span className="scroll-down">
        ▼ 아래로 스크롤하면 위젯을 사용할 수 있어요 ▼
      </span>
    </div>
  );
}

export default MainPage;
