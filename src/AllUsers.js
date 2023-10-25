import { onValue, ref, set } from "firebase/database"
import { useEffect, useState } from "react"
import { db } from "./firebase"
import { Navigate, useNavigate } from "react-router"
import { Link } from "react-router-dom"

const AllUser = ({select, setSelect}) => {
    const [emptPage, setEmptPage] = useState(false)
    const [ AllUsersData, setAllUsersData ] = useState([])
    const [ applyInd, setApplyInd ] = useState(false)
    const [ check, setCheck ] = useState(false)
    const navigate = useNavigate()
    const [ PreviousJobData, setPreviousJobData ] = useState([])
    const [ tempNewData, setTempNewData ] = useState(false)

    useEffect(() => {
        onValue(ref(db,"users/"),(data) => {
            let temp = AllUsersData ? [...AllUsersData] : []
            data.val() && Object.values(data.val()).map((item,index) => item?.userDetail?.status !== "Admin" &&
                temp.push(item?.userDetail)
            )
            setAllUsersData(temp)
        })
    },[])
        useEffect(() => {
            setEmptPage(false)
            onValue(ref(db,"users/"),(data) => {
            let temp = [...AllUsersData]
            data.val() && Object.values(data.val()).map((item,index) => item?.userDetail?.status !== "Admin" &&
            temp.push(item?.userDetail)
            )
        let index = temp.findIndex((item, index) =>  
        select == 1 ? item?.verify == false : select == 2 ? item?.verify == true : select == 3 ? item?.block == true: item == item)
        index == -1 ? setEmptPage(true) : setEmptPage(false)
        })
    },[select, check, AllUsersData])
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
    const unVerify = (item) => {
        let uid = item?.uid
        setCheck(true)
        let index = AllUsersData.findIndex((item, index) => item.uid == uid)
        let tempUser = AllUsersData[index]
        tempUser.verify = false
        set(ref(db, "users/" + tempUser?.uid + "/"),{
            userDetail: tempUser
        })

        setCheck(false)
    }
    const changeLink = (item) => {
        navigate(`/${item.status}/${item.uid}`)
        setSelect(4)
    }

    useEffect(() => {
        if(window?.location?.pathname == '/' && select == 4)
        setSelect(0)
        if(window.location.pathname.split('/')[1] == 'Student' || 
        window.location.pathname.split('/')[1] == 'Company' && select != 4)
        setSelect(4)
    })

    return(
        emptPage? 
        <img width={"100%"} height={"99%"} style={{border: '1px solid rgb(220, 220, 220)', maxWidth: '1000px', margin:'auto', display: 'flex', alignSelf: 'center'}} src={'https://i.pinimg.com/originals/49/e5/8d/49e58d5922019b8ec4642a2e2b9291c2.png'}/> : 
        <div className="previousJobMainDiv">
            { AllUsersData.filter((item, index) => (select == 0? item == item : 
            select == 1 ? item?.verify == false : select == 2 ? item?.verify == true : item?.block == true))?.map((item, index) =>
                <div onClick={() => index !== applyInd && check && setApplyInd(item.uid)} className={applyInd == index && applyInd !== false ? "previousJobBox previousJobBox2" :"previousJobBox"}>
                    <h1>Name: {item?.name}</h1>
                    <div>
                        <h3>Status: {item?.status}</h3>
                        <h3>Email: {item?.email}</h3>
                        <h3>Id: {item?.uid}</h3>
                    </div>
                        { item?.status == 'Student' ? <a style={{cursor: 'pointer', color: 'rgb(50, 50, 250)', borderBottom: '1px solid blue', fontWeight: 'bold', fontSize: '18px'}} onClick={() => changeLink(item)}>Jobs Applied</a> : 
                        <a style={{cursor: 'pointer', color: 'rgb(50, 50, 250)', borderBottom: '1px solid blue', fontWeight: 'bold', fontSize: '18px'}} onClick={() => changeLink(item)}>All Jobs</a>} 
                    <div className="previousJobButtonDiv">
                    { item.block == true ?
                    <button type="button" onClick={() => Unblock(item)} className="postButton">Unblock</button>:
                    <button type="button" onClick={() => block(item)} className="postButton">Block</button>}
                    {
                        item.verify == true ?
                        <button type="button" onClick={() => unVerify(item)} className="postButton">Unverify</button> :
                        <button type="button" onClick={() => verify(item)} className="postButton">Verify</button>
                    
                    }
                    {applyInd == index && applyInd !== false && <button type="button" onClick={() => setApplyInd(false)} className="postButton">x</button>} 
                </div>
                </div>
            )}
        </div>
    )
}
export default AllUser