import React, { useEffect, useState } from "react";
// import AllFeatures from "./AllFeatures/AllFeatures"
// import MainPage from "./MainPage/MainPage"
// import Navbar from "./Navbar/Navbar"
import AdminPage from "../pages/AdminPage";
import CompanyPage from "../pages/CompanyPage";
import StudentPage from "../pages/StudentPage";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetail } from "../Redux-Toolkit/BazarSlice";
import { onValue,ref, } from 'firebase/database';
import { db } from '../Firebase/firebase';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router";

const Page = ({num}) => {
    const {userDetail} = useSelector(e => e)
    const auth = getAuth()
    let name = userDetail?.name;
    let status = userDetail?.status
    const dispatch = useDispatch()
    const [ select, setSelect ] = useState(num)
    const [ emptPage, setEmptPage ] = useState(false)
    const [ closeCheck, setCloseCheck ] = useState(false)
    const navigate = useNavigate()
    //     onAuthStateChanged(auth, (user) => {
    //         if(user){
    //             const uid = user.uid
    //             onValue(ref(db, "users/" + uid + "/userDetail"), (data) => {       
    //                 (data.val()?.block == true) &&
    //                 dispatch(setUserDetail(data.val()))
    //             })
    //         }
    //     })
    useEffect(() => {
        if(!userDetail
            )
            //  || ( userDetail == 'loading' || userDetail == 'loading2' )
        navigate('/logIn')
        // navigate('/')
        // else 
    },[userDetail])
    return(
        <>
        {status === "Admin"?
        <AdminPage emptPage={emptPage} setEmptPage={setEmptPage} name={name} status={status} closeCheck={closeCheck} setCloseCheck={setCloseCheck} select={select} setSelect={setSelect}/>:
        status === "Company" ?
        <CompanyPage emptPage={emptPage} setEmptPage={setEmptPage} name={name} status={status} closeCheck={closeCheck} setCloseCheck={setCloseCheck} select={select} setSelect={setSelect}/>:
        <StudentPage emptPage={emptPage} setEmptPage={setEmptPage} name={name} status={status} closeCheck={closeCheck} setCloseCheck={setCloseCheck} select={select} setSelect={setSelect}/>
    }
        </>
    )
}
export default Page