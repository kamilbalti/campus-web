import { TbMenu2 } from 'react-icons/tb'
import './Navbar.css'
import { Link, useNavigate } from 'react-router-dom'
import { setUserDetail } from '../Redux-Toolkit/BazarSlice'
import { useDispatch, useSelector } from 'react-redux'
import { getAuth, signOut } from "firebase/auth"
const Navbar = ({name, closeCheck, setCloseCheck}) => {
    const {userDetail} = useSelector(e => e)
    const auth = getAuth();
    const dispatch = useDispatch()
    const logOut = () => {
        dispatch(setUserDetail(false))
        signOut(auth)
    }
    return(
        <div className={closeCheck == true ? 'NavbarMainDiv NavbarMainDiv2' :'NavbarMainDiv'}>
            <div className='NavbarRow'>
            <TbMenu2 className={closeCheck ? "showIcon" : 'hideIcon'} onClick={() => setCloseCheck(false)}/>
            <p>{name}</p>
            </div>
            <div className='NavbarRow'>
            <button onClick={() => logOut()} className='LogOutBut'>Log Out</button>
            <div onClick={() => setCloseCheck("profile")} className='userLogo'>{(userDetail?.name[0])?.toUpperCase() + userDetail?.status[0]}</div>
            </div>
        </div>
    )
}
export default Navbar