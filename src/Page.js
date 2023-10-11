import React, { useEffect, useState } from "react";
// import AllFeatures from "./AllFeatures/AllFeatures"
// import MainPage from "./MainPage/MainPage"
// import Navbar from "./Navbar/Navbar"
import AdminPage from "./AdminPage";
import CompanyPage from "./CompanyPage";
import StudentPage from "./StudentPage";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetail } from "./Redux-Toolkit/BazarSlice";
import { onValue,ref, } from 'firebase/database';
import { db } from './firebase';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const Page = () => {
    const {userDetail} = useSelector(e => e)
    const auth = getAuth()
    let name = userDetail?.name;
    let status = userDetail?.status
    const dispatch = useDispatch()
    const [ select, setSelect ] = useState(0)
    const [ emptPage, setEmptPage ] = useState(false)
    const [ closeCheck, setCloseCheck ] = useState(false)
    //     onAuthStateChanged(auth, (user) => {
    //         if(user){
    //             const uid = user.uid
    //             onValue(ref(db, "users/" + uid + "/userDetail"), (data) => {       
    //                 (data.val()?.block == true) &&
    //                 dispatch(setUserDetail(data.val()))
    //             })
    //         }
    //     })
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