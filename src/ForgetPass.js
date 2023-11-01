import imageSrc from './campus_image.png'
import { getAuth, sendPasswordResetEmail } from "firebase/auth"
import React, { useState } from "react"
import { TailSpin } from 'react-loader-spinner'
import { Link } from "react-router-dom"

const ForgetPass = () => {
    const [reqCheck, setReqCheck] = useState({ email: true, emaillength: true, invEmail: false })
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
        setCheck(true)
        sendPasswordResetEmail(auth, email)
            .then(() => {
                setErr(false)
                alert('Successful Your Password Has Been To Your Gmail')
                setTimeout(() => {
                    setCheck(false)
                },1000)
            })
            .catch((err) => {
                setErr(err)
                alert('UnSuccessful Please Provide The Right And Complete Email')
                setTimeout(() => {
                    setCheck(false)
                },1000)
            })
    }
    let temp = { ...reqCheck }
    const changeEmail = (val) => {
        setEmail(val)
    }
    return (
        <div className="signUpMainDiv">
            <form onSubmit={(e) => submit(e)} className="signUpForm">
                <div className='signUpDiv forgetPassDiv'>
                    <h1>Forgot Password!</h1>
                    <div className='signUpRowDiv'>
                        <input placeholder='Email' name="email" value={email} onChange={(e) => {
                            let temp = { ...reqCheck }
                            temp.email = e.target.value.length == 0
                            temp.emaillength = e.target.value.length < 8
                            temp.invEmail = e.target.value != '' && (!e.target.value.includes('@') || !e.target.value.includes('.') || e.target.value[e.target.value.length - 1] == '.' || e.target.value[e.target.value.length - 2] == '.') || e.target.value.includes('..')
                            temp.exist = false
                            setReqCheck(temp)
                            changeEmail(e.target.value)
                        }} className='signUpTextInput' />
                    </div>
                    {!temp.email && temp.emaillength ? <p className="signUpError">Minimum 8 character required!</p> : temp.invEmail ? <p className="signUpError">Invalid Email!</p> : false}
                    <button disabled={
                        reqCheck.email || reqCheck.emaillength || reqCheck.invEmail ||
                        reqCheck.password || reqCheck.passlength || reqCheck.name ||
                        reqCheck?.exist || reqCheck?.invEmail}
                        className={ check ||
                            reqCheck.email || reqCheck.emaillength || reqCheck.invEmail
                                ? 'signUpButton signUpBgGray' : 'signUpButton'}
                        type='submit'>
                            {!check ? "FORGET PASSWORD" :
                <TailSpin height="20" width="20" color="#4fa94d" ariaLabel="tail-spin-loading" 
                radius="1" wrapperStyle={{}} wrapperClass="" visible={true} />
                }
                            </button>
                    <p>Do you remember your password? <Link to={'/'}>Sign in</Link></p>
                </div>
                <div className='bgBlueLock signInImage'>
                    {/* <img width={'150px'} height={'130px'} src={`https://cdn-icons-png.flaticon.com/512/81/81052.png`}/> */}
                    <img width={'150px'} height={'150px'} src={imageSrc} />
                    <h1><i>CAMPUS APP</i></h1>
                    <h3 style={{ textAlign: 'center', fontSize: '20px' }}>Apply For Job Or <br /> Hire A Verified Person Efficiently</h3>
                </div>
            </form>
        </div>
    )
}
export default ForgetPass