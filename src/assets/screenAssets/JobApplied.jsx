import { onValue, ref } from "firebase/database"
import { db } from "../../Firebase/firebase"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

const JobApplied = ({ closeCheck, select, setSelect, prevApplied, setPrevApplied }) => {
    const [emptPage, setEmptPage] = useState(false)
    const [applyInd, setApplyInd] = useState(false)
    const [tempApplied, setTempApplied] = useState([])
    const { userDetail } = useSelector(e => e)
    const uid = userDetail?.uid
    // let appliedJob = [];
    let tempAllUsersData = []
    useEffect(() => {
        onValue(ref(db,"users/"),(data) => {
            let temp = [...tempAllUsersData]
            data.val() && Object.values(data.val()).map((item,index) => {item?.userDetail?.status !== "Admin" &&
                temp.push(item?.userDetail)
            })
                tempAllUsersData = temp    
        })
    },[select])
    useEffect(() => {
        onValue(ref(db, "AllJobs/"), (data) => {
            let appliedJob = [...tempApplied]
        // if(data?.val() && Object?.values(data?.val()) && Object.values(data?.val()) != [] || Object?.values(data?.val())?.length != 0)
            data.val() &&
                Object.values(data.val()).map((item, index) => {
                    let tempUid = Object.values(item?.job)[0]?.jobDetail?.uid
                    let tempUser = tempAllUsersData.find((item) => item?.uid == tempUid)        
                    item && item?.job && item?.job?.map((item2, index2) => {
                        if (item2?.jobDetail?.apply?.hasOwnProperty(uid) && tempUser?.block == false && tempUser?.verify == true) {
                            appliedJob?.push(item2?.jobDetail)
                            setTempApplied(appliedJob)
                        }
                    }
                    )
                })
            if (appliedJob.length == 0)
                setEmptPage(true)
            else
            setEmptPage(false)
        })
    }, [])


    return (
        <>
        {emptPage?
        <div className="emptPageDiv">
        <img width={"100%"} height={"99%"} style={{border: '1px solid rgb(220, 220, 220)', maxWidth: '1000px', margin:'auto', display: 'flex', alignSelf: 'center'}} src={'https://i.pinimg.com/originals/49/e5/8d/49e58d5922019b8ec4642a2e2b9291c2.png'}/></div>:
        <div className="previousJobMainDiv">
            { tempApplied != [] && tempApplied.length != 0?
            <>
             {tempApplied?.map((item, index) =>
                <div key={index} onClick={() => setApplyInd(index)} className={"previousJobBox"}>
                    <h1>{item?.title}</h1>
                    <div>
                        <h3>Duration: {item?.duration} {item?.duration == 1 ? "Day/month" : "Days/month"}</h3>
                        <h3>Budget: ${item?.salary}</h3>
                    </div>
                    <button style={{ opacity: 0 }}>test</button>
                </div>
            )} 
                </>
            : false}
            </div>
        }
        </>
        // : false 
    )
}
export default JobApplied