import { onValue, ref, set } from "firebase/database"
import { db } from "./firebase"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

const AllJob = ({setSelect, appliedJob}) => {
    const {userDetail} = useSelector(e => e)
    const uid = userDetail.uid
    const [ tempArr, setTempArr ] = useState([])
    const [ applyInd, setApplyInd ] = useState(false)
    const [ applyText, setApplyText ] = useState("")
    const Apply = (index) => {
        let tempInd = index;
        let temp = 0;
        let tempUid;
        onValue(ref(db, "AllJobs/"),(data) =>{
            (Object.values(data.val()).map((item, index2) => {
            // console.log(item.length, " Index")
            if(tempInd - item.length >= 0){
            tempInd = tempInd - item.length
            temp += 1
            // console.log(temp)
        }
    }))
    tempUid = Object.values(data.val())[temp][tempInd].jobDetail.uid
    // console.log(tempUid + " myNew tempINd")
        })
        // set(ref(db, "AllJobs/" + tempUid + "/" + tempInd + "/jobDetail"),{

        // })
        set(ref(db, "AllJobs/" + tempUid + "/" + tempInd + "/jobDetail/" + "/apply/" + uid ), {
            userDetail: userDetail,
            description: applyText
        })
        setSelect(1)
    }
    let descriptionPause = false;
    useEffect(() => {
        onValue(ref(db, "AllJobs/"),(data) =>{
            (Object.values(data.val())).map((item, index) => 
            item.map((item2, index2) => setTempArr(tempArr => [...tempArr,(item2)]))
            )
        })
    },[])
    useEffect(() => {
        setApplyText("")
    },[applyInd])
    useEffect(() => {
        let temp = applyText.trim().split(" ");
        if( temp.length > 49 && applyText )
        descriptionPause = true
        else descriptionPause = false
    })
    useEffect(() => {
        appliedJob.map((item, index) => 
        setTempArr(tempArr.filter((item2, index2) => item2 !== item))
    )
    })
    return(
        <div className="previousJobMainDiv">
            {tempArr !== [] ? tempArr.map((item, index) => 
                <div className={applyInd == index && applyInd !== false ? "previousJobBox previousJobBox2" :"previousJobBox"} onClick={() => applyInd !== index && setApplyInd(index)}>
                <h1>{item?.jobDetail?.title}</h1>
                <h3>Duration: {item?.jobDetail?.duration} {item?.jobDetail?.duration == 1? "Day" : "Days"}</h3>
                <h3>Budget: ${item?.jobDetail?.salary}</h3>
                {applyInd == index && applyInd !== false ?
                <>
                <h3>
                    Description: <i>{item.jobDetail.description}</i>
                </h3>
                <textarea placeholder="The description must be between 30 - 50 words" value={applyText} onChange={(e) => descriptionPause && applyText.length <= e.target.value.length && (e.target.value)[e.target.value.length-2 ] == " " ? false : setApplyText(e.target.value) } className="postJobText"/>
                <div className="previousJobButtonDiv">
                <button className="postButton" onClick={() => Apply(index)}>Apply</button>
                <button className="postButton" onClick={() => setApplyInd(false)}>x</button>
                </div>
                </>
                : false}
                </div>
            ) : false}
        </div>
    )
}
export default AllJob