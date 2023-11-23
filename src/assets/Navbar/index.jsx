// import 'bootstrap/dist/css/bootstrap.min.css';
import { TbMenu2 } from 'react-icons/tb'
import './style.css'
import { Link, useNavigate } from 'react-router-dom'
import { setCheck, setCheckAuth, setUnSub, setUserDetail } from '../../Redux-Toolkit/BazarSlice'
import { useDispatch, useSelector } from 'react-redux'
import { getAuth, signOut } from "firebase/auth"
import { useState } from 'react'
import { SlLogout } from 'react-icons/sl'
import { AiOutlineClose } from 'react-icons/ai'
import { ToastContainer, toast } from 'react-toastify'
import { Button } from 'react-bootstrap'
import { off } from 'firebase/database'
const Navbar = ({ name, closeCheck, setCloseCheck }) => {
    const { userDetail } = useSelector(e => e)
    // const [ show, setShow ] = useState(false)
    let show = false
    const [showDetail, setShowDetail] = useState(false)
    const data = userDetail?.status == 'Student' ? ["Name: " + userDetail?.name, 
    "Email: " + userDetail?.email,
    "Status: " + userDetail?.status, 
    "Education: " + (userDetail?.edu ? userDetail?.edu : 'Matric'),
    'Experience: ' + (userDetail?.exp? userDetail?.exp + (userDetail?.exp == 1 ? ' year' : ' years') : 0)
] :["Name: " + userDetail?.name, "Email: " + userDetail?.email,
    "Status: " + userDetail?.status]
    const auth = getAuth();
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const logOut = () => {
        signOut(auth)
        dispatch(setUserDetail('loading'))
        window.location.pathname = '/'
        // dispatch(setCheck(false))
    }
    let logoName = (( userDetail?.name?.trim().hasOwnProperty(0) && userDetail?.name?.trim()[0])?.toUpperCase()) + (userDetail?.status != false && userDetail?.status[0])
    return (
        <>
        <div className={closeCheck == true ? 'NavbarMainDiv NavbarMainDiv2' : 'NavbarMainDiv'}>
            <div className='NavbarRow'>
                <TbMenu2 className={closeCheck ? "showIcon" : 'hideIcon'} onClick={() => setCloseCheck(false)} />
            </div>
            <div className='NavbarRow'>
                <Button variant='primary' onClick={() => logOut()} 
                    className='LogOutBut'
                >
                <SlLogout style={{marginRight: '10px'}}/>
                    Log Out</Button>
                <div
                    onClick={() => setShowDetail(true)}
                    className='userLogo'>{logoName}</div>
            </div>
                <>
            {showDetail ?
                    <div style={{
                        position: 'fixed', top: 0, left: 0, backgroundColor: 'rgb(100, 100, 100)', 
                        width: '100vw', height: '100vh', opacity: '0.5', display: 'flex', 
                        alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}>
                    </div>: false}
                    <div
                     onClick={() => 
                        setTimeout(() => {
                        if(show == false)
                        setShowDetail(false) },50)
                    }
                         className={`AllFeaturesNoPadding ${!showDetail? "AllFeaturesHide" : ""}`}>
                        <div  onClick={() => {
                                show = true 
                                setTimeout(() => { 
                                    setShowDetail(true)
                                    show = false
                                },87)
                        }} 
                        className='AllFeaturesNoPadChildDiv'>
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', 
                                padding: '22px 20px', height: '80px', borderBottom: '1px solid'}} >
                                <h2
                                 style={{fontSize: '26px'}}
                                 >Profile Page</h2>
                                <AiOutlineClose style={{margin: '10px', cursor: 'pointer'}}
                                 onClick={() => { setTimeout(() => { setShowDetail(false) },100) }} />
                             </div>
                             <div style={{ height: 'fitContent', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '20px' }}>
                            {data?.map((item, index) =>
                                <div key={index} className={'AllFeaturesChildDiv'}>
                                    <h4
                                        className={'AllFeaturesHeading AllFeaturesHeadingNoPad'}>{item}</h4>
                                </div>
                            )}
                            </div>
                        </div>
                    </div>
                </>
        </div>
            <ToastContainer />
            </>
    )
}
export default Navbar