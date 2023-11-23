import { useEffect, useState } from "react"
import AllFeatures from "../assets/AllFeatures"
import MainPage from "../assets/MainPage"
import Navbar from "../assets/Navbar"
import { onValue, ref } from "firebase/database"
import { db } from "../Firebase/firebase"
import { useSelector } from "react-redux"
const CompanyPage = ({name, closeCheck, setCloseCheck, status, select, setSelect, emptPage, setEmptPage}) => {
    const { userDetail } = useSelector((e) => e)
    const [ PreviousJobData, setPreviousJobData ] = useState([])
    const uid = userDetail?.uid
    let tempAllUsersData = []
    useEffect(() => {
        onValue(ref(db, "users/"), (data) => {
            let temp = [...tempAllUsersData]
            data.val() && Object.values(data.val()).map((item, index) => {
                item?.userDetail?.status !== "Admin" &&
                temp.push(item?.userDetail)
            })
            tempAllUsersData = temp
        })
        onValue(ref(db, "AllJobs/" + uid + "/job/"), async(data) =>{
            setPreviousJobData( await data.val() ? [...data.val()] : false)
        })
    }, [])
    useEffect(() => {
        setEmptPage(false)
        if(PreviousJobData != false || PreviousJobData.length != 0 && PreviousJobData.length !== undefined || PreviousJobData != []){
            setEmptPage(false)
        }
        else{
            setEmptPage(true)
            setSelect(0)
        }
    },[PreviousJobData])
    return(
        <div className="AppMainDiv">
            <AllFeatures select={select} closeCheck={closeCheck} setCloseCheck={setCloseCheck} status={status} setSelect={setSelect}/>
            <div className={closeCheck == true ? "AppChildDiv MainPageDiv2" : "AppChildDiv"}>
                <Navbar closeCheck={closeCheck} name={name} setCloseCheck={setCloseCheck}/>
                <MainPage emptPage={emptPage} setEmptPage={setEmptPage} setSelect={setSelect} select={select} closeCheck={closeCheck} PreviousJobData={PreviousJobData} setPreviousJobData={setPreviousJobData}/>
            </div>
        </div>
    )
}
export default CompanyPage