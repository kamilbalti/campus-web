import GroupIcon from '@mui/icons-material/Group';
import RemoveModeratorIcon from '@mui/icons-material/RemoveModerator';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import WorkIcon from '@mui/icons-material/Work';
import PostAddIcon from '@mui/icons-material/PostAdd';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import BlockIcon from '@mui/icons-material/Block';
import React, { useEffect, useState } from 'react'
import './style.css'
import { AiOutlineClose } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import imgSrc from '../../photos/campus_image.png'
import { useNavigate } from 'react-router'
import { onValue, ref } from 'firebase/database'
import { db } from '../../Firebase/firebase'

const AllFeatures = ({ status, closeCheck, setCloseCheck, setSelect, select, AllUsersData, setAllUsersData }) => {
    const navigate = useNavigate()
    const { userDetail } = useSelector(e => e)
    let allUsers = AllUsersData?.length
    let nonVerified = AllUsersData && AllUsersData?.filter((item, index) => !item?.verify)?.length
    let verified = AllUsersData && AllUsersData?.filter((item, index) => item?.verify)?.length
    let blocked = AllUsersData && AllUsersData?.filter((item, index) => item?.block)?.length
    const icon = [ [<WorkIcon />, <WorkHistoryIcon />], [<PostAddIcon />, <WorkHistoryIcon />], 
    [<GroupIcon />, <RemoveModeratorIcon />, <VerifiedUserIcon />, <BlockIcon />]]
    const arr = [
            ["All Jobs", "Jobs Applied"], [`Post Jobs`, "Previous Jobs"],
            [`All Users (${allUsers? allUsers : 0})`, 
            `Non Verified Users (${nonVerified? nonVerified : 0})`, 
            `Verified Users (${verified? verified : 0})`, 
            `Blocked Users (${blocked? blocked : 0})`, 
        ],
        ]

    let arrNum = closeCheck == "profile" ? 0 : status == "Student" ? 0 : status == 'Company' ? 1 : 2
    const close = () => {
        setCloseCheck(true)
    }
    const changeSelect = (index) => {
        if(userDetail?.status == 'Admin')
        navigate('/')
        if (select !== index && closeCheck !== 'profile')
            setSelect(index);
        let location = window.location.pathname.split('/')
        if(location[1] == 'Job')
        navigate('/')
        // alert('yes')
        // : false
        if ((window !== 'undefined') && window.innerWidth <= 600 && closeCheck !== 'profile')
            close()
        // alert('test')
    }
    return (
        <div className={closeCheck == true ? "AllFeaturesMainDiv AllFeaturesDiv2" : 'AllFeaturesMainDiv'}>
            <div className='AllFeaturesFirstDiv'>
                <img style={{color: 'white'}} width={'30px'} src={imgSrc}/>
                <h4><i>CAMPUS APP</i></h4>
                {/* <h1 className='AllFeaturesMainHeading'>
                    Status: {status}
                </h1> */}
                <div className='closeButtonDiv' onClick={() => close()}>
                    <AiOutlineClose />
                </div>
            </div>
            <div className={ closeCheck == 'profile' ? 'AllFeaturesNoPadding' : 'AllFeaturesSecondDiv'}>
                {arr[arrNum].map((item, index) =>
                    <div key={index} className={closeCheck == false && select == index && select !== false ? 'AllFeaturesChildDiv AllFeaturesSelect' : 'AllFeaturesChildDiv'}>
                        {/* <PostAddIcon /> */}
                        <div>
                        {icon[arrNum][index]}
                        </div>
                        <h3 onClick={() => changeSelect(index)} className={ closeCheck == 'profile' ? 'AllFeaturesHeading AllFeaturesHeadingNoPad' : 'AllFeaturesHeading'}>{item}</h3>
                    </div>
                )}
            </div>
        </div>
    )
}
export default AllFeatures