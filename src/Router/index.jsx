import { Navigate, Route, BrowserRouter as Router, Routes, useNavigate } from "react-router-dom"
import Page from "../assets/Page"
import SignUp from "../auth/SignUp"
import SignIn from "../auth/SignIn"
import { useDispatch, useSelector } from "react-redux"
import { off, onValue, ref } from "firebase/database"
import { db } from "../Firebase/firebase"
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { setCheck, setUnSub, setUserDetail } from "../Redux-Toolkit/BazarSlice"
import { useEffect, useState } from "react"
import { CirclesWithBar, ColorRing } from "react-loader-spinner"
import ForgetPass from "../auth/ForgetPass"
import { ToastContainer, toast } from "react-toastify"
const MyRouter = () => {
    const auth = getAuth();
    const { userDetail, unSub, check } = useSelector(e => e)
    const [tempUser, setTempUser] = useState(userDetail)
    const dispatch = useDispatch()
    let inter;
    let mydata = ''
    
    const notify = (error) => toast(error);

    useEffect(() => {
        if ((userDetail == 'loading' || userDetail )
         && !window.location.pathname.includes('logIn')
        )
                onAuthStateChanged(auth, async (user) => {
                    const uid = user?.uid
                    if (user) {
                        mydata = onValue(ref(db, "users/" + uid + "/userDetail"), (data) => {
 
                            if( data.val() && data.val()?.status != 'Admin' && (data.val()?.block || !data.val()?.verify) ){
                                if(!unSub)
                                if(data.val()?.block){
                                    signOut(auth)
                                    dispatch(setUserDetail(false))
                                    dispatch(setUnSub(true))
                                    mydata()
                                }
                                else if(!data.val()?.verify && userDetail?.status != 'Admin'){
                                    notify('You are not approved please contact with admin')
                                    signOut(auth)
                                    dispatch(setUserDetail(false))
                                    dispatch(setUnSub(true))
                                    mydata()
                                }}
                                else if(data.val())
                                    dispatch(setUserDetail(data.val()))
                        })
                    }
                    else {
                        dispatch(setUserDetail(false))
                    }
                }
                )
                else{
                    dispatch(setUserDetail(false))
                }
    }, [check])
    return (
        <Router>
            {userDetail == false
             ?
                <Routes>
                    <Route path={'/logIn'} element={<SignIn />} />
                    <Route path={'/signUp'} element={<SignUp />} />
                    <Route path={'/forget-password'} element={<ForgetPass />} />
                    <Route path={'*'} element={<Navigate to={'/logIn'}/>}/>
                </Routes>
                :
                (userDetail == 'loading' 
                ?
                    <div style={{ width: '100%', height: '100vh', display: 'flex', alignItems: "center", justifyContent: 'center' }} role="status">
                        <ColorRing visible={true} height="100" width="100" ariaLabel="blocks-loading" wrapperStyle={{}} wrapperClass="blocks-wrapper" colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']} />
                    </div>
                    // )
                    :
                    <Routes>
                        <Route path={'/'} element={<Page num={0} />} />
                        <Route path={'/Job/*'} element={userDetail?.status != 'Company' ? <Navigate to={'/'} /> : <Page num={3} />} />
                        <Route path={'/Student/*'} element={userDetail?.status != 'Admin' ? <Navigate to={'/'} /> : <Page num={4} />} />
                        <Route path={'/Company/*'} element={userDetail?.status != 'Admin' ? <Navigate to={'/'} /> : <Page num={4} />} />
                        <Route path={'*'} element={<Navigate to={'/'} />} />
                    </Routes>)
            }
            <ToastContainer />
        </Router>
    )
}
export default MyRouter