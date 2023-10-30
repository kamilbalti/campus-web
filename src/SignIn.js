import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail} from 'firebase/auth'
import './SignUp.css'
import { db, firebase } from './firebase'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setUserDetail } from './Redux-Toolkit/BazarSlice';
import { onValue, ref } from 'firebase/database';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import {BsFillEyeFill, BsFillEyeSlashFill} from 'react-icons/bs';
import imageSrc from './campus_image.png'
import * as Yup from 'yup'

const SignIn = () => {
    const {userDetail} = useSelector(e => e)
    const [passType, setPassType] = useState('password')
    const auth = getAuth();
    const [reqCheck, setReqCheck] = useState({name: false, email: false, password: false})
    const [err, setErr] = useState(false)
    const [ passBorder, setPassBorder ] = useState(false)
    // const [ check, setCheck ] = useState(false)
    let check = false
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
            if(!check)
            check = true
            // setCheck(true)
            // setTimeout(() => {
            if(check){
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
        signInWithEmailAndPassword(auth, formik.values.email, formik.values.password).then((user) => {
            // onAuthStateChanged(auth, (user) => {
                if(user){
                    const uid = user.uid
                    onValue(ref(db, "users/" + uid + "/userDetail"), (data) => {
                        // if(window.location.pathname == '/' && data.val()?.block == true)
                        // window.location.pathname = '/'
                        if(data.val()?.status == 'Admin')
                        dispatch(setUserDetail(data.val()))
                            // alert('test')
                        else if(data.val()) 
                        if(data.val()?.block == true && data.val()?.verify){
                        alert("You are Blocked by the Admin") 
                        signOut(auth)
                        window.location = window.location
                        .then(() =>
                        // setTimeout(() => {
                            dispatch(setUserDetail(false))
                            // }, 2000)}
                            ).catch(() => 
                            dispatch(setUserDetail(false))
                        )
                        }
                        else if( data.val() && data.val()?.verify != true){
                            alert("You are not Verified Please Contact with the Admin") 
                            signOut(auth)
                            window.location = window.location
                            .then(() =>
                            // setTimeout(() => {
                                dispatch(setUserDetail(false))
                                // },2000)
                                ).catch(() => 
                                dispatch(setUserDetail(false))
                            )
                        }
                        else{
                            dispatch(setUserDetail(data.val()))
                        }
                        })


                        // dispatch(setUserDetail(data.val())) : 
                        // dispatch(setUserDetail(false))
                    setTimeout(() => {

                        if(userDetail != false){
                            formik.values.email = ""
                            formik.values.password = ""
                            alert('You are blocked or not verified Please contact with the admin')
                        }
                        else{
                        }
                    },300)
                    check = false
                        // setCheck(false)
            }
            // })
            // navigate('/')
        }).catch((err) => 
        setErr(err)
        )}
    // },100)
    }
    return(
        <div className="signUpMainDiv">
            <form onSubmit={(e)=>formik.handleSubmit(e)} className="signUpForm">
                <div className='signUpDiv signInDiv'>
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
                <p onClick={() => navigate('/forget-password')} style={{width: '100%', display: 'flex', justifyContent: 'flex-end', paddingRight: '15px', marginBottom: '-20px'}}><Link>Forgot Password</Link></p>
                <button className='signUpButton' type='submit'>Log In</button>
                <p>Don't have an account <Link to={'/signUp'}>Create One</Link></p>
                </div>
                <div className='bgBlueLock signInImage'>
                    {/* <img width={'150px'} height={'130px'} src={`https://cdn-icons-png.flaticon.com/512/81/81052.png`}/> */}
                    <img width={'150px'} height={'150px'} src={imageSrc} />
                    <h1><i>CAMPUS APP</i></h1>
                    <h3 style={{textAlign: 'center', fontSize: '20px'}}>Apply For Job Or <br /> Hire A Verified Person Efficiently</h3>
                </div>
            </form>
        </div>
    )
}
export default SignIn