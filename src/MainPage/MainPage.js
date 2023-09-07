import PostJob from "../postJob"
import React, { useEffect, useState } from "react"
import './MainPage.css'
import { useSelector } from "react-redux"
import PreviousJob from "../PreviousJob"
import AllJob from "../allJob"
import JobApplied from "../JobApplied"
import StudentApplied from "../StudentApplied"
import AllUser from "../AllUsers"
const MainPage = ({select, closeCheck, setSelect}) => {
    const [ title, setTitle ] = useState("")
    const [ duration, setDuration ] = useState(1)
    const [ salary, setSalary ] = useState(10)
    const [ description, setDescription ] = useState("")
    const [ tempInd, setTempInd ] = useState(false)
    const {userDetail} = useSelector(e => e)
    let appliedJob = [];
    return(
        <div className={closeCheck? "MainPageMainDiv MainPageDiv2" :"MainPageMainDiv"}>
            {userDetail.status == "Student" ? 
            (select == 0 ? 
            <AllJob setSelect={setSelect} appliedJob={appliedJob}/>
            : (select == 1? <JobApplied appliedJob={appliedJob}/> : <div></div>)) : (
            userDetail.status == "Company" ? 
            (select == 0 ? 
            <PostJob tempInd={tempInd} setTempInd={setTempInd} setSelect={setSelect} title={title} setTitle={setTitle} duration={duration} setDuration={setDuration}
            salary={salary} setSalary={setSalary} description={description} setDescription={setDescription} /> 
            : (select == 1? <PreviousJob setTempInd={setTempInd} setSelect={setSelect} setTitle={setTitle} setDuration={setDuration} setSalary={setSalary} setDescription={setDescription}/> : 
            <StudentApplied />)) : 
            (select == 0 ? 
            <AllUser />
            : (select == 1? <div></div> : <div></div>)))
            }
        </div>
    )
}
export default MainPage;