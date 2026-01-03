import UserFeedBack from "./UserFeedBack"
import './UserFeedBack.scss'

export default function FeedBackBox() {
    
    return(
        <>
        <div className="feedback-main-container">
            <span className="dev-header">개발자 소개</span>
            <p>안녕하세요! 외대 종강시계를 개발, 유지보수 하고 있는 김초록입니다.<br/><br/>
            현재 융복합소프트웨어를 이중전공하고 있습니다.<br/><br/>
            앱에 대한 버그, 오타 제보, 개선 사항을 하단 입력창이나 메일로 보내주시면 빠르게 반영하도록 하겠습니다.
            <br/><br/>
            항상 이용해 주셔서 감사합니다! 좋은 하루 보내세요:)</p>
            <UserFeedBack/>
            <i onClick={()=>{window.open('https://github.com/ChoRockKim')}}
            className="bi bi-github github-img"></i>
        </div>
        </>
    )
}