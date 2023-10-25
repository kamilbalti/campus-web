import { onValue, ref } from "firebase/database"
import { useEffect, useState } from "react"
import { db } from "./firebase"

const  CompanyInfo = ({tempUid}) => {
    const [ PreviousJobData, setPreviousJobData ] = useState([])
    useEffect(() => {
        onValue(ref(db, "AllJobs/" + tempUid + "/job/"), async(data) =>{
            setPreviousJobData( await data.val() ? [...data.val()] : false)
        })
    },[])
    return(
        <div className="previousJobMainDiv">{
        PreviousJobData && PreviousJobData != [] ? PreviousJobData.map((item, index) => 
            <div 
            // onClick={() => index !== applyInd && deleteInd == false && setApplyInd(index)} 
            className={
                // applyInd == index && applyInd !== false ? "previousJobBox previousJobBox2" :
                "previousJobBox"
                }>
            <h1>{item?.jobDetail?.title.toUpperCase()}</h1>
            <div>
                <h3>Duration: {item?.jobDetail?.duration} {item?.jobDetail?.duration == 1? "Day" : "Days"}</h3>
                <h3>Budget: ${item?.jobDetail?.salary}</h3>
                <h3>Student Applied: { item?.jobDetail?.apply ? Object.values(item?.jobDetail?.apply)?.length : 0}</h3>
            </div>
            {/* {applyInd == index && applyInd !== false ? <h3>{item?.jobDetail?.description}</h3> : false} */}
            <div className="previousJobButtonDiv">
                {/* { item?.jobDetail?.apply && Object.values(item?.jobDetail?.apply)?.length != 0 ? false : 
                <>
                    <button onClick={() => deleteJob(index)} className="postButton">Delete</button>
                    <button onClick={() => updateJob(index)} className="postButton">Update</button>
                </>
                } */}
                {/* {applyInd == index && applyInd !== false && <button onClick={() => setApplyInd(false)} className="postButton">x</button>}  */}
            </div>
            </div>
        ) : 
        <img width={"100%"} height={"99%"} style={{border: '1px solid rgb(220, 220, 220)', maxWidth: '1000px', margin:'auto', display: 'flex', alignSelf: 'center'}} src={'https://i.pinimg.com/originals/49/e5/8d/49e58d5922019b8ec4642a2e2b9291c2.png'}/>
            }</div>
    )
}
export default CompanyInfo