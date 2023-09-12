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
    const [ Applied, setApplied ] = useState([])
    const {userDetail} = useSelector(e => e)
    let appliedJob = [];
    return(
        <div className={closeCheck == true ? "MainPageMainDiv MainPageDiv2" :"MainPageMainDiv"}>
            {select == false && select !== 0 ? 
            <img width={"100%"} height={"99%"} src={'https://i.pinimg.com/originals/49/e5/8d/49e58d5922019b8ec4642a2e2b9291c2.png'}/> 
            : userDetail?.status == "Student" ?
            (select == 0 ? 
            <AllJob select={select} setSelect={setSelect} appliedJob={appliedJob}/>
            : (select == 1? <JobApplied setApplied={setApplied} Applied={Applied} closeCheck={closeCheck} 
            select={select} appliedJob={appliedJob} setSelect={setSelect}/> : <div></div>)) : (
            userDetail?.status == "Company" ? 
            (select == 0 ? 
            <PostJob tempInd={tempInd} setTempInd={setTempInd} setSelect={setSelect} title={title} setTitle={setTitle} duration={duration} setDuration={setDuration}
            salary={salary} setSalary={setSalary} description={description} setDescription={setDescription} /> 
            : (select == 1? <PreviousJob select={select} setTempInd={setTempInd} setSelect={setSelect} setTitle={setTitle} setDuration={setDuration} setSalary={setSalary} setDescription={setDescription}/> : 
            <StudentApplied setSelect={setSelect}/>)) :
            (select == 0 ? 
            <AllUser select={select} setSelect={setSelect}/>
            : (select == 1? 
            <AllUser select={select} setSelect={setSelect}/>
            : (select == 2? 
            <AllUser select={select} setSelect={setSelect}/>
            : 
            <AllUser select={select} setSelect={setSelect}/>
            )))
            )
            }
        </div>
    )
}
export default MainPage;