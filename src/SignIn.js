import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail} from 'firebase/auth'
import './SignUp.css'
import { db, firebase } from './firebase'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setUserDetail } from './Redux-Toolkit/BazarSlice';
import { onValue, ref } from 'firebase/database';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup'
const SignIn = () => {
    const auth = getAuth();
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
        validationSchema: validationSchema,
        onSubmit: (values) => {
            LogIn()
            console.log(values)
        }
        })
    const LogIn = (e) => {
        signInWithEmailAndPassword(auth, formik.values.email, formik.values.password).then(() => {
            onAuthStateChanged(auth, (user) => {
                if(user){
                    const uid = user.uid
                    onValue(ref(db, "users/" + uid + "/userDetail"), (data) => {
                        (data.val()?.block == true)?
                        alert("You are Blocked by the Admin"): 
                        dispatch(setUserDetail(data.val()))
                    })
                }
            })
            formik.values.email = ""
            formik.values.password = ""
            // navigate('/')
        }).catch((err) => alert(err))
    }
    let check = true
    const sendMail = () => {
        check = false
        sendPasswordResetEmail(auth, formik.values.email);
        alert('Password Reset Email Send')
        check = true
    }
    return(
        <div className="signUpMainDiv">
            <form onSubmit={(e)=>formik.handleSubmit(e)} className="signUpDiv">
                <h1>Log In</h1>
                <div className='signUpRowDiv'>
                    <h2 className='signUpIntroName'>Email:</h2>
                    <input name="email" value={formik.values.email} onChange={formik.handleChange} className='signUpTextInput'/>
                </div>
                <div className='signUpRowDiv'>
                {check ?
                <>
                    <h2 className='signUpIntroName'>Password:</h2>
                    <input name="password" value={formik.values.password} onChange={formik.handleChange} type='password' className='signUpTextInput'/>
                </>    
                : false}
                </div>
                <p><Link onClick={() => sendMail()}>Forgot Password</Link></p>
                <button className='signUpButton' type='submit'>Log In</button>
                <p>Don't have an account <Link to={'/signUp'}>Create One</Link></p>
            </form>
        </div>
    )
}
export default SignIn