import { onValue, ref } from "firebase/database"
import { useSelector } from "react-redux"
import { db } from "./firebase"
import { useEffect, useState } from "react"

const StudentApplied = ({ setSelect, select}) => {
    let tempAllUsersData = []
    const [emptPage, setEmptPage] = useState(false)
    const { userDetail } = useSelector(e => e)
    const [applyInd, setApplyInd] = useState(false)
    const [PreviousJobData, setPreviousJobData] = useState([])
    const [loading, setLoading] = useState(true)
    const [check, setCheck] = useState()
    let tempData = []
    // const [ data, setData ] = useState(false)
    const uid = userDetail?.uid
    let temp = []
    useEffect(() => {
        onValue(ref(db,"users/"),(data) => {
            let tempUsers = [...tempAllUsersData]
            data.val() && Object.values(data.val()).map((item,index) => {item?.userDetail?.status !== "Admin" &&
                tempUsers.push(item?.userDetail)
            })
                tempAllUsersData = tempUsers    
        })
    },[userDetail, select])
    useEffect(() => {
        try {
            onValue(ref(db, "AllJobs/" + uid + "/job/"), (data) => {
               return data.val()?.map((item, index) => {
                   if (item?.jobDetail?.apply)
                   temp.push(item)
                    item?.jobDetail?.apply && Object.values(item?.jobDetail?.apply)?.map((item2, index2) => {
                        let tempUid = item2?.userDetail?.uid
                        // console.log(item2?.userDetail?.uid, ' ITem2')
                        let tempUser = tempAllUsersData.find((item3) => item3?.uid == tempUid)
                        if(tempUser?.block == false && tempUser?.verify == true)
                            tempData.push(item2)
                        })
                })
            })
            setPreviousJobData(tempData)
            // setTimeout(() => {
                if(tempData?.length == 0)
                    setEmptPage(true)
                else if(tempData?.length != 0)
                    setEmptPage(false)
            // },500)
            // console.log("useeffect called")
            setCheck(true)
            // setLoading(false)

        } catch (error) {

        }
        // return ()=>sub
        // console.log(check)
    },[userDetail, select])

    // useEffect(() => {
    //     // setTimeout(() => {
    //     // console.log(PreviousJobData == [], " JO Data2 ")
    //     if(PreviousJobData?.length == 0)
    //         setEmptPage(true)
    //     // else 
    //     else if(PreviousJobData?.length != 0)
    //         setEmptPage(false)
    //     else setEmptPage(false)
    // // },500)
    // },[PreviousJobData])
    // }, [check])
    // console.log(check, temp,PreviousJobData)
    //     if(PreviousJobData != temp) {
            // console.log(PreviousJobData, " new Data")
    //     }
    // useEffect(() =>{
    //     console.log(temp, ' TeMPData')
    // }, [temp])
    return (
            emptPage? 
        <img width={"100%"} height={"99%"} style={{border: '1px solid rgb(220, 220, 220)', maxWidth: '1000px', margin:'auto', display: 'flex', alignSelf: 'center'}} src={'https://i.pinimg.com/originals/49/e5/8d/49e58d5922019b8ec4642a2e2b9291c2.png'}/> : 
        <div className="previousJobMainDiv">
            <>
            {
                !!PreviousJobData?.length && PreviousJobData.map((item2, index2) => (
                <>
                    <div onClick={() => index2 !== applyInd && setApplyInd(index2)} className={"previousJobBox"}>
                        <h1>Name: {item2?.userDetail?.name}</h1>
                        {/* <div> */}
                        {/* <h2>Title of job: {item2?.jobDetail?.title}</h2> */}
                        {/* <h2>Job No: {item2?.userDetail?.index + 1}</h2>
                        </div> */}
                        <div>
                            <h3>Email: {item2?.userDetail?.email}</h3>
                            <h3>Experience: {item2?.userDetail?.exp} {item2?.userDetail?.exp ? "Years" : "Year"}</h3>
                            <h3>Education: {item2?.userDetail?.edu}</h3>
                        </div>
                    </div>
                </>
                )) }
            </>
        </div>
        )
}
export default StudentApplied