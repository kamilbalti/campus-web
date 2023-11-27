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
        setTimeout(() => {
            onValue(ref(db, "AllJobs/" + uid + "/job/"), async(data) =>{
                let tempData = data.val()
                tempData.map((item, index) => 
                item?.jobDetail?.apply && Object.values(item.jobDetail.apply)?.map((item2, index2) => {
                    let tempInd = tempAllUsersData.findIndex((item3) => (item3?.uid == item2.userDetail.uid))
                    // if(tempInd != -1)
                    // alert(tempInd)
                    console.log(item2.userDetail, 'userDetail', tempAllUsersData[tempInd], 'secondDetail')
                    // console.log(tempAllUsersData[tempInd])
                    item2.userDetail = tempInd != -1 ? tempAllUsersData[tempInd] : []
                })
                )
                console.log(tempData)
                setPreviousJobData( tempData ? tempData : [])
            })
        },1000)
        // catch(err){
        //     alert(err)
        // }
    }, [])
    useEffect(() => {    
        console.log(PreviousJobData, "Dayta")
    },[PreviousJobData])
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