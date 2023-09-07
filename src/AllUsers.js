import { onValue, ref, set } from "firebase/database"
import { useEffect, useState } from "react"
import { db } from "./firebase"
import { useSelector } from "react-redux"

const AllUser = () => {
    const [ AllUsersData, setAllUsersData ] = useState([])
    const [ applyInd, setApplyInd ] = useState(false)
    const [blockedUsers, setBlockedUsers] = useState([])
    const [ check, setCheck ] = useState(false)
    const {userDetail} = useSelector(e => e)
    const uid = userDetail.uid
    useEffect(() => {

        onValue(ref(db,"users/"),(data) => {
            let temp = [...AllUsersData]
            Object.values(data.val()).map((item,index) => item.userDetail.status !== "Admin" &&
            temp.push(item.userDetail) &&
            console.log(item.userDetail.name)
            )
            setAllUsersData(temp)
        })
            onValue(ref(db, uid + "/blockedUsers"), async(data) => {
                data.val() && await setBlockedUsers(data.val())
                console.log(data.val(), " testing")
        })
    },[])
    const block = (index) => {
        setCheck(true)
        let temp = blockedUsers ? [...blockedUsers] : [];
        // let temp = blockedUsers
        // (!temp && !temp.includes(AllUsersData[index])) ?
        temp.push(AllUsersData[index])
        //  : false 
        setBlockedUsers(temp)
        set(ref(db, uid + "/"),{
            blockedUsers: temp
        })
        setCheck(false)
    }
    const Unblock = (index) => {
        let temp = [...blockedUsers]
        temp.length == 1 ? temp = [] :
        temp = temp.filter((item2, index2) => item2 !== AllUsersData[index] )
        setBlockedUsers(temp)
            set((ref(db, uid + "/")),{
                blockedUsers: temp
            })
    }
    const verify = () => {

    }
    return(
        <div className="previousJobMainDiv">
            { AllUsersData !== [] && AllUsersData.map((item, index) =>
                <div onClick={() => index !== applyInd && check && setApplyInd(index)} className={applyInd == index && applyInd !== false ? "previousJobBox previousJobBox2" :"previousJobBox"}>
                    <h1>Name: {item?.name}</h1>
                    <h3>Status: {item?.status}</h3>
                    <h3>Email: {item?.email}</h3>
                    <h3>Id: {item?.uid}</h3>
                    <div className="previousJobButtonDiv">
                    { blockedUsers && blockedUsers.includes(item) ? 
                    <button onClick={() => Unblock(index)} className="postButton">Unblock</button>:
                    <button onClick={() => block(index)} className="postButton">Block</button>}
                    <button onClick={() => verify(index)} className="postButton">Verify</button>
                    {applyInd == index && applyInd !== false && <button onClick={() => setApplyInd(false)} className="postButton">x</button>} 
                </div>
                </div>
            )}
        </div>
    )
}
export default AllUser