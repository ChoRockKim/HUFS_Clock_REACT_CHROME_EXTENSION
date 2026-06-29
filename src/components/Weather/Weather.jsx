import './Weather.scss'
import useWeatherData from '../../api/weather'
import useSettingStore from '../../store/useSettingStore'

const SKY_TEXT = { 1: '맑음', 3: '구름많음', 4: '흐림' };
const RAIN_TEXT = { 1: '그리고 비', 2: '그리고 눈/비', 3: '그리고 눈', 4: '그리고 소나기' };

export default function Weather() {
    const { data, isError, isLoading } = useWeatherData();
    const { selectedCampus } = useSettingStore();
    const weather = data;

    // 2번 수정: 로딩 중에도 store의 캠퍼스 값으로 표시
    const campusDisplay = selectedCampus === 'GLOBAL' ? '경기 용인시' : '서울 동대문구';

    const curTemp = weather?.data?.temp;
    const curSkyNum = weather?.data?.sky;
    const curRainNum = weather?.data?.rainType;
    const maxTemp = weather?.data?.tmx;
    const minTemp = weather?.data?.tmn;
    const humidity = weather?.data?.humidity;

    // 1번 수정: state/useEffect 제거 → 렌더 중 직접 계산
    const curSky = SKY_TEXT[curSkyNum] ?? '';
    // 4번 수정: rainType이 있으면 하늘 상태와 무관하게 강수 텍스트 표시
    const curRain = RAIN_TEXT[curRainNum] ?? '';

    // 3번 수정: 로딩/에러 시 캐시 데이터 있으면 그대로 표시
    if (isLoading && !data) {
        return (
            <div className="weather-main-container">
                <div className="left-side">
                    <div className="cur-temp">로딩 중...</div>
                    <div className="place-where">{campusDisplay}</div>
                </div>
            </div>
        )
    }

    return (
        <>
        <div className="weather-main-container">
            <div className="left-side">
                <div className="cur-temp"><span className='sky-icon'><SkyIcon weather={weather}/></span>
                <span>  {curTemp != null ? `${curTemp}°` : '...'}</span></div>
                <div className="place-where">{campusDisplay}</div>
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
    if (!weather?.data) return null;

    const curTime = parseInt(weather?.forecastTime?.split(' ')[1]);
    const { sky: curSkyInfo, rainType } = weather.data;
    const isDay = curTime > 6 && curTime < 18;
    const rType = parseInt(rainType);

    if (rType > 0) {
        const rainIcons = {
            1: "bi-cloud-hail-fill",
            2: "bi-cloud-sleet-fill",
            3: "bi-cloud-snow-fill",
            4: "bi-cloud-lightning-rain-fill"
        };
        return <i className={`bi ${rainIcons[rType] || "bi-cloud-rain-fill"}`}></i>;
    }
    if (curSkyInfo == 1) {
        return <i className={`bi ${isDay ? "bi-brightness-high-fill" : "bi-moon-stars-fill"}`}></i>;
    }
    if (curSkyInfo == 3) {
        return <i className={`bi ${isDay ? "bi-cloud-sun-fill" : "bi-cloud-moon-fill"}`}></i>;
    }
    if (curSkyInfo == 4) {
        return <i className="bi bi-cloud-fill"></i>;
    }
    return <i className="bi bi-question-circle"></i>;
}
