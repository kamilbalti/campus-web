// import {} from "react"
import { Route, BrowserRouter as Router, Routes} from "react-router-dom"
import Page from "./Page"
import SignUp from "./SignUp"
import SignIn from "./SignIn"
import { useDispatch, useSelector } from "react-redux"
import { onValue, ref } from "firebase/database"
import { db } from "./firebase"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { setUserDetail } from "./Redux-Toolkit/BazarSlice"
import { useEffect, useState } from "react"
const MyRouter = () => {
    const auth = getAuth();
    const {userDetail} = useSelector(e => e)
    const dispatch = useDispatch()
    useState(()=> {
        onAuthStateChanged(auth, (user) => {
            setUserDetail('loading')
            if(user){
                const uid = user.uid
                onValue(ref(db, "users/" + uid + "/userDetail"), (data) => {
                    dispatch(setUserDetail(data.val()))
                })
            }
        })
    })
    // useEffect(() => {
    //         // if(userDetail == "loading")
    //         setTimeout(() =>{
    //             setUserDetail(false)
    //         },2000)
    // },[])
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
                <div class="spinner-border" style={{width: '3rem', height: '3rem'}} role="status">
                  <span class="sr-only">Loading...</span>
                </div>
                </div>
                :
                <Page /> 
                }
        </Router>
    )
}
export default MyRouter