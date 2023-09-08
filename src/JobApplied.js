import { onValue, ref } from "firebase/database"
import { db } from "./firebase"
import { useEffect, useState } from "react"

const JobApplied = ({appliedJob, setSelect}) => {
    const [ applyInd, setApplyInd ] = useState(false)
    // const [ appliedJob, setAppliedJob ] = useState() 
    // let appliedJob = []
    onValue(ref(db, "AllJobs/"),(data) =>{
        data.val() && Object.values(data.val()).map((item, index) => item.map((item, index2) => item.jobDetail.apply && appliedJob.push(item.jobDetail)))
        !data.val() && setSelect(false) 
    })
    // useEffect(() => {
    //     // setSelect(false)
    //     console.log(appliedJob)
    //     // appliedJob == [] || !appliedJob && setSelect(false)
    // },[])

    return(
        <div className="previousJobMainDiv">
        {appliedJob !== [] ? appliedJob.map((item, index) => 
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