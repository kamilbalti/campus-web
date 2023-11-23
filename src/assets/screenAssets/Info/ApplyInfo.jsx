import '../../MainPage/style.css'
import { onValue, ref, set } from "firebase/database"
import { useEffect, useState } from "react"
import { db } from "../../../Firebase/firebase"
import { useNavigate } from 'react-router'

const ApplyInfo = ({setSelect, select}) => {
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
        // setTimeout(() => {
            onValue(ref(db, "AllJobs/" + location[2] + '/job/' + location[3] + '/jobDetail/apply/'), (data) => {
                if( data?.val() && Object?.values(data?.val())?.length > 0){
                    Object?.values(data?.val())?.map((item, index) => {
                        let tempInd = tempUserData?.findIndex((item2) => item2?.uid == item?.userDetail?.uid)
                        let tempData = tempInd >= 0 ? tempUserData[tempInd] : item
                        tempApply.push(tempData)
                        setApply(tempApply)
                    })
                }
                else setEmptPage(true)
            })
        // },500)
    },[select])

    const block = (item) => {
        let uid = item?.uid
        if(!check){
        setCheck(true)
        let index = AllUsersData.findIndex((item, index) => item.uid == uid)
        let tempUser = AllUsersData[index]
        tempUser.block = true
            set(ref(db, "users/" + tempUser?.uid + "/"),{
                userDetail: tempUser
            })
        }
        setTimeout(() => {setCheck(false)},100)
    }
    const Unblock = (item) => {
        let uid = item?.uid
        if(!check){
        setCheck(true)
        let index = AllUsersData.findIndex((item, index) => item.uid == uid)
        let tempUser = AllUsersData[index];
        tempUser.block = false;
        set(ref(db, "users/" + tempUser?.uid + "/"),{
            userDetail: tempUser
        })
    }
    setTimeout(() => {setCheck(false)},100)
}
    const verify = (item) => {
        let uid = item?.uid
        if(!check){
        setCheck(true)
        let index = AllUsersData.findIndex((item, index) => item.uid == uid)
        let tempUser = AllUsersData[index];
            tempUser.verify = true
        set(ref(db, "users/" + tempUser?.uid + "/"),{
            userDetail: tempUser
        })
    }
    setTimeout(() => {setCheck(false)},100)
}
    const changeLink = (item) => {
        navigate(`/${item.status}/${item.uid}`)
        setSelect(4)
    }

    
    return(
            emptPage? 
        <div className="emptPageDiv">
        <img width={"100%"} height={"99%"} style={{border: '1px solid rgb(220, 220, 220)', maxWidth: '1000px', margin:'auto', display: 'flex', alignSelf: 'center'}} src={'https://i.pinimg.com/originals/49/e5/8d/49e58d5922019b8ec4642a2e2b9291c2.png'}/></div> : 
        <div className="previousJobMainDiv">
            <>
            {
                !!apply?.length && apply.map((item2, index2) => (
                <>
                    <div key={index2} className={"previousJobBox"}>
                        <h1>Name: {item2?.name}</h1>
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