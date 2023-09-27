import { onValue, ref, set } from "firebase/database"
import { db } from "./firebase"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

const AllJob = ({setSelect, appliedJob, select}) => {
    const {userDetail} = useSelector(e => e)
    const uid = userDetail?.uid
    const [ tempArr, setTempArr ] = useState([])
    const [ applyInd, setApplyInd ] = useState(false)
    const [ applyText, setApplyText ] = useState("")
    const [check, setCheck] = useState(false)
    const Apply = (indexes) => {
        onValue(ref(db, "AllJobs/"),(data) =>{
            let tempUid = Object?.values(data?.val())
            [indexes?.index]?.job[indexes?.index2]?.jobDetail?.uid
            console.log(tempUid)
            set(ref(db, "AllJobs/" + tempUid + '/job/' + indexes?.index2 + '/jobDetail/apply/' + uid),{
                    userDetail
            })
        })
        setSelect(1)
    }
    let descriptionPause = false;
    useEffect(() => {
        onValue(ref(db, "AllJobs/"),(data) =>{
            data?.val() && (Object?.values(data?.val()))?.map((item, index) => 
            item?.job?.map((item2, index2) => {
                let temp = {...item2}
                temp.indexes = {index, index2}
            if(!item2?.jobDetail?.apply?.hasOwnProperty(uid)){
                setTempArr(tempArr => [...tempArr,(temp)])
                console.log(tempArr)
                setCheck(true)}
            else{
                setSelect(false)
            }
            }
            ))
            !data.val() || data.val() == [] && setSelect(false)
        })
    },[select])
    useEffect(() => {
        setApplyText("")
    },[applyInd])
    useEffect(() => {
        let temp = applyText.trim().split(" ");
        if( temp.length > 49 && applyText )
        descriptionPause = true
        else descriptionPause = false
    })
    return(
        <div className="previousJobMainDiv">
            {tempArr !== []? (tempArr.map((item, index) => 
                <div className={applyInd == index && applyInd !== false ? "previousJobBox previousJobBox2" :"previousJobBox"} onClick={() => applyInd !== index && setApplyInd(index)}>
                <h1>{item?.jobDetail?.title?.toUpperCase()}</h1>
                <div>
                <h3>Duration: {item?.jobDetail?.duration} {item?.jobDetail?.duration == 1? "Day" : "Days"}</h3>
                <h3>Budget: ${item?.jobDetail?.salary}</h3>
                <h3>
                    Description: <i>{item?.jobDetail?.description}</i>
                </h3>
                </div>
                <button className="postButton" onClick={() => Apply(item.indexes)}>Apply</button>
                </div>
            )) : setSelect(false)}
        </div>
    )
}
export default AllJob