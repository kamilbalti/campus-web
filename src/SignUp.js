import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth'
import { onValue, ref, set } from 'firebase/database'
import './SignUp.css'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserArr, setUserDetail } from './Redux-Toolkit/BazarSlice';
import { app, db } from "./firebase"
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
const SignUp = () => {
    const dispatch = useDispatch() 
    const auth = getAuth(app);
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [ name, setName ] = useState("")
    const [ status, setStatus ] = useState("Student")
    const [ edu, setEdu ] = useState('Matric')
    const [ exp, setExp ] = useState(0)
    const navigate = useNavigate()
    const [ AllUsersData, setAllUsersData ] = useState([])
    const [ index, setIndex ] = useState(false)
    useEffect(() => {
        onValue(ref(db,"users/"),(data) => {
            let temp = [...AllUsersData]
            data.val() && Object.values(data.val()).map((item,index) => 
            temp.push(item?.userDetail)
            )
            setAllUsersData(temp)
            // console.log(AllUsersData[0].block)
            setIndex(temp.findIndex((item, index) => item?.status == "Admin"))
            // alert(index)
        })
    },[])

    const CreateUser = () => {
        // let tempUserDetail = {name, status, email, password}
        createUserWithEmailAndPassword(auth, email, password).then(async(res) => {
            let userId = res?.user?.uid
            let userDetail = { name, status, email, password, 
            uid: res?.user?.uid, block: false, verify: false,
            exp: status == "Student"  ? exp : false, edu: status == "Student"  ? edu : false 
        }
            dispatch(setUserDetail(userDetail))
            await set(ref(db, 'users/' + userId), {
                userDetail
            })
            navigate('/')
        }).catch((err) => {
            alert(err)
            dispatch(setUserDetail(false))
        })
    }
    return(
        <div className="signUpMainDiv">
            <div className="signUpDiv">
                <h1>Sign Up</h1>
                <div className='signUpRowDiv'>
                    <h2 className='signUpIntroName'>Name:</h2>
                    <input value={name} onChange={(e) => setName(e.target.value)} className='signUpTextInput'/>
                </div>
                <div className='signUpRowDiv'>
                    <h2 className='signUpIntroName'>Status:</h2>
                    <select className='signUpSelect signUpTextInput' value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option className='signUpOption'>Student</option>
                        <option className='signUpOption'>Company</option>
                        {index !== false && index? <option className='signUpOption'>Admin</option> : false}
                    </select>
                </div>{status == 'Student' ?
                    <div className='signUpRow2'>
                    <h2 className='signUpIntroName'>Qualification:</h2>
                        <select className='signUpTextInput signUpSelect signUpEdu' value={edu} onChange={(e) => setEdu(e.target.value)}>
                            <option className='signUpOption'>Matric</option>
                            <option className='signUpOption'>Inter</option>
                            <option className='signUpOption'>Bachelor</option>
                            <option className='signUpOption'>Master</option>
                        </select>
                        <div className='signUpRowDiv'>
                            <h2 className='signUpIntroName'>Experience: (Y)</h2>
                            <input className='signUpTextInput' type='number' value={exp} onChange={(e) => e.target.value >= 0 ? setExp(e.target.value) : false} />
                        </div>
                    </div>: false}
                <div className='signUpRowDiv'>
                    <h2 className='signUpIntroName'>Email:</h2>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} className='signUpTextInput'/>
                </div>
                <div className='signUpRowDiv'>
                    <h2 className='signUpIntroName'>Password:</h2>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type='password' className='signUpTextInput'/>
                </div>
                {/* <Link to={'/'}> */}
                <button className='signUpButton' onClick={CreateUser}>Sign Up</button>
                {/* </Link> */}
            <p>Already have an account <Link to={'/'}>Sign in</Link></p>
            </div>
        </div>
    )
}
export default SignUp