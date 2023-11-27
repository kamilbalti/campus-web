import { onValue, ref, set } from "firebase/database"
import { db } from "../../Firebase/firebase"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import StudentReq from "../../pages/studentReq"
import ViewMore from "../../pages/ViewMore"
// import { Navigate, useNavigate } from "react-router"

const AllJob = ({ setSelect, select }) => {
    // const [ AllUsersData, setAllUsersData ] = useState([])
    const [emptPage, setEmptPage] = useState(false)
    const { userDetail } = useSelector(e => e)
    const uid = userDetail?.uid
    const [tempArr, setTempArr] = useState([])
    const [applyInd, setApplyInd] = useState(false)
    const [applyText, setApplyText] = useState("")
    const [check, setCheck] = useState(false)
    const [streq, setStReq] = useState(false)
    const [view, setView] = useState(false)
    // const navigate = useNavigate()
    let tempAllUsersData = []
    useEffect(() => {
        onValue(ref(db, "users/"), (data) => {
            let temp = [...tempAllUsersData]
            data.val() && Object.values(data.val()).map((item, index) => {
                item?.userDetail?.status !== "Admin" &&
                    temp.push(item?.userDetail)
            })
            tempAllUsersData = temp
        })
    }, [select])
    const tempApply = (indexes) => {
    onValue(ref(db, "AllJobs/"), (data) => {
        let tempUid = data.val() && Object?.values(data?.val())
        [indexes?.index]?.job[indexes?.index2]?.jobDetail?.uid
        set(ref(db, "AllJobs/" + tempUid + '/job/' + indexes?.index2 + '/jobDetail/apply/' + uid), {
            userDetail
        })
    })}
    const Apply = (indexes) => {
        if (userDetail?.edu && userDetail?.exp) {
            setStReq(false)
            tempApply(indexes)
            setSelect(1)
        }
        else {
            setStReq(true)
            // setTimeout(() => {
            //     setInterval(() => {
            //         if(!streq)
            //           tempApply(indexes)
            //     },100)
            // },1000)
        }
    }
    let descriptionPause = false;
    useEffect(() => {
        onValue(ref(db, "AllJobs/"), (data) => {
            setTempArr([])
            data?.val() && (Object?.values(data?.val()))?.map((item, index) => {
                let tempUid = Object.values(item?.job)[0]?.jobDetail?.uid
                let tempUser = tempAllUsersData.find((item) => item?.uid == tempUid)
                if (Object.values(item?.job)?.hasOwnProperty(0) &&
                    tempUser.block == false &&
                    tempUser.verify == true) {
                    item?.job?.map((item2, index2) => {
                        let temp = { ...item2 }
                        temp.indexes = { index, index2 }
                        if (!item2?.jobDetail?.apply?.hasOwnProperty(uid) &&
                            tempUser.block == false &&
                            tempUser.verify == true
                        ) {
                            setTempArr(tempArr && (tempArr => [...tempArr, (temp)]))
                        }
                        else {
                            if (tempArr.length == 0)
                                setEmptPage(true)
                            else
                                setEmptPage(false)
                        }
                    }
                    )
                }
                else
                    if (tempArr.length == 0)
                        setEmptPage(true)
                    else
                        setEmptPage(false)
            })
        })
    }, [])


    // useEffect(() => {
    //     setTimeout(() => {
    //         if(tempArr.length > 0 || tempArr == []) 
    //             setEmptPage(false)
    //         else 
    //             setEmptPage(true)
    // },100)
    useEffect(() => {
        if (tempArr.length == 0)
            setEmptPage(true)
        else
            setEmptPage(false)
    }, [tempArr])
    // },[])
    useEffect(() => {
        setApplyText("")
    }, [applyInd])
    useEffect(() => {
        let temp = applyText.trim().split(" ");
        if (temp.length > 49 && applyText)
            descriptionPause = true
        else descriptionPause = false
    }, [applyText])
    // useEffect(() => {
    //     if (streq)
    //         navigate('/requirement')
    //     //     setEmptPage(true)
    //     //     else setEmptPage(false)
    // }, [streq])
    return (
        <>
            {emptPage ?
                // <>
                <div className="emptPageDiv">
                    <img width={"100%"} height={"99%"} style={{ border: '1px solid rgb(220, 220, 220)', maxWidth: '1000px', margin: 'auto', display: 'flex', alignSelf: 'center' }} src={'https://i.pinimg.com/originals/49/e5/8d/49e58d5922019b8ec4642a2e2b9291c2.png'} />
                </div>
                :
                <div className="previousJobMainDiv">
                    <>
                        {view? <ViewMore data={view} setData={setView}/> : false}
                        {streq ? <StudentReq setShowDetail={setStReq} showDetail={streq} /> : false}
                    
                    </>
                    {
                        // streq ?
                        //     <Navigate to={'requirement'} /> :
                        // {
                        tempArr != []
                            ? tempArr?.map((item, index) =>
                                <div className={
                                    // applyInd == index && applyInd !== false ? "previousJobBox previousJobBox2" :
                                    "previousJobBox"} onClick={() => applyInd !== index && setApplyInd(index)}>
                                    <h1>{item?.jobDetail?.title}</h1>
                                    <div>
                                        <h3>Duration: {item?.jobDetail?.duration} {item?.jobDetail?.duration == 1 ? "Day" : "Days"}</h3>
                                        <h3>Budget: ${item?.jobDetail?.salary}</h3>
                                        <h3>
                                            Description: <i>{item?.jobDetail?.description?.split('').filter((item2, index2) => index2 <= 100).join('') + (item?.jobDetail?.description?.length >= 100 ? '...' : '') }</i>
                                        </h3>
                                    </div>
                                    <div style={{display: 'flex', gap: '15px'}}>
                                    <button className="postButton" onClick={() => Apply(item.indexes)}>Apply</button>
                                    {item?.jobDetail?.description?.length >= 100 ? <button className="postButton" 
                                    onClick={() => setView(item)}
                                    >Full View</button> : false}
                                    </div>
                                </div>
                            ) : false}
                </div>
            }
        </>
    )
}
export default AllJob