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
const MyRouter = () => {
    const auth = getAuth();
    const {userDetail} = useSelector(e => e)
    const dispatch = useDispatch()
    const [temp, setTemp] = useState(true)
    let check = true
    // setTimeout(() => { 
        useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if(await user && userDetail){
                const uid = user.uid
                onValue(ref(db, "users/" + uid + "/userDetail"), (data) => {
                    if(data.val()?.block)
                        alert("You are Blocked by the Admin2")
                    else if( data.val() && data.val() !== 'loading' && !data.val()?.verify && data.val()?.status != 'Admin' )
                        alert("You are not Verified Please Contact with the Admin")
                   if(data.val()?.status == 'Admin' || (!data.val()?.block && data.val()?.verify) ){
                        dispatch(setUserDetail(data.val()))
                        setTemp(false)}
                   if(data.val() && data.val()?.status != 'Admin')
                   if(data.val()?.block == true && userDetail != false && userDetail?.block != true && temp != 'block'){
                        dispatch(setUserDetail(false))
                        try{ 
                            signOut(auth)
                        }
                        catch(error){
                                signOut(auth)
                                console.log(error, ' Error')
                        }
                    }
                    else if(!data.val()?.verify && userDetail != false && userDetail?.verify != true && temp != 'verify'){
                        dispatch(setUserDetail(false))
                        try{ 
                            signOut(auth)
                        }
                        catch(error){
                            signOut(auth)
                            console.log(error)
                        }
                    }
                    })
            }
            else{
                if(userDetail != false)
                dispatch(setUserDetail(false))
            }
        })
        // <Navigate to={'/'} />
        if( userDetail && userDetail.status != 'Student' && window.location.pathname == '/requirement')
        window.location.pathname = '/'
        // navigate('/')
    },[])
    return(
        <Router>
                {userDetail == false || (userDetail.status != 'Admin' && userDetail?.block == true) ?
                <Routes>
                    <Route path={'/'} element={<SignIn />} />
                    <Route path={'/signUp'} element={<SignUp />} />
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