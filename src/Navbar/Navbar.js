import { TbMenu2 } from 'react-icons/tb'
import './Navbar.css'
import { Link, useNavigate } from 'react-router-dom'
import { setUserDetail } from '../Redux-Toolkit/BazarSlice'
import { useDispatch } from 'react-redux'
import { getAuth, signOut } from "firebase/auth"
const Navbar = ({name, closeCheck, setCloseCheck}) => {
    const auth = getAuth();
    // const navigate = useNavigate()
    const dispatch = useDispatch()
    const logOut = () => {
        dispatch(setUserDetail(false))
        signOut(auth)
        // navigate()
    }
    return(
        <div className={closeCheck == true ? 'NavbarMainDiv NavbarMainDiv2' :'NavbarMainDiv'}>
            <div className='NavbarRow'>
            <TbMenu2 className={closeCheck ? "showIcon" : 'hideIcon'} onClick={() => setCloseCheck(false)}/>
            <p>{name}</p>
            </div>
            <button onClick={() => logOut()} className='LogOutBut'>Log Out</button>
        </div>
    )
}
export default Navbar