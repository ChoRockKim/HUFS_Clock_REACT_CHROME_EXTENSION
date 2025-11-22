import useData from "../../api/request";


export default function LeftTime(){
    const { data, isError, isLoading } = useData();
    
    console.log("남은시간부분 데이터임", data)
    return(
        <div>종강까지 남은 시간임</div>
    );
}
