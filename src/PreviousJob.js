import { onValue, ref, set } from "firebase/database"
import { useEffect, useState } from "react"
import { db } from "./firebase"
import { useSelector } from "react-redux"

const PreviousJob = ({tempInd, setTempInd, setSelect, setTitle, setDuration, setSalary, setDescription}) => {
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
        set(ref(db, "AllJobs/" + uid + "/"),{})
        temp.map((item, index) => 
        set(ref(db, "AllJobs/" + uid + "/" + index),{
            jobDetail: item.jobDetail,
        })
        )
        // console.log(temp)
        setPreviousJobData(temp)
        deleteInd = false
    }
    const updateJob = (index) => {
        setTempInd(index)
        // alert(index)
        onValue(ref(db, "AllJobs/" + uid),(data) =>{
            setTitle(data.val()[index].jobDetail.title)
            setDuration(data.val()[index].jobDetail.duration)
            setSalary(data.val()[index].jobDetail.salary)
            setDescription(data.val()[index].jobDetail.description)
            // console.log(data.val()[index].jobDetail.description)
            setPreviousJobData(data.val())
            setSelect(0)
        })
    }
    useEffect(() => {
        onValue(ref(db, "AllJobs/" + uid),(data) =>{
            setPreviousJobData(data.val())
            !data.val() && setSelect(false)
            // console.log(PreviousJobData, "Previous Job Data")  
    })
    },[])
    return(
        <div className="previousJobMainDiv">
            {PreviousJobData ? PreviousJobData.map((item, index) => 
                <div onClick={() => index !== applyInd && deleteInd == false && setApplyInd(index)} className={applyInd == index && applyInd !== false ? "previousJobBox previousJobBox2" :"previousJobBox"}>
                <h1>{item?.jobDetail?.title}</h1>
                <h3>Duration: {item?.jobDetail?.duration} {item?.jobDetail?.duration == 1? "Day" : "Days"}</h3>
                <h3>Budget: ${item?.jobDetail?.salary}</h3>
                <h3>Student Applied: </h3>
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