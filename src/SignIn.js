import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail} from 'firebase/auth'
import './SignUp.css'
import { db, firebase } from './firebase'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setUserDetail } from './Redux-Toolkit/BazarSlice';
import { onValue, ref } from 'firebase/database';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import {BsFillEyeFill, BsFillEyeSlashFill} from 'react-icons/bs';
import * as Yup from 'yup'
const SignIn = () => {
    const [passType, setPassType] = useState('password')
    const auth = getAuth();
    const [reqCheck, setReqCheck] = useState({name: false, email: false, password: false})
    const [err, setErr] = useState(false)
    const [ passBorder, setPassBorder ] = useState(false)
    const [ check, setCheck ] = useState(false)
    const validationSchema = Yup.object().shape({
        email: Yup.string()
          .email('Invalid email address')
          .required('Email is required'),
        password: Yup.string()
          .min(6, 'Password must be at least 6 characters')
          .required('Password is required'),
      });
    const navigate = useNavigate()
    const dispatch = useDispatch()
        const formik = useFormik({
            initialValues:{
            email: "",
            password: ""
        },
        // validationSchema: validationSchema,
        onSubmit: (values) => {
            LogIn()
        }
        })
    const LogIn = (e) => {
            setCheck(true)
            let temp = {...reqCheck}
            if(formik.values.email == "") {
                temp.email = true;
                setErr(false)
                setReqCheck(temp)
            }
        if(formik.values.password == "") {
            temp.password = true;
            setErr(false)
            setReqCheck(temp)
        }
        else if(!temp.email && !temp.password)
        signInWithEmailAndPassword(auth, formik.values.email, formik.values.password).then(() => {
            onAuthStateChanged(auth, (user) => {
                if(user){
                    const uid = user.uid
                    onValue(ref(db, "users/" + uid + "/userDetail"), (data) => {
                        (data.val()?.block != true)?
                        dispatch(setUserDetail(data.val())) : 
                        alert("You are Blocked by the Admin") && 
                        dispatch(setUserDetail(false))
                    })
                    formik.values.email = ""
                    formik.values.password = ""
                }
            })
            // navigate('/')
        }).catch((err) => setErr(err))
    }
    let check2 = true
    const sendMail = () => {
        check2 = false
        sendPasswordResetEmail(auth, formik.values.email)
        .then(() =>{
        alert('Successful You are Navigating to Your Gmail') 
        window.location = 'https://mail.google.com/mail/u/0/#inbox'
        })
        .catch((err) => alert('UnSuccessful Please Provide The Right And Complete Email' + err))
        check2 = true
    }
    return(
        <div className="signUpMainDiv">
            <form onSubmit={(e)=>formik.handleSubmit(e)} className="signUpForm">
                <div className='signUpDiv'>
                <h1>LOGIN</h1>
                <div className='signUpRowDiv'>
                    <input placeholder='Email' name="email" value={formik.values.email} onChange={(e) => {
                            let temp = {...reqCheck}
                            if(check){
                            temp.email = e.target.value.length == 0
                        }
                            setReqCheck(temp)
                            setErr(false)                        
                            formik.handleChange(e)}} className='signUpTextInput'/>
                    {reqCheck.email? <p className='signUpError'>Required!</p> : reqCheck.emaillength? <p className='signUpError'>Minimum 8 character required!</p> : false}
                </div>
                <div className='signUpRowDiv'>
                    <div className={passBorder ? 'signUpPassDiv signUpBorder':'signUpPassDiv'}>
                    <input onFocus={() => setPassBorder(true)} onBlur={() => setPassBorder(false)} placeholder='Password' name="password" value={formik.values.password} onChange={(e) => {
                        let temp = {...reqCheck}
                        if(check){
                        temp.password = e.target.value.length == 0
                    }
                        setReqCheck(temp)
                        setErr(false)                                                
                        formik.handleChange(e)
                        }} type={passType} className={`signUpTextInput signUpPassInput`}/>
                        <button type='button' className='signUpPassIcon' onClick={() => passType == 'password'? setPassType('text'): setPassType('password')}>
                            {passType == 'password' ?
                            <BsFillEyeSlashFill /> : <BsFillEyeFill /> }
                        </button>
                    </div>
                    {reqCheck.password? <p className='signUpError'>Required!</p> : reqCheck.passlength? <p className='signUpError'>Minimum 8 character required!</p> : err && !reqCheck.email && !reqCheck.emaillength? 
                    <p className='signUpError'>Invalid Email or Password</p> : false}
                </div>
                <p style={{width: '100%', display: 'flex', justifyContent: 'flex-end', paddingRight: '15px', marginBottom: '-20px'}}><Link onClick={() => sendMail()}>Forgot Password</Link></p>
                <button className='signUpButton' type='submit'>Log In</button>
                <p>Don't have an account <Link to={'/signUp'}>Create One</Link></p>
                </div>
                <div className='bgBlueLock signInImage'>
                    <img width={'150px'} height={'130px'} src={`https://cdn-icons-png.flaticon.com/512/81/81052.png`}/>
                </div>
            </form>
        </div>
    )
}
export default SignIn