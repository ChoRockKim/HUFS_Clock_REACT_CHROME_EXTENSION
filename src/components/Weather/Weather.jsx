import './Weather.scss'
import useWeatherData from '../../api/weather'
import useSettingStore from '../../store/useSettingStore'
import { useEffect, useState } from 'react';

export default function Weather() {
    const { data, isError, isLoading } = useWeatherData();
    const weather = data;
    const curTemp = weather?.data?.temp;
    const curSkyNum = weather?.data?.sky;
    const curRainNum = weather?.data?.rainType;
    const maxTemp = weather?.data?.tmx;
    const minTemp = weather?.data?.tmn;
    const humidity = weather?.data?.humidity;
    let [curSky, setCurSky] = useState('')
    let curRain = '';

    useEffect(()=> {
        if (curSkyNum == 1) {
            setCurSky('맑음')
        } else if (curSkyNum == 3) {
            setCurSky('구름많음')
        } else if (curSkyNum == 4) {
            setCurSky('흐림')
        }
    }, [curSkyNum])


    if (curSkyNum != 1) {
        if (curRainNum == 1) {
            curRain = '그리고 비'
        } else if (curRainNum == 2) {
            curRain = '그리고 눈/비'
        } else if (curRainNum == 3) {
            curRain = '그리고 눈'
        } else if (curRainNum == 4) {
            curRain = '그리고 소나기'
        }
    } 
    return (
        <>
        <div className="weather-main-container">
            <div className="left-side">
                <div className="cur-temp"><span className='sky-icon'><SkyIcon weather = {weather}/></span>
                <span>  {curTemp != null ? `${curTemp}°` : "로딩 중..."}</span></div>
                <div className="place-where">{weather?.campus == 'SEOUL' ? '서울 동대문구' : '경기 용인시'}</div>            
                <div className="sky-info">
                    <span className="cur-sky">{curSky} {curRain}</span>
                </div>
            </div>
            <div className="right-side">
                <div className="min-max-temp">
                    <span>{`최고 ${maxTemp != null ? `${maxTemp}°` : '...'} / 최저 ${minTemp != null ? `${minTemp}°` : '...'}`}</span>
                </div>
                <div className="humid-info">습도 {humidity != null ? `${humidity}%` : '...'}</div>
            </div>
        </div>
        </>
    )
}

function SkyIcon({ weather }) {
    if (!weather?.data) return null; // 데이터가 없으면 아무것도 안 그림

    const curTime = parseInt(weather?.forecastTime?.split(' ')[1]);
    const { sky: curSkyInfo, rainType } = weather.data;
    const isDay = curTime > 6 && curTime < 18; // 6시~18시를 낮으로 정의
    const rType = parseInt(rainType);

    // 1. 강수 우선 처리 (비/눈이 오면 하늘 상태보다 우선)
    if (rType > 0) {
        const rainIcons = {
            1: "bi-cloud-hail-fill",          // 비
            2: "bi-cloud-sleet-fill",         // 비/눈
            3: "bi-cloud-snow-fill",          // 눈
            4: "bi-cloud-lightning-rain-fill" // 소나기
        };
        return <i className={`bi ${rainIcons[rType] || "bi-cloud-rain-fill"}`}></i>;
    }
    // 2. 비 안 올 때: 하늘 상태별 아이콘 (낮/밤 구분)
    if (curSkyInfo == 1) { // 맑음
        return <i className={`bi ${isDay ? "bi-brightness-high-fill" : "bi-moon-stars-fill"}`}></i>;
    } 
    if (curSkyInfo == 3) { // 구름많음
        return <i className={`bi ${isDay ? "bi-cloud-sun-fill" : "bi-cloud-moon-fill"}`}></i>;
    } 
    if (curSkyInfo == 4) { // 흐림
        return <i className="bi bi-cloud-fill"></i>;
    }
    // 기본값 (예외 상황)
    return <i className="bi bi-question-circle"></i>;
}