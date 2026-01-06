import React, { useEffect, useState } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import useSettingStore from '../../store/useSettingStore';

export default function UserFeedBack() {
  // @formspree/react는 [state, handleSubmit] 딱 두 가지만 줍니다!
  const [state, handleSubmit] = useForm("xgovlwkd");
  const { userName } = useSettingStore();
  const [text, setText] = useState('')  
  const [timeLeft, setTimeLeft] = useState(0);
  const isSpam = /(.)\1{9,}/.test(text); // 같은 문자가 10번 연속되면 true

  const badWords = [
    "시발", "씨발", "시빨", "씨빨", "ㅅㅂ", "ㅆㅂ",
    "존나", "졸라", "좆", "지랄", "ㅈㄹ",
    "병신", "ㅂㅅ", "등신", "머저리",
    "미친", "미친놈", "미친년",
    "개새끼", "개세끼", "개새", "ㄱ새끼",
    "쓰레기", "호구", "꼴통",
    "닥쳐", "꺼져", "한남", "한녀", // 혐오 표현 포함 여부는 선택
    ];
  const isSwearing = badWords.some(word => text.includes(word));

  useEffect(()=>{
    const lastSent = localStorage.getItem('lastFeedbackTime');
    if (lastSent) {
        const tenMin = 10 * 60 * 1000 //밀리초로 계산
        const diff = Date.now() - parseInt(lastSent)
        if (diff < tenMin) {
            setTimeLeft(Math.ceil((tenMin - diff) / 1000))
        }
    }
  }, [])

  useEffect(()=>{
    if (timeLeft > 0) {
        const timer = setInterval(()=>{
            setTimeLeft((prev)=> prev - 1)
        }, 1000)
    return () => clearInterval(timer);
    }
  }, [timeLeft])

  useEffect(()=>{
    if (state.succeeded) {
        localStorage.setItem('lastFeedbackTime', Date.now().toString());
        setTimeLeft(600);
    }
  }, [state.succeeded]);

  // 1. 성공 시 화면
  if (state.succeeded) {
    return <p className='feedback-thanks'>소중한 피드백 감사합니다! ^v^</p>;
  }

  return (
    // 2. handleSubmit에 onSubmit을 또 씌우지 말고 바로 연결하세요.
    <form onSubmit={handleSubmit}>
      {/* 사용자 이름 (Hidden) */}
      <input
        type="hidden" 
        name="userName" // 메일함에 표시될 이름
        value={userName || '익명'} // defaultValue 대신 value 사용 권장
      />

      {/* 피드백 내용 */}
      <label htmlFor="message" className='feedback-label'>피드백 보내기</label>
      <textarea
        minLength={10}
        maxLength={200}
        id="user-message"
        name="message" // 메일함에 표시될 이름
        required // 필수 입력 (엣지 케이스 처리)
        placeholder='10분에 한 번 씩만 보낼 수 있어요.
200자 이내로 작성해주세요!

현재 사용하시는 브라우저/OS(윈도우/MAC) 정보도 같이 보내주시면 빠르게 수정이 가능해요.'
        onChange={(e)=>{setText(e.target.value)}}
        disabled = {timeLeft > 0}
      />
      
      {/* Formspree 서버가 뱉는 에러 표시 */}
      <ValidationError 
        prefix="Message" 
        field="message"
        errors={state.errors}
      />

      {/* 전송 중엔 버튼 비활성화 */}
      <button id='submit-btn'
      type="submit" disabled={state.submitting || text.trim().length < 10 || isSpam || timeLeft > 0
        || isSwearing}>
        {state.submitting ? '전송 중...' : '피드백 전송'}

      </button>
      
      {/* 만약 429 에러 같은 서버 에러가 났을 때 보여줄 문구 */}
      {state.errors && !state.succeeded && (
        <p className='ten-min'>나중에 다시 시도해 주세요.</p>
      )}
      {/* {state.errors && !state.succeeded && (
        <p style={{color: 'red'}}>전송량이 너무 많습니다. 나중에 다시 시도해 주세요.</p>
      )} */}
    {timeLeft > 0 && <p className='ten-min'>아직 보낼 수 없어요ㅜㅜ</p>}
    {(text.length<10 && text.length > 0) && <p className='ten-min'>10글자 이상 부탁드립니다:)</p>}
    {isSpam && !isSwearing && <p className='ten-min'>도배하시는건 아니죠..!?</p>}
    {text.length >= 10 && isSwearing && <p className='ten-min'>나쁜 말은 안돼요ㅜㅜ</p>}
    </form>

  );
}