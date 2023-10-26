import { onValue, ref } from "firebase/database"
import { useEffect, useState } from "react"
import { db } from "./firebase"
import { useNavigate } from "react-router"
import ApplyInfo from "./ApplyInfo"

const  CompanyInfo = ({tempUid, setSelect}) => {
    const navigate = useNavigate()
    const [ PreviousJobData, setPreviousJobData ] = useState([])
    useEffect(() => {
        onValue(ref(db, "AllJobs/" + tempUid + "/job/"), async(data) =>{
            setPreviousJobData( await data.val() ? [...data.val()] : false)
        })
    },[])
    const changeLink = ({item, index}) => {
        // navigate(`/Conpany/${item?.jobDetail?.uid}/${index}`)
        let location = window?.location?.pathname?.split('/')
        if( location[3] == undefined || location[3] == "" ){
        if(location[3] != '' && location[window?.location?.pathname?.length-1] != "/")
            navigate(window?.location?.pathname + '/' + index)
        else 
            navigate(window?.location?.pathname + index)
            setSelect(4)
        }
        // window.location.pathname = `/Company/${item?.jobDetail?.uid}/${index}`
    }
    return(
        <>
        { window?.location?.pathname?.split('/')[3] == "" || 
        window?.location?.pathname?.split('/')[3] == undefined ?
        <div className="previousJobMainDiv">{
        PreviousJobData && PreviousJobData != [] ? PreviousJobData.map((item, index) => 
            <div className={"previousJobBox"}>
            <h1>{item?.jobDetail?.title.toUpperCase()}</h1>
            <div>
                <h3>Duration: {item?.jobDetail?.duration} {item?.jobDetail?.duration == 1? "Day" : "Days"}</h3>
                <h3>Budget: ${item?.jobDetail?.salary}</h3>
                <h3>Student Applied: { item?.jobDetail?.apply ? Object.values(item?.jobDetail?.apply)?.length : 0}</h3>
            </div>
            { item?.jobDetail?.apply && Object?.values(item?.jobDetail?.apply)?.length != 0 ? 
            <a onClick={() => changeLink({item, index})} style={{cursor: 'pointer', color: 'rgb(50, 50, 250)',
            borderBottom: '1px solid blue', fontWeight: 'bold', fontSize: '18px'}}> 
            See All Students Applied</a> : false}
            { !item?.jobDetail?.apply ? 
            <div className="previousJobButtonDiv"></div>
            : false}
            </div>
        ) : 
        <img width={"100%"} height={"99%"} style={{border: '1px solid rgb(220, 220, 220)', maxWidth: '1000px', margin:'auto', display: 'flex', alignSelf: 'center'}} src={'https://i.pinimg.com/originals/49/e5/8d/49e58d5922019b8ec4642a2e2b9291c2.png'}/>
            }</div>
        : 
        <ApplyInfo setSelect={setSelect}/>
        }
        </>
    )
}
export default CompanyInfo