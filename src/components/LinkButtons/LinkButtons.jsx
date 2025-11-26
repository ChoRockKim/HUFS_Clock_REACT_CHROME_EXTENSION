import { useEffect, useState } from 'react'
import './LinkButtons.scss'
import useSettingStore from '../../store/useSettingStore'


export default function LinkButtons() {
    const [isHovering, setIsHovering] = useState(false)
    const [isToggle, setIsToggle] = useState(false)

    const { userLink, updateUserLinkName } = useSettingStore()
    
    function handleMouseOver(e){
        setIsHovering(true);
        e.stopPropagation();
    }
    function handleMouseOut(e){
        setIsHovering(false);
        e.stopPropagation()
    }

    function toggleMouseOver(){
        setIsToggle(true)
    }
    function toggleMouseOut(){
        setIsToggle(false)
    }
    
    return (
        <div className={`link-total-container ${isHovering ? 'appear-toggle' : ''} ${isToggle? 'toggle-on' : ''}`}>
        <div style={{position:'relative', width:'100%', height:'100%'}}>
            <div className='toggle-appear-box'
            onMouseOver={toggleMouseOver}
            onMouseOut={toggleMouseOut}
            >
                <div className={`toggle-arrow ${isHovering ? 'remove-toggle' : ''}`}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
                ><i className="bi bi-caret-left-fill"></i></div>
            </div>

            <div 
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}            
            className='link-btn-container'>
            <p className='link-btn-header'>바로가기</p>
            <div className='link-btn-area'>
                {userLink.map((data)=>{
                    return (
                    <ButtonGroup data={data} key={data.id}>
                        <div className='custom-btn-container'></div>
                    </ButtonGroup>
                    )})}
            </div>
            </div>
        </div>
        </div>
    )
}

function ButtonGroup({ data }) {
    return(
        <div 
        onClick={()=>{
            data.hotLink != '' && window.open(data.hotLink)}}
        className='link-btn-box'>{data.hotLinkName}</div>
    )
}