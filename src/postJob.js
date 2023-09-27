import { onValue, ref, set } from "firebase/database"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { db } from "./firebase"

const PostJob = ({ tempInd, setTempInd, setSelect, title, setTitle, duration, setDuration, salary, setSalary, description, setDescription}) => {
    const {userDetail} = useSelector(e => e)
    // const [ index, setIndex ] = useState(0)
    let tempIndex = 0
    // let descriptionPause = false;

    const uid = userDetail?.uid
    useEffect(() => {
        let temp = description.trim().split(" ")
        // if( temp.length > 79 && description )
        // descriptionPause = true
        // else descriptionPause = false
        
        onValue(ref(db, "AllJobs/" + uid + "/job/"),async(data) =>{
            tempIndex = data?.val() ? data?.val()?.length : 0
            // console.log(data.val())  
            // await setIndex(
            //     (data?.val())? data.length : 0)
                // console.log(index, " Data Val length")
            })
        })
        const addJob = () => {
            onValue(ref(db, "AllJobs/" + uid + "/job/"),async(data) =>{
                
                // console.log(data.val()?.length)
                // setIndex( await data?.val()?.length)
                tempIndex = data.val()? data.val().length : 0
            })
            set(ref(db, "AllJobs/" + uid + "/job/" + tempIndex + "/jobDetail"), {
                title,
                duration,
                salary,
                description,
                uid
            })
        setTitle("")
        setDuration("")
        setSalary("")
        setDescription("")
        setSelect(1)
        // setIndex(index+1)
    }
    const updateJob = () => {
        let tempData = 
        {description,
        duration,
        // index: tempInd,
        salary,
        title,
        uid
    }
        set(ref(db, "AllJobs/" + uid + "/job/" + tempInd),{
            jobDetail: tempData,
        })        
        setTempInd(false)
        setTitle("")
        setDuration("")
        setSalary("")
        setDescription("")
        setSelect(1)
    }
    return(
        <div className="postJobDiv">
            <div className="postJobChildDiv">
            {/* <h2 className="postJobHead">Title Of Job :</h2> */}
            <input placeholder="Title Of Job :" value={title} onChange={(e) => setTitle(e.target.value)} className="postJobInput" />
            </div>
            <div className="postJobChildDiv">
            {/* <h2 className="postJobHead">Duration of Job : (In Days)</h2> */}
            <input placeholder="Duration of Job : " value={duration} onChange={(e) => e.target.value > 0 ? setDuration(e.target.value) : false} type="number" className="postJobInput" />
            </div>
            <div className="postJobChildDiv">
            {/* <h2 className="postJobHead">Salary : In Dollar($)</h2> */}
            <input placeholder="Salary :" type="number" value={salary} onChange={(e) => e.target.value >= 0 ? setSalary(e.target.value) : false} className="postJobInput" />
            </div>
            <div className="postJobChildDiv">
            {/* <h2 className="postJobHead">Description :</h2> */}
            <textarea placeholder="Description:" value={description} onChange={(e) => description.length <= e.target.value.length && (e.target.value)[e.target.value.length-2 ] == " " ? false : setDescription(e.target.value) } className="postJobText"/>
            </div>
            <div className="postJobChildDiv">
            {
            tempInd !== false ?
            <button className="postButton" onClick={updateJob}>Update Job</button> :
            <button className="postButton" onClick={addJob}>Add Job</button>
            }
            </div>
        </div>
    )
}
export default PostJob