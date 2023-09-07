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
import { useState } from "react"
const MyRouter = () => {
    const auth = getAuth();
    const {userDetail} = useSelector(e => e)
    const dispatch = useDispatch()
    useState(()=> {
        onAuthStateChanged(auth, (user) => {
            if(user){
                const uid = user.uid
                onValue(ref(db, "users/" + uid + "/userDetail"), (data) => {
                    dispatch(setUserDetail(data.val()))
                })
            }
        })
    })
    return(
        <Router>
                {userDetail == false ?
                <Routes>
                    <Route path={'/'} element={<SignIn />} />
                    <Route path={'/signUp'} element={<SignUp />} />
                </Routes>
                : 
                <Page /> 
                }
        </Router>
    )
}
export default MyRouter