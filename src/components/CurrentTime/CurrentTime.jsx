import { useEffect, useState } from "react"
import './CurrentTime.scss'

export default function CurrentTime() {
    const [curTime, setCurTime] = useState(new Date())

    useEffect(()=>{
        const timer = setInterval(()=>{
            setCurTime(new Date())
        }, 1000)
        return () => clearInterval(timer)
    }, [])


    return (
        <>
        <div className="current-time-container">
        <div style={{marginBottom: '5px'}}>현재시간</div>
        <div>{curTime.toLocaleString()}</div>
        </div>
        </>
    )
}