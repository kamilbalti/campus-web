import { onValue, ref } from "firebase/database"
import { useSelector } from "react-redux"
import { db } from "./firebase"
import { useEffect, useState } from "react"

const StudentApplied = () => {
    const {userDetail} = useSelector(e => e)
    const [applyInd, setApplyInd] = useState(false)
    const [ PreviousJobData, setPreviousJobData ] = useState([])
    const uid = userDetail.uid
    useEffect(() => {
        onValue(ref(db, "AllJobs/" + uid),(data) =>{
            setPreviousJobData(data.val())
            console.log(Object.values(data.val()[0].jobDetail.apply)[0].description, "Previous Job Data")  
    })
    },[])
    return(
<div className="previousJobMainDiv">
            {PreviousJobData ? PreviousJobData.map((item2, index2) =>
            item2?.jobDetail?.apply && Object.values(item2?.jobDetail?.apply).map((item, index) => 
            <div onClick={() => index2 !== applyInd && setApplyInd(index2)} className={ applyInd == index2 && applyInd !== false ? "previousJobBox previousJobBox2" :"previousJobBox"}>
            <h3>Name: {item.userDetail.name}</h3>
            <h3>Email: {item.userDetail.email}</h3>
            <h3>Experience: {item?.userDetail?.exp} {item?.userDetail?.exp? "Years" : "Year"}</h3>
            <h3>Education: {item?.userDetail?.edu}</h3>
            <h3><b>Description: </b><i>
            { applyInd !== index ? item.description.split("").filter((item, index) => 
            index <= 110).map((item2, index2) => <>{item2}</>
            ) : item.description
            } {item.description.length > 110 && applyInd !== index ? "..." : ""} </i></h3>
            </div>
            )) : false}
        </div>    )
}
export default StudentApplied