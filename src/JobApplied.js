import { onValue, ref } from "firebase/database"
import { db } from "./firebase"
import { useEffect, useState } from "react"

const JobApplied = ({ closeCheck, select, appliedJob, setSelect}) => {
    const [ applyInd, setApplyInd ] = useState(false)
    const [ tempApplied, setTempApplied ] = useState() 
    // let appliedJob = []
    useEffect(() => {
    onValue(ref(db, "AllJobs/"),(data) =>{
        data.val() && 
        Object.values(data.val()).map((item, index) =>{
            // console.log(Object.values(item.job[1].jobDetail.apply)[0])
        item.job.map((item2, index2) =>{ 
        item2.jobDetail.apply && appliedJob.push(item2.jobDetail)
        // alert(Object.values(item?.jobDetail?.apply)[0]?.title)
        // console.log(item2?.jobDetail)
    }
        )
    })
    // setSelect(1)
    })
},[select, closeCheck])
    useEffect(() => {
        setTempApplied([...appliedJob])
    },[appliedJob])

    return(
        <div className="previousJobMainDiv">
        {tempApplied !== [] ? tempApplied?.map((item, index) => 
            <div onClick={() => setApplyInd(index)} className={applyInd == index && applyInd !== false ? "previousJobBox previousJobBox2" :"previousJobBox"}>
            <h1>{item?.title}</h1>
            <h3>Duration: {item?.duration} {item?.duration == 1? "Day" : "Days"}</h3>
            <h3>Budget: ${item?.salary}</h3>
            <h3><b>Description: </b><i>
                { applyInd !== index ? Object.values(item.apply)[0].description.split("").filter((item, index) => 
                index <= 110).map((item2, index2) => <>{item2}</>
            ) : Object.values(item.apply)[0].description
        } {Object.values(item.apply)[0].description.length > 110 && applyInd !== index ? "..." : ""} </i></h3>
            </div>
        ) : false}
    </div>
    )
}
export default JobApplied