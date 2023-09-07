import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut} from 'firebase/auth'
import './SignUp.css'
import { db, firebase } from './firebase'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setUserDetail } from './Redux-Toolkit/BazarSlice';
import { onValue, ref } from 'firebase/database';
import { useDispatch } from 'react-redux';
const SignIn = () => {
    const auth = getAuth();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [ name, setName ] = useState("")
    const [ status, setStatus ] = useState("Student")
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const LogIn = () => {
        signInWithEmailAndPassword(auth, email, password).then(() => {
            navigate('/')
            onAuthStateChanged(auth, (user) => {
                    if(user){
                    const uid = user.uid
                    onValue(ref(db, "users/" + uid + "/userDetail"), (data) => {
                        dispatch(setUserDetail(data.val()))
                    })
                }
            })
        }).catch((err) => alert(err))
    }
    return(
        <div className="signUpMainDiv">
            <div className="signUpDiv">
                <h1>Log In</h1>
                <div className='signUpRowDiv'>
                    <h2 className='signUpIntroName'>Email:</h2>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} className='signUpTextInput'/>
                </div>
                <div className='signUpRowDiv'>
                    <h2 className='signUpIntroName'>Password:</h2>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type='password' className='signUpTextInput'/>
                </div>
                <button className='signUpButton' onClick={LogIn}>Log In</button>
                <p>Don't have an account <Link to={'/signUp'}>Create One</Link></p>
                {/* <p onClick={() => signOut(auth) && dispatch(setUserDetail(false))}>Log Out</p> */}
            </div>
        </div>
    )
}
export default SignIn