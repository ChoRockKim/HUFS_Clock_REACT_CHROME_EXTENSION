import useSettingStore from "../../store/useSettingStore"
import './TodaySentence.scss'
import { sentence } from "./Greeting"

export default function TodaySentence() {

    const { userName, enterYear } = useSettingStore()
    const getRandomIndex = function(length){
    
        return parseInt(Math.random() * length)
    }
    let   randomSentence = sentence[getRandomIndex(sentence.length)]

    return(
        <div className="today-sentence"
        >{enterYear ? enterYear : 26}학번 {userName ? userName : '부'}님! 
        <br></br>{randomSentence}</div>
    )
}