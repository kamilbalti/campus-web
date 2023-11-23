import blueImgSrc from '../photos/campus_image_blue.png'
import AuthLeftSide from './AuthLeftSide';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { onValue, ref, set } from 'firebase/database'
import './SignUp.css'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUnSub, setUserDetail } from '../Redux-Toolkit/BazarSlice';
import { app, db } from "../Firebase/firebase"
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup'
import { TailSpin } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import Input from '../assets/screenAssets/input/Input';
import { MenuItem, Select } from '@mui/material';
const SignUp = () => {
    const [passType, setPassType] = useState('password')
    const { userDetail } = useSelector((e) => e)
    const [passBorder, setPassBorder] = useState(false)
    const dispatch = useDispatch()
    const auth = getAuth(app);
    const [status, setStatus] = useState("Student")
    const navigate = useNavigate()
    const [AllUsersData, setAllUsersData] = useState([])
    const [wait, setWait] = useState(false)
    const [reqCheck, setReqCheck] = useState(false)
    const [err, setErr] = useState(false)
    const [condition, setCondition] = useState(true)
    const statusArr = ['Student', 'Company']
    useEffect(() => {
        if (reqCheck && Object.values(reqCheck).length >= 6) {
            setCondition(false)
            Object.values(reqCheck)?.map((item) => {
                if(item)
                    setCondition(item)
            })
        }
        else
            setCondition(true)
    }, [reqCheck])
    // const validationSchema = Yup.object().shape({
    //     email: Yup.string()
    //         .email('Invalid email address')
    //         .required('Email is required'),
    //     password: Yup.string()
    //         .min(6, 'Password must be at least 6 characters')
    //         .required('Password is required'),
    //     name: Yup.string()
    //         .required('Name is required')
    //         .matches(/^[a-zA-Z\s'-]+$/, 'Invalid name format')
    // });
    useEffect(() => {
        onValue(ref(db, "users/"), (data) => {
            let temp = [...AllUsersData]
            data.val() && Object.values(data.val()).map((item, index) => temp.push(item?.userDetail) )
            setAllUsersData(temp)
        })
    }, [])
    useEffect(() => {
        if (userDetail && (userDetail != 'loading' || userDetail != 'loading2'))
            navigate('/')
        else navigate('/signUp')
    }, [userDetail])
    const formik = useFormik({
        initialValues: { name: "", email: "", password: ""},
        // validationSchema: validationSchema,
        onSubmit: (values) => {
            // CreateUser(values)
        }
    })

    const checkEmail = (email) => {
        let temp2 = { ...reqCheck }
        temp2.exist = false
        setReqCheck(temp2)
        onValue(ref(db, "users/"), (data) => {
            let temp = [...AllUsersData]
            data.val() && Object.values(data.val()).map((item, index) => temp.push(item?.userDetail))
            let index2 = temp.findIndex((item3, index3) => item3?.email == email)
            index2 == -1 ?
                temp2.exist = false : temp2.exist = true
            setReqCheck(temp2)
        })
    }
    const CreateUser = () => {
        let temp = { ...reqCheck }
        checkEmail && checkEmail(formik.values.email)
        try {
            if (!wait) {
                setWait(true)
                if (!temp.email && !temp.invEmail && !temp.password && !temp.passlength && !temp.name && !temp.exist) {
                    createUserWithEmailAndPassword(auth, formik.values.email.trim(), formik.values.password.trim()).then(async (res) => {
                        let userId = res?.user?.uid
                        let userDetail = { name: formik.values.name, status, email: formik.values.email,
                            uid: res?.user?.uid, block: false, verify: false }
                        dispatch(setUserDetail(userDetail))
                        setWait(false)
                        await set(ref(db, 'users/' + userId), { userDetail }).then(() => {
                            setWait(true)
                            dispatch(setUnSub(false))
                            if (userDetail?.status == 'Admin')
                                navigate('/')
                            else navigate('/logIn')
                        })
                    }).catch((err) => {
                        setErr(err)
                        notify(err)
                        setWait(false)
                        dispatch(setUserDetail(false))
                    })
                }
            } 
            else {
                setWait(false)
            }
        }
        catch (err) {
            // console.log(err, ' error')
            setWait(false)
        }
    }
    const notify = (error) => toast(error)
    return (
        <div className="signUpMainDiv">
            <>
                <ToastContainer />
                {
                    <form onSubmit={(e) => formik.handleSubmit(e)} className="signUpForm">
                            <img className='signUpHideImage' width={'60px'} height={'60px'} src={blueImgSrc} />                    
                        <div className='signUpDiv signUpChildDiv'>
                            <h1 style={{ width: '100%', textAlign: 'start', padding: '0 5px'}}>REGISTER</h1>
                            <Input name={'Name'} inputClass={'signUpTextInput'} su={true} formik={formik} 
                            reqCheck={reqCheck} setReqCheck={setReqCheck} setErr={setErr} />
                            <div className='signUpRowDiv signUpSelect signUpTextInput'>
                                <Select
                                className='signUpSelect2'
                                 defaultValue='role'  value={status} 
                                 onChange={(e) => setStatus(e.target.value)}>
                                    {statusArr?.map((item)  => 
                                        <MenuItem value={item} className='signUpOption'>{item}</MenuItem>
                                    )}
                                </Select>
                            </div>
                            <Input name={'Email'} formik={formik} inputClass={'signUpTextInput'} su={true} reqCheck={reqCheck} setReqCheck={setReqCheck} setErr={setErr}
                                err={reqCheck?.exist ? <p className="signUpError">Account already in used</p> :
                                    reqCheck.invEmail ? <p className="signUpError">Invalid Email!</p> : false}
                            />
                            <Input passBorder={passBorder} setPassBorder={setPassBorder}
                                err={!reqCheck.password && reqCheck.passlength ? <p className="signUpError">Minimum 8 character required!</p> : err && !reqCheck?.exist ? <p className="signUpError">Invalid Email</p> : false}
                                passType={passType} setPassType={setPassType} name={'Password'} inputClass={`signUpTextInput signUpPassInput`} su={true} formik={formik} reqCheck={reqCheck} setReqCheck={setReqCheck} setErr={setErr} />

                            <button disabled={condition} onClick={CreateUser}
                            className={condition ? 'signUpButton signUpBgGray' : 'signUpButton'} type='submit'>
                                {!wait ? 'Create Account' :
                                    <TailSpin height="15" width="15" color="#4fa94d" ariaLabel="tail-spin-loading"
                                        radius="1" wrapperStyle={{}} wrapperClass="" visible={true} />
                                }
                            </button>
                            <p>Already have an account <Link to={'/'}>Sign in</Link></p>
                        </div>
                        <AuthLeftSide />
                    </form>
                }
            </>
        </div>
    )
}
export default SignUp