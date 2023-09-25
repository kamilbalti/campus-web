import React, { useEffect } from 'react'
import './AllFeatures.css'
import { AiOutlineClose } from 'react-icons/ai'
import { useSelector } from 'react-redux'

const AllFeatures = ({status, closeCheck, setCloseCheck, setSelect, select}) => {
    const {userDetail} = useSelector(e => e)
    const arr = closeCheck == "profile"?
    [[
        "Name: " +userDetail?.name, 
        "Email: " +userDetail?.email, 
        "Uid: " +userDetail?.uid,
        "Status: " +userDetail?.status
    ]] 
    : [
        ["All Jobs", "Jobs Applied"], ["Post Jobs", "Previous Jobs", "Student Applied"], 
        ["All Users", "Non Verified Users", "Verified Users", "Blocked Users"],
    ]

    let arrNum = closeCheck == "profile"? 0 : status == "Student" ? 0 : status == 'Company'? 1: 2
    const close = () => {
        setCloseCheck(true)
    }
    const changeSelect = (index) => {
        if(select !== index && closeCheck !== 'profile') 
            setSelect(index); 

        // : false
        if((window !== 'undefined') && window.innerWidth <= 600 && closeCheck !== 'profile') 
        close() 
        // alert('test')
    }
    return(
        <div className={closeCheck == true ? "AllFeaturesMainDiv AllFeaturesDiv2" : 'AllFeaturesMainDiv'}>
            <div className='AllFeaturesFirstDiv'>
                <h1 className='AllFeaturesMainHeading'>Status: {status}</h1>
                <div className='closeButtonDiv' onClick={() => close()}>
                <AiOutlineClose/>
                </div>
            </div>
                {arr[arrNum].map((item, index) => 
                <div key={index} className={closeCheck == false && select == index && select !== false ? 'AllFeaturesChildDiv AllFeaturesSelect' : 'AllFeaturesChildDiv'}>
                <h3 onClick={() => changeSelect(index)} className='AllFeaturesHeading'>{item}</h3>
                </div>
                )}
        </div>
    )
}
export default AllFeatures