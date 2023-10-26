import React, { useEffect, useState } from 'react'
import './AllFeatures.css'
import { AiOutlineClose } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import imgSrc from '../campus_image.png'
import { useNavigate } from 'react-router'
import { onValue, ref } from 'firebase/database'
import { db } from '../firebase'

const AllFeatures = ({ status, closeCheck, setCloseCheck, setSelect, select }) => {
    const navigate = useNavigate()
    const [ AllUsersData, setAllUsersData ] = useState(false)
    useEffect(() => {
        onValue(ref(db,"users/"),(data) => {
            let temp = AllUsersData ? [...AllUsersData] : []
            data.val() && Object.values(data.val()).map((item,index) => item?.userDetail?.status !== "Admin" &&
                temp.push(item?.userDetail)
            )
            setAllUsersData(temp)
        })
    },[])

    const { userDetail } = useSelector(e => e)
    // const [edit, setEdit] = useState(false)
    let allUsers = AllUsersData?.length
    let nonVerified = AllUsersData && AllUsersData?.filter((item, index) => !item?.verify)?.length
    let verified = AllUsersData && AllUsersData?.filter((item, index) => item?.verify)?.length
    let blocked = AllUsersData && AllUsersData?.filter((item, index) => item?.block)?.length
    const arr = closeCheck == "profile" ?
        [
                [
                    "Name: " + userDetail?.name,
                    "Email: " + userDetail?.email,
                    "Status: " + userDetail?.status,
                ] 
        ]
        : [
            ["All Jobs", "Jobs Applied"], ["Post Jobs", "Previous Jobs", "Student Applied"],
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
                        <h3 onClick={() => changeSelect(index)} className={ closeCheck == 'profile' ? 'AllFeaturesHeading AllFeaturesHeadingNoPad' : 'AllFeaturesHeading'}>{item}</h3>
                    </div>
                )}
            </div>
        </div>
    )
}
export default AllFeatures