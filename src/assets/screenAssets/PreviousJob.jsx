import { onValue, ref, set } from "firebase/database"
import { useEffect, useState } from "react"
import { db } from "../../Firebase/firebase"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router"

const PreviousJob = ({ select, tempInd, setTempInd, setSelect, setTitle, setDuration, setSalary, setDescription, PreviousJobData, setPreviousJobData, emptPage, setEmptPage}) => {
    // const [emptPage, setEmptPage] = useState(false)
    // const [ AllUsersData, setAllUsersData ] = useState([])
    const {userDetail} = useSelector(e => e)
    const navigate = useNavigate()
    // const [applyInd, setApplyInd] = useState(false)
    // const [ PreviousJobData, setPreviousJobData ] = useState([])
    const uid = userDetail?.uid
    let deleteInd = false
    // let tempAllUsersData = []
    // useEffect(() => {
    //     onValue(ref(db, "users/"), (data) => {
    //         let temp = [...tempAllUsersData]
    //         data.val() && Object.values(data.val()).map((item, index) => {
    //             item?.userDetail?.status !== "Admin" &&
    //             temp.push(item?.userDetail)
    //         })
    //         tempAllUsersData = temp
    //     })
    // }, [select])
    // useEffect(() => {
    //     onValue(ref(db, "AllJobs/" + uid + "/job/"), async(data) =>{
    //         setPreviousJobData( await data.val() ? [...data.val()] : false)
    //     })
    // },[select])
    // useEffect(() => {
    //     setEmptPage(false)
    //     if(PreviousJobData != false || PreviousJobData.length != 0 && PreviousJobData.length !== undefined || PreviousJobData != []){
    //         setEmptPage(false)
    //     }
    //     else{
    //         setEmptPage(true)
    //         setSelect(1)
    //     }
    // },[PreviousJobData])
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
        let temp = index
        setTempInd(temp)
        if(temp || temp == 0){
        onValue(ref(db, "AllJobs/" + uid + "/job/"),async(data) =>{
            if(data.val()){
            setTitle(data.val()[index].jobDetail.title)
            setDuration(data.val()[index].jobDetail.duration)
            setSalary(data.val()[index].jobDetail.salary)
            setDescription(data.val()[index].jobDetail.description)
            setPreviousJobData( await data.val() ? [...data.val()] : false)
        }
    })
    setSelect(0)
}
}
    const changeLink = (index) => {
        navigate(`/Job/${index}`)
        setSelect(4)
    }
    if(window.location.pathname.split('/')[1] == 'Job')
    setSelect(2)
    return(
        emptPage? 
        <div className="emptPageDiv">
        <img width={"100%"} height={"99%"} style={{border: '1px solid rgb(220, 220, 220)', maxWidth: '1000px', margin:'auto', display: 'flex', alignSelf: 'center'}} src={'https://i.pinimg.com/originals/49/e5/8d/49e58d5922019b8ec4642a2e2b9291c2.png'}/></div> : 
        <div className="previousJobMainDiv">
            {PreviousJobData ? PreviousJobData.map((item, index) => 
                <div key={index}
                // onClick={() => index !== applyInd && deleteInd == false && setApplyInd(index)} 
                className={
                    // applyInd == index && applyInd !== false ? "previousJobBox previousJobBox2" :
                    "previousJobBox"
                    }>
                <h1>{item?.jobDetail?.title}</h1>
                <div>
                    <h3>Duration: {item?.jobDetail?.duration} {item?.jobDetail?.duration == 1? "Day" : "Days"}</h3>
                    <h3>Budget: ${item?.jobDetail?.salary}</h3>
                    <h3>Student Applied: { item?.jobDetail?.apply ? Object.values(item?.jobDetail?.apply)?.length : 0}</h3>
                </div>
                { item?.jobDetail?.apply && Object.values(item?.jobDetail?.apply)?.length ? 
                <a style={{cursor: 'pointer', color: 'rgb(50, 50, 250)', borderBottom: '1px solid blue', 
                fontWeight: 'bold', fontSize: '18px'}} onClick={() => changeLink(index)}>
                    See Student Applied
                    </a>
                    : false} 
                
                {/* {applyInd == index && applyInd !== false ? <h3>{item?.jobDetail?.description}</h3> : false} */}
                <div className="previousJobButtonDiv">
                    { item?.jobDetail?.apply && Object.values(item?.jobDetail?.apply)?.length != 0 ? false : 
                    <>
                        <button onClick={() => deleteJob(index)} className="postButton">Delete</button>
                        <button onClick={() => updateJob(index)} className="postButton">Update</button>
                    </>
                    }
                    {/* {applyInd == index && applyInd !== false && <button onClick={() => setApplyInd(false)} className="postButton">x</button>}  */}
                </div>
                </div>
            ) : false}
        </div>
    )
}
export default PreviousJob