// import {} from "react"
import { Navigate, Route, BrowserRouter as Router, Routes} from "react-router-dom"
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
const MyRouter = () => {
    const auth = getAuth();
    const {userDetail} = useSelector(e => e)
    const dispatch = useDispatch()
    let check = true
    useEffect(()=> {
        onAuthStateChanged(auth, async (user) => {
            if(await user){
                const uid = user.uid
                onValue(ref(db, "users/" + uid + "/userDetail"), (data) => {
                   data.val() && 
                   data.val()?.block == true ?
                   dispatch(setUserDetail(false))
                :
                   dispatch(setUserDetail(data.val())) 
                })
            }
            else{
                dispatch(setUserDetail(false))
            }
        })
    },[])
    let location = window && window.location.pathname
    return(
        <Router>
                {userDetail == false ?
                <Routes>
                    <Route path={'/'} element={<SignIn />} />
                    <Route path={'/signUp'} element={<SignUp />} />
                </Routes>
                : 
                userDetail == 'loading' ?
                <div style={{width: '100%', height: '100vh', display: 'flex', alignItems: "center", justifyContent: 'center'}} role="status">
                    <ColorRing visible={true} height="100" width="100" ariaLabel="blocks-loading" wrapperStyle={{}} wrapperClass="blocks-wrapper" colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}/>
                    {/* <CirclesWithBar height="100" width="100" color="#4fa94d" wrapperStyle={{}} wrapperClass="" visible={true} outerCircleColor="" innerCircleColor="" barColor="" ariaLabel='circles-with-bar-loading'/> */}
                </div>
                :
                <Routes>
                    <Route path={'/'} element={<Page />}/>
                    <Route path={location} element={<Navigate to={'/'} />}/>
                    {/* <Page />  */}
                </Routes>
                }
        </Router>
    )
}
export default MyRouter