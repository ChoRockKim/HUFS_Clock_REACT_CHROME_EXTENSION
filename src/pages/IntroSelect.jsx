import useSettingStore from "../store/useSettingStore";
import './IntroSelect.scss'

function IntroSelect() {
  const { setCampus } = useSettingStore();

  return (
    <div className="intro-container">
        <div className="logo-image"></div>
        <h1 className="main-title">외대 종강시계</h1>
        <h1 style={{zIndex: '5'}}>환영합니다!👋</h1> 
        <p style={{zIndex:'5', fontSize:'22px'}}>소속 캠퍼스를 선택해주세요.</p>
      
      <div className="campus-select-container">
        <button className="campus-select-btn"
          onClick={() => setCampus('SEOUL')}>
          서울캠퍼스
        </button>
        
        <button className="campus-select-btn"
          onClick={() => setCampus('GLOBAL')}>
          글로벌캠퍼스
        </button>
      </div>
    </div>
  );
}

export default IntroSelect;