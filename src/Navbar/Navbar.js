import { TbMenu2 } from 'react-icons/tb'
import './Navbar.css'
import { Link, useNavigate } from 'react-router-dom'
import { setUserDetail } from '../Redux-Toolkit/BazarSlice'
import { useDispatch, useSelector } from 'react-redux'
import { getAuth, signOut } from "firebase/auth"
import { useState } from 'react'
import { SlLogout } from 'react-icons/sl'
import { AiOutlineClose } from 'react-icons/ai'
const Navbar = ({ name, closeCheck, setCloseCheck }) => {
    const { userDetail } = useSelector(e => e)
    // const [ show, setShow ] = useState(false)
    let show = false
    const [showDetail, setShowDetail] = useState(false)
    const data = ["Name: " + userDetail?.name, "Email: " + userDetail?.email,
    "Status: " + userDetail?.status]
    const auth = getAuth();
    const dispatch = useDispatch()
    const logOut = () => {
        dispatch(setUserDetail(false))
        signOut(auth)
    }
    let logoName = (userDetail?.name?.trim()[0])?.toUpperCase() + userDetail?.status[0]
    return (
        <div className={closeCheck == true ? 'NavbarMainDiv NavbarMainDiv2' : 'NavbarMainDiv'}>
            <div className='NavbarRow'>
                <TbMenu2 className={closeCheck ? "showIcon" : 'hideIcon'} onClick={() => setCloseCheck(false)} />
                {/* <p>{name}</p> */}
            </div>
            <div className='NavbarRow'>
                <button onClick={() => logOut()} className='LogOutBut'>
                <SlLogout style={{marginRight: '10px'}}/>
                    Log Out</button>
                <div
                    onClick={() => setShowDetail(true)}
                    className='userLogo'>{logoName}</div>
            </div>
            {showDetail ?
                <>
                    <div style={{
                        position: 'fixed', top: 0, left: 0, backgroundColor: 'rgb(100, 100, 100)', 
                        width: '100vw', height: '100vh', opacity: '0.5', display: 'flex', 
                        alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}>
                    </div>
                    <div
                     onClick={() => 
                        setTimeout(() => {
                        if(show == false)
                        setShowDetail(false) },50)
                    }
                         className={'AllFeaturesNoPadding'}>
                        <div 
                        onClick={() => {
                            // if(show == false)
                                show = true 
                                // if(show == true)
                                setTimeout(() => { 
                                    setShowDetail(true)
                                    show = false
                                },87)
                        }} 
                        className='AllFeaturesNoPadChildDiv'>
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'end', 
                                padding: '20px 20px 0 0', cursor: 'pointer'}} onClick={() => {
                                    setTimeout(() => {
                                        setShowDetail(false) },100)
                                }}>
                                <AiOutlineClose />
                             </div>
                            {data?.map((item, index) =>
                                <div key={index} className={'AllFeaturesChildDiv'}>
                                    <h3
                                        className={'AllFeaturesHeading AllFeaturesHeadingNoPad'}>{item}</h3>
                                </div>
                            )}
                        </div>
                    </div>
                </> : false
            }
        </div>
    )
}
export default Navbar