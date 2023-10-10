import { onValue, ref } from "firebase/database"
import { useSelector } from "react-redux"
import { db } from "./firebase"
import { useEffect, useState } from "react"

const StudentApplied = ({ setSelect }) => {
    const { userDetail } = useSelector(e => e)
    const [applyInd, setApplyInd] = useState(false)
    const [PreviousJobData, setPreviousJobData] = useState([])
    const [loading, setLoading] = useState(true)
    const [check, setCheck] = useState()
    // const [ data, setData ] = useState(false)
    const uid = userDetail?.uid
    let temp = [...PreviousJobData]
    useEffect(() => {

        try {
            onValue(ref(db, "AllJobs/" + uid + "/job/"), (data) => {
               return data.val()?.map((item, index) => {
                    if (item?.jobDetail?.apply)
                        temp.push(item)
                })
            })
            setPreviousJobData(temp)
            if(temp.length == 0)
            setSelect(false)
            // console.log("useeffect called")
            setCheck(true)
            // setLoading(false)

        } catch (error) {

        }
        // return ()=>sub
        // console.log(check)
    }, [])

    // useEffect(() => {
    // }, [check])
    // console.log(check, temp,PreviousJobData)
    //     if(PreviousJobData != temp) {
    //         console.log(PreviousJobData, " new Data")
    //     }
    // }, [temp])
    return (
        <div className="previousJobMainDiv">
            {!!temp?.length && temp.map((item2, index2) =>
                // item2?.jobDetail?.apply == undefined ? setSelect(false) : 
                item2?.jobDetail?.apply && Object.values(item2?.jobDetail?.apply).map((item, index) =>
                    <div onClick={() => index2 !== applyInd && setApplyInd(index2)} className={"previousJobBox"}>
                        <h1>Name: {item?.userDetail?.name}</h1>
                        <div>
                            <h3>Email: {item?.userDetail?.email}</h3>
                            <h3>Experience: {item?.userDetail?.exp} {item?.userDetail?.exp ? "Years" : "Year"}</h3>
                            <h3>Education: {item?.userDetail?.edu}</h3>
                        </div>
                        <button></button>
                        {/* <h3><b>Description: </b><i>
            { applyInd !== index ? item.description.split("").filter((item, index) => 
            index <= 110).map((item2, index2) => <>{item2}</>
            ) : item.description
            } {item.description.length > 110 && applyInd !== index ? "..." : ""} </i></h3> */}
                    </div>
                )) }
        </div>)
}
export default StudentApplied