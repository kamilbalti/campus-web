import { useNavigate } from "react-router"
import AdminPage from "./AdminPage"
import CompanyInfo from "./CompanyInfo"
import StudentInfo from "./StudentInfo"
import { useEffect } from "react"

const UserInfo = ({setSelect, select}) => {
    const navigate = useNavigate()
    const location = window.location.pathname.split('/')
    const tempStatus = location[1]
    // alert(window.location.pathname == '/')
    useEffect(() => {
        if(window?.location?.pathname == '/' && select == 4)
        setSelect(0)
        if(tempStatus == 'Student' || tempStatus == 'Company' && select != 4)
        setSelect(4)
    })
    return(
        tempStatus == 'Student'?
        <StudentInfo uid={location[2]}/> : tempStatus == 'Company' ?
        <CompanyInfo tempUid={location[2]}/> : false
    )
}
export default UserInfo