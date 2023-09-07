import React, { useEffect } from 'react'
import './AllFeatures.css'
import { AiOutlineClose } from 'react-icons/ai'

const AllFeatures = ({status, closeCheck, setCloseCheck, setSelect}) => {
    const arr = [
        ["All Jobs", "Jobs Applied"], ["Post Jobs", "Previous Jobs", "Student Applied"], ["All Users", "Not Verified Users", "Verified Users", "Blocked Users"],
    ]
    let arrNum = status === "Student" ? 0 : status === 'Company'? 1: 2
    const close = () => {
        setCloseCheck(true)
    }
    // useEffect(() => {
    //     alert(select)
    // },[select])
    return(
        <div className={ closeCheck === true ? "AllFeaturesMainDiv AllFeaturesDiv2" : 'AllFeaturesMainDiv'}>
            <div className='AllFeaturesFirstDiv'>
                <h1 className='AllFeaturesMainHeading'>Status: {status}</h1>
                <div className='closeButtonDiv' onClick={() => close()}>
                <AiOutlineClose/>
                </div>
            </div>
                {arr[arrNum].map((item, index) => 
                <div key={index}>
                <h3 onClick={() => setSelect(index)} className='AllFeaturesHeading'>{item}</h3>
                </div>
                )}
        </div>
    )
}
export default AllFeatures