import blueImgSrc from '../photos/campus_image_blue.png'
import imageSrc from '../photos/campus_image.png'
import { getAuth, sendPasswordResetEmail } from "firebase/auth"
import React, { useState } from "react"
import { TailSpin } from 'react-loader-spinner'
import { Link } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify'
import Input from '../assets/screenAssets/input/Input'
import AuthLeftSide from './AuthLeftSide'

const ForgetPass = () => {
    const [reqCheck, setReqCheck] = useState({ email: true, emaillength: true, invEmail: false })
    const condition =  (reqCheck.email || reqCheck.emaillength ||  reqCheck?.invEmail)
    let check2 = false
    const [check, setCheck] = useState(false)
    const [err, setErr] = useState(false)
    const [email, setEmail] = useState('')
    const auth = getAuth()
    const submit = (e) => {
        e.preventDefault()
        sendMail()
    }
    const sendMail = () => {
        if(!check){
        setCheck(true)
        sendPasswordResetEmail(auth, email)
            .then(() => {
                setErr(false)
                setTimeout(() => {
                    notify('Successful your password has been sent to your gmail')
                    setCheck(false)
                },1000)
            })
            .catch((err) => {
                setErr(err)
                setTimeout(() => {
                    notify('UnSuccessful please provide the right and complete email')
                    setCheck(false)
                },1000)
            })
    }}
    let temp = { ...reqCheck }
    const changeEmail = (val) => {
        setEmail(val)
    }
    const notify = (error) => toast(error);
    return (
        <div className="signUpMainDiv">
            <ToastContainer />
            <form onSubmit={(e) => submit(e)} className="signUpForm">
                <img className='signUpHideImage' width={'60px'} height={'60px'} src={blueImgSrc} />
                <div className='signUpDiv forgetPassDiv'>
                    <h1 style={{ width: '100%', textAlign: 'start'}}>Forgot Password!</h1>
                    <Input name={'Email'} inputClass={'signUpTextInput'} email={email} fp={true} su={true} setErr={setErr} setReqCheck={setReqCheck} 
                        setInputVal={changeEmail}
                    // func={(e) => {
                            // let temp = { ...reqCheck }
                            // temp.email = e.target.value.length == 0
                            // temp.emaillength = e.target.value.length < 8
                            // temp.invEmail = e.target.value != '' && (!e.target.value.includes('@') || !e.target.value.includes('.') || e.target.value[e.target.value.length - 1] == '.' || e.target.value[e.target.value.length - 2] == '.') || e.target.value.includes('..')
                            // setReqCheck(temp)
                        // }}
                        err={temp.invEmail ? <p className="signUpError">Invalid Email!</p> : false}
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