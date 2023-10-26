import './MainPage/MainPage.css'
import { onValue, ref, set } from "firebase/database"
import { useEffect, useState } from "react"
import { db } from "./firebase"
import { useNavigate } from 'react-router'

const ApplyInfo = ({setSelect}) => {
    const [ AllUsersData, setAllUsersData ] = useState([])
    const [ apply, setApply ] = useState([])
    const [ check, setCheck ] = useState(false)
    const location = window.location.pathname.split('/')
    const [ emptPage, setEmptPage ] = useState(false)
    const navigate = useNavigate()
    let tempUserData = AllUsersData ? [...AllUsersData] : []
    let tempApply = [...apply]
    useEffect(() => {
        onValue(ref(db,"users/"),(data) => {
            data.val() && Object.values(data.val()).map((item,index) => item?.userDetail?.status !== "Admin" &&
                tempUserData.push(item?.userDetail)
            )
            setAllUsersData(tempUserData)
        })
        setTimeout(() => {
            onValue(ref(db, "AllJobs/" + location[2] + '/job/' + location[3] + '/jobDetail/apply/'), (data) => {
                // data.val() && console.log(Object?.values(data?.val())[0]?.userDetail, " Data oandfs")
                if( data?.val() && Object?.values(data?.val())?.length > 0){
                    // console.log(Object.values(data.val())[0])
                    Object?.values(data?.val())?.map((item, index) => {
                        // alert(item?.userDetail?.uid)
                        console.log(item?.userDetail?.uid, " ITEm uidf")
                        console.log(tempUserData, " All User Data")
                        let tempInd = tempUserData?.findIndex((item2) => item2?.uid == item?.userDetail?.uid)
                        // alert(tempInd)
                        let tempData = tempInd >= 0 ? tempUserData[tempInd] : item
                        tempApply.push(tempData)
                        setApply(tempApply)
                    })
                }
                else setEmptPage(true)
            })
        },500)
    },[])
    useEffect(() => {
        console.log(apply, " APPLY")
    },[apply])

    const block = (item) => {
        let uid = item?.uid
        setCheck(true)
        let index = AllUsersData.findIndex((item, index) => item.uid == uid)
        let tempUser = AllUsersData[index]
        tempUser.block = true
            set(ref(db, "users/" + tempUser?.uid + "/"),{
                userDetail: tempUser
            })
        setTimeout(() => {setCheck(false)},1000)
    }
    const Unblock = (item) => {
        let uid = item?.uid
        setCheck(true)
        let index = AllUsersData.findIndex((item, index) => item.uid == uid)
        let tempUser = AllUsersData[index];
        tempUser.block = false;
        set(ref(db, "users/" + tempUser?.uid + "/"),{
            userDetail: tempUser
        })
        setCheck(false)
}
    const verify = (item) => {
        let uid = item?.uid
        setCheck(true)
        let index = AllUsersData.findIndex((item, index) => item.uid == uid)
        let tempUser = AllUsersData[index];
            tempUser.verify = true
        set(ref(db, "users/" + tempUser?.uid + "/"),{
            userDetail: tempUser
        })
        setCheck(false)
    }
    const changeLink = (item) => {
        navigate(`/${item.status}/${item.uid}`)
        setSelect(4)
    }

    
    return(
            emptPage? 
        <img width={"100%"} height={"99%"} style={{border: '1px solid rgb(220, 220, 220)', maxWidth: '1000px', margin:'auto', display: 'flex', alignSelf: 'center'}} src={'https://i.pinimg.com/originals/49/e5/8d/49e58d5922019b8ec4642a2e2b9291c2.png'}/> : 
        <div className="previousJobMainDiv">
            <>
            {
                !!apply?.length && apply.map((item2, index2) => (
                <>
                    <div className={"previousJobBox"}>
                        <h1>Name: {item2?.name}</h1>
                        {/* <div> */}
                        {/* <h2>Title of job: {item2?.jobDetail?.title}</h2> */}
                        {/* <h2>Job No: {item2?.index + 1}</h2>
                        </div> */}
                        <div>
                            <h3>Email: {item2?.email}</h3>
                            <h3>Experience: {item2?.exp} {item2?.exp ? "Years" : "Year"}</h3>
                            <h3>Education: {item2?.edu}</h3>
                        </div>
                        { item2?.block == true ?
                            <button type="button" onClick={() => Unblock(item2)} className="postButton">Unblock</button>:
                            <button type="button" onClick={() => block(item2)} className="postButton">Block</button>}
                        {
                            item2?.verify == true ? false :
                            <button type="button" onClick={() => verify(item2)} className="postButton">Verify</button>
                        }
                    </div>
                </>
                )) }
            </>
        </div>
        )
}
export default ApplyInfo