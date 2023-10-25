import PostJob from "../postJob"
import React, { useEffect, useState } from "react"
import './MainPage.css'
import { useSelector } from "react-redux"
import PreviousJob from "../PreviousJob"
import AllJob from "../allJob"
import JobApplied from "../JobApplied"
import StudentApplied from "../StudentApplied"
import AllUser from "../AllUsers"
import UserInfo from "../UserInfo"
const MainPage = ({select, closeCheck, setSelect, emptPage, setEmptPage}) => {
    const [ title, setTitle ] = useState("")
    const [ duration, setDuration ] = useState("")
    const [ salary, setSalary ] = useState("")
    const [ description, setDescription ] = useState("")
    const [ tempInd, setTempInd ] = useState(false)
    const [ Applied, setApplied ] = useState([])
    const {userDetail} = useSelector(e => e)
    // console.log(emptPage, 'emptPage')
    return(
        <div className={
            // closeCheck == true ? "MainPageMainDiv MainPageDiv2" :
        "MainPageMainDiv"}>
            {userDetail?.status == "Student" ?
            (select == 0 ? 
            <AllJob select={select} emptPage={emptPage} setEmptPage={setEmptPage} setSelect={setSelect} />
            : (select == 1? <JobApplied setApplied={setApplied} Applied={Applied} closeCheck={closeCheck} 
            select={select} emptPage={emptPage} setEmptPage={setEmptPage} setSelect={setSelect}/> : <div></div>)) : (
            userDetail?.status == "Company" ? 
            (select == 0 ? 
            <PostJob tempInd={tempInd} setTempInd={setTempInd} emptPage={emptPage} setEmptPage={setEmptPage} setSelect={setSelect} title={title} setTitle={setTitle} duration={duration} setDuration={setDuration}
            salary={salary} setSalary={setSalary} description={description} setDescription={setDescription} /> 
            : (select == 1? <PreviousJob select={select} setTempInd={setTempInd} emptPage={emptPage} setEmptPage={setEmptPage} setSelect={setSelect} setTitle={setTitle} setDuration={setDuration} setSalary={setSalary} setDescription={setDescription}/> : 
            <StudentApplied emptPage={emptPage} setEmptPage={setEmptPage} select={select} setSelect={setSelect}/>)) :
            select == 0 ? 
            <AllUser select={select} emptPage={emptPage} setEmptPage={setEmptPage} setSelect={setSelect}/>
            : select == 1? 
            <AllUser select={select} emptPage={emptPage} setEmptPage={setEmptPage} setSelect={setSelect}/>
            : select == 2? 
            <AllUser select={select} emptPage={emptPage} setEmptPage={setEmptPage} setSelect={setSelect}/>
            : select == 3?
            <AllUser select={select} emptPage={emptPage} setEmptPage={setEmptPage} setSelect={setSelect}/>
            : 
            select == 4?
            <UserInfo setSelect={setSelect} select={select}/> : 
            <h1>Hello world</h1>
            )
            }
        </div>
    )
}
export default MainPage;