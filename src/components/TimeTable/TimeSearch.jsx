import { useEffect, useState } from 'react';
import './TimeSearch.scss';
import useStopSwiper from '../../hooks/useStopSwiper';
import { deptSeoul, deptGlobal, liberalSeoul, liberalGlobal
    , basicSeoul, basicGlobal
 } from './deptCode';
import axios from 'axios';


export default function TimeSearch() {
    const stopSwiperHandlers = useStopSwiper();
    const yearList = [2026, 2025, 2024, 2023, 2022, 2021];
    const campusList = ['서울', '글로벌'];
    const semesterList = ['1학기', '여름학기', '2학기', '겨울학기']
    const areaList = ['전공', '교양', '기초']    
    const [deptList, setDeptList] = useState(deptSeoul);

    const [isYearOpen, setIsYearOpen] = useState(false);
    const [isCampusOpen, setIsCampusOpen] = useState(false); 
    const [isSemesterOpen, setIsSemesterOpen] = useState(false);
    const [isAreaOpen, setIsAreaOpen] = useState(false);
    const [isDeptOpen, setIsDeptOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false)

    const [year, setYear] = useState(2026);
    const [campus, setCampus] = useState('서울');
    const [semester, setSemester] = useState('1학기')
    const [area, setArea] = useState('전공')
    const [dept, setDept] = useState(deptList[0].name)
    const [course, setCourse] = useState('')
    const [professor, setProfessor] = useState('')
    const [params, setParams] = useState({
        year : '', semester : '', campus : '', dept_code : '',
        keyword : '', gubun : '', professor : '', days : {}, times : {}
    })
    const [loadedLssn, setLoadedLssn] = useState([])
    const [loading, setLoading] = useState(false);
    const [loadFail, setLoadFail] = useState(false);

    const [chosenCourse, setChosenCourse] = useState({})

    useEffect(()=>{

        if (area == '전공') {
            if (campus == '서울') {
                setDeptList(deptSeoul)
            } else if (campus == '글로벌') {
                setDeptList(deptGlobal)
            }
        }
        else if (area == '교양') {
            if (campus == '서울') {
                setDeptList(liberalSeoul)
            } else if (campus == '글로벌') {
                setDeptList(liberalGlobal)
            }
        } else if (area == '기초') {
            if (campus == '서울') {
                setDeptList(basicSeoul)
            } else if (campus == '글로벌') {
                setDeptList(basicGlobal)
            }
        }


    }, [campus, area])

    useEffect(()=>{
        setDept(deptList[0].name)
    }, [deptList])


    useEffect(()=>{
        var copied_params = {...params}
        copied_params.year = String(year);

        if (semester == '1학기') {
            copied_params.semester = '1';
        } else if (semester == '여름학기') {
            copied_params.semester = '2';
        } else if (semester == '2학기') {
            copied_params.semester = '3';
        } else if (semester == '겨울학기') {
            copied_params.semester = '4';
        }

        if (campus == '서울') {
            copied_params.campus = 'H1';
        } else if (campus == '글로벌') {
            copied_params.campus = 'H2'
        }

        if (area == '전공') {
            copied_params.gubun = '1'
        } else if (area == '교양') {
            copied_params.gubun = '2'
        } else if (area == '기초') {
            copied_params.gubun = '3'
        }
        
        const nameToCode = deptList.find(deptObj => deptObj.name == dept)
        copied_params.dept_code = String(nameToCode.code);
        copied_params.keyword = course;
        copied_params.professor = professor;

        setParams(copied_params)

    }, [year, campus, semester, area, dept, course, professor])

    async function getLssnList(params) {
        setLoading(true);
        try {
            const response = await axios.post('https://hufs-clock-api.vercel.app/api/timetable', params);
            console.log(response.data)
            setLoading(false);
            setLoadedLssn(response.data)
            setLoadFail(false);

        } catch(error) {
            console.error('검색 실패 ㅜㅜ', error)
            alert('데이터 불러오기 실패ㅜㅜ')
            setLoadFail(true);
    }
}

    return (
        <>
        <div className="search-main-container">
            <div className="search-header">
                <span className='search-header-text'>시간표 검색</span>    
            <div className='search-option-container'>
            
                <div className='input-year'
                onClick={()=>{setIsYearOpen(!isYearOpen)}}>
                    <span>{year}년</span>

                    {isYearOpen && <ul className='input-year-options' {...stopSwiperHandlers}>
                    {yearList.map((year, idx)=>{
                        return(
                            <li value={year} key={idx}
                            onClick={()=>{setYear(year)}}
                            >{year}년<div></div></li>
                        )
                    })}
                </ul>}
                </div>

                <div onClick={()=>{setIsCampusOpen(!isCampusOpen)}}
                className='input-campus'>
                    <span>{campus}</span>
                {isCampusOpen && <ul className='input-campus-options'>
                {campusList.map((campus, idx)=>{
                    return (
                        <li value={campus} key={idx}
                        onClick={()=>{setCampus(campus)
                        }}>{campus}<div></div></li>
                    )
                })}
                </ul>}
                </div>

                <div onClick={()=>{setIsSemesterOpen(!isSemesterOpen)}}
                className='input-semester'>
                    <span>{semester}</span>
                {isSemesterOpen && <ul className='input-semester-options'>
                {semesterList.map((semester, idx)=>{
                    return (
                        <li value={semester} key={idx}
                        onClick={()=>{setSemester(semester)
                        }}>
                            {semester}
                        </li>
                    )
                })}
                </ul>}
                </div>


                <div onClick={()=>{setIsAreaOpen(!isAreaOpen)}}
                className='input-area'>
                    <span>{area}</span>
                {isAreaOpen && <ul className='input-area-options'>
                {areaList.map((area, idx)=>{
                    return (
                        <li value={area} key={idx}
                        onClick={()=>{setArea(area)
                        }}>
                            {area}
                        </li>
                    )
                })}
                </ul>}
                </div>

                <div onClick={()=>{setIsDeptOpen(!isDeptOpen)}}
                className='input-dept'>
                    <span>{dept}</span>
                {isDeptOpen && <ul className='input-dept-options' {...stopSwiperHandlers}>
                {deptList.map((dept, idx)=>{
                    return (
                        <li value={dept.name} key={idx}
                        onClick={()=>{setDept(dept.name)
                        }}>
                            {dept.name}
                        </li>
                    )
                })}
                </ul>}
                </div>

                <form className='search-container'>
                <span>
                <input className='course-name-search' placeholder='교과목명' 
                type="text" onChange={(e)=>{setCourse(e.target.value)}} />

                <input className='professor-name-search' placeholder='담당교수' 
                type="text" onChange={(e)=>{setProfessor(e.target.value)}} />
                </span>

                <button onClick={(e)=>{getLssnList(params)
                    e.preventDefault()
                }}
                className='search-btn'>검색</button>
                
                </form>
            </div>
            </div>
            <div className='course-list-container'>
                <ul {...stopSwiperHandlers}>
                {loading ? <span className='course-loading'>로딩 중...</span> : loadedLssn.map((data)=>{
                    return <li onClick={()=>{setChosenCourse(data)
                        setIsDetailOpen(true);
                    }}
                    className='course-list'>
                        <span style={{width : '100%', display : 'block', whiteSpace : 'nowrap', overflowX : 'hidden'}}>
                            {data.c_name}
                            <br/>
                        <span style={{fontSize : '12px', width : '100%', textAlign : 'left'
                            , display : 'block', paddingLeft : '1px'}}>
                            {data?.professor && `${data.professor}`}
                            {data?.grade && ` / ${data.grade}학년`}
                            {data?.area && ` / ${data.area}`}
                            {data.credit && ` / ${data.credit}학점`}
                            <br></br>
                            {data?.time && `${data.time}`}{data?.c_id && ` / ${data.c_id}`}</span>
                        </span>
                    </li>
                })}
                </ul>
            </div>
            <DetailCourse chosenCourse ={chosenCourse} year={year} params={params} isDetailOpen={isDetailOpen} setIsDetailOpen={setIsDetailOpen}/>
        </div>
        </>
    )
}

function DetailCourse({ chosenCourse, year, params, isDetailOpen, setIsDetailOpen }) {
    
    if (isDetailOpen) {

    return(
        <>
        <div className='detail-course-container'>
            <div style={{fontSize : '20px', marginBottom : '5px',
                height : '50px'
            }}>{chosenCourse?.c_name}</div>
        <div className='detail-course-white-box'>

            <div>학년: <span>{chosenCourse.grade}학년</span></div>
            <div>담당교수: <span>{chosenCourse?.professor}</span></div>
            <div>이수구분: <span>{chosenCourse?.area}</span></div>
            <div>학점: <span>{chosenCourse?.credit}학점</span></div>
            <div>시간: <span>{chosenCourse.time}</span></div>
            <div>신청/제한인원: <span>{chosenCourse.capacity}</span></div>
            <div style={{marginBottom : '15px'}}>학수번호: <span>{chosenCourse.c_id}</span></div>
            <div>비고: <span>{chosenCourse.note}</span></div>

            <div className='detail-course-btn-container'>
                <button onClick={()=>{
                    window.open(`https://wis.hufs.ac.kr/src08/jsp/lecture/syllabus.jsp?mode=print&ledg_year=${year}&ledg_sessn=${params.semester}&org_sect=A&lssn_cd=${chosenCourse.c_id}`)}}
                    id='detail-course-btn-plan'>강의계획서</button>
                <button className='detail-course-btn-submit'>신청</button>
                <button className='detail-course-btn-quit'
                onClick={()=>{setIsDetailOpen(false)}}>닫기</button>
            </div>
        </div>
        </div>
        </>
        )
    }
    else {
        return (
            <>
            </>
        )
    }
}