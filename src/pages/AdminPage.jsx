import { useEffect, useState } from "react"
import AllFeatures from "../assets/AllFeatures"
import MainPage from "../assets/MainPage"
import Navbar from "../assets/Navbar"
import { onValue, ref } from "firebase/database"
import { db } from "../Firebase/firebase"
const AdminPage = ({name, closeCheck, setCloseCheck, status, select, setSelect, emptPage, setEmptPage}) => {
    const [ AllUsersData, setAllUsersData ] = useState([])
    let temp = []
    useEffect(() => {
        onValue(ref(db, "users/"), (data) => {
            // setAllUsersData([])
            temp = []
            // temp = [...AllUsersData]
            data.val() && Object.values(data.val()).map((item, index) => {
                item?.userDetail?.status !== "Admin" &&
                temp.push(item?.userDetail)
            })
            setAllUsersData(temp)
        })
    }, [select])

    return(
        <div className="AppMainDiv">
            <AllFeatures AllUsersData={AllUsersData} setAllUsersData={setAllUsersData} select={select} closeCheck={closeCheck} setCloseCheck={setCloseCheck} status={status} setSelect={setSelect}/>
            <div className={closeCheck == true ? "AppChildDiv MainPageDiv2" : "AppChildDiv"}>
                <Navbar closeCheck={closeCheck} name={name} setCloseCheck={setCloseCheck}/>
                <MainPage emptPage={emptPage} setEmptPage={setEmptPage} setSelect={setSelect} select={select} closeCheck={closeCheck} AllUsersData={AllUsersData} setAllUsersData={setAllUsersData} temp={temp}/>
            </div>
        </div>
    )
}
export default AdminPage