import { onValue, ref, set } from "firebase/database"
import { useEffect, useState } from "react"
import { db } from "./firebase"

const AllUser = ({select, setSelect}) => {
    const [ AllUsersData, setAllUsersData ] = useState([])
    const [ applyInd, setApplyInd ] = useState(false)
    const [ check, setCheck ] = useState(false)
    useEffect(() => {
        onValue(ref(db,"users/"),(data) => {
            let temp = [...AllUsersData]
            data.val() && Object.values(data.val()).map((item,index) => item?.userDetail?.status !== "Admin" &&
            temp.push(item?.userDetail)
            )
            setAllUsersData(temp)
        })
    },[])
    useEffect(() => {
        onValue(ref(db,"users/"),(data) => {
            let temp = [...AllUsersData]
            data.val() && Object.values(data.val()).map((item,index) => item?.userDetail?.status !== "Admin" &&
            temp.push(item?.userDetail)
            )
        let index = temp.findIndex((item, index) =>  
        select == 1 ? item?.verify == false : select == 2 ? item?.verify == true : select == 3 ? item?.block == true: true)
        index == -1 ? setSelect(false) : setSelect(select)
        })
    },[select, check, AllUsersData])
    const block = (uid) => {
        setCheck(true)
        let index = AllUsersData.findIndex((item, index) => item.uid == uid)
        let tempUser = AllUsersData[index]
        tempUser.block = true
        set(ref(db, "users/" + tempUser?.uid + "/"),{
            userDetail: tempUser
        })
        setCheck(false)
    }
    const Unblock = (uid) => {
        setCheck(true)
        let index = AllUsersData.findIndex((item, index) => item.uid == uid)
        let tempUser = AllUsersData[index];
        tempUser.block = false;
        set((ref(db, "users/" + tempUser?.uid + "/")),{
                userDetail: tempUser
            })
        setCheck(false)
    }
    const verify = (uid) => {
        setCheck(true)
        let index = AllUsersData.findIndex((item, index) => item.uid == uid)
        let tempUser = AllUsersData[index];
            tempUser.verify = true
        set(ref(db, "users/" + tempUser?.uid + "/"),{
            userDetail: tempUser
        })
        setCheck(false)
    }
    const unVerify = (uid) => {
        setCheck(true)
        let index = AllUsersData.findIndex((item, index) => item.uid == uid)
        let tempUser = AllUsersData[index]
        tempUser.verify = false
        set(ref(db, "users/" + tempUser?.uid + "/"),{
            userDetail: tempUser
        })
        setCheck(false)
    }
    return(
        <div className="previousJobMainDiv">
            { AllUsersData.filter((item, index) => (select == 0? item == item : 
            select == 1 ? item?.verify == false : select == 2 ? item?.verify == true : item?.block == true))?.map((item, index) =>
                <div onClick={() => index !== applyInd && check && setApplyInd(item.uid)} className={applyInd == index && applyInd !== false ? "previousJobBox previousJobBox2" :"previousJobBox"}>
                    <h1>Name: {item?.name}</h1>
                    <h3>Status: {item?.status}</h3>
                    <h3>Email: {item?.email}</h3>
                    <h3>Id: {item?.uid}</h3>
                    <div className="previousJobButtonDiv">
                    { item.block == true ? 
                    <button type="button" onClick={() => Unblock(item.uid)} className="postButton">Unblock</button>:
                    <button type="button" onClick={() => block(item.uid)} className="postButton">Block</button>}
                    {
                        item.verify == true ?
                        <button type="button" onClick={() => unVerify(item.uid)} className="postButton">Unverify</button> :
                        <button type="button" onClick={() => verify(item.uid)} className="postButton">Verify</button>
                    
                    }
                    {applyInd == index && applyInd !== false && <button type="button" onClick={() => setApplyInd(false)} className="postButton">x</button>} 
                </div>
                </div>
            )}
        </div>
    )
}
export default AllUser