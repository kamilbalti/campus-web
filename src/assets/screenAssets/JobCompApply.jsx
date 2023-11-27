import '../MainPage/style.css'
import { onValue, ref, set } from "firebase/database"
import { useEffect, useState } from "react"
import { db } from "../../Firebase/firebase"
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'

const JobCompApply = ({setSelect}) => {
    const { userDetail } = useSelector(e => e)
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
            onValue(ref(db, "AllJobs/" + userDetail?.uid + '/job/' + location[2] + '/jobDetail/apply/'), (data) => {
                if( data?.val() && Object?.values(data?.val())?.length > 0){
                    Object?.values(data?.val())?.map((item, index) => {
                        let tempInd = tempUserData?.findIndex((item2) => item2?.uid == item?.userDetail?.uid)
                        let tempData = tempInd >= 0 ? tempUserData[tempInd] : item
                        if(!tempData?.block && tempData?.verify){
                        tempApply.push(tempData)
                    }
                })
                if(tempApply.length>0){
                    setApply(tempApply)
                }
                else setEmptPage(true)
                }
            })
        },500)
    },[])
    if(window.location.pathname == '/')
    setSelect(0)

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
                        <div></div>
                    </div>
                </>
                )) }
            </>
        </div>
        )
}
export default JobCompApply