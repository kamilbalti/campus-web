import PostJob from "../../assets/screenAssets/postJob"
import React, { useEffect, useState } from "react"
import './style.css'
import { useSelector } from "react-redux"
import PreviousJob from "../../assets/screenAssets/PreviousJob"
import AllJob from "../../assets/screenAssets/allJob"
import JobApplied from "../../assets/screenAssets/JobApplied"
import StudentApplied from "../../assets/screenAssets/StudentApplied"
import AllUser from "../../assets/screenAssets/AllUsers"
import UserInfo from "../screenAssets/Info/UserInfo"
import JobCompApply from "../../assets/screenAssets/JobCompApply"
const MainPage = ({select, temp, closeCheck, setSelect, emptPage, setEmptPage, PreviousJobData, setPreviousJobData, AllUsersData, setAllUsersData }) => {
    const [ title, setTitle ] = useState("")
    const [ duration, setDuration ] = useState("")
    const [ salary, setSalary ] = useState("")
    const [ description, setDescription ] = useState("")
    const [ tempInd, setTempInd ] = useState(false)
    const [ Applied, setApplied ] = useState([])
    const {userDetail} = useSelector(e => e)
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
            : (select == 1? <PreviousJob AllUsersData={AllUsersData} select={select} setTempInd={setTempInd} emptPage={emptPage} setEmptPage={setEmptPage} setSelect={setSelect} setTitle={setTitle} setDuration={setDuration} setSalary={setSalary} setDescription={setDescription} PreviousJobData={PreviousJobData} setPreviousJobData={setPreviousJobData} /> : 
            <JobCompApply emptPage={emptPage} setEmptPage={setEmptPage} select={select} setSelect={setSelect}/>)) :
            select == 0 ? 
            <AllUser AllUsersData={AllUsersData} temp={temp} setAllUsersData={setAllUsersData} select={select} emptPage={emptPage} setEmptPage={setEmptPage} setSelect={setSelect}/>
            : select == 1? 
            <AllUser AllUsersData={AllUsersData} temp={temp} setAllUsersData={setAllUsersData} select={select} emptPage={emptPage} setEmptPage={setEmptPage} setSelect={setSelect}/>
            : select == 2? 
            <AllUser AllUsersData={AllUsersData} temp={temp} setAllUsersData={setAllUsersData} select={select} emptPage={emptPage} setEmptPage={setEmptPage} setSelect={setSelect}/>
            : select == 3?
            <AllUser AllUsersData={AllUsersData} temp={temp} setAllUsersData={setAllUsersData} select={select} emptPage={emptPage} setEmptPage={setEmptPage} setSelect={setSelect}/>
            : 
            select == 4?
            <UserInfo setSelect={setSelect} select={select}/> : 
            // <h1>Hello world</h1>
            false
            )
            }
        </div>
    )
}
export default MainPage;