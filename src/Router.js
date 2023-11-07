import { Navigate, Route, BrowserRouter as Router, Routes, useNavigate } from "react-router-dom"
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
    const { userDetail } = useSelector(e => e)
    const [tempUser, setTempUser] = useState(userDetail)
    // let tempUser = false;
    const dispatch = useDispatch()
    const [temp, setTemp] = useState(true)
    let check = true
    let inter;
    let mydata = ''
    
    useEffect(() => {
        setTimeout(() => {
        if ((userDetail == 'loading' || !userDetail) && !window.location.pathname.includes('logIn'))
                onAuthStateChanged(auth, async (user) => {
                    const uid = user?.uid
                    if (user) {
                        mydata = onValue(ref(db, "users/" + uid + "/userDetail"), (data) => {
                            // if(userDetail == 'loading2'){
                            //     // if(auth)
                            //     signOut(auth)
                            //     dispatch(setUserDetail(false))
                            //     mydata()
                            // }
                            // else 
                            if( data.val() && data.val()?.status != 'Admin' && (data.val()?.block || !data.val()?.verify) ){
                                if(data.val()?.block){
                                    alert('You Are Blocked By The Admin2')
                                    signOut(auth)
                                    dispatch(setUserDetail(false))
                                    mydata()
                                }
                                else if(!data.val()?.verify){
                                    alert('You Are Not Approved Please Contact With Admin')
                                    signOut(auth)
                                    dispatch(setUserDetail(false))
                                    mydata()
                                }}
                                else if(data.val())
                                    dispatch(setUserDetail(data.val()))
                                // data.val()
                        })
                    }
                    else {
                        dispatch(setUserDetail(false))
                        return () => mydata()
                    }
                })
                else{
                    dispatch(setUserDetail(false))
                }
            }, 500)
    }, [])
    const logOut = () => {
        dispatch(setUserDetail('loading'))
        // .then(() => {
            try{
            signOut(auth)
            window.location = '/'
        }
        catch(err){
            console.log('Error: ' + err)
        }
        // })
    }
    // const blockCheck = () => {
    //     console.log(tempUser)
    //     console.log(mydata, ' Data')
    //     dispatch(setUserDetail(tempUser))
    //     if (tempUser && tempUser != 'loading' && tempUser != undefined) {
    //         if ((tempUser?.block || tempUser?.verify == false) && tempUser?.status != 'Admin') {
    //             setTempUser(false)
    //             if (tempUser?.block) {
    //                 alert('You Are Blocked By The Admin123')
    //                     signOut(auth).then((res) => { 
    //                     dispatch(setUserDetail(false))
    //                     console.log("logout res is ",res
    //                     )}).catch((err) => { console.log("my error ", err) })
    //                 // if(mydata){
    //                 //     alert('confirm')
    //                 // }
    //                 return () => mydata()
    //             }
    //             else if (tempUser && !tempUser?.verify) {
    //                 alert('You Are Not Approved By The Admin Please Contact Admin')
    //                 // if(mydata){
    //                 signOut(auth)
    //                 return () => mydata()
    //             }
    //             // }
    //             // setTimeout(() => {
    //             //     signOut()
    //             // },1000)
    //         }
    //     }

    // }
    // useEffect(() => {
    //     blockCheck()
    //     // if(mydata)
    //     // return() => mydata?.unsubscribe()
    //     // else if(mydata && !tempUser) {
    //     //     // dispatch(setUserDetail(false))
    //     //     setTimeout(() => {
    //     //         if(tempUser)
    //     //         return() => mydata?.unsubscribe()
    //     //     },3000)
    //     // }
    //     // else if(!tempUser){
    //     //     dispatch(setUserDetail(false))
    //     // }
    // }, [tempUser, mydata])
    return (
        <Router>
            {userDetail == false || (userDetail.status != 'Admin' && userDetail?.block == true) ?
                <Routes>
                    <Route path={'/logIn'} element={<SignIn />} />
                    <Route path={'/signUp'} element={<SignUp />} />
                    <Route path={'/forget-password'} element={<ForgetPass />} />
                    <Route path={'*'} element={<Navigate to={'/logIn'}/>}/>
                </Routes>
                :
                userDetail == 'loading' || userDetail == 'loading2'?
                userDetail == 'loading2' ? logOut() :
                    <div style={{ width: '100%', height: '100vh', display: 'flex', alignItems: "center", justifyContent: 'center' }} role="status">
                        <ColorRing visible={true} height="100" width="100" ariaLabel="blocks-loading" wrapperStyle={{}} wrapperClass="blocks-wrapper" colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']} />
                    </div>
                    :
                    <Routes>
                        <Route path={'/'} element={<Page num={0} />} />
                        {/* <Route path={'/requirement'} element={ userDetail && userDetail?.status == 'Student' ? <StudentReq/> : <Navigate to={'/'}/>} /> */}
                        <Route path={'/Job/*'} element={userDetail?.status != 'Company' ? <Navigate to={'/'} /> : <Page num={3} />} />
                        <Route path={'/Student/*'} element={userDetail?.status != 'Admin' ? <Navigate to={'/'} /> : <Page num={4} />} />
                        <Route path={'/Company/*'} element={userDetail?.status != 'Admin' ? <Navigate to={'/'} /> : <Page num={4} />} />
                        <Route path={'*'} element={<Navigate to={'/'} />} />
                    </Routes>
            }
        </Router>
    )
}
export default MyRouter