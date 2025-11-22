import useSettingStore from "../store/useSettingStore";

function IntroSelect() {
  const { setCampus } = useSettingStore();

  return (
    <div className="intro-container" style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#002d56', color: 'white' 
    }}>
      <h1>환영합니다! 👋</h1>
      <p>소속 캠퍼스를 선택해주세요.</p>
      
      <div style={{ marginTop: '20px', display: 'flex', gap: '20px' }}>
        <button 
          onClick={() => setCampus('SEOUL')}
          style={{ padding: '15px 30px', fontSize: '18px', cursor: 'pointer' }}
        >
          서울캠퍼스
        </button>
        
        <button 
          onClick={() => setCampus('GLOBAL')}
          style={{ padding: '15px 30px', fontSize: '18px', cursor: 'pointer' }}
        >
          글로벌캠퍼스
        </button>
      </div>
    </div>
  );
}

export default IntroSelect;