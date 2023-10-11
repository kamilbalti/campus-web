import { onValue, ref, set } from "firebase/database"
import { db } from "./firebase"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import StudentReq from "./studentReq"
import { Navigate } from "react-router"

const AllJob = ({setSelect, appliedJob, select}) => {
    const [emptPage, setEmptPage] = useState(false)
    const {userDetail} = useSelector(e => e)
    const uid = userDetail?.uid
    const [ tempArr, setTempArr ] = useState([])
    const [ applyInd, setApplyInd ] = useState(false)
    const [ applyText, setApplyText ] = useState("")
    const [check, setCheck] = useState(false)
    const [streq, setStReq] = useState(false)
    const [ emptCheck, setEmptCheck ] = useState([])
    useEffect(() => {setSelect(0)},[select])
    const Apply = (indexes) => {
        if(userDetail?.edu && userDetail?.exp)
        {
            setStReq(false)
        onValue(ref(db, "AllJobs/"),(data) =>{
            let tempUid = Object?.values(data?.val())
            [indexes?.index]?.job[indexes?.index2]?.jobDetail?.uid
            // console.log(tempUid)
            set(ref(db, "AllJobs/" + tempUid + '/job/' + indexes?.index2 + '/jobDetail/apply/' + uid),{
                    userDetail
            })
        })
        setSelect(1)
    }
    else
    setStReq(true) 
}
    let descriptionPause = false;
    useEffect(() => {
        let tempEmpt = []
        onValue(ref(db, "AllJobs/"),(data) =>{
            data?.val() && (Object?.values(data?.val()))?.map((item, index) => 
            item?.job?.map((item2, index2) => {
                let temp = {...item2}
                temp.indexes = {index, index2}
            if(!item2?.jobDetail?.apply?.hasOwnProperty(uid)){
                setTempArr((tempArr => [...tempArr,(temp)]))
                tempEmpt.push('true')
            }
            else{
                    tempEmpt.push('false')
                }
            }
            ))
                !data.val() || data.val() == [] && setSelect(false)
            })
            setEmptCheck(tempEmpt)
    },[select])


    useEffect(() => {
        setTimeout(() => {
            if(emptCheck.includes('true')){
            setEmptPage(false)
        }
        else{
            setEmptPage(true)
        }
    },300)
    },[emptCheck])
    useEffect(() => {
        setApplyText("")
    },[applyInd])
    useEffect(() => {
        let temp = applyText.trim().split(" ");
        if( temp.length > 49 && applyText )
        descriptionPause = true
        else descriptionPause = false
    })
    return(
        emptPage? 
        <img width={"100%"} height={"99%"} style={{border: '1px solid rgb(220, 220, 220)', maxWidth: '1000px', margin:'auto', display: 'flex', alignSelf: 'center'}} src={'https://i.pinimg.com/originals/49/e5/8d/49e58d5922019b8ec4642a2e2b9291c2.png'}/> : 
        <div className="previousJobMainDiv">
            {streq ? 
            <Navigate to={'requirement'}/> : 
            tempArr != []
             ? tempArr.map((item, index) => 
                <div className={applyInd == index && applyInd !== false ? "previousJobBox previousJobBox2" :"previousJobBox"} onClick={() => applyInd !== index && setApplyInd(index)}>
                <h1>{item?.jobDetail?.title?.toUpperCase()}</h1>
                <div>
                <h3>Duration: {item?.jobDetail?.duration} {item?.jobDetail?.duration == 1? "Day" : "Days"}</h3>
                <h3>Budget: ${item?.jobDetail?.salary}</h3>
                <h3>
                    Description: <i>{item?.jobDetail?.description}</i>
                </h3>
                </div>
                <button className="postButton" onClick={() => Apply(item.indexes)}>Apply</button>
                </div>
            ) : setSelect(false)}
        </div>
    )
}
export default AllJob