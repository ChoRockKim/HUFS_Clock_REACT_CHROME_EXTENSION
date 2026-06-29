import { useEffect, useState } from 'react'
import './LinkButtons.scss'
import useSettingStore from '../../store/useSettingStore'
import useStopSwiper from '../../hooks/useStopSwiper'
import Swal from 'sweetalert2'

const linkErrorToast = () =>
    Swal.fire({
        toast: true,
        position: 'top',
        icon: 'warning',
        title: '유효하지 않은 링크예요.',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: { popup: 'glass-toast', title: 'glass-toast-title' },
        showClass: { popup: 'glass-toast-show' },
        hideClass: { popup: 'glass-toast-hide' },
    })


export default function LinkButtons() {
    const [isHovering, setIsHovering] = useState(false)
    const [isToggle, setIsToggle] = useState(false)
    const [isCustomOn, setIsCustomOn] = useState(false)
    const { userLink, updateUserLink, removeUserLink, customBookmarkCount, isBookmarkPinned: isPinned, toggleBookmarkPin } = useSettingStore()

    const fixedLinks = userLink.filter(link => !link.custom)
    const storedCustom = userLink.filter(link => link.custom)
    const customLinks = Array.from({ length: customBookmarkCount }, (_, i) =>
        storedCustom[i] ?? { id: 4 + i, hotLinkName: '북마크 추가', hotLink: '', custom: true }
    )
    const displayedLinks = [...fixedLinks, ...customLinks]
    const containerHeight = Math.ceil(displayedLinks.length / 2) * 60 + 70
    const [targetId, setTargetId] = useState('')
    const [inputName, setInputName] = useState('')
    const [inputLink, setInputLink] = useState('')
    const stopSwiperHandlers = useStopSwiper()

    function handleMouseOver(e){
        setIsHovering(true);
        e.stopPropagation();
    }
    function handleMouseOut(e){
        if (isPinned) return;
        setIsHovering(false);
        e.stopPropagation()
    }

    function toggleMouseOver(){
        setIsToggle(true)
    }
    function toggleMouseOut(){
        if (isCustomOn || isPinned) return;
        setIsToggle(false)
    }
    
    useEffect(() => {
        if (isCustomOn) {
            setIsHovering(true);
            setIsToggle(false);
        }
    }, [isCustomOn, isHovering, isToggle]);

    return (
        <div className={`link-total-container ${(isHovering || isPinned) ? 'appear-toggle' : ''} ${(isToggle && !isPinned) ? 'toggle-on' : ''} ${isPinned ? 'pinned-low' : ''}`}
        style={{ height: containerHeight }}
        {...stopSwiperHandlers}>
        <div style={{position:'relative', width:'100%', height:'100%'}}>
            <div className={`toggle-appear-box`}
            onMouseOver={toggleMouseOver}
            onMouseOut={toggleMouseOut}
            >
                <div className={`toggle-arrow ${(isHovering || isPinned) ? 'remove-toggle' : ''}`}
                onMouseOver={handleMouseOver}
                onMouseLeave={(e)=>{;
                    handleMouseOut(e)}}
                ><i className="bi bi-caret-left-fill"></i></div>
            </div>
            <CustomModal isHovering={isHovering} setIsHovering={setIsHovering}
            handleMouseOver={handleMouseOver} handleMouseOut={handleMouseOut}
            isCustomOn={isCustomOn} setIsCustomOn={setIsCustomOn}
            inputLink={inputLink} setInputLink={setInputLink}
            inputName={inputName} setInputName={setInputName}
            targetId={targetId} setTargetId={setTargetId}/>

            <div 
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}            
            className='link-btn-container'>
            <p className='link-btn-header'>바로가기</p>
            <button
                className={`link-pin-btn ${isPinned ? 'pinned' : ''}`}
                onClick={() => toggleBookmarkPin()}
                title={isPinned ? '고정 해제' : '고정'}
            >
                <i className={`bi ${isPinned ? 'bi-pin-fill' : 'bi-pin'}`}></i>
            </button>
            <div className='link-btn-area'>
                {displayedLinks.map((data)=>{
                    return (
                    <ButtonGroup data={data} key={data.id} isCustomOn={isCustomOn}
                    setIsCustomOn={setIsCustomOn} targetId={targetId} setTargetId={setTargetId}/>
                    )})}
            </div>
            </div>
        </div>
        </div>
    )
}

function ButtonGroup({ data, isCustomOn, setIsCustomOn, targetId, setTargetId }) {
    const { userLink, updateUserLink, removeUserLink } = useSettingStore()
    return(
        <div 
        onClick={()=>{
            if (data.hotLink != '') {
                try {
                    new URL(data.hotLink);
                    window.open(data.hotLink);
                } catch {
                    linkErrorToast();
                }
            }
            if (data.hotLink == '') {
                if (isCustomOn == false) {
                    setTargetId(data.id);
                    setIsCustomOn(true)}
                else {
                    if (targetId == data.id) {
                        setIsCustomOn(false)
                    } else {
                        setTargetId(data.id)
                    }
                }
            }
        }}
        className='link-btn-box'>{data.hotLinkName}
        {(data.custom == true && data.hotLink != '')  && 
        <div className='link-remove-btn'
        onClick={(e)=>{
            e.stopPropagation();
            if (data.hotLink == '') return;
            if (window.confirm(`'${data.hotLinkName}' 링크를 정말 삭제할까요?`)){
                removeUserLink(data.id)}
            }}>
            
            <i className="bi bi-trash3-fill"></i>
            </div>}
        </div>
    )
}

function normalizeUrl(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return trimmed;
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return 'https://' + trimmed;
}

function CustomModal({ setIsHovering, handleMouseOver, handleMouseOut,
    isCustomOn, setIsCustomOn, inputLink, inputName, setInputLink, setInputName,
    targetId, setTargetId })
    {
    const { userLink, updateUserLink, removeUserLink } = useSettingStore()
    
        return (
            <>
            <div className='prevent-error'
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}>
            
            <div className={`custom-container ${isCustomOn ? 'custom-appear' : ''}`}>
                <form action="#">
                    <div>링크 이름</div>
                    <input type="text" placeholder='북마크 이름을 입력해주세요.'
                    value={inputName}
                    onInput={(e)=>{
                        // console.log(e.target.value)
                        setInputName(e.target.value)
                    }}
                    ></input>
                    <div>링크 주소</div>
                    
                    <input placeholder='실제 있는 주소를 입력해주세요.'
                    type="url" value={inputLink}
                    onInput={(e)=>{
                        setInputLink(e.target.value)
                    }}
                    ></input>
                    
                    <button className='link-submit-btn' 
                    type='submit'
                    onClick={(e)=>{e.preventDefault();
                        if (inputName == '') {
                            alert('북마크 이름을 입력해주세요!')
                            return;
                        } else if (inputLink == '') {
                            alert('링크를 입력해주세요!')
                        } else {
                            const userLinkObject = {
                                id : targetId,
                                hotLinkName : inputName,
                                hotLink : normalizeUrl(inputLink),
                                custom : true }
                                // console.log('일단 추가되긴 함')
                                updateUserLink(userLinkObject);
                                setInputLink(''); setInputName('');
                                setIsCustomOn(false);
                            }
                        }
                    }
                    >추가</button>
                </form>
                <button 
                onClick={()=>{setIsCustomOn(false)}}
                className='link-quit-btn'>닫기</button>
            </div>
            </div>
            </>
    )
}