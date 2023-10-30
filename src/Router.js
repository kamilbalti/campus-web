import { Navigate, Route, BrowserRouter as Router, Routes, useNavigate} from "react-router-dom"
import Page from "./Page"
import SignUp from "./SignUp"
import SignIn from "./SignIn"
import { useDispatch, useSelector } from "react-redux"
import { onValue, ref } from "firebase/database"
import { db } from "./firebase"
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { setUserDetail } from "./Redux-Toolkit/BazarSlice"
import { useEffect, useState } from "react"
import { CirclesWithBar, ColorRing } from "react-loader-spinner"
import StudentReq from "./studentReq"
import UserInfo from "./UserInfo"
import AdminPage from "./AdminPage"
import ForgetPass from "./ForgetPass"
const MyRouter = () => {
    const auth = getAuth();
    const {userDetail} = useSelector(e => e)
    const [tempUser, setTempUser] = useState(userDetail)
    // let tempUser = false;
    const dispatch = useDispatch()
    const [temp, setTemp] = useState(true)
    let check = true
    useEffect(() => {
    setTimeout(() => { 
        onAuthStateChanged(auth, async (user) => {
            if(await user && userDetail){
                const uid = user.uid
                onValue(ref(db, "users/" + uid + "/userDetail"), (data) => {
                   if(data.val()?.status == 'Admin' || (!data.val()?.block && data.val()?.verify) ){
                        dispatch(setUserDetail(data.val()))
                        // setTempUser(data.val())
                        setTemp(false)}
                   if(data.val() && data.val()?.status != 'Admin')
                   if(data.val()?.block == true && userDetail != false && userDetail?.block != true && temp != 'block'){
                        dispatch(setUserDetail(false))
                        // setTempUser(false)
                        try{ 
                            signOut(auth)
                            alert("You are Blocked by the Admin") 
                            window.location = window.location
                        }
                        catch(error){
                            signOut(auth)
                            alert("You are Blocked by the Admin") 
                                window.location = window.location
                                console.log(error, ' Error')
                        }
                    }
                    else if(!data.val()?.verify && userDetail != false && userDetail?.verify != true && temp != 'verify'){
                        dispatch(setUserDetail(false))
                        // setTempUser(false)
                        try{ 
                            signOut(auth)
                            alert("You are not Verified Please Contact with the Admin") 
                            window.location = window.location
                        }
                        catch(error){
                            signOut(auth)
                            alert("You are not Verified Please Contact with the Admin") 
                            window.location = window.location
                            console.log(error)
                        }
                    }
                    })
            }
            else{
                if(userDetail != false)
                // setTempUser(false)
                dispatch(setUserDetail(false))
            }
        })
        // <Navigate to={'/'} />
        if( userDetail && userDetail.status != 'Student' && window.location.pathname == '/requirement')
        window.location.pathname = '/'
        // navigate('/')
    },500)
    },[])
    useEffect(() => {
            if(userDetail?.block && userDetail?.status != 'Admin')
                alert("You are Blocked by the Admin")
            else if( userDetail && userDetail !== 'loading' && !userDetail?.verify && userDetail?.status != 'Admin' )
                alert("You are not Verified Please Contact with the Admin")
    },[userDetail])
    return(
        <Router>
                {userDetail == false || (userDetail.status != 'Admin' && userDetail?.block == true) ?
                <Routes>
                    <Route path={'/'} element={<SignIn />} />
                    <Route path={'/signUp'} element={<SignUp />} />
                    <Route path={'/forget-password'} element={<ForgetPass />} />
                </Routes>
                : 
                userDetail == 'loading' ?
                <div style={{width: '100%', height: '100vh', display: 'flex', alignItems: "center", justifyContent: 'center'}} role="status">
                    <ColorRing visible={true} height="100" width="100" ariaLabel="blocks-loading" wrapperStyle={{}} wrapperClass="blocks-wrapper" colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}/>
                </div>
                :
                <Routes>
                    <Route path={'/'} element={<Page num={0}/>}/>
                    <Route path={'/requirement'} element={ userDetail && userDetail?.status == 'Student' ? <StudentReq/> : <Navigate to={'/'}/>} />
                    <Route path={'/Student/*'} element={userDetail?.status != 'Admin' ? <Navigate to={'/'} /> : <Page num={4}/>} />
                    <Route path={'/Company/*'} element={userDetail?.status != 'Admin' ? <Navigate to={'/'} /> : <Page num={4}/>}/>
                    <Route path={'*'} element={<Navigate to={'/'} />}/>
                </Routes>
                }
        </Router>
    )
}
export default MyRouter