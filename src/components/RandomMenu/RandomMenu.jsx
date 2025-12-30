import { useState } from 'react'
import './RandomMenu.scss'
import { menuArray } from './MenuList'

export default function RandomMenu() {
    
    const [menuOn, setMenuOn] = useState('');
    const [menuIdx, setMenuIdx] = useState(0);
    const [countBtn, setCountBtn] = useState(0);
    return(
    <>
    <div className="random-menu-container">
        <div className="random-menu-header"><span>랜덤 메뉴 추천 🍽️</span></div>
        <Maybe countBtn={countBtn}/>
        <div className='today-menu'><span>오늘은...{menuOn && <MenuList menuIdx={menuIdx}/>}</span></div>
        <div className='menu-button' onClick={()=>{
            setMenuOn(1);
            setMenuIdx(parseInt(Math.random() * menuArray.length))
            setCountBtn(a => a + 1)
        }}>메뉴 뽑기!</div>
    </div>
    </>
)
}

function MenuList({ menuIdx }) {

    let randomMenu = menuArray[menuIdx];

    return(
        <div className="menu-suggest">
            {randomMenu}!<span> 어때요?</span>
        </div>
    )
}

function Maybe({ countBtn }) {

    if (countBtn >= 8 && countBtn <16) {
    return(
        <>
        <span className='maybe'>설마 원하는게 나올 때 까지 돌리시는건 아니죠?ㅜㅜ</span>
        </>
        )
    } else if (countBtn >= 16 && countBtn <30) {
    return(
        <>
        <span className='maybe'>이제 그만 돌리시는건 어떠신가요...!?</span>
        </>
        )
    } else if (countBtn >= 30 && countBtn <50) {
    return(
        <>
        <span className='maybe'>얼른 밥 먹으러 가시죠...!!</span>
        </>
        )
    } else if (countBtn >= 50 && countBtn < 80) {
    return(
        <>
        <span className='maybe'>더 누르셔도 아무것도 안 나온답니다:)</span>
        </>
        )
    } else if (countBtn >= 80 && countBtn < 150) {
    return(
        <>
        <span className='maybe'>그만 누르세요...!!</span>
        </>
        )
    } else if (countBtn >= 150) {
    return(
        <>
        <span className='maybe'>당신을 뻘짓의 제왕으로 인정합니다. 땅땅 🔨</span>
        </>
        )
    }


    return(
        <></>
    )
}