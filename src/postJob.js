import { onValue, ref, set } from "firebase/database"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { db } from "./firebase"

const PostJob = ({ tempInd, setTempInd, setSelect, title, setTitle, duration, setDuration, salary, setSalary, description, setDescription}) => {
    const {userDetail} = useSelector(e => e)
    const [ index, setIndex ] = useState(0)
    let descriptionPause = false;
    
    const uid = userDetail?.uid
    useEffect(() => {
        let temp = description.trim().split(" ")
        if( temp.length > 79 && description )
        descriptionPause = true
        else descriptionPause = false
        onValue(ref(db, "AllJobs/" + uid),async(data) =>{
            // alert(data.val()[data.val().length-1].index + 1)
            await setIndex(
                (data?.val())? 
                data?.val()[data?.val()?.length-1]?.jobDetail?.index+1: 0)
                // console.log(index, " Data Val length")
            })
            
        })
    const addJob = () => {
        onValue(ref(db, "AllJobs/" + uid),async(data) =>{
            // alert(data.val()[data.val().length-1].index + 1)
            await setIndex(
            (data?.val())? 
            data?.val()[data?.val()?.length-1]?.jobDetail?.index+1: 0)
            // console.log(index, " Data Val length")
        })
        set(ref(db, "AllJobs/" + uid + "/" + index + "/jobDetail"), {
            title,
            duration,
            salary,
            description,
            index,
            uid
        })
        setTitle("")
        setDuration(1)
        setSalary(10)
        setDescription("")
        setSelect(1)
        // setIndex(index+1)
    }
    const updateJob = () => {
        let tempData= 
        {description,
        duration,
        index: tempInd,
        salary,
        title,
        uid
    }
        set(ref(db, "AllJobs/" + uid + "/" + tempInd),{
            jobDetail: tempData,
        })        
        setTempInd(false)
        setTitle("")
        setDuration(1)
        setSalary(10)
        setDescription("")
        setSelect(1)
    }
    return(
        <div className="postJobDiv">
            <div className="postJobChildDiv">
            <h2 className="postJobHead">Title Of Job :</h2>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="postJobInput" />
            </div>
            <div className="postJobChildDiv">
            <h2 className="postJobHead">Duration of Job : (In Days)</h2>
            <input value={duration} onChange={(e) => e.target.value > 0 ? setDuration(e.target.value) : false} type="number" className="postJobInput" />
            </div>
            <div className="postJobChildDiv">
            <h2 className="postJobHead">Salary : In Dollar($)</h2>
            <input type="number" value={salary} onChange={(e) => e.target.value >= 10 ? setSalary(e.target.value) : false} className="postJobInput" />
            </div>
            <div className="postJobChildDiv">
            <h2 className="postJobHead">Description :</h2>
            <textarea placeholder="The description must be between 40 - 80 words" value={description} onChange={(e) => descriptionPause && description.length <= e.target.value.length && (e.target.value)[e.target.value.length-2 ] == " " ? false : setDescription(e.target.value) } className="postJobText"/>
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