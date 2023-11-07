import { getAuth, createUserWithEmailAndPassword, checkActionCode } from 'firebase/auth'
import { onValue, ref, set } from 'firebase/database'
import './SignUp.css'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserArr, setUserDetail } from './Redux-Toolkit/BazarSlice';
import { app, db } from "./firebase"
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup'
import imageSrc from './campus_image.png'
import StudentReq from './studentReq';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { TailSpin } from 'react-loader-spinner';
const SignUp = () => {
    const [passType, setPassType] = useState('password')
    const [passBorder, setPassBorder] = useState(false)
    const dispatch = useDispatch()
    const auth = getAuth(app);
    const [next, setNext] = useState(false)
    const [status, setStatus] = useState("Student")
    const navigate = useNavigate()
    const [AllUsersData, setAllUsersData] = useState([])
    const [check, setCheck] = useState(false)
    const [index, setIndex] = useState(false)
    const [wait, setWait] = useState(false)
    const [reqCheck, setReqCheck] = useState({ name: true, email: true, password: true, passlength: true, emaillength: true, exp: false, invEmail: false, exist: false })
    const [err, setErr] = useState(false)
    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),
        name: Yup.string()
            .required('Name is required')
            .matches(/^[a-zA-Z\s'-]+$/, 'Invalid name format')
    });
    useEffect(() => {
        onValue(ref(db, "users/"), (data) => {
            let temp = [...AllUsersData]
            data.val() && Object.values(data.val()).map((item, index) =>
                temp.push(item?.userDetail)
            )
            setAllUsersData(temp)
            setIndex(temp.findIndex((item, index) => item?.status == "Admin"))
        })
    }, [])
    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: ""
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            // setCheck(true)
            // let temp = {...reqCheck}
            // if(formik.values.email == "") {
            //     temp.email = true;
            // }
            // else if(formik.values.email.length < 8)
            //     temp.emaillength = true
            // if(formik.values.password == "") {
            //     temp.password = true;
            // }
            // else if(formik.values.password.length < 8)
            //     temp.passlength = true
            // else
            // CreateUser(values)
            // setReqCheck(temp)
        }
    })

    const checkEmail = (email) => {
        let temp2 = { ...reqCheck }
        temp2.exist = false
        setReqCheck(temp2)
        onValue(ref(db, "users/"), (data) => {
            let temp = [...AllUsersData]
            data.val() && Object.values(data.val()).map((item, index) => temp.push(item?.userDetail)
            )
            let index2 = temp.findIndex((item3, index3) => item3?.email == email)
            index2 == -1 ?
                temp2.exist = false : !wait ? temp2.exist = true : temp2.exist = false
            setReqCheck(temp2)
        })
    }
    useEffect(() => {
        checkEmail(formik.values.email)
    }, [formik.values.email])
    const CreateUser = () => {
        let temp = { ...reqCheck }
        checkEmail && checkEmail(formik.values.email)
        try {
            if (!wait) {
                setWait(true)
                setCheck(true)




                if (formik.values.email == "") {
                    temp.email = true;
                    setReqCheck(temp)
                    setErr(false)
                }
                else if (formik.values.email.length < 8) {
                    temp.emaillength = true
                }
                else if (!formik.values.email.includes("@") || !formik.values.email.includes(".") && !formik?.values?.email[formik?.values?.email.length - 1] !== '.') {
                    temp.invEmail = true
                }
                if (formik.values.password == "") {
                    temp.password = true;
                    setReqCheck(temp)
                    setErr(false)
                }
                else if (formik.values.password.length < 8) {
                    temp.passlength = true
                    setReqCheck(temp)
                    setErr(false)
                }
                if (formik.values.name == "") {
                    temp.name = true;
                    setReqCheck(temp)
                    setErr(false)
                }
                if (temp.email) {
                    setWait(false)
                    temp = temp
                }
                // temp.exp = true
                else if (!temp.email && !temp.emaillength && !temp.invEmail && !temp.password && !temp.passlength && !temp.name && !temp.exist) {
                    // if((temp.exp && status !== 'Student') || !temp.exp )

                    // let tempUserDetail = {name, status, email, password}
                    createUserWithEmailAndPassword(auth, formik.values.email, formik.values.password).then(async (res) => {
                        let userId = res?.user?.uid
                        let userDetail = {
                            name: formik.values.name, status,
                            email: formik.values.email, password: formik.values.password,
                            uid: res?.user?.uid, block: false, verify: false,
                            // exp: status == "Student"  ? exp : false, edu: status == "Student"  ? edu : false 
                        }
                        dispatch(setUserDetail(userDetail))
                        setWait(false)
                        await set(ref(db, 'users/' + userId), {
                            userDetail
                        }).then(() => {
                            setWait(true)
                            // alert('You are not Verified Please contact with Admin1')
                            if(userDetail?.status != 'Admin')
                            navigate('/logIn')
                            else navigate('/')
                        })
                    }).catch((err) => {
                        setErr(err)
                        alert(err)
                        // navigate('/')
                        setWait(false)
                        // alert(err)
                        dispatch(setUserDetail(false))
                    })
                }
            }

            else {
                setWait(false)
            }
        }
        catch (err) {
            console.log(err, ' error')
            setWait(false)
        }
    }
    return (
        <div className="signUpMainDiv">
            <>
                {
                    // !next ? 
                    <form onSubmit={(e) => formik.handleSubmit(e)} className="signUpForm">
                        <div className='signUpDiv signUpChildDiv'>
                            <h1>REGISTER</h1>
                            <div className='signUpRowDiv'>
                                <input placeholder={'Name:'} name='name' value={formik.values.name} onChange={(e) => {
                                    let temp = { ...reqCheck }
                                    // if (check)
                                    temp.name = e.target.value.length == 0
                                    setReqCheck(temp)
                                    setErr(false)
                                    formik.handleChange(e)
                                }} className='signUpTextInput' />
                                {/* {reqCheck.name ? <p className="signUpError">Required!</p> : false} */}
                            </div>
                            <div className='signUpRowDiv'>
                                <select className='signUpSelect signUpTextInput' value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option className='signUpOption'>Student</option>
                                    <option className='signUpOption'>Company</option>
                                    {index !== false ? <option className='signUpOption'>Admin</option> : false}
                                </select>
                            </div>
                            {/* <StudentReq /> */}
                            <div className='signUpRowDiv'>
                                <input placeholder={'Email:'} name='email' value={formik.values.email} onChange={(e) => {
                                    let temp = { ...reqCheck }
                                    // if (check) {
                                    temp.email = e.target.value.length == 0
                                    temp.emaillength = e.target.value.length < 8
                                    temp.invEmail = e.target.value != '' && (!e.target.value.includes('@') || !e.target.value.includes('.') || e.target.value[e.target.value.length - 1] == '.' || e.target.value[e.target.value.length - 2] == '.') || e.target.value.includes('..')
                                    temp.exist = false
                                    // }
                                    checkEmail(e.target.value)
                                    setReqCheck(temp)
                                    setErr(false)
                                    formik.handleChange(e)
                                }
                                } className='signUpTextInput' />
                                {reqCheck?.exist ? <p className="signUpError">Account already in used</p> : !reqCheck.email && reqCheck.emaillength ? <p className="signUpError">Minimum 8 character required!</p> : reqCheck.invEmail ? <p className="signUpError">Invalid Email!</p> : false}
                            </div>
                            <div className='signUpRowDiv'>
                                <div className={
                                    passBorder ? 'signUpPassDiv signUpBorder' :
                                        'signUpPassDiv'}>
                                    <input onFocus={() => setPassBorder(true)} onBlur={() => setPassBorder(false)} placeholder={'Password:'} name='password' value={formik.values.password} onChange={(e) => {
                                        let temp = { ...reqCheck }
                                        // if (check) {
                                        temp.password = e.target.value.length == 0
                                        temp.passlength = e.target.value.length < 8
                                        // }
                                        setReqCheck(temp)
                                        setErr(false)
                                        formik.handleChange(e)
                                    }} type={passType} className='signUpTextInput signUpPassInput' />
                                    <button type='button' className='signUpPassIcon' onClick={() => passType == 'password' ? setPassType('text') : setPassType('password')}>
                                        {passType == 'password' ?
                                            <BsFillEyeSlashFill /> : <BsFillEyeFill />}
                                    </button>
                                </div>
                                {!reqCheck.password && reqCheck.passlength ? <p className="signUpError">Minimum 8 character required!</p> : err ? <p className="signUpError">Invalid Email</p> : false}
                            </div>
                            <button 
                            disabled={
                                reqCheck.email || reqCheck.emaillength || reqCheck.invEmail ||
                                reqCheck.password || reqCheck.passlength || reqCheck.name ||
                                reqCheck?.exist || reqCheck?.invEmail} 
                                onClick={CreateUser}
                                className={
                                    reqCheck.email || reqCheck.emaillength || reqCheck.invEmail ||
                                        reqCheck.password ||
                                        reqCheck.passlength ||
                                        reqCheck.name ||
                                        reqCheck?.exist ||
                                        reqCheck?.invEmail
                                        ? 'signUpButton signUpBgGray' : 'signUpButton'}
                                type='submit'>
                                {!wait ? 'Create User' :
                                    <TailSpin height="15" width="15" color="#4fa94d" ariaLabel="tail-spin-loading"
                                        radius="1" wrapperStyle={{}} wrapperClass="" visible={true} />
                                }
                            </button>
                            <p>Already have an account <Link to={'/'}>Sign in</Link></p>
                        </div>
                        <div className='bgBlueLock signUpImage'>
                            {/* <img width={'230px'} height={'230px'} src={`https://cdn-icons-png.flaticon.com/512/68/68286.png`} /> */}
                            <img width={'150px'} height={'150px'} src={imageSrc} />
                            <h1><i>CAMPUS APP</i></h1>
                            <h3 style={{ textAlign: 'center', fontSize: '20px' }}>Apply For Job Or <br /> Hire A Verified Person Efficiently</h3>
                        </div>
                    </form>
                }
            </>
        </div>
    )
}
export default SignUp