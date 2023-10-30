import imageSrc from './campus_image.png'
import { getAuth, sendPasswordResetEmail } from "firebase/auth"
import { useState } from "react"
import { Link } from "react-router-dom"

const ForgetPass = () => {
    const [reqCheck, setReqCheck] = useState({name: false, email: false, password: false})
    let check2 = true
    const [ check, setCheck ] = useState(false)
    const [ err, setErr ] = useState(false)
    const [ email, setEmail ] = useState('')
    const auth = getAuth()
    const submit = (e) => {
        e.preventDefault()
        sendMail()
    }
    const sendMail = () => {
        check2 = false
        sendPasswordResetEmail(auth, email)
        .then(() =>{
            setErr(false)
            alert('Successful Your Password Has Been To Your Gmail') 
        })
        .catch((err) => {setErr(err) 
        alert('UnSuccessful Please Provide The Right And Complete Email')
        })
        check2 = true
    }
    const changeEmail = (val) => {
        if(!check)
        setCheck(true)
        setEmail(val)
        let temp = {...reqCheck}
        if (val == "") {
            temp.email = false;
        }
        else if (val.length < 8)
            temp.email = true
        else if (!val.includes("@") || !val.includes(".") && !val[val.length - 1] !== '.' || val[val.length-1] == '.')
            temp.email = true
        else{
            temp.email = false
        }
        setReqCheck(temp)
        setCheck(false)
    }
    return(
        <div className="signUpMainDiv">
            <form onSubmit={(e)=> submit(e)} className="signUpForm">
                <div className='signUpDiv forgetPassDiv'>
                <h1>Forgot Password!</h1>
                <div className='signUpRowDiv'>
                    <input placeholder='Email' name="email" value={email} onChange={(e) => 
                    changeEmail(e.target.value)} className='signUpTextInput'/>
                </div>
                {reqCheck?.email ? <p className='signUpError'>Invalid Email!</p> : false}
                {/* <p style={{width: '100%', display: 'flex', justifyContent: 'flex-end', paddingRight: '15px', marginBottom: '-20px'}}><Link onClick={() => sendMail()}>Forgot Password</Link></p> */}
                <button className='signUpButton' type='submit'>FORGET PASSWORD</button>
                <p>Do you remember your password? <Link to={'/'}>Sign in</Link></p>
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
export default ForgetPass