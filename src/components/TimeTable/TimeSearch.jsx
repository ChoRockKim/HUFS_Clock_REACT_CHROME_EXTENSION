import { useEffect, useState } from 'react';
import './TimeSearch.scss';
import useStopSwiper from '../../hooks/useStopSwiper';
import { deptSeoul, deptGlobal, liberalSeoul, liberalGlobal
    , basicSeoul, basicGlobal
 } from './deptCode';


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

    const [year, setYear] = useState(2026);
    const [campus, setCampus] = useState('서울');
    const [semester, setSemester] = useState('1학기')
    const [area, setArea] = useState('전공')
    const [dept, setDept] = useState(deptList[0].name)


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

            </div>
            </div>
        </div>
        </>
    )
}