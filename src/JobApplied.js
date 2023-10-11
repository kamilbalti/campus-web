import { onValue, ref } from "firebase/database"
import { db } from "./firebase"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

const JobApplied = ({ closeCheck, select, appliedJob, setSelect, prevApplied, setPrevApplied }) => {
    const [emptPage, setEmptPage] = useState(false)
    const [applyInd, setApplyInd] = useState(false)
    // const [ tempArr, setTempArr ] = useState(false)
    const [tempApplied, setTempApplied] = useState([])
    // let appliedJob = []
    const { userDetail } = useSelector(e => e)
    const uid = userDetail?.uid
    useEffect(() => {
        onValue(ref(db, "AllJobs/"), (data) => {
            data.val() &&
                Object.values(data.val()).map((item, index) => {
                    // console.log(Object.values(item.job[1].jobDetail.apply)[0])
                    item && item?.job && item?.job[0] && item?.job?.map((item2, index2) => {
                        if (item2?.jobDetail?.apply?.hasOwnProperty(uid)) {
                            appliedJob?.push(item2?.jobDetail)
                        }
                    }
                    )
                })
            // console.log(appliedJob)
            if (appliedJob.length == 0)
                setEmptPage(true)
            else
            setEmptPage(false)
        })
    }, [select, closeCheck])
    useEffect(() => {
        setTempApplied([...appliedJob])
    }, [appliedJob])
    // useEffect(() => {
    //     onValue(ref(db, "AllJobs/"),(data) =>{
    //         data.val() && (Object.values(data.val())).map((item, index) => 
    //         item?.job?.map((item2, index2) => setTempArr(tempArr => [...tempArr,(item2)]))
    //         )
    //         !data.val() && setSelect(false)
    //     })
    // },[])
    // console.log(prevApplied)
    // console.log(appliedJob)
    // if(appliedJob == [])
    // setSelect(false)
    // useEffect(() => {
    //     tempArr?.map((item2, index2) => 
    //     appliedJob = appliedJob.filter((item, index) =>
    //     item?.uid !== item2.jobDetail.uid))
    //     // setPrevApplied(tempApplied)
    // },[tempArr])

    return (
        emptPage? 
        <img width={"100%"} height={"99%"} style={{border: '1px solid rgb(220, 220, 220)', maxWidth: '1000px', margin:'auto', display: 'flex', alignSelf: 'center'}} src={'https://i.pinimg.com/originals/49/e5/8d/49e58d5922019b8ec4642a2e2b9291c2.png'}/> : 
        <div className="previousJobMainDiv">
            {appliedJob !== [] ? appliedJob?.map((item, index) =>
                <div onClick={() => setApplyInd(index)} className={"previousJobBox"}>
                    <h1>{item?.title.toUpperCase()}</h1>
                    <div>
                        <h3>Duration: {item?.duration} {item?.duration == 1 ? "Day" : "Days"}</h3>
                        <h3>Budget: ${item?.salary}</h3>
                    </div>
                    <button style={{ opacity: 0 }}>test</button>
                    {/* <h3><b>Description: </b><i>
                { applyInd !== index  && item.apply[uid]?.description.length >=1 ? item.apply[uid]?.description?.split("").filter((item, index) => 
                index <= 110).map((item2, index2) => <>{item2}</>
            ) : item.apply[uid]?.description
        } {item.apply[uid]?.description.length > 110 && applyInd !== index ? "..." : ""} </i></h3> */}
                </div>
            ) : false}
        </div>
    )
}
export default JobApplied