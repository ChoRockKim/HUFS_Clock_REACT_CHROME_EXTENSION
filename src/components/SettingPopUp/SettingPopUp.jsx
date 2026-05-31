import { useEffect, useRef, useState } from 'react'
import './SettingPopUp.scss'
import useStopSwiper from '../../hooks/useStopSwiper'
import useSettingStore from '../../store/useSettingStore'

export default function SettingPopUp({ settingOn }) {
    let [name, setName] = useState('')
    let [enrollNum, setEnrollNum] = useState('21')
    const [isOpen, setIsOpen] = useState(false)
    const toggleDropDown = () => {setIsOpen(!isOpen)}
    const { setNameCash, setYearCash, setCampus } = useSettingStore()
    let curOpen = useRef(null);
    let [completeEffect, setCompleteEffect] = useState('')
    const stopSwiperHandler = useStopSwiper()
    const numList = [19, 20, 21, 22, 23, 24, 25, 26]
    const settingClass = settingOn ? 'appear' : ''

    useEffect(()=>{
        const handleWindowClick = (e) => {
            if (curOpen.current && !curOpen.current.contains(e.target)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            window.addEventListener('click', handleWindowClick)
        }
        return ()=>{
            window.removeEventListener('click', handleWindowClick)
        }
    }, [isOpen])

    return(
        <>
        <div className={`setting-container ${settingClass}`} {...stopSwiperHandler}>
            <div className='setting-header'>설정</div>
            <div className='setting-please'>이름/학번을 입력해주세요</div>
            <form action="#" style={{display: 'flex'}}>
                <input type="text" id="input-name" value={name}
                placeholder='이름' 
                onInput={(e)=>{
                    setName(e.target.value)
                }}/>
                <div name="enroll" id="input-number" ref={curOpen}
                onClick={toggleDropDown}>
                    <span>{enrollNum}학번</span>
                    {isOpen && <ul className="input-number-options" {...stopSwiperHandler}>                    
                    {numList.map((num, idx)=>{
                        return(
                            <li onClick={(e)=>{
                                setEnrollNum(e.target.value)
                            }}
                             value={num} key={num}>{num}학번</li>
                        )
                    })}
                    </ul>}
                </div>
                <button type='submit' onClick={(e)=>{
                    e.preventDefault()
                    if (name == '') {alert('이름을 입력해주세요'); return}
                    if (name.length >10) {alert('이름이 너무 길어요!'); 
                        setName(''); return
                    }
                    setNameCash(name);
                    setYearCash(enrollNum);
                    setName('') 
                    setCompleteEffect('animation')
                    setTimeout(()=>{setCompleteEffect('')}, 2000)
                }}
                className='setting-save-btn'
                >저장
                <div className={`complete-popup ${completeEffect}`}>성공!</div>
                </button>
            </form>
            <div className='setting-campus-container'>
            <div className="setting-campus">캠퍼스 선택</div>
            <button className="campus-choose-btn"
            onClick={() => setCampus('SEOUL') }
            >서울캠퍼스</button>
            <button className='campus-choose-btn'
            onClick={() => setCampus('GLOBAL')}
            >글로벌캠퍼스</button>
            </div>
        </div>
        </>
    )
}
