import blueImgSrc from '../photos/campus_image_blue.png'
import imageSrc from '../photos/campus_image.png'
import { getAuth, sendPasswordResetEmail } from "firebase/auth"
import React, { useEffect, useState } from "react"
import { TailSpin } from 'react-loader-spinner'
import { Link } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify'
import Input from '../assets/screenAssets/input/Input'
import AuthLeftSide from './AuthLeftSide'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const ForgetPass = () => {
    // const [reqCheck, setReqCheck] = useState({ email: true, emaillength: true, invEmail: false })
    const [ condition, setCondition ] = useState(true)
    // const condition =  true
    let check2 = false
    const [check, setCheck] = useState(false)
    const [err, setErr] = useState(false)
    // const [email, setEmail] = useState('')
    const auth = getAuth()
    // const submit = (e) => {
    //     e.preventDefault()
    //     sendMail()
    // }
    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email address')
            .max(35, 'Email must be at most 35 characters')
            .required('Email is required')
            // .matches(/^[a-zA-Z0-9\s']+.@/, 'Invalid email address')
            .matches(/[.]/, 'Invalid email address')
      });

    const formik = useFormik({
        initialValues:{
        email: "",  
        // password: ""
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
        sendMail()
    }
    })
    useEffect(() => {
        // if(formik?.errors?.email == true)
        //     setCondition(false)
        // else
        //     setCondition(true)
        // Object.values(formik.values)?.map((item2) => {
            if (formik?.errors?.email || formik?.values?.email?.trim() == '') {
                setCondition(true)
                // Object.values(formik.errors)?.map((item) => {
                    // if (item2)
                    //     setCondition(true)
                // })
            }
            else
                setCondition(false)
        // })
    }, [formik])
    const sendMail = () => {
        if(!check){
        setCheck(true)
        sendPasswordResetEmail(auth, formik?.values?.email)
            .then(() => {
                setErr(false)
                setTimeout(() => {
                    notify('Successful your password has been sent to your gmail')
                    formik.values.email = ""
                    setCheck(false)
                },1000)
            })
            .catch((error) => {
                setErr(error)
                setTimeout(() => {
                    notify(Object.values(error)[0])
                    setCheck(false)
                },1000)
            })
    }}
    // let temp = { ...reqCheck }
    // const changeEmail = (val) => {
    //     setEmail(val)
    // }
    const notify = (error) => toast(error);
    return (
        <div className="signUpMainDiv">
            <ToastContainer />
            <form onSubmit={(e)=>formik.handleSubmit(e)} className="signUpForm">
                <img className='signUpHideImage' width={'60px'} height={'60px'} src={blueImgSrc} />
                <div className='signUpDiv forgetPassDiv'>
                    <h1 style={{ width: '100%', textAlign: 'start'}}>Forgot Password!</h1>
                    <Input formik={formik} name={'Email'} inputClass={'signUpTextInput'} 
                    // fp={true} 
                    su={true} setErr={setErr} 
                    // setReqCheck={setReqCheck} 
                        // setInputVal={formik.handleChange(e)}
                    // func={(e) => {
                            // let temp = { ...reqCheck }
                            // temp.email = e.target.value.length == 0
                            // temp.emaillength = e.target.value.length < 8
                            // temp.invEmail = e.target.value != '' && (!e.target.value.includes('@') || !e.target.value.includes('.') || e.target.value[e.target.value.length - 1] == '.' || e.target.value[e.target.value.length - 2] == '.') || e.target.value.includes('..')
                            // setReqCheck(temp)
                        // }}
                        // err={temp.invEmail ? <p className="signUpError">Invalid Email!</p> : false}
                        />
                    <button disabled={condition}
                        className={ check || condition
                        ? 'signUpButton signUpBgGray' : 'signUpButton'} type='submit'>
                            {!check ? "FORGET PASSWORD" :
                <TailSpin height="20" width="20" color="#4fa94d" ariaLabel="tail-spin-loading" 
                radius="1" wrapperStyle={{}} wrapperClass="" visible={true} />
                }
                            </button>
                    <p>Do you remember your password? <Link to={'/'}>Sign in</Link></p>
                </div>
                <AuthLeftSide />
            </form>
        </div>
    )
}
export default ForgetPass