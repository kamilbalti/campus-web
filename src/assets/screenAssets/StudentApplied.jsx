import { onValue, ref } from "firebase/database"
import { useSelector } from "react-redux"
import { db } from "../../Firebase/firebase"
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
                        let tempUser = tempAllUsersData.find((item3) => item3?.uid == tempUid)
                        if(tempUser?.block == false && tempUser?.verify == true)
                            tempData.push(item2)
                        })
                })
            })
            setPreviousJobData(tempData)
                if(tempData?.length == 0)
                    setEmptPage(true)
                else if(tempData?.length != 0)
                    setEmptPage(false)
            setCheck(true)

        } catch (error) {

        }
    },[userDetail, select])

    return (
        <>
        {    emptPage?
        <div className="emptPageDiv">
        <img width={"100%"} height={"99%"} style={{border: '1px solid rgb(220, 220, 220)', maxWidth: '1000px', margin:'auto', display: 'flex', alignSelf: 'center'}} src={'https://i.pinimg.com/originals/49/e5/8d/49e58d5922019b8ec4642a2e2b9291c2.png'}/></div> : 
        <div className="previousJobMainDiv">
            <>
            {
                !!PreviousJobData?.length && PreviousJobData.map((item2, index2) => (
                <>
                    <div key={index2} onClick={() => index2 !== applyInd && setApplyInd(index2)} className={"previousJobBox"}>
                        <h1>Name: {item2?.userDetail?.name}</h1>
                        <div>
                            <h3>Email: {item2?.userDetail?.email}</h3>
                            <h3>Experience: {item2?.userDetail?.exp} {item2?.userDetail?.exp ? "Years" : "Year"}</h3>
                            <h3>Education: {item2?.userDetail?.edu}</h3>
                        </div>
                        <button style={{opacity: '0'}}></button>
                    </div>
                </>
                )) }
            </>
        </div>}
        </>
        )
}
export default StudentApplied