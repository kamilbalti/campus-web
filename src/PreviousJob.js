import { onValue, ref, set } from "firebase/database"
import { useEffect, useState } from "react"
import { db } from "./firebase"
import { useSelector } from "react-redux"

const PreviousJob = ({ select, tempInd, setTempInd, setSelect, setTitle, setDuration, setSalary, setDescription}) => {
    const {userDetail} = useSelector(e => e)
    const [applyInd, setApplyInd] = useState(false)
    const [ PreviousJobData, setPreviousJobData ] = useState([])
    const uid = userDetail?.uid
    let deleteInd = false
    const deleteJob = (index) => {
        deleteInd = index
        let temp = [...PreviousJobData];
        temp = temp.filter((item2, index2) => 
        index2 !== deleteInd
        )
        set(ref(db, "AllJobs/" + uid + "/job/"),{})
        temp?.map((item, index) => 
        set(ref(db, "AllJobs/" + uid + "/job/" + index),{
            jobDetail: item.jobDetail,
        })
        )
        setSelect(1)
        setPreviousJobData(temp)
        deleteInd = false
    }
    const updateJob = (index) => {
        setTempInd(index)
        onValue(ref(db, "AllJobs/" + uid + "/job/"),async(data) =>{
            if(data.val()){
            setTitle(data.val()[index].jobDetail.title)
            setDuration(data.val()[index].jobDetail.duration)
            setSalary(data.val()[index].jobDetail.salary)
            setDescription(data.val()[index].jobDetail.description)
            setSelect(0)
            setPreviousJobData( await data.val() ? [...data.val()] : false)
        }
        })
    }
    useEffect(() => {
        onValue(ref(db, "AllJobs/" + uid + "/job/"), async(data) =>{
            setPreviousJobData( await data.val() ? [...data.val()] : false)
        })
    },[select])
    useEffect(() => {
        console.log(PreviousJobData)
        if(PreviousJobData == false){
            setSelect(false)
        }
        else{
            setSelect(1)
        }
    },[PreviousJobData])
    return(
        <div className="previousJobMainDiv">
            {PreviousJobData ? PreviousJobData.map((item, index) => 
                <div onClick={() => index !== applyInd && deleteInd == false && setApplyInd(index)} className={applyInd == index && applyInd !== false ? "previousJobBox previousJobBox2" :"previousJobBox"}>
                <h1>{item?.jobDetail?.title.toUpperCase()}</h1>
                <div>
                    <h3>Duration: {item?.jobDetail?.duration} {item?.jobDetail?.duration == 1? "Day" : "Days"}</h3>
                    <h3>Budget: ${item?.jobDetail?.salary}</h3>
                    <h3>Student Applied: { item?.jobDetail?.apply ? Object.values(item?.jobDetail?.apply)?.length : 0}</h3>
                </div>
                {applyInd == index && applyInd !== false ? <h3>{item?.jobDetail?.description}</h3> : false}
                <div className="previousJobButtonDiv">
                    <button onClick={() => deleteJob(index)} className="postButton">Delete</button>
                    <button onClick={() => updateJob(index)} className="postButton">Update</button>
                    {applyInd == index && applyInd !== false && <button onClick={() => setApplyInd(false)} className="postButton">x</button>} 
                </div>
                </div>
            ) : false}
        </div>
    )
}
export default PreviousJob