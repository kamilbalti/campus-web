import { onValue, ref } from "firebase/database"
import { useEffect, useState } from "react"
import { db } from "./firebase"

const StudentInfo = ({uid}) => {
    const [appliedJob, setAppliedJob] = useState([])
    let temp = [...appliedJob]
    useEffect(() => {
        onValue(ref(db, "AllJobs/"), (data) => {
            data.val() &&
                Object.values(data.val()).map((item, index) => {
                    item && item?.job && item?.job[0] && item?.job?.map((item2, index2) => {
                        if (item2?.jobDetail?.apply?.hasOwnProperty(uid)) {
                            temp?.push(item2?.jobDetail)
                            setAppliedJob(temp)
                        }
                    }
                    )
                })
        })
    }, [])
    return(
        appliedJob.length != 0 && appliedJob ? 
        <div className="previousJobMainDiv">
        {appliedJob?.map((item, index) =>
            <div key={index} className={"previousJobBox"}>
                <h1>{item?.title}</h1>
                <div>
                    <h3>Duration: {item?.duration} {item?.duration == 1 ? "Day" : "Days"}</h3>
                    <h3>Budget: ${item?.salary}</h3>
                </div>
                <button style={{ opacity: 0 }}>test</button>
            </div>
        )}
    </div>
        : 
        <div className="emptPageDiv">
            <img width={"100%"} height={"99%"} style={{border: '1px solid rgb(220, 220, 220)', maxWidth: '1000px', margin:'auto', display: 'flex', alignSelf: 'center'}} src={'https://i.pinimg.com/originals/49/e5/8d/49e58d5922019b8ec4642a2e2b9291c2.png'}/>
        </div>

    )
}
export default StudentInfo